import React from 'react';
import { Pin, Power, X, ShieldCheck, Sparkles } from 'lucide-react';
import { CompanionCharacter, CHARACTER_OPTIONS } from '@sparkstart/shared';

interface MiniSettingsProps {
  onClose: () => void;
  isAlwaysOnTop: boolean;
  onToggleAlwaysOnTop: () => void;
  onQuit: () => void;
  currentCharacter: CompanionCharacter;
  onSelectCharacter: (char: CompanionCharacter) => void;
}

export const MiniSettings: React.FC<MiniSettingsProps> = ({
  onClose,
  isAlwaysOnTop,
  onToggleAlwaysOnTop,
  onQuit,
  currentCharacter,
  onSelectCharacter,
}) => {
  return (
    <div className="w-full max-w-xs mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200 no-drag text-left space-y-3">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-800">SparkBuddy Settings</span>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Character Switcher */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Switch Character</span>
        </span>
        <div className="grid grid-cols-6 gap-1">
          {CHARACTER_OPTIONS.map((char) => (
            <button
              key={char.id}
              onClick={() => onSelectCharacter(char.id)}
              className={`p-1 rounded-xl text-center text-sm transition-all ${
                currentCharacter === char.id
                  ? 'bg-emerald-100 ring-2 ring-emerald-500 scale-105'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
              title={char.name}
            >
              {char.emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 text-xs pt-1">
        <button
          onClick={onToggleAlwaysOnTop}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Pin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Always on Top</span>
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAlwaysOnTop ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
            {isAlwaysOnTop ? 'Enabled' : 'Off'}
          </span>
        </button>

        <div className="p-2 rounded-xl bg-slate-50 text-[11px] text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Local SQLite • 100% Privacy</span>
        </div>

        <button
          onClick={onQuit}
          className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-colors cursor-pointer"
        >
          <Power className="w-3.5 h-3.5" />
          <span>Quit SparkBuddy</span>
        </button>
      </div>
    </div>
  );
};
