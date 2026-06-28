import React, { useState, useEffect } from "react";
import { BirthProfile, CompatibilityData } from "../types";
import { zodiacSigns } from "../data/zodiac";
import { Heart, RefreshCw, AlertCircle, Copy, Check, Star, HelpCircle, Share2, Compass } from "lucide-react";

interface CompatibilityViewProps {
  profiles: BirthProfile[];
  theme: "cosmos" | "solstice";
  onNavigateToTab?: (tab: string, initialQuery?: string) => void;
}

export default function CompatibilityView({ profiles, theme, onNavigateToTab }: CompatibilityViewProps) {
  const [person1, setPerson1] = useState<string>("Self");
  const [sign1, setSign1] = useState<string>("Aries");
  
  const [person2, setPerson2] = useState<string>("Partner");
  const [sign2, setSign2] = useState<string>("Leo");

  const [result, setResult] = useState<CompatibilityData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-fill from profiles when profiles change or load
  useEffect(() => {
    if (profiles.length >= 2) {
      const main = profiles.find((p) => p.isMain) || profiles[0];
      const second = profiles.find((p) => p.id !== main.id) || profiles[1];
      
      setPerson1(main.name);
      setSign1(main.zodiacSign);
      
      setPerson2(second.name);
      setSign2(second.zodiacSign);
    } else if (profiles.length === 1) {
      setPerson1(profiles[0].name);
      setSign1(profiles[0].zodiacSign);
    }
  }, [profiles]);

  const generateClientSideCompatibility = (s1: string, s2: string): any => {
    const sum1 = s1.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const sum2 = s2.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const overallScore = 65 + ((sum1 + sum2) % 31);
    const romance = 60 + ((sum1 * 2) % 36);
    const communication = 65 + ((sum2 * 3) % 31);
    const values = 70 + ((sum1 + sum2 * 4) % 26);
    const challenges = 50 + ((sum1 - sum2 + 200) % 41);

    return {
      overallScore,
      categories: {
        romance,
        communication,
        values,
        challenges
      },
      verdict: `An auspicious cosmic merger between ${s1} and ${s2}. Your mutual elements create an atmospheric harmony that encourages personal growth and dynamic co-creation.`,
      goldenRule: `Celebrate your differences as unique strengths. A strong relationship is a beautiful dance of two individual stars.`,
      romanticAnalysis: `The attraction vectors between ${s1} and ${s2} are guided by harmonious planetary rays. Venus and Mars are in mutual reception, creating a natural flow of physical magnetics and comfortable emotional security.`,
      communicationAnalysis: `Mercury sits in a highly cooperative alignment for you both. Even when differences of opinion arise, you have the mutual capability to listen actively and express your inner truths clearly.`,
      valuesAnalysis: `In terms of life goals and core values, your charts indicate a highly cooperative structure. You both value stability, integrity, and mutual growth. While your approaches may differ slightly, your destination remains beautifully synchronized.`,
      challengesAnalysis: `The primary celestial challenge arises during Saturn retrogrades, where minor stubbornness or unexpressed expectations might create temporary distance. Overcome this by practicing active, compassionate listening.`
    };
  };

  const calculateCompatibility = async () => {
    setLoading(true);
    setError(null);

    const profile1 = profiles.find(p => p.name === person1);
    const profile2 = profiles.find(p => p.name === person2);

    try {
      const response = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sign1,
          name1: person1,
          birthData1: profile1 ? { date: profile1.birthDate, time: profile1.birthTime, place: profile1.birthPlace } : null,
          sign2,
          name2: person2,
          birthData2: profile2 ? { date: profile2.birthDate, time: profile2.birthTime, place: profile2.birthPlace } : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Synastry calculation failed. Try again.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      const localData = generateClientSideCompatibility(sign1, sign2);
      setResult(localData);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (!result) return;
    const shareText = `🌌 Relationship Synastry Chart between ${person1} (${sign1}) & ${person2} (${sign2}):
💖 Overall Compatibility: ${result.overallScore}%
💬 Romance: ${result.categories.romance}% | Communication: ${result.categories.communication}% | Core Values: ${result.categories.values}%
📜 Oracle Verdict: "${result.verdict}"
🔑 Golden Rule: "${result.goldenRule}"

Calculate your compatibility charts, daily horoscopes and chat with the AI Oracle at Celestial Guide!`;

    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const s1Details = zodiacSigns.find((s) => s.name === sign1);
  const s2Details = zodiacSigns.find((s) => s.name === sign2);
  const isDark = theme === "cosmos";

  return (
    <div className="space-y-6" id="compatibility-view-container">
      {/* Input Synastry Settings */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? "bg-slate-900/80 border-amber-500/20" : "bg-white border-amber-200 shadow-md"
      }`}>
        <h3 className={`text-lg font-serif font-bold ${isDark ? "text-amber-200" : "text-amber-800"}`}>
          Synastry & Compatibility Calculator
        </h3>
        <p className={`text-xs mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Analyze the planetary configuration, elements, and modalities between two charts to calculate relationship synastry.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Decorative vs line */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border items-center justify-center font-serif font-bold text-xs shadow z-10 bg-slate-950 text-amber-500 border-amber-500/30">
            VS
          </div>

          {/* First Seeker */}
          <div className={`p-5 rounded-xl border ${
            isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isDark ? "bg-amber-400/10 text-amber-300" : "bg-amber-100 text-amber-800"
            }`}>
              First Soul
            </span>

            <div className="mt-4 space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Name or Designation
                </label>
                {profiles.length > 0 ? (
                  <select
                    id="comp-person1-select"
                    value={person1}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPerson1(val);
                      const matched = profiles.find(p => p.name === val);
                      if (matched) setSign1(matched.zodiacSign);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-slate-900 border-slate-800 text-white focus:ring-amber-400/40"
                        : "bg-white border-slate-200 text-slate-800 focus:ring-amber-600/40"
                    }`}
                  >
                    <option value="Self">Custom Seeker</option>
                    {profiles.map(p => (
                      <option key={p.id} value={p.name}>{p.name} ({p.zodiacSign})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="comp-person1-input"
                    type="text"
                    value={person1}
                    onChange={(e) => setPerson1(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-slate-900 border-slate-800 text-white focus:ring-amber-400/40"
                        : "bg-white border-slate-200 text-slate-800 focus:ring-amber-600/40"
                    }`}
                  />
                )}
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Zodiac Sign
                </label>
                <select
                  id="comp-sign1-select"
                  value={sign1}
                  onChange={(e) => setSign1(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-slate-900 border-slate-800 text-white focus:ring-amber-400/40"
                      : "bg-white border-slate-200 text-slate-800 focus:ring-amber-600/40"
                  }`}
                >
                  {zodiacSigns.map(z => (
                    <option key={z.name} value={z.name}>{z.symbol} {z.name} ({z.dateRange})</option>
                  ))}
                </select>
              </div>

              {s1Details && (
                <div className="text-[11px] opacity-80 space-y-1">
                  <p>Element: <span className="font-semibold text-amber-500">{s1Details.element}</span></p>
                  <p>Modality: <span className="font-semibold text-amber-500">{s1Details.modality}</span></p>
                </div>
              )}
            </div>
          </div>

          {/* Second Seeker */}
          <div className={`p-5 rounded-xl border ${
            isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isDark ? "bg-amber-400/10 text-amber-300" : "bg-amber-100 text-amber-800"
            }`}>
              Second Soul
            </span>

            <div className="mt-4 space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Name or Designation
                </label>
                {profiles.length > 0 ? (
                  <select
                    id="comp-person2-select"
                    value={person2}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPerson2(val);
                      const matched = profiles.find(p => p.name === val);
                      if (matched) setSign2(matched.zodiacSign);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-slate-900 border-slate-800 text-white focus:ring-amber-400/40"
                        : "bg-white border-slate-200 text-slate-800 focus:ring-amber-600/40"
                    }`}
                  >
                    <option value="Partner">Custom Partner</option>
                    {profiles.map(p => (
                      <option key={p.id} value={p.name}>{p.name} ({p.zodiacSign})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="comp-person2-input"
                    type="text"
                    value={person2}
                    onChange={(e) => setPerson2(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-slate-900 border-slate-800 text-white focus:ring-amber-400/40"
                        : "bg-white border-slate-200 text-slate-800 focus:ring-amber-600/40"
                    }`}
                  />
                )}
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? "text-slate-400" : "text-slate-700"}`}>
                  Zodiac Sign
                </label>
                <select
                  id="comp-sign2-select"
                  value={sign2}
                  onChange={(e) => setSign2(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-slate-900 border-slate-800 text-white focus:ring-amber-400/40"
                      : "bg-white border-slate-200 text-slate-800 focus:ring-amber-600/40"
                  }`}
                >
                  {zodiacSigns.map(z => (
                    <option key={z.name} value={z.name}>{z.symbol} {z.name} ({z.dateRange})</option>
                  ))}
                </select>
              </div>

              {s2Details && (
                <div className="text-[11px] opacity-80 space-y-1">
                  <p>Element: <span className="font-semibold text-amber-500">{s2Details.element}</span></p>
                  <p>Modality: <span className="font-semibold text-amber-500">{s2Details.modality}</span></p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            id="calculate-synastry-btn"
            onClick={calculateCompatibility}
            disabled={loading}
            className={`px-8 py-3 rounded-full text-sm font-semibold tracking-wide shadow-md transition-all flex items-center gap-2 ${
              isDark
                ? "bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950"
                : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white"
            } disabled:opacity-50`}
          >
            {loading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Merging Orbits...</>
            ) : (
              <><Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" /> Compute Synastry Chart</>
            )}
          </button>
        </div>
      </div>

      {/* Output Results */}
      {loading ? (
        <div className={`p-12 text-center rounded-2xl border flex flex-col items-center justify-center min-h-[300px] ${
          isDark ? "bg-slate-900/50 border-amber-500/10" : "bg-white/80 border-amber-200 shadow"
        }`}>
          <RefreshCw className="w-10 h-10 animate-spin text-amber-500 mb-4" />
          <h4 className="text-lg font-serif font-semibold text-amber-500 animate-pulse">Calculating Sacred Synastry...</h4>
          <p className={`text-xs mt-1 max-w-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Evaluating aspect grids, elemental synergy index, and planetary house overlays between {person1} and {person2}...
          </p>
        </div>
      ) : error ? (
        <div className={`p-6 rounded-2xl border flex gap-4 items-start ${
          isDark ? "bg-rose-950/30 border-rose-900/40 text-rose-200" : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Synastry Misalignment</h4>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      ) : result ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Main score card */}
          <div className={`p-6 md:p-8 rounded-2xl border relative overflow-hidden ${
            isDark
              ? "bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/30 text-white"
              : "bg-gradient-to-b from-amber-50 to-white border-amber-200 text-slate-900 shadow-md"
          }`}>
            <div className="flex flex-col md:flex-row items-center gap-6 justify-between border-b border-slate-800/10 dark:border-slate-100/10 pb-6">
              <div className="flex items-center gap-5">
                <span className="text-4xl">{s1Details?.symbol}</span>
                <span className="text-2xl font-serif text-amber-500 font-bold">&</span>
                <span className="text-4xl">{s2Details?.symbol}</span>
                <div>
                  <h3 className="text-xl font-serif font-bold">
                    {person1} & {person2}
                  </h3>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Synastry Chart Compatibility • {sign1} & {sign2}
                  </p>
                </div>
              </div>

              {/* Share & Copy button */}
              <button
                id="share-compatibility-btn"
                onClick={handleShare}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  copied
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : isDark
                    ? "bg-slate-950/80 border-slate-800 hover:border-amber-400/40 text-amber-200"
                    : "bg-slate-50 border-slate-200 hover:border-amber-600/40 text-amber-800"
                }`}
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5" /> Copied!</>
                ) : (
                  <><Share2 className="w-3.5 h-3.5" /> Share Synastry</>
                )}
              </button>
            </div>

            {/* Overall Score Circle Indicator */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-800/10 dark:border-slate-100/10 bg-slate-950/20">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3">Overall Synastry Rate</p>
                <div className="relative flex items-center justify-center w-36 h-36">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="64" stroke="currentColor" className="text-slate-800/20" strokeWidth="6" fill="transparent" />
                    <circle cx="72" cy="72" r="64" stroke="url(#celestialGrad)" strokeWidth="8" fill="transparent" strokeDasharray={402} strokeDashoffset={402 - (402 * result.overallScore) / 100} strokeLinecap="round" />
                    <defs>
                      <linearGradient id="celestialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold font-mono text-amber-500">{result.overallScore}%</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Matched</span>
                  </div>
                </div>
              </div>

              {/* Categorized ratings list */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" /> Romantic & Magnetic Attraction</span>
                    <span className="font-mono">{result.categories?.romance || 80}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800/20 dark:bg-slate-100/10 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${result.categories?.romance || 80}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-blue-500" /> Communication & Intellect</span>
                    <span className="font-mono">{result.categories?.communication || 80}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800/20 dark:bg-slate-100/10 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${result.categories?.communication || 80}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-500" /> Core Values & Purpose</span>
                    <span className="font-mono">{result.categories?.values || 80}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800/20 dark:bg-slate-100/10 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${result.categories?.values || 80}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-yellow-600" /> Karmic Obstacles & Challenges</span>
                    <span className="font-mono">{result.categories?.challenges || 70}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800/20 dark:bg-slate-100/10 overflow-hidden">
                    <div className="h-full bg-yellow-600 rounded-full" style={{ width: `${result.categories?.challenges || 70}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Verdict and Golden Rule */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border border-l-4 border-amber-500 text-xs ${
                isDark ? "bg-amber-400/5 border-amber-400/20" : "bg-amber-50/50 border-amber-200"
              }`}>
                <p className="font-bold uppercase tracking-wider text-[10px] text-amber-500">Divine Oracle Verdict</p>
                <p className="mt-1 leading-relaxed italic">"{result.verdict}"</p>
              </div>

              <div className={`p-4 rounded-xl border border-l-4 border-rose-500 text-xs ${
                isDark ? "bg-rose-400/5 border-rose-400/20" : "bg-rose-50/50 border-rose-200"
              }`}>
                <p className="font-bold uppercase tracking-wider text-[10px] text-rose-500">Sacred Relationship Rule</p>
                <p className="mt-1 leading-relaxed italic">"{result.goldenRule}"</p>
              </div>
            </div>
          </div>

          {/* Deep Synastry Analysis breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-5 rounded-2xl border ${
              isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <h4 className="font-serif font-bold text-amber-500 text-sm mb-2">Astral & Romantic Connection</h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {result.romanticAnalysis}
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${
              isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <h4 className="font-serif font-bold text-blue-500 text-sm mb-2">Mental & Communicative Synergy</h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {result.communicationAnalysis}
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${
              isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <h4 className="font-serif font-bold text-emerald-500 text-sm mb-2">Shared Values & Spiritual Path</h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {result.valuesAnalysis}
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${
              isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <h4 className="font-serif font-bold text-yellow-500 text-sm mb-2">Karmic Lessons & Growth Challenges</h4>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {result.challengesAnalysis}
              </p>
            </div>
          </div>

          {/* Direct link to Oracle Chat for compatibility */}
          <div className={`p-6 rounded-2xl border text-center space-y-4 ${
            isDark ? "bg-slate-900/50 border-amber-500/10" : "bg-amber-50/30 border-amber-200"
          }`}>
            <h4 className={`text-base font-serif font-bold ${isDark ? "text-amber-200" : "text-amber-800"}`}>
              Do you want deep insights into this synastry?
            </h4>
            <p className={`text-xs max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Ask our Celestial Oracle about how to resolve the karmic challenges between {person1} and {person2}, or how to maximize your communication and romantic potential.
            </p>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab("oracle", `Can you analyze the relationship compatibility and karmic challenges between ${person1} (${sign1}) and ${person2} (${sign2}) in more depth? Our overall matching score is ${result.overallScore}%.`)}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg hover:scale-105 cursor-pointer ${
                isDark
                  ? "bg-amber-400 hover:bg-amber-300 text-slate-950"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }`}
            >
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>Ask Oracle About This Compatibility</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8">Press "Compute Synastry Chart" above to calculate alignment.</div>
      )}
    </div>
  );
}
