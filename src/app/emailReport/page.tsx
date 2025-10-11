import { Suspense } from "react";
import EmailReportClient from "./client";

// prevent static prerender so the Suspense boundary can hydrate properly
export const dynamic = "force-dynamic";

function Fallback() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#EDF3FF] p-6">
      <div className="text-slate-700">Loading…</div>
    </section>
  );
}

export default function EmailReportPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <EmailReportClient />
    </Suspense>
  );
}
