"use client";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Intro from "./_components/intro";
import KeyInsights from "./_components/key-insights";
import { PatientReviews } from "./_components/patient-reviews";
import Feedback from "./_components/feedback";
import Summary from "./_components/summary";
import FAQs from "./_components/faq";
import Footer from "./_components/footer";
import Footer1 from "@/components/footer/Footer";
import { Doctor, Report } from "@/types";
import PrintableReport from "./_components/printable-report";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Spinner from "@/components/ui/loader/spinner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getSlugFromProfileLink = (profileLink: string): string | null => {
  const match = profileLink.match(/\/doctors\/([^/]+)/);
  return match ? match[1] : null;
};

const defaultParams = {
  _spt: "chiropractor",
  _spt_slug: "chiropractor",
  _nme: "Dr.",
  _ct: "",
  _st: "",
  _rt: 0,
  slug: "",
  _sr: "",
  lang: "en",
};

const FullReport = () => {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [mouseLeaving, setMouseLeaving] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(defaultParams);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const suppressExitRef = useRef(false);

  // Parse URL params on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const specialty = searchParams.get("_spt") || "chiropractor";
    const specialtySlug =
      searchParams.get("_spt_slug") ||
      searchParams.get("_spt") ||
      "chiropractor";
    const name = searchParams.get("_nme") || "Dr.";
    const city = searchParams.get("_ct") || "";
    const state = searchParams.get("_st") || "";
    const rating = parseFloat(searchParams.get("_rt") || "0");
    const slug = decodeURIComponent(searchParams.get("slug") || "");
    const source = searchParams.get("_sr") || "";
    const lang = searchParams.get("lang") || "en";

    setParams({
      _spt: specialty,
      _spt_slug: specialtySlug,
      _nme: name,
      _ct: city,
      _st: state,
      _rt: rating,
      slug: slug,
      _sr: source,
      lang: lang,
    });
  }, []);

  // Fetch report data
  useEffect(() => {
    const fetchAllData = async () => {
      if (!params._sr || !params.slug) return;

      setIsLoading(true);
      setError(null);

      try {
        let identifier = params.slug;
        if (params._sr === "iwgc") {
          const slugFromLink = getSlugFromProfileLink(params.slug);
          identifier = slugFromLink || params.slug;
        }
        const encodedSlug = encodeURIComponent(identifier);

        const reportResponse = await fetch(
          `${API_BASE_URL}/doctors/report/?source=${params._sr}&identifier=${encodedSlug}`
        );
        if (!reportResponse.ok) throw new Error("Report fetch failed");

        const reportData = await reportResponse.json();
        const processedReport: Report = {
          ...reportData,
          positiveComments: {
            first: reportData.positiveComments?.first || null,
            second: reportData.positiveComments?.second || null,
          },
          negativeComment: reportData.negativeComment || null,
          insights: reportData.insights || [],
          summary: reportData.summary || "No summary available",
          locations: reportData.locations || [],
          originalApiResponse: reportData.originalApiResponse || [],
        };

        setReport(processedReport);
      } catch (error) {
        console.error("Error fetching report:", error);
        setError(error instanceof Error ? error.message : "API error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [params._sr, params.slug, params._spt_slug]);

  // Handle smooth scroll to FAQ
  const handleAskMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    suppressExitRef.current = true;
    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
    history.pushState(null, "", "#faq");
    setTimeout(() => {
      suppressExitRef.current = false;
    }, 800);
  };

  // Handle exit popup logic
  {/* useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (suppressExitRef.current) return;
      if (e.clientY < 50) {
        setMouseLeaving(true);
        setShowExitPopup(true);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (suppressExitRef.current) return;
      if (!showExitPopup) {
        e.preventDefault();
        setShowExitPopup(true);
        e.returnValue = "Are you sure you want to leave?";
      }
    };

    const handleRouteChange = () => {
      if (suppressExitRef.current || location.hash) return;
      if (!showExitPopup) {
        setShowExitPopup(true);
        return false;
      }
    };

    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("hashchange", () => {});

    return () => {
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("hashchange", () => {});
    };
  }, [showExitPopup]); */}

  // PDF generation
  const handleDownload = async () => {
    setIsGeneratingPDF(true);
    try {
      await generatePDF();
    } finally {
      setIsGeneratingPDF(false);
      setShowExitPopup(false);
    }
  };

  const handleContinue = () => {
    setShowExitPopup(false);
    setMouseLeaving(false);
  };

  const generatePDF = async () => {
    try {
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "230mm";
      tempDiv.style.height = "300mm";
      tempDiv.style.margin = "0";
      tempDiv.style.padding = "0";
      tempDiv.style.boxSizing = "border-box";
      tempDiv.style.backgroundColor = "#ffffff";
      document.body.appendChild(tempDiv);

      const root = createRoot(tempDiv);
      root.render(<PrintableReport params={params} report={report} />);
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));

      const waitForCharts = (): Promise<void> => {
        return new Promise<void>((resolve) => {
          const checkCharts = () => {
            const svgElements = tempDiv.querySelectorAll("svg");
            const hasCharts = svgElements.length > 0;
            if (hasCharts) {
              const allChartsReady = Array.from(svgElements).every((svg) => {
                const paths = svg.querySelectorAll("path, rect, circle, line");
                return paths.length > 0;
              });
              if (allChartsReady) {
                resolve();
                return;
              }
            }
            setTimeout(checkCharts, 500);
          };
          checkCharts();
          setTimeout(() => resolve(), 10000);
        });
      };

      await waitForCharts();
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));

      const pdf = new jsPDF("p", "mm", "a4");
      const options = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        logging: true,
        onrendered: function () {
          // no-op
        },
        ignoreElements: function () {
          return false;
        },
      };

      const canvas = await html2canvas(tempDiv, options);
      root.unmount();
      document.body.removeChild(tempDiv);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas has zero dimensions");
      }

      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      pdf.save(`${params._nme.replace(/\s+/g, "_")}_Report.pdf`);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      if (error.message?.includes("Canvas")) {
        alert("Failed to capture the report content. Please try again.");
      } else if (error.message?.includes("SVG")) {
        alert("Failed to render charts. Please try again.");
      } else {
        alert("Failed to generate PDF. Please try again.");
      }
    }
  };

