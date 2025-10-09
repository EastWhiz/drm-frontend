"use client";

import Footer from "@/components/footer/Footer";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#233665]/5">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-white">
      <div className="relative z-10 text-center px-4 md:px-8">
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 break-words max-w-full">
            Terms of Service
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8">
            Please read these terms of service carefully before using our platform.
          </p>
        </div>
      </section>

      <section className="pt-4 pb-20 px-4 md:px-8 bg-white">
        <div className="max-w-3xl mx-auto space-y-8 text-slate-700 text-lg">
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Surgery Abroad (doc-report.com), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use our platform.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">2. Services Provided</h2>
            <p>
              Our platform provides information, reports, and tools to help patients find, compare, and choose healthcare providers abroad. We do not provide medical advice, diagnosis, or treatment.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">3. User Responsibilities</h2>
            <p>
              You agree to use the platform lawfully and not to misuse, copy, or distribute any content without permission. You are responsible for the accuracy of any information you provide.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">4. Intellectual Property</h2>
            <p>
              All content, trademarks, and data on this platform are the property of Surgery Abroad or its licensors. You may not reproduce, modify, or distribute any part of the site without written consent.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">5. Limitation of Liability</h2>
            <p>
              Surgery Abroad is not liable for any direct, indirect, or consequential damages resulting from the use of our platform or reliance on any information provided.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">6. Privacy</h2>
            <p>
              Your use of the platform is also governed by our <a href="/privacy" className="text-[#233665] underline">Privacy Policy</a>.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">7. Changes to Terms</h2>
            <p>
              We may update these Terms of Service at any time. Changes will be posted on this page. Continued use of the platform means you accept the updated terms.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">8. Contact</h2>
            <p>
              For questions about these Terms of Service, please contact us at <a href="mailto:hello@surgery-abroad.com" className="text-[#233665] underline">hello@surgery-abroad.com</a>.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}