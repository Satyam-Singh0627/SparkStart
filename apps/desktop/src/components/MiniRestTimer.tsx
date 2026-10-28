import React, { useState, useEffect } from 'react';
import { Coffee, Pause, Play, X } from 'lucide-react';

interface MiniRestTimerProps {
  onClose: () => void;
}

export const MiniRestTimer: React.FC<MiniRestTimerProps> = ({ onClose }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const m = Math.floor(secondsRemaining / 60);
  const s = secondsRemaining % 60;

  return (
    <div className="w-full max-w-xs mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-purple-200 no-drag text-center">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-purple-800 flex items-center gap-1">
          <Coffee className="w-3.5 h-3.5" />
          <span>Guilt-Free Rest</span>
        </span>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="text-2xl font-black font-mono text-slate-800 my-2">
        {m}:{s < 10 ? '0' : ''}{s}
      </div>

      <p className="text-[10px] text-slate-500 mb-3">
        Inhale slowly... You have permission to step away.
      </p>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
        >
          {isRunning ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Done Resting
        </button>
      </div>
    </div>
  );
};

