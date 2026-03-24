import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertUserSchema, insertClientRequestSchema, insertProjectUpdateSchema } from "@shared/schema";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { sendContactEmail, sendAiSummaryEmail } from "./email";
import bcrypt from "bcryptjs";
import OpenAI from "openai";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Shared password policy for registration and password changes
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d).+$/,
    "Password must include at least one letter and one number",
  );

async function seedAdmin() {
  try {
    if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.warn(
        "[Admin] Skipping admin seeding: ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD must all be set.",
      );
      return;
    }

    const existing = await storage.getUserByEmail(ADMIN_EMAIL);
    if (!existing) {
      const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await storage.createUser({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: hashed,
        fullName: "WebStudio Admin",
      });
      const admin = await storage.getUserByEmail(ADMIN_EMAIL);
      if (admin) {
        await storage.updateUser(admin.id, { role: "admin" });
      }
      console.log("[Admin] Admin user seeded successfully");
    }
  } catch (err) {
    console.error("[Admin] Failed to seed admin:", err);
  }
}

const registerSchema = insertUserSchema.extend({
  password: passwordSchema,
  email: z.string().email(),
  username: z.string().min(2),
  fullName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function getOpenAIApiKey(): string {
  const raw =
    process.env.OPENAI_API_KEY ||
    process.env.AI_INTEGRATIONS_OPENAI_API_KEY ||
    "";
  return raw.replace(/\r\n|\r|\n/g, "").trim();
}

function getOpenAI(): OpenAI {
  const apiKey = getOpenAIApiKey();
  const baseURL = (
    process.env.OPENAI_BASE_URL ||
    process.env.AI_INTEGRATIONS_OPENAI_BASE_URL ||
    ""
  ).trim();
  return new OpenAI({
    apiKey: apiKey || "not-set",
    ...(baseURL && { baseURL }),
  });
}

function hasOpenAIKey(): boolean {
  return getOpenAIApiKey().length > 0;
}

// In-memory rate limiting (per IP)
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;
const loginAttempts = new Map<string, { count: number; since: number }>();

const API_WINDOW_MS = 15 * 60 * 1000;
const API_MAX_CONTACT = 5;       // contact form: 5 per 15 min
const API_MAX_REGISTER = 5;      // registration: 5 per 15 min
const API_MAX_AI_CHAT = 30;      // AI chat: 30 per 15 min
const apiAttempts = new Map<string, Map<string, { count: number; since: number }>>();

// Cleanup stale rate-limit entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  loginAttempts.forEach((entry, ip) => {
    if (now - entry.since > LOGIN_WINDOW_MS) loginAttempts.delete(ip);
  });
  apiAttempts.forEach((endpoints, ip) => {
    endpoints.forEach((entry, ep) => {
      if (now - entry.since > API_WINDOW_MS) endpoints.delete(ep);
    });
    if (endpoints.size === 0) apiAttempts.delete(ip);
  });
}, 30 * 60 * 1000);

function getClientIp(req: any): string {
  const xfwd = req.headers?.["x-forwarded-for"];
  if (typeof xfwd === "string" && xfwd.length > 0) {
    return xfwd.split(",")[0]!.trim();
  }
  if (Array.isArray(xfwd) && xfwd.length > 0) {
    return String(xfwd[0]).split(",")[0]!.trim();
  }
  return req.ip || req.connection?.remoteAddress || "unknown";
}

function rateLimit(endpoint: string, maxAttempts: number) {
  return (req: any, res: any, next: any) => {
    const ip = getClientIp(req);
    const now = Date.now();
    if (!apiAttempts.has(ip)) apiAttempts.set(ip, new Map());
    const ipMap = apiAttempts.get(ip)!;
    const existing = ipMap.get(endpoint) || { count: 0, since: now };
    if (now - existing.since > API_WINDOW_MS) {
      existing.count = 0;
      existing.since = now;
    }
    existing.count += 1;
    ipMap.set(endpoint, existing);
    if (existing.count > maxAttempts) {
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    }
    next();
  };
}

