/**
 * Sends a test contact email to verify SMTP and that Replit + Cursor prompt blocks appear.
 * Run: npx tsx script/send-test-contact-email.ts
 */
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const { sendContactEmail } = await import("../server/email.js");

const testData = {
  name: "בדיקה – Test User",
  email: "test@example.com",
  subject: "בדיקת שליחת מייל / Test contact email",
  message: "זו פניה לבדיקה. אני רוצה לראות את שני הפרומפטים (Replit ו-Cursor) במייל.",
  service: "websites" as const,
};

console.log("Sending test contact email to:", process.env.CONTACT_EMAIL || "support@webstudio-ias.com");
console.log("SMTP configured:", !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS));

const ok = await sendContactEmail(testData);
if (ok) {
  console.log("Test email sent successfully. Check your inbox.");
} else {
  console.error("Failed to send (check SMTP in .env).");
  process.exit(1);
}
