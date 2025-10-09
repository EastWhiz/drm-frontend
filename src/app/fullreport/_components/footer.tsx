"use client";
import React from "react";
import { Download, Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { paymentPageUrlRenderer } from "@/services/helper";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FooterProps {
  onDownload: () => void;
  isGeneratingPDF: boolean;
}

const getScoreColor = (score: number) => {
  if (score >= 9) return "bg-[#009246]";
  if (score >= 7) return "bg-[#009246]";
  if (score >= 5) return "bg-[#E95959]";
  return "bg-[#FDA15A]";
};

const Footer: React.FC<FooterProps> = ({ onDownload, isGeneratingPDF }) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const router = useRouter();

  return (
    <footer className="section-padding-lg bg-[#0F152B] section-full">
      {/* Buttons Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-20">
        <Link
          href={"/?e_ser=t"}
          className="px-6 py-4 min-w-[220px] text-lg font-semibold rounded-lg shadow-md bg-white text-[#0F152B] hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out text-center"
        >
          Scan Another Doctor
        </Link>

        <button
          onClick={onDownload}
          className="px-6 py-4 min-w-[220px] text-lg font-semibold flex items-center justify-center gap-2 text-white border border-gray-300 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 hover:border-white transition-all duration-300 text-center"
        >
          <Download size={22} />
          <span>{isGeneratingPDF ? "Generating..." : "Download Report"}</span>
        </button>
      </div>

      {/* Previously Liked Section */}
      {wishlistItems.length > 0 ? (
        <div className="section-full">
          <h3 className="text-white font-bold mb-6 sm:text-left">
            Previously Liked
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {wishlistItems.map((doctor) => {
              const score = doctor.rating ? (doctor.rating * 2).toFixed(1) : "0.0";
              return (
                <div
                  key={doctor.id}
                  className="bg-[#ADD8FF] rounded-3xl shadow-md p-4 lg:p-6 hover:shadow-lg transition-shadow duration-300 relative flex flex-col min-h-[280px]"
                >
                  <button
                    onClick={() => removeFromWishlist(doctor.id)}
                    className="absolute top-3 right-3 lg:top-4 lg:right-4 p-1 lg:p-2 z-10"
                  >
                    <Heart
                      size={20}
                      fill="#0F152B"
                      className="text-[#0F152B] lg:w-6 lg:h-6"
                    />
                  </button>

                  <div className="flex items-start space-x-2 lg:space-x-3 mb-3 lg:mb-4 pr-8">
                    <h3 className="text-lg lg:text-xl font-bold text-primary leading-tight break-words">
                      {doctor.name}
                    </h3>
                  </div>

                  <div className="mb-3 lg:mb-4 flex-1">
                    <p className="font-semibold text-base lg:text-xl text-primary leading-tight break-words">
                      {doctor.specialty || "N/A"}
                    </p>
                    <p className="text-xs lg:text-sm text-primary mt-1">
                      {doctor.city ? `${doctor.city}, ` : ""}
                      {doctor.state || ""}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-1 lg:gap-2 mb-3 lg:mb-4">
                    <div
                      className={`p-2 lg:p-3 ${getScoreColor(
                        Number(score)
                      )} rounded-lg shadow-sm flex flex-col items-center justify-center min-h-[60px] lg:min-h-[80px]`}
                    >
                      <p className="text-white text-xs font-normal mb-1">Score</p>
                      <div className="flex items-center justify-center flex-wrap">
                        <span className="text-lg lg:text-xl font-semibold text-white leading-none">
                          {score}
                        </span>
                        <span className="text-xs text-white ml-1 self-end">/10</span>
                      </div>
                    </div>

                    <div className="p-2 lg:p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm flex flex-col items-center justify-center min-h-[60px] lg:min-h-[80px]">
                      <p className="text-primary text-xs font-normal mb-1">Reviews</p>
                      <div className="flex items-center justify-center">
                        <span className="text-lg lg:text-xl font-semibold text-primary leading-none">
                          {doctor.reviewCount || 0}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 lg:p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm flex flex-col items-center justify-center min-h-[60px] lg:min-h-[80px]">
                      <p className="text-primary text-xs font-normal mb-1">Experience</p>
                      <div className="flex items-center justify-center">
                        <span className="text-lg lg:text-xl font-semibold text-primary leading-none">
                          10+
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      paymentPageUrlRenderer(doctor, doctor.source, router)
                    }
                    className="mt-auto w-full bg-[#14183E] text-white py-2 lg:py-3 rounded-lg font-semibold hover:bg-[#14183E]/90 transition-colors disabled:opacity-50 text-sm lg:text-base"
                    disabled={score === "0.0"}
                  >
                    Generate Report
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-white">
          No liked doctors yet
        </div>
      )}
    </footer>
  );
};

export default Footer;
