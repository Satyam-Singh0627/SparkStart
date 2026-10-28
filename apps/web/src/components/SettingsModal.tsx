import React, { useState } from 'react';
import {
  Bell,
  Moon,
  ShieldCheck,
  Download,
  Trash2,
  Cpu,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  Palette,
  Sparkles,
} from 'lucide-react';
import {
  Preferences,
  AppTheme,
  CompanionCharacter,
  CHARACTER_OPTIONS,
  THEME_OPTIONS,
} from '@sparkstart/shared';
import { exportAllData, purgeAllData } from '../services/api';
import { CharacterIllustration } from './CharacterIllustration';

interface SettingsModalProps {
  preferences: Preferences;
  onSavePreferences: (prefs: Preferences) => Promise<void>;
  aiProvider: string;
  onThemeChange: (theme: AppTheme) => void;
  onCharacterChange: (character: CompanionCharacter) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  preferences,
  onSavePreferences,
  aiProvider,
  onThemeChange,
  onCharacterChange,
}) => {
  const [prefs, setPrefs] = useState<Preferences>(preferences);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [purgedSuccess, setPurgedSuccess] = useState(false);

  const handleToggle = (key: keyof Preferences) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
  };

  const handleChange = (key: keyof Preferences, val: any) => {
    const updated = { ...prefs, [key]: val };
    setPrefs(updated);
    if (key === 'theme') {
      onThemeChange(val as AppTheme);
    }
    if (key === 'character') {
      onCharacterChange(val as CompanionCharacter);
    }
  };

  const handleSave = async () => {
    await onSavePreferences(prefs);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExport = async () => {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sparkstart-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePurge = async () => {
    await purgeAllData();
    setShowPurgeConfirm(false);
    setPurgedSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold ss-text-primary tracking-tight">
          Settings & Preferences
        </h2>
        <p className="ss-support mt-1">
          Customize themes, companion characters, pacing intervals, quiet hours, and privacy boundaries.
        </p>
      </div>

      {/* 1. APPEARANCE MODES */}
      <section className="ss-card p-6 sm:p-7 space-y-4">
        <h3 className="text-lg font-bold ss-text-primary flex items-center gap-2">
          <Palette className="w-5 h-5 text-[var(--accent)]" />
          <span>Appearance Mode</span>
        </h3>
        <p className="ss-support">
          Select from six carefully crafted visual environments.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1">
          {THEME_OPTIONS.map((t) => {
            const isSelected = prefs.theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleChange('theme', t.id)}
                className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent-light)] ring-2 ring-[var(--focus-ring)] shadow-sm'
                    : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-accent)]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-sm font-bold ss-text-primary flex items-center gap-1.5">
                    {t.name}
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" />}
                  </span>
                  <div className="flex items-center gap-1 p-1 rounded-md border border-[var(--border)]" style={{ backgroundColor: t.previewBg }}>
                    <span className="w-3.5 h-3.5 rounded border border-black/10" style={{ backgroundColor: t.previewCard }} title="Card Background" />
                    <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: t.previewText }} title="Text Color" />
                    <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: t.previewAccent }} title="Accent Color" />
                  </div>
                </div>
                <p className="text-xs ss-text-secondary leading-snug">{t.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. CHARACTER SELECTION */}
      <section className="ss-card p-6 sm:p-7 space-y-4">
        <h3 className="text-lg font-bold ss-text-primary flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--accent)]" />
          <span>SparkBuddy Character Selection</span>
        </h3>
        <p className="ss-support">
          Choose which companion accompanies you on your desktop and dashboard.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
          {CHARACTER_OPTIONS.map((char) => {
            const isSelected = prefs.character === char.id;
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => handleChange('character', char.id)}
                className={`flex flex-col items-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent-light)] ring-2 ring-[var(--focus-ring)] shadow-sm'
                    : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-accent)]'
                }`}
              >
                <CharacterIllustration character={char.id} mood="idle" size={64} />
                <span className="text-sm font-bold ss-text-primary mt-2">{char.name}</span>
                <span className="text-[11px] ss-text-muted mt-0.5 line-clamp-1">{char.description}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. REMINDERS & PACING */}
      <section className="ss-card p-6 sm:p-7 space-y-5">
        <h3 className="text-lg font-bold ss-text-primary flex items-center gap-2">
          <Bell className="w-5 h-5 text-[var(--accent)]" />
          <span>Reminders & Pacing</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold ss-text-secondary mb-1.5">
              Reminder Interval
            </label>
            <select
              value={prefs.reminderFrequencyMinutes}
              onChange={(e) => handleChange('reminderFrequencyMinutes', Number(e.target.value))}
              className="ss-select w-full"
            >
              <option value={15}>Every 15 minutes (Gentle)</option>
              <option value={30}>Every 30 minutes (Standard)</option>
              <option value={45}>Every 45 minutes</option>
              <option value={60}>Every 60 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold ss-text-secondary mb-1.5">
              Default Step Size
            </label>
            <select
              value={prefs.preferredStepDurationMinutes}
              onChange={(e) => handleChange('preferredStepDurationMinutes', Number(e.target.value))}
              className="ss-select w-full"
            >
              <option value={2}>2 Minutes (Ultra-Micro)</option>
              <option value={5}>5 Minutes (Balanced Starter)</option>
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes</option>
            </select>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 ss-text-muted" />
            <div>
              <span className="text-sm font-bold ss-text-primary">Quiet Hours</span>
              <p className="ss-support text-xs">
                Suppress all notifications and sound during resting hours.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium">
            <input
              type="time"
              value={prefs.quietHoursStart}
              onChange={(e) => handleChange('quietHoursStart', e.target.value)}
              className="ss-input py-1 px-2.5 text-xs w-28"
            />
            <span className="ss-text-muted">to</span>
            <input
              type="time"
              value={prefs.quietHoursEnd}
              onChange={(e) => handleChange('quietHoursEnd', e.target.value)}
              className="ss-input py-1 px-2.5 text-xs w-28"
            />
          </div>
        </div>
      </section>

      {/* 4. SPARKBUDDY COMPANION */}
      <section className="ss-card p-6 sm:p-7 space-y-4">
        <h3 className="text-lg font-bold ss-text-primary flex items-center gap-2">
          <Monitor className="w-5 h-5 text-[var(--accent)]" />
          <span>SparkBuddy Desktop Companion</span>
        </h3>

        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold ss-text-primary">Enable Desktop Floating Companion</span>
            <p className="ss-support text-xs mt-0.5">
              Allows the floating companion window to float unobtrusively over VS Code, Chrome, and desktop applications.
            </p>
          </div>
          <input
            type="checkbox"
            checked={prefs.enableSparkBuddy}
            onChange={() => handleToggle('enableSparkBuddy')}
            className="w-5 h-5 rounded cursor-pointer accent-[var(--accent)]"
          />
        </div>

        <div className="p-3.5 rounded-2xl ss-subtle text-xs border border-[var(--border)]">
          <p className="font-bold ss-text-primary mb-1">One-click launch:</p>
          <p className="ss-text-secondary">
            Use the <code className="bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border)] font-mono text-emerald-600 font-bold">Start-SparkStart.bat</code> launcher in the repository root to start all services and companion automatically.
          </p>
        </div>
      </section>

      {/* 5. AI PRIVACY & CONSENT */}
      <section className="ss-card p-6 sm:p-7 space-y-4">
        <h3 className="text-lg font-bold ss-text-primary flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[var(--accent)]" />
          <span>AI Processing & Consent Boundary</span>
        </h3>

        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-sm font-bold ss-text-primary">Remote Cloud AI Processing Consent</span>
            <p className="ss-support text-xs mt-1 leading-relaxed">
              When toggled OFF, SparkStart operates 100% locally using our built-in deterministic sequencing engine and local RAG psychology literature. No tasks or text ever leave your computer.
            </p>
          </div>
          <input
            type="checkbox"
            checked={prefs.enableRemoteAI}
            onChange={() => handleToggle('enableRemoteAI')}
            className="w-5 h-5 rounded cursor-pointer accent-[var(--accent)] mt-1"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold ss-text-muted pt-2 border-t border-[var(--border)]">
          <Cpu className="w-4 h-4" />
          <span>Local Engine: <strong className="ss-text-primary capitalize">{aiProvider}</strong></span>
          <span>•</span>
          <span>Data Transmission: <strong className={prefs.enableRemoteAI ? "text-amber-600" : "text-emerald-600"}>{prefs.enableRemoteAI ? "Remote Permitted (Consented)" : "100% On-Device Local"}</strong></span>
        </div>
      </section>

      {/* 6. LOCAL DATA SOVEREIGNTY & EXPORT */}
      <section className="ss-card p-6 sm:p-7 space-y-4">
        <h3 className="text-lg font-bold ss-text-primary flex items-center gap-2">
          <Download className="w-5 h-5 text-[var(--accent)]" />
          <span>Data Sovereignty & Permanent Deletion</span>
        </h3>

        <p className="ss-support text-xs">
          All your tasks, preferences, and micro-steps reside inside your local SQLite database (<code className="font-mono text-xs">sparkstart_local.db</code>).
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExport}
            className="ss-btn-secondary text-xs py-2 px-4 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export My Data (JSON)</span>
          </button>

          <button
            onClick={() => setShowPurgeConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/30 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Erase All Local Data</span>
          </button>
        </div>

        {purgedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 text-xs font-bold border border-emerald-500/30">
            All local task data and preferences have been permanently erased. Reloading...
          </div>
        )}
      </section>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-3">
        {saveSuccess && (
          <span className="text-sm font-bold text-[var(--accent)] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Preferences Saved!
          </span>
        )}
        <button
          onClick={handleSave}
          className="ss-btn-primary text-base py-3 px-7 cursor-pointer"
        >
          Save Preferences
        </button>
      </div>

      {/* Purge Confirmation Modal */}
      {showPurgeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl ss-card p-6 shadow-2xl text-center">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <h4 className="text-lg font-bold ss-text-primary">Erase All Local Data?</h4>
            <p className="ss-support text-xs mt-1 mb-5">
              This will permanently delete all tasks, micro-tasks, and stored preferences from your local database. This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowPurgeConfirm(false)}
                className="ss-btn-secondary text-xs py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePurge}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs cursor-pointer"
              >
                Yes, Erase Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
