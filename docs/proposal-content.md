# Round 1 Proposal Deck: SparkStart + SparkBuddy

---

## 1. Team Details

- **Team Name:** [Insert Team Name Here]
- **Team Leader:** [Insert Team Leader Name Here] (Email: [Insert Email], Department: [Insert Department])
- **Team Member 2:** [Insert Member 2 Name Here] (Email: [Insert Email], Department: [Insert Department])
- **Team Member 3:** [Insert Member 3 Name Here] (Email: [Insert Email], Department: [Insert Department])
- **Team Member 4:** [Insert Member 4 Name Here] (Email: [Insert Email], Department: [Insert Department])
- **Institution / University:** [Insert University / College Name Here]
- **Primary Technical Track:** LLMs & RAG — The Task Sequencer
- **Project Repository:** SparkStart Monorepo (Web, Electron Desktop, FastAPI Backend)

---

## 2. Brief About the Problem and Idea

SparkStart is an adaptive, low-pressure task sequencing system paired with SparkBuddy, a cross-application floating desktop companion. Designed for university students facing executive dysfunction and task initiation paralysis, SparkStart replaces intimidating 50-step checklists with evidence-based, 2-minute starter actions calibrated to self-reported energy levels. Utilizing a grounded Retrieval-Augmented Generation (RAG) architecture anchored in cognitive load and behavioral psychology literature, the system bridges the gap between intention and performance directly within active desktop workspaces such as VS Code. SparkStart rejects punitive streaks, aggressive alarms, and diagnostic overreach in favor of genuine user autonomy, local-first SQLite privacy, and guilt-free restorative pacing.

---

## 3. Proposed Solution and USP

### The Solution:
SparkStart transforms intimidating goals into friction-free micro-steps by addressing psychological inertia rather than enforcing regimented time slots. Rather than displaying exhaustive backlogs that trigger cognitive freeze, SparkStart isolates a single, observable, 2-to-5 minute starter action. Paired with SparkBuddy, a friendly cartoon sprout companion floating unobtrusively above developer tools and browser windows, the system supports users at the point of performance.

### Unique Selling Propositions (USPs):
1. **Single-Target Scaffolding**: Never overwhelms working memory with long to-do lists; focuses attention exclusively on the immediate next action.
2. **Dynamic Energy Pacing**: Micro-steps automatically scale down to 2-minute physical contact actions when low energy is reported, eliminating shame.
3. **Instant "Too Big" Shrink Engine**: When a user experiences hesitation, the sequencer recursively decomposes the action down to near-zero demand steps.
4. **Point-of-Performance Companion**: Stays accessible over VS Code and browsers without stealing keyboard focus or obstructing workflow.
5. **Evidence-Grounded RAG Engine**: Recommendations are grounded in reputable psychological research (Gollwitzer, Sweller, Barkley, Sonnentag) with transparent citations.
6. **Local-First Privacy Sovereignty**: 100% offline heuristic capability with local SQLite storage; zero data transmission without explicit user consent.

---

## 4. Key Features

- **Energy Check-In**: Low Energy (2–3 min starter), Medium Energy (5–10 min blocks), Higher Capacity (10–15 min sprints), or Not Sure / Skip.
- **Adaptive Task Sequencer**: Generates single-action starter commitments with duration tags, manageability explanations, and gentle alternatives.
- **"Too Big" Decomposition**: One-click action shrinking that removes cognitive friction during task freeze.
- **SparkBuddy Floating Mascot**: Electron companion with original SVG sprout mascot displaying 5 emotive states (Idle, Encouraging, Thinking, Resting, Celebrating).
- **Guilt-Free Rest Timer**: Configurable 5, 10, or 15-minute recovery intervals with soothing breathing animations and non-enforced return to work.
- **Accessible Task Management**: Non-punitive task creation, step tracking, and completion without overdue warnings or streak anxiety.
- **Grounded Evidence Drawer**: Expandable literature cards showing theoretical foundations from cognitive science.
- **Privacy & Data Sovereignty**: One-click JSON data export and permanent SQLite local wipe.

---

## 5. Process Flow / Use-case Diagram

```
+---------------------------------------------------------------------------------+
|                               USER WORKFLOW CYCLE                               |
+---------------------------------------------------------------------------------+
                                         |
                                         v
                         +-------------------------------+
                         |   1. Quick Energy Check-In    |
                         |   (Low / Med / High / Skip)   |
                         +-------------------------------+
                                         |
                                         v
                         +-------------------------------+
                         |     2. Enter Project Goal     |
                         |  (e.g., "DBMS Assignment")    |
                         +-------------------------------+
                                         |
                                         v
                         +-------------------------------+
                         | 3. RAG Literature Retrieval   |
                         |    & Micro-Step Sequencing    |
                         +-------------------------------+
                                         |
                                         v
                         +-------------------------------+
                         |   4. Single Action Presented  |
                         |  "Open PDF & read Question 1" |
                         +-------------------------------+
                                         |
                 +-----------------------+-----------------------+
                 |                       |                       |
                 v                       v                       v
         [ Click "Done" ]       [ Click "Too Big" ]    [ "Guilt-Free Rest" ]
                 |                       |                       |
                 v                       v                       v
      +---------------------+ +----------------------+ +--------------------+
      | Mascot Celebrates!  | | Shrink to 60-Second  | | 5-15 Min Breathing |
      | Step count updated. | | Frictionless Action  | | Timer. Zero Guilt. |
      +---------------------+ +----------------------+ +--------------------+
                 |                       |                       |
                 +-----------------------+-----------------------+
                                         |
                                         v
                         +-------------------------------+
                         |  5. Optional Pause or Next    |
                         |   Micro-Step when Ready       |
                         +-------------------------------+
```