function rateLimitLogin(req: any, res: any, next: any) {
  const ip = getClientIp(req);
  const now = Date.now();
  const existing = loginAttempts.get(ip) || { count: 0, since: now };

  // Reset window if expired
  if (now - existing.since > LOGIN_WINDOW_MS) {
    existing.count = 0;
    existing.since = now;
  }

  existing.count += 1;
  loginAttempts.set(ip, existing);

  if (existing.count > LOGIN_MAX_ATTEMPTS) {
    return res
      .status(429)
      .json({ message: "Too many login attempts. Please try again later." });
  }

  next();
}

const SITE_URL = "https://webstudio-ias.com";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain");
    res.send(
      "User-agent: *\nAllow: /\nSitemap: " + SITE_URL + "/sitemap.xml"
    );
  });

  app.get("/sitemap.xml", (_req, res) => {
    const publicPaths = [
      "",
      "/services",
      "/pricing",
      "/contact",
      "/about",
      "/work",
      "/login",
      "/register",
      "/forgot-password",
      "/sitemap",
      "/marketing",
      "/products",
      "/coming-soon",
      "/privacy-policy",
      "/terms-of-service",
      "/cookie-policy",
    ];
    const urls = publicPaths
      .map(
        (p) =>
          `  <url><loc>${SITE_URL}${p || "/"}</loc><changefreq>weekly</changefreq><priority>${p === "" ? "1.0" : "0.8"}</priority></url>`
      )
      .join("\n");
    res.type("application/xml");
    res.send(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls +
        "\n</urlset>"
    );
  });

  app.post("/api/auth/register", rateLimit("register", API_MAX_REGISTER), async (req, res) => {
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
        role: user.role,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("[Auth] Register error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", rateLimitLogin, async (req, res) => {
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
        role: user.role,
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
      role: user.role,
    });
  });

  app.post("/api/contact", rateLimit("contact", API_MAX_CONTACT), async (req, res) => {
    try {
      const body = req.body as Record<string, unknown>;
      const questionnaireAnswers =
        body.questionnaireAnswers != null
          ? typeof body.questionnaireAnswers === "string"
            ? body.questionnaireAnswers
            : JSON.stringify(body.questionnaireAnswers)
          : undefined;
      const chatTranscript =
        body.chatTranscript != null
          ? typeof body.chatTranscript === "string"
            ? body.chatTranscript
            : JSON.stringify(body.chatTranscript)
          : undefined;
      const data = insertContactSchema.parse({
        ...body,
        questionnaireAnswers,
        chatTranscript,
      });
      const submission = await storage.createContactSubmission(data);

      // Send email for every contact (with or without questionnaire)
      const emailSent = await sendContactEmail({ ...data, service: data.service ?? undefined }).catch((err) => {
        console.error("[Email] Failed to send contact email:", err);
        return false;
      });

      res.status(201).json({ ...submission, emailSent });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/contact", async (req, res) => {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/ai-chat", rateLimit("ai-chat", API_MAX_AI_CHAT), async (req, res) => {
    try {
      const { messages, clientInfo, questionnaireContext, productType, liveChat, preferredLanguage } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages array required" });
      }

      const productTypeLabel =
        productType === "digital_business_card"
          ? "Digital Business Card (כרטיס ביקור דיגיטלי)"
          : productType === "marketing_ppc"
            ? "Marketing campaigns (PPC)"
            : "Websites (אתרים)";

      if (!hasOpenAIKey()) {
        console.error("[AI Chat] OPENAI_API_KEY is missing or empty. Set it in .env and restart the server.");
        return res.status(503).json({
          message: "Chat is temporarily unavailable. You can click 'Finish and send' to submit your request.",
        });
      }

      const model =
        process.env.OPENAI_MODEL ||
        process.env.AI_INTEGRATIONS_OPENAI_MODEL ||
        "gpt-4o-mini";
      const baseURL = (
        process.env.OPENAI_BASE_URL ||
        process.env.AI_INTEGRATIONS_OPENAI_BASE_URL ||
        ""
      ).trim();
      if (process.env.NODE_ENV !== "production") {
        console.log("[AI Chat] Model:", model, "| Base URL:", baseURL || "(default api.openai.com)");
      }

      let systemPrompt: string;
      type ContentPart = { type: "text"; text: string } | { type: "image_url"; image_url: { url: string } };
      let chatMessages: Array<{ role: "system" | "user" | "assistant"; content: string | ContentPart[] }>;

      const normalizeContent = (raw: unknown): string | ContentPart[] => {
        if (typeof raw === "string") return raw;
        if (Array.isArray(raw)) {
          const parts: ContentPart[] = [];
          for (const p of raw) {
            if (p && typeof p === "object") {
              if (p.type === "text" && typeof p.text === "string") parts.push({ type: "text", text: p.text });
              else if (p.type === "image_url" && p.image_url?.url) parts.push({ type: "image_url", image_url: { url: String(p.image_url.url) } });
            }
          }
          if (parts.length === 0) return "";
          if (parts.length === 1 && parts[0].type === "text") return parts[0].text;
          return parts;
        }
        return String(raw ?? "");
      };

      const MAX_CHAT_MESSAGES = 20;

      const normalizeMessages = (msgs: unknown[]): Array<{ role: "user" | "assistant"; content: string | ContentPart[] }> =>
        msgs.slice(-MAX_CHAT_MESSAGES).map((m: any) => ({
          role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: normalizeContent(m.content),
        }));

      const langHint =
        typeof preferredLanguage === "string" && preferredLanguage.length > 0
          ? ` The user's interface may be in: ${preferredLanguage}. Prefer responding in that language when the user writes in it.`
          : "";

      if (liveChat) {
        systemPrompt = `You are WebStudio's friendly live chat assistant. WebStudio is a digital agency offering: custom web development (websites, e-commerce, landing pages), digital business cards, and marketing campaigns (PPC, SEO, social). We have Starter, Pro, and Enterprise plans.

Your role: answer questions about our services, pricing, timelines, technologies (e.g. React, Node.js), support, and process. Be helpful, concise, and professional. Keep replies short (2–5 sentences) unless the user asks for more detail.

CRITICAL: Always respond in the same language the user writes in. If they write in Hebrew, reply in Hebrew. If they write in English, Spanish, French, or any other language, reply in that language. Do not translate the user's message—answer in their language.${langHint}`;
        chatMessages = [{ role: "system", content: systemPrompt }, ...normalizeMessages(messages)];
      } else if (questionnaireContext && typeof questionnaireContext === "object" && Object.keys(questionnaireContext).length > 0) {
        const contextLines = Object.entries(questionnaireContext)
          .filter(([, v]) => v != null && String(v).trim() !== "")
          .map(([k, v]) => `  ${k}: ${String(v)}`)
          .join("\n");
        systemPrompt = `You are a professional sales assistant for WebStudio, a digital agency. The client has already filled a requirements questionnaire. They chose: ${productTypeLabel}. Your job is to continue the conversation about the website, landing page, or digital business card they want to build.

IMPORTANT: Ask only ONE question per message. Keep your reply very short (1–3 sentences). Do not list multiple points, suggestions, or numbered items. Wait for the client's answer, then ask the next single question. Be conversational and brief.

Questionnaire answers:
${contextLines}

When you have collected enough information, your LAST message should start with "---SUMMARY---" followed by a structured prompt summarizing the full project (questionnaire + conversation) for the team. Until then, ask only one question at a time. Respond in the same language the client uses.`;
        const msgs = messages.length > 0
          ? messages
          : [{ role: "user" as const, content: "I've completed the questionnaire. Let's continue the conversation about my project." }];
        chatMessages = [{ role: "system", content: systemPrompt }, ...normalizeMessages(msgs)];
      } else {
        systemPrompt = `You are a professional sales assistant for WebStudio, a digital agency. Your job is to collect information from potential clients about their project needs.

IMPORTANT: Ask only ONE question per message. Keep your reply very short (1–3 sentences). Do not list multiple points, suggestions, or numbered items. Wait for the client's answer, then ask the next single question. Be conversational and brief.

You need to collect (one at a time): type of project, business name, target audience, key features, timeline, budget if they share it, design preferences. When you have enough information, your LAST message should start with "---SUMMARY---" followed by a structured prompt summarizing all the client information for the team. Until then, ask only one question at a time. Respond in the same language the client uses.`;
        chatMessages = [{ role: "system", content: systemPrompt }, ...normalizeMessages(messages)];
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("[AI Chat] Calling OpenAI API, messages count:", chatMessages.length);
      }
      const completion = await getOpenAI().chat.completions.create({
        model,
        messages: chatMessages as any,
        max_tokens: 1000,
      });

      const reply = completion.choices[0]?.message?.content || "";

      if (process.env.NODE_ENV !== "production") {
        console.log("[AI Chat] OpenAI response OK, reply length:", reply.length);
      }

      if (!liveChat && reply.includes("---SUMMARY---")) {
        const summary = reply.split("---SUMMARY---")[1]?.trim() ?? "";
        if (summary) {
          sendAiSummaryEmail(summary, clientInfo || {}).catch((err) =>
            console.error("[Email] Failed to send AI summary:", err)
          );
        }
      }

      res.json({ reply });
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "message" in error
          ? String((error as { message: unknown }).message)
          : "Unknown error";
      console.error("[AI Chat] Error:", msg, error);
      res.status(500).json({
        message: "Chat is temporarily unavailable. You can click 'Finish and send' to submit your request.",
      });
    }
  });

  function requireAuth(req: any, res: any): string | null {
    if (!req.session.userId) {
      res.status(401).json({ message: "Not authenticated" });
      return null;
    }
    return req.session.userId;
  }

  async function requireAdmin(req: any, res: any): Promise<string | null> {
    if (!req.session.userId) {
      res.status(401).json({ message: "Not authenticated" });
      return null;
    }
    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== "admin") {
      res.status(403).json({ message: "Access denied" });
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
        newPassword: passwordSchema,
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
      if (data.projectUpdateId) {
        const project = await storage.getProjectUpdate(data.projectUpdateId);
        if (!project || project.userId !== userId) {
          return res.status(403).json({ message: "Forbidden" });
        }
      }
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
    const user = await storage.getUser(userId);
    if (user?.role === "admin") {
      const allRequests = await storage.getAllClientRequests();
      const allUsers = await storage.getAllUsers();
      const userMap = new Map(allUsers.map(u => [u.id, { fullName: u.fullName, email: u.email }]));
      const enriched = allRequests.map(r => ({
        ...r,
        userName: userMap.get(r.userId)?.fullName || "Unknown",
        userEmail: userMap.get(r.userId)?.email || "",
      }));
      return res.json(enriched);
    }
    const requests = await storage.getClientRequests(userId);
    res.json(requests);
  });

  app.get("/api/requests/:id", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const request = await storage.getClientRequest(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    const user = await storage.getUser(userId);
    if (user?.role !== "admin" && request.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(request);
  });

  app.delete("/api/requests/:id", async (req, res) => {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const request = await storage.getClientRequest(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await storage.deleteClientRequest(req.params.id);
    res.json({ success: true });
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

  // ─── Admin API Routes ───

  app.post("/api/admin/login", rateLimitLogin, async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user || user.role !== "admin") {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.userId = user.id;
      res.json({ id: user.id, fullName: user.fullName, role: user.role });
    } catch (error) {
      console.error("[Admin] Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/me", async (req, res) => {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;
    const user = await storage.getUser(adminId);
    if (!user) return res.status(401).json({ message: "Not found" });
    res.json({ id: user.id, fullName: user.fullName, role: user.role });
  });

  app.get("/api/admin/overview", async (req, res) => {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;
    const [allUsers, allContacts, allRequests, allMessages] = await Promise.all([
      storage.getAllUsers(),
      storage.getContactSubmissions(),
      storage.getAllClientRequests(),
      storage.getAllProjectMessages(),
    ]);
    const clients = allUsers.filter(u => u.role !== "admin");
    res.json({
      totalClients: clients.length,
      totalContacts: allContacts.length,
      totalRequests: allRequests.length,
      totalMessages: allMessages.length,
      openRequests: allRequests.filter(r => r.status === "open").length,
      recentClients: clients.slice(0, 5).map(c => ({
        id: c.id, username: c.username, email: c.email, fullName: c.fullName,
        phone: c.phone, company: c.company, createdAt: c.createdAt,
      })),
      recentContacts: allContacts.slice(0, 5),
      recentRequests: allRequests.slice(0, 5),
    });
  });

  app.get("/api/admin/clients", async (req, res) => {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;
    const allUsers = await storage.getAllUsers();
    const clients = allUsers.filter(u => u.role !== "admin").map(c => ({
      id: c.id, username: c.username, email: c.email, fullName: c.fullName,
      phone: c.phone, company: c.company, createdAt: c.createdAt,
    }));
    res.json(clients);
  });

  app.get("/api/admin/clients/:clientId", async (req, res) => {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;
    const clientId = req.params.clientId;
    const client = await storage.getUser(clientId);
    if (!client || client.role === "admin") {
      return res.status(404).json({ message: "Client not found" });
    }
    const [updates, messages, requests] = await Promise.all([
      storage.getProjectUpdates(clientId),
      storage.getProjectMessages(clientId),
      storage.getClientRequests(clientId),
    ]);
    res.json({
      client: {
        id: client.id, username: client.username, email: client.email,
        fullName: client.fullName, phone: client.phone, company: client.company,
        createdAt: client.createdAt,
      },
      updates,
      messages,
      requests,
    });
  });

  app.get("/api/admin/contacts", async (req, res) => {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;
    const contacts = await storage.getContactSubmissions();
    res.json(contacts);
  });

  app.get("/api/admin/requests", async (req, res) => {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;
    const requests = await storage.getAllClientRequests();
    res.json(requests);
  });

  app.patch("/api/admin/requests/:id", async (req, res) => {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;
    try {
      const { status } = z.object({ status: z.enum(["open", "in_progress", "resolved", "closed"]) }).parse(req.body);
      const updated = await storage.updateClientRequestStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ message: "Request not found" });
      res.json(updated);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ message: fromZodError(error).message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/admin/requests/:id", async (req, res) => {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;
    const request = await storage.getClientRequest(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    await storage.deleteClientRequest(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/admin/messages", async (req, res) => {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;
    const messages = await storage.getAllProjectMessages();
    res.json(messages);
  });

  app.post("/api/admin/messages", async (req, res) => {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;
    try {
      const msgSchema = z.object({
        userId: z.string().min(1),
        message: z.string().min(1),
        projectUpdateId: z.string().optional(),
      });
      const data = msgSchema.parse(req.body);
      const msg = await storage.createProjectMessage({
        userId: data.userId,
        message: data.message,
        projectUpdateId: data.projectUpdateId || null,
        senderType: "admin",
        attachmentUrl: null,
        attachmentType: null,
      });
      res.status(201).json(msg);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ message: fromZodError(error).message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/projects", async (req, res) => {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;
    try {
      const projSchema = z.object({
        userId: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        status: z.enum(["pending", "in_progress", "review", "completed"]).optional(),
        progressPercent: z.number().min(0).max(100).optional(),
      });
      const data = projSchema.parse(req.body);
      const update = await storage.createProjectUpdate({
        userId: data.userId,
        title: data.title,
        description: data.description,
        status: data.status || "pending",
        progressPercent: data.progressPercent || 0,
      });
      res.status(201).json(update);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ message: fromZodError(error).message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/admin/projects/:id", async (req, res) => {
    const adminId = await requireAdmin(req, res);
    if (!adminId) return;
    try {
      const updateSchema = z.object({
        status: z.enum(["pending", "in_progress", "review", "completed"]).optional(),
        progressPercent: z.number().min(0).max(100).optional(),
      });
      const data = updateSchema.parse(req.body);
      const updated = await storage.updateProjectUpdateStatus(req.params.id, data);
      if (!updated) return res.status(404).json({ message: "Project not found" });
      res.json(updated);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ message: fromZodError(error).message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed admin on startup
  await seedAdmin();

  return httpServer;
}
