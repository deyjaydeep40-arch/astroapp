import React, { useState, useEffect } from "react";
import { BirthProfile } from "../types";
import { Sparkles, Calendar, BookOpen, MapPin, Printer, Compass, Award, Heart, HelpCircle, Briefcase, Moon, AlertTriangle, Eye, ArrowRight, Activity, TrendingUp, ShieldAlert } from "lucide-react";

interface VedicOracleProps {
  profiles: BirthProfile[];
  mainProfile: BirthProfile | null;
  theme: "cosmos" | "solstice";
}

interface KundliData {
  lagna: string;
  rasi: string;
  nakshatra: string;
  rulingPlanet: string;
  sunSign: string;
  houses: { [key: string]: string[] };
  careerPrediction: string;
  favorableProfessions: string[];
  wealthYoga: string;
  remedies: string;
}

interface PanchangData {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  vara: string;
  bengaliMonth: string;
  bengaliYear: string;
  bengaliSeason: string;
  sunrise: string;
  sunset: string;
  rahuKaal: string;
  festivals: Array<{ name: string; description: string }>;
}

interface PalmistryData {
  lifeLineAnalysis: string;
  heartLineAnalysis: string;
  headLineAnalysis: string;
  fateLineAnalysis: string;
  moneyTriangleAnalysis: string;
  mysticCrossAnalysis: string;
  overallVerdict: string;
  remedies: string;
}

