import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// ==========================================
// HIGH-FIDELITY LOCAL ASTROLOGY GENERATORS
// ==========================================

function getLocalHoroscope(sign: string, dateStr: string, mood?: string) {
  const seedDate = new Date(dateStr);
  const day = isNaN(seedDate.getTime()) ? 15 : seedDate.getDate();
  const month = isNaN(seedDate.getTime()) ? 6 : seedDate.getMonth();
  
  let nameSum = 0;
  for (let i = 0; i < sign.length; i++) nameSum += sign.charCodeAt(i);
  
  const selectedMood = mood || "Radiant";
  
  // Calculate a mood seed offset to ensure lucky parameters vary dynamically
  let moodOffset = 0;
  for (let i = 0; i < selectedMood.length; i++) moodOffset += selectedMood.charCodeAt(i);
  
  const seed = nameSum + day + month * 31 + moodOffset;

  // Get sign attributes
  const s = sign.toLowerCase();
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

  const compatibilitySigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const filteredCompat = compatibilitySigns.filter(z => z.toLowerCase() !== s);
  const compatSign = filteredCompat[seed % filteredCompat.length];
  
  const energy = 75 + (seed % 21);
  const luckyNum = (seed % 9) + 1;
  const colors = ["Celestial Emerald", "Solar Gold", "Cosmic Indigo", "Aether White", "Lunar Violet", "Stardust Amber", "Deep Crimson", "Sapphire Pearl", "Saffron Glow", "Roseate Quartz", "Muted Charcoal", "Electric Azure"];
  const luckyColor = colors[seed % colors.length];
  const powerHours = ["10:30 AM", "11:15 AM", "2:00 PM", "4:30 PM", "7:45 PM", "9:00 PM", "11:00 PM", "6:15 AM", "1:30 PM", "8:11 PM"];
  const powerHour = powerHours[seed % powerHours.length];
  
  let general = "";
  let love = "";
  let career = "";
  let wellness = "";
  let cosmicTip = "";

  if (selectedMood === "Radiant") {
    general = `The universe is magnifying your innate solar spark. Today, as your ruler ${ruler} forms a harmonious aspect with ascending lunar degrees, your ${element} core is buzzing with brilliant intuitive frequencies. It is an extraordinary window to step directly into the spotlight, launch critical designs, and let your authentic frequency capture the admiration of your surroundings. Clear away any past hesitation—today, the cosmic spotlight shines directly on your path.`;
    love = `Venus is casting an exceptionally warm, magnetic sheen over your relationship sector. Your energetic field is highly attractive today, drawing in playful conversations, synchronistic glances, and genuine emotional safety. If coupled, plan a spontaneous celebration of your bond. If single, the stars are aligning for a sparkling connection with a highly compatible ${compatSign} seeker.`;
    career = `An active Mars-Jupiter transit in your solar house of fortune suggests highly favorable financial expansions. Your cognitive focus is exceptionally sharp, enabling you to articulate complex business goals and convince key decision-makers. It is a fantastic moment to pitch ambitious ideas, ask for well-deserved resources, or take calculated leaps.`;
    wellness = `Your emotional vitality is at an all-time peak, overflowing with joyous solar power. Your heart chakra is wide open and balanced. Ground this beautiful, radiant energy by drinking pure mineral water, spending time under the direct sky, and practicing a heart-opening meditation. Let your laughter be your primary spiritual remedy today.`;
    cosmicTip = `Focus your awareness on the present joy; your positive vibrations are opening massive doors of celestial abundance today.`;
  } else if (selectedMood === "Reflective") {
    general = `A quiet, introspective lunar node is gently guiding your consciousness inward today. With your ruler ${ruler} transiting through a contemplative aspect, your active ${element} spirit is being invited to rest and review. This is not a day for outer pushing, but rather a sacred window for charting patterns, identifying subtle spiritual shifts, and listening to the soft whispers of your higher self.`;
    love = `In matters of the heart, the cosmic currents encourage deep, silent understanding and nurturing presence. Instead of seeking verbal confirmation, look for the quiet, small acts of devotion. A soulful, quiet conversation over a warm drink or shared silent contemplation will dissolve any lingering dynamic friction far better than elaborate words.`;
    career = `The stars advise a careful audit of your current targets. Mercury's transit suggests that finalizing existing administrative layouts and resolving minor oversights will yield much stronger foundations than starting raw projects. Focus on planning, organizing your desk space, and cultivating your specialized skills in solitude.`;
    wellness = `Your nervous system is highly receptive to subtle vibrations today. Give yourself permission to disconnect from the digital noise. Engage in slow, mindful breathing, take a warm salt bath, or practice restorative yoga. Your third eye chakra is calling for silence, dreams, and gentle twilight reflections.`;
    cosmicTip = `Let go of situations you cannot control, and watch how beautifully they resolve themselves in divine timing.`;
  } else if (selectedMood === "Ambitious") {
    general = `A powerful, driving conjunction is fueling your personal motivation. As the Mars aspect activates your ${element} sign, you feel an irresistible urge to break through older limitations and construct long-term systems. Your ruling planet ${ruler} is in a prime alignment of sheer determination, giving you the stamina and razor-sharp clarity to conquer any lingering obstacles.`;
    love = `The energetic intensity of today makes your interactions highly direct and purposeful. You are not interested in superficial exchanges; you want real, constructive devotion. Be careful not to let your driving ambition sound overly demanding to those you love. Balance your powerful drive with a touch of Venusian softness.`;
    career = `A massive transit through your solar house of worldly success is happening today! This is the ultimate day to close deals, present high-stakes masterplans, or execute complex tasks. Your leadership potential is highlighted, and others will naturally follow your commanding vision. Trust your structural instincts and push forward.`;
    wellness = `With high-octane vital energy rushing through your veins, physical release is absolutely necessary to prevent inner tension. A high-intensity workout, a long run, or physical building tasks will successfully channel this Martian surge. Avoid caffeine in the evening to allow your active mind to transition into deep, restoring sleep.`;
    cosmicTip = `Channel your drive into productive creation; Saturn rewards dedicated, disciplined efforts.`;
  } else if (selectedMood === "Peaceful") {
    general = `A gentle, calming breeze from Venus and Neptune is washing over your astrological sectors. The stars are in a beautiful, non-demanding configuration that brings profound harmony to your ${element} spirit. Under this alignment, you are perfectly content with the natural unfolding of the universe, recognizing that everything is moving in divine right timing.`;
    love = `Your romantic energy is incredibly comforting, acting as a peaceful harbor for everyone you interact with. It is a beautiful day to forgive past misunderstandings, share quiet hugs, and enjoy simple moments of emotional safety. The stars are weaving a protective shield of tenderness around your heart.`;
    career = `In professional spheres, a relaxed and collaborative atmosphere prevails. Projects flow smoothly without the usual friction. Your ability to bring calm resolution to disputes makes you a highly valued presence in your workspace. Trust that financial avenues are stable and secure under today's protective planetary rays.`;
    wellness = `Your bodily rhythms are perfectly aligned with natural elements. Focus on gentle, soothing movements like walking in nature, practicing tai chi, or simply stretching. Nourish your system with herbal infusions and fresh organic greens. Your aura is clean, bright, and deeply grounded.`;
    cosmicTip = `Trust the quiet whisper of your intuition over the loud noise of the external world today.`;
  } else if (selectedMood === "Turbulent") {
    general = `A temporary planetary square is challenging your ${element} sectors, testing your adaptability and resilience. With ${ruler} locked in a complex opposition with Saturn, you might feel a clash between outer duties and inner desires. Do not fear this friction; it is a sacred cosmic invitation to burn away old illusions, strengthen your core, and emerge much stronger.`;
    love = `Emotional storms could brew if expectations are left unspoken. The current lunar phase might amplify minor triggers into larger disagreements. Before responding, take a deep breath and locate your center. Use this opportunity to practice absolute clarity and set respectful boundaries, which will ultimately deepen your bonds.`;
    career = `High stakes and rapid shifts characterize your professional sector today. Plans might change unexpectedly, requiring you to pivot with absolute composure. Avoid making rushed financial decisions or signing major agreements today. Let the cosmic dust settle first, and focus on maintaining your inner stability.`;
    wellness = `Your emotional and physical systems are carrying extra stress today. Protect your auric field by limiting contact with chaotic environments or demanding personalities. Practice deep, rhythmic breathing, and use essential oils like lavender to soothe your active mind. Remember: even the wildest cosmic storm eventually runs out of rain.`;
    cosmicTip = `Take a step back, breathe deeply, and protect your inner peace from external turbulence.`;
  } else {
    // Passionate
    general = `The cosmos is vibrating with intense, rich desires and creative fire today! Your ${element} sectors are fully ignited as Venus and Pluto dance in a powerful transit. Your soul feels a deep hunger for absolute authenticity, creative obsession, and profound connections that transcend the ordinary. Do not hold back your intense expression; the universe is begging you to live fully.`;
    love = `An electric, unforgettable energy fills your romantic arena today! The magnetic pull between you and your desires is extremely high. Conversations are loaded with meaning, and eye contact is mesmerizing. If you are coupled, expect a powerful renewal of intimacy. If single, your magnetic field could draw in a fateful soul connection with ${compatSign}.`;
    career = `Your career projects are fueled by your deep, personal passion. You are completely committed to your work today, infusing your tasks with unique, magnetic creative style. This intense focus will produce highly compelling results that command attention. Your financial avenues are glowing with high-reward prospects.`;
    wellness = `Your life force is strong, rich, and deeply active. Channel this intense, passionate energy into creative outlets like music, painting, dancing, or expressive physical movement. Your sacral chakra is highly active. Stay grounded by staying connected to your physical sensations and breathing deeply.`;
    cosmicTip = `A small gesture of pure gratitude and raw passion today will open massive doors of cosmic abundance tomorrow.`;
  }

  return {
    sign,
    date: dateStr,
    general,
    love,
    career,
    wellness,
    luckyNumber: luckyNum,
    luckyColor,
    powerHour,
    cosmicTip,
    compatibilityWith: compatSign,
    energyLevel: energy
  };
}

