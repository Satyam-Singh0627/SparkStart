import React, { useState } from 'react';
import {
  CheckCircle2,
  Minimize2,
  Coffee,
  XCircle,
  Clock,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  SkipForward,
} from 'lucide-react';
import { SequenceResponse, KnowledgeSourceRef } from '@sparkstart/shared';

interface MicroTaskCardProps {
  microTask: SequenceResponse;
  onDone: () => void;
  onShrink: () => void;
  onRest: () => void;
  onDismiss: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
}

export const MicroTaskCard: React.FC<MicroTaskCardProps> = ({
  microTask,
  onDone,
  onShrink,
  onRest,
  onDismiss,
  onSkip,
  isLoading = false,
}) => {
  const [showSources, setShowSources] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const handleDoneClick = () => {
    setJustCompleted(true);
    setTimeout(() => {
      onDone();
      setJustCompleted(false);
    }, 800);
  };

  return (
    <section className="ss-card p-6 sm:p-8 relative overflow-hidden transition-all shadow-md">
      {/* Decorative calm background accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-light)] opacity-40 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Header: Badge & Duration */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="ss-badge-accent px-3 py-1.5 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            Your Immediate Next Action
          </span>
          {microTask.isFallback && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg ss-subtle ss-text-muted border border-[var(--border)]">
              Offline Mode
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--accent)] bg-[var(--accent-light)] px-3.5 py-1.5 rounded-full border border-[var(--border-accent)]">
          <Clock className="w-4 h-4" />
          <span>Approx. {microTask.suggestedDurationMinutes} {microTask.suggestedDurationMinutes === 1 ? 'min' : 'mins'}</span>
        </div>
      </div>

      {/* Main Action Title */}
      <div className="mb-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold ss-text-primary tracking-tight leading-snug">
          {microTask.actionText}
        </h3>
        {microTask.encouragement && (
          <p className="text-base font-semibold text-[var(--accent)] mt-2.5 flex items-center gap-2">
            <span>🌱</span>
            <span>{microTask.encouragement}</span>
          </p>
        )}
      </div>

      {/* Why this is manageable box */}
      <div className="rounded-2xl ss-subtle p-5 mb-6 border border-[var(--border)]">
        <h4 className="text-xs font-bold uppercase tracking-wider ss-text-muted mb-1.5">
          Why this is manageable
        </h4>
        <p className="text-sm sm:text-base leading-relaxed ss-text-secondary">
          {microTask.whyItIsManageable}
        </p>

        {microTask.alternativeSmallerStep && (
          <div className="mt-3.5 pt-3.5 border-t border-[var(--border)] flex items-start gap-2 text-sm ss-text-secondary">
            <span className="font-bold text-[var(--accent)] whitespace-nowrap">Gentle alternative:</span>
            <span>{microTask.alternativeSmallerStep}</span>
          </div>
        )}
      </div>

      {/* Literature Sources Accordion */}
      {microTask.sourceReferences && microTask.sourceReferences.length > 0 && (
        <div className="mb-6 border-b border-[var(--border)] pb-4">
          <button
            onClick={() => setShowSources(!showSources)}
            className="flex items-center justify-between w-full text-xs font-bold ss-text-muted hover:text-[var(--accent)] transition-colors py-1 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--accent)]" />
              <span>Grounded in Evidence ({microTask.sourceReferences.length} psychological literature sources)</span>
            </span>
            {showSources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSources && (
            <div className="mt-3 space-y-2.5 pt-2">
              {microTask.sourceReferences.map((ref: KnowledgeSourceRef, idx: number) => (
                <div
                  key={ref.id || idx}
                  className="rounded-xl ss-subtle p-3.5 text-xs border border-[var(--border)]"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold ss-text-primary text-sm">{ref.title}</span>
                    {ref.sourceUrl && (
                      <a
                        href={ref.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--accent)] hover:underline flex items-center gap-1 text-xs font-semibold"
                      >
                        Source <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {ref.excerpt && (
                    <p className="ss-text-muted text-xs leading-relaxed italic mt-1">
                      "{ref.excerpt}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4 Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleDoneClick}
          disabled={isLoading || justCompleted}
          className={`ss-btn-primary flex-1 sm:flex-initial text-base py-3 px-6 cursor-pointer ${
            justCompleted ? 'ring-4 ring-emerald-300 scale-102' : ''
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{justCompleted ? 'Done! Small Win! ✨' : 'Done'}</span>
        </button>

        <button
          onClick={onShrink}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all cursor-pointer"
          title="Make this step even smaller and easier"
        >
          <Minimize2 className="w-4 h-4" />
          <span>Too Big</span>
        </button>

        {onSkip && (
          <button
            onClick={onSkip}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30 transition-all cursor-pointer"
            title="Try an alternative micro-action without marking this done"
          >
            <SkipForward className="w-4 h-4" />
            <span>Skip / Next Option</span>
          </button>
        )}

        <button
          onClick={onRest}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-500/30 transition-all cursor-pointer"
          title="Take an optional, non-judgmental rest break"
        >
          <Coffee className="w-4 h-4" />
          <span>Guilt-Free Rest</span>
        </button>

        <button
          onClick={onDismiss}
          disabled={isLoading}
          className="p-3 rounded-xl ss-btn-ghost cursor-pointer"
          title="Dismiss this recommendation without penalty"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