{/* Loader on Start */}
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <Spinner />
      </div>
    );
  } 

  return (
    <main className="relative">
      {/* Exit Popup 
      {showExitPopup && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div>
            <div className="p-8 text-center flex flex-col justify-center h-full">
              <div className="space-y-6">
                <p className="text-3xl font-semibold text-white">
                  Do you want to leave the page <br /> without downloading the report?
                </p>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleDownload}
                  className="px-8 py-3 bg-white hover:bg-blue-700 text-primary font-medium rounded-lg transition-all duration-200 hover:scale-105"
                >
                  Download Report
                </button>
                <button
                  onClick={handleContinue}
                  className="px-8 py-3 bg-transparent border border-gray-300 hover:bg-gray-100/20 text-white font-medium rounded-lg transition-all"
                >
                  Continue Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}*/}

      {/* Main Content */}
      <div
        className={`transition-opacity duration-300 ${
          showExitPopup ? "opacity-30" : "opacity-100"
        }`}
      >
        <div className="bg-[#E5EEFB] pt-40 pb-12">
          <div className="section-container">
            <Intro
              name={params._nme}
              specialty={params._spt}
              location={`${params._ct}, ${params._st}`}
              rating={params._rt}
            />
          </div>
        </div>
        <div className="section-container section-spacing-lg">
          <KeyInsights insights={report?.insights || []} />
        </div>
        <div className="section-container section-spacing-lg">
          <PatientReviews
            yearlyData={report?.yearlyData}
            totalReviews={report?.totalReviews}
          />
        </div>
        <div className="section-container section-spacing-lg">
          <Feedback
            positiveComments={report?.positiveComments}
            negativeComment={report?.negativeComment}
            rating={params._rt}
          />
        </div>
        <Summary
          summaryText={report?.summary}
          doctorName={params._nme}
          rating={params._rt}
        />
        <div id="faq" className="section-container section-spacing-lg">
          <FAQs
            params={params}
            report={report || { insights: [], summary: "", totalReviews: 0 }}
          />
        </div>
        <Footer onDownload={handleDownload} isGeneratingPDF={isGeneratingPDF} />
        <Footer1 />
      </div>
    </main>
  );
};

export default FullReport;
