// components/RouteAnalytics.tsx
"use client";

import { useEffect, useRef } from "react";
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
  const lastUrlRef = useRef<string | null>(null);

  // Serialize search params for stable deps
  const search = searchParams?.toString() ?? "";
  const url = search ? `${pathname}?${search}` : pathname || "/";

  useEffect(() => {
    if (!pathname) return;

    // De-dupe
    if (lastUrlRef.current === url) return;
    lastUrlRef.current = url;

    const page_location =
      typeof window !== "undefined" ? window.location.href : undefined;
    const page_title =
      typeof document !== "undefined" ? document.title : undefined;

    // GA4 page_view
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: pathname,
        page_location,
        page_title,
      });
    }

    // Meta Pixel PageView
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [url, pathname, search]); // note: not the searchParams object

  return null;
}
