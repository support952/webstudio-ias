import nodemailer from "nodemailer";

/** Email that receives contact form and AI summary. Set CONTACT_EMAIL in .env */
const RECIPIENT_EMAIL =
  (process.env.CONTACT_EMAIL && process.env.CONTACT_EMAIL.trim()) || "support@webstudio-ias.com";

const SERVICE_LABELS: Record<string, string> = {
  websites: "Websites",
  digital_business_card: "Digital Business Card",
  marketing_ppc: "Marketing campaigns (PPC)",
  // legacy (old submissions)
  web_design: "Web Design",
  web_development: "Web Development",
  branding: "Branding",
  seo: "SEO & Marketing",
  maintenance: "Maintenance & Support",
  other: "Other",
};

function escHtml(s: string): string {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function serviceDisplay(service?: string | null): string {
  if (!service) return "";
  return SERVICE_LABELS[service] || service;
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  service?: string;
  questionnaireAnswers?: string | null;
  chatTranscript?: string | null;
}): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn(
      "[Email] SMTP not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS in .env). Contact saved but not emailed:",
      data.email
    );
    return false;
  }

  const esc = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const serviceLabel = data.service ? serviceDisplay(data.service) : "";

  let questionnaireSection = "";
  let questionnaireEntries: [string, string][] = [];
  let chatSection = "";

  if (data.questionnaireAnswers) {
    try {
      const answers = typeof data.questionnaireAnswers === "string"
        ? (JSON.parse(data.questionnaireAnswers) as Record<string, unknown>)
        : data.questionnaireAnswers;
      const attachmentsRaw = answers._attachments;
      const attachmentList = Array.isArray(attachmentsRaw)
        ? (attachmentsRaw as Array<{ name?: string; type?: string; base64?: string }>).filter(
            (a) => a && typeof a.base64 === "string"
          )
        : [];
      questionnaireEntries = (
        Object.entries(answers).filter(
          ([k, v]) => k !== "_attachments" && v != null && String(v).trim() !== ""
        ) as [string, string][]
      );
      if (attachmentList.length > 0) {
        questionnaireSection += `
      <h3>קבצים מצורפים (שאלון)</h3>
      <ul>
        ${attachmentList.map((a) => `<li>${esc(a.name || "file")}</li>`).join("")}
      </ul>`;
      }
      if (questionnaireEntries.length > 0) {
        questionnaireSection = (questionnaireSection || "") + `
      <h3>שאלון (שלב 2) – שאלות רלוונטיות לבניית האתר</h3>
      <ul>
        ${questionnaireEntries.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(String(v))}</li>`).join("")}
      </ul>`;
      }
    } catch {
      questionnaireSection = `<p><strong>Questionnaire (raw):</strong> ${esc(String(data.questionnaireAnswers))}</p>`;
    }
  }

  if (data.chatTranscript) {
    try {
      const messages = typeof data.chatTranscript === "string"
        ? (JSON.parse(data.chatTranscript) as Array<{ role?: string; content?: string }>)
        : data.chatTranscript;
      if (Array.isArray(messages) && messages.length > 0) {
        chatSection = `
      <h3>שיחת סוכן AI (שלב 3)</h3>
      <div style="background: #111; padding: 1rem; border-radius: 6px; border: 1px solid #333;">
        ${messages.map((m) => {
          const text = esc(String(m.content ?? ""));
          const hasImage = !!(m as { imageDataUrl?: string }).imageDataUrl;
          return `<p style="margin: 0.5em 0;"><strong>${m.role === "user" ? "לקוח" : "סוכן"}:</strong> ${text}${hasImage ? " [תמונה מצורפת]" : ""}</p>`;
        }).join("")}
      </div>`;
      }
    } catch {
      chatSection = `<p><strong>Chat (raw):</strong> ${esc(String(data.chatTranscript))}</p>`;
    }
  }

  // בלוק פרומפט לאתר בלבד – בלי פרטים אישיים, רק תוכן להעתקה לבניית האתר
  const promptForWebsiteLines: string[] = [];
  promptForWebsiteLines.push(`Requested service: ${serviceLabel || data.service || "—"}`);
  promptForWebsiteLines.push(`Subject: ${data.subject}`);
  promptForWebsiteLines.push("");
  promptForWebsiteLines.push("Message from client:");
  promptForWebsiteLines.push(data.message);
  if (questionnaireEntries.length > 0) {
    promptForWebsiteLines.push("");
    promptForWebsiteLines.push("Questionnaire:");
    questionnaireEntries.forEach(([k, v]) => promptForWebsiteLines.push(`  ${k}: ${String(v)}`));
  }
  if (data.chatTranscript) {
    try {
      const messages = typeof data.chatTranscript === "string"
        ? (JSON.parse(data.chatTranscript) as Array<{ role?: string; content?: string }>)
        : data.chatTranscript;
      if (Array.isArray(messages) && messages.length > 0) {
        promptForWebsiteLines.push("");
        promptForWebsiteLines.push("AI chat:");
        messages.forEach((m) => promptForWebsiteLines.push(`  [${m.role}]: ${String(m.content ?? "")}`));
      }
    } catch {
      // ignore
    }
  }
  const promptForWebsite = promptForWebsiteLines.join("\n");

  // פרומפט מותאם ל-Replit (העתקה ל-Replit)
  const promptReplit = `[Replit] Build a website / web app with the following requirements. Use Replit for hosting and deployment.\n\n${promptForWebsite}`;
  // פרומפט מותאם ל-Cursor (העתקה ל-Cursor)
  const promptCursor = `[Cursor] Build a website / web app with the following requirements. Use the codebase and AI assistant in Cursor.\n\n${promptForWebsite}`;

  const emailAttachments: { filename: string; content: Buffer }[] = [];
  if (data.questionnaireAnswers) {
    try {
      const answers = typeof data.questionnaireAnswers === "string"
        ? (JSON.parse(data.questionnaireAnswers) as Record<string, unknown>)
        : data.questionnaireAnswers;
      const list = Array.isArray(answers._attachments)
        ? (answers._attachments as Array<{ name?: string; base64?: string }>)
        : [];
      for (const a of list) {
        if (!a?.base64) continue;
        const base64Data = String(a.base64).replace(/^data:[^;]+;base64,/, "");
        try {
          emailAttachments.push({
            filename: a.name || "attachment",
            content: Buffer.from(base64Data, "base64"),
          });
        } catch {
          /* skip invalid base64 */
        }
      }
    } catch {
      /* ignore */
    }
  }

  await transporter.sendMail({
    from: `"WebStudio Contact" <${process.env.SMTP_USER}>`,
    to: RECIPIENT_EMAIL,
    subject: `New Contact: ${data.subject} [${serviceLabel || "Inquiry"}]`,
    attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
    html: `
      <h2>פניה חדשה</h2>

      <h3>פרטים אישיים (שלב 1)</h3>
      <p><strong>Name:</strong> ${esc(data.name)}</p>
      <p><strong>Email:</strong> ${esc(data.email)}</p>
      <p><strong>Requested service:</strong> ${esc(serviceLabel || data.service || "—")}</p>
      <p><strong>Subject:</strong> ${esc(data.subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${esc(data.message)}</p>

      ${questionnaireSection}

      ${chatSection}

      <hr/>
      <h3>פרומפטים להעתקה (בלי פרטים אישיים)</h3>
      <p style="color: #666; font-size: 0.9em;">העתק את הבלוק המתאים לסביבה שבה את בונה את האתר.</p>

      <h4 style="margin-top: 1em;">לשימוש ב-Replit</h4>
      <pre style="white-space: pre-wrap; font-family: monospace; background: #1a1a1a; color: #e0e0e0; padding: 1rem; border-radius: 6px; border: 1px solid #333;">${esc(promptReplit)}</pre>

      <h4 style="margin-top: 1em;">לשימוש ב-Cursor</h4>
      <pre style="white-space: pre-wrap; font-family: monospace; background: #1a1a1a; color: #e0e0e0; padding: 1rem; border-radius: 6px; border: 1px solid #333;">${esc(promptCursor)}</pre>
    `,
  });
  return true;
}

export async function sendAiSummaryEmail(summary: string, clientInfo: {
  name?: string;
  email?: string;
}) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("[Email] SMTP not configured. AI Summary not emailed.");
    return false;
  }

  await transporter.sendMail({
    from: `"WebStudio AI Agent" <${process.env.SMTP_USER}>`,
    to: RECIPIENT_EMAIL,
    subject: `AI Agent Summary - ${clientInfo.name || "Client"}`,
    html: `
      <h2>AI Agent Client Summary</h2>
      ${clientInfo.name ? `<p><strong>Client Name:</strong> ${escHtml(clientInfo.name)}</p>` : ""}
      ${clientInfo.email ? `<p><strong>Client Email:</strong> ${escHtml(clientInfo.email)}</p>` : ""}
      <hr/>
      <h3>Generated Prompt / Summary:</h3>
      <pre style="white-space: pre-wrap; font-family: sans-serif;">${escHtml(summary)}</pre>
    `,
  });
  return true;
}
