import Link from "next/link";

const columns = [
  {
    heading: "About",
    links: [
      { label: "Surgery Abroad (doc-report.com) helps patients find, compare, and choose trusted doctors abroad. We strive to make healthcare decisions transparent and easy for everyone. The platform is currently beta v." },
    ],
  },
  {
    heading: "Statistics",
    links: [
      { type: "rating", label: "⭐⭐⭐⭐⭐ 4.9/5 Rating" },
      { type: "stat", label: "100K+ Doctors Rated" },
      { type: "stat", label: "500K+ Testimonials Analysed" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "For Service Providers", href: "https://surgery-abroad.com" },
      { label: "EU Funding", href: "/eu" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  
  {
    heading: "Contact",
    links: [
      { type: "email", label: "hello@surgery-abroad.com", href: "mailto:hello@surgery-abroad.com" },
      { type: "address", label: "Manufakturu g. 20, Vilnius, Lithuania (EU)" },
    ],
  },
  
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white section-padding-md">
      <div className="section-container grid grid-cols-1 md:grid-cols-4 gap-12">
        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="text-lg font-bold mb-4">{col.heading}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => {
                // Special formatting for Contact column
                if (col.heading === "Contact") {
                  if (link.type === "email") {
                    return (
                      <li key={link.label}>
                        <span className="font-semibold">E:</span>{" "}
                        <a href={link.href} className="hover:underline text-white/80">
                          {link.label}
                        </a>
                      </li>
                    );
                  }
                  if (link.type === "address") {
                    return (
                      <li key={link.label}>
                        <span className="font-semibold">A:</span>{" "}
                        <span className="text-white/80">{link.label}</span>
                      </li>
                    );
                  }
                }
                // Special formatting for Trust & Stats column
                if (col.heading === "Statistics") {
                  if (link.type === "rating") {
                     return (
                      <li key={link.label}>
                        <span className="text-white/80">{link.label}</span>
                      </li>
                    );
                  }
                  if (link.type === "stat") {
                    return (
                      <li key={link.label}>
                        <span className="text-white/80">{link.label}</span>
                      </li>
                    );
                  }
                }
                // Default rendering for other columns
                if (link.href) {
                  return link.href.startsWith("http") || link.href.startsWith("mailto") || link.href.startsWith("tel") ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="hover:underline text-white/80"
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:underline text-white/80">
                        {link.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={link.label}>
                    <span className="text-white/80">{link.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center text-xs text-white/60">
        &copy; {new Date().getFullYear()} Surgery Abroad. All rights reserved.
      </div>
    </footer>
  );
}