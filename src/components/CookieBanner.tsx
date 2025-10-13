"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[480px] bg-white text-slate-900 shadow-lg rounded-xl p-4 z-50 border border-slate-200">
      <p className="text-sm leading-snug">
        We use cookies to improve your experience, analyze site traffic, and serve relevant content.{" "}
        <a href="/privacy" className="underline text-slate-700">
          Learn more
        </a>.
      </p>

      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={decline}
          className="px-3 py-1.5 text-sm rounded-md border border-slate-300 hover:bg-slate-100"
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="px-3 py-1.5 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
