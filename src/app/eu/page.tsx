import Footer from "@/components/footer/Footer";
import CTA from "@/components/footer/CTA";

export const metadata = {
  title: "EU Funding & Support – Doc Report",
  description:
    "Learn how Doc Report is supported by EU grants, the programme details, and our commitment to transparency, compliance, and public impact.",
};

export default function EUFundingPage() {
  return (
    <main className="">
      {/* Hero Section */}
      <section className="section-spacing-xl section-full flex items-center justify-center overflow-hidden bg-white">
      <div className="relative z-10 text-center px-4 md:px-8">
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 break-words max-w-full">
          EU Funding
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
          The project “AI tool for medical services abroad” is financed by the European Union.
        </p>
      </div>
    </section>

      {/* Content Section */}
      <section className="section-spacing-md section-container bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-lg text-slate-700 mb-6">
              Our proposed solution – “AI tool for medical services abroad” – is a
              replicable artificial intelligence-controlled tool for medical
              clinics (and medical tourism intermediaries) serving patients from
              abroad. It will help clinics automatically provide patient manager
              and doctor-level answers to potential patients (at any time), while
              patients will be able to receive personalized information about
              treatment, clinic, doctor and travel abroad according to their
              needs (describing what procedures /operations you want, from which
              country you will come, what is most important when looking for a
              clinic, what you expect from a doctor, when you need treatment,
              etc. parameters).
            </p>
          </div>

          {/* Images */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="http://surgery-abroad.com/wp-content/uploads/2025/10/Screenshot-2025-10-03-at-15.33.27-min.png"
                alt="EU project screenshot 1"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="http://surgery-abroad.com/wp-content/uploads/2025/10/Screenshot-2025-10-03-at-15.33.09-min.png"
                alt="EU project screenshot 2"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  );
}
