import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA({
  title = "Ready to Find Your Doctor?",
  description = "Get a comprehensive report on any doctor - start your search now!",
  buttonText = "Search Now",
  buttonHref = "/",
}) {
  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-4xl mx-auto text-center px-4 md:px-8">
        <h2 className="text-4xl font-bold text-white mb-6">{title}</h2>
        <p className="text-xl text-white/80 mb-8">{description}</p>
        <Link href={buttonHref} className="inline-block">
          <button
            type="button"
            className="bg-white text-slate-900 px-8 py-4 rounded-xl text-lg font-semibold
              hover:bg-[#233665] hover:text-white transition-colors
              flex items-center gap-2 mx-auto"
          >
            {buttonText}
            <ArrowRight size={24} />
          </button>
        </Link>
      </div>
    </section>
  );
}