# SparkStart Chrome Extension (Manifest V3)

## Overview
The SparkStart Chrome Extension is a lightweight Manifest V3 companion that brings SparkStart's adaptive, low-pressure task sequencing directly into the user's browser toolbar. It works seamlessly alongside the SparkStart Web Dashboard and the SparkBuddy Electron Desktop Companion.

## Features
- **Toolbar Action Popup**: Clean 380px compact interface with Sprout branding.
- **Friction-Free Task Starter**: Enter any assignment or project and receive an instant micro-action.
- **4 Key Adaptive Actions**:
  - **Done**: Celebrates completion with positive reinforcement.
  - **Too Big**: Instantly shrinks the action into an ultra-low demand 1-minute step.
  - **Rest**: Triggers a guilt-free restorative recovery pause without streak penalties.
  - **Dismiss**: Cleans the slate without guilt.
- **Local-First Privacy**: Communicates with the local FastAPI backend (`http://127.0.0.1:8000/api`) and gracefully falls back to local heuristic sequencing if the backend is paused.
- **Zero Browsing Surveillance**: The extension **does not** collect, read, or transmit browsing history or page content.

## Permissions Documentation
The extension requests only the minimum necessary permissions:
- `storage`: To persist the active micro-step and task across popup openings.
- `host_permissions: ["http://127.0.0.1:8000/*", "http://localhost:8000/*"]`: To communicate with the local SparkStart backend server.

## Installation Instructions (Load Unpacked)

1. Open Google Chrome, Brave, or any Chromium-based browser.
2. Navigate to `chrome://extensions`.
3. In the top right corner, enable **Developer mode** toggle.
4. Click **Load unpacked** in the top left.
5. In the file picker, select the extension directory:
   ```
   C:\Users\SATYAM SINGH\MY FILES\PROJECTS\SPARKSTART\apps\extension
   ```
6. The **SparkStart: Low-Pressure Task Companion** extension will appear in your toolbar!
7. Click the sprout icon to open the companion popup anytime.

