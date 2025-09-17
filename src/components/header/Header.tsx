"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import WishlistCounter from "../wishlist/WishlistCounter";
import { useWishlist } from "@/context/WishlistContext";
import "./header.css";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  {
  href: "https://surgery-abroad.com",
  target: "_blank",
  rel: "noopener noreferrer",
  label: "For Service Providers"
  },
  { href: "/eu", label: "EU Funding" }
];

const Header = () => {
  const { wishlistCount, wishlistItems, removeFromWishlist } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Scroll effect for header styling
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ESC closes menu
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${isScrolled ? "scrolled" : menuOpen ? "menu-open" : ""}`}>
      <div className="container mx-auto px-6 md:px-12 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={closeMenu}>
            <img
              src="http://surgery-abroad.com/wp-content/uploads/2023/02/surgery-abroad-responsive.png"
              alt="Surgery Abroad logo"
              style={{ height: '18px', width: 'auto' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6 items-center">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} className="nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="icon-button" onClick={() => router.push('/?e_ser=t')}>
                <Search size={20} />
              </button>
              <WishlistCounter
                count={wishlistCount}
                wishlistItems={wishlistItems}
                onRemove={removeFromWishlist}
                onGenerateReport={() => { }}
                onGenerateAllReports={() => { }}
              />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-2xl icon-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-10"
            onClick={closeMenu}
          />
        )}

        {/* Mobile Navigation */}
        <div
          className={`md:hidden mobile-nav ${menuOpen ? "open z-20" : "hidden"}`}
          style={{ position: "fixed", top: 0, right: 0, left: 0 }}
        >
          <button
            className="absolute top-4 right-4 text-2xl icon-button"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
          <nav className="space-y-4 p-4 bg-white shadow-lg rounded-b-lg">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={closeMenu} className="nav-link block">
                {link.label}
              </Link>
            ))}
            <button
              className="icon-button w-full flex items-center gap-2 justify-center border rounded py-2 mt-2"
              onClick={() => { closeMenu(); router.push('/doctorsearch?e_ser=t'); }}
            >
              <Search size={20} />
              <span>Search Doctors</span>
            </button>
            <div className="pt-4 flex items-center space-x-4">
              <WishlistCounter
                count={wishlistCount}
                wishlistItems={wishlistItems}
                onRemove={removeFromWishlist}
                onGenerateReport={() => { }}
                onGenerateAllReports={() => { }}
              />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
