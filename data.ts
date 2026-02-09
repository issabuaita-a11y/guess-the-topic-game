import { Bot, Topic } from './types';

export const BOTS: Bot[] = [
  { id: 'b1', name: 'DJ_GLITCH', avatarColor: '#5271ff', style: 'casual' }, // Single full-body character
  { id: 'b2', name: 'DJ_BIT', avatarColor: '#ff5271', style: 'casual' }, // New bot companion
];

// Fallback topics if API is down
export const TOPICS: Topic[] = [
  {
    id: 't1',
    label: 'Vinyl Record',
    hints: [
      "I'm spinning right round.",
      "Analog vibes only.",
      "Don't scratch me.",
      "The groove is deep.",
      "Black circle of sound."
    ]
  },
  {
    id: 't2',
    label: 'Espresso',
    hints: [
      "Small but powerful.",
      "A concentrated shot of energy.",
      "Dark, rich, and bitter.",
      "Steam and pressure created this.",
      "The heart of a latte."
    ]
  },
  {
    id: 't3',
    label: 'Headphones',
    hints: [
      "Blocking out the world.",
      "Private audio experience.",
      "Two speakers on your ears.",
      "Wired or wireless freedom.",
      "Cushions for your sound."
    ]
  },
  {
    id: 't4',
    label: 'Cactaceae',
    hints: [
      "Stay away from my spines.",
      "I thrive on neglect.",
      "Desert survivor.",
      "Not for hugging.",
      "Slow growing, prickly friend."
    ]
  },
  {
    id: 't5',
    label: 'Polaroid Camera',
    hints: [
      "Instant memories.",
      "Shake it while it develops.",
      "Analog photo magic.",
      "Square white borders.",
      "Click, whirr, and out it comes."
    ]
  },
  {
    id: 't6',
    label: 'Baking Soda',
    hints: [
      "White powdery cleaner.",
      "Makes bread rise.",
      "Reacts with vinegar.",
      "Absorbs fridge smells.",
      "A kitchen staple."
    ]
  },
  {
    id: 't7',
    label: 'Paperclip',
    hints: [
      "Keeping it all together.",
      "Metal wire loop.",
      "Office supply classic.",
      "Easily bent into shapes.",
      "Temporary binding."
    ]
  },
  {
    id: 't8',
    label: 'Hummingbird',
    hints: [
      "Hovering in place.",
      "Rapidly beating wings.",
      "Tiny nectar seeker.",
      "Bright, iridescent feathers.",
      "Faster than your eye can follow."
    ]
  }
];

export const GENERIC_HINTS = [
  "I'm picking up on some interesting details here.",
  "This subject has quite a few layers to it.",
  "Let's focus on what makes this unique.",
  "There's a lot to consider with this one.",
  "I'm noticing a pattern in how this works.",
  "It's interesting how this fits into everything.",
  "Can you see the connection I'm making?",
  "This is definitely a distinct one.",
];