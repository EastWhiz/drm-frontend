// app/api/unsubscribe/route.ts
import { NextResponse } from "next/server";

const SHEET_URL = process.env.NEXT_PUBLIC_SHEET_WEBAPP_URL!; // same as email logging sheet

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // Helper for rendering simple HTML responses
    const renderHTML = (title: string, message: string) => `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>${title}</title>
          <style>
            body {
              font-family: system-ui, sans-serif;
              text-align: center;
              padding: 3rem;
              background: #f9fafb;
              color: #0f172a;
            }
            h1 { color: #0f152b; }
            p  { margin-top: 1rem; font-size: 1.1rem; }
            a  { color: #0f152b; text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>${message}</p>
          <p style="margin-top:2rem;font-size:0.9rem;color:#64748b;">
            Return to <a href="https://doc-report.com">doc-report.com</a>
          </p>
        </body>
      </html>
    `;

    // Case 1: Missing email → still show nice page
    if (!email) {
      const html = renderHTML(
        "Unsubscribe",
        "We couldn’t identify your email, but you’ve been unsubscribed from future mailings."
      );
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Case 2: Invalid email → same treatment
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const html = renderHTML(
        "Unsubscribe",
        "The email address provided seems invalid, but no further messages will be sent."
      );
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Send to Google Sheet (no need to await a response)
    await fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "unsubscribe",
        email,
        ts: new Date().toISOString(),
      }),
    });

    // Case 3: Normal unsubscribe
    const html = renderHTML(
      "You’ve been unsubscribed",
      `${email} will no longer receive doctor report emails.<br>If this was a mistake, you can subscribe again anytime.`
    );
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    const html = `
      <html><body style="font-family:sans-serif;text-align:center;padding:3rem;">
        <h1>Oops!</h1>
        <p>We couldn’t process your unsubscribe request right now. Please try again later.</p>
      </body></html>`;
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 500,
    });
  }
}
