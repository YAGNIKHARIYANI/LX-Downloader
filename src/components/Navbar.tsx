"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, ChevronDown, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Language list restricted to Indian regional target languages
const languages = [
  { name: "English", code: "en" },
  { name: "हिन्दी", code: "hi" },
  { name: "বাংলা", code: "bn" },
  { name: "తెలుగు", code: "te" },
  { name: "ಕನ್ನಡ", code: "kn" },
  { name: "മലയാളം", code: "ml" },
  { name: "मराठी", code: "mr" }
];

export default function Navbar() {
  const pathname = usePathname();
  
  const [langDropdown, setLangDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Client-side query parameters parsing (avoids React Suspense bailout)
  const [currentLangCode, setCurrentLangCode] = useState("en");

  useEffect(() => {
    const parseLang = () => {
      const params = new URLSearchParams(window.location.search);
      setCurrentLangCode(params.get("lang") || "en");
    };
    parseLang();
    window.addEventListener("popstate", parseLang);
    return () => window.removeEventListener("popstate", parseLang);
  }, [pathname]);

  // Force exclusively Light Mode (clearing any system dark classes)
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, []);

  // Monitor scroll for header background opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setLangDropdown(false);
    const params = new URLSearchParams(window.location.search);
    params.set("lang", langCode);
    window.history.pushState({}, "", `${pathname}?${params.toString()}`);
    window.dispatchEvent(new Event("popstate"));
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md shadow-slate-100/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={`/?lang=${currentLangCode}`} className="flex items-center gap-2.5 group active:scale-95 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-900/30 group-hover:scale-105 transition-transform duration-300">
                <Download className="w-5.5 h-5.5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                LX-<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Downloader</span>
              </span>
            </Link>
          </div>

          {/* Right Action Utilities (Language Selector only) */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdown(!langDropdown);
                }}
                onBlur={() => setTimeout(() => setLangDropdown(false), 200)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer active:scale-95 transition-all duration-150"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                Language
                <ChevronDown className="w-3 h-3" />
              </button>

              <AnimatePresence>
                {langDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-52 max-h-80 overflow-y-auto rounded-2xl bg-white p-2 shadow-2xl shadow-slate-300/40 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-center px-4 py-2 my-0.5 rounded-xl text-xs font-bold transition-all cursor-pointer block ${
                          currentLangCode === lang.code
                            ? "bg-blue-600 text-white font-black shadow-md shadow-blue-500/10"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
