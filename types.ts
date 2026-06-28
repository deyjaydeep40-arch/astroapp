export interface BirthProfile {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  birthPlace: string; // City, Country
  zodiacSign: string;
  gender: string;
  notes?: string;
  isMain?: boolean;
}

export interface HoroscopeData {
  sign: string;
  date: string;
  general: string;
  love: string;
  career: string;
  wellness: string;
  luckyNumber: number;
  luckyColor: string;
  powerHour: string;
  cosmicTip: string;
  compatibilityWith: string;
  energyLevel: number;
}

export interface CompatibilityData {
  overallScore: number;
  categories: {
    romance: number;
    communication: number;
    values: number;
    challenges: number;
  };
  romanticAnalysis: string;
  communicationAnalysis: string;
  valuesAnalysis: string;
  challengesAnalysis: string;
  verdict: string;
  goldenRule: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ZodiacSignDetails {
  name: string;
  symbol: string;
  dateRange: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  modality: "Cardinal" | "Fixed" | "Mutable";
  rulingPlanet: string;
  strengths: string[];
  weaknesses: string[];
  description: string;
  loveStyle: string;
  careerStyle: string;
}

export interface AstroAlert {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "horoscope" | "retrograde" | "moon" | "general";
  read: boolean;
}
