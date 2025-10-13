"use client";

import React, { useState, useRef, useEffect } from "react";
import { Heart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { paymentPageUrlRenderer } from "@/services/helper";
import "./style.css";

interface WishlistCounterProps {
  count: number;
  wishlistItems: any[];
  onRemove: (id: number) => void;
  onGenerateReport: (id: number) => void;
  onGenerateAllReports: () => void;
}

const WishlistCounter: React.FC<WishlistCounterProps> = ({
  count,
  wishlistItems,
  onRemove,
  onGenerateReport,
  onGenerateAllReports,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 👇 NEW: mount guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Only show badge/fill after mount to avoid SSR/CSR mismatch
  const safeCount = mounted ? count : 0;
  const hasItems = safeCount > 0;

  return (
    <div className="relative left-2">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-primary-dark hover:text-red-500 transition-colors"
        type="button"
        aria-label="Open wishlist"
        aria-expanded={isOpen}
      >
        {/* Keep server HTML stable; fill only after mount */}
        <Heart size={20} className={hasItems ? "text-red-500 fill-red-500" : ""} />
        {hasItems && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            aria-label={`${safeCount} items in wishlist`}
          >
            {safeCount > 9 ? "9+" : safeCount}
          </span>
        )}
      </button>

      {/* Wishlist Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="md:w-96 max-sm:fixed max-sm:left-1/2 max-sm:top-1/3 shadow-lg max-sm:bottom-auto max-sm:right-auto max-sm:w-[95vw] max-sm:max-w-sm max-sm:-translate-x-1/2 max-sm:-translate-y-1/2 md:absolute scroll-thin max-h-[300px] overflow-y-auto right-0 mt-2 bg-white rounded-lg border border-gray-200 z-50"
          role="dialog"
          aria-label="Wishlist"
        >
          <div className="p-4 relative">
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="sm:hidden absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close wishlist"
              type="button"
            >
              <X size={24} />
            </button>

            {wishlistItems.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.specialty}</p>
                        {item.flag && (
                          <img src={item.flag} alt="flag" className="w-5 h-3 mt-1" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 space-y-2">
                      <button
                        onClick={() => {
                          paymentPageUrlRenderer(item, item.source, router);
                          setIsOpen(false);
                        }}
                        className="text-primary bg-[#ADD8FF] px-5 py-1 rounded-md text-sm flex items-center space-x-1 disabled:opacity-50"
                        disabled={!item.rating || item.rating === 0}
                        type="button"
                      >
                        <span>Generate</span>
                      </button>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-primary"
                        aria-label={`Remove ${item.name} from wishlist`}
                        type="button"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No items in wishlist</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistCounter;