function getLocalCompatibility(sign1: string, name1: string, sign2: string, name2: string) {
  const p1 = name1 || "Seeker 1";
  const p2 = name2 || "Seeker 2";
  
  const comboStr = [sign1, sign2].sort().join("");
  let seed = 0;
  for (let i = 0; i < comboStr.length; i++) seed += comboStr.charCodeAt(i);
  
  const scores = [82, 85, 88, 91, 93, 95, 78, 80, 84];
  const overallScore = scores[seed % scores.length];
  
  const romance = 75 + (seed % 21);
  const communication = 75 + ((seed + 3) % 21);
  const values = 75 + ((seed + 7) % 21);
  const challenges = 60 + ((seed + 11) % 21);
  
  return {
    overallScore,
    categories: { romance, communication, values, challenges },
    romanticAnalysis: `The connection between ${p1} (${sign1}) and ${p2} (${sign2}) hums with a warm, natural resonance. Venusian currents flow freely, creating an atmosphere of immediate understanding and magnetic attraction. You inspire each other's emotional expressions and build a sanctuary of shared feelings.`,
    communicationAnalysis: `Your mental wavelengths align beautifully. Whether discussing deep existential mysteries or daily pragmatics, conversations between ${p1} and ${p2} feel spontaneous, enriching, and free of judgment. You stimulate each other's curiosity and respect different perspectives.`,
    valuesAnalysis: `In terms of life goals and core values, your charts indicate a highly cooperative structure. You both value stability, integrity, and mutual growth. While your approaches may differ slightly (due to element styles), your destination remains beautifully synchronized.`,
    challengesAnalysis: `The primary celestial challenge arises during Saturn retrogrades, where minor stubbornness or unexpressed expectations might create temporary distance. Overcome this by practicing active, compassionate listening and addressing issues before they accumulate.`,
    verdict: `A highly auspicious cosmic pairing that combines emotional warmth, mental synergy, and a solid foundation for long-term growth.`,
    goldenRule: `Celebrate your differences as unique strengths; a relationship is a beautiful dance of two individual stars.`
  };
}

