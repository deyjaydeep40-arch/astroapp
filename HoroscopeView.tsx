import React, { useState, useEffect } from "react";
import { BirthProfile, HoroscopeData } from "../types";
import { zodiacSigns } from "../data/zodiac";
import { Sparkles, Moon, Sun, Briefcase, Heart, Dumbbell, Star, Calendar, RefreshCw, AlertCircle, Share2, Copy, Check, Compass } from "lucide-react";

interface HoroscopeViewProps {
  mainProfile: BirthProfile | null;
  profiles: BirthProfile[];
  theme: "cosmos" | "solstice";
  onNavigateToTab?: (tab: string, initialQuery?: string) => void;
}

const MOODS = [
  { label: "Radiant", emoji: "✨" },
  { label: "Reflective", emoji: "🌙" },
  { label: "Ambitious", emoji: "🔥" },
  { label: "Peaceful", emoji: "🍃" },
  { label: "Turbulent", emoji: "🌪️" },
  { label: "Passionate", emoji: "💖" }
];

export default function HoroscopeView({ mainProfile, profiles, theme, onNavigateToTab }: HoroscopeViewProps) {
  const [selectedSign, setSelectedSign] = useState<string>("Aries");
  const [selectedMood, setSelectedMood] = useState<string>("Radiant");
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // If a main profile exists, use their zodiac sign as the default.
  useEffect(() => {
    if (mainProfile?.zodiacSign) {
      setSelectedSign(mainProfile.zodiacSign);
    }
  }, [mainProfile]);

  const generateClientSideHoroscope = (signName: string, moodName: string): HoroscopeData => {
    const today = new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    let nameSum = 0;
    for (let i = 0; i < signName.length; i++) nameSum += signName.charCodeAt(i);
    
    let moodOffset = 0;
    for (let i = 0; i < moodName.length; i++) moodOffset += moodName.charCodeAt(i);
    
    const day = new Date().getDate();
    const month = new Date().getMonth();
    const seed = nameSum + day + month * 31 + moodOffset;

    // Get sign attributes
    const s = signName.toLowerCase();
    let element = "Fire";
    let ruler = "Mars";
    if (["taurus", "virgo", "capricorn"].includes(s)) {
      element = "Earth";
      ruler = s === "taurus" ? "Venus" : s === "virgo" ? "Mercury" : "Saturn";
    } else if (["gemini", "libra", "aquarius"].includes(s)) {
      element = "Air";
      ruler = s === "gemini" ? "Mercury" : s === "libra" ? "Venus" : "Uranus";
    } else if (["cancer", "scorpio", "pisces"].includes(s)) {
      element = "Water";
      ruler = s === "cancer" ? "the Moon" : s === "scorpio" ? "Pluto" : "Neptune";
    } else {
      element = "Fire";
      ruler = s === "aries" ? "Mars" : s === "leo" ? "the Sun" : "Jupiter";
    }

    const zodiacs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const filteredCompat = zodiacs.filter(z => z.toLowerCase() !== s);
    const compatibilityWith = filteredCompat[seed % filteredCompat.length];

    const energyLevel = 75 + (seed % 21);
    const luckyNumber = (seed % 9) + 1;
    const colors = ["Celestial Emerald", "Solar Gold", "Cosmic Indigo", "Aether White", "Lunar Violet", "Stardust Amber", "Deep Crimson", "Sapphire Pearl", "Saffron Glow", "Roseate Quartz", "Muted Charcoal", "Electric Azure"];
    const luckyColor = colors[seed % colors.length];
    const powerHours = ["10:30 AM", "11:15 AM", "2:00 PM", "4:30 PM", "7:45 PM", "9:00 PM", "11:00 PM", "6:15 AM", "1:30 PM", "8:11 PM"];
    const powerHour = powerHours[seed % powerHours.length];

    let general = "";
    let love = "";
    let career = "";
    let wellness = "";
    let cosmicTip = "";

    if (moodName === "Radiant") {
      general = `The universe is magnifying your innate solar spark. Today, as your ruler ${ruler} forms a harmonious aspect with ascending lunar degrees, your ${element} core is buzzing with brilliant intuitive frequencies. It is an extraordinary window to step directly into the spotlight, launch critical designs, and let your authentic frequency capture the admiration of your surroundings. Clear away any past hesitation—today, the cosmic spotlight shines directly on your path.`;
      love = `Venus is casting an exceptionally warm, magnetic sheen over your relationship sector. Your energetic field is highly attractive today, drawing in playful conversations, synchronistic glances, and genuine emotional safety. If coupled, plan a spontaneous celebration of your bond. If single, the stars are aligning for a sparkling connection with a highly compatible ${compatibilityWith} seeker.`;
      career = `An active Mars-Jupiter transit in your solar house of fortune suggests highly favorable financial expansions. Your cognitive focus is exceptionally sharp, enabling you to articulate complex business goals and convince key decision-makers. It is a fantastic moment to pitch ambitious ideas, ask for well-deserved resources, or take calculated leaps.`;
      wellness = `Your emotional vitality is at an all-time peak, overflowing with joyous solar power. Your heart chakra is wide open and balanced. Ground this beautiful, radiant energy by drinking pure mineral water, spending time under the direct sky, and practicing a heart-opening meditation. Let your laughter be your primary spiritual remedy today.`;
      cosmicTip = `Focus your awareness on the present joy; your positive vibrations are opening massive doors of celestial abundance today.`;
    } else if (moodName === "Reflective") {
      general = `A quiet, introspective lunar node is gently guiding your consciousness inward today. With your ruler ${ruler} transiting through a contemplative aspect, your active ${element} spirit is being invited to rest and review. This is not a day for outer pushing, but rather a sacred window for charting patterns, identifying subtle spiritual shifts, and listening to the soft whispers of your higher self.`;
      love = `In matters of the heart, the cosmic currents encourage deep, silent understanding and nurturing presence. Instead of seeking verbal confirmation, look for the quiet, small acts of devotion. A soulful, quiet conversation over a warm drink or shared silent contemplation will dissolve any lingering dynamic friction far better than elaborate words.`;
      career = `The stars advise a careful audit of your current targets. Mercury's transit suggests that finalizing existing administrative layouts and resolving minor oversights will yield much stronger foundations than starting raw projects. Focus on planning, organizing your desk space, and cultivating your specialized skills in solitude.`;
      wellness = `Your nervous system is highly receptive to subtle vibrations today. Give yourself permission to disconnect from the digital noise. Engage in slow, mindful breathing, take a warm salt bath, or practice restorative yoga. Your third eye chakra is calling for silence, dreams, and gentle twilight reflections.`;
      cosmicTip = `Let go of situations you cannot control, and watch how beautifully they resolve themselves in divine timing.`;
    } else if (moodName === "Ambitious") {
      general = `A powerful, driving conjunction is fueling your personal motivation. As the Mars aspect activates your ${element} sign, you feel an irresistible urge to break through older limitations and construct long-term systems. Your ruling planet ${ruler} is in a prime alignment of sheer determination, giving you the stamina and razor-sharp clarity to conquer any lingering obstacles.`;
      love = `The energetic intensity of today makes your interactions highly direct and purposeful. You are not interested in superficial exchanges; you want real, constructive devotion. Be careful not to let your driving ambition sound overly demanding to those you love. Balance your powerful drive with a touch of Venusian softness.`;
      career = `A massive transit through your solar house of worldly success is happening today! This is the ultimate day to close deals, present high-stakes masterplans, or execute complex tasks. Your leadership potential is highlighted, and others will naturally follow your commanding vision. Trust your structural instincts and push forward.`;
      wellness = `With high-octane vital energy rushing through your veins, physical release is absolutely necessary to prevent inner tension. A high-intensity workout, a long run, or physical building tasks will successfully channel this Martian surge. Avoid caffeine in the evening to allow your active mind to transition into deep, restoring sleep.`;
      cosmicTip = `Channel your drive into productive creation; Saturn rewards dedicated, disciplined efforts.`;
    } else if (moodName === "Peaceful") {
      general = `A gentle, calming breeze from Venus and Neptune is washing over your astrological sectors. The stars are in a beautiful, non-demanding configuration that brings profound harmony to your ${element} spirit. Under this alignment, you are perfectly content with the natural unfolding of the universe, recognizing that everything is moving in divine right timing.`;
      love = `Your romantic energy is incredibly comforting, acting as a peaceful harbor for everyone you interact with. It is a beautiful day to forgive past misunderstandings, share quiet hugs, and enjoy simple moments of emotional safety. The stars are weaving a protective shield of tenderness around your heart.`;
      career = `In professional spheres, a relaxed and collaborative atmosphere prevails. Projects flow smoothly without the usual friction. Your ability to bring calm resolution to disputes makes you a highly valued presence in your workspace. Trust that financial avenues are stable and secure under today's protective planetary rays.`;
      wellness = `Your bodily rhythms are perfectly aligned with natural elements. Focus on gentle, soothing movements like walking in nature, practicing tai chi, or simply stretching. Nourish your system with herbal infusions and fresh organic greens. Your aura is clean, bright, and deeply grounded.`;
      cosmicTip = `Trust the quiet whisper of your intuition over the loud noise of the external world today.`;
    } else if (moodName === "Turbulent") {
      general = `A temporary planetary square is challenging your ${element} sectors, testing your adaptability and resilience. With ${ruler} locked in a complex opposition with Saturn, you might feel a clash between outer duties and inner desires. Do not fear this friction; it is a sacred cosmic invitation to burn away old illusions, strengthen your core, and emerge much stronger.`;
      love = `Emotional storms could brew if expectations are left unspoken. The current lunar phase might amplify minor triggers into larger disagreements. Before responding, take a deep breath and locate your center. Use this opportunity to practice absolute clarity and set respectful boundaries, which will ultimately deepen your bonds.`;
      career = `High stakes and rapid shifts characterize your professional sector today. Plans might change unexpectedly, requiring you to pivot with absolute composure. Avoid making rushed financial decisions or signing major agreements today. Let the cosmic dust settle first, and focus on maintaining your inner stability.`;
      wellness = `Your emotional and physical systems are carrying extra stress today. Protect your auric field by limiting contact with chaotic environments or demanding personalities. Practice deep, rhythmic breathing, and use essential oils like lavender to soothe your active mind. Remember: even the wildest cosmic storm eventually runs out of rain.`;
      cosmicTip = `Take a step back, breathe deeply, and protect your inner peace from external turbulence.`;
    } else {
      // Passionate
      general = `The cosmos is vibrating with intense, rich desires and creative fire today! Your ${element} sectors are fully ignited as Venus and Pluto dance in a powerful transit. Your soul feels a deep hunger for absolute authenticity, creative obsession, and profound connections that transcend the ordinary. Do not hold back your intense expression; the universe is begging you to live fully.`;
      love = `An electric, unforgettable energy fills your romantic arena today! The magnetic pull between you and your desires is extremely high. Conversations are loaded with meaning, and eye contact is mesmerizing. If you are coupled, expect a powerful renewal of intimacy. If single, your magnetic field could draw in a fateful soul connection with ${compatibilityWith}.`;
      career = `Your career projects are fueled by your deep, personal passion. You are completely committed to your work today, infusing your tasks with unique, magnetic creative style. This intense focus will produce highly compelling results that command attention. Your financial avenues are glowing with high-reward prospects.`;
      wellness = `Your life force is strong, rich, and deeply active. Channel this intense, passionate energy into creative outlets like music, painting, dancing, or expressive physical movement. Your sacral chakra is highly active. Stay grounded by staying connected to your physical sensations and breathing deeply.`;
      cosmicTip = `A small gesture of pure gratitude and raw passion today will open massive doors of cosmic abundance tomorrow.`;
    }

    return {
      sign: signName,
      date: today,
      general,
      love,
      career,
      wellness,
      luckyNumber,
      luckyColor,
      powerHour,
      compatibilityWith,
      cosmicTip,
      energyLevel
    };
  };

  const fetchHoroscope = async (signName: string, moodName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sign: signName,
          mood: moodName,
          date: new Date().toISOString().split("T")[0],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to align with the stars. Check your server or API configuration.");
      }

      const data = await response.json();
      setHoroscope(data);
    } catch (err: any) {
      const localData = generateClientSideHoroscope(signName, moodName);
      setHoroscope(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoroscope(selectedSign, selectedMood);
  }, [selectedSign, selectedMood]);

  const handleShare = () => {
    if (!horoscope) return;
    const text = `🌟 My Daily Horoscope for ${horoscope.sign} (${horoscope.date}):
✨ Cosmic Tip: "${horoscope.cosmicTip}"
🔮 General Outlook: ${horoscope.general.slice(0, 100)}...
💖 Love Connection: ${horoscope.love.slice(0, 80)}...
🔢 Lucky Number: ${horoscope.luckyNumber} | 🎨 Lucky Color: ${horoscope.luckyColor}

Discover your daily horoscope, synastry readings, and chat with the AI Oracle at Celestial Guide!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentSignDetails = zodiacSigns.find((s) => s.name === selectedSign);
  const isDark = theme === "cosmos";

  return (
    <div className="space-y-6" id="horoscope-view-container">
      {/* Selector Area */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? "bg-slate-900/80 border-amber-500/20" : "bg-white border-amber-200 shadow-md"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className={`text-lg font-serif font-bold ${isDark ? "text-amber-200" : "text-amber-800"}`}>
              Daily Cosmic Alignment
            </h3>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Select a zodiac sign and your current emotional vibration to request personalized daily readings.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {profiles.length > 0 && (
              <div className="flex items-center gap-1.5 mr-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Seekers:
                </span>
                <div className="flex gap-1">
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedSign(p.zodiacSign)}
                      className={`px-2.5 py-1 rounded-full text-xs transition-all border ${
                        selectedSign === p.zodiacSign
                          ? isDark
                            ? "bg-amber-400 text-slate-950 border-amber-400 font-semibold"
                            : "bg-amber-600 text-white border-amber-600 font-semibold"
                          : isDark
                          ? "bg-slate-950/60 text-slate-300 border-slate-800 hover:border-amber-400/30"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:border-amber-600/30"
                      }`}
                    >
                      {p.name} ({p.zodiacSign})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 12 Zodiac Quick Grid */}
        <div className="mt-6">
          <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-amber-200/80" : "text-amber-700"}`}>
            Choose Zodiac Sign
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
            {zodiacSigns.map((z) => (
              <button
                key={z.name}
                id={`zodiac-btn-${z.name}`}
                onClick={() => setSelectedSign(z.name)}
                className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all border ${
                  selectedSign === z.name
                    ? isDark
                      ? "bg-gradient-to-b from-amber-400 to-amber-300 text-slate-950 border-amber-400 scale-105 shadow-md"
                      : "bg-gradient-to-b from-amber-600 to-amber-700 text-white border-amber-600 scale-105 shadow-md"
                    : isDark
                    ? "bg-slate-950/40 border-slate-800 hover:border-amber-400/30 text-slate-300 hover:bg-slate-900"
                    : "bg-slate-50 border-slate-200 hover:border-amber-600/30 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="text-xl leading-none">{z.symbol}</span>
                <span className="text-[10px] mt-1 font-serif font-medium">{z.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Emotional Resonance Slider/Mood selector */}
        <div className="mt-5 pt-4 border-t border-slate-800/10 dark:border-slate-100/10">
          <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-amber-200/80" : "text-amber-700"}`}>
            Emotional Vibration / Mood Alignment
          </label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.label}
                id={`mood-btn-${m.label}`}
                onClick={() => setSelectedMood(m.label)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
                  selectedMood === m.label
                    ? isDark
                      ? "bg-amber-400/20 text-amber-200 border-amber-400"
                      : "bg-amber-50 text-amber-800 border-amber-600"
                    : isDark
                    ? "bg-slate-950/30 border-slate-800 text-slate-400 hover:text-slate-300"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800"
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Horoscope Output */}
      {loading ? (
        <div className={`p-12 text-center rounded-2xl border flex flex-col items-center justify-center min-h-[300px] ${
          isDark ? "bg-slate-900/50 border-amber-500/10" : "bg-white/80 border-amber-200 shadow"
        }`}>
          <RefreshCw className="w-10 h-10 animate-spin text-amber-500 mb-4" />
          <h4 className="text-lg font-serif font-semibold text-amber-500 animate-pulse">Querying Celestial Sphere...</h4>
          <p className={`text-xs mt-1 max-w-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Analyzing solar transits, stellar positions, and planetary houses for {selectedSign}...
          </p>
        </div>
      ) : error ? (
        <div className={`p-6 rounded-2xl border flex gap-4 items-start ${
          isDark ? "bg-rose-950/30 border-rose-900/40 text-rose-200" : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Celestial Interruption</h4>
            <p className="text-xs mt-1">{error}</p>
            <button
              onClick={() => fetchHoroscope(selectedSign, selectedMood)}
              className="mt-3 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white hover:bg-rose-500 transition-all"
            >
              Retry Alignment
            </button>
          </div>
        </div>
      ) : horoscope ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Card Header */}
          <div className={`p-6 md:p-8 rounded-2xl border relative overflow-hidden ${
            isDark
              ? "bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/30 text-white"
              : "bg-gradient-to-b from-amber-50 to-white border-amber-200 text-slate-900 shadow-md"
          }`}>
            {/* Background elements */}
            <div className="absolute right-[-5%] top-[-5%] text-9xl font-serif opacity-[0.03] select-none pointer-events-none">
              {currentSignDetails?.symbol}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/10 dark:border-slate-100/10 pb-5">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{currentSignDetails?.symbol}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-serif font-bold tracking-wide text-amber-500">
                      {horoscope.sign}
                    </h2>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isDark ? "bg-slate-800 text-amber-300" : "bg-amber-100 text-amber-800"
                    }`}>
                      {currentSignDetails?.element} Sign
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Insightful Reading • {horoscope.date} • {selectedMood} Alignment
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                id="share-horoscope-btn"
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
                  <><Share2 className="w-3.5 h-3.5" /> Share Horoscope</>
                )}
              </button>
            </div>

            {/* General Outlook Grid */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1.5 mb-2">
                    <Star className="w-3.5 h-3.5 animate-pulse" /> Cosmic Outlook
                  </h4>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    {horoscope.general}
                  </p>
                </div>

                {/* Energy Indicator */}
                <div className={`p-4 rounded-xl border ${
                  isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-amber-500">Celestial Energy Vibration</span>
                    <span className="font-mono font-bold">{horoscope.energyLevel || 85}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800/20 dark:bg-slate-100/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                      style={{ width: `${horoscope.energyLevel || 85}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Side Parameters */}
              <div className={`p-5 rounded-xl border space-y-4 h-full ${
                isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200"
              }`}>
                <h5 className="text-xs font-bold uppercase tracking-widest text-amber-500">Astrological Tokens</h5>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className={isDark ? "text-slate-400" : "text-slate-600"}>Lucky Number:</span>
                    <span className="font-bold text-amber-500 font-mono text-base">{horoscope.luckyNumber}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={isDark ? "text-slate-400" : "text-slate-600"}>Lucky Color:</span>
                    <span className="font-bold text-amber-500">{horoscope.luckyColor}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={isDark ? "text-slate-400" : "text-slate-600"}>Power Hour:</span>
                    <span className="font-bold text-amber-500">{horoscope.powerHour}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={isDark ? "text-slate-400" : "text-slate-600"}>Highest Compatibility:</span>
                    <span className="font-bold text-amber-500">{horoscope.compatibilityWith}</span>
                  </div>
                </div>

                <div className={`mt-2 p-3 rounded-lg border-l-4 border-amber-500 text-xs ${
                  isDark ? "bg-amber-400/5 text-amber-200" : "bg-amber-50 text-amber-800"
                }`}>
                  <p className="font-bold uppercase tracking-wider text-[10px]">Cosmic Advice</p>
                  <p className="mt-1 leading-relaxed italic">"{horoscope.cosmicTip}"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Spheres of Life */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Love sphere */}
            <div className={`p-5 rounded-2xl border ${
              isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center gap-2 text-rose-500 font-bold text-sm mb-3">
                <Heart className="w-5 h-5 fill-rose-500/10" />
                <h4 className="font-serif">Love & Harmony</h4>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {horoscope.love}
              </p>
            </div>

            {/* Career sphere */}
            <div className={`p-5 rounded-2xl border ${
              isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center gap-2 text-blue-500 font-bold text-sm mb-3">
                <Briefcase className="w-5 h-5" />
                <h4 className="font-serif">Career & Abundance</h4>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {horoscope.career}
              </p>
            </div>

            {/* Wellness sphere */}
            <div className={`p-5 rounded-2xl border ${
              isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm mb-3">
                <Dumbbell className="w-5 h-5" />
                <h4 className="font-serif">Wellness & Balance</h4>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {horoscope.wellness}
              </p>
            </div>
          </div>

          {/* Direct link to Oracle Chat */}
          <div className={`p-6 rounded-2xl border text-center space-y-4 ${
            isDark ? "bg-slate-900/50 border-amber-500/10" : "bg-amber-50/30 border-amber-200"
          }`}>
            <h4 className={`text-base font-serif font-bold ${isDark ? "text-amber-200" : "text-amber-800"}`}>
              Do you have deeper questions about this {horoscope.sign} reading?
            </h4>
            <p className={`text-xs max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Ask our Celestial Oracle about your transits, love opportunities, career challenges, or specific details of your {selectedMood} state today.
            </p>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab("oracle", `Can you analyze my daily horoscope for ${horoscope.sign} on ${horoscope.date} under a ${selectedMood} alignment in more depth?`)}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg hover:scale-105 cursor-pointer ${
                isDark
                  ? "bg-amber-400 hover:bg-amber-300 text-slate-950"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }`}
            >
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>Ask Oracle About This Horoscope</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8">No alignment calculated yet. Click a sign above.</div>
      )}
    </div>
  );
}
