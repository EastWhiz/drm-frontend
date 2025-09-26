"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
	{
		question: "What is the AI tool for medical services abroad?",
		answer:
			"It is an AI-powered platform that helps patients find, compare, and access comprehensive reports on doctors abroad. This provides transparency and much-needed confidence for patients when making important healthcare decisions.",
	},
	{
		question: "How do I generate a doctor report?",
		answer:
			"Simply search for a doctor and our system will analyze multiple data sources to generate a comprehensive report with ratings, reviews, and other relevant information. Enter your email to receive the report instantly.",
	},
	{
		question: "Is the service free for patients?",
		answer:
			"Yes, our platform is free for patients seeking information about medical services and providers abroad.",
	},
	{
		question: "How is my data protected?",
		answer:
			"We take privacy seriously and do not ask for any sensitive personal data. Your email is collected solely to deliver your report and is handled securely in accordance with GDPR and all applicable regulations.",
	},
	{
		question: "Can clinics or doctors update their information?",
		answer:
			"Yes, verified clinics and doctors can request updates or corrections to their profiles by contacting our support team.",
	},
];

export default function FAQPage() {
	const [openIdx, setOpenIdx] = useState<number | null>(null);

	const toggle = (idx: number) => {
		setOpenIdx(openIdx === idx ? null : idx);
	};

	return (
		<main className="min-h-screen bg-[#233665]/5">
			{/* Hero Section */}
			<section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-white">
				<div className="relative z-10 text-center px-4 md:px-8">
					<h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
						Frequently Asked Questions
					</h1>
					<p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
						Find answers about the platform & how it generates doctor reports.
					</p>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-20 px-4 md:px-8 bg-white">
				<div className="max-w-3xl mx-auto">
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
				</div>
			</section>
			{/* CTA Section */}
			<section className="py-20 bg-slate-900">
				<div className="max-w-4xl mx-auto text-center px-4 md:px-8">
					<h2 className="text-4xl font-bold text-white mb-6">
						Ready to Find Your Doctor?
					</h2>
					<p className="text-xl text-white/80 mb-8">
						Get a comprehensive report on any doctor - start your search now!
					</p>

					<Link href="/" className="inline-block">
						<button
							type="button"
							className="bg-white text-slate-900 px-8 py-4 rounded-xl text-lg font-semibold
                   hover:bg-[#233665] hover:text-white transition-colors
                   flex items-center gap-2 mx-auto"
						>
							Search Now
							<ArrowRight size={24} />
						</button>
					</Link>
				</div>
			</section>
		</main>
	);
}