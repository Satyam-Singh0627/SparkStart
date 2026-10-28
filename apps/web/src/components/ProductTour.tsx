import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, X, Sparkles, Check } from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-energy',
    title: '1. Capacity Check-In',
    content:
      'Start by telling us how you feel right now. Low energy? We will generate an ultra-gentle 2-minute starter action. Feeling ready? We will set up a 10–15 minute focus block.',
    position: 'bottom',
  },
  {
    targetId: 'tour-taskstarter',
    title: '2. Low-Friction Task Starter',
    content:
      'Enter any project, essay, or coding assignment that feels heavy. No need to structure it yet—just type what is on your mind.',
    position: 'bottom',
  },
  {
    targetId: 'tour-microtask',
    title: '3. Single-Target Next Action',
    content:
      'Instead of an overwhelming to-do list, SparkStart gives you exactly ONE actionable next step, complete with an explanation of why it is psychologically manageable.',
    position: 'top',
  },
  {
    targetId: 'tour-tasks',
    title: '4. My Tasks & Step Progression',
    content:
      'Manage your assignments without arbitrary deadlines or guilt. View your past micro-steps and choose which goal you want to make steady progress on.',
    position: 'bottom',
  },
  {
    targetId: 'tour-insights',
    title: '5. Momentum & Resting Insights',
    content:
      'Review your progress, completed micro-actions, and rest sessions. There are no punitive broken streaks here—only celebrated steps.',
    position: 'bottom',
  },
  {
    targetId: 'tour-settings',
    title: '6. Personalize Your Companion & Theme',
    content:
      'Switch between 6 accessible design themes (Light, Dark, Forest, Lavender, Warm, High Contrast) and choose your favorite SparkBuddy companion character.',
    position: 'bottom',
  },
];

interface ProductTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: 'dashboard' | 'tasks' | 'insights' | 'settings') => void;
}

export const ProductTour: React.FC<ProductTourProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[currentStepIndex];

  // Sync tab navigation if step belongs to another tab
  useEffect(() => {
    if (!isOpen) return;

    if (step.targetId === 'tour-tasks' && onNavigateTab) {
      onNavigateTab('tasks');
    } else if (step.targetId === 'tour-insights' && onNavigateTab) {
      onNavigateTab('insights');
    } else if (step.targetId === 'tour-settings' && onNavigateTab) {
      onNavigateTab('settings');
    } else if (onNavigateTab) {
      onNavigateTab('dashboard');
    }

    // Small delay to allow tab render before querying DOM
    const timer = setTimeout(() => {
      const el = document.getElementById(step.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [currentStepIndex, isOpen, step, onNavigateTab]);

  // Window resize handler
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      const el = document.getElementById(step.targetId);
      if (el) setTargetRect(el.getBoundingClientRect());
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen, step]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      localStorage.setItem('sparkstart_tour_completed', 'true');
      if (onNavigateTab) onNavigateTab('dashboard');
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('sparkstart_tour_completed', 'true');
    if (onNavigateTab) onNavigateTab('dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      {/* Dark backdrop */}
      <div
        onClick={handleSkip}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Target element spotlight outline */}
      {targetRect && (
        <div
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
          className="fixed rounded-2xl ring-4 ring-emerald-400 ring-offset-4 ring-offset-black/50 pointer-events-none transition-all duration-300 z-50 animate-pulse"
        />
      )}

      {/* Tour Tooltip Card */}
      <div className="fixed inset-x-4 bottom-6 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 max-w-lg mx-auto z-50">
        <div className="ss-card p-6 sm:p-7 rounded-3xl shadow-2xl border-2 border-[var(--border-accent)] bg-[var(--bg-card)]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider ss-text-muted">
                Step {currentStepIndex + 1} of {TOUR_STEPS.length}
              </span>
            </div>

            <button
              onClick={handleSkip}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
              title="Close Tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Body */}
          <h3 className="text-xl font-black ss-text-primary mb-2 tracking-tight">
            {step.title}
          </h3>
          <p className="ss-body-sm leading-relaxed mb-6">
            {step.content}
          </p>

          {/* Controls Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
            <button
              onClick={handleSkip}
              className="text-xs font-bold ss-text-muted hover:ss-text-primary cursor-pointer px-2 py-1"
            >
              Skip Tour
            </button>

            <div className="flex items-center gap-2">
              {currentStepIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold ss-subtle border border-[var(--border)] ss-text-secondary hover:ss-text-primary transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="ss-btn-primary flex items-center gap-1.5 text-xs sm:text-sm py-2 px-4 cursor-pointer"
              >
                <span>
                  {currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next'}
                </span>
                {currentStepIndex === TOUR_STEPS.length - 1 ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

