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

function serviceDisplay(service?: string | null): string {
  if (!service) return "";
  return SERVICE_LABELS[service] || service;
}

/** Inbox subject / summary line for contact funnel stage notifications (Hebrew). */
export function contactStageSummaryHebrew(name: string, stage: string): string {
  const who = name.trim() || "לקוח";
  switch (stage) {
    case "step_1_to_step_2":
      return `${who} סיים שלב 1`;
    case "step_2_to_step_3_ai":
      return `${who} סיים שלב 2`;
    case "step_3_ai_to_completed":
      return `${who} סיים שלב 3`;
    case "step_2_to_completed":
      return `${who} סיים שלב 2 והשלים את הפנייה (ללא צ'אט AI)`;
    default:
      return `${who} — ${stage}`;
  }
}

/** HTML block for AI chat messages (used by full contact email and stage-transition email). */
function formatChatTranscriptHtml(
  esc: (s: string) => string,
  chatTranscript: unknown
): string {
  if (chatTranscript == null || chatTranscript === "") return "";
  try {
    const messages =
      typeof chatTranscript === "string"
        ? (JSON.parse(chatTranscript) as Array<{
            role?: string;
            content?: string;
            imageDataUrl?: string;
          }>)
        : (chatTranscript as Array<{
            role?: string;
            content?: string;
            imageDataUrl?: string;
          }>);
    if (!Array.isArray(messages) || messages.length === 0) return "";
    /** Light box + explicit text colors — many email clients ignore dark-bg/light-text inheritance (black-on-black). */
    const box =
      "background-color:#f4f4f5;color:#111827;border:1px solid #d4d4d8;border-radius:8px;padding:14px;font-size:14px;line-height:1.55;font-family:Arial,Helvetica,sans-serif;";
    const p = "margin:0.55em 0;color:#111827;";
    const lbl = "color:#0f172a;font-weight:700;";
    return `
      <h3 style="color:#1e293b;">שיחת סוכן AI (שלב 3)</h3>
      <div style="${box}">
        ${messages
          .map((m) => {
            const text = esc(String(m.content ?? ""));
            const hasImage = !!m.imageDataUrl;
            const who = m.role === "user" ? "לקוח" : "סוכן";
            return `<p style="${p}"><strong style="${lbl}">${esc(who)}:</strong> ${text}${hasImage ? " [תמונה מצורפת]" : ""}</p>`;
          })
          .join("")}
      </div>`;
  } catch {
    return `<p><strong>Chat (raw):</strong> ${esc(String(chatTranscript))}</p>`;
  }
}

function formatAiSummaryHtml(esc: (s: string) => string, summary: string | null | undefined): string {
  const s = summary?.trim();
  if (!s) return "";
  return `
      <h3 style="color:#1e293b;">סיכום AI מובנה (לצוות)</h3>
      <pre style="white-space: pre-wrap; font-family: Arial, Helvetica, sans-serif; background-color: #f0fdf4; color: #14532d; border: 1px solid #bbf7d0; padding: 1rem; border-radius: 8px; font-size: 14px; line-height: 1.5;">${esc(s)}</pre>`;
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
  /** Structured summary from model after ---SUMMARY--- (not shown in chat UI). */
  aiSummary?: string | null;
}): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn(
      "[Email] SMTP not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS in .env). Contact saved but not emailed:",
      data.email
    );
    return false;
  }

  const esc = (s: string) => String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");
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

  chatSection = formatChatTranscriptHtml(esc, data.chatTranscript);
  const aiSummarySection = formatAiSummaryHtml(esc, data.aiSummary);

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
  if (data.aiSummary?.trim()) {
    promptForWebsiteLines.push("");
    promptForWebsiteLines.push("AI structured summary (for team):");
    promptForWebsiteLines.push(data.aiSummary.trim());
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
      ${aiSummarySection}

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

  const escSummary = (s: string) => String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");
  await transporter.sendMail({
    from: `"WebStudio AI Agent" <${process.env.SMTP_USER}>`,
    to: RECIPIENT_EMAIL,
    subject: `AI Agent Summary - ${clientInfo.name || "Client"}`,
    html: `
      <h2>AI Agent Client Summary</h2>
      ${clientInfo.name ? `<p><strong>Client Name:</strong> ${escSummary(clientInfo.name)}</p>` : ""}
      ${clientInfo.email ? `<p><strong>Client Email:</strong> ${escSummary(clientInfo.email)}</p>` : ""}
      <hr/>
      <h3>Generated Prompt / Summary:</h3>
      <pre style="white-space: pre-wrap; font-family: sans-serif;">${escSummary(summary)}</pre>
    `,
  });
  return true;
}

