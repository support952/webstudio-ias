import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { sendContactEmail, sendAiSummaryEmail } from "./email";
import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI();
  }
  return _openai;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
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

  return httpServer;
}
