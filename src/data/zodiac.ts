import { ZodiacSignDetails } from "../types";

export const zodiacSigns: ZodiacSignDetails[] = [
  {
    name: "Aries",
    symbol: "♈",
    dateRange: "Mar 21 - Apr 19",
    element: "Fire",
    modality: "Cardinal",
    rulingPlanet: "Mars",
    strengths: ["Courageous", "Determined", "Confident", "Enthusiastic", "Optimistic"],
    weaknesses: ["Impatient", "Moody", "Short-tempered", "Impulsive", "Aggressive"],
    description: "As the first sign in the zodiac, the presence of Aries always marks the beginning of something energetic and turbulent. They are continuously looking for dynamic speed, competition and active engagement, always striving to be first in everything.",
    loveStyle: "Passionate, direct, and incredibly exciting. Aries loves the thrill of the chase and craves a partner who can match their fiery speed and enthusiasm.",
    careerStyle: "Natural-born leaders who excel in entrepreneurial ventures, competitive sales environments, athletic pursuits, or any role that allows rapid action and decision making."
  },
  {
    name: "Taurus",
    symbol: "♉",
    dateRange: "Apr 20 - May 20",
    element: "Earth",
    modality: "Fixed",
    rulingPlanet: "Venus",
    strengths: ["Reliable", "Patient", "Practical", "Devoted", "Responsible", "Stable"],
    weaknesses: ["Stubborn", "Possessive", "Uncompromising"],
    description: "Practical and well-grounded, Taurus is the sign that harvests the fruits of labor. They feel the need to always be surrounded by love and beauty, turned to the material world, hedonism, and physical pleasures.",
    loveStyle: "Sensual, romantic, and deeply loyal. Taurus values stability, physical touch, and building a comfortable, luxurious sanctuary with their loved one.",
    careerStyle: "Excels in finance, culinary arts, architecture, real estate, or creative design—any field requiring meticulous attention to detail, persistence, and practical outcomes."
  },
  {
    name: "Gemini",
    symbol: "♊",
    dateRange: "May 21 - Jun 20",
    element: "Air",
    modality: "Mutable",
    rulingPlanet: "Mercury",
    strengths: ["Gentle", "Affectionate", "Curious", "Adaptable", "Ability to learn quickly"],
    weaknesses: ["Nervous", "Inconsistent", "Indecisive"],
    description: "Expressive and quick-witted, Gemini represents two different personalities in one and you will never be sure which one you will face. They are sociable, communicative and ready for fun, with a tendency to suddenly get serious and restless.",
    loveStyle: "Intellectually stimulating, playful, and highly communicative. Gemini falls in love with the mind first and needs a partner who can keep up with their quick wit.",
    careerStyle: "Excellent in journalism, public relations, writing, marketing, translations, or travel—anything that involves processing massive amounts of ideas and communication."
  },
  {
    name: "Cancer",
    symbol: "♋",
    dateRange: "Jun 21 - Jul 22",
    element: "Water",
    modality: "Cardinal",
    rulingPlanet: "Moon",
    strengths: ["Tenacious", "Highly imaginative", "Loyal", "Emotional", "Sympathetic", "Persuasive"],
    weaknesses: ["Moody", "Pessimistic", "Suspicious", "Insecure"],
    description: "Deeply intuitive and sentimental, Cancer can be one of the most challenging zodiac signs to get to know. They are very emotional and sensitive, and care deeply about matters of the family and their home.",
    loveStyle: "Deeply nurturing, protective, and emotional. Cancer seeks a profound soul connection and a relationship that feels like a safe, cozy harbor from the world.",
    careerStyle: "Excels in healthcare, teaching, therapy, hospitality, real estate, or creative writing—any area where empathy and taking care of others' comfort is prioritized."
  },
  {
    name: "Leo",
    symbol: "♌",
    dateRange: "Jul 23 - Aug 22",
    element: "Fire",
    modality: "Fixed",
    rulingPlanet: "Sun",
    strengths: ["Creative", "Passionate", "Generous", "Warm-hearted", "Cheerful", "Humorous"],
    weaknesses: ["Arrogant", "Stubborn", "Self-centered", "Lazy", "Inflexible"],
    description: "People born under the sign of Leo are natural born leaders. They are dramatic, creative, self-confident, dominant and extremely difficult to resist, able to achieve anything they want in any area of life.",
    loveStyle: "Grand, theatrical, generous, and immensely loyal. Leo loves with all their heart and wants to be adored, treated like royalty, and celebrated.",
    careerStyle: "Thrives in performing arts, public speaking, management, entertainment, politics, or fashion—roles that put them in the spotlight where they can guide and inspire."
  },
  {
    name: "Virgo",
    symbol: "♍",
    dateRange: "Aug 23 - Sep 22",
    element: "Earth",
    modality: "Mutable",
    rulingPlanet: "Mercury",
    strengths: ["Loyal", "Analytical", "Kind", "Hardworking", "Practical"],
    weaknesses: ["Shyness", "Worry", "Overly critical of self and others", "All work and no play"],
    description: "Virgos are always paying attention to the smallest details and their deep sense of humanity makes them one of the most careful signs of the zodiac. Their methodical approach to life ensures that nothing is left to chance.",
    loveStyle: "Subtle, devoted, and practical. Virgo expresses love through acts of service, support, and creating structured harmony in daily shared life.",
    careerStyle: "Unmatched in quality control, scientific research, accounting, editor roles, medicine, or project management—places where precision and analysis are paramount."
  },
  {
    name: "Libra",
    symbol: "♎",
    dateRange: "Sep 23 - Oct 22",
    element: "Air",
    modality: "Cardinal",
    rulingPlanet: "Venus",
    strengths: ["Cooperative", "Diplomatic", "Gracious", "Fair-minded", "Social"],
    weaknesses: ["Indecisive", "Avoids confrontations", "Will carry a grudge", "Self-pity"],
    description: "People born under the sign of Libra are peaceful, fair, and they hate being alone. Partnership is very important for them, as their mirror and someone giving them the ability to be the mirror themselves.",
    loveStyle: "Harmonious, romantic, elegant, and highly diplomatic. Libra seeks balance and beauty in love, thriving in partnerships built on equality and aesthetics.",
    careerStyle: "Excels in law, diplomacy, art consulting, event planning, counseling, or fashion—any role requiring compromise, aesthetic sense, and relationship building."
  },
  {
    name: "Scorpio",
    symbol: "♏",
    dateRange: "Oct 23 - Nov 21",
    element: "Water",
    modality: "Fixed",
    rulingPlanet: "Pluto",
    strengths: ["Resourceful", "Brave", "Passionate", "Stubborn", "A true friend"],
    weaknesses: ["Distrusting", "Jealous", "Secretive", "Violent"],
    description: "Scorpio-born are passionate and assertive people. They are determined and decisive, and will research until they find out the truth. Scorpio is a great leader, always aware of the situation and also features prominently in resourcefulness.",
    loveStyle: "Intense, magnetic, incredibly passionate, and deeply transformative. Scorpio craves absolute vulnerability and absolute loyalty, uniting body and soul.",
    careerStyle: "Superb in investigation, psychology, research, surgery, crisis management, cryptography, or finance—roles that involve revealing secrets and handling power."
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    dateRange: "Nov 22 - Dec 21",
    element: "Fire",
    modality: "Mutable",
    rulingPlanet: "Jupiter",
    strengths: ["Generous", "Idealistic", "Great sense of humor"],
    weaknesses: ["Promises more than can deliver", "Very impatient", "Will say anything no matter how undiplomatic"],
    description: "Curious and energetic, Sagittarius is one of the biggest travelers among all zodiac signs. Their open mind and philosophical view motivates them to wander around the world in search of the meaning of life.",
    loveStyle: "Adventurous, free-spirited, and highly philosophical. Sagittarius needs a co-traveler in life who cherishes freedom, laughter, and infinite learning.",
    careerStyle: "Excels in travel, academic teaching, publishing, foreign relations, philosophical writing, or outdoor work—roles that satisfy their thirst for freedom and exploration."
  },
  {
    name: "Capricorn",
    symbol: "♑",
    dateRange: "Dec 22 - Jan 19",
    element: "Earth",
    modality: "Cardinal",
    rulingPlanet: "Saturn",
    strengths: ["Responsible", "Disciplined", "Self-control", "Good managers"],
    weaknesses: ["Know-it-all", "Unforgiving", "Condescending", "Expecting the worst"],
    description: "Capricorn is a sign that represents time and responsibility, and its representatives are traditional and often very serious by nature. These individuals possess an inner state of independence that enables significant progress.",
    loveStyle: "Steady, committed, and protective. Capricorn takes love very seriously, aiming to build a lasting legacy and secure empire with their chosen life partner.",
    careerStyle: "Thrives in executive leadership, business administration, government, project planning, engineering, or structural design—places requiring long-term discipline."
  },
  {
    name: "Aquarius",
    symbol: "♒",
    dateRange: "Jan 20 - Feb 18",
    element: "Air",
    modality: "Fixed",
    rulingPlanet: "Uranus",
    strengths: ["Progressive", "Original", "Independent", "Humanitarian"],
    weaknesses: ["Runs from emotional expression", "Temperamental", "Uncompromising", "Aloof"],
    description: "Aquarius-born are shy and quiet , but on the other hand they can be eccentric and energetic. However, in both cases, they are deep thinkers and highly intellectual people who love helping others.",
    loveStyle: "Unconventional, intellectual, and friendly. Aquarius values independence, freedom, and a mental friendship that grows into an inspiring, unique romance.",
    careerStyle: "Excels in technology, social work, scientific innovation, charity organizations, astrophysics, or community organizing—roles that push humanity forward."
  },
  {
    name: "Pisces",
    symbol: "♓",
    dateRange: "Feb 19 - Mar 20",
    element: "Water",
    modality: "Mutable",
    rulingPlanet: "Neptune",
    strengths: ["Compassionate", "Artistic", "Intuitive", "Gentle", "Wise", "Musical"],
    weaknesses: ["Fearful", "Overly trusting", "Sad", "Desire to escape reality", "Can be a victim"],
    description: "Pisces are very friendly, so they often find themselves in a company of very different people. Pisces are selfless, they are always willing to help others, without hoping to get anything back.",
    loveStyle: "Dreamy, deeply romantic, empathetic, and spiritual. Pisces loves without boundaries and seeks a telepathic soul connection filled with poetry and magic.",
    careerStyle: "Superb in music, visual arts, spiritual counseling, film, nursing, oceanography, or creative writing—fields that allow connection with the subconscious and healing."
  }
];

export function getZodiacSign(dateString: string): string {
  if (!dateString) return "Aries";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Aries";

  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";

  return "Aries";
}
