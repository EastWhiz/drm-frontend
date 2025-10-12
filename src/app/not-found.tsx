// app/not-found.tsx  (no "use client" here)
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-container section-spacing-lg">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you’re looking for doesn’t exist.</p>
      <div className="mt-6">
        <Link href="/" className="btn-hover inline-block rounded-lg bg-[#0F152B] px-6 py-3 text-white">
          Go to homepage
        </Link>
      </div>
    </section>
  );
}
