import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Doctor } from "@/types";
import { getCountryName, getCountryFlag, getScoreColor } from "@/lib/utils";

interface DoctorCardProps {
  doctor: Doctor;
  isWishlisted: boolean;
  onWishlistToggle: (doctor: Doctor) => void;
  onReport: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  isWishlisted,
  onWishlistToggle,
  onReport,
}) => {
  const countryFlag = getCountryFlag(doctor.country_slug);
  const countryName = getCountryName(doctor.country_slug);
  const score = doctor.rating ? (doctor.rating * 2).toFixed(1) : 0; // Convert 5-star to 10-point scale

  return (
    <div className="bg-[#ADD8FF] rounded-3xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative">
      {/* Wishlist button */}
      <button
        onClick={() => onWishlistToggle(doctor)}
        className="absolute top-4 right-4 p-2 z-10"
      >
        <Heart
          size={26}
          className={
            isWishlisted ? "text-red-500 fill-red-500" : "text-[#0F152B]"
          }
        />
      </button>

      {/* Doctor Info Section */}
      <div className="flex items-start space-x-3 mb-4 pr-12">
        {/* <div className="w-15 h-15 flex items-center justify-center">
          <Image
            src={countryFlag}
            alt={`${countryName} flag`}
            width={35}
            height={35}
          />
        </div> */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-primary break-words leading-tight">
            {doctor.name}
          </h3>
        </div>
      </div>

      {/* Specialist Info */}
      <div className="mb-4 pr-2">
        <p className="font-semibold text-l text-primary break-words leading-tight">
          {Array.isArray(doctor.specialties)
            ? doctor.specialties.join(", ")
            : doctor.specialty || ""}
        </p>
        <p className="text-sm text-primary break-words">
          {doctor.city}
          {doctor.city && (doctor.state || countryName) ? ", " : ""}
          {doctor.state || ""}
          {countryName ? ` • ${countryName}` : ""}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div
          className={`p-2 ${getScoreColor(Number(score))} rounded-lg shadow-sm flex flex-col items-center justify-center min-h-[56px]`}
        >
          <p className="text-white text-xs font-normal mb-1">Score</p>
          <div className="flex items-center justify-center flex-wrap">
            <span className="text-lg font-semibold text-white leading-none">{score}</span>
            <span className="text-xs text-white ml-1 self-end">/10</span>
          </div>
        </div>
        <div className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm flex flex-col items-center justify-center min-h-[56px]">
          <p className="text-primary text-xs font-normal mb-1">Reviews</p>
          <span className="text-lg font-semibold text-primary leading-none">{doctor.reviewCount || 0}</span>
        </div>
        <div className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm flex flex-col items-center justify-center min-h-[56px]">
          <p className="text-primary text-xs font-normal mb-1">Experience</p>
          <span className="text-lg font-semibold text-primary leading-none">10+</span>
        </div>
      </div>

      {/* Generate Report Button */}
      <button
        disabled={!Boolean(doctor.reviewCount || 0)}
        onClick={(e) => {
          e.preventDefault();
          onReport(doctor);
        }}
        className="mt-4 w-full bg-[#14183E] disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold hover:bg-[#14183E]/90 transition-colors flex items-center justify-center gap-2"
      >
        Generate Report
      </button>
    </div>
  );
};

export default DoctorCard;
