import React from 'react';
import { Search, BarChart3, ClipboardList, CheckCircle2, LineChart, Users, FileText, ArrowRight } from 'lucide-react';
import Footer from "@/components/footer/Footer";
import CTA from "@/components/footer/CTA";

const steps = [
  {
    number: "01",
    title: "Search Doctor",
    description: "Enter the doctor's name to find the specialist you're looking for.",
    icon: Search
  },
  {
    number: "02",
    title: "Generate Report",
    description: "Our system analyses data from multiple sources to create a detailed report.",
    icon: BarChart3
  },
  {
    number: "03",
    title: "Review Insights",
    description: "Get detailed insights about the doctor's experience, patient reviews, and ratings.",
    icon: ClipboardList
  },
  {
    number: "04",
    title: "Make a Decision",
    description: "Use the report to make an informed decision about your healthcare provider.",
    icon: CheckCircle2
  }
];

const features = [
  {
    title: "Comprehensive Analysis",
    description: "We analyze multiple data points including patient reviews, qualifications, and experience.",
    icon: LineChart
  },
  {
    title: "Real Patient Reviews",
    description: "Access authentic patient experiences and feedback about healthcare providers.",
    icon: Users
  },
  {
    title: "Detailed Reports",
    description: "Get in-depth reports that help you understand a doctor's practice and patient satisfaction.",
    icon: FileText
  }
];

const StepsSection = () => (
  <section className="section-container section-spacing-md">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map(({ number, title, description, icon: Icon }) => (
          <div key={title} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-slate-900">
                <Icon size={32} strokeWidth={1.5} />
              </div>
              <div className="text-3xl font-bold text-slate-900">{number}</div>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">{title}</h3>
            <p className="text-slate-600">{description}</p>
          </div>
        ))}
      </div>
  </section>
);

const FeaturesSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-6xl mx-auto px-4 md:px-8">
      <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">What Makes Us Different</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map(({ title, description, icon: Icon }) => (
          <div key={title} className="bg-[#EDF3FF] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="text-slate-900 mb-4">
              <Icon size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">{title}</h3>
            <p className="text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProcessVisualization = () => (
  <section className="py-20">
    <div className="max-w-6xl mx-auto px-4 md:px-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1 w-full bg-slate-200"></div>
        </div>
        <div className="relative flex justify-between">
          {steps.map(({ number, title }) => (
            <div key={title} className="bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-slate-900">{number}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const HowItWorksPage = () => (
  <main className="min-h-screen bg-[#EDF3FF]">
    {/* Hero Section */}
    <section className="section-padding-xl section-full flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center px-4">
       <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
  How It Works{" "}
  <span className="text-[#233665]">(Beta)</span>
</h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
          Simple system to find your doctor and see how good are they
        </p>
      </div>
    </section>

    <StepsSection />
    <CTA />
    <Footer />
  </main>
);

export const metadata = {
  title: "How to Use Doc Report – Generate a Doctor Report in Seconds",
  description:
    "Step-by-step guide to finding a doctor, scanning their online presence, and downloading a clear, trusted report. Tips, examples, and common pitfalls.",
};

export default HowItWorksPage;