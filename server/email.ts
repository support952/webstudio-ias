import nodemailer from "nodemailer";

const RECIPIENT_EMAIL = "support@webstudio-ias.com";

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
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
}) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log("[Email] SMTP not configured. Contact submission:", JSON.stringify(data));
    return false;
  }

  await transporter.sendMail({
    from: `"WebStudio Contact" <${process.env.SMTP_USER}>`,
    to: RECIPIENT_EMAIL,
    subject: `New Contact: ${data.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
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
    console.log("[Email] SMTP not configured. AI Summary:", summary);
    return false;
  }

  await transporter.sendMail({
    from: `"WebStudio AI Agent" <${process.env.SMTP_USER}>`,
    to: RECIPIENT_EMAIL,
    subject: `AI Agent Summary - ${clientInfo.name || "Client"}`,
    html: `
      <h2>AI Agent Client Summary</h2>
      ${clientInfo.name ? `<p><strong>Client Name:</strong> ${clientInfo.name}</p>` : ""}
      ${clientInfo.email ? `<p><strong>Client Email:</strong> ${clientInfo.email}</p>` : ""}
      <hr/>
      <h3>Generated Prompt / Summary:</h3>
      <pre style="white-space: pre-wrap; font-family: sans-serif;">${summary}</pre>
    `,
  });
  return true;
}
