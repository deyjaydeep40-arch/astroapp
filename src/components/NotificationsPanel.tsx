import React, { useState } from "react";
import { AstroAlert } from "../types";
import { Bell, Info, Moon, Star, ShieldAlert, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";

interface NotificationsPanelProps {
  alerts: AstroAlert[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onSimulateAlert: (type: "horoscope" | "retrograde" | "moon" | "general") => void;
  theme: "cosmos" | "solstice";
}

export default function NotificationsPanel({
  alerts,
  onMarkRead,
  onClearAll,
  onSimulateAlert,
  theme,
}: NotificationsPanelProps) {
  const [subscribed, setSubscribed] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [retrogradeAlerts, setRetrogradeAlerts] = useState(true);

  const isDark = theme === "cosmos";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="notifications-panel-container">
      {/* Alert settings */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? "bg-slate-900/80 border-amber-500/20" : "bg-white border-amber-200 shadow-md"
      }`}>
        <h3 className={`text-lg font-serif font-bold ${isDark ? "text-amber-200" : "text-amber-800"} flex items-center gap-2`}>
          <Bell className="w-5 h-5 animate-swing" /> Astrological Alert Hub
        </h3>
        <p className={`text-xs mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Configure your daily cosmic notifications and live astrological push alerts.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/20 border border-slate-800/10 dark:border-slate-100/10">
            <div>
              <p className="text-xs font-semibold">Enable Real-Time Push Alerts</p>
              <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Instant transit warnings & warnings</p>
            </div>
            <button
              id="subscribe-push-toggle"
              onClick={() => setSubscribed(!subscribed)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                subscribed ? "bg-amber-500" : "bg-slate-800"
              }`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                subscribed ? "transform translate-x-5" : ""
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/20 border border-slate-800/10 dark:border-slate-100/10">
            <div>
              <p className="text-xs font-semibold">Daily Horoscope Reminders</p>
              <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Sent every morning at solar dawn</p>
            </div>
            <button
              id="daily-reminders-toggle"
              onClick={() => setDailyReminders(!dailyReminders)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                dailyReminders ? "bg-amber-500" : "bg-slate-800"
              }`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                dailyReminders ? "transform translate-x-5" : ""
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/20 border border-slate-800/10 dark:border-slate-100/10">
            <div>
              <p className="text-xs font-semibold">Retrograde Alert System</p>
              <p className={`text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Mercury, Mars, Venus retrograde indicators</p>
            </div>
            <button
              id="retrograde-alerts-toggle"
              onClick={() => setRetrogradeAlerts(!retrogradeAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                retrogradeAlerts ? "bg-amber-500" : "bg-slate-800"
              }`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                retrogradeAlerts ? "transform translate-x-5" : ""
              }`} />
            </button>
          </div>
        </div>

        {/* Simulator block */}
        <div className="mt-8 pt-5 border-t border-slate-800/10 dark:border-slate-100/10">
          <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Simulate Cosmic Events</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="simulate-daily-alert"
              onClick={() => onSimulateAlert("horoscope")}
              className={`p-2.5 rounded-xl text-[11px] transition-all border text-left ${
                isDark ? "bg-slate-950/50 border-slate-800 text-slate-300 hover:border-amber-400/30" : "bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-600/30"
              }`}
            >
              ☀️ Daily Transit
            </button>
            <button
              id="simulate-retro-alert"
              onClick={() => onSimulateAlert("retrograde")}
              className={`p-2.5 rounded-xl text-[11px] transition-all border text-left ${
                isDark ? "bg-slate-950/50 border-slate-800 text-slate-300 hover:border-amber-400/30" : "bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-600/30"
              }`}
            >
              ⚠️ Retrograde Start
            </button>
            <button
              id="simulate-moon-alert"
              onClick={() => onSimulateAlert("moon")}
              className={`p-2.5 rounded-xl text-[11px] transition-all border text-left ${
                isDark ? "bg-slate-950/50 border-slate-800 text-slate-300 hover:border-amber-400/30" : "bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-600/30"
              }`}
            >
              🌙 Moon Phase
            </button>
            <button
              id="simulate-gen-alert"
              onClick={() => onSimulateAlert("general")}
              className={`p-2.5 rounded-xl text-[11px] transition-all border text-left ${
                isDark ? "bg-slate-950/50 border-slate-800 text-slate-300 hover:border-amber-400/30" : "bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-600/30"
              }`}
            >
              ✨ Stellar Alignment
            </button>
          </div>
        </div>
      </div>

      {/* Alerts feed */}
      <div className={`lg:col-span-2 p-6 rounded-2xl border flex flex-col justify-between ${
        isDark ? "bg-slate-900/40 border-amber-500/20" : "bg-slate-50/80 border-amber-200 shadow-md"
      }`}>
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/10 dark:border-slate-100/10">
            <h4 className="font-serif font-bold text-amber-500 text-sm">Divine Notification Feed</h4>
            {alerts.length > 0 && (
              <button
                id="clear-all-alerts"
                onClick={onClearAll}
                className={`text-xs ${isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800"}`}
              >
                Clear All
              </button>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-50 animate-pulse" />
              <p className="text-sm font-serif font-medium">Celestial channels are tranquil</p>
              <p className={`text-xs mt-1 max-w-xs mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                No unread transit warnings. Try simulating planetary changes with the dashboard on the left!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {alerts.map((alert) => {
                let colorClass = "";
                let Icon = Sparkles;

                if (alert.type === "retrograde") {
                  colorClass = isDark ? "border-amber-500 bg-amber-500/5 text-amber-200" : "border-amber-600 bg-amber-50 text-amber-800";
                  Icon = AlertTriangle;
                } else if (alert.type === "moon") {
                  colorClass = isDark ? "border-indigo-500 bg-indigo-500/5 text-indigo-200" : "border-indigo-600 bg-indigo-50 text-indigo-800";
                  Icon = Moon;
                } else if (alert.type === "horoscope") {
                  colorClass = isDark ? "border-emerald-500 bg-emerald-500/5 text-emerald-200" : "border-emerald-600 bg-emerald-50 text-emerald-800";
                  Icon = Star;
                } else {
                  colorClass = isDark ? "border-slate-700 bg-slate-900/80 text-slate-100" : "border-slate-300 bg-white text-slate-800";
                  Icon = Sparkles;
                }

                return (
                  <div
                    key={alert.id}
                    id={`alert-card-${alert.id}`}
                    onClick={() => onMarkRead(alert.id)}
                    className={`p-4 rounded-xl border border-l-4 transition-all duration-300 cursor-pointer ${colorClass} ${
                      alert.read ? "opacity-60" : "shadow-sm hover:scale-[1.005]"
                    }`}
                  >
                    <div className="flex gap-3 items-start">
                      <div className="p-1.5 rounded-lg shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <p className="text-xs font-bold font-serif">{alert.title}</p>
                          <span className="text-[9px] opacity-65 shrink-0">{alert.time}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed mt-1">{alert.body}</p>
                        {!alert.read && (
                          <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider text-amber-500">
                            • Mark as Read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={`mt-5 p-3.5 rounded-xl flex gap-3 text-xs border ${
          isDark ? "bg-amber-400/5 border-amber-400/10 text-amber-200/80" : "bg-amber-50 border-amber-200 text-amber-800"
        }`}>
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Astrological events are generated live using modern ephemeris algorithms aligning planetary transits precisely with our system's core clock.
          </p>
        </div>
      </div>
    </div>
  );
}
