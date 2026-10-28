import React, { useEffect, useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, X, Sparkles, Check } from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  content: string;
  preferredPosition?: 'top' | 'bottom';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-energy',
    title: '1. Capacity Check-In',
    content:
      'Check in with how you feel right now. Low energy gives you a 1–3 min starter action; higher energy opens up a 10–12 min focus block. No pressure or judgment.',
    preferredPosition: 'bottom',
  },
  {
    targetId: 'tour-taskstarter',
    title: '2. Low-Friction Task Starter',
    content:
      'Type any goal or assignment that feels heavy. SparkStart automatically decomposes it into 3 to 4 sequential, non-threatening micro-steps.',
    preferredPosition: 'bottom',
  },
  {
    targetId: 'tour-microtask',
    title: '3. Immediate Next Action',
    content:
      'Instead of a 20-item checklist inducing freeze, you see ONE clear next action with estimated duration and psychological reasons why it is manageable.',
    preferredPosition: 'top',
  },
  {
    targetId: 'tour-controls',
    title: '4. Adaptive Pacing Controls',
    content:
      'Step too big? Click "Too Big" to shrink it to 60 seconds. Need a pause? Choose "Guilt-Free Rest". Zero guilt, zero penalties, no broken streaks.',
    preferredPosition: 'bottom',
  },
  {
    targetId: 'tour-tasks',
    title: '5. My Tasks & Step Progression',
    content:
      'Track all your goals, sequential micro-steps, and completed victories. Click "Continue" to jump straight into the next step anytime.',
    preferredPosition: 'bottom',
  },
  {
    targetId: 'tour-settings',
    title: '6. Themes & Companion Personalization',
    content:
      'Personalize your companion (Sprout, Panda, Fox, Cat, Cloud, Robot) and switch across 6 distinct accessible themes (Paper & Sage, Midnight Pulse, Forest Canopy, Lavender Haze, Sunlit Terracotta, Ink & Lime).',
    preferredPosition: 'bottom',
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

  // Navigate to appropriate tab when step requires it
  useEffect(() => {
    if (!isOpen) return;

    if (step.targetId === 'tour-tasks' && onNavigateTab) {
      onNavigateTab('tasks');
    } else if (step.targetId === 'tour-settings' && onNavigateTab) {
      onNavigateTab('settings');
    } else if (onNavigateTab) {
      onNavigateTab('dashboard');
    }

    const timer = setTimeout(() => {
      const el = document.getElementById(step.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [currentStepIndex, isOpen, step, onNavigateTab]);

  // Recalculate on window resize & scroll
  useEffect(() => {
    if (!isOpen) return;
    const updatePosition = () => {
      const el = document.getElementById(step.targetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
    };
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
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

  // Calculate dynamic card positioning anchored near targetRect
  const tooltipStyle = useMemo<React.CSSProperties>(() => {
    if (!targetRect || typeof window === 'undefined') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const cardW = Math.min(480, viewportW - 32);

    // Compute horizontal center aligned with element, clamped to viewport
    let leftPos = targetRect.left + targetRect.width / 2 - cardW / 2;
    leftPos = Math.max(16, Math.min(leftPos, viewportW - cardW - 16));

    // Place below element if space allows, otherwise place above
    const spaceBelow = viewportH - targetRect.bottom;
    const spaceAbove = targetRect.top;

    if (spaceBelow > 260 || spaceBelow > spaceAbove) {
      const topPos = Math.min(targetRect.bottom + 16, viewportH - 280);
      return {
        position: 'fixed',
        top: `${Math.max(16, topPos)}px`,
        left: `${leftPos}px`,
        width: `${cardW}px`,
      };
    } else {
      const bottomPos = Math.min(viewportH - targetRect.top + 16, viewportH - 280);
      return {
        position: 'fixed',
        bottom: `${Math.max(16, bottomPos)}px`,
        left: `${leftPos}px`,
        width: `${cardW}px`,
      };
    }
  }, [targetRect]);

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
          className="fixed rounded-2xl ring-4 ring-[var(--accent)] ring-offset-4 ring-offset-black/50 pointer-events-none transition-all duration-300 z-50 animate-pulse shadow-2xl"
        />
      )}

      {/* Tour Tooltip Card anchored near target */}
      <div style={tooltipStyle} className="fixed z-50 transition-all duration-300">
        <div className="ss-card p-6 sm:p-7 rounded-3xl shadow-2xl border-2 border-[var(--border-accent)] bg-[var(--bg-card)]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider ss-text-muted">
                Step {currentStepIndex + 1} of {TOUR_STEPS.length}
              </span>
            </div>

            <button
              onClick={handleSkip}
              className="p-1 rounded-lg ss-text-muted hover:ss-text-primary hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
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
