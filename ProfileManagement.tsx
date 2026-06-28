import React, { useState } from "react";
import { BirthProfile } from "../types";
import { getZodiacSign, zodiacSigns } from "../data/zodiac";
import { User, Plus, Trash2, Calendar, Clock, MapPin, Sparkles, Check, Info } from "lucide-react";

interface ProfileManagementProps {
  profiles: BirthProfile[];
  onAddProfile: (profile: Omit<BirthProfile, "id">) => void;
  onDeleteProfile: (id: string) => void;
  onSetMainProfile: (id: string) => void;
  theme: "cosmos" | "solstice";
}

export default function ProfileManagement({
  profiles,
  onAddProfile,
  onDeleteProfile,
  onSetMainProfile,
  theme,
}: ProfileManagementProps) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("12:00");
  const [birthPlace, setBirthPlace] = useState("");
  const [gender, setGender] = useState("Unspecified");
  const [notes, setNotes] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const calculatedSign = birthDate ? getZodiacSign(birthDate) : "";
  const signInfo = zodiacSigns.find((s) => s.name === calculatedSign);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate || !birthPlace) return;

    onAddProfile({
      name,
      birthDate,
      birthTime,
      birthPlace,
      zodiacSign: calculatedSign,
      gender,
      notes,
      isMain: profiles.length === 0, // First profile is main by default
    });

    // Reset form
    setName("");
    setBirthDate("");
    setBirthTime("12:00");
    setBirthPlace("");
    setGender("Unspecified");
    setNotes("");
    setShowAddForm(false);
  };

  const isDark = theme === "cosmos";

  return (
    <div id="profile-management-section" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-serif tracking-wide font-semibold ${isDark ? "text-amber-200" : "text-amber-800"}`}>
            Birth Profiles
          </h2>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Manage birth data for yourself, friends, and loved ones to calculate synastry and personalized charts.
          </p>
        </div>
        
        <button
          id="toggle-add-profile-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-md ${
            showAddForm
              ? "bg-rose-600 hover:bg-rose-500 text-white"
              : isDark
              ? "bg-amber-400 hover:bg-amber-300 text-slate-950"
              : "bg-amber-600 hover:bg-amber-700 text-white"
          }`}
        >
          {showAddForm ? "Cancel" : <><Plus className="w-4 h-4" /> Add Profile</>}
        </button>
      </div>

      {showAddForm && (
        <form
          id="add-profile-form"
          onSubmit={handleSubmit}
          className={`p-6 rounded-2xl border transition-all duration-300 animate-fadeIn ${
            isDark
              ? "bg-slate-900/90 border-amber-500/30 text-white"
              : "bg-white/95 border-amber-200 text-slate-900 shadow-lg"
          }`}
        >
          <h3 className="text-lg font-serif font-semibold mb-4 text-amber-500 flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse" /> Enter Sacred Birth Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-amber-200/80" : "text-amber-700"}`}>
                Name
              </label>
              <input
                id="profile-name-input"
                type="text"
                required
                placeholder="Seeker's Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-slate-950/60 border-slate-700 text-white focus:ring-amber-400/50 focus:border-amber-400"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-amber-600/50 focus:border-amber-600"
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-amber-200/80" : "text-amber-700"}`}>
                Birth Date
              </label>
              <div className="relative">
                <input
                  id="profile-date-input"
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-slate-950/60 border-slate-700 text-white focus:ring-amber-400/50 focus:border-amber-400"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-amber-600/50 focus:border-amber-600"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-amber-200/80" : "text-amber-700"}`}>
                Birth Time (Local)
              </label>
              <input
                id="profile-time-input"
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-slate-950/60 border-slate-700 text-white focus:ring-amber-400/50 focus:border-amber-400"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-amber-600/50 focus:border-amber-600"
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-amber-200/80" : "text-amber-700"}`}>
                Birth Location
              </label>
              <input
                id="profile-place-input"
                type="text"
                required
                placeholder="City, Country"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-slate-950/60 border-slate-700 text-white focus:ring-amber-400/50 focus:border-amber-400"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-amber-600/50 focus:border-amber-600"
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-amber-200/80" : "text-amber-700"}`}>
                Identity / Preference
              </label>
              <select
                id="profile-gender-input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-slate-950/60 border-slate-700 text-white focus:ring-amber-400/50 focus:border-amber-400"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-amber-600/50 focus:border-amber-600"
                }`}
              >
                <option value="Unspecified">Prefer Not to Say</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-Binary">Non-Binary</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-amber-200/80" : "text-amber-700"}`}>
                Cosmic Intentions
              </label>
              <input
                id="profile-notes-input"
                type="text"
                placeholder="e.g. Seeking career clarity, spiritual guide"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-slate-950/60 border-slate-700 text-white focus:ring-amber-400/50 focus:border-amber-400"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-amber-600/50 focus:border-amber-600"
                }`}
              />
            </div>
          </div>

          {calculatedSign && (
            <div className={`mt-5 p-4 rounded-xl border flex items-center gap-4 ${
              isDark ? "bg-amber-400/5 border-amber-400/20" : "bg-amber-50 border-amber-200"
            }`}>
              <div className="text-4xl">{signInfo?.symbol}</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">Calculated Zodiac Sign</p>
                <p className={`font-serif text-lg font-bold ${isDark ? "text-amber-200" : "text-slate-800"}`}>
                  {calculatedSign} <span className="text-xs font-sans font-normal opacity-70">({signInfo?.element} • {signInfo?.modality})</span>
                </p>
                <p className={`text-xs mt-0.5 line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{signInfo?.description}</p>
              </div>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              id="submit-profile-btn"
              type="submit"
              className={`px-6 py-2.5 rounded-full text-sm font-semibold shadow-md transition-all ${
                isDark
                  ? "bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950"
                  : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white"
              }`}
            >
              Align & Record Profile
            </button>
          </div>
        </form>
      )}

      {profiles.length === 0 ? (
        <div className={`text-center p-8 rounded-2xl border border-dashed ${
          isDark ? "bg-slate-900/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-300 text-slate-600"
        }`}>
          <User className="w-10 h-10 mx-auto mb-3 opacity-40 animate-pulse text-amber-500" />
          <p className="text-base font-serif font-medium">No birth charts recorded yet</p>
          <p className="text-xs mt-1">Add your profile details above to unlock customized daily horoscopes, synastry readings, and live Oracle chat guidance.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile) => {
            const zInfo = zodiacSigns.find((s) => s.name === profile.zodiacSign);
            return (
              <div
                key={profile.id}
                id={`profile-card-${profile.id}`}
                className={`p-5 rounded-2xl border relative flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                  profile.isMain
                    ? isDark
                      ? "bg-slate-900/95 border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                      : "bg-amber-50/90 border-amber-600 shadow-[0_0_12px_rgba(217,119,6,0.15)]"
                    : isDark
                    ? "bg-slate-900/60 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                {profile.isMain && (
                  <span className={`absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    isDark ? "bg-amber-400 text-slate-950" : "bg-amber-600 text-white"
                  }`}>
                    <Check className="w-3 h-3 stroke-[3]" /> Main Seeker
                  </span>
                )}

                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`text-lg font-serif font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                        {profile.name}
                      </h4>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {profile.gender !== "Unspecified" ? profile.gender : ""}
                      </p>
                    </div>
                    <span className="text-3xl">{zInfo?.symbol}</span>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 opacity-60 text-amber-500" />
                      <span className={isDark ? "text-slate-300" : "text-slate-700"}>{profile.birthDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 opacity-60 text-amber-500" />
                      <span className={isDark ? "text-slate-300" : "text-slate-700"}>{profile.birthTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 opacity-60 text-amber-500" />
                      <span className={`truncate ${isDark ? "text-slate-300" : "text-slate-700"}`}>{profile.birthPlace}</span>
                    </div>
                  </div>

                  {profile.notes && (
                    <div className={`mt-3 p-2 rounded-lg text-[11px] italic flex gap-1.5 ${
                      isDark ? "bg-slate-950/40 text-slate-400 border border-slate-800/60" : "bg-slate-50 text-slate-600 border border-slate-200/60"
                    }`}>
                      <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="line-clamp-2">{profile.notes}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/10 dark:border-slate-100/10 flex justify-between items-center">
                  {!profile.isMain && (
                    <button
                      id={`set-main-btn-${profile.id}`}
                      onClick={() => onSetMainProfile(profile.id)}
                      className={`text-xs font-semibold ${
                        isDark ? "text-amber-400/80 hover:text-amber-300" : "text-amber-600 hover:text-amber-700"
                      }`}
                    >
                      Make Main Seeker
                    </button>
                  )}
                  {profile.isMain && <div />}

                  <button
                    id={`delete-profile-btn-${profile.id}`}
                    onClick={() => onDeleteProfile(profile.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                    title="Dissolve Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
