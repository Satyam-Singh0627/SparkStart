# SparkStart & SparkBuddy Deployment Guide

## 1. Production Web Build
To generate the optimized production web bundle:
```bash
npm run build:web
```
- **Output Directory**: `apps/web/dist`
- **Asset Structure**:
  - `dist/index.html`
  - `dist/assets/index-[hash].css`
  - `dist/assets/index-[hash].js`
- **Serving Static Bundle**: Can be hosted via Nginx, Caddy, Vercel, Netlify, or served by FastAPI static mounting.

---

## 2. Desktop Companion Packaging (Windows)
The Electron desktop companion can run directly from source or packaged into portable Windows binaries:
```bash
npm run build:desktop
```
- **Output Directories**:
  - Renderer Bundle: `apps/desktop/dist`
  - Compiled Electron Main & Preload: `apps/desktop/dist-electron`
- **Launcher**: Users can double-click `Start-SparkBuddy.bat` in the repository root for zero-command launch on any Windows 10/11 system.

---

## 3. Chrome Extension Deployment
```bash
npm run build:extension
```
- **Output Directory**: `apps/extension`
- **Installation**:
  1. Open `chrome://extensions`.
  2. Enable Developer Mode.
  3. Click "Load unpacked" and select `apps/extension`.

---

## 4. Full Production Monorepo Build Command
```bash
npm run build
```
Builds the web dashboard, desktop renderer, electron main process, and validates the extension bundle in a single unified script.