export async function sendContactStageEmail(data: {
  stage: string;
  name: string;
  email: string;
  subject?: string;
  message?: string;
  service?: string;
  questionnaireAnswers?: string | null;
  chatTranscript?: string | null;
  aiSummary?: string | null;
}): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("[Email] SMTP not configured. Stage update not emailed.");
    return false;
  }

  const esc = (s: string) => String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");
  const serviceLabel = data.service ? serviceDisplay(data.service) : "";

  let questionnaireSection = "";
  if (data.questionnaireAnswers) {
    try {
      const answers = typeof data.questionnaireAnswers === "string"
        ? (JSON.parse(data.questionnaireAnswers) as Record<string, unknown>)
        : data.questionnaireAnswers;
      const entries = Object.entries(answers).filter(
        ([k, v]) => k !== "_attachments" && v != null && String(v).trim() !== ""
      );
      if (entries.length > 0) {
        questionnaireSection = `
          <h3>Questionnaire answers so far</h3>
          <ul>
            ${entries.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(String(v))}</li>`).join("")}
          </ul>
        `;
      }
    } catch {
      questionnaireSection = `<p><strong>Questionnaire (raw):</strong> ${esc(String(data.questionnaireAnswers))}</p>`;
    }
  }

  const chatSection = formatChatTranscriptHtml(esc, data.chatTranscript);
  const aiSummarySection = formatAiSummaryHtml(esc, data.aiSummary);
  const stageSummary = contactStageSummaryHebrew(data.name, data.stage);

  const textLines = [
    stageSummary,
    "",
    `שלב פנימי: ${data.stage}`,
    `שם: ${data.name}`,
    `אימייל: ${data.email}`,
  ];
  if (data.subject) textLines.push(`נושא: ${data.subject}`);
  if (serviceLabel || data.service) textLines.push(`שירות: ${serviceLabel || data.service}`);
  if (data.message) textLines.push(`הודעה: ${data.message}`);
  if (data.chatTranscript) {
    try {
      const msgs =
        typeof data.chatTranscript === "string"
          ? (JSON.parse(data.chatTranscript) as Array<{ role?: string; content?: string }>)
          : (data.chatTranscript as Array<{ role?: string; content?: string }>);
      if (Array.isArray(msgs) && msgs.length > 0) {
        textLines.push("", "שיחת סוכן AI:");
        for (const m of msgs) {
          const who = m.role === "user" ? "לקוח" : "סוכן";
          textLines.push(`  [${who}] ${String(m.content ?? "")}`);
        }
      }
    } catch {
      /* ignore */
    }
  }
  if (data.aiSummary?.trim()) {
    textLines.push("", "סיכום AI מובנה:", data.aiSummary.trim());
  }
  const textBody = textLines.join("\n");

  await transporter.sendMail({
    from: `"WebStudio Stage Update" <${process.env.SMTP_USER}>`,
    to: RECIPIENT_EMAIL,
    subject: stageSummary,
    text: textBody,
    html: `
      <h2>${esc(stageSummary)}</h2>
      <p><strong>שלב (פנימי):</strong> ${esc(data.stage)}</p>
      <p><strong>Name:</strong> ${esc(data.name)}</p>
      <p><strong>Email:</strong> ${esc(data.email)}</p>
      ${data.subject ? `<p><strong>Subject:</strong> ${esc(data.subject)}</p>` : ""}
      ${data.service ? `<p><strong>Service:</strong> ${esc(serviceLabel || data.service)}</p>` : ""}
      ${data.message ? `<p><strong>Message:</strong> ${esc(data.message)}</p>` : ""}
      ${questionnaireSection}
      ${chatSection}
      ${aiSummarySection}
    `,
  });
  return true;
}
