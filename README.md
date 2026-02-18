# 🎮 Guess the Topic

A pixel-art social deduction game where you observe AI-powered bots chatting about a hidden topic and must guess what they're discussing. Built with React, TypeScript, and powered by OpenAI & Google Gemini with **secure backend architecture**.

## ✨ Features

- **AI-Powered Gameplay**: Bots use OpenAI GPT-4o-mini or Google Gemini 2.0 Flash to generate hints
- **Progressive Difficulty**: Automatically increases from Easy → Medium → Hard as you play
- **Bilingual Support**: Play in English or Arabic
- **Retro Pixel Art**: Beautiful 8-bit styled graphics with custom animations
- **8-Bit Sound Effects**: Nostalgic audio using Web Audio API
- **Secure API Architecture**: API keys protected on backend, never exposed to browser
- **Responsive Design**: Works on desktop and mobile

## 🔒 Security

**Important**: This project uses a secure backend proxy architecture to protect API keys. Your keys are **NEVER** exposed in the browser JavaScript bundle.

- ✅ API keys stored in `.env.local` (git-ignored)
- ✅ Backend API server handles all AI calls
- ✅ Production uses Vercel serverless functions
- ✅ Keys only accessible on server-side

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- OpenAI API Key OR Google Gemini API Key (or both for fallback)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/guess-the-topic-game.git
cd guess-the-topic-game
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your API keys:
```env
VITE_OPENAI_API_KEY=sk-proj-your_key_here
VITE_GEMINI_API_KEY=your_gemini_key_here
```

5. Run the development servers (runs both API server + Vite):
```bash
npm run dev
```

The game will be available at `http://localhost:3000`

## 🏗️ Architecture

### Development
```
Browser (localhost:3000)
    ↓ HTTP /api/generate-topic
Vite Dev Server (proxy)
    ↓ forwards to localhost:3001
Express API Server (dev-server.mjs)
    ↓ makes API calls with keys from .env.local
OpenAI / Google Gemini APIs
```

### Production (Vercel)
```
Browser (your-domain.vercel.app)
    ↓ HTTP /api/generate-topic
Vercel Serverless Functions (/api/*.ts)
    ↓ uses environment variables
OpenAI / Google Gemini APIs
```

**Key Point**: API keys NEVER leave the backend. Frontend only calls `/api/*` endpoints with game data.

## 📁 Project Structure

```
guess-the-topic-game/
├── api/                    # Vercel serverless functions (production)
│   ├── generate-topic.ts   # Topic generation with exact AI prompts
│   └── generate-banter.ts  # Bot hint generation with exact AI prompts
├── components/             # React components
│   ├── ChatWindow.tsx      # Main game area with bots
│   ├── GameControls.tsx    # Answer buttons
│   ├── Header.tsx          # Score, timer, badges
│   ├── ResultModal.tsx     # Win/lose modal
│   └── StartScreen.tsx     # Welcome screen
├── hooks/
│   └── useGameEngine.ts    # Core game logic
├── lib/
│   ├── ai.ts               # Secure API client (calls /api/*)
│   └── sounds.ts           # Web Audio sound effects
├── dev-server.mjs          # Local development API server (port 3001)
├── .env.local              # Your API keys (NOT in git)
├── .env.example            # Template for API keys
└── vercel.json             # Vercel deployment config
```

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (inline), Custom 8-bit pixel art
- **AI**: OpenAI GPT-4o-mini, Google Gemini 2.0 Flash
- **Backend**: 
  - Development: Express.js (port 3001)
  - Production: Vercel Serverless Functions
- **Audio**: Web Audio API
- **Icons**: Lucide React

## 📝 Available Scripts

- `npm run dev` - **Start both API server + Vite dev server**
- `npm run dev:api` - Start API server only (port 3001)
- `npm run dev:vite` - Start Vite dev server only (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🌐 Deployment to Vercel

1. **Push code to GitHub** (API keys in `.env.local` will NOT be pushed)

2. **Import project in Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository

3. **Add environment variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add these variables:
     - `VITE_OPENAI_API_KEY` = your OpenAI key
     - `VITE_GEMINI_API_KEY` = your Gemini key
     - `OPENAI_API_KEY` = your OpenAI key (fallback)
     - `GEMINI_API_KEY` = your Gemini key (fallback)

4. **Deploy!** 
   - Vercel automatically:
     - Builds your React app
     - Deploys `/api/*.ts` as serverless functions
     - Injects environment variables securely

## 🎮 How to Play

1. Click "START GAME"
2. Watch two AI bots chat about a hidden topic
3. Read their hints carefully
4. Guess the correct topic from 4 options before time runs out!
5. Earn points based on how fast you answer
6. Unlock badges at rounds 5, 13, and 20

## 🔐 Security Best Practices

### What's Protected
- ✅ `.env.local` is in `.gitignore` (line 13: `*.local`)
- ✅ API keys never committed to git
- ✅ Frontend code has NO API keys
- ✅ All AI calls go through secure backend
- ✅ `.env.example` provided as template

### What to NEVER Do
- ❌ Don't use `dangerouslyAllowBrowser: true`
- ❌ Don't commit `.env.local` or `.env` files
- ❌ Don't hardcode API keys in code
- ❌ Don't expose API keys in environment variables accessible to browser

### If You Accidentally Leak a Key

1. **Revoke immediately**:
   - OpenAI: https://platform.openai.com/api-keys
   - Google Gemini: https://aistudio.google.com/apikey

2. **Generate new keys**

3. **Update `.env.local` locally and Vercel environment variables**

4. **If committed to git**: The key is already compromised. Rotate immediately.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and not licensed for public use.

## 🙏 Credits

- Built with ❤️ using AI Studio
- Font: "Press Start 2P" (Google Fonts)
- Icons: Lucide React
- Secure architecture inspired by GitHub security best practices

## 🐛 Known Issues

- Tailwind CDN warning in development (use PostCSS in production)

## 🔮 Future Enhancements

- [ ] Multiplayer mode
- [ ] Custom topics by users
- [ ] Leaderboard
- [ ] More bot personalities
- [ ] Sound volume controls
- [ ] Keyboard shortcuts (1-4 for answers)
- [ ] Progressive Web App (PWA) support

---

**Need help?** Open an issue or contact the maintainer.

**View in AI Studio**: https://ai.studio/apps/drive/1KUlRj7dj6f4vUHLMIPr2zRtoDlbmdZzz
