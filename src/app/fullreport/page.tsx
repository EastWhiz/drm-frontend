"use client";
import { createRoot } from "react-dom/client";
import React, { useEffect, useState } from "react";
import Intro from "./_components/intro";
import KeyInsights from "./_components/key-insights";
import { PatientReviews } from "./_components/patient-reviews";
import Feedback from "./_components/feedback";
import Summary from "./_components/summary";
import FAQs from "./_components/faq";
import Footer from "./_components/footer";
import { Doctor, Report } from "@/types";
import PrintableReport from "./_components/printable-report";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Loader from "@/components/ui/loader/loader";
import Footer1 from "@/components/footer/Footer";

const FullReport = () => {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [mouseLeaving, setMouseLeaving] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [specialtyData, setSpecialtyData] = useState<Doctor[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [params, setParams] = useState<{
    _spt: string;
    _spt_slug: string;
    _nme: string;
    _ct: string;
    _st: string;
    _rt: number;
    slug: string;
    _sr: string;
    lang: string;
  }>({
    _spt: "chiropractor",
    _spt_slug: "chiropractor",
    _nme: "Dr.",
    _ct: "",
    _st: "",
    _rt: 0,
    slug: "",
    _sr: "",
    lang: "en",
  });
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

  // const fetchSpecialtyData = async (specialty: string) => {
  //   const response = await fetch(
  //     `${API_BASE_URL}/doctors/speciality/?source=${params._sr}&speciality=${specialty}`
  //   );
  //   const data = await response.json();
  //   setSpecialtyData(data?.results || []);
  //   return data?.results || [];
  // };

  useEffect(() => {
    const fetchAllData = async () => {
      if (!params._sr || !params.slug) return;

      setIsLoading(true);
      setError(null);

      try {
        // Replicate profile page's data fetching flow
        // 1. Fetch specialty data first
        // const speciality = await fetchSpecialtyData(params._spt_slug);
        // if (speciality?.length === 0) {
        //   await fetchSpecialtyData("physician");
        // }

        // 2. Fetch report data with proper slug handling
        let identifier = params.slug;

        // Match profile page's IWGC handling
        if (params._sr === "iwgc") {
          const slugFromLink = getSlugFromProfileLink(params.slug);
          identifier = slugFromLink || params.slug;
        }

        // Match profile page's single encoding
        const encodedSlug = encodeURIComponent(identifier);

        const reportResponse = await fetch(
          `${API_BASE_URL}/doctors/report/?source=${params._sr}&identifier=${encodedSlug}`
        );

        if (!reportResponse.ok) throw new Error("Report fetch failed");

        // Replicate profile page's data processing
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

  // Add profile page's slug extraction
  const getSlugFromProfileLink = (profileLink: string): string | null => {
    const match = profileLink.match(/\/doctors\/([^/]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    // Track mouse leaving top of window
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 50) {
        // If mouse leaves from top
        setMouseLeaving(true);
        setShowExitPopup(true);
      }
    };

    // Handle beforeunload (closing tab/window)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!showExitPopup) {
        e.preventDefault();
        setShowExitPopup(true);
        return (e.returnValue = "Are you sure you want to leave?");
      }
    };

    // Handle route change
    const handleRouteChange = () => {
      if (!showExitPopup) {
        setShowExitPopup(true);
        return false;
      }
    };

    // Add event listeners
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [showExitPopup]);

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
      // Create a temporary div with A4 dimensions (no extra padding)
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "230mm"; // A4 width
      tempDiv.style.height = "300mm"; // A4 height
      tempDiv.style.margin = "0";
      tempDiv.style.padding = "0";
      tempDiv.style.boxSizing = "border-box";
      tempDiv.style.backgroundColor = "#ffffff";

      document.body.appendChild(tempDiv);

      // Create a root and render content
      const root = createRoot(tempDiv);
      root.render(<PrintableReport params={params} report={report} />);

      // Wait for initial rendering
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));

      // Wait specifically for SVG elements (charts) to be ready
      const waitForCharts = (): Promise<void> => {
        return new Promise<void>((resolve) => {
          const checkCharts = () => {
            const svgElements = tempDiv.querySelectorAll("svg");
            const hasCharts = svgElements.length > 0;

            if (hasCharts) {
              // Check if all SVG elements have actual content
              const allChartsReady = Array.from(svgElements).every((svg) => {
                const paths = svg.querySelectorAll("path, rect, circle, line");
                return paths.length > 0;
              });

              if (allChartsReady) {
                resolve();
                return;
              }
            }

            // If no charts or not ready, wait a bit more
            setTimeout(checkCharts, 500);
          };

          checkCharts();

          // Failsafe: resolve after 10 seconds max
          setTimeout(() => resolve(), 10000);
        });
      };

      await waitForCharts();

      // Additional wait to ensure everything is stable
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
        logging: true, // Enable logging to debug
        // Force rendering of SVG elements
        onrendered: function (canvas) {
          console.log("Canvas rendered successfully");
        },
        // Handle SVG elements specifically
        ignoreElements: function (element) {
          // Don't ignore any elements
          return false;
        },
      };

      console.log("Starting html2canvas...");
      const canvas = await html2canvas(tempDiv, options);
      console.log("html2canvas completed");

      // Clean up
      root.unmount();
      document.body.removeChild(tempDiv);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas has zero dimensions");
      }

      const imgData = canvas.toDataURL("image/png", 1.0);

      // Add image to PDF with exact A4 dimensions
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);

      pdf.save(`${params._nme.replace(/\s+/g, "_")}_Report.pdf`);

      console.log("PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);

      // More specific error handling
      if (error.message.includes("Canvas")) {
        alert("Failed to capture the report content. Please try again.");
      } else if (error.message.includes("SVG")) {
        alert("Failed to render charts. Please try again.");
      } else {
        alert("Failed to generate PDF. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <Loader />
      </div>
    );
  }

  return (
    <main className="relative">
      {/* Full-screen Overlay Popup - Highest z-index */}
      {showExitPopup && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div>
            <div className="p-8 text-center flex flex-col justify-center h-full">
              <div className="space-y-6">
                <p className="text-3xl font-semibold text-white">
                  Do you want to leave the page <br /> without downloading the
                  report?
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
      )}

      {/* Page Content with space-y-16 and lower z-index */}
      <div
        className={`space-y-16 transition-opacity duration-300 ${
          showExitPopup ? "opacity-30" : "opacity-100"
        }`}
      >
        <div className="bg-[#E5EEFB] pt-20 relative z-0">
          <Intro
            name={params._nme}
            specialty={params._spt}
            location={`${params._ct}, ${params._st}`}
            rating={params._rt}
          />
        </div>
        <div className="px-4 md:px-8">
          <KeyInsights insights={report?.insights || []} />
        </div>
        <div className="px-4 md:px-8">
          <PatientReviews
            yearlyData={report?.yearlyData}
            totalReviews={report?.totalReviews}
          />
        </div>
        <div className="px-4 md:px-8">
          <Feedback
            positiveComments={report?.positiveComments}
            negativeComment={report?.negativeComment}
            rating={params._rt}
          />
        </div>
        <div>
          <Summary
            summaryText={report?.summary}
            doctorName={params._nme}
            rating={params._rt}
          />
        </div>
        <div className="px-4 md:px-8">
          <FAQs
            params={params}
            report={report || { insights: [], summary: "", totalReviews: 0 }}
          />
        </div>
        <div className="">
          <Footer
            onDownload={handleDownload}
            isGeneratingPDF={isGeneratingPDF}
          />
          <Footer1 />
        </div>
      </div>
    </main>
  );
};

export default FullReport;
