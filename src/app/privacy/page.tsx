"use client";

import Footer from "@/components/footer/Footer";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-[#233665]/5 section-padding-xl flex items-center justify-center overflow-hidden">
      <div className="section-container relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 break-words">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl text-slate-600">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      <section className="section-container bg-white">
        <div className="section-padding-md space-y-8 text-slate-700 text-sm">
          <a href="#" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
  Go Back <span aria-hidden="true">›</span>
</a>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">Information We Collect</h2>
            <p>
              We collect only the information necessary to provide our services, such as your email address when you request a doctor report. We do not collect sensitive personal data.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">How We Use Your Information</h2>
            <p>
              Your email is used solely to deliver your requested report and communicate important updates about our platform. We do not sell or share your personal information with third parties.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">Data Security</h2>
            <p>
              We take data protection seriously and implement appropriate security measures to safeguard your information. All data is handled in accordance with GDPR and other applicable regulations.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">Cookies</h2>
            <p>
              Our website may use cookies to improve your experience and analyze usage. You can control cookie preferences in your browser settings.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at <a href="mailto:hello@surgery-abroad.com" className="text-[#233665] underline">hello@surgery-abroad.com</a>.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Any changes will be posted on this page.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#233665] mb-4">Contact</h2>
            <p>
              If you have any questions about this privacy policy or how your data is handled, please contact us at <a href="mailto:hello@surgery-abroad.com" className="text-[#233665] underline">hello@surgery-abroad.com</a>.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}