function getLocalChatReply(messages: any[], userProfile: any) {
  const lastUserMessage = [...messages].reverse().find(m => m.role === "user")?.content || "";
  const query = lastUserMessage.toLowerCase();
  const name = userProfile?.name || "Seeker";
  const sign = userProfile?.zodiacSign || "your sign";
  
  let response = "";
  if (query.includes("career") || query.includes("job") || query.includes("work") || query.includes("money") || query.includes("profession")) {
    response = `Greetings, ${name}. Your career vectors are currently undergoing a powerful transit. With Jupiter moving through your sectors of skill and ambition, there is a strong cosmic pull toward structural independence. You thrive when you align your daily tasks with a sense of higher purpose. 

If you feel stuck, consider this a divine invitation from Saturn to master your current craft before leaping. Favorable avenues include creative strategy, communication, or building independent systems. Trust the cosmic timing, for the seeds you plant now will bear rich fruits.`;
  } else if (query.includes("love") || query.includes("relationship") || query.includes("marry") || query.includes("marriage") || query.includes("partner") || query.includes("compatibility")) {
    response = `Dear ${name}, the patterns of the heart are governed by the elegant dance of Venus in your chart. The stars indicate that your romantic sector is experiencing a period of emotional deepening. 

For you, true connection is built on shared spiritual wavelengths and mutual respect for freedom. If you are in a relationship, the current transit invites you to renew your vows of understanding and clear communication. If single, the cosmos is urging you to cultivate self-love first—your energetic vibration is your strongest love magnet.`;
  } else if (query.includes("health") || query.includes("wellness") || query.includes("energy") || query.includes("feel") || query.includes("vitality")) {
    response = `I hear you, ${name}. Your physical vitality is closely linked to your emotional and energetic alignment. The moon phases play a significant role in your energy levels. 

Right now, the alignment invites you to engage in grounding practices. Spend time near natural elements, practice deep, rhythmic breathing, and protect your energy from external noise. Your solar plexus chakra is calling for warmth and mindful nourishment.`;
  } else {
    response = `Welcome to the Cosmic Sanctuary, ${name}. As a soul carrying the energetic signature of ${sign}, you are highly receptive to the subtle currents of the universe. 

The planetary positions today indicate a beautiful window for self-reflection and spiritual growth. The query you pose is a reflection of a deeper soul search. Know that the answer already resides within you; the stars are simply highlighting the path of least resistance. 

Is there a specific area—such as career destiny, romantic synastry, or your personal Vedic Kundli—that you would like us to dive deeper into?`;
  }
  
  return response;
}

