// app/unsubscribe/page.tsx
import { Suspense } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import UnsubscribeClient from "./unsubscribe-client";

// Force SSR; avoid prerendering error
export const dynamic = "force-dynamic";

export default function UnsubscribePage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <main className="min-h-[60vh] flex items-center justify-center bg-[#F9FAFB] p-8">
            <div className="max-w-xl text-center">
              <h1 className="text-3xl font-bold text-slate-900">Unsubscribing…</h1>
              <p className="mt-3 text-slate-700">Please wait a moment.</p>
            </div>
          </main>
        }
      >
        <UnsubscribeClient />
      </Suspense>
      <Footer />
    </>
  );
}
