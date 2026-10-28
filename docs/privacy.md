# SparkStart Privacy & Ethical Architecture

## 1. Ethical Mission: Autonomy over Enforcement

Traditional productivity software frequently relies on punitive mechanics:
- Jarring alarm chimes
- Aggressive overdue badges and red warning labels
- Broken streak penalties inducing anxiety and shame
- Involuntary screen lockouts and digital confinement

These mechanisms elevate cortisol, trigger defensive avoidance, and penalize individuals experiencing executive functioning difficulties or neurodivergent burnout.

SparkStart operates on the principle of **User Autonomy**:
- We celebrate micro-steps without punishing delays.
- We support guilt-free rest breaks without requiring users to "earn" recovery.
- We never interpret a dismissed notification or skipped check-in as failure.
- We do not make medical or psychological diagnoses.

---

## 2. Data Minimization & Sovereign Boundaries

SparkStart strictly enforces local-first data processing.

| Data Type | Where Stored | Transmitted to Cloud? | User Control |
| :--- | :--- | :--- | :--- |
| **Tasks & Micro-tasks** | Local SQLite (`sparkstart_local.db`) | **NO** (Unless Remote AI Consent Enabled) | Export JSON / Purge anytime |
| **Energy Check-In** | Local SQLite / LocalStorage | **NO** | Can be skipped or changed |
| **Reminder Settings** | Local SQLite / LocalStorage | **NO** | Full user customization |
| **Window Bounds** | Local filesystem (`sparkbuddy-bounds.json`) | **NO** | Local configuration only |
| **Webcam / Microphone** | **NOT ACCESSED** | **NEVER** | Zero audio/video capabilities |
| **Keystrokes / History**| **NOT MONITORED**| **NEVER** | No background spyware |

---

## 3. Remote AI Processing Consent Boundary

SparkStart features an explicit consent switch (`enableRemoteAI`):

- **Default (Offline / Local Mode)**:
  `ENABLE_REMOTE_AI=false`.
  Tasks are sequenced entirely on the host machine using our deterministic psychological heuristic rules and local vector search. **Zero data leaves the machine.**

- **Opt-In Remote AI (Gemini / OpenAI)**:
  Only when the user explicitly toggles on remote AI in Settings and provides an API key does the backend transmit the single task title and obstacle to the remote LLM endpoint. No personal identifiers, usernames, or telemetry are ever attached.

---

## 4. Right to Erasure & Data Sovereignty

Under GDPR Article 17 and privacy-first engineering standards, users possess absolute control over their local data:
- **Instant JSON Export**: The `GET /api/privacy/export` endpoint allows users to download their complete task history and preferences in one click.
- **Permanent Local Purge**: The `POST /api/privacy/purge` endpoint permanently erases all tables in the SQLite database and clears browser caches with immediate verification.