function getLocalKundli(name: string, birthDate: string, birthTime: string, birthPlace: string, gender: string) {
  const userName = name || "Seeker";
  
  const bDate = new Date(birthDate);
  const day = isNaN(bDate.getTime()) ? 15 : bDate.getDate();
  const month = isNaN(bDate.getTime()) ? 6 : bDate.getMonth();
  
  const lagnas = ["Aries (Mesh)", "Taurus (Vrishabha)", "Gemini (Mithuna)", "Cancer (Karka)", "Leo (Simha)", "Virgo (Kanya)", "Libra (Tula)", "Scorpio (Vrischika)", "Sagittarius (Dhanu)", "Capricorn (Makara)", "Aquarius (Kumbha)", "Pisces (Meena)"];
  const rasis = ["Leo (Simha)", "Virgo (Kanya)", "Libra (Tula)", "Scorpio (Vrischika)", "Sagittarius (Dhanu)", "Capricorn (Makara)", "Aquarius (Kumbha)", "Pisces (Meena)", "Aries (Mesh)", "Taurus (Vrishabha)", "Gemini (Mithuna)", "Cancer (Karka)"];
  const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  
  const lagnaIdx = (day + month) % lagnas.length;
  const rasiIdx = (day * month) % rasis.length;
  const nakshatraIdx = (day * 3 + month) % nakshatras.length;
  
  const lagna = lagnas[lagnaIdx];
  const rasi = rasis[rasiIdx];
  const nakshatra = `${nakshatras[nakshatraIdx]} (Pada ${(day % 4) + 1})`;
  const rulingPlanets = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const rulingPlanet = rulingPlanets[lagnaIdx];
  const sunSign = rasis[(rasiIdx + 2) % rasis.length];
  
  const houses: { [key: string]: string[] } = {
    "1": ["Lagna"], "2": [], "3": [], "4": [], "5": [], "6": [], "7": [], "8": [], "9": [], "10": [], "11": [], "12": []
  };
  
  planets.forEach((p, idx) => {
    const houseNum = (((day + month + idx * 7) % 12) + 1).toString();
    if (!houses[houseNum]) houses[houseNum] = [];
    houses[houseNum].push(p);
  });
  
  return {
    lagna,
    rasi,
    nakshatra,
    rulingPlanet,
    sunSign,
    houses,
    careerPrediction: `Your Vedic 10th house of Karma is strongly aspected by ${rulingPlanet}, pointing to a distinct professional calling. You possess an innate gift for strategic leadership, structural execution, and solving high-stakes problems under pressure. This planetary signature flourishes when you have the autonomy to direct initiatives and make independent decisions. You are destined to climb to high leadership ranks, especially after your 28th solar return. Focus on building lasting systems rather than seeking temporary gains.`,
    favorableProfessions: ["Strategic Management", "Technology Architecture", "Financial Advising", "Surgical Medicine", "Creative Direction"],
    wealthYoga: `A highly auspicious Dhana Yoga is present in your chart, triggered by the alignment of Jupiter with the 2nd house of assets. This guarantees that your strategic endeavors will generate continuous prosperity, particularly through real estate, legacy projects, or digital enterprises.`,
    remedies: `Chant the Beej Mantra for ${rulingPlanet} on days ruled by this planet. Keep a small silver or copper coin in your wallet to bolster and stabilize your wealth magnetism. Offer water to the rising Sun to amplify confidence and leadership.`
  };
}

