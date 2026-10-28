import React, { useState } from 'react';
import {
  Sprout,
  ArrowRight,
  Shield,
  Zap,
  Heart,
  Palette,
  Monitor,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Coffee,
  Minimize2,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { AppTheme, CompanionCharacter, CHARACTER_OPTIONS } from '@sparkstart/shared';
import { CharacterIllustration } from './CharacterIllustration';

interface LandingPageProps {
  onEnterApp: () => void;
  onStartTour: () => void;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  currentCharacter: CompanionCharacter;
  onCharacterChange: (character: CompanionCharacter) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onStartTour,
  currentTheme,
  onThemeChange,
  currentCharacter,
  onCharacterChange,
}) => {
  const [demoMood, setDemoMood] = useState<'idle' | 'encouraging' | 'thinking' | 'celebrating'>('encouraging');
  const activeChar = CHARACTER_OPTIONS.find((c) => c.id === currentCharacter) || CHARACTER_OPTIONS[0];

  return (
    <div className="min-h-screen ss-page flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg-card)]/80 border-b border-[var(--border)] px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm ring-2 ring-[var(--focus-ring)]"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Sprout className="w-6 h-6 ss-animate-float" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight ss-text-primary">
                  Spark<span style={{ color: 'var(--accent)' }}>Start</span>
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full ss-badge-accent">
                  MVP Live
                </span>
              </div>
              <p className="text-xs font-semibold ss-text-muted hidden sm:block">
                Small steps. Real progress.
              </p>
            </div>
          </div>

          {/* Nav Links & CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold ss-text-secondary">
              <a href="#how-it-works" className="hover:text-[var(--accent)] transition-colors">
                How It Works
              </a>
              <a href="#features" className="hover:text-[var(--accent)] transition-colors">
                Features
              </a>
              <a href="#privacy" className="hover:text-[var(--accent)] transition-colors">
                Privacy
              </a>
              <a href="#companion" className="hover:text-[var(--accent)] transition-colors">
                SparkBuddy
              </a>
            </nav>

            <button
              onClick={onStartTour}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold ss-subtle border border-[var(--border)] ss-text-secondary hover:ss-text-primary transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[var(--accent)]" />
              <span>Take Tour</span>
            </button>

            <button
              onClick={onEnterApp}
              className="ss-btn-primary text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5 cursor-pointer shadow-sm"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-16 space-y-20 sm:space-y-28">
        {/* HERO SECTION */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 pt-4 sm:pt-8">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ss-badge-accent text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
              <span>Adaptive, Low-Pressure Productivity Tool</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black ss-text-primary tracking-tight leading-[1.12]">
              Small steps. <br />
              <span style={{ color: 'var(--accent)' }}>Real progress.</span>
            </h1>

            <p className="ss-body text-base sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Designed specifically for university students and developers experiencing executive dysfunction, ADHD, cognitive overload, or task paralysis. SparkStart replaces intimidating to-do lists with grounded, 2-minute starter actions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onEnterApp}
                className="ss-btn-primary w-full sm:w-auto text-base sm:text-lg py-3.5 px-8 cursor-pointer shadow-md group"
              >
                <span>Start Your First Step</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onStartTour}
                className="ss-btn-secondary w-full sm:w-auto text-base sm:text-lg py-3.5 px-7 cursor-pointer"
              >
                <Compass className="w-5 h-5 text-[var(--accent)]" />
                <span>Explore Interactive Tour</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-3 text-xs sm:text-sm font-semibold ss-text-muted">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                100% Local SQLite
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Zero Guilt & No Streaks
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-600" />
                Cognitive Science Grounded
              </span>
            </div>
          </div>

          {/* Interactive Mascot & Micro-step Preview Card */}
          <div className="w-full max-w-md shrink-0">
            <div className="ss-card p-6 sm:p-7 rounded-3xl shadow-xl border border-[var(--border)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl -z-10" />

              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{activeChar.emoji}</span>
                  <div>
                    <h3 className="text-sm font-extrabold ss-text-primary">
                      SparkBuddy • {activeChar.name}
                    </h3>
                    <p className="text-xs ss-text-muted">Desktop Companion</p>
                  </div>
                </div>

                {/* Mood preview switcher */}
                <div className="flex items-center gap-1 p-1 rounded-xl ss-subtle text-xs font-semibold">
                  {(['idle', 'encouraging', 'thinking', 'celebrating'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setDemoMood(m)}
                      className={`px-2 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                        demoMood === m
                          ? 'bg-[var(--accent)] text-white shadow-xs'
                          : 'ss-text-muted hover:ss-text-primary'
                      }`}
                    >
                      {m === 'celebrating' ? 'win' : m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Character Illustration Center */}
              <div className="py-6 flex flex-col items-center justify-center">
                <CharacterIllustration character={currentCharacter} mood={demoMood} size={130} />
                <p className="text-sm font-bold text-center text-[var(--accent)] mt-3">
                  {demoMood === 'encouraging' && '"You do not have to write the entire paper today. Just open the document."'}
                  {demoMood === 'idle' && '"Ready whenever you feel ready. Take all the time you need."'}
                  {demoMood === 'thinking' && '"Checking cognitive load theory to find the gentlest start..."'}
                  {demoMood === 'celebrating' && '"A small step finished is a real victory! Great job!"'}
                </p>
              </div>

              {/* Sample Micro-Step Preview */}
              <div className="p-4 rounded-2xl ss-subtle border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="ss-badge-accent px-2 py-0.5">Sample Micro-Step</span>
                  <span className="text-[var(--accent)]">Approx. 2 mins</span>
                </div>
                <h4 className="text-sm font-bold ss-text-primary">
                  Open your IDE and create a blank file named `solution.py`
                </h4>
                <p className="text-xs ss-text-secondary leading-relaxed">
                  Activation energy is highest before beginning. Creating the empty file lowers the psychological barrier to start.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={onEnterApp}
                    className="flex-1 py-2 px-3 rounded-xl ss-btn-primary text-xs font-bold cursor-pointer text-center"
                  >
                    Try It Live
                  </button>
                  <button
                    onClick={() => {
                      const nextIdx = (CHARACTER_OPTIONS.findIndex((c) => c.id === currentCharacter) + 1) % CHARACTER_OPTIONS.length;
                      onCharacterChange(CHARACTER_OPTIONS[nextIdx].id);
                    }}
                    className="py-2 px-3 rounded-xl ss-btn-ghost text-xs font-bold cursor-pointer border border-[var(--border)]"
                  >
                    Change Buddy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="space-y-10 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="ss-badge-accent px-3 py-1 text-xs font-bold uppercase tracking-wider">
              Scaffolding Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold ss-text-primary tracking-tight">
              How SparkStart Works
            </h2>
            <p className="ss-body">
              Traditional productivity tools assume unlimited executive function. SparkStart adapts to how you actually feel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="ss-card p-6 sm:p-7 rounded-3xl space-y-4 hover:border-[var(--border-accent)] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xl border border-emerald-500/20">
                1
              </div>
              <h3 className="text-xl font-bold ss-text-primary">Capacity Check-In</h3>
              <p className="ss-body-sm leading-relaxed">
                Start by choosing your energy: Low, Medium, High, or "Not Sure". SparkStart calibrates step size so you are never overwhelmed.
              </p>
            </div>

            <div className="ss-card p-6 sm:p-7 rounded-3xl space-y-4 hover:border-[var(--border-accent)] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-xl border border-blue-500/20">
                2
              </div>
              <h3 className="text-xl font-bold ss-text-primary">Single-Target Sequencing</h3>
              <p className="ss-body-sm leading-relaxed">
                Instead of a 20-item checklist, you see exactly one immediate, 2-to-5 minute action. No multitasking, no cognitive freeze.
              </p>
            </div>

            <div className="ss-card p-6 sm:p-7 rounded-3xl space-y-4 hover:border-[var(--border-accent)] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black text-xl border border-purple-500/20">
                3
              </div>
              <h3 className="text-xl font-bold ss-text-primary">Adaptive Control</h3>
              <p className="ss-body-sm leading-relaxed">
                Step feels intimidating? Click <strong>Too Big</strong> to shrink it to 60 seconds, or take <strong>Guilt-Free Rest</strong> with zero guilt or penalties.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES OVERVIEW */}
        <section id="features" className="space-y-10 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="ss-badge-accent px-3 py-1 text-xs font-bold uppercase tracking-wider">
              Complete Feature Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold ss-text-primary tracking-tight">
              Engineered for Real Progress
            </h2>
            <p className="ss-body">
              Every detail built with low-stress psychology and respectful human-computer interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="ss-card p-6 rounded-2xl space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold ss-text-primary">Task Sequencer</h4>
              <p className="ss-body-sm">
                Transforms fuzzy, overwhelming goals into a sequenced progression of bite-sized, approachable wins.
              </p>
            </div>

            <div className="ss-card p-6 rounded-2xl space-y-3">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 w-fit">
                <Monitor className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold ss-text-primary">SparkBuddy Companion</h4>
              <p className="ss-body-sm">
                Electron desktop companion that floats beside your editor or browser to keep focus anchored.
              </p>
            </div>

            <div className="ss-card p-6 rounded-2xl space-y-3">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 w-fit">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold ss-text-primary">Evidence-Based RAG</h4>
              <p className="ss-body-sm">
                Indexes clinical literature on executive dysfunction, Pomodoro intervals, and dopamine baseline recovery.
              </p>
            </div>

            <div className="ss-card p-6 rounded-2xl space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 w-fit">
                <Palette className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold ss-text-primary">6 Accessible Themes</h4>
              <p className="ss-body-sm">
                Light, Dark, Forest, Lavender, Warm, and High-Contrast palettes with high contrast and readable typography.
              </p>
            </div>

            <div className="ss-card p-6 rounded-2xl space-y-3">
              <div className="p-3 rounded-xl bg-pink-500/10 text-pink-600 w-fit">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold ss-text-primary">6 Companion Characters</h4>
              <p className="ss-body-sm">
                Sprout, Panda, Fox, Cat, Cloud, and Robot with dynamic emotional states for calming visual reassurance.
              </p>
            </div>

            <div className="ss-card p-6 rounded-2xl space-y-3">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 w-fit">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold ss-text-primary">100% Local Privacy</h4>
              <p className="ss-body-sm">
                Local SQLite persistence (`sparkstart_local.db`). Remote AI processing is strictly opt-in with full data export/purge.
              </p>
            </div>
          </div>
        </section>

        {/* COMPANION SHOWCASE */}
        <section id="companion" className="ss-card p-8 sm:p-12 rounded-3xl space-y-8 scroll-mt-24 border border-[var(--border)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="ss-badge-accent px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Cross-Platform Companion
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold ss-text-primary tracking-tight">
                Meet SparkBuddy
              </h2>
              <p className="ss-body">
                A lightweight floating desktop widget that gently keeps your next micro-step in view while you write code, draft essays, or study.
              </p>
              <div className="space-y-2 pt-2 text-sm ss-text-secondary font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Configurable always-on-top floating mode or minimized tray</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Respects customizable Quiet Hours (e.g. 10 PM - 8 AM)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>One-click pause for 1 hour when you need zero interruptions</span>
                </div>
              </div>
            </div>

            {/* Character Selection Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl ss-subtle border border-[var(--border)]">
              {CHARACTER_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCharacterChange(c.id)}
                  className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    currentCharacter === c.id
                      ? 'bg-[var(--accent)] text-white shadow-md scale-105'
                      : 'hover:bg-[var(--bg-hover)] ss-text-primary'
                  }`}
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="text-xs font-bold">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* PRIVACY GUARANTEE */}
        <section id="privacy" className="ss-subtle p-8 sm:p-10 rounded-3xl border border-[var(--border)] space-y-4 scroll-mt-24">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-emerald-600" />
            <h3 className="text-2xl font-extrabold ss-text-primary">
              Privacy & Consent Boundary
            </h3>
          </div>
          <p className="ss-body leading-relaxed max-w-3xl">
            SparkStart does not sell data, track browsing history, or force cloud sync. Everything is stored locally on your machine in a standard SQLite database. The micro-task sequencer functions fully offline using local psychological heuristics and local vector search. If you choose to enable remote AI in Settings, your explicit consent is recorded and can be revoked at any time.
          </p>
        </section>

        {/* BOTTOM CTA */}
        <section className="text-center py-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold ss-text-primary tracking-tight">
            Ready to take your first small step?
          </h2>
          <p className="ss-body max-w-xl mx-auto">
            Zero pressure. No streak counters. Start whenever you want, pause whenever you need.
          </p>
          <div className="pt-2">
            <button
              onClick={onEnterApp}
              className="ss-btn-primary text-lg py-4 px-9 cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              <span>Launch SparkStart Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border)] py-8 px-4 sm:px-8 mt-12 bg-[var(--bg-card)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ss-text-muted">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="font-bold ss-text-primary">SparkStart & SparkBuddy</span>
            <span>• Small steps. Real progress.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onStartTour} className="hover:text-[var(--accent)] cursor-pointer">
              Interactive Tour
            </button>
            <button onClick={onEnterApp} className="hover:text-[var(--accent)] cursor-pointer">
              Launch App
            </button>
            <span>Local SQLite • MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

