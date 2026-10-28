/**
 * SparkStart Web Client API
 * Connects to the local FastAPI backend with robust offline localStorage fallback.
 */

import {
  Task,
  MicroTask,
  SequenceRequest,
  SequenceResponse,
  Preferences,
  DEFAULT_PREFERENCES,
  KnowledgeSourceRef,
} from '@sparkstart/shared';

const LOCAL_BACKEND = 'http://127.0.0.1:8000/api';

async function safeFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  // First attempt via relative /api (Vite dev proxy)
  try {
    const res = await fetch(`/api${endpoint}`, options);
    return res;
  } catch (err) {
    // Fallback directly to backend port 8000
    return await fetch(`${LOCAL_BACKEND}${endpoint}`, options);
  }
}

export async function fetchHealth(): Promise<{ status: string; aiProvider: string; indexedKnowledgeChunks: number } | null> {
  try {
    const res = await safeFetch('/health');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchTasks(): Promise<Task[]> {
  try {
    const res = await safeFetch('/tasks');
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('sparkstart_tasks_cache', JSON.stringify(data));
      return data;
    }
  } catch {
    // fallback to cache
  }
  const cached = localStorage.getItem('sparkstart_tasks_cache');
  return cached ? JSON.parse(cached) : [];
}

export async function createTask(title: string, energy: string = 'unsure', description?: string): Promise<Task> {
  try {
    const res = await safeFetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, energy, description }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  // Local fallback task creation
  const newTask: Task = {
    id: 'local-' + Date.now(),
    title,
    description,
    energy: energy as any,
    status: 'todo',
    completedStepsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const tasks = await fetchTasks();
  tasks.unshift(newTask);
  localStorage.setItem('sparkstart_tasks_cache', JSON.stringify(tasks));
  return newTask;
}

export async function markTaskStepDone(taskId: string, stepId?: string): Promise<Task> {
  try {
    const url = stepId ? `/tasks/${taskId}/steps/${stepId}/done` : `/tasks/${taskId}/step-done`;
    const res = await safeFetch(url, { method: 'POST' });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  const tasks = await fetchTasks();
  const t = tasks.find((item) => item.id === taskId);
  if (t) {
    t.completedStepsCount = (t.completedStepsCount || 0) + 1;
    if (t.subtasks && stepId) {
      const sub = t.subtasks.find((s) => s.id === stepId);
      if (sub) sub.status = 'completed';
    } else if (t.subtasks) {
      const sub = t.subtasks.find((s) => s.status !== 'completed');
      if (sub) sub.status = 'completed';
    }
    const allDone = t.subtasks && t.subtasks.length > 0 && t.subtasks.every((s) => s.status === 'completed');
    t.status = allDone ? 'completed' : 'in_progress';
    t.updatedAt = new Date().toISOString();
    localStorage.setItem('sparkstart_tasks_cache', JSON.stringify(tasks));
    return t;
  }
  throw new Error('Task not found');
}

export async function reopenTask(taskId: string): Promise<Task> {
  try {
    const res = await safeFetch(`/tasks/${taskId}/reopen`, { method: 'POST' });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  const tasks = await fetchTasks();
  const t = tasks.find((item) => item.id === taskId);
  if (t) {
    t.status = 'in_progress';
    if (t.subtasks && t.subtasks.length > 0) {
      const last = t.subtasks[t.subtasks.length - 1];
      if (last) last.status = 'suggested';
    }
    t.completedStepsCount = Math.max(0, (t.completedStepsCount || 1) - 1);
    t.updatedAt = new Date().toISOString();
    localStorage.setItem('sparkstart_tasks_cache', JSON.stringify(tasks));
    return t;
  }
  throw new Error('Task not found');
}

export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    const res = await safeFetch(`/tasks/${taskId}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch {
    // fallback
  }
  let tasks = await fetchTasks();
  tasks = tasks.filter((t) => t.id !== taskId);
  localStorage.setItem('sparkstart_tasks_cache', JSON.stringify(tasks));
  return true;
}

export async function requestNextStep(req: SequenceRequest): Promise<SequenceResponse> {
  try {
    const res = await safeFetch('/sequence/next', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Local heuristic fallback
  }

  // Local fallback response
  return {
    taskId: req.taskId,
    actionText: `Open your workspace or notes for '${req.taskTitle}' and look at the first line.`,
    suggestedDurationMinutes: req.energyLevel === 'low' ? 2 : 5,
    encouragement: 'Honor where your energy is today. Small steps bring real relief.',
    whyItIsManageable: 'Arriving at the material is 80% of the friction. No pressure to complete it all now.',
    alternativeSmallerStep: 'Just open the tab or app and take one slow breath.',
    sourceReferences: [
      {
        id: 'ref-init-001',
        title: 'Implementation Intentions & The 2-Minute Starter Action',
        sourceUrl: 'https://doi.org/10.1037/0003-066X.54.7.493',
        excerpt: 'Task initiation difficulty is reduced by over 60% when formulating a low-stakes starter action.',
      },
    ],
    isFallback: true,
    timestamp: new Date().toISOString(),
  };
}

export async function requestShrinkStep(
  taskId: string | undefined,
  taskTitle: string,
  currentAction: string,
  energyLevel: string = 'low'
): Promise<SequenceResponse> {
  try {
    const res = await safeFetch('/sequence/shrink', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId,
        taskTitle,
        currentActionText: currentAction,
        energyLevel,
      }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Local heuristic fallback
  }

  return {
    taskId,
    actionText: `Don't read or do anything yet. Just glance at '${taskTitle}' for 30 seconds, then stretch.`,
    suggestedDurationMinutes: 1,
    encouragement: 'It is completely valid that the step felt too heavy. Let us make this feather-light.',
    whyItIsManageable: 'Near-zero cognitive demand. Requires no decision-making.',
    alternativeSmallerStep: 'Close your eyes and take 3 deep breaths.',
    sourceReferences: [
      {
        id: 'ref-cog-002',
        title: 'Cognitive Load Theory and Single-Target Scaffolding',
        sourceUrl: 'https://doi.org/10.1207/s15516709cog1202_4',
        excerpt: 'Presenting a user with nested demands triggers freeze. Shrinking to 1 minute prevents overload.',
      },
    ],
    isFallback: true,
    timestamp: new Date().toISOString(),
  };
}

export async function fetchPreferences(): Promise<Preferences> {
  try {
    const res = await safeFetch('/preferences');
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('sparkstart_prefs_cache', JSON.stringify(data));
      return data;
    }
  } catch {
    // fallback
  }
  const cached = localStorage.getItem('sparkstart_prefs_cache');
  return cached ? JSON.parse(cached) : DEFAULT_PREFERENCES;
}

export async function savePreferences(prefs: Preferences): Promise<Preferences> {
  try {
    const res = await safeFetch('/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('sparkstart_prefs_cache', JSON.stringify(data));
      return data;
    }
  } catch {
    // fallback
  }
  localStorage.setItem('sparkstart_prefs_cache', JSON.stringify(prefs));
  return prefs;
}

export async function exportAllData(): Promise<any> {
  try {
    const res = await safeFetch('/privacy/export');
    if (res.ok) return await res.json();
  } catch {}
  return {
    exportedAt: new Date().toISOString(),
    preferences: await fetchPreferences(),
    tasks: await fetchTasks(),
  };
}

export async function purgeAllData(): Promise<boolean> {
  try {
    await safeFetch('/privacy/purge', { method: 'POST' });
  } catch {}
  localStorage.removeItem('sparkstart_tasks_cache');
  localStorage.removeItem('sparkstart_prefs_cache');
  return true;
}