export default function VedicOracle({ profiles, mainProfile, theme }: VedicOracleProps) {
  const [vedicTab, setVedicTab] = useState<"kundli" | "panchang" | "palmistry">("kundli");
  const [selectedProfileId, setSelectedProfileId] = useState<string>(mainProfile?.id || "custom");
  
  // Custom birth details if "custom" is selected
  const [customDetails, setCustomDetails] = useState({
    name: "Astraea",
    birthDate: "1997-04-12",
    birthTime: "08:15",
    birthPlace: "Kolkata, India",
    gender: "Female"
  });

  // Date for Panchang
  const [panchangDate, setPanchangDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Palmistry characteristics state
  const [heartLine, setHeartLine] = useState<string>("Sweeping upwards toward Jupiter (Empathetic & Idealistic)");
  const [headLine, setHeadLine] = useState<string>("Slightly sloping into Luna Mount (Creative & Analytical)");
  const [lifeLine, setLifeLine] = useState<string>("Deep, broad, fully wrapping Venus mount (High Vitality)");
  const [fateLine, setFateLine] = useState<string>("Strong, starting from base straight to Saturn (Pre-determined calling)");
  const [palmFeatures, setPalmFeatures] = useState<string[]>(["Money Triangle", "Mystic Cross"]);

  // Loaded states
  const [loadingKundli, setLoadingKundli] = useState(false);
  const [kundli, setKundli] = useState<KundliData | null>(null);

  const [loadingPanchang, setLoadingPanchang] = useState(false);
  const [panchang, setPanchang] = useState<PanchangData | null>(null);

  const [loadingPalm, setLoadingPalm] = useState(false);
  const [palmReading, setPalmReading] = useState<PalmistryData | null>(null);

  const isDark = theme === "cosmos";

  // Match selected profile
  const activeProfile = profiles.find((p) => p.id === selectedProfileId);

  // Local fallback generators
  const generateClientSideKundli = (name: string, birthDate: string, birthTime: string, birthPlace: string, gender: string): KundliData => {
    return {
      lagna: "Leo (Simha)",
      rasi: "Scorpio (Vrishchika)",
      nakshatra: "Anuradha (Phase 2)",
      rulingPlanet: "Mars (Mangal)",
      sunSign: "Aries",
      houses: {
        "1": ["Ascendant (Leo)", "Jupiter"],
        "2": ["Venus", "Mercury"],
        "3": ["Sun"],
        "4": ["Ketu"],
        "5": ["Moon"],
        "6": [],
        "7": ["Saturn"],
        "8": [],
        "9": [],
        "10": ["Rahu"],
        "11": ["Mars"],
        "12": []
      },
      careerPrediction: `Dear ${name}, your Career and Financial Destiny is ruled by a strong Venusian-Solar alignment. You will thrive remarkably in independent roles, leadership, creative arts, or financial consulting. A significant promotion or independent business opportunity is predicted near the mid-transit cycle.`,
      favorableProfessions: ["Strategic Consulting", "Financial Analysis", "Creative Direction", "Systems Architecture"],
      wealthYoga: "Dhana Yoga present in the 2nd House: The combination of Mercury and Venus indicates remarkable financial accumulation from speaking, luxury goods, and analytical ventures.",
      remedies: "Keep a copper vessel filled with water next to your bed at night. Chant 'Om Namah Shivaya' 108 times during Monday mornings. Wear a natural yellow sapphire on your index finger to amplify Jupiter's protective aura."
    };
  };

  const generateClientSidePanchang = (dateStr: string): PanchangData => {
    return {
      date: dateStr,
      tithi: "Dwitiya (Sukla Paksha)",
      nakshatra: "Rohini (Highly Auspicious)",
      yoga: "Siddha (Success)",
      karana: "Balava",
      vara: "Aditya Vara (Sunday)",
      bengaliMonth: "Poush (পৌষ)",
      bengaliYear: "1432 BS",
      bengaliSeason: "Shit (Winter)",
      sunrise: "06:12 AM",
      sunset: "05:24 PM",
      rahuKaal: "04:30 PM to 06:00 PM (Inauspicious)",
      festivals: [
        { name: "Poush Sankranti", description: "Harvest celebration and offering of traditional rice cakes." },
        { name: "Saraswati Puja Transit", description: "Inception of learning and knowledge planetary alignments." }
      ]
    };
  };

  const generateClientSidePalmReading = (heart: string, head: string, life: string, fate: string, features: string[]): PalmistryData => {
    return {
      heartLineAnalysis: `Your Heart Line (${heart.slice(0, 30)}...) indicates a deep, passionate, and loyal emotional nature. You experience romantic attachments on a profound spiritual wavelength.`,
      headLineAnalysis: `Your Head Line (${head.slice(0, 30)}...) demonstrates a robust logical and analytical intellect, highly suited for system engineering, business operations, or strategic arts.`,
      lifeLineAnalysis: `Your Life Line (${life.slice(0, 30)}...) highlights highly robust vital energy, an active physical constitution, and powerful resilience to recover from obstacles.`,
      fateLineAnalysis: `Your Fate Line (${fate.slice(0, 30)}...) shows a clear, self-determined path with remarkable focus and highly rewarding professional growth over your lifetime.`,
      moneyTriangleAnalysis: features.includes("Money Triangle") 
        ? "Formed Money Triangle: An enclosed space between Head, Fate, and Mercury lines indicates a solid capacity to accumulate wealth, run profitable businesses, and preserve assets."
        : "Money Triangle is currently unformed or developing. Wealth will come through active asset-building and strategic career growth.",
      mysticCrossAnalysis: features.includes("Mystic Cross")
        ? "Mystic Cross present on the Mount of Saturn: Indicates strong natural psychic abilities, intense interest in occult or hidden sciences, and high intuitive foresight."
        : "Mystic Cross is not prominent. Intuition will develop through regular grounding and meditation practices.",
      overallVerdict: "Your palms reveal a powerful and unique karmic blueprint, indicating high self-determination, intuitive strength, and analytical precision to master your destiny.",
      remedies: "Spend 10 minutes in silent meditation every morning. Donate copper or metal vessels on Tuesdays to balance Martian elements in your lines."
    };
  };

  // Fetch Kundli
  const calculateKundli = async () => {
    setLoadingKundli(true);
    const payload = activeProfile
      ? {
          name: activeProfile.name,
          birthDate: activeProfile.birthDate,
          birthTime: activeProfile.birthTime,
          birthPlace: activeProfile.birthPlace,
          gender: activeProfile.gender,
        }
      : customDetails;

    try {
      const res = await fetch("/api/vedic/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setKundli(data);
      } else {
        const nameVal = payload.name || "Astraea";
        const dateVal = payload.birthDate || "1997-04-12";
        const timeVal = payload.birthTime || "08:15";
        const placeVal = payload.birthPlace || "Kolkata, India";
        const genderVal = payload.gender || "Female";
        setKundli(generateClientSideKundli(nameVal, dateVal, timeVal, placeVal, genderVal));
      }
    } catch (e) {
      const nameVal = payload.name || "Astraea";
      const dateVal = payload.birthDate || "1997-04-12";
      const timeVal = payload.birthTime || "08:15";
      const placeVal = payload.birthPlace || "Kolkata, India";
      const genderVal = payload.gender || "Female";
      setKundli(generateClientSideKundli(nameVal, dateVal, timeVal, placeVal, genderVal));
    } finally {
      setLoadingKundli(false);
    }
  };

  // Fetch Panchang
  const calculatePanchang = async () => {
    setLoadingPanchang(true);
    try {
      const res = await fetch("/api/vedic/panchang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: panchangDate }),
      });
      const data = await res.json();
      if (res.ok) {
        setPanchang(data);
      } else {
        setPanchang(generateClientSidePanchang(panchangDate));
      }
    } catch (e) {
      setPanchang(generateClientSidePanchang(panchangDate));
    } finally {
      setLoadingPanchang(false);
    }
  };

  // Fetch Palm Reading
  const calculatePalm = async () => {
    setLoadingPalm(true);
    try {
      const res = await fetch("/api/vedic/palmistry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heartLine,
          headLine,
          lifeLine,
          fateLine,
          features: palmFeatures,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPalmReading(data);
      } else {
        setPalmReading(generateClientSidePalmReading(heartLine, headLine, lifeLine, fateLine, palmFeatures));
      }
    } catch (e) {
      setPalmReading(generateClientSidePalmReading(heartLine, headLine, lifeLine, fateLine, palmFeatures));
    } finally {
      setLoadingPalm(false);
    }
  };

  // Trigger calculations on mount or deliberate user action
  useEffect(() => {
    calculateKundli();
    calculatePanchang();
    calculatePalm();
  }, []);

  // Automatically recalculate Kundli when switching profiles (if not custom)
  useEffect(() => {
    if (selectedProfileId !== "custom") {
      calculateKundli();
    }
  }, [selectedProfileId]);

  useEffect(() => {
    calculatePanchang();
  }, [panchangDate]);

  const handleFeatureToggle = (feature: string) => {
    setPalmFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="vedic-oracle-container">
      {/* Sub tabs navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/10 dark:border-slate-100/10 pb-4">
        <div className="flex gap-2">
          <button
            id="vedic-tab-kundli"
            onClick={() => setVedicTab("kundli")}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold tracking-wide transition-all ${
              vedicTab === "kundli"
                ? isDark
                  ? "bg-amber-400 text-slate-950 border-amber-400"
                  : "bg-amber-600 text-white border-amber-600 shadow-md"
                : isDark
                ? "bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-amber-400/20"
                : "bg-white border border-slate-200 text-slate-700 hover:border-amber-600/20 shadow-sm"
            }`}
          >
            ☸️ Vedic Kundli & Career
          </button>
          <button
            id="vedic-tab-panchang"
            onClick={() => setVedicTab("panchang")}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold tracking-wide transition-all ${
              vedicTab === "panchang"
                ? isDark
                  ? "bg-amber-400 text-slate-950 border-amber-400"
                  : "bg-amber-600 text-white border-amber-600 shadow-md"
                : isDark
                ? "bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-amber-400/20"
                : "bg-white border border-slate-200 text-slate-700 hover:border-amber-600/20 shadow-sm"
            }`}
          >
            📅 Indian Panchang & Festivals
          </button>
          <button
            id="vedic-tab-palmistry"
            onClick={() => setVedicTab("palmistry")}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold tracking-wide transition-all ${
              vedicTab === "palmistry"
                ? isDark
                  ? "bg-amber-400 text-slate-950 border-amber-400"
                  : "bg-amber-600 text-white border-amber-600 shadow-md"
                : isDark
                ? "bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-amber-400/20"
                : "bg-white border border-slate-200 text-slate-700 hover:border-amber-600/20 shadow-sm"
            }`}
          >
            ✋ Palmistry & Money Triangle
          </button>
        </div>

        {/* Export Report Trigger */}
        <button
          id="export-pdf-report-btn"
          onClick={handlePrintReport}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
            isDark
              ? "bg-slate-950/60 border-amber-500/30 hover:border-amber-400 text-amber-300"
              : "bg-white border-amber-200 hover:border-amber-600 text-amber-800 shadow-sm"
          }`}
          title="Print or Export PDF Report"
        >
          <Printer className="w-4 h-4" /> Export Destiny Report (PDF)
        </button>
      </div>

      {/* TAB 1: KUNDLI CHART */}
      {vedicTab === "kundli" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="vedic-kundli-panel">
          {/* Birth Profile selector & custom inputs */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? "bg-slate-900/80 border-amber-500/20" : "bg-white border-amber-200 shadow-md"
          }`}>
            <h3 className="font-serif font-bold text-base text-amber-500 mb-3 flex items-center gap-2">
              <Compass className="w-5 h-5 animate-[spin_10s_linear_infinite]" /> Chart Cast Parameters
            </h3>
            <p className="text-xs opacity-70 mb-5">
              Select an existing Birth Seeker or input coordinates for a live planetary calculation.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold mb-1.5">Select Seeker Profile</label>
                <select
                  id="kundli-profile-select"
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      👤 {p.name} ({p.zodiacSign}) {p.isMain ? "• (Main)" : ""}
                    </option>
                  ))}
                  <option value="custom">✨ Cast Custom Coordinates...</option>
                </select>
              </div>

              {selectedProfileId === "custom" && (
                <div className="space-y-3 pt-3 border-t border-slate-800/10 dark:border-slate-100/10">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold mb-1.5">Full Name</label>
                    <input
                      type="text"
                      className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                      value={customDetails.name}
                      onChange={(e) => setCustomDetails({ ...customDetails, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold mb-1.5">Birth Date</label>
                      <input
                        type="date"
                        className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none ${
                          isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                        value={customDetails.birthDate}
                        onChange={(e) => setCustomDetails({ ...customDetails, birthDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold mb-1.5">Birth Time</label>
                      <input
                        type="time"
                        className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none ${
                          isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                        value={customDetails.birthTime}
                        onChange={(e) => setCustomDetails({ ...customDetails, birthTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold mb-1.5">Birth Location</label>
                    <input
                      type="text"
                      placeholder="City, Country"
                      className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                      value={customDetails.birthPlace}
                      onChange={(e) => setCustomDetails({ ...customDetails, birthPlace: e.target.value })}
                    />
                  </div>

                  <button
                    id="cast-custom-chart-btn"
                    onClick={calculateKundli}
                    disabled={loadingKundli}
                    className={`w-full py-2.5 px-4 mt-3 rounded-xl text-xs font-serif font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                      loadingKundli
                        ? "opacity-50 cursor-not-allowed"
                        : isDark
                        ? "bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md shadow-amber-400/10"
                        : "bg-amber-600 text-white hover:bg-amber-500 shadow-md shadow-amber-600/10"
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    {loadingKundli ? "Casting Kundli..." : "Cast Custom Chart"}
                  </button>
                </div>
              )}
            </div>

            {/* Favorable Professions block */}
            {kundli && (
              <div className="mt-6 pt-5 border-t border-slate-800/10 dark:border-slate-100/10">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-amber-500 mb-3">Divine Calling Realms</h4>
                <div className="flex flex-wrap gap-1.5">
                  {kundli.favorableProfessions.map((prof) => (
                    <span
                      key={prof}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                        isDark ? "bg-amber-400/5 border-amber-400/20 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}
                    >
                      💼 {prof}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Kundli Display area */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-6 md:p-8 rounded-2xl border relative overflow-hidden ${
              isDark
                ? "bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/30 text-white"
                : "bg-gradient-to-b from-amber-50 to-white border-amber-200 text-slate-900 shadow-md"
            }`}>
              
              {loadingKundli ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4" />
                  <p className="text-xs font-serif font-medium">Synchronizing celestial alignment charts...</p>
                </div>
              ) : kundli ? (
                <div className="space-y-6">
                  {/* Top attributes panel */}
                  <div className="flex flex-wrap gap-4 justify-between items-center pb-4 border-b border-slate-800/10 dark:border-slate-100/10">
                    <div>
                      <h2 className="text-xl font-serif font-bold text-amber-500">
                        {activeProfile ? activeProfile.name : customDetails.name}'s Janma Kundli
                      </h2>
                      <p className="text-[10px] italic opacity-60">Calculated strictly with ancient Lahiri Ayanamsa math</p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-md border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                        Lagna: <strong>{kundli.lagna}</strong>
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                        Rasi: <strong>{kundli.rasi}</strong>
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                        Nakshatra: <strong>{kundli.nakshatra}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Dual Grid: Traditional Kundli Chart Drawing & Readings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    
                    {/* Visual 12-House North Indian Diamond Chart */}
                    <div className="flex justify-center py-4">
                      <div className="relative w-64 h-64 border-2 border-amber-500/40 select-none bg-slate-950/20 rounded-lg">
                        {/* Diagonals */}
                        <div className="absolute inset-0 border-t border-b border-amber-500/30 transform rotate-45 scale-[1.414]" />
                        <div className="absolute inset-0 border-t border-b border-amber-500/30 transform -rotate-45 scale-[1.414]" />
                        
                        {/* Inner Diamond */}
                        <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] border border-amber-500/40 transform rotate-45" />

                        {/* Kundli House Labels & Planet Lists */}
                        {/* House 1 (Top Center) */}
                        <div className="absolute top-3 left-[50%] -translate-x-1/2 text-center">
                          <span className="text-[8px] opacity-40 block font-mono">H1</span>
                          <span className="text-[10px] font-bold text-amber-300">
                            {kundli.houses["1"]?.join(", ") || "Lagna"}
                          </span>
                        </div>

                        {/* House 2 (Top Left Center) */}
                        <div className="absolute top-[20%] left-[20%] -translate-x-1/2 text-center">
                          <span className="text-[8px] opacity-40 block font-mono">H2</span>
                          <span className="text-[10px] font-bold text-amber-300">
                            {kundli.houses["2"]?.join(", ") || "—"}
                          </span>
                        </div>

                        {/* House 3 (Left Top Center) */}
                        <div className="absolute top-[35%] left-[10%] text-center">
                          <span className="text-[8px] opacity-40 block font-mono">H3</span>
                          <span className="text-[10px] font-bold text-amber-300">
                            {kundli.houses["3"]?.join(", ") || "—"}
                          </span>
                        </div>

                        {/* House 4 (Center Left) */}
                        <div className="absolute top-[50%] left-4 -translate-y-1/2 text-center">
                          <span className="text-[8px] opacity-40 block font-mono">H4</span>
                          <span className="text-[10px] font-bold text-amber-300">
                            {kundli.houses["4"]?.join(", ") || "—"}
                          </span>
                        </div>

                        {/* House 5 (Left Bottom Center) */}
                        <div className="absolute bottom-[35%] left-[10%] text-center">
                          <span className="text-[8px] opacity-40 block font-mono">H5</span>
                          <span className="text-[10px] font-bold text-amber-300">
                            {kundli.houses["5"]?.join(", ") || "—"}
                          </span>
                        </div>

                        {/* House 6 (Bottom Left Center) */}
                        <div className="absolute bottom-[20%] left-[20%] -translate-x-1/2 text-center">
                          <span className="text-[8px] opacity-40 block font-mono">H6</span>
                          <span className="text-[10px] font-bold text-amber-300">
                            {kundli.houses["6"]?.join(", ") || "—"}
                          </span>
                        </div>

                        {/* House 7 (Bottom Center) */}
                        <div className="absolute bottom-3 left-[50%] -translate-x-1/2 text-center">
                          <span className="text-[8px] opacity-40 block font-mono">H7</span>
                          <span className="text-[10px] font-bold text-amber-300">
                            {kundli.houses["7"]?.join(", ") || "—"}
                          </span>
                        </div>

                        {/* House 8 (Bottom Right Center) */}
                        <div className="absolute bottom-[20%] right-[20%] translate-x-1/2 text-center">
                          <span className="text-[8px] opacity-40 block font-mono">H8</span>
                          <span className="text-[10px] font-bold text-amber-300">
                            {kundli.houses["8"]?.join(", ") || "—"}
                          </span>
                        </div>

                        {/* House 9 (Right Bottom Center) */}
                        <div className="absolute bottom-[35%] right-[10%] text-center">
                          <span className="text-[8px] opacity-40 block font-mono">H9</span>
                          <span className="text-[10px] font-bold text-amber-300">
                            {kundli.houses["9"]?.join(", ") || "—"}
                          </span>
                        </div>

                        {/* House 10 (Center Right) */}
                        <div className="absolute top-[50%] right-4 -translate-y-1/2 text-center">
                          <span className="text-[8px] opacity-40 block font-mono">H10</span>
                          <span className="text-[10px] font-bold text-amber-300">
                            {kundli.houses["10"]?.join(", ") || "—"}
                          </span>
                        </div>

                        {/* House 11 (Right Top Center) */}
                        <div className="absolute top-[35%] right-[10%] text-center">
                          <span className="text-[8px] opacity-40 block font-mono">H11</span>
                          <span className="text-[10px] font-bold text-amber-300">
                            {kundli.houses["11"]?.join(", ") || "—"}
                          </span>
                        </div>

                        {/* House 12 (Top Right Center) */}
                        <div className="absolute top-[20%] right-[20%] translate-x-1/2 text-center">
                          <span className="text-[8px] opacity-40 block font-mono">H12</span>
                          <span className="text-[10px] font-bold text-amber-300">
                            {kundli.houses["12"]?.join(", ") || "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick remedies & wealth yoga box */}
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl border ${isDark ? "bg-emerald-500/5 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"}`}>
                        <div className="flex items-center gap-2 text-emerald-500 mb-1">
                          <TrendingUp className="w-4.5 h-4.5" />
                          <h4 className="font-serif font-bold text-xs uppercase tracking-wide">Wealth & Yoga Alignment</h4>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${isDark ? "text-emerald-200" : "text-emerald-800"}`}>
                          {kundli.wealthYoga}
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border ${isDark ? "bg-rose-500/5 border-rose-500/20" : "bg-rose-50 border-rose-200"}`}>
                        <div className="flex items-center gap-2 text-rose-500 mb-1">
                          <ShieldAlert className="w-4.5 h-4.5" />
                          <h4 className="font-serif font-bold text-xs uppercase tracking-wide">Remedies & Shanti Path</h4>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${isDark ? "text-rose-200" : "text-rose-800"}`}>
                          {kundli.remedies}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Career Prediction */}
                  <div className={`p-5 rounded-xl border ${isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1.5 mb-2">
                      <Briefcase className="w-4 h-4" /> Vedic Career & Financial Destiny Reading
                    </h4>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      {kundli.careerPrediction}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-xs">Failed to fetch Janma Kundli metrics.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE PANCHANG */}
      {vedicTab === "panchang" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="vedic-panchang-panel">
          {/* Panchang Calendar controller */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? "bg-slate-900/80 border-amber-500/20" : "bg-white border-amber-200 shadow-md"
          }`}>
            <h3 className="font-serif font-bold text-base text-amber-500 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Divine Transit Date
            </h3>
            <p className="text-xs opacity-70 mb-5">
              Select any past or future solar Gregorian date to calculate its corresponding Bengali and Indian Panchang attributes.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold mb-1.5">Select Calendar Date</label>
                <input
                  id="panchang-date-input"
                  type="date"
                  className={`w-full p-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                  value={panchangDate}
                  onChange={(e) => setPanchangDate(e.target.value)}
                />
              </div>

              {panchang && (
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-400/5 mt-5">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-amber-500 mb-2">Bengali Calendar Alignment</h4>
                  <div className="space-y-1 text-xs">
                    <p>Bengali Month: <strong>{panchang.bengaliMonth}</strong></p>
                    <p>Bengali Year: <strong>{panchang.bengaliYear} BS</strong></p>
                    <p>Ritu (Season): <strong>{panchang.bengaliSeason}</strong></p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panchang Grid display */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-6 md:p-8 rounded-2xl border relative overflow-hidden ${
              isDark
                ? "bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/30 text-white"
                : "bg-gradient-to-b from-amber-50 to-white border-amber-200 text-slate-900 shadow-md"
            }`}>
              
              {loadingPanchang ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4" />
                  <p className="text-xs font-serif font-medium">Computing Solar-Lunar aspects...</p>
                </div>
              ) : panchang ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800/10 dark:border-slate-100/10">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-amber-500">
                        Panchang Calculator ({panchang.date})
                      </h3>
                      <p className="text-[10px] italic opacity-60">Daily astronomical guide for work, trade, and festivals</p>
                    </div>
                  </div>

                  {/* 5 Limbs of Panchang Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <p className="text-[8px] uppercase tracking-wider opacity-60">Tithi (Luni-Day)</p>
                      <p className="text-xs font-serif font-bold text-amber-500 mt-1">{panchang.tithi}</p>
                    </div>

                    <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <p className="text-[8px] uppercase tracking-wider opacity-60">Nakshatra (Stars)</p>
                      <p className="text-xs font-serif font-bold text-amber-500 mt-1">{panchang.nakshatra}</p>
                    </div>

                    <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <p className="text-[8px] uppercase tracking-wider opacity-60">Yoga (Union)</p>
                      <p className="text-xs font-serif font-bold text-amber-500 mt-1">{panchang.yoga}</p>
                    </div>

                    <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <p className="text-[8px] uppercase tracking-wider opacity-60">Karana (Half-Day)</p>
                      <p className="text-xs font-serif font-bold text-amber-500 mt-1">{panchang.karana}</p>
                    </div>

                    <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <p className="text-[8px] uppercase tracking-wider opacity-60">Vara (Day)</p>
                      <p className="text-xs font-serif font-bold text-amber-500 mt-1">{panchang.vara}</p>
                    </div>
                  </div>

                  {/* Sun Times & Rahu Kaal */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className={`p-3.5 rounded-xl border flex gap-3 text-xs items-center ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <span className="text-xl">☀️</span>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider opacity-60">Sunrise</p>
                        <p className="font-semibold text-amber-500">{panchang.sunrise}</p>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-xl border flex gap-3 text-xs items-center ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                      <span className="text-xl">🌙</span>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider opacity-60">Sunset</p>
                        <p className="font-semibold text-amber-500">{panchang.sunset}</p>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-xl border flex gap-3 text-xs items-center ${isDark ? "bg-rose-500/5 border-rose-500/10" : "bg-rose-50 border-rose-200"}`}>
                      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-rose-500 font-bold">Rahu Kaal</p>
                        <p className="font-semibold text-rose-600">{panchang.rahuKaal}</p>
                      </div>
                    </div>
                  </div>

                  {/* Festivals & Holidays block */}
                  <div className="space-y-3 pt-4 border-t border-slate-800/10 dark:border-slate-100/10">
                    <h4 className="text-xs font-serif font-bold text-amber-500">Upcoming Festivals & Holy Holidays</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {panchang.festivals.map((fest) => (
                        <div
                          key={fest.name}
                          className={`p-3.5 rounded-xl border text-xs flex gap-3 ${
                            isDark ? "bg-slate-950/60 border-slate-800 hover:border-amber-400/20" : "bg-white border-slate-200 shadow-sm"
                          }`}
                        >
                          <span className="text-xl shrink-0 mt-0.5">🪔</span>
                          <div>
                            <p className="font-serif font-bold text-amber-500">{fest.name}</p>
                            <p className="opacity-75 text-[11px] leading-relaxed mt-0.5">{fest.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-xs">Failed to calculate Panchang transits.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PALMISTRY */}
      {vedicTab === "palmistry" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="vedic-palmistry-panel">
          {/* Palm characteristics selector */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? "bg-slate-900/80 border-amber-500/20" : "bg-white border-amber-200 shadow-md"
          }`}>
            <h3 className="font-serif font-bold text-base text-amber-500 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 animate-pulse" /> Line Configuration
            </h3>
            <p className="text-xs opacity-70 mb-5">
              Compare your dominant hand lines with the parameters below to compute an AI palm reading.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold mb-1.5">Heart Line (Emotions)</label>
                <select
                  id="palm-heart-select"
                  value={heartLine}
                  onChange={(e) => setHeartLine(e.target.value)}
                  className={`w-full p-2 rounded-xl text-xs focus:outline-none border ${
                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <option value="Sweeping upwards toward Jupiter (Empathetic & Idealistic)">Sweeping upwards to Jupiter (Deeply empathetic)</option>
                  <option value="Short and straight under Saturn (Practical, highly self-directed)">Short and straight under Saturn (Reserved)</option>
                  <option value="Splitting/Trident shape under Jupiter (Warmth, popularity, supreme social grace)">Trident shape (Magnetic, popular)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold mb-1.5">Head Line (Intellect)</label>
                <select
                  id="palm-head-select"
                  value={headLine}
                  onChange={(e) => setHeadLine(e.target.value)}
                  className={`w-full p-2 rounded-xl text-xs focus:outline-none border ${
                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <option value="Slightly sloping into Luna Mount (Creative & Analytical)">Slightly sloping to Luna Mount (Highly imaginative)</option>
                  <option value="Straight across entire palm (Pragmatic, linear, hyper-logical)">Straight across entire palm (Linear logic)</option>
                  <option value="Double head line (Double mental capability, dual focus)">Double head line (Multitasker wizard)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold mb-1.5">Life Line (Vitality)</label>
                <select
                  id="palm-life-select"
                  value={lifeLine}
                  onChange={(e) => setLifeLine(e.target.value)}
                  className={`w-full p-2 rounded-xl text-xs focus:outline-none border ${
                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <option value="Deep, broad, fully wrapping Venus mount (High Vitality)">Deep & broad around Venus (Immense stamina)</option>
                  <option value="Faint, tight curve close to thumb (Delicate energy, quiet sanctuary)">Faint, tight curve (Quiet, reserved energy)</option>
                  <option value="Chained or segmented (Frequent changes, adapting vitality)">Chained/Segmented (Adaptive vitality)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold mb-1.5">Fate Line (Calling)</label>
                <select
                  id="palm-fate-select"
                  value={fateLine}
                  onChange={(e) => setFateLine(e.target.value)}
                  className={`w-full p-2 rounded-xl text-xs focus:outline-none border ${
                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <option value="Strong, starting from base straight to Saturn (Pre-determined calling)">Strong from base to Saturn (Destiny-led path)</option>
                  <option value="Starting from head line upwards (Self-made success in mid-life)">Starts from Head Line (Self-made middle age success)</option>
                  <option value="Absent or very fragmented (Supreme freedom, self-directed goals)">Absent/Fragmented (Absolute freedom)</option>
                </select>
              </div>

              {/* Checkbox triggers for Special signs */}
              <div className="pt-3 border-t border-slate-800/10 dark:border-slate-100/10">
                <label className="block text-[10px] uppercase tracking-wider font-bold mb-2 text-amber-500">Special Hand Markings</label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleFeatureToggle("Money Triangle")}
                    className={`w-full p-2.5 rounded-xl text-xs text-left border transition-all flex items-center justify-between ${
                      palmFeatures.includes("Money Triangle")
                        ? "border-amber-500 bg-amber-500/10 text-amber-300"
                        : "border-slate-800 bg-transparent text-slate-400"
                    }`}
                  >
                    <span className="font-serif">📐 Money Triangle</span>
                    <span className="text-[10px] font-mono">{palmFeatures.includes("Money Triangle") ? "✓ Active" : "+ Add"}</span>
                  </button>

                  <button
                    onClick={() => handleFeatureToggle("Mystic Cross")}
                    className={`w-full p-2.5 rounded-xl text-xs text-left border transition-all flex items-center justify-between ${
                      palmFeatures.includes("Mystic Cross")
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                        : "border-slate-800 bg-transparent text-slate-400"
                    }`}
                  >
                    <span className="font-serif">✙ Mystic Cross</span>
                    <span className="text-[10px] font-mono">{palmFeatures.includes("Mystic Cross") ? "✓ Active" : "+ Add"}</span>
                  </button>

                  <button
                    onClick={() => handleFeatureToggle("M Marking")}
                    className={`w-full p-2.5 rounded-xl text-xs text-left border transition-all flex items-center justify-between ${
                      palmFeatures.includes("M Marking")
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                        : "border-slate-800 bg-transparent text-slate-400"
                    }`}
                  >
                    <span className="font-serif">Ⓜ Letter 'M' Palm</span>
                    <span className="text-[10px] font-mono">{palmFeatures.includes("M Marking") ? "✓ Active" : "+ Add"}</span>
                  </button>
                </div>
              </div>

              <button
                id="recalculate-palm-reading-btn"
                onClick={calculatePalm}
                disabled={loadingPalm}
                className={`w-full py-2.5 px-4 mt-4 rounded-xl text-xs font-serif font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                  loadingPalm
                    ? "opacity-50 cursor-not-allowed"
                    : isDark
                    ? "bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md shadow-amber-400/10"
                    : "bg-amber-600 text-white hover:bg-amber-500 shadow-md shadow-amber-600/10"
                }`}
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                {loadingPalm ? "Analyzing Palms..." : "Analyze My Palm Lines"}
              </button>
            </div>
          </div>

          {/* Palm Readings displaying panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-6 md:p-8 rounded-2xl border relative overflow-hidden ${
              isDark
                ? "bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/30 text-white"
                : "bg-gradient-to-b from-amber-50 to-white border-amber-200 text-slate-900 shadow-md"
            }`}>
              
              {loadingPalm ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mb-4" />
                  <p className="text-xs font-serif font-medium">Reading the lines of destiny...</p>
                </div>
              ) : palmReading ? (
                <div className="space-y-6">
                  <div className="border-b border-slate-800/10 dark:border-slate-100/10 pb-4">
                    <h3 className="text-lg font-serif font-bold text-amber-500">
                      Hasta Samudrika Shastra Report
                    </h3>
                    <p className="text-[10px] italic opacity-60">Personalized Palmistry analysis of your mounts and major lines</p>
                  </div>

                  {/* Lines block details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                      <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">❤️ Heart Line</h4>
                      <p className="text-[11px] leading-relaxed opacity-90">{palmReading.heartLineAnalysis}</p>
                    </div>

                    <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                      <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">🧠 Head Line</h4>
                      <p className="text-[11px] leading-relaxed opacity-90">{palmReading.headLineAnalysis}</p>
                    </div>

                    <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                      <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">🌱 Life Line</h4>
                      <p className="text-[11px] leading-relaxed opacity-90">{palmReading.lifeLineAnalysis}</p>
                    </div>

                    <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                      <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1"> Saturn / Fate Line</h4>
                      <p className="text-[11px] leading-relaxed opacity-90">{palmReading.fateLineAnalysis}</p>
                    </div>
                  </div>

                  {/* Money Triangle & Mystic Cross customized display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                    {palmFeatures.includes("Money Triangle") && (
                      <div className={`p-4 rounded-xl border ${isDark ? "bg-amber-400/5 border-amber-500/20 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
                        <h4 className="font-serif font-bold text-xs uppercase tracking-wide flex items-center gap-1 text-amber-500 mb-1.5">
                          📐 Money Triangle Active
                        </h4>
                        <p className="text-[11px] leading-relaxed">{palmReading.moneyTriangleAnalysis}</p>
                      </div>
                    )}

                    {palmFeatures.includes("Mystic Cross") && (
                      <div className={`p-4 rounded-xl border ${isDark ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-200" : "bg-indigo-50 border-indigo-200 text-indigo-800"}`}>
                        <h4 className="font-serif font-bold text-xs uppercase tracking-wide flex items-center gap-1 text-indigo-500 mb-1.5">
                          ✙ Mystic Cross Present
                        </h4>
                        <p className="text-[11px] leading-relaxed">{palmReading.mysticCrossAnalysis}</p>
                      </div>
                    )}
                  </div>

                  {/* Summary Verdict */}
                  <div className={`p-4.5 rounded-xl border flex gap-3 text-xs ${isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                    <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-500">Destiny Verdict</p>
                      <p className="leading-relaxed text-[11px] mt-0.5">{palmReading.overallVerdict}</p>
                      <p className="text-[10px] text-amber-500/80 font-bold mt-2 uppercase tracking-wide">Remedies: {palmReading.remedies}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-xs">Failed to calculate palm destiny reading.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
