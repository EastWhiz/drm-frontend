"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const SHEET_URL = process.env.NEXT_PUBLIC_SHEET_WEBAPP_URL || "";


export default function UnsubscribePage() {
  const sp = useSearchParams();
  const email = (sp.get("email") || "").trim();

  useEffect(() => {
    if (!email || !SHEET_URL) return;

    // Fire-and-forget; don't block rendering.
    const payload = {
      action: "unsubscribe",
      email,
      ts: new Date().toISOString(),
    };

    // Send without waiting; swallow errors.
    fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }, [email]);

  return (
    <><Header />
    <main className="min-h-[60vh] flex items-center justify-center bg-[#F9FAFB] p-8">
        
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-bold text-slate-900">You’ve been unsubscribed</h1>
        <p className="mt-3 text-slate-700">
          {email
            ? `${email} will no longer receive doctor report emails.`
            : "You will no longer receive doctor report emails."}
        </p>
        <p className="mt-6 text-sm text-slate-500">
          If this was a mistake, you can subscribe again on{" "}
          <a className="underline" href="https://doc-report.com">doc-report.com</a>.
        </p>
      </div>
      
    </main><Footer /></>
  );
}
