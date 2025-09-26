import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Heart, BarChart3, ArrowRight, BookOpen } from "lucide-react";

const FEATURES = [
  {
    title: "Better Healthcare",
    description: "We believe in making healthcare more accessible and transparent for everyone.",
    icon: Search,
  },
  {
    title: "Patient-Centric",
    description: "Our platform is built with patients' needs at its core. We want you to make informed decisions.",
    icon: Heart,
  },
  {
    title: "Data-Driven",
    description: "We use advanced analytics & AI to provide relevant doctor insights at real time.",
    icon: BarChart3,
  },
];

const STATS = [
  { number: "100K+", label: "Doctors Rated" },
  { number: "500K+", label: "Patient Reviews" },
  { number: "95%", label: "User Satisfaction" },
];

const FeaturesSection = () => (
  <section className="py-20 bg-[#edf3ff]">
    <div className="max-w-6xl mx-auto px-4 md:px-8">
      <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Why Choose Us</h2>
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {FEATURES.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center text-center"
          >
            <div className="text-[#233665] mb-4">
              <Icon size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">{title}</h3>
            <p className="text-slate-600">{description}</p>
          </div>
        ))}
      </div>
<Link href="/how-it-works" className="flex justify-center" >
  <button
  type="button"
  className="bg-[#233665] text-white px-8 py-4 rounded-xl text-lg font-semibold
             hover:bg-white hover:text-slate-900 transition-colors
             flex items-center gap-2 mx-auto"
>
  <BookOpen size={24} />
  How it Works (Beta)
</button>
</Link>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-6xl mx-auto px-4 md:px-8">
      <div className="grid md:grid-cols-3 gap-8">
        {STATS.map(({ number, label }) => (
          <div key={label} className="text-center">
            <div className="text-5xl font-bold text-[#233665] mb-2">{number}</div>
            <div className="text-xl text-slate-600">{label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AboutPage = () => (
  <main className="min-h-screen bg-[#233665]/5">
    {/* Hero Section */}
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-white">
      <div className="relative z-10 text-center px-4 md:px-8">
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 break-words max-w-full">
          A Better Way To Know Your Doctor
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
          We are building AI that makes it easy for patients to find trusted care abroad — and helps clinics save time with automated onboarding.
        </p>
      </div>
    </section>

    {/* Mission Section */}
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 mb-6">
              At Surgery Abroad, we help patients quickly find reliable, clear and personalised information about treatments, doctors and travel arrangements abroad — reducing anxiety and helping them make better decisions.
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="http://surgery-abroad.com/wp-content/uploads/2025/02/99bd42d0-7069-4bed-a42d-9962dad268a8-min.jpg"
              alt="Illustration representing our mission"
              fill
              className="object-cover object-top"   // 👈 important
              priority
            />
          </div>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <FeaturesSection />

    {/* Stats Section */}
    <StatsSection />

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

export default AboutPage;