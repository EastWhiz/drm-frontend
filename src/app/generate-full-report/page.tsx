'use client';
import { Doctor } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const GenerateFullReport = () => {
const [doctor, setDoctor] = useState<Doctor | null>(null);
const router = useRouter();

// useEffect(() => {
//   // const storedDoctor = localStorage.getItem("doctor");
//   // if (storedDoctor) {
//     // setDoctor(JSON.parse(storedDoctor));
//   // }
//
//   const searchParams = new URLSearchParams(window.location.search);
//   // Check for either slug or id
//   const slugParam = searchParams.get('slug');
//
// }, []);
//
const skipToReport = () => {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('slug') && searchParams.has('_sr')) {
    router.push(`/profile${window.location.search}`);
  } else {
    console.warn("No identifier to navigate with");
  }
};

const navigateToFullReport = () => {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('slug') && searchParams.has('_sr')) {
    router.push(`/fullreport${window.location.search}`);
  } else {
    console.warn("No identifier to navigate with");
  }
};

  return (
    <div className="bg-blue-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold mb-12 text-black">
          Get a full report on
          <br />
          {doctor ? doctor.name : 'Dr John Doe'}
        </h1>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Side - Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-medium text-blue-800 mb-6">
                Enter card details
              </h2>

              <form>
                <div className="mb-6">
                  <label
                    htmlFor="cardName"
                    className="block text-blue-700 mb-2"
                  >
                    Card name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cardName"
                      className="w-full border-b-2 border-gray-300 pb-2 focus:outline-none focus:border-blue-500 pr-12"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="37" height="26" viewBox="0 0 37 26" fill="none" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8">
                            <ellipse cx="12.3349" cy="13.0656" rx="11.4648" ry="12.9235" fill="#FD0E0E"/>
                            <ellipse cx="25.3283" cy="13.0656" rx="11.4648" ry="12.9235" fill="#FFE249"/>
                            <ellipse cx="12.3349" cy="13.0656" rx="11.4648" ry="12.9235" fill="#FF4747" fillOpacity="0.65"/>
                    </svg>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="cardNumber"
                    className="block text-blue-700 mb-2"
                  >
                    Card number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    className="w-full border-b-2 border-gray-300 pb-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-4 mb-8">
                  <div className="flex-1">
                    <label
                      htmlFor="expiryDate"
                      className="block text-blue-700 mb-2"
                    >
                      Expiry date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      className="w-full border-b-2 border-gray-300 pb-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="cvv" className="block text-blue-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      className="w-full border-b-2 border-gray-300 pb-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">
                      I agree to the{" "}
                      <a href="#" className="text-blue-500">
                        Terms and Conditions
                      </a>
                    </span>
                  </label>
                </div>

                <div className="mb-4">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Save card details</span>
                  </label>
                </div>
              </form>
            </div>
            <div className="flex flex-col space-y-4">
              <button
               onClick={() => navigateToFullReport()}
                type="submit"
                className="w-full bg-gray-900 text-white py-4 rounded-t-xl rounded-b-2xl font-medium hover:bg-gray-800 transition"
              >
                Generate Report
              </button>
              <button
                onClick={() => skipToReport()}
                type="button"
                className="w-full bg-gray-300 text-gray-900 py-4 rounded-xl font-medium hover:bg-gray-400 transition"
              >
                Skip
              </button>
            </div>
          </div>

          {/* Right Side - Report Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 flex items-center justify-center">
            <img
              src="/report.JPG"
              alt="Placeholder for an image"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateFullReport;