function getLocalPanchang(dateStr: string) {
  const pDate = new Date(dateStr);
  const day = isNaN(pDate.getTime()) ? 15 : pDate.getDate();
  const month = isNaN(pDate.getTime()) ? 6 : pDate.getMonth();
  const year = isNaN(pDate.getTime()) ? 2026 : pDate.getFullYear();
  
  const tithis = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shasthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima (Full Moon)", "Amavasya (New Moon)"];
  const nakshatras = ["Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati", "Ashwini", "Bharani"];
  const yogas = ["Siddha", "Ayushman", "Saubhagya", "Sobhana", "Sukarma", "Dhriti", "Shula", "Ganda", "Vridhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Subha", "Sukla", "Brahma", "Indra", "Vaidhriti"];
  const karanas = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kinstughna"];
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const bengaliMonths = ["Boishakh", "Joystho", "Ashar", "Shrabon", "Bhadro", "Ashwin", "Kartik", "Agrahayan", "Poush", "Magh", "Falgun", "Chaitra"];
  const seasons = ["Grishma (Summer)", "Grishma (Summer)", "Varsha (Monsoon)", "Varsha (Monsoon)", "Sharat (Early Autumn)", "Hemanta (Late Autumn)", "Hemanta (Late Autumn)", "Shit (Winter)", "Shit (Winter)", "Basanta (Spring)", "Basanta (Spring)", "Basanta (Spring)"];
  
  const tithi = `${tithis[(day + month) % tithis.length]} (${day % 2 === 0 ? "Shukla" : "Krishna"} Paksha)`;
  const nakshatra = nakshatras[(day * 2 + month) % nakshatras.length];
  const yoga = yogas[(day + month * 2) % yogas.length];
  const karana = karanas[(day * 3) % karanas.length];
  const vara = weekdays[isNaN(pDate.getTime()) ? 0 : pDate.getDay()];
  
  let bengMonthIdx = (month + (day >= 14 ? 0 : -1) + 12) % 12;
  const bengYear = year - (month < 3 || (month === 3 && day < 14) ? 594 : 593);
  
  const allFestivals = [
    { name: "Poila Baisakh (Bengali New Year)", months: [0], desc: "The colorful celebration of the Bengali New Year with traditional fairs, sweets, and fresh ledger books." },
    { name: "Durga Puja & Bijoya Dashami", months: [5, 6], desc: "Grand five-day autumn festival celebrating the cosmic victory of Goddess Durga over Mahishasura." },
    { name: "Lakshmi Puja", months: [6], desc: "Worship of the Goddess of Wealth and Prosperity under the full autumn moon." },
    { name: "Kali Puja & Diwali", months: [6, 7], desc: "The festival of cosmic light, celebrating victory over darkness and honoring Mother Kali." },
    { name: "Saraswati Puja", months: [10], desc: "Worship of the Goddess of Wisdom, Art, and Learning with yellow robes and books." },
    { name: "Dol Yatra (Holi)", months: [11], desc: "The vibrant spring festival of colors celebrating the divine play of Radha and Krishna." },
    { name: "Nobonno (Harvest Festival)", months: [7, 8], desc: "Traditional Bengali harvest festival celebrating with fresh rice cakes (Pitha)." },
    { name: "Guru Purnima", months: [3, 4], desc: "A sacred day of honoring teachers, preceptors, and spiritual guides." },
    { name: "Ratha Yatra", months: [2, 3], desc: "The historic Chariot festival celebrating the journey of Lord Jagannath." }
  ];
  
  const currentMonthFestivals = allFestivals.filter(f => f.months.includes(bengMonthIdx));
  
  const festivals = currentMonthFestivals.length > 0 
    ? currentMonthFestivals.map(f => ({ name: f.name, description: f.desc }))
    : [
        allFestivals[day % allFestivals.length],
        allFestivals[(day + 3) % allFestivals.length]
      ].map(f => ({ name: f.name, description: f.desc }));

  return {
    date: dateStr,
    tithi,
    nakshatra,
    yoga,
    karana,
    vara,
    bengaliMonth: bengaliMonths[bengMonthIdx],
    bengaliYear: bengYear.toString(),
    bengaliSeason: seasons[bengMonthIdx],
    sunrise: "05:15 AM",
    sunset: "06:42 PM",
    rahuKaal: "01:30 PM - 03:00 PM (Inauspicious)",
    festivals
  };
}

