import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertUserSchema, insertClientRequestSchema } from "@shared/schema";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { sendContactEmail, sendAiSummaryEmail } from "./email";
import bcrypt from "bcryptjs";
import OpenAI from "openai";

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6),
  email: z.string().email(),
  username: z.string().min(2),
  fullName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
  }
  return _openai;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, fullName } = registerSchema.parse(req.body);

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        fullName,
      });

      req.session.userId = user.id;

      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("[Auth] Register error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.userId = user.id;

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("[Auth] Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    });
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      const submission = await storage.createContactSubmission(data);

      sendContactEmail(data).catch((err) =>
        console.error("[Email] Failed to send contact email:", err)
      );

      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/contact", async (_req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/ai-chat", async (req, res) => {
    try {
      const { messages, clientInfo } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages array required" });
      }

      const systemPrompt = `You are a professional sales assistant for WebStudio, a digital agency. Your job is to collect information from potential clients about their project needs. Be friendly, professional, and ask relevant questions.

You need to collect:
1. What type of project they need (website, web app, marketing campaign, etc.)
2. Their business name and industry
3. Target audience
4. Key features or requirements they need
5. Timeline expectations
6. Budget range (if they're comfortable sharing)
7. Any specific design preferences or references

Ask these questions naturally in conversation, one or two at a time. Don't overwhelm the client. When you feel you have enough information, generate a structured summary.

When you have collected enough information, your LAST message should start with "---SUMMARY---" followed by a structured prompt summarizing all the client information in a clear format that the team can use to prepare a proposal. Include all gathered details organized by category.

Keep responses concise and conversational. Respond in the same language the client uses.`;

      const completion = await getOpenAI().chat.completions.create({
        model: "gpt-5-nano",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 1000,
      });

      const reply = completion.choices[0]?.message?.content || "";

      if (reply.includes("---SUMMARY---")) {
        const summary = reply.split("---SUMMARY---")[1].trim();
        sendAiSummaryEmail(summary, clientInfo || {}).catch((err) =>
          console.error("[Email] Failed to send AI summary:", err)
        );
      }

      res.json({ reply });
    } catch (error) {
      console.error("[AI Chat] Error:", error);
      res.status(500).json({ message: "Failed to process AI chat" });
    }
  });

  function requireAuth(req: any, res: any): string | null {
    if (!req.session.userId) {
      res.status(401).json({ message: "Not authenticated" });
      return null;
    }
    return req.session.userId;
  }

  app.get("/api/profile", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const user = await storage.getUser(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      company: user.company,
      avatarUrl: user.avatarUrl,
    });
  });

  app.patch("/api/profile", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    try {
      const profileSchema = z.object({
        fullName: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
      });
      const data = profileSchema.parse(req.body);
      if (data.email) {
        const existingEmail = await storage.getUserByEmail(data.email);
        if (existingEmail && existingEmail.id !== userId) {
          return res.status(409).json({ message: "Email already in use" });
        }
      }
      const user = await storage.updateUser(userId, data);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        company: user.company,
        avatarUrl: user.avatarUrl,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/profile/password", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    try {
      const pwSchema = z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(6),
      });
      const { currentPassword, newPassword } = pwSchema.parse(req.body);
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return res.status(400).json({ message: "Current password is incorrect" });
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(userId, { password: hashedPassword });
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/progress", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const updates = await storage.getProjectUpdates(userId);
    res.json(updates);
  });

  app.get("/api/messages", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const messages = await storage.getProjectMessages(userId);
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    try {
      const msgSchema = z.object({
        message: z.string().min(1),
        projectUpdateId: z.string().optional(),
        attachmentUrl: z.string().optional(),
        attachmentType: z.string().optional(),
      });
      const data = msgSchema.parse(req.body);
      const msg = await storage.createProjectMessage({
        userId,
        message: data.message,
        projectUpdateId: data.projectUpdateId || null,
        senderType: "client",
        attachmentUrl: data.attachmentUrl || null,
        attachmentType: data.attachmentType || null,
      });
      res.status(201).json(msg);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/requests", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const requests = await storage.getClientRequests(userId);
    res.json(requests);
  });

  app.post("/api/requests", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    try {
      const reqSchema = z.object({
        subject: z.string().min(1),
        message: z.string().min(1),
        priority: z.enum(["low", "medium", "high"]).optional(),
      });
      const data = reqSchema.parse(req.body);
      const request = await storage.createClientRequest({
        userId,
        subject: data.subject,
        message: data.message,
        priority: data.priority || "medium",
      });
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/dashboard/overview", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const [updates, requests, messages] = await Promise.all([
      storage.getProjectUpdates(userId),
      storage.getClientRequests(userId),
      storage.getProjectMessages(userId),
    ]);
    res.json({
      projectCount: updates.length,
      requestCount: requests.length,
      messageCount: messages.length,
      openRequests: requests.filter(r => r.status === "open").length,
      latestUpdates: updates.slice(0, 3),
      latestRequests: requests.slice(0, 3),
    });
  });

  return httpServer;
}
