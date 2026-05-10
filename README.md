# DevPulse — Developer Productivity MVP

A React MVP that helps developers move from raw DORA/SDLC metrics to
actionable insights — with AI coaching powered by Claude.

## Features
- IC View: Health score, 5 key metrics, insights, suggested next steps
- AI coaching insight (calls Claude API)
- 4-month trend chart
- Team comparison panel
- Personal goal tracker
- Manager View: team health table with sparklines

---

## Run locally (takes ~1 minute)

### Prerequisites
- Node.js 18+ installed → https://nodejs.org

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## Deploy for free on Vercel (takes ~3 minutes)

### Option A — Vercel CLI (fastest)
```bash
npm install -g vercel
vercel
```
Follow the prompts. Your site will be live at a `*.vercel.app` URL.

### Option B — Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to https://vercel.com → New Project → Import your repo
3. Framework: Vite (auto-detected)
4. Click Deploy

---

## Deploy on Netlify (alternative)
```bash
npm run build
# Then drag-and-drop the `dist/` folder at https://app.netlify.com/drop
```

---

## Notes on the AI feature
The "Get AI coaching insight" button calls the Anthropic Claude API.
It works directly from the browser because Claude.ai proxies the API key
in the artifact environment. If you deploy standalone and want AI to work,
you'll need to add your own Anthropic API key:

In `src/App.jsx`, find `fetchAIInsight` and add your key:
```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": "YOUR_ANTHROPIC_API_KEY",   // add this line
  "anthropic-version": "2023-06-01",        // add this line
},
```
Get a free key at https://console.anthropic.com

---

## Project structure
```
devpulse/
├── index.html          # HTML entry point
├── package.json        # Dependencies
├── vite.config.js      # Vite config
└── src/
    ├── main.jsx        # React root
    └── App.jsx         # Entire app (data, logic, UI)
```
