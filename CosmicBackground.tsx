import React, { useEffect, useState } from "react";

interface CosmicBackgroundProps {
  theme: "cosmos" | "solstice";
}

export default function CosmicBackground({ theme }: CosmicBackgroundProps) {
  const [stars, setStars] = useState<{ id: number; top: number; left: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate static random positions for stars so they don't change on re-render
    const generatedStars = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden transition-all duration-1000">
      {theme === "cosmos" ? (
        // Deep Cosmos - Dark Mode
        <div className="absolute inset-0 bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black">
          {/* Cosmic Nebula Glow */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse" style={{ animationDuration: "12s" }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/15 blur-[100px] animate-pulse" style={{ animationDuration: "15s" }} />
          
          {/* Twinkling Stars */}
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute bg-white rounded-full opacity-60 animate-ping"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDuration: `${3 + star.delay}s`,
                animationDelay: `${star.delay}s`,
                boxShadow: "0 0 6px rgba(255, 255, 255, 0.8)",
              }}
            />
          ))}

          {/* Golden Constellation Accent Circles */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" r="300" stroke="gold" strokeWidth="1" fill="none" strokeDasharray="5 15" className="animate-[spin_120s_linear_infinite]" />
            <circle cx="50%" cy="50%" r="450" stroke="gold" strokeWidth="1" fill="none" strokeDasharray="10 20" className="animate-[spin_180s_linear_infinite_reverse]" />
            <path d="M100,200 L150,180 L220,220 L300,150" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M800,400 L850,450 L920,410 L990,480" stroke="white" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
      ) : (
        // Golden Solstice - Light Mode
        <div className="absolute inset-0 bg-amber-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-orange-50 to-amber-50">
          {/* Solar Nebula Glow */}
          <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-amber-200/40 blur-[80px] animate-pulse" style={{ animationDuration: "10s" }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-100/40 blur-[90px] animate-pulse" style={{ animationDuration: "14s" }} />
          
          {/* Subtle Twinkling Solar Sparks */}
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute bg-amber-400 rounded-full opacity-40 animate-pulse"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size + 1}px`,
                height: `${star.size + 1}px`,
                animationDuration: `${2.5 + star.delay}s`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}

          {/* Delicate Solar Geometry */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" r="280" stroke="#d97706" strokeWidth="1" fill="none" strokeDasharray="4 10" className="animate-[spin_100s_linear_infinite]" />
            <circle cx="50%" cy="50%" r="400" stroke="#d97706" strokeWidth="0.5" fill="none" strokeDasharray="12 12" className="animate-[spin_150s_linear_infinite_reverse]" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="5 5" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="5 5" />
          </svg>
        </div>
      )}
    </div>
  );
}
