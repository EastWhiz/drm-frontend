// app/api/send-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, doctorName, params, extra, honeypot } = await req.json();

    // Simple bot check (honeypot input must be empty)
    if (honeypot && String(honeypot).trim() !== "") {
      return NextResponse.json({ ok: true }); // silently ignore
    }

    // Basic validation
    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    // Build report URL from params
    const qs = new URLSearchParams({
      slug: params?.slug ?? "",
      _sr: params?._sr ?? "",
      _spt: params?._spt ?? "",
      _ct: params?._ct ?? "",
      _st: params?._st ?? "",
      _nme: params?._nme ?? "",
      _rt: String(params?._rt ?? 0),
    }).toString();

    const base = process.env.APP_BASE_URL || "https://doc-report.com";
    const reportUrl = `${base}/fullreport?${qs}`;

    // Nodemailer (Google Workspace SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:640px;margin:auto;padding:24px;color:#0f172a">
        <h2 style="margin:0 0 12px 0;">Your doctor report is ready</h2>
        <p style="margin:0 0 12px 0;">Doctor: <strong>${doctorName || "Doctor"}</strong></p>
        <p style="margin:0 0 20px 0;">
          View your report:<br/>
          <a href="${reportUrl}" style="color:#0f172a;text-decoration:underline;">${reportUrl}</a>
        </p>
        <a href="${reportUrl}" style="display:inline-block;background:#0f152b;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;">Open report</a>
        <p style="margin-top:28px;font-size:12px;color:#475569;">
          Sent ${new Date().toLocaleString()} • If you didn’t request this, you can ignore this email.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `Doc Report <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your report: ${doctorName || "Doctor"}`,
      html,
      headers: {
        "List-Unsubscribe": `<mailto:${process.env.SMTP_USER}?subject=unsubscribe>`,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("send-email error:", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}