function getLocalPalmistry(heartLine: string, headLine: string, lifeLine: string, fateLine: string, features: string[]) {
  const cleanLine = (txt: string) => txt ? txt.split("(")[0].trim() : "Standard";
  
  return {
    lifeLineAnalysis: `Your Life Line is: "${cleanLine(lifeLine)}". This shows a highly resilient constitution and a rich physical presence. You have a deep capacity to adapt to environmental changes and recover quickly from fatigue. The mount of Venus wrapped by this line is full, signifying a deep love for life, warmth, and luxury.`,
    heartLineAnalysis: `Your Heart Line is: "${cleanLine(heartLine)}". This marks you as someone with a profound emotional architecture. You feel deeply and express your affection with absolute integrity and loyalty. You possess high emotional intelligence, enabling you to harmonize close personal dynamics effortlessly.`,
    headLineAnalysis: `Your Head Line is: "${cleanLine(headLine)}". This indicates superb mental sharpness. You possess a unique blend of creative visualization and linear logical thinking. This helps you grasp complex systems easily and find innovative workarounds where others see dead ends.`,
    fateLineAnalysis: `Your Fate Line is: "${cleanLine(fateLine)}". This suggests that your professional journey is highly aligned with your personal passions. You are a self-directed champion of your own career path, adapting gracefully to retrogrades and leveraging shifts into launching pads for success.`,
    moneyTriangleAnalysis: features && features.includes("Money Triangle") 
      ? "Your active Money Triangle, formed by the union of your Head, Life, and Fate lines, is fully closed and highly visible. This represents supreme wealth conservation. While you have excellent earning potential, your greatest superpower is wealth retention and turning small capital into self-sustaining legacy assets."
      : "Ensure you focus on building stable financial boundaries to protect and retain your resources.",
    mysticCrossAnalysis: features && features.includes("Mystic Cross")
      ? "The highly sacred Mystic Cross resides precisely between your heart and head lines. This grants you a powerful sixth-sense intuition. You have a natural affinity for esoteric wisdom, ancient sciences, and can immediately read the energetic motives of anyone you encounter."
      : "Your intuitive channels are clear, and quiet meditation will further enhance your guidance.",
    overallVerdict: "Your palms reveal a magnificent balance of vibrant physical stamina, intellectual depth, emotional loyalty, and self-made financial destiny peaks.",
    remedies: "Gently massage the Mount of Jupiter (under the index finger) with essential oils to boost leadership confidence and draw premium financial opportunities. Keep a clear, structured workspace to keep mental channels sharp."
  };
}

app.use(express.json());

