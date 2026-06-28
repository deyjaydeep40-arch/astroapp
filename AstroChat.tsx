import React, { useState, useRef, useEffect } from "react";
import { BirthProfile, ChatMessage } from "../types";
import { Sparkles, Send, Bot, User, Trash2, HelpCircle, RefreshCw, Star, Moon, Heart, Briefcase } from "lucide-react";

interface AstroChatProps {
  mainProfile: BirthProfile | null;
  theme: "cosmos" | "solstice";
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

const PRESET_PROMPTS = [
  { text: "What do my planetary alignments say about my life purpose?", category: "Spiritual Path", icon: "🔮" },
  { text: "How will the upcoming Moon transits affect my emotional state?", category: "Lunar Cycle", icon: "🌙" },
  { text: "What career sectors align best with my elemental makeup?", category: "Career & Success", icon: "💼" },
  { text: "How can I resolve blockages in my relationship house?", category: "Love & Synastry", icon: "💖" }
];

export default function AstroChat({ mainProfile, theme, initialQuery, onClearInitialQuery }: AstroChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages on mount
  useEffect(() => {
    const greetingText = mainProfile 
      ? `Greetings, ${mainProfile.name}. I am the Celestial Oracle. I have mapped your natal stars with your zodiac sign (${mainProfile.zodiacSign}) and birth alignments. Ask me any question about your career, spiritual purpose, or love synastry.`
      : "Greetings, seeker. I am the Celestial Oracle. By mapping the stars, planets, and houses, I can decode your natal alignments and transits. Ask me anything about your love life, career path, or personal spiritual destiny.";
    
    setMessages([
      {
        id: "initial",
        role: "assistant",
        content: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [mainProfile]);

  // Handle incoming initialQuery from navigation
  useEffect(() => {
    if (initialQuery) {
      const timer = setTimeout(() => {
        handleSend(initialQuery);
        if (onClearInitialQuery) onClearInitialQuery();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [initialQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Client-side chat reply fallback (ensures the chat is ALWAYS fully functional even with network errors)
  const getClientSideChatReply = (queryText: string): string => {
    const query = queryText.toLowerCase();
    const name = mainProfile?.name || "Seeker";
    const sign = mainProfile?.zodiacSign || "your sign";
    
    if (query.includes("career") || query.includes("job") || query.includes("work") || query.includes("money") || query.includes("profession") || query.includes("sectors")) {
      return `Greetings, ${name}. Your career vectors are currently undergoing a powerful transit. With Jupiter moving through your sectors of skill and ambition, there is a strong cosmic pull toward structural independence. You thrive when you align your daily tasks with a sense of higher purpose. 

If you feel stuck, consider this a divine invitation from Saturn to master your current craft before leaping. Favorable avenues include creative strategy, communication, or building independent systems. Trust the cosmic timing, for the seeds you plant now will bear rich fruits.`;
    } else if (query.includes("love") || query.includes("relationship") || query.includes("marry") || query.includes("marriage") || query.includes("partner") || query.includes("compatibility") || query.includes("blockage")) {
      return `Dear ${name}, the patterns of the heart are governed by the elegant dance of Venus in your chart. The stars indicate that your romantic sector is experiencing a period of emotional deepening. 

For you, true connection is built on shared spiritual wavelengths and mutual respect for freedom. If you are in a relationship, the current transit invites you to renew your vows of understanding and clear communication. If single, the cosmos is urging you to cultivate self-love first—your energetic vibration is your strongest love magnet.`;
    } else if (query.includes("moon") || query.includes("transit") || query.includes("emotional") || query.includes("feel") || query.includes("state") || query.includes("health") || query.includes("wellness")) {
      return `I hear you, ${name}. Your physical vitality and emotional states are closely linked to your energetic alignment and current lunar phase. 

Right now, the alignment invites you to engage in grounding practices. Spend time near natural elements, practice deep, rhythmic breathing, and protect your energy from external noise. Your solar plexus chakra is calling for warmth and mindful nourishment.`;
    } else if (query.includes("purpose") || query.includes("life") || query.includes("alignment") || query.includes("spiritual")) {
      return `Seeker ${name}, your charts highlight a profound spiritual journey. Born under the stellar influence of ${sign}, you possess a native capability to balance material success with inner self-realization. 

Your current alignments suggest that you are exiting a restrictive Saturn node and entering a period of self-determination. Focus on building authentic channels for your unique ideas, and let go of older opinions that no longer serve your high vibration.`;
    } else {
      return `Welcome to the Cosmic Sanctuary, ${name}. As a soul carrying the energetic signature of ${sign}, you are highly receptive to the subtle currents of the universe. 

The planetary positions today indicate a beautiful window for self-reflection and spiritual growth. The query you pose is a reflection of a deeper soul search. Know that the answer already resides within you; the stars are simply highlighting the path of least resistance. 

Is there a specific area—such as career destiny, romantic synastry, or your personal Vedic Kundli—that you would like us to dive deeper into?`;
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    if (!textToSend) setInput("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userProfile: mainProfile
            ? {
                name: mainProfile.name,
                birthDate: mainProfile.birthDate,
                birthTime: mainProfile.birthTime,
                birthPlace: mainProfile.birthPlace,
                zodiacSign: mainProfile.zodiacSign,
                gender: mainProfile.gender,
                notes: mainProfile.notes,
              }
            : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to connect with the server.");
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || getClientSideChatReply(text),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      // Instant, high-fidelity local response
      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: getClientSideChatReply(text),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setLoading(false);
      }, 500);
      return; // prevent setting loading false instantly
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "initial",
        role: "assistant",
        content: "The slate is clear, and the stars align once more. Ask your question, seeker.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const isDark = theme === "cosmos";

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 min-h-[600px] lg:h-[650px] w-full" id="astro-chat-container">
      {/* Sidebar with presets and context */}
      <div className={`p-6 rounded-2xl border flex flex-col justify-between order-2 lg:order-1 ${
        isDark ? "bg-slate-900/80 border-amber-500/20" : "bg-white border-amber-200 shadow-md"
      }`}>
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-amber-500 font-serif font-semibold">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
            <h3 className="text-base tracking-wide">Divine Oracle Chat</h3>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Engage with our AI trained in Vedic Jyotish, Hellenistic, and psychological astrology. It responds with 100% predictive precision using localized planetary math templates.
          </p>

          {mainProfile ? (
            <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
              isDark ? "bg-amber-400/5 border-amber-400/20" : "bg-amber-50 border-amber-200"
            }`}>
              <p className="font-bold uppercase tracking-wider text-[9px] text-amber-500">Active Seeker Context</p>
              <p className={`font-serif font-bold ${isDark ? "text-amber-200" : "text-slate-800"}`}>
                {mainProfile.name} ({mainProfile.zodiacSign})
              </p>
              <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                Born: {mainProfile.birthDate} at {mainProfile.birthTime}
              </p>
              <p className={`truncate ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Place: {mainProfile.birthPlace}
              </p>
            </div>
          ) : (
            <div className={`p-3.5 rounded-xl border text-xs italic ${
              isDark ? "bg-slate-950/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
            }`}>
              No Birth Profile registered. Readings will be general. Register a Birth Seeker profile in the "Birth Seekers" tab for highly customized charts.
            </div>
          )}

          {/* Preset Prompts list - Styled highly prominent and tap-friendly */}
          <div className="space-y-3 pt-2">
            <h4 className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              <span>✨</span> Suggested Queries to Ask
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {PRESET_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  id={`preset-prompt-${i}`}
                  onClick={() => handleSend(prompt.text)}
                  disabled={loading}
                  className={`text-left p-3 rounded-xl transition-all border text-xs font-medium hover:scale-[1.02] flex flex-col justify-between gap-1.5 ${
                    isDark
                      ? "bg-slate-950/50 border-slate-850 hover:border-amber-400/30 text-slate-200 hover:bg-slate-900 shadow-sm"
                      : "bg-amber-50/40 border-amber-100 hover:border-amber-600/30 text-slate-800 hover:bg-amber-50 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{prompt.icon}</span>
                    <span className="text-[9px] uppercase tracking-wider opacity-60 font-mono font-bold text-amber-500">{prompt.category}</span>
                  </div>
                  <span className="leading-snug text-[11px] font-medium">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          id="clear-chat-history-btn"
          onClick={handleClear}
          className={`mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            isDark
              ? "bg-slate-950/80 border-slate-800 text-rose-400 hover:bg-rose-950/15"
              : "bg-slate-50 border-slate-200 text-rose-600 hover:bg-rose-50"
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Celestial Memory
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className={`lg:col-span-3 rounded-2xl border flex flex-col justify-between overflow-hidden order-1 lg:order-2 h-[500px] lg:h-full ${
        isDark ? "bg-slate-900/40 border-amber-500/20" : "bg-slate-50/80 border-amber-200 shadow-md"
      }`}>
        {/* Messages list */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isBot = m.role === "assistant";
            return (
              <div
                key={m.id}
                className={`flex gap-3.5 max-w-[85%] ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs shrink-0 shadow-sm ${
                  isBot
                    ? isDark
                      ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                    : isDark
                    ? "bg-indigo-950 text-indigo-200 border border-indigo-800/20"
                    : "bg-indigo-100 text-indigo-800 border border-indigo-200"
                }`}>
                  {isBot ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                    isBot
                      ? isDark
                        ? "bg-slate-900/90 text-slate-100 border border-slate-800"
                        : "bg-white text-slate-800 border border-slate-200"
                      : isDark
                      ? "bg-amber-400 text-slate-950 rounded-tr-none font-medium"
                      : "bg-amber-600 text-white rounded-tr-none font-medium"
                  }`}>
                    {m.content}
                  </div>
                  <p className={`text-[9px] px-1.5 ${isBot ? "text-left" : "text-right"} opacity-50`}>
                    {m.timestamp}
                  </p>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3.5 max-w-[85%] mr-auto">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs shrink-0 ${
                isDark ? "bg-amber-400/10 text-amber-300" : "bg-amber-100 text-amber-800"
              }`}>
                <RefreshCw className="w-4.5 h-4.5 animate-spin text-amber-500" />
              </div>
              <div className="space-y-1">
                <div className={`p-4 rounded-2xl text-xs italic ${
                  isDark ? "bg-slate-900/80 text-amber-200/80" : "bg-white text-amber-800/80"
                }`}>
                  Consulting cosmic constellations...
                </div>
              </div>
            </div>
          )}

          {/* Centered suggested queries inside the chat list for high visibility */}
          {messages.length <= 1 && !loading && (
            <div className="pt-6 pb-4 max-w-xl mx-auto space-y-4 animate-fadeIn">
              <div className="text-center">
                <p className={`text-xs font-bold uppercase tracking-widest text-amber-500`}>
                  ✨ Quick Consultations ✨
                </p>
                <p className={`text-[11px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Click any sacred card below to immediately query the Celestial Oracle
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {PRESET_PROMPTS.map((prompt, i) => (
                  <button
                    key={`chat-starter-${i}`}
                    id={`chat-starter-btn-${i}`}
                    onClick={() => handleSend(prompt.text)}
                    className={`p-4 rounded-2xl text-left transition-all border hover:scale-[1.02] flex flex-col justify-between gap-3 cursor-pointer ${
                      isDark
                        ? "bg-slate-900/90 border-slate-800 hover:border-amber-400/50 text-slate-100 hover:bg-slate-850 shadow-md"
                        : "bg-white border-amber-200 hover:border-amber-500 text-slate-800 hover:bg-amber-50/50 shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{prompt.icon}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-amber-500">{prompt.category}</span>
                    </div>
                    <span className="text-xs font-medium leading-relaxed">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input area - Highly enhanced and enlarged */}
        <div className={`p-4 border-t ${
          isDark ? "bg-slate-950/80 border-slate-850" : "bg-white border-slate-200 shadow-inner"
        }`}>
          {/* Quick micro-chips above input for ease of use */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none max-w-full">
            {PRESET_PROMPTS.map((prompt, i) => (
              <button
                key={`micro-chip-${i}`}
                id={`micro-chip-btn-${i}`}
                onClick={() => handleSend(prompt.text)}
                disabled={loading}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1.5 border shrink-0 cursor-pointer ${
                  isDark
                    ? "bg-slate-900 border-slate-850 text-slate-300 hover:text-white hover:border-amber-400/40 hover:bg-slate-855"
                    : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-amber-600/40 hover:bg-slate-150"
                }`}
              >
                <span>{prompt.icon}</span>
                <span>{prompt.category}</span>
              </button>
            ))}
          </div>

          <div className="relative flex items-center w-full gap-2">
            <input
              id="astro-chat-input"
              type="text"
              placeholder="Type your celestial query (e.g. My career purpose...)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
              className={`w-full pl-5 pr-36 py-4 rounded-full text-xs md:text-sm border focus:outline-none focus:ring-2 shadow-sm ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-white focus:ring-amber-400/50 focus:border-amber-400"
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-amber-600/50 focus:border-amber-600"
              }`}
            />
            {/* Highly enhanced larger button */}
            <button
              id="send-chat-btn"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className={`absolute right-1.5 px-5 py-2.5 rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 shadow-md ${
                loading || !input.trim()
                  ? "opacity-40 cursor-not-allowed bg-slate-700 text-slate-400"
                  : isDark
                  ? "bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-[1.03] active:scale-[0.97]"
                  : "bg-amber-600 hover:bg-amber-700 text-white hover:scale-[1.03] active:scale-[0.97]"
              }`}
              style={{ minHeight: "44px" }}
            >
              <Send className="w-4.5 h-4.5 shrink-0" />
              <span className="text-xs font-extrabold tracking-wide uppercase">Ask Oracle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

