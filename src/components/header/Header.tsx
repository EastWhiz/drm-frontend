"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import WishlistCounter from "../wishlist/WishlistCounter";
import { useWishlist } from "@/context/WishlistContext";
import "./header.css";

type NavLink = {
  href: string;
  label: string;
  target?: "_blank" | "_self";
  rel?: string;
};

const NAV_LINKS: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  {
    href: "https://surgery-abroad.com",
    target: "_blank",
    rel: "noopener noreferrer",
    label: "For Service Providers",
  },
  { href: "/eu", label: "EU Funding" },
];

/** Routes where we want a minimal header by default (no tabbed nav). */
const HIDE_NAV_ON: string[] = [
  "/emailReport",
  "/fullreport",
  "/profile",
];

type HeaderProps = {
  /** Force showing/hiding nav. If undefined, we use route-based auto logic. */
  showNav?: boolean;
};

const Header: React.FC<HeaderProps> = ({ showNav }) => {
  const { wishlistCount, wishlistItems, removeFromWishlist } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ESC closes menu
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  // Active helpers
  const isRouteActive = (href: string) =>
    !href.startsWith("http") && (pathname === href || pathname.startsWith(`${href}/`));

  // Treat search icon as active on home or doctorsearch pages
  const isSearchActive = pathname === "/" || pathname.startsWith("/doctorsearch");

  // -------- decide whether to show the nav ----------
  // query override: `?minimal=1` will hide; `?minimal=0` will show
  const minimalParam = searchParams?.get("minimal");
  const queryForcesHide = minimalParam === "1";
  const queryForcesShow = minimalParam === "0";

  const autoHide = HIDE_NAV_ON.some((p) => pathname?.startsWith(p));
  const computedShowNav =
    showNav ?? (queryForcesShow ? true : queryForcesHide ? false : !autoHide);

  return (
    <header className={`header ${isScrolled ? "scrolled" : menuOpen ? "menu-open" : ""}`}>
      <div className="section-container section-spacing-sm">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center logo" onClick={closeMenu} aria-label="Home">
            <img
              src="http://surgery-abroad.com/wp-content/uploads/2023/02/surgery-abroad-responsive.png"
              alt="Surgery Abroad logo"
              style={{ height: "18px", width: "auto" }}
            />
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-6">
            {/* Desktop Navigation (conditionally shown) */}
            {computedShowNav && (
              <nav className="hidden md:flex space-x-6 items-center">
                {NAV_LINKS.map((link) =>
                  link.href.startsWith("http") ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target={link.target}
                      rel={link.rel}
                      className="nav-link"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="nav-link"
                      aria-current={isRouteActive(link.href) ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>
            )}

            {/* Desktop Icons — always shown */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                className="icon-button"
                aria-current={isSearchActive ? "page" : undefined}
                onClick={() => router.push("/?e_ser=t")}
                aria-label="Search doctors"
                type="button"
              >
                <Search size={20} />
              </button>

              <WishlistCounter
                count={wishlistCount}
                wishlistItems={wishlistItems}
                onRemove={removeFromWishlist}
                onGenerateReport={() => {}}
                onGenerateAllReports={() => {}}
              />
            </div>

            {/* Mobile Menu Toggle — show only if we actually have a nav */}
            {computedShowNav && (
              <button
                className="md:hidden text-2xl icon-button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                type="button"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Overlay */}
        {computedShowNav && menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-25 z-10" onClick={closeMenu} />
        )}

        {/* Mobile Navigation */}
        {computedShowNav && (
          <div
            className={`md:hidden mobile-nav ${menuOpen ? "open z-20" : "hidden"}`}
            style={{ position: "fixed", top: 0, right: 0, left: 0 }}
          >
            <button
              className="absolute top-4 right-4 text-2xl icon-button"
              onClick={closeMenu}
              aria-label="Close menu"
              type="button"
            >
              <X size={28} />
            </button>

            <nav className="space-y-4 p-4 bg-white shadow-lg rounded-b-lg">
              {NAV_LINKS.map((link) =>
                link.href.startsWith("http") ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.target}
                    rel={link.rel}
                    className="nav-link block"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="nav-link block"
                    aria-current={isRouteActive(link.href) ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                )
              )}

              <button
                className="icon-button w-full flex items-center gap-2 justify-center border rounded py-2 mt-2"
                onClick={() => {
                  closeMenu();
                  router.push("/doctorsearch?e_ser=t");
                }}
                aria-current={isSearchActive ? "page" : undefined}
                type="button"
              >
                <Search size={20} />
                <span>Search Doctors</span>
              </button>

              <div className="pt-4 flex items-center space-x-4">
                <WishlistCounter
                  count={wishlistCount}
                  wishlistItems={wishlistItems}
                  onRemove={removeFromWishlist}
                  onGenerateReport={() => {}}
                  onGenerateAllReports={() => {}}
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
