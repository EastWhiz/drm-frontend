"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type LoaderProps = {
  statusUrl?: string;
  ready?: boolean;
  steps?: string[];
  timeoutMs?: number;
  onComplete?: () => void;
  onCancel?: () => void;
};

const DEFAULT_STEPS = [
  "Searching the web for sources",
  "Analyzing doctor credentials",
  "Checking clinic accreditations",
  "Scanning patient sentiment",
  "Aggregating reviews",
  "Comparing ratings across platforms",
  "Summarizing key insights",
  "Generating your report",
];

const FINISH_TICK_MS = 110;
const FINISH_HOLD_MS = 400;

const Loader: React.FC<LoaderProps> = ({
  statusUrl,
  ready = false,
  steps = DEFAULT_STEPS,
  timeoutMs = 60000,
  onComplete,
  onCancel,
}) => {
  const router = useRouter();
  const [progressIndex, setProgressIndex] = useState(0);
  const [percent, setPercent] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [tookLong, setTookLong] = useState(false);
  const suppressedMotion = usePrefersReducedMotion();

  const [finishing, setFinishing] = useState(false);
  const [finished, setFinished] = useState(false);

  // 👉 while not finishing, never show the very last step as active
  const LAST_BEFORE_READY = Math.max(0, steps.length - 2); // e.g. stop at step 6 of 0..7
  const MAX_INDEX_WHILE_WAITING = Math.min(steps.length - 1, LAST_BEFORE_READY);

  useEffect(() => {
    const t = setTimeout(() => setTookLong(true), timeoutMs);
    return () => clearTimeout(t);
  }, [timeoutMs]);

  // Live status (SSE)
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

          if (typeof data.stepIndex === "number") {
            setProgressIndex((prev) => {
              const incoming = data.stepIndex;
              const cap = finishing ? steps.length : MAX_INDEX_WHILE_WAITING;
              return Math.max(prev, Math.min(incoming, cap));
            });
          }

          if (typeof data.percent === "number") {
            const p = Math.max(0, Math.min(100, data.percent));
            setPercent(finishing ? p : Math.min(p, 99)); // cap at 99% until finishing
          }

          if (typeof data.message === "string") setMessage(data.message);

          if (data.done === true || data.percent >= 100 || data.stepIndex >= steps.length - 1) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUrl, steps.length, finishing]);

  // Simulated step advance (no live status)
  useEffect(() => {
    if (statusUrl || finishing) return;
    const interval = setInterval(() => {
      setProgressIndex((i) =>
        Math.min(i + 1, MAX_INDEX_WHILE_WAITING) // 👈 stop before last step
      );
    }, 1800);
    return () => clearInterval(interval);
  }, [statusUrl, finishing, steps.length, MAX_INDEX_WHILE_WAITING]);

  // External ready flag
  useEffect(() => {
    if (ready) setFinishing(true);
  }, [ready]);

  // Smooth finish
  useEffect(() => {
    if (!finishing || finished) return;

    const int = setInterval(() => {
      setProgressIndex((i) => (i < steps.length ? i + 1 : i));
      setPercent((p) => {
        const current =
          p ?? Math.round((progressIndex / steps.length) * 100);
        return current < 100 ? Math.min(100, current + 8) : current;
      });

      const idxDone = progressIndex >= steps.length;
      const pctDone =
        (percent ?? Math.round((progressIndex / steps.length) * 100)) >= 100;

      if (idxDone && pctDone) {
        clearInterval(int);
        setTimeout(() => {
          setFinished(true);
          onComplete?.();
        }, FINISH_HOLD_MS);
      }
    }, FINISH_TICK_MS);

    return () => clearInterval(int);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishing, finished, progressIndex, percent, steps.length, onComplete]);

  const computedPercent = useMemo(() => {
    if (percent != null) return percent;
    // Cap at 99% while waiting, 100% only when finishing
    const raw = Math.round(
      (Math.min(progressIndex, steps.length) / steps.length) * 100
    );
    return finishing ? raw : Math.min(raw, 99);
  }, [percent, progressIndex, steps.length, finishing]);

  return (
    <section
      className="flex min-h-screen items-center justify-center bg-[#EDF3FF] p-6 sm:p-10 lg:p-20"
      aria-busy={!finished}
      aria-live="polite"
      role="status"
    >
      <div className="w-full max-w-3xl">
        {/* Spinner + title */}
        <div className="flex flex-col items-center text-center">
          <Spinner suppressed={suppressedMotion} />
          <h1 className="mt-6 text-2xl sm:text-3xl font-semibold text-slate-900">
            Generating your doctor report…
          </h1>
          <p className="mt-2 text-slate-600">
            This usually takes under a minute. You can keep this tab open.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0F152B] transition-[width] duration-400 ease-out"
              style={{ width: `${computedPercent}%` }}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={computedPercent}
              role="progressbar"
            />
          </div>
          <div className="mt-2 flex justify-between text-sm text-slate-600">
            <span>{Math.min(progressIndex, steps.length)}/{steps.length}</span>
            <span>{computedPercent}%</span>
          </div>
        </div>

        {/* Steps */}
        <ol className="mt-8 space-y-3 max-w-xl mx-auto">
          {steps.map((s, i) => {
            const isDone = i < progressIndex;
            const isActive = i === progressIndex && progressIndex < steps.length;
            return (
              <li
                key={i}
                className={`flex items-start gap-3 transition-colors ${
                  isDone ? "text-slate-900" : isActive ? "text-slate-800" : "text-slate-400"
                }`}
              >
                <span className="inline-flex w-6 h-6 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white">
                  {isDone ? (
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <span className="w-2 h-2 rounded-full bg-[#0F152B] animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </span>
                <span className="text-base sm:text-lg leading-snug">
                  {i === progressIndex && message ? message : s}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Took long hint */}
        {tookLong && !finished && (
          <div className="mt-6 rounded-lg bg-white/70 p-4 text-sm text-slate-700">
            Still working… large profiles with many reviews can take a bit longer. Thanks for your patience!
          </div>
        )}

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Refresh hidden for now */}
          <button
            type="button"
            className="btn-hover rounded-lg bg-white px-6 py-3 text-[#0F152B] border border-slate-200"
            onClick={() => (onCancel ? onCancel() : router.back())}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default Loader;

/* ---------- helpers ---------- */

function Spinner({ suppressed }: { suppressed: boolean }) {
  const spinClass = suppressed ? "" : "animate-spin";
  return (
    <div
      className={`rounded-full border-4 sm:border-8 border-slate-200 border-t-[#9fd6fb] ${spinClass}
                  w-12 h-12 sm:w-24 sm:h-24`}
    />
  );
}

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
