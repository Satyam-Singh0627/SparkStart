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
  ListOrdered,
  Check,
} from 'lucide-react';
import { SequenceResponse, KnowledgeSourceRef, MicroTask } from '@sparkstart/shared';

interface MicroTaskCardProps {
  microTask: SequenceResponse;
  subtasks?: MicroTask[];
  onDone: (stepId?: string) => void;
  onShrink: () => void;
  onRest: () => void;
  onDismiss: () => void;
  onSkip?: () => void;
  onSelectSubtask?: (stepId: string) => void;
  isLoading?: boolean;
}

export const MicroTaskCard: React.FC<MicroTaskCardProps> = ({
  microTask,
  subtasks = [],
  onDone,
  onShrink,
  onRest,
  onDismiss,
  onSkip,
  onSelectSubtask,
  isLoading = false,
}) => {
  const [showSources, setShowSources] = useState(false);
  const [showSubtaskList, setShowSubtaskList] = useState(true);
  const [justCompleted, setJustCompleted] = useState(false);

  const handleDoneClick = () => {
    setJustCompleted(true);
    setTimeout(() => {
      onDone(microTask.stepId);
      setJustCompleted(false);
    }, 700);
  };

  const currentStepNum = microTask.stepOrder || 1;
  const totalStepsNum = microTask.totalSteps || (subtasks.length > 0 ? subtasks.length : 4);
  const completedCount = subtasks.filter((s) => s.status === 'completed').length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalStepsNum) * 100));

  return (
    <section className="ss-card rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all shadow-lg border border-[var(--border)]">
      {/* Decorative calm background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-light)] opacity-30 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Header: Badge, Step Counter & Duration */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="ss-badge-accent px-3 py-1.5 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Immediate Micro-Action</span>
          </span>

          <span className="text-xs font-extrabold px-3 py-1.5 rounded-full ss-subtle border border-[var(--border)] ss-text-secondary">
            Step {currentStepNum} of {totalStepsNum}
          </span>

          {microTask.isFallback && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg ss-subtle ss-text-muted border border-[var(--border)]">
              Local Heuristic
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--accent)] bg-[var(--accent-light)] px-3.5 py-1.5 rounded-full border border-[var(--border-accent)]">
          <Clock className="w-4 h-4" />
          <span>Approx. {microTask.suggestedDurationMinutes} {microTask.suggestedDurationMinutes === 1 ? 'min' : 'mins'}</span>
        </div>
      </div>

      {/* Progress Bar across the steps */}
      <div className="mb-6 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold ss-text-muted">
          <span>Task Progress</span>
          <span>{completedCount} of {totalStepsNum} micro-steps completed ({progressPercent}%)</span>
        </div>
        <div className="w-full h-2 rounded-full ss-subtle overflow-hidden border border-[var(--border)]">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-500 rounded-full"
            style={{ width: `${Math.max(8, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Contextual Pacing Sidebar + Main Action Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Contextual Pacing Panel (Secondary Controls) */}
        <aside className="lg:col-span-4 rounded-2xl ss-subtle p-4 sm:p-5 border border-[var(--border)] space-y-3 order-2 lg:order-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider ss-text-muted">
              Pacing & Adjustments
            </span>
            <span className="text-[10px] ss-text-muted">Zero Pressure</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onShrink}
              disabled={isLoading}
              className="w-full flex items-center justify-start gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
              title="Shrink this step to an ultra-gentle 60-second action"
            >
              <Minimize2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="text-left">
                <div className="font-bold">Too Big?</div>
                <div className="text-[10px] font-normal opacity-80">Shrink to 60 seconds</div>
              </div>
            </button>

            {onSkip && (
              <button
                onClick={onSkip}
                disabled={isLoading}
                className="w-full flex items-center justify-start gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/30 transition-all cursor-pointer"
                title="Try an alternative starting action without penalty"
              >
                <SkipForward className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="text-left">
                  <div className="font-bold">Skip / Next Option</div>
                  <div className="text-[10px] font-normal opacity-80">Try an alternative micro-action</div>
                </div>
              </button>
            )}

            <button
              onClick={onRest}
              disabled={isLoading}
              className="w-full flex items-center justify-start gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
              title="Pause and take a guilt-free resting break"
            >
              <Coffee className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <div className="text-left">
                <div className="font-bold">Guilt-Free Rest</div>
                <div className="text-[10px] font-normal opacity-80">Take a 5–15 min breathing pause</div>
              </div>
            </button>

            <button
              onClick={onDismiss}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ss-text-muted hover:ss-text-primary hover:bg-[var(--bg-hover)] transition-colors cursor-pointer border border-transparent hover:border-[var(--border)]"
              title="Dismiss this recommendation without penalty"
            >
              <XCircle className="w-4 h-4" />
              <span>Dismiss for now</span>
            </button>
          </div>
        </aside>

        {/* Right: Main Action Content Area */}
        <div className="lg:col-span-8 space-y-5 order-1 lg:order-2">
          {/* Main Action Title */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-black ss-text-primary tracking-tight leading-snug">
              {microTask.actionText}
            </h3>
            {microTask.encouragement && (
              <p className="text-sm sm:text-base font-semibold text-[var(--accent)] mt-2.5 flex items-center gap-2">
                <span>🌱</span>
                <span>{microTask.encouragement}</span>
              </p>
            )}
          </div>

          {/* Why this is manageable box */}
          <div className="rounded-2xl ss-subtle p-5 border border-[var(--border)]">
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

          {/* Primary Action Button: Prominent & Celebratory */}
          <div className="pt-2">
            <button
              onClick={handleDoneClick}
              disabled={isLoading || justCompleted}
              className={`w-full sm:w-auto ss-btn-primary text-base sm:text-lg py-4 px-8 cursor-pointer shadow-md transition-all flex items-center justify-center gap-3 ${
                justCompleted ? 'ring-4 ring-[var(--accent)] scale-102' : ''
              }`}
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>
                {justCompleted
                  ? 'Done! Small Win Celebrated! ✨'
                  : currentStepNum === totalStepsNum
                  ? 'Complete Final Step! 🎉'
                  : 'Done — Advance to Next Step'}
              </span>
            </button>
          </div>

          {/* Full Sequence of Child Steps Breakdown */}
          {subtasks.length > 0 && (
            <div className="border-t border-[var(--border)] pt-4">
              <button
                onClick={() => setShowSubtaskList(!showSubtaskList)}
                className="flex items-center justify-between w-full py-1 text-xs font-bold ss-text-muted hover:ss-text-primary transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-[var(--accent)]" />
                  <span>Full Task Step Sequence ({subtasks.length} steps planned)</span>
                </span>
                {showSubtaskList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showSubtaskList && (
                <div className="mt-3 space-y-2">
                  {subtasks.map((step, idx) => {
                    const isDone = step.status === 'completed';
                    const isCurrent = step.id === microTask.stepId || (!isDone && idx + 1 === currentStepNum);

                    return (
                      <div
                        key={step.id || idx}
                        onClick={() => onSelectSubtask && !isDone && onSelectSubtask(step.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-500/5 border-emerald-500/20 ss-text-muted line-through'
                            : isCurrent
                            ? 'bg-[var(--accent-light)] border-[var(--border-accent)] ss-text-primary font-bold shadow-xs'
                            : 'ss-subtle border-[var(--border)] ss-text-secondary cursor-pointer hover:border-[var(--border-accent)]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 flex-1">
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                              isDone
                                ? 'bg-[var(--accent)] text-white'
                                : isCurrent
                                ? 'bg-[var(--accent)] text-white'
                                : 'ss-subtle border border-[var(--border)] ss-text-muted'
                            }`}
                          >
                            {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                          </span>
                          <span className="line-clamp-1">{step.actionText}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-medium ss-text-muted">
                            ~{step.suggestedDurationMinutes}m
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Literature Sources Accordion */}
          {microTask.sourceReferences && microTask.sourceReferences.length > 0 && (
            <div className="border-t border-[var(--border)] pt-4">
              <button
                onClick={() => setShowSources(!showSources)}
                className="flex items-center justify-between w-full text-xs font-bold ss-text-muted hover:text-[var(--accent)] transition-colors py-1 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                  <span>Grounded in Evidence ({microTask.sourceReferences.length} psychological sources)</span>
                </span>
                {showSources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showSources && (
                <div className="mt-3 space-y-2.5 pt-1">
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
        </div>
      </div>
    </section>
  );
};