---

## 6. Technical Track and Approach

**Primary Track:** LLMs & RAG — The Task Sequencer

### Methodological Approach:
1. **Curated Literature Ingestion**: The system embeds structured findings on executive functioning, cognitive load theory, and implementation intentions into an accessible JSON knowledge base.
2. **Context-Aware Semantic Retrieval**: When a student enters a task and optional obstacle, the RAG engine calculates token-boosted cosine similarity to retrieve matching behavioral scaffolding chunks.
3. **Structured Context Augmentation**: The retrieved passages ground the sequencer prompt, ensuring responses adhere to empirically validated behavioral pacing rules.
4. **Resilient Provider Abstraction**: Supports Google Gemini and OpenAI endpoints with automatic, seamless fallback to the local deterministic heuristic provider whenever API keys are absent or offline.
5. **Strict JSON Schema Validation**: Outputs are verified against rigorous Pydantic schemas before reaching the client interface.

---

## 7. Architecture Diagram

```
+---------------------------------------------------------------------------------------+
|                                 SPARKSTART SYSTEM ARCHITECTURE                         |
+---------------------------------------------------------------------------------------+

  [ WEB DASHBOARD ]                                   [ SPARKBUDDY COMPANION ]
  React 18 + Vite + Tailwind CSS                      Electron 33 + React + TypeScript
  - Energy Check-In & Task Manager                    - Frameless Translucent Floating Window
  - RAG Literature Drawer & Rest Modal                - Always-on-Top Over VS Code / Browsers
  - Insights & Data Sovereignty                       - Drag Handle & Custom Mascot SVG
           \                                                 /
            \--- (HTTP REST / JSON / localhost:8000) -------/
                                  |
                                  v
+---------------------------------------------------------------------------------------+
|                               FASTAPI BACKEND ENGINE                                   |
|                                                                                       |
|  [ API Router ]          [ Business Logic ]              [ Storage & Privacy ]        |
|  - /api/sequence/next    - TaskSequencerService          - SQLite (sparkstart_local.db)|
|  - /api/sequence/shrink  - Fallback Heuristic Rules      - Export JSON Handler        |
|  - /api/tasks (CRUD)     - Rest Timer Scheduler          - Database Purge Handler     |
|  - /api/knowledge                                                                     |
+---------------------------------------------------------------------------------------+
         |                                                       |
         v                                                       v
+----------------------------------+          +-----------------------------------------+
|        RAG RETRIEVAL ENGINE      |          |           AI PROVIDER FACTORY           |
|  - Curated Psychology Sources    |          |  - Mock Provider (100% Offline / Local) |
|  - Chunking & Cosine Vectors     |          |  - Google Gemini API (With Consent)     |
|  - Source Citation Formatter     |          |  - OpenAI API (With Consent)            |
+----------------------------------+          +-----------------------------------------+
```

---

## 8. Technologies to Be Used

- **Frontend Web Dashboard:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons.
- **Desktop Floating Companion:** Electron 33, React 18, TypeScript, Tailwind CSS, ContextBridge Preload IPC.
- **AI Backend:** Python 3.14, FastAPI, Uvicorn, Pydantic v2.
- **RAG & Vector Search:** Custom Token-Boosted Cosine Vector Index, Curated Educational Knowledge Store.
- **Local Database:** SQLite3 with relational foreign keys and JSON metadata serialization.
- **Networking & API Security:** HTTPX Async Client, CORS Middleware, Preload Sandbox Isolation.
- **Testing & Verification:** Pytest, TestClient, TypeScript Compiler (`tsc`), Vite Build Bundler.
- **Submission Document Generation:** ReportLab PDF Generation Library.

---

## 9. Privacy, Ethics and User Experience

- **User Autonomy**: Replaces manipulative streak preservation with non-punitive agency. A skipped reminder or dismissed recommendation is treated as neutral, not as failure.
- **Zero Involuntary Cloud Transmission**: Operates 100% offline out-of-the-box. Remote AI processing requires explicit opt-in consent.
- **No Intrusive Surveillance**: Strictly prohibits webcam access, gaze monitoring, facial emotion tracking, and keystroke logging.
- **Anti-Shame Design System**: Warm, pastel-inspired palette (sage greens, soft lavenders, warm creams), gentle typography, and friendly sprout mascot expressions.
- **Complete Data Sovereignty**: Immediate one-click JSON data export and permanent local SQLite purge capabilities.
- **Non-Clinical Stance**: Positioned strictly as educational scaffolding; never claims to diagnose or treat clinical conditions.

