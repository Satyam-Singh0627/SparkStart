import React, { useState } from 'react';
import { ArrowRight, Loader2, Sparkles, Compass, HelpCircle } from 'lucide-react';
import { CompanionCharacter } from '@sparkstart/shared';
import { CharacterIllustration } from './CharacterIllustration';

interface QuickStarterProps {
  onStartSequencing: (taskTitle: string, obstacle?: string) => Promise<void>;
  isLoading: boolean;
  character: CompanionCharacter;
}

const COMMON_OBSTACLES = [
  "I don't know where to begin",
  "It feels too large",
  "I'm low on energy",
  "I'm worried about doing it wrong",
  "I'm distracted",
  "Something else",
];

const EXAMPLE_TASKS = [
  'Start my course assignment',
  'Apply for summer internship',
  'Organize project notes',
  'Reply to an important email',
  'Review Chapter 3 lecture slides',
];

export const QuickStarter: React.FC<QuickStarterProps> = ({
  onStartSequencing,
  isLoading,
  character,
}) => {
  const [title, setTitle] = useState('');
  const [obstacle, setObstacle] = useState('');
  const [showObstacleField, setShowObstacleField] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isLoading) return;
    onStartSequencing(title.trim(), obstacle.trim() || undefined);
  };

  return (
    <section className="ss-card p-6 sm:p-8 relative">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <CharacterIllustration
          character={character}
          mood={isLoading ? 'thinking' : title ? 'encouraging' : 'idle'}
          size={100}
          className="shrink-0 hidden sm:inline-flex"
        />

        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold ss-badge-accent mb-2">
            <Compass className="w-4 h-4" />
            <span>Friction-Free Task Starter</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold ss-text-primary tracking-tight">
            What are you thinking of tackling?
          </h2>
          <p className="ss-body-sm mt-1 max-w-xl">
            You don't need to finish it today. Just enter the task and SparkBuddy will find one manageable 2-minute starter action.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-starter-input" className="block text-sm font-bold ss-text-secondary mb-1.5">
            Task or Project Name
          </label>
          <input
            id="task-starter-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Complete DBMS assignment, Study control systems, React project..."
            className="ss-input text-base sm:text-lg py-3.5 px-4 font-medium"
            disabled={isLoading}
          />
        </div>

        {/* Optional Obstacle Selector */}
        <div className="text-left">
          {!showObstacleField ? (
            <button
              type="button"
              onClick={() => setShowObstacleField(true)}
              className="text-sm font-semibold ss-text-muted hover:ss-text-primary underline flex items-center gap-1.5 cursor-pointer py-1"
            >
              <HelpCircle className="w-4 h-4 text-[var(--accent)]" />
              <span>Have a specific hurdle or mental block? (Optional)</span>
            </button>
          ) : (
            <div className="pt-2 ss-subtle p-4 rounded-xl border border-[var(--border)] space-y-2.5">
              <label className="block text-sm font-bold ss-text-secondary">
                What makes this feel hard right now?
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_OBSTACLES.map((obs) => (
                  <button
                    type="button"
                    key={obs}
                    onClick={() => setObstacle(obs)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      obstacle === obs
                        ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]'
                        : 'border-[var(--border)] bg-[var(--bg-card)] ss-text-secondary hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    {obs}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={obstacle}
                onChange={(e) => setObstacle(e.target.value)}
                placeholder="Or describe what's in your way..."
                className="ss-input text-sm py-2 px-3 mt-2"
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        {/* Suggestions & Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Example Quick Clicks */}
          <div className="flex flex-wrap items-center gap-2 self-start text-xs ss-text-muted">
            <span className="font-semibold text-xs ss-text-muted">Try:</span>
            {EXAMPLE_TASKS.map((taskName) => (
              <button
                type="button"
                key={taskName}
                onClick={() => setTitle(taskName)}
                className="px-2.5 py-1 rounded-lg ss-subtle hover:bg-[var(--bg-hover)] border border-[var(--border)] text-xs font-medium cursor-pointer transition-colors"
              >
                {taskName}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!title.trim() || isLoading}
            className="ss-btn-primary w-full sm:w-auto text-base py-3.5 px-7 shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sequencing Next Step...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Find My Next Step</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
