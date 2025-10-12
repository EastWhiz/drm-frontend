// app/api/send-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, doctorName, params, honeypot } = await req.json();

    // Honeypot: silently accept but do nothing if filled
    if (honeypot && String(honeypot).trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    // Build the report URL
    const qs = new URLSearchParams({
      slug: params?.slug ?? "",
      _sr: params?._sr ?? "",
      _spt: params?._spt ?? "",
      _ct: params?._ct ?? "",
      _st: params?._st ?? "",
      _nme: params?._nme ?? "",
      _rt: String(params?._rt ?? 0),
    }).toString();

    const base = (process.env.APP_BASE_URL || "https://doc-report.com").replace(/\/$/, "");
    const reportUrl = `${base}/fullreport?${qs}`;

    // Unsubscribe endpoints (mailto + optional one-click URL)
    const unsubscribeMailto = `mailto:${process.env.SMTP_USER}?subject=unsubscribe`;
    const unsubscribeHttp = `${base}/api/unsubscribe?email=${encodeURIComponent(email)}`;

    // SMTP (Google Workspace)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const preheader = `Your report on ${doctorName || "the doctor"} is ready.`;
    const sentUtc = new Date().toUTCString();

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:640px;margin:auto;padding:24px;color:#0f172a;line-height:1.5;">
        <!-- Preheader (hidden in most clients) -->
        <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${preheader}</span>

        <h2 style="margin:0 0 12px 0;">Your doctor report is ready</h2>
        <p style="margin:0 0 8px 0;">Doctor: <strong>${doctorName || "Doctor"}</strong></p>

        <p style="margin:12px 0 18px 0;">
          View your report:<br/>
          <a href="${reportUrl}" style="color:#0f172a;text-decoration:underline;">${reportUrl}</a>
        </p>

        <p style="margin:0 0 24px 0;">
          <a href="${reportUrl}" style="display:inline-block;background:#0f152b;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;">Open report</a>
        </p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />

        <p style="margin:0 0 8px 0;font-size:12px;color:#475569;">
          You’re receiving this because you requested a doctor report on our website.
        </p>
        <p style="margin:0 0 8px 0;font-size:12px;color:#475569;">
          Sent: ${sentUtc}
        </p>
        <p style="margin:0;font-size:12px;color:#475569;">
          Unsubscribe: <a href="https://doc-report.com/unsubscribe?email=${encodeURIComponent(email)}" style="color:#0f172a;">one-click</a> or email <a href="${unsubscribeMailto}" style="color:#0f172a;">unsubscribe</a>.
        </p>
      </div>
    `;

   const text = [
  `Your doctor report is ready.`,
  ``,
  `Doctor: ${doctorName || "Doctor"}`,
  ``,
  `View your report: ${reportUrl}`,
  ``,
  `You’re receiving this because you requested a doctor report on our website.`,
  `Sent: ${sentUtc}`,
  ``,
  `To unsubscribe, visit: https://doc-report.com/unsubscribe?email=${encodeURIComponent(email)}`,
  `or email "unsubscribe" to ${process.env.SMTP_USER}`,
].join("\n");

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `Doc Report <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your report is ready: ${doctorName || "Doctor"}`,
      html,
      text, // plain-text part improves deliverability
      headers: {
  // One-click unsubscribe: many providers auto-honor these
  "List-Unsubscribe": `<https://doc-report.com/unsubscribe?email=${encodeURIComponent(email)}>, <mailto:${process.env.SMTP_USER}?subject=unsubscribe>`,
  "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
},
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("send-email error:", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
