import { Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import { WishlistProvider } from "@/context/WishlistContext";
import Analytics from "@/components/analytics/Analytics";
import RouteAnalytics from "@/components/analytics/RouteAnalytics";
import { Suspense } from "react";

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans", 
});

export const metadata = {
  title: "Doc Report — Trusted Doctor Reviews",
  description:
    "Get an instant report on any doctor or surgeon worldwide. Compare credentials, patient sentiment, and reputation — all in one clear report.",
  keywords: [
    "doctor reviews",
    "best doctors",
    "surgeon ratings",
    "healthcare rankings",
  ],
  authors: [{ name: "Doc Report", url: "https://doc-report.com" }],
  metadataBase: new URL("https://doc-report.com"),
  openGraph: {
    title: "Doc Report — Trusted Doctor Reviews",
    description:
      "Instantly receive a report on any doctor with up-to-date insights.",
    url: "https://doc-report.com",
    siteName: "Doc Report",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // find in /public
        width: 1200,
        height: 630,
        alt: "Doc Report — know your doctor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Doc Report — Trusted Doctor Reviews",
    description:
      "Comprehensive reports and evaluations of doctors worldwide — all in one place.",
    images: ["/og-image.jpg"],
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jost.variable} font-sans antialiased`}>
        <WishlistProvider>
          <Header />
          {children}
          <Analytics />
         <Suspense fallback={null}>
          <RouteAnalytics />
        </Suspense>
        </WishlistProvider>
      </body>
    </html>
  );
}
