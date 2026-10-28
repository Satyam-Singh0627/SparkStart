# SparkStart + SparkBuddy

> **Small steps. Real progress.**  
> *Adaptive, Low-Pressure Task Sequencer, Floating Desktop Companion & Chrome Extension for Executive Function Support.*

---

## 1. Project Identity & Philosophy

SparkStart is an empathetic, evidence-based productivity system designed for university students and professionals who struggle with task initiation, cognitive overload, executive dysfunction, and burnout.

Traditional productivity tools enforce productivity through rigid timetables, alarm chimes, red overdue warnings, and punitive streak counters. When cognitive fatigue or executive dysfunction strikes, these mechanisms elevate cortisol and trigger task freeze.

**SparkStart responds with:**
- **Single-Target Scaffolding**: Never shows an intimidating 50-item checklist; isolates **one** single 2-to-5 minute starter action.
- **Dynamic Energy Check-In**: Adapts micro-steps to self-reported daily capacity (*Low*, *Medium*, *Higher Capacity*, or *Not Sure / Skip*) without guilt or judgment.
- **The "Too Big" Shrink Engine**: Instantly decomposes any resistant task down to a 60-second friction-free contact step.
- **6 Companion Characters**: Choose between **Sprout** 🌱, **Panda** 🐼, **Fox** 🦊, **Cat** 🐱, **Cloud** ☁️, and **Robot** 🤖.
- **6 Appearance Themes**: Seamlessly toggle between **Light**, **Dark**, **Forest**, **Lavender**, **Warm**, and **High Contrast** modes.
- **SparkBuddy Floating Companion**: An Electron desktop companion with smooth frameless floating behavior that stays quietly above VS Code, browsers, and desktop tools at the point of performance.
- **Manifest V3 Chrome Extension**: A lightweight toolbar companion (`apps/extension`) with instant task sequencing and offline fallbacks.
- **Evidence-Grounded RAG Engine**: Anchored in reputable cognitive science and psychological literature (Gollwitzer, Sweller, Barkley, Miserandino, Sonnentag) with transparent citations.
- **Local-First Privacy & Sovereignty**: Operates 100% offline out-of-the-box using local SQLite storage (`sparkstart_local.db`). Remote AI processing is strictly opt-in.

> **Ethical Notice:** SparkStart is a supportive tool designed for personal pacing. It is **not** a clinical or medical device and does not diagnose or treat ADHD, autism, or anxiety.

---

## 2. One-Click Windows Launch (No Terminal Work Required)

In the project root folder, double-click:

| Launcher Script | Description |
|---|---|
| **`Start-SparkStart.bat`** | **One-click startup**: Starts FastAPI (port 8000), Vite Web Dashboard (port 5174), opens your browser automatically, and launches the SparkBuddy floating companion. |
| **`Start-SparkBuddy.bat`** | Launches the SparkBuddy Electron desktop companion independently. |
| **`Stop-SparkStart.bat`** | Gracefully terminates all background SparkStart Python and Electron processes. |

---

## 3. Monorepo Architecture

```
sparkstart/
├── apps/
│   ├── web/                    # React 18 + Vite + Tailwind CSS Web Dashboard
│   │   ├── src/components/     # Header (6 themes), EnergyCheckIn, QuickStarter, MicroTaskCard, TaskList, etc.
│   │   └── src/services/api.ts # Typesafe REST client with offline fallback
│   ├── desktop/                # Electron 33 + React + TypeScript Desktop Companion
│   │   ├── electron/main.ts    # Frameless, transparent, always-on-top window & tray
│   │   ├── electron/preload.ts # ContextIsolation secure preload bridge
│   │   └── src/components/     # CharacterIllustration (6 characters, 5 moods), CompanionBubble, MiniRestTimer
│   └── extension/              # Chrome Manifest V3 Extension Companion
│       ├── manifest.json       # MV3 manifest
│       ├── popup.html & js     # Compact toolbar popup with task sequencer & offline fallback
│       └── icons/              # 16px, 48px, 128px PNG icons
├── services/
│   └── api/                    # Python 3.14 + FastAPI Backend & Task Sequencer
│       ├── ai/                 # BaseAIProvider, MockProvider, GeminiProvider, OpenAIProvider
│       ├── rag/                # RAGEngine: Chunking, TF-IDF / Cosine Vector Indexing
│       ├── storage/            # SQLite repository (tasks, micro-tasks, preferences)
│       └── main.py             # FastAPI entrypoint & CORS middleware
├── packages/
│   └── shared/                 # Shared TypeScript domain models (themes, characters, energy, tasks)
├── knowledge/
│   └── sources/                # Curated psychology & cognitive load references
├── docs/
│   ├── architecture.md         # Detailed architectural specification
│   ├── privacy.md              # Privacy guarantees & ethical design rules
│   ├── testing.md              # Test matrix & automated verification logs
│   ├── deployment.md           # Production build & packaging instructions
│   └── chrome-extension.md     # Chrome extension load unpacked guide
├── tests/
│   └── test_api.py             # Automated pytest suite (7 passing tests)
├── Start-SparkStart.bat        # One-click Windows launcher
├── Start-SparkBuddy.bat        # Desktop companion launcher
├── Stop-SparkStart.bat         # Clean shutdown script
├── package.json                # Root npm workspace configuration
└── README.md
```

---

## 4. Manual Development & CLI Commands

### Start Services Individually
```bash
# 1. Start FastAPI Backend (Port 8000)
.\.venv\Scripts\python.exe -m uvicorn services.api.main:app --reload --port 8000

# 2. Start Web Dashboard (Port 5174)
npm run dev:web

# 3. Start Desktop Companion
npm run dev:desktop
```

### Run Tests
```bash
# Backend pytest suite (7 tests)
npm run test:api
```

### Full Production Monorepo Build
```bash
npm run build
```

---

## 5. Chrome Extension Installation

1. Navigate to `chrome://extensions` in Google Chrome or Brave.
2. Toggle **Developer mode** in the top-right corner.
3. Click **Load unpacked** in the top-left.
4. Select the directory:
   `apps/extension`
5. The sprout companion is now ready in your browser toolbar!

---

## 6. Privacy & Data Sovereignty

- **100% Local Storage**: All personal tasks and settings live in `sparkstart_local.db`.
- **Zero Surveillance**: No camera, microphone, keystroke, or browsing-history monitoring.
- **Export & Purge**: One-click JSON data export and permanent deletion available in Settings.
- **Strict Remote AI Consent**: Remote AI is off by default. The local heuristic sequencing engine handles all micro-steps without cloud connectivity.
