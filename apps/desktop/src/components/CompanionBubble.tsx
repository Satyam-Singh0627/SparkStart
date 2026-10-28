import React from 'react';
import { CheckCircle2, Minimize2, Coffee, Clock, BellOff, X } from 'lucide-react';
import { SequenceResponse } from '@sparkstart/shared';

interface CompanionBubbleProps {
  microTask: SequenceResponse;
  onDone: () => void;
  onShrink: () => void;
  onRest: () => void;
  onSnooze: () => void;
  onDismiss: () => void;
  isLoading?: boolean;
}

export const CompanionBubble: React.FC<CompanionBubbleProps> = ({
  microTask,
  onDone,
  onShrink,
  onRest,
  onSnooze,
  onDismiss,
  isLoading = false,
}) => {
  return (
    <div className="relative w-full max-w-xs mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-emerald-200/90 no-drag text-left animate-in fade-in zoom-in-95 duration-200">
      {/* Top row */}
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
        <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
          <span>🌱</span>
          <span>Next Tiny Action</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            ~{microTask.suggestedDurationMinutes}m
          </span>
          <button
            onClick={onDismiss}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
            title="Dismiss prompt"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Text */}
      <p className="text-xs font-bold text-slate-800 leading-snug mb-2">
        {microTask.actionText}
      </p>

      {/* Why Manageable */}
      <p className="text-[11px] text-slate-500 leading-tight mb-3">
        {microTask.whyItIsManageable}
      </p>

      {/* Buttons */}
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        <button
          onClick={onDone}
          disabled={isLoading}
          className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl font-bold text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>Done</span>
        </button>

        <button
          onClick={onShrink}
          disabled={isLoading}
          className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/70 transition-colors cursor-pointer"
          title="Shrink to an even smaller step"
        >
          <Minimize2 className="w-3 h-3 text-amber-700" />
          <span>Too Big</span>
        </button>

        <button
          onClick={onRest}
          disabled={isLoading}
          className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/70 transition-colors cursor-pointer"
        >
          <Coffee className="w-3 h-3 text-purple-700" />
          <span>Rest</span>
        </button>
      </div>

      {/* Snooze option */}
      <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
        <button
          onClick={onSnooze}
          className="hover:text-slate-600 flex items-center gap-1 cursor-pointer"
        >
          <Clock className="w-2.5 h-2.5" />
          <span>Snooze (10 mins)</span>
        </button>
        <span>No penalties</span>
      </div>

      {/* Bubble Tail */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 border-r border-b border-emerald-200/90 transform rotate-45" />
    </div>
  );
};

