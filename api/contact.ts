import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

const RECIPIENT = (process.env.CONTACT_EMAIL || "support@webstudio-ias.com").trim();

const SERVICE_LABELS: Record<string, string> = {
  websites: "Websites",
  digital_business_card: "Digital Business Card",
  marketing_ppc: "Marketing campaigns (PPC)",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { name, email, subject, message, service, questionnaireAnswers } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const serviceLabel = SERVICE_LABELS[service] || service || "General";

    // Build questionnaire section
    let questionnaireHtml = "";
    if (questionnaireAnswers) {
      const answers = typeof questionnaireAnswers === "string"
        ? JSON.parse(questionnaireAnswers)
        : questionnaireAnswers;
      const entries = Object.entries(answers).filter(
        ([k, v]) => k !== "_attachments" && v != null && String(v).trim() !== ""
      );
      if (entries.length > 0) {
        questionnaireHtml = `
          <h3>Questionnaire Answers</h3>
          <ul>${entries.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(String(v))}</li>`).join("")}</ul>
        `;
      }
    }

    // Send email
    const emailSent = await sendEmail({
      to: RECIPIENT,
      subject: `New Lead: ${subject || serviceLabel} [${serviceLabel}]`,
      html: `
        <h2>New Lead</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Service:</strong> ${esc(serviceLabel)}</p>
        <p><strong>Subject:</strong> ${esc(subject || "")}</p>
        <p><strong>Message:</strong></p>
        <p>${esc(message || "")}</p>
        ${questionnaireHtml}
      `,
    });

    return res.status(201).json({
      id: crypto.randomUUID(),
      name,
      email,
      subject,
      message,
      service,
      emailSent,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[contact]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

function esc(s: string) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function sendEmail(opts: { to: string; subject: string; html: string }): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);

  if (!host || !user || !pass) {
    console.warn("[Email] SMTP not configured");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"WebStudio Contact" <${user}>`,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });

  return true;
}
