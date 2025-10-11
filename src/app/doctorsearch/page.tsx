"use client";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Doctor } from "@/types";
import Image from "next/image";
import { paymentPageUrlRenderer } from "@/services/helper";
import { useWishlist } from "@/context/WishlistContext";
import DoctorCard from "./_documents/DoctorCard";
import SearchBar from "./_documents/SearchBar";
import LocationFilter from "./_documents/LocationFilter";
import Loader from "@/components/ui/loader/loader";
import Spinner from "@/components/ui/loader/spinner";

const DoctorSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [apiSources, setApiSources] = useState<string>("");
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchDefaultDoctors();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchText.trim()) {
        setSearchQuery(searchText);
      } else {
        setSearchQuery("");
      }
      clearAllFilters();
    }, 1500);

    return () => clearTimeout(debounceTimer);
  }, [searchText]);

  useEffect(() => {
    if (searchQuery.trim()) {
      fetchDoctors(searchQuery);
    }
  }, [searchQuery]);

  const getCountryName = (countrySlug: string | undefined) => {
    switch (countrySlug?.toLowerCase()) {
      case "us":
        return "United States";
      case "in":
        return "India";
      case "ca":
        return "Canada";
      case "uk":
        return "United Kingdom";
      default:
        return countrySlug?.toUpperCase() || "";
    }
  };

  useEffect(() => {
    // runs ONLY on the client
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("e_ser") === "t") {
      searchInputRef.current?.focus();

      // Change param to e_ser=f
      params.set("e_ser", "f");
      window.history.replaceState(null, "", `/?${params.toString()}`);
    }
  }, [router]);

  useEffect(() => {
    // Extract unique states, cities, and countries from doctors data
    if (doctors.length > 0) {
      const states = Array.from(
        new Set(doctors.map((doctor) => doctor.state || "").filter(Boolean))
      ).sort();

      const cities = Array.from(
        new Set(doctors.map((doctor) => doctor.city || "").filter(Boolean))
      ).sort();

      const countries = Array.from(
        new Set(
          doctors
            .map((doctor) => getCountryName(doctor.country_slug) || "")
            .filter(Boolean)
        )
      ).sort();

      setAvailableStates(states as string[]);
      setAvailableCities(cities as string[]);
      setAvailableCountries(countries as string[]);
    }
  }, [doctors]);

  async function fetchDefaultDoctors() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/doctors/search?query=john`);
      const data = await response.json();

      if (data.success && data.results?.length > 0) {
        setDoctors(data.results);
        setApiSources(data.source);
      }
    } catch (err) {
      console.error("Default doctors fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchDoctors(query: string) {
    setIsLoading(true);
    setError(null);
    setDoctors([]);

    try {
      const rateMDsResponse = await fetch(
        `${API_BASE_URL}/doctors/search?query=${encodeURIComponent(query)}`
      );
      const doctorsFetched = await rateMDsResponse.json();

      if (doctorsFetched.success && doctorsFetched.results?.length > 0) {
        setDoctors(doctorsFetched.results);
        setApiSources(doctorsFetched.source);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error("RateMDs fetch failed:", err);
    }

    setError("No doctors found");
    setIsLoading(false);
  }

  const navigateToPayment = (doctor: any) => {
    paymentPageUrlRenderer(doctor, apiSources, router);
  };

  const toggleWishlist = (doctor: Doctor) => {
    const isWishlisted = wishlistItems.some((item) => item.id === doctor.id);
    if (isWishlisted) {
      removeFromWishlist(doctor.id);
    } else {
      addToWishlist({ ...doctor, source: apiSources });
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesState = selectedState ? doctor.state === selectedState : true;
    const matchesCity = selectedCity ? doctor.city === selectedCity : true;
    const matchesCountry = selectedCountry
      ? getCountryName(doctor.country_slug) === selectedCountry
      : true;
    return matchesState && matchesCity && matchesCountry;
  });

  const clearAllFilters = () => {
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedCountry(null);
    setShowLocationFilter(false);
  };

  const getFilterDisplayText = () => {
    const filters = [];
    if (selectedCity) filters.push(selectedCity);
    if (selectedState) filters.push(selectedState);
    if (selectedCountry) filters.push(selectedCountry);

    if (filters.length > 0) {
      return filters.join(", ");
    }
    return "All Locations";
  };

  // Handle the search focus without layout shifts
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  // Handle search blur with a slight delay to ensure button clicks are processed
  const handleSearchBlur = () => {
    setTimeout(() => {
      if (
        !document.activeElement ||
        !searchInputRef.current?.contains(document.activeElement)
      ) {
        setIsSearchFocused(false);
      }
    }, 100);
  };
  // const searchParams = useSearchParams();
  useEffect(() => {

    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("query")) {

      const query = params.get("query");

      if (query) {
        setSearchText(query);
        setSearchQuery(query);
        fetchDoctors(query);
      }
    }
  }, [router]);
  return (
    <main className="min-h-screen bg-[#EDF3FF] px-4 py-8">
      <div className="mx-auto mt-28">
        {/* Header Section */}
        <div className="mb-8 lg:mb-12">
          <div className="max-w-[1100px] mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Text Content - No layout shifts */}
              <div className="flex-1 transition-all duration-500 ease-in-out">
                <div className="text-left mb-1">
                  <h1>
                    Find Your Doctor <span className="inline-block animate-wave">👋</span>
                  </h1>
                </div>

                {/* Search Input - Consistent width */}
                <div className="relative mt-6 group transition-all duration-500 w-full">
                  <SearchBar
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    isSearchFocused={isSearchFocused}
                    inputRef={searchInputRef}
                  />
                </div>
              </div>

              {/* Image - Hidden when search is focused */}
              {!isSearchFocused && (
                <div className="hidden md:block flex-shrink-0 w-1/2 max-w-md transition-opacity duration-300">
                  <div className="relative w-full h-64 md:h-80">
                    <Image
                      src="/assets/reports.png"
                      alt="Doctor search illustration showing medical reports"
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-doctor.png";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location Filter */}
        {/*
        {filteredDoctors.length > 0 && (
          <LocationFilter
            show={showLocationFilter}
            onToggle={() => setShowLocationFilter(!showLocationFilter)}
            onClear={clearAllFilters}
            availableCountries={availableCountries}
            availableStates={availableStates}
            availableCities={availableCities}
            selectedCountry={selectedCountry}
            selectedState={selectedState}
            selectedCity={selectedCity}
            setSelectedCountry={(country) => {
              setSelectedCountry(country);
              setSelectedState(null);
              setSelectedCity(null);
              setShowLocationFilter(false);
            }}
            setSelectedState={(state) => {
              setSelectedState(state);
              setSelectedCity(null);
              setSelectedCountry(null);
              setShowLocationFilter(false);
            }}
            setSelectedCity={(city) => {
              setSelectedCity(city);
              setSelectedState(null);
              setSelectedCountry(null);
              setShowLocationFilter(false);
            }}
            getFilterDisplayText={getFilterDisplayText}
          />
        )}
        */}

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1440px] mx-auto">
          {isLoading && (
  <div className="col-span-full flex justify-center items-center py-8">
    <Spinner />
  </div>
)}

          {error && (
            <div className="col-span-full text-center py-4 text-red-500 text-lg">
              {error}
            </div>
          )}

          {filteredDoctors.map((doctor) => {
            const isWishlisted = wishlistItems.some(
              (item) => item.id === doctor.id
            );
            return (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                isWishlisted={isWishlisted}
                onWishlistToggle={toggleWishlist}
                onReport={navigateToPayment}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default DoctorSearch;
