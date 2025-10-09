import React from "react";
import { Info } from "lucide-react";

interface SummaryProps {
  summaryText: string;
  doctorName: string;
  rating: number;
}

const getScoreColor = (score: number) => {
  if (score >= 9) return "bg-[#009246]";
  if (score >= 7) return "bg-[#009246]";
  if (score >= 5) return "bg-[#E95959]";
  return "bg-[#FDA15A]";
};

const Summary: React.FC<SummaryProps> = ({
  summaryText,
  doctorName,
  rating
}) => {
  // Convert 5-star rating to 10-point scale
  const score = rating ? parseFloat((rating * 2).toFixed(1)) : 0;

  return (
    <main>
      <section className="bg-[#E5EEFB] section-padding-lg">
        <div className="section-container grid grid-cols-1 md:grid-cols-3 gap-20">
          {/* Summary Text */}
          <div className="text-lg text-primary md:col-span-2">
            <h2 className="reports_heading">Summary</h2>
            <p className="text-justify">
              {summaryText || "No summary available."}{"... "}
              <a
                href="#faq"
                className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
              >
                Learn more
              </a>
            </p>
          </div>
          {/* Doctor Score */}
          <div>
            <h3 className="text-primary font-semibold mb-3">{doctorName}</h3>
            <div className="flex items-center gap-4">
              <div
                className={`${getScoreColor(
                  score
                )} text-white rounded-lg w-48 h-20 flex items-center justify-center`}
              >
                <span className="text-5xl font-bold">{score}</span>
                <span className="mt-4">/10</span>
              </div>
            </div>
            <div className="relative group flex items-center gap-1 mt-2 cursor-pointer">
              <Info className="bg-[#0F152B] text-white rounded-full w-4 h-4" />
              <p className="text-sm text-primary">See how we calculate the score</p>
              {/* Tooltip */}
              <div className="absolute left-0 top-8 z-10 hidden w-64 bg-white text-sm text-gray-700 border border-gray-300 rounded-md p-2 shadow-lg group-hover:block">
                33% of the score is based on the share of positive reviews; 67% on the doctor's average rating across top platforms.
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Disclaimer */}
      <section className="bg-[#0F152B]">
        <div className="section-container section-padding-sm">
          <p className="text-sm text-white">
            <span className="font-semibold">Disclaimer: </span>
            This is not medical advice. Please consult a healthcare professional for any medical concerns.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Summary;