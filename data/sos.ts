export interface SOSSignal {
  id: string;
  category: string;
  title: string;
  description: string;
  steps: string[];
  note?: string;
}

export const SOS_DATA: SOSSignal[] = [
  {
    id: "signal-mirror",
    category: "VISUAL",
    title: "SIGNAL MIRROR",
    description:
      "Most effective visual signal in daylight. Visible up to 16km.",
    steps: [
      "Hold mirror 6 inches from face",
      "Extend free hand toward target aircraft/rescuer",
      "Reflect sunlight through the V of your fingers",
      "Slowly scan across the horizon",
      "Flash 3 times, pause, repeat — universal distress",
    ],
    note: "Any reflective surface works: phone screen, foil, CD, water in a container.",
  },
  {
    id: "signal-fire",
    category: "VISUAL",
    title: "SIGNAL FIRE",
    description: "Smoke visible by day, flame by night.",
    steps: [
      "Build on elevated ground — hilltop, clearing, cliff edge",
      "Prepare 3 fires in a triangle, 25m apart (international distress)",
      "Daytime: add green leaves, rubber, plastic for black smoke",
      "Nighttime: dry wood only — bright orange flame is visible",
      "Keep dry fuel ready to light fast when you hear aircraft",
    ],
  },
  {
    id: "ground-to-air",
    category: "VISUAL",
    title: "GROUND-TO-AIR SIGNALS",
    description: "Large symbols on ground readable from aircraft.",
    steps: [
      "Minimum 10 meters tall — bigger is always better",
      "Use rocks, logs, trenches, or trampled vegetation",
      "X = require medical assistance",
      "V = require help",
      "Arrow = traveling in this direction",
      "→ with line through it = unable to proceed",
    ],
    note: "High contrast matters. Dark rocks on snow, light sand on dark ground.",
  },
  {
    id: "sos-morse",
    category: "AUDIO/LIGHT",
    title: "SOS MORSE CODE",
    description: "· · · — — — · · · — universally recognized distress signal.",
    steps: [
      "3 short signals (dot dot dot)",
      "3 long signals (dash dash dash)",
      "3 short signals (dot dot dot)",
      "Pause 1 minute. Repeat.",
      "Works with: whistle, flashlight, mirror, horn, banging on metal",
    ],
  },
  {
    id: "whistle",
    category: "AUDIO",
    title: "WHISTLE SIGNALS",
    description: "A whistle carries 3x further than a human voice.",
    steps: [
      "3 blasts = I need help",
      "2 blasts = I am here / I heard you",
      "1 blast = All clear",
      "Blow, then listen. Blow, then listen.",
      "Conserve energy — do not shout between blasts",
    ],
  },
  {
    id: "coordinates",
    category: "LOCATION",
    title: "YOUR COORDINATES",
    description: "Enable location below to get GPS coordinates for rescue.",
    steps: [
      "Share coordinates via any means: radio, note, message",
      'Format for voice: "North/South [degrees] [minutes] [direction]"',
      "Write coordinates on your body and gear in a waterproof marker",
      "Standard format: DD.DDDD° (decimal degrees)",
    ],
    note: "Even with no signal, GPS coordinates work offline.",
  },
];

export const SOS_CATEGORIES = [...new Set(SOS_DATA.map((s) => s.category))];
