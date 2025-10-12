"use client";
import React, { useEffect, useRef, useState } from "react";

/**
 * Smooth, standalone spinner that visually matches the full Loader spinner.
 * Supports optional `ready` and `onComplete` props for smooth fade-out handling.
 */
export default function Spinner({
  statusUrl,
  ready = false,
  onComplete,
  size = 96,
  className = "",
  title = "Loading…",
  showTitle = false,
}: {
  statusUrl?: string;
  ready?: boolean;
  onComplete?: () => void;
  size?: number;
  className?: string;
  title?: string;
  showTitle?: boolean;
}) {
  const [percent, setPercent] = useState<number | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [finished, setFinished] = useState(false);
  const suppressedMotion = usePrefersReducedMotion();

  // --- Live status via SSE ---
  useEffect(() => {
    if (!statusUrl) return;

    let closed = false;
    let es: EventSource | null = null;

    try {
      es = new EventSource(statusUrl);
      es.onmessage = (e) => {
        if (closed) return;
        try {
          const data = JSON.parse(e.data || "{}");
          if (typeof data.percent === "number") {
            setPercent(Math.max(0, Math.min(100, data.percent)));
          }
          if (data.done === true || data.percent >= 100) {
            setFinishing(true);
          }
        } catch {}
      };
      es.onerror = () => es?.close();
    } catch {}

    return () => {
      closed = true;
      es?.close();
    };
  }, [statusUrl]);

  // --- External ready flag ---
  useEffect(() => {
    if (ready) setFinishing(true);
  }, [ready]);

  // --- Smooth finish sequence ---
  useEffect(() => {
    if (!finishing || finished) return;

    const int = setInterval(() => {
      setPercent((p) => {
        const current = p ?? 80;
        return current < 100 ? Math.min(100, current + 10) : current;
      });
    }, 100);

    const end = setTimeout(() => {
      clearInterval(int);
      setFinished(true);
      onComplete?.();
    }, 400);

    return () => {
      clearInterval(int);
      clearTimeout(end);
    };
  }, [finishing, finished, onComplete]);

  const spinClass = suppressedMotion ? "" : "animate-spin";

  return (
    <div
      role="status"
      aria-busy={!finished}
      aria-label={title}
      className="inline-flex flex-col items-center justify-center"
    >
      <div
        className={`rounded-full border-8 mt-10 border-slate-200 border-t-[#9fd6fb] ${spinClass} ${className}`}
        style={{ width: size, height: size }}
      />
      {showTitle && (
        <div className="mt-3 text-base text-slate-600">{title}</div>
      )}
      <span className="sr-only">{title}</span>
    </div>
  );
}

/* ---------- Doctor skeletons (unchanged) ---------- */

export function DoctorCardSkeleton() {
  return (
    <div className="bg-[#ADD8FF] rounded-3xl shadow-md p-4 lg:p-6">
      <div className="h-6 w-3/4 bg-white/60 rounded mb-3 animate-pulse" />
      <div className="h-4 w-1/2 bg-white/50 rounded mb-2 animate-pulse" />
      <div className="h-3 w-1/3 bg-white/40 rounded mb-4 animate-pulse" />
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="h-16 bg-white/70 rounded-lg animate-pulse" />
        <div className="h-16 bg-white/70 rounded-lg animate-pulse" />
        <div className="h-16 bg-white/70 rounded-lg animate-pulse" />
      </div>
      <div className="h-10 bg-[#14183E]/70 rounded-lg animate-pulse" />
    </div>
  );
}

export function DoctorGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <DoctorCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ---------- Helpers ---------- */

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  const mql = useRef<MediaQueryList | null>(null);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    mql.current = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(!!mql.current?.matches);
    update();
    mql.current.addEventListener?.("change", update);
    return () => mql.current?.removeEventListener?.("change", update);
  }, []);
  return prefers;
}
