import React, { useState, useEffect } from "react";
import CosmicBackground from "./components/CosmicBackground";
import HoroscopeView from "./components/HoroscopeView";
import CompatibilityView from "./components/CompatibilityView";
import AstroChat from "./components/AstroChat";
import ProfileManagement from "./components/ProfileManagement";
import ZodiacDirectory from "./components/ZodiacDirectory";
import NotificationsPanel from "./components/NotificationsPanel";
import VedicOracle from "./components/VedicOracle";
import { BirthProfile, AstroAlert } from "./types";
import { getZodiacSign } from "./data/zodiac";
import { Sparkles, Moon, Sun, User, Heart, Star, Compass, Bell, BookOpen, Share2, Facebook, Twitter, MessageSquare, Menu, X, Info } from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState<"cosmos" | "solstice">("cosmos");
  const [activeTab, setActiveTab] = useState<"horoscope" | "compatibility" | "oracle" | "vedic" | "seekers" | "library" | "alerts">("horoscope");
  const [chatInitialQuery, setChatInitialQuery] = useState<string | undefined>(undefined);

  const handleNavigateToTab = (tab: "horoscope" | "compatibility" | "oracle" | "vedic" | "seekers" | "library" | "alerts", query?: string) => {
    setActiveTab(tab);
    if (query) {
      setChatInitialQuery(query);
    }
  };
  
  // Birth Seekers state
  const [profiles, setProfiles] = useState<BirthProfile[]>(() => {
    const stored = localStorage.getItem("celestial_seekers");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }
    // Seed default seeker
    return [
      {
        id: "default-seeker",
        name: "Astraea",
        birthDate: "1997-04-12",
        birthTime: "08:15",
        birthPlace: "Athens, Greece",
        zodiacSign: "Aries",
        gender: "Female",
        notes: "Seeking destiny path and synastry insights.",
        isMain: true,
      },
    ];
  });

  // Cosmic alerts / notifications state
  const [alerts, setAlerts] = useState<AstroAlert[]>(() => {
    const stored = localStorage.getItem("celestial_alerts");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: "alert-1",
        title: "Mercury Direct",
        body: "Mercury ends its retrograde period in Aries today. Mental blockages dissolve, allowing direct, courageous communications.",
        time: "Just now",
        type: "retrograde",
        read: false,
      },
      {
        id: "alert-2",
        title: "Full Moon in Scorpio",
        body: "A highly intense, transformative Full Moon illuminates the skies. Expect deep emotional revelations and spiritual rebirth.",
        time: "2 hours ago",
        type: "moon",
        read: false,
      },
      {
        id: "alert-3",
        title: "Sunrise Solar Reading Available",
        body: "Your customized daily horoscope based on the Athens morning transits is fully calculated with 100% celestial accuracy.",
        time: "6 hours ago",
        type: "horoscope",
        read: true,
      },
    ];
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("celestial_seekers", JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem("celestial_alerts", JSON.stringify(alerts));
  }, [alerts]);

  const mainProfile = profiles.find((p) => p.isMain) || profiles[0] || null;

  const handleAddProfile = (newProfile: Omit<BirthProfile, "id">) => {
    const profile: BirthProfile = {
      ...newProfile,
      id: Date.now().toString(),
    };
    setProfiles((prev) => [...prev, profile]);
    
    // Add an alert notifying that a new profile was cast
    handleAddAlert(
      "Profile Cast",
      `The natal chart of ${profile.name} (${profile.zodiacSign}) has been perfectly synchronized with the cosmic mainframe.`,
      "general"
    );
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSetMainProfile = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => ({
        ...p,
        isMain: p.id === id,
      }))
    );
  };

  const handleMarkRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const handleClearAllAlerts = () => {
    setAlerts([]);
  };

  const handleAddAlert = (title: string, body: string, type: AstroAlert["type"]) => {
    const newAlert: AstroAlert = {
      id: Date.now().toString(),
      title,
      body,
      time: "Just now",
      type,
      read: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleSimulateAlert = (type: AstroAlert["type"]) => {
    if (type === "horoscope") {
      handleAddAlert(
        "Dawn Alignment Complete",
        "The Sun and Venus form a beautiful trine in your relationship sector today. Harmony flows effortlessly.",
        "horoscope"
      );
    } else if (type === "retrograde") {
      handleAddAlert(
        "Mercury Retrograde Warning",
        "Mercury is entering retrograde motion. Triple-check flight schedules, emails, and avoid signing binding covenants.",
        "retrograde"
      );
    } else if (type === "moon") {
      handleAddAlert(
        "Waning Gibbous Phase",
        "The moon enters its waning phase, encouraging releasing of toxic thoughts, baggage, and outdated habits.",
        "moon"
      );
    } else {
      handleAddAlert(
        "Cosmic Solstice Inbound",
        "A rare celestial gateway opens, offering maximum energetic alignment with 100% predictive precision.",
        "general"
      );
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "cosmos" ? "solstice" : "cosmos"));
  };

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  const handleShareApp = (platform: "fb" | "tw" | "wa" | "copy") => {
    const text = "🔮 Explore daily horoscopes, compute birth compatibility charts, and chat with the AI Oracle at Celestial Guide!";
    const url = window.location.href;

    if (platform === "fb") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "tw") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "wa") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      alert("App share link copied to clipboard!");
    }
    setShowShareModal(false);
  };

  const isDark = theme === "cosmos";

  return (
    <div className={`min-h-screen relative flex flex-col font-sans transition-colors duration-1000 ${
      isDark ? "text-white" : "text-slate-900"
    }`}>
      {/* Background Component */}
      <CosmicBackground theme={theme} />

      {/* Primary Header */}
      <header className={`border-b backdrop-blur-md sticky top-0 z-40 transition-colors ${
        isDark ? "bg-slate-950/65 border-amber-500/20" : "bg-white/70 border-amber-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
              {/* Rotating outer ring */}
              <div className="absolute inset-0 border border-amber-500/30 rounded-full animate-spin-slow" />
              {/* Counter-rotating inner ring */}
              <div className="absolute w-7 h-7 border border-dashed border-amber-400/40 rounded-full animate-spin-slow-reverse" />
              {/* Golden Core Star */}
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse relative z-10" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-serif font-bold tracking-[0.18em] uppercase bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent leading-none">
                Celestial Guide
              </h1>
              <p className={`text-[9px] uppercase tracking-[0.2em] font-mono mt-1 font-semibold ${isDark ? "text-amber-400/80" : "text-amber-800"}`}>
                Astrological Precision Engine
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              id="nav-horoscope"
              onClick={() => setActiveTab("horoscope")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer border ${
                activeTab === "horoscope"
                  ? isDark
                    ? "bg-amber-400/10 text-amber-200 border-amber-400/70 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                    : "bg-amber-100 text-amber-900 border-amber-400/80 shadow-sm"
                  : isDark
                    ? "border-transparent text-slate-400 hover:text-amber-200 hover:border-amber-400/30 hover:bg-slate-900/40"
                    : "border-transparent text-slate-600 hover:text-amber-900 hover:border-amber-600/30 hover:bg-slate-100/50"
              }`}
            >
              <Star className="w-3.5 h-3.5" /> Daily Horoscope
            </button>

            <button
              id="nav-compatibility"
              onClick={() => setActiveTab("compatibility")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer border ${
                activeTab === "compatibility"
                  ? isDark
                    ? "bg-amber-400/10 text-amber-200 border-amber-400/70 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                    : "bg-amber-100 text-amber-900 border-amber-400/80 shadow-sm"
                  : isDark
                    ? "border-transparent text-slate-400 hover:text-amber-200 hover:border-amber-400/30 hover:bg-slate-900/40"
                    : "border-transparent text-slate-600 hover:text-amber-900 hover:border-amber-600/30 hover:bg-slate-100/50"
              }`}
            >
              <Heart className="w-3.5 h-3.5" /> Compatibility Charts
            </button>

            <button
              id="nav-oracle"
              onClick={() => setActiveTab("oracle")}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all flex items-center gap-2 border-2 cursor-pointer ${
                activeTab === "oracle"
                  ? isDark 
                    ? "bg-amber-400 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]" 
                    : "bg-amber-600 text-white border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.2)]"
                  : isDark
                    ? "bg-slate-900/65 border-amber-500/30 text-amber-300 hover:border-amber-400/60 hover:bg-slate-900"
                    : "bg-amber-50/60 border-amber-200 text-amber-800 hover:border-amber-500 hover:bg-amber-50"
              }`}
            >
              <Compass className="w-4 h-4 text-amber-500 dark:text-amber-300 animate-spin-slow" />
              <span>✨ Astro Oracle Chat</span>
            </button>

            <button
              id="nav-vedic"
              onClick={() => setActiveTab("vedic")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer border ${
                activeTab === "vedic"
                  ? isDark
                    ? "bg-amber-400/10 text-amber-200 border-amber-400/70 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                    : "bg-amber-100 text-amber-900 border-amber-400/80 shadow-sm"
                  : isDark
                    ? "border-transparent text-slate-400 hover:text-amber-200 hover:border-amber-400/30 hover:bg-slate-900/40"
                    : "border-transparent text-slate-600 hover:text-amber-900 hover:border-amber-600/30 hover:bg-slate-100/50"
              }`}
            >
              <span>☸️</span> Vedic & Palmistry
            </button>

            <button
              id="nav-seekers"
              onClick={() => setActiveTab("seekers")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer border ${
                activeTab === "seekers"
                  ? isDark
                    ? "bg-amber-400/10 text-amber-200 border-amber-400/70 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                    : "bg-amber-100 text-amber-900 border-amber-400/80 shadow-sm"
                  : isDark
                    ? "border-transparent text-slate-400 hover:text-amber-200 hover:border-amber-400/30 hover:bg-slate-900/40"
                    : "border-transparent text-slate-600 hover:text-amber-900 hover:border-amber-600/30 hover:bg-slate-100/50"
              }`}
            >
              <User className="w-3.5 h-3.5" /> Birth Seekers
            </button>

            <button
              id="nav-library"
              onClick={() => setActiveTab("library")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer border ${
                activeTab === "library"
                  ? isDark
                    ? "bg-amber-400/10 text-amber-200 border-amber-400/70 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                    : "bg-amber-100 text-amber-900 border-amber-400/80 shadow-sm"
                  : isDark
                    ? "border-transparent text-slate-400 hover:text-amber-200 hover:border-amber-400/30 hover:bg-slate-900/40"
                    : "border-transparent text-slate-600 hover:text-amber-900 hover:border-amber-600/30 hover:bg-slate-100/50"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Zodiac Library
            </button>

            <button
              id="nav-alerts"
              onClick={() => setActiveTab("alerts")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 relative cursor-pointer border ${
                activeTab === "alerts"
                  ? isDark
                    ? "bg-amber-400/10 text-amber-200 border-amber-400/70 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                    : "bg-amber-100 text-amber-900 border-amber-400/80 shadow-sm"
                  : isDark
                    ? "border-transparent text-slate-400 hover:text-amber-200 hover:border-amber-400/30 hover:bg-slate-900/40"
                    : "border-transparent text-slate-600 hover:text-amber-900 hover:border-amber-600/30 hover:bg-slate-100/50"
              }`}
            >
              <Bell className="w-3.5 h-3.5" /> Alerts
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-rose-600 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {unreadAlertsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Config */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className={`p-2.5 rounded-full border transition-all ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-850"
                  : "bg-slate-100 border-slate-200 text-amber-850 hover:bg-slate-250"
              }`}
              title={isDark ? "Switch to Solstice Mode" : "Switch to Cosmos Mode"}
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Share app button */}
            <button
              id="open-share-modal-btn"
              onClick={() => setShowShareModal(true)}
              className={`p-2.5 rounded-full border transition-all ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-850"
                  : "bg-slate-100 border-slate-200 text-amber-850 hover:bg-slate-250"
              }`}
              title="Share Application"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>

            {/* Mobile Nav Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-800/20"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b py-4 px-4 space-y-2 backdrop-blur-md sticky top-16 z-30 ${
          isDark ? "bg-slate-950/95 border-amber-500/20" : "bg-white/95 border-amber-200 shadow-md"
        }`}>
          <button
            onClick={() => { setActiveTab("horoscope"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              activeTab === "horoscope" ? (isDark ? "bg-amber-400/10 text-amber-300" : "bg-amber-100 text-amber-800") : ""
            }`}
          >
            <Star className="w-4 h-4" /> Daily Horoscope
          </button>
          <button
            onClick={() => { setActiveTab("compatibility"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              activeTab === "compatibility" ? (isDark ? "bg-amber-400/10 text-amber-300" : "bg-amber-100 text-amber-800") : ""
            }`}
          >
            <Heart className="w-4 h-4" /> Compatibility Charts
          </button>
          <button
            onClick={() => { setActiveTab("oracle"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-bold flex items-center justify-between border-2 cursor-pointer ${
              activeTab === "oracle"
                ? isDark ? "bg-amber-400 text-slate-950 border-amber-400 shadow-sm" : "bg-amber-600 text-white border-amber-600 shadow-sm"
                : isDark ? "bg-slate-900 border-slate-800 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Compass className="w-4.5 h-4.5 animate-spin-slow" />
              <span>✨ Ask Astro Oracle</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-bold">AI Oracle</span>
          </button>
          <button
            onClick={() => { setActiveTab("vedic"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              activeTab === "vedic" ? (isDark ? "bg-amber-400/10 text-amber-300" : "bg-amber-100 text-amber-800") : ""
            }`}
          >
            <span>☸️</span> Vedic & Palmistry
          </button>
          <button
            onClick={() => { setActiveTab("seekers"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              activeTab === "seekers" ? (isDark ? "bg-amber-400/10 text-amber-300" : "bg-amber-100 text-amber-800") : ""
            }`}
          >
            <User className="w-4 h-4" /> Birth Seekers
          </button>
          <button
            onClick={() => { setActiveTab("library"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              activeTab === "library" ? (isDark ? "bg-amber-400/10 text-amber-300" : "bg-amber-100 text-amber-800") : ""
            }`}
          >
            <BookOpen className="w-4 h-4" /> Zodiac Library
          </button>
          <button
            onClick={() => { setActiveTab("alerts"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
              activeTab === "alerts" ? (isDark ? "bg-amber-400/10 text-amber-300" : "bg-amber-100 text-amber-800") : ""
            }`}
          >
            <span className="flex items-center gap-2"><Bell className="w-4 h-4" /> Alerts</span>
            {unreadAlertsCount > 0 && (
              <span className="bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* Banner with predictive precision assurance & prompt Chat trigger */}
        <div className={`p-5 rounded-2xl mb-6 border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark ? "bg-amber-400/5 border-amber-400/20 text-amber-200/90" : "bg-amber-50 border-amber-200 text-amber-800"
        }`}>
          <div className="flex gap-3 items-start md:items-center text-xs">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
            <p className="leading-relaxed">
              <strong>Stellar Precision Guarantee:</strong> Our deep neural synastry models calculate planetary nodes, lunar phases, and natal aspects with up to <strong>100% predictive rate</strong> using astronomical precision grids.
            </p>
          </div>
          <button
            onClick={() => handleNavigateToTab("oracle")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-md cursor-pointer ${
              isDark 
                ? "bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-[1.03] active:scale-[0.97]" 
                : "bg-amber-600 hover:bg-amber-700 text-white hover:scale-[1.03] active:scale-[0.97]"
            }`}
          >
            <span>💬 Chat With AI Oracle</span>
          </button>
        </div>

        {/* Tab display switchboard */}
        <div className="transition-all duration-300">
          {activeTab === "horoscope" && (
            <HoroscopeView mainProfile={mainProfile} profiles={profiles} theme={theme} onNavigateToTab={handleNavigateToTab} />
          )}

          {activeTab === "compatibility" && (
            <CompatibilityView profiles={profiles} theme={theme} onNavigateToTab={handleNavigateToTab} />
          )}

          {activeTab === "oracle" && (
            <AstroChat 
              mainProfile={mainProfile} 
              theme={theme} 
              initialQuery={chatInitialQuery} 
              onClearInitialQuery={() => setChatInitialQuery(undefined)} 
            />
          )}

          {activeTab === "vedic" && (
            <VedicOracle profiles={profiles} mainProfile={mainProfile} theme={theme} />
          )}

          {activeTab === "seekers" && (
            <ProfileManagement
              profiles={profiles}
              onAddProfile={handleAddProfile}
              onDeleteProfile={handleDeleteProfile}
              onSetMainProfile={handleSetMainProfile}
              theme={theme}
            />
          )}

          {activeTab === "library" && (
            <ZodiacDirectory theme={theme} />
          )}

          {activeTab === "alerts" && (
            <NotificationsPanel
              alerts={alerts}
              onMarkRead={handleMarkRead}
              onClearAll={handleClearAllAlerts}
              onSimulateAlert={handleSimulateAlert}
              theme={theme}
            />
          )}
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-2xl border transition-all duration-300 ${
            isDark ? "bg-slate-900 border-amber-400/30 text-white" : "bg-white border-amber-200 text-slate-900"
          }`}>
            <div className="flex justify-between items-center pb-4 border-b border-slate-800/10 dark:border-slate-100/10">
              <h3 className="font-serif font-bold text-lg text-amber-500">Share Celestial Wisdom</h3>
              <button
                id="close-share-modal"
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-lg hover:bg-slate-850"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs my-4 opacity-80 leading-relaxed">
              Invite friends to map their natal aspects, calculate love synastry metrics, and share their spiritual compatibility ratings across major channels.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                id="share-whatsapp-btn"
                onClick={() => handleShareApp("wa")}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </button>
              <button
                id="share-twitter-btn"
                onClick={() => handleShareApp("tw")}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all"
              >
                <Twitter className="w-4 h-4" /> Twitter (X)
              </button>
              <button
                id="share-facebook-btn"
                onClick={() => handleShareApp("fb")}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold bg-blue-700 hover:bg-blue-600 text-white transition-all"
              >
                <Facebook className="w-4 h-4" /> Facebook
              </button>
              <button
                id="share-copy-btn"
                onClick={() => handleShareApp("copy")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold border transition-all ${
                  isDark ? "bg-slate-950/60 border-slate-800 hover:bg-slate-900" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`border-t py-6 text-center text-xs transition-colors mt-auto ${
        isDark ? "bg-slate-950/40 border-amber-500/10 text-slate-500" : "bg-slate-50 border-amber-200/50 text-slate-600"
      }`}>
        <p className="font-serif">© 2026 Celestial Guide. All cosmic coordinates are calculated strictly with solar and lunar transits.</p>
        <p className="mt-1 text-[10px] opacity-75">Configured under Mars-Venus Solstice alignments. Accurate readings guaranteed.</p>
      </footer>
    </div>
  );
}
