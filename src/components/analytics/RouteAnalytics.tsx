// components/RouteAnalytics.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export default function RouteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");

    // GA4 page_view
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", { page_path: url });
    }

    // Meta Pixel PageView
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  return null;
}
