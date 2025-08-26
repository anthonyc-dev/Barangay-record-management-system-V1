import { useState } from "react";
import { Button } from "@/components/ui/button";
import { House, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
const NAV_LINKS = [
  { label: "Home", path: "#home" },
  { label: "Features", path: "#features" },
  { label: "How It Works", path: "#how-it-works" },
  { label: "Map", path: "#map" },
  { label: "Contact", path: "#contact" },
];

export const Header = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] rounded-lg flex items-center justify-center">
              <House className="text-primary-foreground h-5 w-5" />
            </div>
            <div className="grid place-content-center">
              <span className="text-xl font-bold text-foreground">
                Barangay
              </span>
              <span className="text-[10px]">Record Management System</span>
            </div>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className="relative text-muted-foreground transition-colors duration-200 hover:text-blue-800 group"
              >
                <span className="relative z-10">{link.label}</span>
                <span
                  className="
                    absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-800 transition-all duration-300 group-hover:w-full
                  "
                  aria-hidden="true"
                ></span>
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/userLogin" tabIndex={-1}>
              <Button
                variant="ghost"
                className="hidden sm:inline-flex hover:bg-red-400 hover:text-white transition-colors duration-200 group relative"
              >
                <span className="relative z-10">Sign In</span>
              </Button>
            </Link>
            <Link to="/preRegister" tabIndex={-1}>
              <Button
                variant="default"
                className="hidden sm:inline-flex bg-blue-900 hover:bg-blue-800 transition-colors duration-200 group relative"
              >
                <span className="relative z-10">Pre-Register</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-label="Open navigation menu"
            >
              {mobileNavOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/*  Mobile Navigation Drawer */}
      <div
        className={`md:hidden fixed mt-16 inset-0 z-50 bg-gradient-to-br from-blue-900/80 via-blue-800/80 to-blue-700/80 backdrop-blur-sm transition-opacity duration-300 ${
          mobileNavOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ transitionProperty: "opacity" }}
        aria-hidden={!mobileNavOpen}
        onClick={() => setMobileNavOpen(false)}
      >
        <nav
          className={`absolute top-0 left-0 right-0 mx-2 mt-4 bg-background shadow-2xl rounded-2xl px-8 py-8 flex flex-col space-y-6 border border-blue-900/30 transition-transform duration-300 ${
            mobileNavOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-8 opacity-0 pointer-events-none"
          }`}
          style={{ transitionProperty: "transform, opacity" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Brand for mobile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] rounded-lg flex items-center justify-center">
              <House className="text-primary-foreground h-5 w-5" />
            </div>
            <div className="grid place-content-center">
              <span className="text-xl font-bold text-foreground">
                Barangay
              </span>
              <span className="text-[10px]">Record Management System</span>
            </div>
          </div>

          <hr className="border-blue-900/20 mb-2" />
          {NAV_LINKS.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-semibold text-blue-900 hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 group"
              onClick={() => setMobileNavOpen(false)}
            >
              <span className="relative group-hover:translate-x-1 transition-transform duration-200">
                {link.label}
              </span>
              <span className="block w-0 h-0.5 bg-blue-700 group-hover:w-6 transition-all duration-300 rounded-full"></span>
            </a>
          ))}
          <div className="flex flex-col space-y-3 ">
            <Link
              to="/userLogin"
              tabIndex={-1}
              onClick={() => setMobileNavOpen(false)}
            >
              <Button
                variant="ghost"
                className="w-full border border-red-400 text-red-500 hover:bg-red-400 hover:text-white transition-colors duration-200 font-semibold shadow"
              >
                Sign In
              </Button>
            </Link>
            <Link to={"/signup"}>
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 hover:from-blue-800 hover:to-blue-900 text-white font-bold shadow-lg transition-colors duration-200"
              >
                Get Started
              </Button>
            </Link>
          </div>

          <div className="flex justify-center gap-4 mt-2"></div>
        </nav>
      </div>
    </header>
  );
};
