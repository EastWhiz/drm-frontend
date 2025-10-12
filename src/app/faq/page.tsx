import type { Metadata } from "next";
import FAQClient from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQs – Doc Report",
  description:
    "Answers to common questions about data sources, scoring, privacy, pricing, and how Doc Report analyzes reviews to create a trustworthy summary.",
};

export default function FAQPage() {
  // Server component can render a client component
  return <FAQClient />;
}
