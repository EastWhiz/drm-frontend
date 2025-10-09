import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

interface Insight {
  title: string;
  text: string;
}

interface KeyInsightsProps {
  insights?: Insight[];
}

const KeyInsights: React.FC<KeyInsightsProps> = ({ insights = [] }) => (
  <section className="key-insights">
    <h2 className="reports_heading mb-8">Key Insights</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {insights.length > 0 ? (
        insights.map((insight, index) => (
          <div
            key={index}
            className="border border-[#ADD8FF] rounded-lg p-6 bg-white shadow-sm"
          >
            <h3 className="text-lg md:text-xl font-semibold text-[#0F152B] mb-2">
              {insight.title}
            </h3>
            <p className="text-sm md:text-base text-[#333] leading-relaxed">
              {insight.text}
            </p>
          </div>
        ))
      ) : (
        <div className="border border-[#ADD8FF] rounded-lg p-6 col-span-3 bg-white flex items-center gap-3">
          <InformationCircleIcon className="w-6 h-6 text-gray-600" />
          <span className="text-base md:text-lg font-medium text-gray-700">
            No insights available
          </span>
        </div>
      )}
    </div>
  </section>
);

export default KeyInsights;
