import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // important for 465
  auth: { user: "hello@surgery-abroad.com", pass: "cswpckjcgfemisfg" },
});

try {
  const success = await transporter.verify();
  console.log("✅ SMTP connection successful:", success);
} catch (err) {
  console.error("❌ SMTP test failed:", err);
}
