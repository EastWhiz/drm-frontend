"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/ui/loader/loader";
import {
  extractParamsFromUrl,
  fetchReportData,
  fetchSpecialtyData,
  getSlugFromProfileLink,
} from "@/services/paramsHelper";
import { trackEvent } from "@/lib/analytics";

export default function EmailReportClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorName = searchParams.get("_nme") ?? "Doctor";

  // loader state
  const [showLoader, setShowLoader] = useState(true);
  const [backendReady, setBackendReady] = useState(false);

  // form state
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");

  // params
  const [params, setParams] = useState<ReturnType<typeof extractParamsFromUrl>>({
    _spt: "",
    _spt_slug: "",
    _nme: "",
    _ct: "",
    _st: "",
    _rt: 0,
    slug: "",
    _sr: "",
    lang: "en",
  });

  useEffect(() => {
    setParams(extractParamsFromUrl());
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!params._sr || !params.slug) return;
      try {
        let specialtyResults = await fetchSpecialtyData(params._spt_slug, params._sr);
        if (!specialtyResults.length) {
          specialtyResults = await fetchSpecialtyData("physician", params._sr);
        }
        let identifier = params.slug;
        if (params._sr === "iwgc") {
          const slugFromProfile = getSlugFromProfileLink(params.slug);
          identifier = slugFromProfile || params.slug;
        }
        await fetchReportData(identifier, params._sr);
        setBackendReady(true);
      } catch {
        setBackendReady(true);
      }
    };
    fetchAllData();
  }, [params]);

  const navigateToFullReport = () => {
    const q = new URLSearchParams(window.location.search);
    if (q.has("slug") && q.has("_sr")) {
      router.push(`/fullreport?${q.toString()}`);
    }
  };

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
  const isFormValid = useMemo(() => isValidEmail(email) && isChecked, [email, isChecked]);

  const SHEET_URL = process.env.NEXT_PUBLIC_SHEET_WEBAPP_URL || "";
const [submitting, setSubmitting] = useState(false);
const [honeypot, setHoneypot] = useState(""); // must stay empty

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!isFormValid || submitting) return;
  setSubmitting(true);

  // 1) Fetch a reCAPTCHA v3 token (non-blocking fallback if script isn’t present)
  let recaptchaToken = "";
  try {
    const g = (typeof window !== "undefined" ? (window as any).grecaptcha : null);
    if (SITE_KEY && g) {
      await g.ready();
      recaptchaToken = await g.execute(SITE_KEY, { action: "email_submit" });
    }
  } catch {
    // ignore; we’ll still proceed
  }

  // 2) Track the click/submit (NO PII!)
  trackEvent({
    action: "email_submit",
    category: "lead",
    label: params._sr, // data source (iwgc, etc.)
    params: {
      speciality: params._spt,
      city: params._ct,
      state: params._st,
      consent: isChecked ? "yes" : "no",
    },
  });

  // 3) Build payload (include reCAPTCHA + honeypot if you have it)
  const payload = {
    email,
    consent: isChecked,
    doctorName,
    params,
    extra: {
      ts: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      page: typeof window !== "undefined" ? window.location.href : "",
    },
    honeypot,          // keep if you already collect this in a hidden field
    recaptchaToken,    // <-- NEW
  };

  try {
    // Fire both: sheet + email (don’t await both fully)
    const tasks: Promise<any>[] = [];

    if (SHEET_URL) {
      tasks.push(
        fetch(SHEET_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {})
      );
    }

    tasks.push(
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {})
    );

    // Give them up to ~800ms, then move on regardless
    await Promise.race([
      Promise.allSettled(tasks),
      new Promise((res) => setTimeout(res, 800)),
    ]);
  } finally {
    navigateToFullReport();
  }
};

  if (showLoader) {
    return <Loader ready={backendReady} onComplete={() => setShowLoader(false)} />;
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#EDF3FF] p-6 sm:p-10 lg:p-20">
      <div className="w-full max-w-4xl space-y-8 lg:space-y-10">
        <div className="text-left">
          <h1 className="text-4xl font-bold text-black sm:text-5xl md:text-6xl">It’s Ready!</h1>
          <p className="mt-3 text-lg text-black sm:mt-4 sm:text-xl md:text-2xl">
            The report on <b>{doctorName}</b> has been successfully generated.
          </p>
        </div>

        <div className="space-y-3">
          <form
            className="flex w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-lg sm:flex-row sm:items-stretch sm:gap-4 sm:p-6 md:rounded-3xl"
            autoComplete="on"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="flex-1">
              <label htmlFor="emailInput" className="sr-only">Email address</label>
              <input
                type="email"
                id="emailInput"
                name="email"
                placeholder="Enter your email to get the report for free"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-full w-full py-4 text-lg placeholder-gray-400 focus:outline-none sm:py-5 sm:text-xl md:py-6"
                aria-label="Enter your email address to receive the report"
                autoComplete="email"
                autoCapitalize="off"
                autoCorrect="off"
                inputMode="email"
                required
              />
            </div>
{/* Honeypot (bots often fill every input) */}
<input
  type="text"
  name="company"
  autoComplete="off"
  tabIndex={-1}
  value={honeypot}
  onChange={(e) => setHoneypot(e.target.value)}
  className="hidden"
  aria-hidden="true"
/>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className={`w-full rounded-xl bg-slate-900 px-6 py-4 text-lg font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 sm:w-auto sm:px-8 sm:py-5 md:py-6 md:text-xl ${
                !isFormValid || submitting ? "opacity-50 cursor-not-allowed hover:bg-slate-900" : ""
              }`}
            >
              {submitting ? "Sending…" : "Get Report"}
            </button>
          </form>

          <div className="flex items-center gap-3 text-base text-black px-2">
            <input
              type="checkbox"
              id="gdprConsent"
              name="gdprConsent"
              className="w-5 h-5 accent-slate-900 flex-shrink-0"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              required
              aria-required="true"
            />
            <label htmlFor="gdprConsent" className="leading-snug flex-1">
              <span className="text-red-500 font-bold" aria-hidden="true">*</span>{" "}
              <b>(Required)</b> I agree that my email will be stored and used to contact and
              provide me with the doctor report. <a href="/privacy" target="_blank" className="text-xs">
  <span className="underline">Privacy Policy</span> ›
</a> 
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
