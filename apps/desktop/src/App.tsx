import React, { useState, useEffect } from 'react';
import { Minus, X, Settings, Sparkles, Coffee } from 'lucide-react';
import { CharacterIllustration, CompanionMood } from './components/CharacterIllustration';
import { CompanionBubble } from './components/CompanionBubble';
import { MiniQuickTask } from './components/MiniQuickTask';
import { MiniRestTimer } from './components/MiniRestTimer';
import { MiniSettings } from './components/MiniSettings';
import { SequenceResponse, EnergyLevel, CompanionCharacter } from '@sparkstart/shared';

declare global {
  interface Window {
    sparkBuddyAPI?: {
      minimize: () => Promise<void>;
      hide: () => Promise<void>;
      close: () => Promise<void>;
      toggleAlwaysOnTop: () => Promise<boolean>;
      sendNotification: (options: {
        title: string;
        body: string;
        quietStart?: string;
        quietEnd?: string;
      }) => Promise<boolean>;
    };
  }
}

const API_BASE = 'http://127.0.0.1:8000/api';

export const App: React.FC = () => {
  const [mood, setMood] = useState<CompanionMood>('idle');
  const [character, setCharacter] = useState<CompanionCharacter>('sprout');
  const [activeTaskTitle, setActiveTaskTitle] = useState<string>('DBMS Assignment');
  const [currentMicroTask, setCurrentMicroTask] = useState<SequenceResponse | null>(null);
  const [viewState, setViewState] = useState<'bubble' | 'input' | 'rest' | 'settings'>('bubble');
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load preferences from backend or localStorage
  useEffect(() => {
    async function loadPrefs() {
      try {
        const res = await fetch(`${API_BASE}/preferences`);
        if (res.ok) {
          const data = await res.json();
          if (data.character) setCharacter(data.character);
        }
      } catch {
        const localChar = localStorage.getItem('sparkbuddy_char') as CompanionCharacter;
        if (localChar) setCharacter(localChar);
      }
    }
    loadPrefs();

    setCurrentMicroTask({
      taskId: 'init-task',
      actionText: "Open your workspace or editor. Just look at the first line without writing anything.",
      suggestedDurationMinutes: 2,
      encouragement: "Small steps. Take a slow breath, you're doing great.",
      whyItIsManageable: "Sensory contact breaks the initial friction of task initiation.",
      alternativeSmallerStep: "Just click open the application and stretch your arms.",
      sourceReferences: [],
      isFallback: true,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const handleSelectCharacter = (char: CompanionCharacter) => {
    setCharacter(char);
    localStorage.setItem('sparkbuddy_char', char);
    fetch(`${API_BASE}/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character: char }),
    }).catch(() => {});
  };

  const handleStartTask = async (title: string, energy: EnergyLevel) => {
    setIsLoading(true);
    setMood('thinking');
    setActiveTaskTitle(title);

    try {
      const res = await fetch(`${API_BASE}/sequence/next`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: title,
          energyLevel: energy,
          preferredDurationMinutes: energy === 'low' ? 2 : 5,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentMicroTask(data);
        setMood('encouraging');
        setViewState('bubble');
        window.sparkBuddyAPI?.sendNotification({
          title: 'SparkBuddy',
          body: `Next step for '${title}': ${data.actionText}`,
        });
        return;
      }
    } catch {
      // Local heuristic fallback
    }

    setCurrentMicroTask({
      taskId: 'local-' + Date.now(),
      actionText: `Open '${title}' and read just the title and first requirement.`,
      suggestedDurationMinutes: energy === 'low' ? 2 : 5,
      encouragement: "Small steps. Real progress.",
      whyItIsManageable: "No pressure to solve it all right now. Just arrive at the material.",
      alternativeSmallerStep: "Take 3 deep breaths and look at the screen.",
      sourceReferences: [],
      isFallback: true,
      timestamp: new Date().toISOString(),
    });
    setMood('encouraging');
    setViewState('bubble');
    setIsLoading(false);
  };

  const handleDone = () => {
    setMood('celebrating');
    setTimeout(() => {
      setMood('idle');
      setCurrentMicroTask(null);
      setViewState('input');
    }, 1200);
  };

  const handleShrink = async () => {
    if (!currentMicroTask) return;
    setIsLoading(true);
    setMood('thinking');

    try {
      const res = await fetch(`${API_BASE}/sequence/shrink`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: activeTaskTitle,
          currentActionText: currentMicroTask.actionText,
          energyLevel: 'low',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentMicroTask(data);
        setMood('encouraging');
        setIsLoading(false);
        return;
      }
    } catch {}

    setCurrentMicroTask({
      ...currentMicroTask,
      actionText: `Don't do any work yet. Just look at '${activeTaskTitle}' for 30 seconds, then close your eyes.`,
      suggestedDurationMinutes: 1,
      whyItIsManageable: "Near-zero demand step to dissolve activation freeze.",
    });
    setMood('encouraging');
    setIsLoading(false);
  };

  const handleRest = () => {
    setMood('resting');
    setViewState('rest');
  };

  const handleSnooze = () => {
    setViewState('input');
    setMood('idle');
    window.sparkBuddyAPI?.sendNotification({
      title: 'SparkBuddy Snoozed',
      body: 'Take your time. Will check back gently later.',
    });
  };

  const handleDismiss = () => {
    setCurrentMicroTask(null);
    setViewState('input');
    setMood('idle');
  };

  const handleToggleAlwaysOnTop = async () => {
    if (window.sparkBuddyAPI) {
      const state = await window.sparkBuddyAPI.toggleAlwaysOnTop();
      setIsAlwaysOnTop(state);
    } else {
      setIsAlwaysOnTop(!isAlwaysOnTop);
    }
  };

  return (
    <div className="w-[360px] h-[520px] flex flex-col justify-between p-3 select-none">
      {/* Top Drag Header Bar */}
      <div className="drag-handle flex items-center justify-between px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-emerald-100 shadow-sm cursor-move">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-700 tracking-tight">
            Spark<span className="text-emerald-600">Buddy</span>
          </span>
        </div>

        <div className="no-drag flex items-center gap-1">
          <button
            onClick={() => setViewState(viewState === 'settings' ? 'bubble' : 'settings')}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 cursor-pointer"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => window.sparkBuddyAPI?.minimize()}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => window.sparkBuddyAPI?.close()}
            className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 cursor-pointer"
            title="Quit SparkBuddy"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Dialogue / Action Panel */}
      <div className="flex-1 flex flex-col justify-center my-2">
        {viewState === 'bubble' && currentMicroTask && (
          <CompanionBubble
            microTask={currentMicroTask}
            onDone={handleDone}
            onShrink={handleShrink}
            onRest={handleRest}
            onSnooze={handleSnooze}
            onDismiss={handleDismiss}
            isLoading={isLoading}
          />
        )}

        {viewState === 'input' && (
          <MiniQuickTask onStart={handleStartTask} isLoading={isLoading} />
        )}

        {viewState === 'rest' && (
          <MiniRestTimer
            onClose={() => {
              setViewState('bubble');
              setMood('idle');
            }}
          />
        )}

        {viewState === 'settings' && (
          <MiniSettings
            onClose={() => setViewState(currentMicroTask ? 'bubble' : 'input')}
            isAlwaysOnTop={isAlwaysOnTop}
            onToggleAlwaysOnTop={handleToggleAlwaysOnTop}
            onQuit={() => window.sparkBuddyAPI?.close()}
            currentCharacter={character}
            onSelectCharacter={handleSelectCharacter}
          />
        )}
      </div>

      {/* Mascot Cartoon Mascot in Bottom Center */}
      <div className="flex flex-col items-center">
        <CharacterIllustration
          character={character}
          mood={mood}
          size={120}
          onClick={() => {
            if (viewState === 'bubble') setViewState('input');
            else setViewState('bubble');
          }}
        />
        <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
          {mood === 'resting' ? 'Resting peacefully...' : mood === 'celebrating' ? 'Small win! ✨' : 'Click to interact'}
        </span>
      </div>
    </div>
  );
};
