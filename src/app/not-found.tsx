// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#EDF3FF] p-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 rounded-lg bg-[#0F152B] px-6 py-3 text-white btn-hover"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
