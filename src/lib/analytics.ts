// lib/analytics.ts
export type AnalyticsPayload = {
  action: string;                // required
  category?: string;             // e.g. 'lead', 'report', 'engagement'
  label?: string;                // e.g. doctor name, source
  value?: number;                // optional numeric value
  params?: Record<string, any>;  // extra non-PII context
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

/** Fire a custom event to GA4 and Meta Pixel (no PII). */
export function trackEvent({ action, category, label, value, params }: AnalyticsPayload) {
  if (typeof window === "undefined") return;

  // ---- GA4 ----
  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
      transport_type: "beacon", // non-blocking send on navigation
      ...params,
    });
  }

  // ---- Meta Pixel ----
  if (window.fbq) {
    const pixelParams = { category, label, value, ...params };

    // Guard against PII (just in case)
    if (pixelParams && typeof pixelParams === "object") {
      delete (pixelParams as any).email;
    }

    window.fbq("trackCustom", action, pixelParams);
  }
}

/** Optional convenience helper for doctor card clicks. */
export function trackDoctorClick(doctor: any, source: string) {
  if (!doctor) return;
  trackEvent({
    action: "doctor_card_click",
    category: "engagement",
    label: `${doctor?.name ?? "Unknown"} - ${source}`,
    params: {
      id: doctor?.id ?? doctor?.slug ?? "",
      specialty: doctor?.specialty ?? "",
      city: doctor?.city ?? "",
      state: doctor?.state ?? "",
      rating: doctor?.rating ?? undefined,
      source,
    },
  });
}
