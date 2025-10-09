"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Footer from "@/components/footer/Footer";
import CTA from "@/components/footer/CTA";

const FAQS = [
	{
		question: "What is the AI tool for medical services abroad?",
		answer:
			"Our platform uses artificial intelligence to help patients find, compare, and access comprehensive reports on doctors abroad. This ensures transparency and confidence in your healthcare decisions.",
	},
	{
		question: "How do I generate a doctor report?",
		answer:
			"Search for a doctor using our platform. Our system analyzes multiple data sources and generates a detailed report with ratings, reviews, and other relevant information. Enter your email to receive the report instantly.",
	},
	{
		question: "Is the service free for patients?",
		answer:
			"Yes, our platform is completely free for patients seeking information about medical services and providers abroad.",
	},
	{
		question: "How is my data protected?",
		answer:
			"We take privacy seriously. Your email is collected only to deliver your report and is handled securely in accordance with GDPR and other applicable regulations. We do not ask for sensitive personal data.",
	},
	{
		question: "Can clinics or doctors update their information?",
		answer:
			"Verified clinics and doctors can request updates or corrections to their profiles by contacting our support team.",
	},
	{
		question: "How are doctors rated?",
		answer:
			"Doctors are rated according to this formula: 33% of the score is based on the share of positive reviews (vs. total reviews); 67% on the doctor's average rating across top platforms.",
	},
	{
		question: "What countries are covered?",
		answer:
			"Our platform currently covers clinics and doctors in the U.S., Canada & European countries. We are expanding to include more regions soon.",
	},
	{
		question: "How often is the data updated?",
		answer:
			"We regularly update our database to ensure the information is accurate and up-to-date.",
	},
	{
		question: "Can I leave a review for a doctor?",
		answer:
			"No, our platform only aggregates reviews from other publiclicly available sources and does not collect reviews on its own.",
	},
	{
		question: "How do I contact support?",
		answer:
			"You can contact our support team via email at hello@surgery-abroad.com.",
	},
];

export default function FAQPage() {
	const [openIdx, setOpenIdx] = useState<number | null>(null);

	const toggle = (idx: number) => {
		setOpenIdx(openIdx === idx ? null : idx);
	};

	return (
		<main>
			{/* Hero Section */}
			 <section className="section-full section-spacing-xl flex items-center justify-center overflow-hidden bg-white">
      <div className="relative z-10 text-center px-4 md:px-8">
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 break-words max-w-full">
						Frequently Asked Questions
					</h1>
					<p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
						Find answers about the platform & how it generates doctor reports.
					</p>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="section-container section-spacing-md">
					<div className="space-y-6">
						{FAQS.map((faq, idx) => (
							<div
								key={faq.question}
								className="bg-[#233665]/5 rounded-2xl shadow-md"
							>
								<button
									className="w-full flex justify-between items-center p-6 focus:outline-none"
									onClick={() => toggle(idx)}
									aria-expanded={openIdx === idx}
									aria-controls={`faq-answer-${idx}`}
								>
									<span className="text-2xl font-semibold text-[#233665] text-left">
										{faq.question}
									</span>
									{openIdx === idx ? (
										<ChevronUp className="text-[#233665]" />
									) : (
										<ChevronDown className="text-[#233665]" />
									)}
								</button>
								{openIdx === idx && (
									<div
										id={`faq-answer-${idx}`}
										className="px-6 pb-6 text-lg text-slate-700 animate-fade-in"
									>
										{faq.answer}
									</div>
								)}
							</div>
						))}
					</div>
			</section>
			<CTA />
       		<Footer />
		</main>
	);
}