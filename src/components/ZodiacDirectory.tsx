import React, { useState } from "react";
import { zodiacSigns } from "../data/zodiac";
import { Sparkles, Heart, Briefcase, HelpCircle, Star, Award, Compass, Shield, Globe, Search, X } from "lucide-react";

interface ZodiacDirectoryProps {
  theme: "cosmos" | "solstice";
}

export default function ZodiacDirectory({ theme }: ZodiacDirectoryProps) {
  const [selectedSign, setSelectedSign] = useState<string>("Aries");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isDark = theme === "cosmos";

  // Filter signs based on search query
  const filteredSigns = zodiacSigns.filter((z) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      z.name.toLowerCase().includes(query) ||
      z.element.toLowerCase().includes(query) ||
      z.rulingPlanet.toLowerCase().includes(query) ||
      z.dateRange.toLowerCase().includes(query) ||
      z.strengths.some((s) => s.toLowerCase().includes(query)) ||
      z.weaknesses.some((w) => w.toLowerCase().includes(query)) ||
      z.description.toLowerCase().includes(query)
    );
  });

  // Current selected sign or fallback to first filtered sign
  const sign = zodiacSigns.find((s) => s.name === selectedSign) || filteredSigns[0] || zodiacSigns[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="zodiac-directory-container">
      {/* Sidebar with 12 Signs selection and Search */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? "bg-slate-900/80 border-amber-500/20" : "bg-white border-amber-200 shadow-md"
      }`}>
        <h3 className={`text-lg font-serif font-bold ${isDark ? "text-amber-200" : "text-amber-800"}`}>
          Zodiac Library
        </h3>
        <p className={`text-xs mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Explore personality profiles, elemental traits, strengths, romance, and career calling.
        </p>

        {/* Search Input block */}
        <div className="relative mb-5" id="zodiac-search-bar-wrapper">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-amber-500/70" />
          </div>
          <input
            id="zodiac-search-input"
            type="text"
            className={`block w-full pl-9 pr-8 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all ${
              isDark
                ? "bg-slate-950/80 border-slate-800 text-white placeholder-slate-500"
                : "bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400"
            }`}
            placeholder="Search name, element, planet, strength..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-250"
              title="Clear Search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {filteredSigns.length === 0 ? (
          <div className="text-center py-10">
            <HelpCircle className="w-8 h-8 mx-auto text-amber-500 opacity-60 mb-2 animate-bounce" />
            <p className="text-xs font-serif font-semibold text-amber-500">No cosmic signs found</p>
            <p className="text-[10px] opacity-60 mt-1">Try another element or keyword</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredSigns.map((z) => (
              <button
                key={z.name}
                id={`dir-sign-btn-${z.name}`}
                onClick={() => setSelectedSign(z.name)}
                className={`p-3 rounded-xl transition-all border flex items-center gap-2 text-left ${
                  selectedSign === z.name
                    ? isDark
                      ? "bg-amber-400 text-slate-950 border-amber-400 font-semibold"
                      : "bg-amber-600 text-white border-amber-600 font-semibold"
                    : isDark
                    ? "bg-slate-950/40 border-slate-800 hover:border-amber-400/30 text-slate-300 hover:bg-slate-900"
                    : "bg-slate-50 border-slate-200 hover:border-amber-600/30 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="text-xl leading-none">{z.symbol}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold font-serif leading-tight truncate">{z.name}</p>
                  <p className={`text-[8px] truncate ${selectedSign === z.name ? "opacity-90" : "opacity-60"}`}>{z.dateRange}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Personality Profile display */}
      <div className="lg:col-span-2 space-y-6">
        <div className={`p-6 md:p-8 rounded-2xl border relative overflow-hidden ${
          isDark
            ? "bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/30 text-white"
            : "bg-gradient-to-b from-amber-50 to-white border-amber-200 text-slate-900 shadow-md"
        }`}>
          {/* Large background watermarks */}
          <div className="absolute right-[-8%] top-[-8%] text-[11rem] font-serif opacity-[0.03] select-none pointer-events-none">
            {sign.symbol}
          </div>

          <div className="flex items-center gap-4 border-b border-slate-800/10 dark:border-slate-100/10 pb-5">
            <span className="text-6xl">{sign.symbol}</span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-3xl font-serif font-bold text-amber-500 tracking-wide">
                  {sign.name}
                </h2>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isDark ? "bg-slate-800 text-amber-300" : "bg-amber-100 text-amber-800"
                }`}>
                  {sign.dateRange}
                </span>
              </div>
              <p className={`text-xs mt-1 italic ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                "The {sign.modality} {sign.element} sign, ruled by planetary master {sign.rulingPlanet}"
              </p>
            </div>
          </div>

          {/* Core Description */}
          <div className="mt-6 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1.5 mb-2">
                <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "30s" }} /> Celestial Profile & Overview
              </h4>
              <p className={`text-sm leading-relaxed ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                {sign.description}
              </p>
            </div>

            {/* Parameter Pills Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
              <div className={`p-3 rounded-xl text-center border ${
                isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <p className={`text-[9px] uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Element</p>
                <p className="text-xs font-serif font-bold text-amber-500 mt-1">{sign.element}</p>
              </div>

              <div className={`p-3 rounded-xl text-center border ${
                isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <p className={`text-[9px] uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Modality</p>
                <p className="text-xs font-serif font-bold text-amber-500 mt-1">{sign.modality}</p>
              </div>

              <div className={`p-3 rounded-xl text-center border ${
                isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <p className={`text-[9px] uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Ruling Planet</p>
                <p className="text-xs font-serif font-bold text-amber-500 mt-1">🪐 {sign.rulingPlanet}</p>
              </div>

              <div className={`p-3 rounded-xl text-center border ${
                isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <p className={`text-[9px] uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Polarity</p>
                <p className="text-xs font-serif font-bold text-amber-500 mt-1">
                  {sign.element === "Fire" || sign.element === "Air" ? "阳 (Active/Yang)" : "阴 (Receptive/Yin)"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths / Weaknesses / Spheres of lifestyle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className={`p-5 rounded-2xl border ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2 mb-3">
              <Award className="w-4 h-4" /> Spiritual Powers & Strengths
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {sign.strengths.map((str) => (
                <span
                  key={str}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    isDark ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  }`}
                >
                  ✦ {str}
                </span>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className={`p-5 rounded-2xl border ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-rose-500 flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4" /> Cosmic Challenges & Shadows
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {sign.weaknesses.map((weak) => (
                <span
                  key={weak}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    isDark ? "bg-rose-500/5 border-rose-500/20 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  ▲ {weak}
                </span>
              ))}
            </div>
          </div>

          {/* Love behavior */}
          <div className={`p-5 rounded-2xl border md:col-span-2 ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div className="flex items-center gap-2 text-rose-500 mb-2">
              <Heart className="w-4.5 h-4.5 fill-rose-500/10" />
              <h4 className="font-serif font-bold text-sm">Aethel romantic & Synastry profile</h4>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {sign.loveStyle}
            </p>
          </div>

          {/* Career style */}
          <div className={`p-5 rounded-2xl border md:col-span-2 ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Briefcase className="w-4.5 h-4.5" />
              <h4 className="font-serif font-bold text-sm">Divine Calling & Career Manifestation</h4>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {sign.careerStyle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