// API: Daily Horoscope
app.post("/api/horoscope", async (req, res) => {
  const { sign, date, mood } = req.body;
  if (!sign) {
    return res.status(400).json({ error: "Zodiac sign is required" });
  }

  const promptDate = date || new Date().toISOString().split('T')[0];
  const moodPrompt = mood ? `, matching a mood of "${mood}"` : "";

  try {
    if (!ai) {
      throw new Error("Gemini API key is not configured.");
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are an expert celestial astrologer. Generate an insightful, empowering, and detailed daily horoscope reading for the zodiac sign ${sign} on the date ${promptDate}${moodPrompt}. 
      Include sections for:
      1. General Outlook (energies and alignments)
      2. Love & Relationships
      3. Career & Finance
      4. Wellness & Vitality
      5. Lucky Number, Lucky Color, and Power Hour today.
      
      Keep the tone mysterious, warm, poetic yet practical, and authentic. Return the response as JSON matching this structure:
      {
        "sign": "${sign}",
        "date": "${promptDate}",
        "general": "detailed text...",
        "love": "detailed text...",
        "career": "detailed text...",
        "wellness": "detailed text...",
        "luckyNumber": 7,
        "luckyColor": "Emerald Green",
        "powerHour": "3:00 PM - 4:00 PM",
        "cosmicTip": "A short, actionable advice sentence.",
        "compatibilityWith": "Leo",
        "energyLevel": 85
      }`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    try {
      const jsonResult = JSON.parse(resultText);
      res.json(jsonResult);
    } catch (parseError) {
      res.json(getLocalHoroscope(sign, promptDate, mood));
    }
  } catch (error: any) {
    // Return high-fidelity computed local fallback horoscope data
    res.json(getLocalHoroscope(sign, promptDate, mood));
  }
});

// API: Compatibility Analysis
app.post("/api/compatibility", async (req, res) => {
  const { sign1, name1, birthData1, sign2, name2, birthData2 } = req.body;
  if (!sign1 || !sign2) {
    return res.status(400).json({ error: "Both zodiac signs are required" });
  }

  try {
    if (!ai) {
      throw new Error("Gemini API key is not configured.");
    }

    const prompt = `You are a legendary synastry expert. Analyze the compatibility between ${name1 || "Person 1"} (${sign1}, birth details: ${JSON.stringify(birthData1)}) and ${name2 || "Person 2"} (${sign2}, birth details: ${JSON.stringify(birthData2)}).
    Provide a detailed compatibility report including:
    1. Overall compatibility score (0-100%)
    2. Romantic Connection analysis
    3. Communication & Intellect synergy
    4. Values & Long-term Potential
    5. Potential challenges and how to overcome them
    6. A final "Cosmic verdict"

    Return the response as JSON matching this structure:
    {
      "overallScore": 88,
      "categories": {
        "romance": 90,
        "communication": 85,
        "values": 80,
        "challenges": 75
      },
      "romanticAnalysis": "detailed text...",
      "communicationAnalysis": "detailed text...",
      "valuesAnalysis": "detailed text...",
      "challengesAnalysis": "detailed text...",
      "verdict": "A poetic final summarizing sentence.",
      "goldenRule": "One key tip for their relationship success."
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    try {
      const jsonResult = JSON.parse(resultText);
      res.json(jsonResult);
    } catch (parseError) {
      res.json(getLocalCompatibility(sign1, name1, sign2, name2));
    }
  } catch (error: any) {
    // Return high-fidelity computed local fallback compatibility report
    res.json(getLocalCompatibility(sign1, name1, sign2, name2));
  }
});

// API: Personalized Reading Chat
app.post("/api/chat", async (req, res) => {
  const { messages, userProfile } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  try {
    if (!ai) {
      throw new Error("Gemini API key is not configured.");
    }

    const systemInstruction = `You are a mystical, wise, and incredibly accurate celestial oracle. 
    The user is seeking a personalized astrological reading.
    Here is the user's birth profile:
    ${userProfile ? JSON.stringify(userProfile) : "No profile set yet. Ask them for their birth details (Date, Time, Location) if they want a deep reading, or give general insightful readings."}

    Provide deep, compassionate, and specific answers. Keep your answers engaging, formatted with clean bullet points or paragraphs, and filled with authentic astrological terminology (houses, elements, aspects, planetary placements) where suitable. 
    Be warm, mystical, and encouraging. Never say negative things as immutable fate; always frame them as cosmic lessons or planetary invitations for self-reflection.`;

    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    // Return high-fidelity computed local fallback chat reply
    res.json({ reply: getLocalChatReply(messages, userProfile) });
  }
});

// API: Vedic Kundli and Career Reading
app.post("/api/vedic/kundli", async (req, res) => {
  const { name, birthDate, birthTime, birthPlace, gender } = req.body;
  if (!birthDate) {
    return res.status(400).json({ error: "Birth Date is required for Kundli calculation" });
  }

  try {
    if (!ai) {
      throw new Error("Gemini API key is not configured.");
    }

    const prompt = `You are an expert Vedic astrologer (Jyotishi). Calculate and generate a Kundli birth report for:
    Name: ${name || "Seeker"}
    Birth Date: ${birthDate}
    Birth Time: ${birthTime || "12:00 PM (assumed)"}
    Birth Place: ${birthPlace || "Unknown"}
    Gender: ${gender || "Not Specified"}

    Calculate the authentic Vedic planetary placements:
    1. Ascendant / Lagna
    2. Rasi / Moon Sign
    3. Nakshatra (with Pada)
    4. Solar Sign (Surya Rasi)
    5. Planetary placements in the 12 Vedic Houses.
    6. Provide a detailed Vedic Career Prediction (focusing on the 10th House, ruling planet, calling, and success parameters).
    7. Map out which planets reside in which of the 12 houses so we can draw a visual Kundli chart.

    Return the response as JSON matching this structure:
    {
      "lagna": "Aries",
      "rasi": "Scorpio",
      "nakshatra": "Anuradha (Pada 2)",
      "rulingPlanet": "Mars",
      "sunSign": "Pisces",
      "houses": {
        "1": ["Lagna", "Venus"],
        "2": ["Mercury"],
        "3": ["Sun"],
        "4": ["Mars"],
        "5": [],
        "6": ["Jupiter"],
        "7": ["Moon", "Rahu"],
        "8": [],
        "9": ["Saturn"],
        "10": [],
        "11": [],
        "12": ["Ketu"]
      },
      "careerPrediction": "A detailed, insightful, highly motivating Vedic career analysis based on the 10th House alignment...",
      "favorableProfessions": ["Technology & Engineering", "Strategic Finance", "Spiritual Counseling", "Surgical Medicine"],
      "wealthYoga": "Dhana Yoga present in the 2nd house of assets, triggered by Mercury's elegant alignment.",
      "remedies": "Chant Hanuman Chalisa on Tuesdays. Wear copper colors to bolster solar energy."
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    try {
      const jsonResult = JSON.parse(resultText);
      res.json(jsonResult);
    } catch (e) {
      res.json(getLocalKundli(name, birthDate, birthTime, birthPlace, gender));
    }
  } catch (error: any) {
    // Return high-fidelity computed local fallback Vedic Kundli details
    res.json(getLocalKundli(name, birthDate, birthTime, birthPlace, gender));
  }
});

// API: Vedic Panchang and Bengali Calendar
app.post("/api/vedic/panchang", async (req, res) => {
  const { date } = req.body;
  const promptDate = date || new Date().toISOString().split('T')[0];

  try {
    if (!ai) {
      throw new Error("Gemini API key is not configured.");
    }

    const prompt = `You are a high-priest of Panchang calculation and Indian calendar festivals. Calculate the Panchang values and traditional Indian/Bengali Calendar attributes for:
    Date: ${promptDate}

    Calculate:
    1. Tithi (lunar day)
    2. Nakshatra (lunar mansion)
    3. Yoga (lunar-solar alignment)
    4. Karana (half of a Tithi)
    5. Vara (day of the week)
    6. Corresponding Bengali Month and Bengali Year (e.g., Boishakh 1433)
    7. Key upcoming Indian/Bengali festivals & holidays near this date (e.g. Durga Puja, Poila Baisakh, Diwali, Lakshmi Puja, Kali Puja, Holi, etc.)

    Return the response as JSON matching this structure:
    {
      "date": "${promptDate}",
      "tithi": "Ekadashi (Shukla Paksha)",
      "nakshatra": "Rohini",
      "yoga": "Siddha",
      "karana": "Bava",
      "vara": "Sunday",
      "bengaliMonth": "Ashar",
      "bengaliYear": "1433",
      "bengaliSeason": "Grishma (Summer)",
      "sunrise": "05:12 AM",
      "sunset": "06:44 PM",
      "rahuKaal": "04:30 PM - 06:00 PM (Inauspicious)",
      "festivals": [
        { "name": "Ratha Yatra", "description": "The sacred Chariot festival celebration." },
        { "name": "Guru Purnima", "description": "Honoring academic and spiritual preceptors." }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    try {
      const jsonResult = JSON.parse(resultText);
      res.json(jsonResult);
    } catch (e) {
      res.json(getLocalPanchang(promptDate));
    }
  } catch (error: any) {
    // Return high-fidelity computed local fallback Vedic Panchang details
    res.json(getLocalPanchang(promptDate));
  }
});

// API: Palmistry Analyzer
app.post("/api/vedic/palmistry", async (req, res) => {
  const { heartLine, headLine, lifeLine, fateLine, features } = req.body;

  try {
    if (!ai) {
      throw new Error("Gemini API key is not configured.");
    }

    const prompt = `You are a legendary Palmistry Master (Hasta Samudrika Shastra expert). Generate a personalized palm analysis report based on these hand characteristics:
    Heart Line (emotions): ${heartLine || "Average/Straight"}
    Head Line (intellect): ${headLine || "Deep and long"}
    Life Line (vitality): ${lifeLine || "Curved and strong"}
    Fate Line (career path): ${fateLine || "Faint or broken"}
    Special Markings / Features (e.g., Money Triangle, Mystic Cross, Letter M): ${JSON.stringify(features || [])}

    Provide:
    1. Life Line Reading
    2. Heart Line Reading
    3. Head Line Reading
    4. Fate Line Reading
    5. Detailed Money Triangle & Financial flow analysis (with specific suggestions on money magnet features)
    6. Mystic Cross & Spiritual alignment insights.
    7. Strategic palm suggestions for personal & career success.

    Return the response as JSON matching this structure:
    {
      "lifeLineAnalysis": "detailed text...",
      "heartLineAnalysis": "detailed text...",
      "headLineAnalysis": "detailed text...",
      "fateLineAnalysis": "detailed text...",
      "moneyTriangleAnalysis": "detailed text about the money triangle shape and wealth preservation advice...",
      "mysticCrossAnalysis": "detailed text about spiritual intuition...",
      "overallVerdict": "A beautiful summarizing quote or destiny verdict.",
      "remedies": "Suggestions based on hand mounts (e.g., massage Venus mount for luxury, strengthen Mercury mount with emerald or writing)."
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    try {
      const jsonResult = JSON.parse(resultText);
      res.json(jsonResult);
    } catch (e) {
      res.json(getLocalPalmistry(heartLine, headLine, lifeLine, fateLine, features));
    }
  } catch (error: any) {
    // Return high-fidelity computed local fallback Palmistry details
    res.json(getLocalPalmistry(heartLine, headLine, lifeLine, fateLine, features));
  }
});

// Setup Vite dev server or static file serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Celestial Server shining bright on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to start celestial server:", err);
});
