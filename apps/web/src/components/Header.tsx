import React from 'react';
import {
  Sprout,
  Heart,
  ListTodo,
  BarChart3,
  SlidersHorizontal,
  Palette,
  ShieldCheck,
  Monitor,
  Compass,
  Home,
} from 'lucide-react';
import { AppTheme, CompanionCharacter, CHARACTER_OPTIONS } from '@sparkstart/shared';

interface HeaderProps {
  activeTab: 'dashboard' | 'tasks' | 'insights' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'tasks' | 'insights' | 'settings') => void;
  backendOnline: boolean;
  aiProvider: string;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  currentCharacter: CompanionCharacter;
  onOpenTour?: () => void;
  onSwitchToLanding?: () => void;
}

const THEME_OPTIONS: { id: AppTheme; label: string; previewColor: string; bgPreview: string }[] = [
  { id: 'light', label: 'Light', previewColor: '#16a34a', bgPreview: '#fafaf8' },
  { id: 'dark', label: 'Dark', previewColor: '#4ade80', bgPreview: '#0f1117' },
  { id: 'forest', label: 'Forest', previewColor: '#166534', bgPreview: '#f0f7f0' },
  { id: 'lavender', label: 'Lavender', previewColor: '#7c3aed', bgPreview: '#faf5ff' },
  { id: 'warm', label: 'Warm', previewColor: '#c2410c', bgPreview: '#fdf8f0' },
  { id: 'high-contrast', label: 'High Contrast', previewColor: '#006400', bgPreview: '#ffffff' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  backendOnline,
  aiProvider,
  currentTheme,
  onThemeChange,
  currentCharacter,
  onOpenTour,
  onSwitchToLanding,
}) => {
  const activeChar = CHARACTER_OPTIONS.find((c) => c.id === currentCharacter) || CHARACTER_OPTIONS[0];

  return (
    <header className="ss-nav px-4 sm:px-8 py-3.5 transition-colors sticky top-0 z-30 backdrop-blur-md bg-[var(--bg-card)]/90 border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-300/40 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 ss-animate-float" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight ss-text-primary">
                  Spark<span className="text-emerald-600 dark:text-emerald-400">Start</span>
                </h1>
                <span className="ss-badge-accent hidden sm:inline-flex items-center gap-1">
                  <span>{activeChar.emoji}</span>
                  <span>{activeChar.name}</span>
                </span>
              </div>
              <p className="text-xs font-semibold ss-text-muted">
                Small steps. Real progress.
              </p>
            </div>
          </div>

          {/* Quick buttons on mobile */}
          <div className="flex md:hidden items-center gap-2">
            {onSwitchToLanding && (
              <button
                onClick={onSwitchToLanding}
                className="p-1.5 rounded-lg ss-subtle text-xs font-bold ss-text-secondary"
                title="Overview & Landing Page"
              >
                <Home className="w-4 h-4" />
              </button>
            )}
            <select
              value={currentTheme}
              onChange={(e) => onThemeChange(e.target.value as AppTheme)}
              aria-label="Appearance Mode"
              className="ss-select text-xs py-1 px-2"
            >
              {THEME_OPTIONS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav
          aria-label="Main Navigation"
          className="flex items-center gap-1.5 p-1 rounded-2xl ss-subtle text-sm font-semibold"
        >
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-sm font-bold border border-[var(--border)]'
                : 'ss-text-muted hover:ss-text-primary'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            id="nav-tasks-tab"
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-sm font-bold border border-[var(--border)]'
                : 'ss-text-muted hover:ss-text-primary'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>My Tasks</span>
          </button>

          <button
            id="nav-insights-tab"
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'insights'
                ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-sm font-bold border border-[var(--border)]'
                : 'ss-text-muted hover:ss-text-primary'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Insights</span>
          </button>

          <button
            id="nav-settings-tab"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-sm font-bold border border-[var(--border)]'
                : 'ss-text-muted hover:ss-text-primary'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Right Tools: Landing Page link + Tour + 6-Mode Appearance Selector + Backend Status */}
        <div className="hidden md:flex items-center gap-2.5">
          {onSwitchToLanding && (
            <button
              onClick={onSwitchToLanding}
              className="px-3 py-1.5 rounded-xl text-xs font-bold ss-subtle border border-[var(--border)] ss-text-secondary hover:ss-text-primary transition-all cursor-pointer flex items-center gap-1.5"
              title="Return to Public Landing Page"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
          )}

          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="px-3 py-1.5 rounded-xl text-xs font-bold ss-subtle border border-[var(--border)] text-[var(--accent)] hover:bg-[var(--accent-light)] transition-all cursor-pointer flex items-center gap-1.5"
              title="Start Interactive Guided Tour"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Tour</span>
            </button>
          )}

          {/* Theme Selector Popover / Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl ss-subtle border border-[var(--border)]">
            <Palette className="w-3.5 h-3.5 ss-text-muted ml-1" />
            <select
              value={currentTheme}
              onChange={(e) => onThemeChange(e.target.value as AppTheme)}
              aria-label="Appearance Mode"
              className="bg-transparent text-xs font-semibold ss-text-primary border-none outline-none cursor-pointer pr-1"
            >
              {THEME_OPTIONS.map((t) => (
                <option key={t.id} value={t.id} className="bg-[var(--bg-card)] ss-text-primary">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Engine Status Indicator */}
          <div className="flex items-center gap-2 text-xs font-medium ss-text-muted bg-[var(--bg-subtle)] px-3 py-1.5 rounded-full border border-[var(--border)]">
            <span
              className={`w-2 h-2 rounded-full ${
                backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>
              {backendOnline
                ? aiProvider === 'mock'
                  ? 'Local RAG (Privacy First)'
                  : `RAG (${aiProvider})`
                : 'Offline Storage'}
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>
      </div>
    </header>
  );
};
