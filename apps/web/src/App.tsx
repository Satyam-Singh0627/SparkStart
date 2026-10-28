import React, { useState, useEffect, useRef } from 'react';
import {
  Task,
  EnergyLevel,
  SequenceResponse,
  Preferences,
  DEFAULT_PREFERENCES,
  AppTheme,
  CompanionCharacter,
} from '@sparkstart/shared';

import { Header } from './components/Header';
import { EnergyCheckIn } from './components/EnergyCheckIn';
import { QuickStarter } from './components/QuickStarter';
import { MicroTaskCard } from './components/MicroTaskCard';
import { RestModal } from './components/RestModal';
import { TaskList } from './components/TaskList';
import { InsightsView } from './components/InsightsView';
import { SettingsModal } from './components/SettingsModal';
import { CharacterIllustration } from './components/CharacterIllustration';
import { LandingPage } from './components/LandingPage';
import { ProductTour } from './components/ProductTour';

import {
  fetchHealth,
  fetchTasks,
  createTask,
  markTaskStepDone,
  reopenTask,
  deleteTask,
  requestNextStep,
  requestShrinkStep,
  fetchPreferences,
  savePreferences,
} from './services/api';
import { ArrowRight, BookOpen, ChevronDown, ChevronUp, Sparkles, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#landing') return 'landing';
    return 'app';
  });
  const [tourOpen, setTourOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'insights' | 'settings'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel>('unsure');
  const [currentMicroTask, setCurrentMicroTask] = useState<SequenceResponse | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | undefined>(undefined);
  const [activeTaskTitle, setActiveTaskTitle] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [restModalOpen, setRestModalOpen] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [aiProvider, setAiProvider] = useState<string>('mock');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showAboutDrawer, setShowAboutDrawer] = useState<boolean>(false);

  const taskStarterRef = useRef<HTMLDivElement>(null);

  // Sync hash with view mode
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#landing') setViewMode('landing');
      else if (window.location.hash === '#app') setViewMode('app');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchToApp = () => {
    setViewMode('app');
    window.location.hash = '#app';
  };

  const switchToLanding = () => {
    setViewMode('landing');
    window.location.hash = '#landing';
  };

  const startTour = () => {
    switchToApp();
    setActiveTab('dashboard');
    setTourOpen(true);
  };

  // Initialize theme from preferences or localStorage
  const applyTheme = (theme: AppTheme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sparkstart_theme', theme);
  };

  // Initial load
  useEffect(() => {
    const savedTheme = (localStorage.getItem('sparkstart_theme') as AppTheme) || 'light';
    applyTheme(savedTheme);

    async function loadData() {
      const health = await fetchHealth();
      if (health) {
        setBackendOnline(true);
        setAiProvider(health.aiProvider);
      } else {
        setBackendOnline(false);
      }

      const loadedTasks = await fetchTasks();
      setTasks(loadedTasks);

      const loadedPrefs = await fetchPreferences();
      setPreferences(loadedPrefs);
      if (loadedPrefs.theme) {
        applyTheme(loadedPrefs.theme);
      }
      if (loadedPrefs.defaultEnergy) {
        setSelectedEnergy(loadedPrefs.defaultEnergy);
      }
    }
    loadData();
  }, []);

  const handleThemeChange = (newTheme: AppTheme) => {
    applyTheme(newTheme);
    const updated = { ...preferences, theme: newTheme };
    setPreferences(updated);
    savePreferences(updated);
  };

  const handleCharacterChange = (newChar: CompanionCharacter) => {
    const updated = { ...preferences, character: newChar };
    setPreferences(updated);
    savePreferences(updated);
  };

  // Start Sequencing from QuickStarter
  const handleStartSequencing = async (taskTitle: string, obstacle?: string) => {
    setIsLoading(true);
    try {
      let existing = tasks.find((t) => t.title.toLowerCase() === taskTitle.toLowerCase() && t.status !== 'completed');
      let tId = existing ? existing.id : undefined;

      if (!existing) {
        const created = await createTask(taskTitle, selectedEnergy);
        tId = created.id;
        setTasks((prev) => [created, ...prev]);
      }

      setActiveTaskId(tId);
      setActiveTaskTitle(taskTitle);

      const step = await requestNextStep({
        taskId: tId,
        taskTitle,
        energyLevel: selectedEnergy,
        obstacle,
        preferredDurationMinutes: preferences.preferredStepDurationMinutes,
      });

      setCurrentMicroTask(step);
      setStatusMessage(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Select task from list
  const handleSelectTaskFromList = async (task: Task) => {
    setActiveTab('dashboard');
    setActiveTaskId(task.id);
    setActiveTaskTitle(task.title);
    if (task.energy) {
      setSelectedEnergy(task.energy);
    }

    // Immediately resolve active subtask if already decomposed so UI renders instantly
    const pendingSubtask = task.subtasks?.find((s) => s.status !== 'completed') || (task.currentMicroTask?.status !== 'completed' ? task.currentMicroTask : null);
    if (pendingSubtask) {
      setCurrentMicroTask({
        taskId: task.id,
        stepId: pendingSubtask.id,
        stepOrder: pendingSubtask.stepOrder || 1,
        totalSteps: task.totalStepsCount || task.subtasks?.length || 4,
        actionText: pendingSubtask.actionText,
        suggestedDurationMinutes: pendingSubtask.suggestedDurationMinutes || 2,
        encouragement: pendingSubtask.encouragement || 'Small steps lead to real progress.',
        whyItIsManageable: pendingSubtask.whyItIsManageable || 'Low stakes and quick to complete.',
        alternativeSmallerStep: pendingSubtask.alternativeSmallerStep || 'Open the task and view the title.',
        sourceReferences: pendingSubtask.sourceReferences || [],
        isFallback: pendingSubtask.isFallback || false,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    setIsLoading(true);
    try {
      const step = await requestNextStep({
        taskId: task.id,
        taskTitle: task.title,
        energyLevel: task.energy || selectedEnergy,
        preferredDurationMinutes: preferences.preferredStepDurationMinutes,
      });
      setCurrentMicroTask(step);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Step completed: marks progress, updates database, and advances to next step or celebrates completion
  const handleStepDone = async (stepId?: string) => {
    if (!activeTaskId) {
      setCurrentMicroTask(null);
      return;
    }
    const targetStepId = stepId || currentMicroTask?.stepId;
    try {
      const updated = await markTaskStepDone(activeTaskId, targetStepId);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

      // If the parent task is now marked completed:
      const totalSteps = updated.totalStepsCount ?? (updated.subtasks ? updated.subtasks.length : 0);
      if (updated.status === 'completed' || (totalSteps > 0 && updated.completedStepsCount >= totalSteps)) {
        setCurrentMicroTask(null);
        setStatusMessage(`🎉 Victory! You completed all steps for "${updated.title}". Task moved to Completed.`);
        return;
      }

      setStatusMessage(`Nice work! Step completed. That makes ${updated.completedStepsCount} step(s) done.`);

      // Check if there is an existing incomplete subtask in the updated task
      const nextPendingSubtask = updated.subtasks?.find((s) => s.status !== 'completed');
      if (nextPendingSubtask) {
        setCurrentMicroTask({
          taskId: updated.id,
          stepId: nextPendingSubtask.id,
          stepOrder: nextPendingSubtask.stepOrder || 1,
          totalSteps: totalSteps || 4,
          actionText: nextPendingSubtask.actionText,
          suggestedDurationMinutes: nextPendingSubtask.suggestedDurationMinutes || 2,
          encouragement: nextPendingSubtask.encouragement || 'One more small step done. Keep going!',
          whyItIsManageable: nextPendingSubtask.whyItIsManageable || 'Low stakes and quick to complete.',
          alternativeSmallerStep: nextPendingSubtask.alternativeSmallerStep || 'Open the task and view the title.',
          sourceReferences: nextPendingSubtask.sourceReferences || [],
          isFallback: nextPendingSubtask.isFallback || false,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Otherwise query next step
      setIsLoading(true);
      try {
        const nextStep = await requestNextStep({
          taskId: activeTaskId,
          taskTitle: activeTaskTitle,
          energyLevel: selectedEnergy,
        });
        setCurrentMicroTask(nextStep);
      } catch {
        setCurrentMicroTask(null);
      } finally {
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setCurrentMicroTask(null);
    }
  };

  const handleReopenTask = async (taskId: string) => {
    try {
      const reopened = await reopenTask(taskId);
      setTasks((prev) => prev.map((t) => (t.id === reopened.id ? reopened : t)));
      setStatusMessage(`Reopened "${reopened.title}". Ready whenever you are.`);
      return reopened;
    } catch (err) {
      console.error('Failed to reopen task:', err);
    }
  };

  // Step skip / request alternative option
  const handleSkip = async () => {
    if (!activeTaskTitle) return;
    setIsLoading(true);
    try {
      const altStep = await requestNextStep({
        taskId: activeTaskId,
        taskTitle: activeTaskTitle,
        energyLevel: selectedEnergy,
        obstacle: 'Current step was not a good fit, requested an alternative entry action',
      });
      setCurrentMicroTask(altStep);
      setStatusMessage('Switched to an alternative micro-action. Zero pressure!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Step too big (shrink to 1 min)
  const handleShrink = async () => {
    if (!currentMicroTask) return;
    setIsLoading(true);
    try {
      const shrunk = await requestShrinkStep(
        activeTaskId,
        activeTaskTitle || 'Current Task',
        currentMicroTask.actionText,
        selectedEnergy
      );
      setCurrentMicroTask(shrunk);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRest = () => {
    setRestModalOpen(true);
  };

  const handleDismiss = () => {
    setCurrentMicroTask(null);
    setStatusMessage('No problem at all. We will be here whenever you wish to resume.');
  };

  const handleCreateTaskFromList = async (title: string, energy: EnergyLevel, description?: string) => {
    const created = await createTask(title, energy, description);
    setTasks((prev) => [created, ...prev]);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeTaskId === taskId) {
      setCurrentMicroTask(null);
      setActiveTaskId(undefined);
    }
  };

  const handleSavePreferences = async (newPrefs: Preferences) => {
    const saved = await savePreferences(newPrefs);
    setPreferences(saved);
    if (saved.theme) applyTheme(saved.theme);
  };

  // If public landing page view
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onEnterApp={switchToApp}
          onStartTour={startTour}
          currentTheme={preferences.theme || 'light'}
          onThemeChange={handleThemeChange}
          currentCharacter={preferences.character || 'sprout'}
          onCharacterChange={handleCharacterChange}
        />
        <ProductTour
          isOpen={tourOpen}
          onClose={() => setTourOpen(false)}
          onNavigateTab={setActiveTab}
        />
      </>
    );
  }

  return (
    <div className="ss-page flex flex-col font-sans transition-colors duration-200">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendOnline={backendOnline}
        aiProvider={aiProvider}
        currentTheme={preferences.theme || 'light'}
        onThemeChange={handleThemeChange}
        currentCharacter={preferences.character || 'sprout'}
        onOpenTour={startTour}
        onSwitchToLanding={switchToLanding}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcoming Hero Section */}
            <section className="ss-card p-6 sm:p-9 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full ss-badge-accent text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Adaptive, Low-Pressure Productivity</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold ss-text-primary tracking-tight leading-tight">
                  Progress doesn't have to start big.
                </h2>
                <p className="ss-body max-w-xl">
                  Choose what matters. We'll help you find the smallest manageable next step, at your own pace.
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <button
                    onClick={() => taskStarterRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="ss-btn-primary text-base py-3 px-6 cursor-pointer"
                  >
                    <span>Start a small step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="ss-btn-secondary text-base py-3 px-6 cursor-pointer"
                  >
                    <span>View my tasks</span>
                  </button>
                </div>

                <p className="ss-support text-xs pt-1">
                  You are in complete control of your pace. No streaks, no guilt, no pressure.
                </p>
              </div>

              {/* Character Mascot */}
              <div className="shrink-0 flex flex-col items-center">
                <CharacterIllustration
                  character={preferences.character || 'sprout'}
                  mood={currentMicroTask ? 'encouraging' : 'idle'}
                  size={120}
                />
              </div>
            </section>

            {/* Notification message */}
            {statusMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-sm font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>🌱 {statusMessage}</span>
                <button
                  onClick={() => setStatusMessage(null)}
                  className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline ml-3 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Energy Check-In */}
            <div id="tour-energy">
              <EnergyCheckIn
                selectedEnergy={selectedEnergy}
                onSelectEnergy={(lvl) => setSelectedEnergy(lvl)}
              />
            </div>

            {/* Active Micro-Task Card OR QuickStarter */}
            <div ref={taskStarterRef} id="tour-taskstarter">
              {currentMicroTask ? (
                <div id="tour-microtask" className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold ss-text-muted uppercase tracking-wider">
                      Active Project: {activeTaskTitle}
                    </span>
                    <button
                      onClick={() => setCurrentMicroTask(null)}
                      className="text-xs font-semibold ss-text-muted hover:ss-text-primary underline cursor-pointer"
                    >
                      Change Task
                    </button>
                  </div>
                  <MicroTaskCard
                    microTask={currentMicroTask}
                    onDone={handleStepDone}
                    onShrink={handleShrink}
                    onRest={handleRest}
                    onDismiss={handleDismiss}
                    onSkip={handleSkip}
                    isLoading={isLoading}
                    subtasks={tasks.find((t) => t.id === activeTaskId)?.subtasks}
                  />
                </div>
              ) : (
                <QuickStarter
                  onStartSequencing={handleStartSequencing}
                  isLoading={isLoading}
                  character={preferences.character || 'sprout'}
                />
              )}
            </div>

            {/* Saved Tasks Snapshot */}
            {tasks.length > 0 && (
              <section className="ss-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold ss-text-primary">
                    Saved Projects ({tasks.filter((t) => t.status !== 'completed').length} active)
                  </h3>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-xs font-bold text-[var(--accent)] hover:underline cursor-pointer"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tasks.slice(0, 4).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleSelectTaskFromList(task)}
                      className="p-4 rounded-xl border border-[var(--border)] hover:border-[var(--border-accent)] hover:bg-[var(--bg-hover)] transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <h4 className="text-sm font-bold ss-text-primary line-clamp-1">{task.title}</h4>
                        <span className="text-xs ss-text-muted mt-0.5 block">
                          {task.completedStepsCount} {task.completedStepsCount === 1 ? 'step' : 'steps'} done
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[var(--accent)] bg-[var(--accent-light)] px-3 py-1.5 rounded-lg">
                        Next &rarr;
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Collapsible About & Psychological Foundations Drawer */}
            <div className="border-t border-[var(--border)] pt-4">
              <button
                onClick={() => setShowAboutDrawer(!showAboutDrawer)}
                className="flex items-center justify-between w-full py-2 text-xs font-bold ss-text-muted hover:ss-text-primary transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                  <span>How SparkStart & SparkBuddy Work (Psychological Foundations & Privacy Model)</span>
                </span>
                {showAboutDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAboutDrawer && (
                <div className="mt-3 p-5 rounded-2xl ss-subtle border border-[var(--border)] text-xs space-y-3">
                  <p className="ss-body-sm">
                    <strong>SparkStart</strong> is built for people who occasionally struggle with task paralysis, cognitive freeze, or ADHD executive dysfunction. Rather than demanding full projects up front, it uses <em>single-target scaffolding</em> to offer one tiny, low-stakes starter action.
                  </p>
                  <p className="ss-body-sm">
                    <strong>SparkBuddy</strong> is the desktop companion that floats beside your editor or browser to keep your focus anchored. All data stays in your local SQLite database without cloud tracking.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div id="tour-tasks">
            <TaskList
              tasks={tasks}
              onSelectTask={handleSelectTaskFromList}
              onCreateTask={handleCreateTaskFromList}
              onDeleteTask={handleDeleteTask}
              onMarkDone={handleStepDone}
              onReopenTask={handleReopenTask}
            />
          </div>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === 'insights' && (
          <div id="tour-insights">
            <InsightsView tasks={tasks} preferences={preferences} />
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div id="tour-settings">
            <SettingsModal
              preferences={preferences}
              onSavePreferences={handleSavePreferences}
              aiProvider={aiProvider}
              onThemeChange={handleThemeChange}
              onCharacterChange={handleCharacterChange}
            />
          </div>
        )}
      </main>

      {/* Rest Break Modal */}
      <RestModal isOpen={restModalOpen} onClose={() => setRestModalOpen(false)} />

      {/* Interactive Guided Tour */}
      <ProductTour
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
        onNavigateTab={setActiveTab}
      />

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6 text-center text-xs ss-text-muted">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SparkStart & SparkBuddy • Small steps. Real progress.</span>
          <div className="flex items-center gap-3">
            <button onClick={switchToLanding} className="hover:text-[var(--accent)] cursor-pointer">
              Product Overview
            </button>
            <button onClick={startTour} className="hover:text-[var(--accent)] cursor-pointer">
              Guided Tour
            </button>
            <span>100% Local SQLite • Privacy-First</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
