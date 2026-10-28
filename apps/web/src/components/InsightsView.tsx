import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  BatteryMedium,
  BookOpen,
  Info,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { Task, Preferences } from '@sparkstart/shared';

interface InsightsViewProps {
  tasks: Task[];
  preferences: Preferences;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ tasks, preferences }) => {
  const totalCompletedSteps = tasks.reduce((acc, t) => acc + (t.completedStepsCount || 0), 0);
  const totalCompletedTasks = tasks.filter((t) => t.status === 'completed').length;
  const activeTasksCount = tasks.filter((t) => t.status !== 'completed').length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold ss-text-primary tracking-tight">
          Productivity Insights & Scaffolding
        </h2>
        <p className="ss-support mt-1">
          Honest descriptive observations without shame mechanics, streaks, or judgment. All data remains strictly on your local device.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="ss-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider ss-text-muted">
              Completed Micro-Steps
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold ss-text-primary">{totalCompletedSteps}</div>
          <p className="text-xs font-semibold text-[var(--accent)] mt-2">
            Every tiny step lowers psychological inertia.
          </p>
        </div>

        <div className="ss-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider ss-text-muted">
              Preferred Step Size
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold ss-text-primary">
            {preferences.preferredStepDurationMinutes} Mins
          </div>
          <p className="text-xs font-semibold text-blue-600 mt-2">
            Designed for frictionless initiation.
          </p>
        </div>

        <div className="ss-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider ss-text-muted">
              Active Projects
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
              <BatteryMedium className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold ss-text-primary">{activeTasksCount}</div>
          <p className="text-xs font-semibold text-purple-600 mt-2">
            {totalCompletedTasks} projects completed so far.
          </p>
        </div>
      </div>

      {/* Psychological Foundations / Grounded Science */}
      <div className="ss-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-[var(--accent)]" />
          <h3 className="text-xl font-extrabold ss-text-primary">
            The Evidence-Based Approach Behind SparkStart
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl ss-subtle p-5 border border-[var(--border)]">
            <h4 className="text-sm font-bold ss-text-primary mb-1.5 flex items-center gap-2">
              <span>🎯</span>
              <span>Single-Target Scaffolding (Sweller, 1988)</span>
            </h4>
            <p className="ss-body-sm">
              Working memory is saturated by long to-do lists. SparkStart eliminates cognitive freeze by displaying exactly one physical starter action at a time.
            </p>
          </div>

          <div className="rounded-2xl ss-subtle p-5 border border-[var(--border)]">
            <h4 className="text-sm font-bold ss-text-primary mb-1.5 flex items-center gap-2">
              <span>⚡</span>
              <span>Threshold Reduction (Gollwitzer, 1999)</span>
            </h4>
            <p className="ss-body-sm">
              Task friction peaks before engagement begins. A 2-minute starter action ("Open file and read the first requirement") breaks activation inertia.
            </p>
          </div>

          <div className="rounded-2xl ss-subtle p-5 border border-[var(--border)]">
            <h4 className="text-sm font-bold ss-text-primary mb-1.5 flex items-center gap-2">
              <span>🧸</span>
              <span>Point-of-Performance Support (Barkley, 1997)</span>
            </h4>
            <p className="ss-body-sm">
              SparkBuddy provides a friendly, in-situ floating companion right where work happens, bridging the intention-action gap without stealing keyboard focus.
            </p>
          </div>

          <div className="rounded-2xl ss-subtle p-5 border border-[var(--border)]">
            <h4 className="text-sm font-bold ss-text-primary mb-1.5 flex items-center gap-2">
              <span>☕</span>
              <span>Non-Punitive Recovery (Sonnentag, 2003)</span>
            </h4>
            <p className="ss-body-sm">
              Forced focus when exhausted causes burnout. Guilt-free breaks restore cognitive bandwidth with zero streak resets or negative scores.
            </p>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-4 rounded-2xl ss-subtle border border-[var(--border)] flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <p className="ss-support text-xs">
            <strong>Educational & Scaffolding Notice:</strong> SparkStart and SparkBuddy are personal pacing and scaffolding tools. They are not medical, diagnostic, or clinical instruments, and do not diagnose ADHD, autism, anxiety, or executive dysfunction.
          </p>
        </div>
      </div>
    </div>
  );
};
