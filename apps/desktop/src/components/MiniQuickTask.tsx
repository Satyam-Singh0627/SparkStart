import React, { useState } from 'react';
import { Sparkles, ArrowRight, BatteryLow, BatteryMedium, BatteryCharging, HelpCircle } from 'lucide-react';
import { EnergyLevel } from '@sparkstart/shared';

interface MiniQuickTaskProps {
  onStart: (taskTitle: string, energy: EnergyLevel) => Promise<void>;
  isLoading: boolean;
}

export const MiniQuickTask: React.FC<MiniQuickTaskProps> = ({ onStart, isLoading }) => {
  const [title, setTitle] = useState('');
  const [energy, setEnergy] = useState<EnergyLevel>('low');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isLoading) return;
    onStart(title.trim(), energy);
    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xs mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-200/90 no-drag text-left space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-700">What are you working on?</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEnergy('low')}
            className={`p-1 rounded-md text-[10px] ${
              energy === 'low' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:bg-slate-100'
            }`}
            title="Low Energy (2m)"
          >
            <BatteryLow className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setEnergy('medium')}
            className={`p-1 rounded-md text-[10px] ${
              energy === 'medium' ? 'bg-blue-100 text-blue-800' : 'text-slate-400 hover:bg-slate-100'
            }`}
            title="Medium Energy (8m)"
          >
            <BatteryMedium className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setEnergy('high')}
            className={`p-1 rounded-md text-[10px] ${
              energy === 'high' ? 'bg-purple-100 text-purple-800' : 'text-slate-400 hover:bg-slate-100'
            }`}
            title="Higher Capacity (12m)"
          >
            <BatteryCharging className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. DBMS assignment, code fix..."
          className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-slate-800"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!title.trim() || isLoading}
          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};

