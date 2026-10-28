const API_BASE = 'http://127.0.0.1:8000/api';

const starterView = document.getElementById('starterView');
const stepView = document.getElementById('stepView');
const restView = document.getElementById('restView');
const taskInput = document.getElementById('taskInput');
const findStepBtn = document.getElementById('findStepBtn');
const stepAction = document.getElementById('stepAction');
const stepWhy = document.getElementById('stepWhy');
const stepDuration = document.getElementById('stepDuration');
const doneBtn = document.getElementById('doneBtn');
const tooBigBtn = document.getElementById('tooBigBtn');
const restBtn = document.getElementById('restBtn');
const dismissBtn = document.getElementById('dismissBtn');
const endRestBtn = document.getElementById('endRestBtn');
const statusBadge = document.getElementById('statusBadge');

let currentTask = '';
let currentStep = null;

// Load saved state from chrome.storage or localStorage
async function loadState() {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['sparkstart_ext_step', 'sparkstart_ext_task'], (res) => {
      if (res.sparkstart_ext_step) {
        showStep(res.sparkstart_ext_task || '', res.sparkstart_ext_step);
      }
    });
  } else {
    const saved = localStorage.getItem('sparkstart_ext_step');
    if (saved) {
      showStep(localStorage.getItem('sparkstart_ext_task') || '', JSON.parse(saved));
    }
  }

  // Check backend health
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      statusBadge.textContent = 'Backend Online';
      statusBadge.style.color = '#16a34a';
    }
  } catch {
    statusBadge.textContent = 'Offline Heuristic';
    statusBadge.style.color = '#d97706';
  }
}

function saveState(task, step) {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ sparkstart_ext_task: task, sparkstart_ext_step: step });
  } else {
    localStorage.setItem('sparkstart_ext_task', task);
    localStorage.setItem('sparkstart_ext_step', JSON.stringify(step));
  }
}

function clearState() {
  currentStep = null;
  currentTask = '';
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.remove(['sparkstart_ext_step', 'sparkstart_ext_task']);
  } else {
    localStorage.removeItem('sparkstart_ext_step');
    localStorage.removeItem('sparkstart_ext_task');
  }
  stepView.classList.add('hidden');
  restView.classList.add('hidden');
  starterView.classList.remove('hidden');
}

function showStep(task, step) {
  currentTask = task;
  currentStep = step;
  stepAction.textContent = step.actionText;
  stepWhy.textContent = step.whyItIsManageable || 'Manageable starter action designed for low psychological friction.';
  stepDuration.textContent = `~${step.suggestedDurationMinutes || 2}m`;
  starterView.classList.add('hidden');
  restView.classList.add('hidden');
  stepView.classList.remove('hidden');
  saveState(task, step);
}

// Request Next Step
findStepBtn.addEventListener('click', async () => {
  const task = taskInput.value.trim();
  if (!task) return;

  findStepBtn.disabled = true;
  findStepBtn.textContent = 'Sequencing...';

  try {
    const res = await fetch(`${API_BASE}/sequence/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskTitle: task,
        energyLevel: 'low',
        preferredDurationMinutes: 2,
      }),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      showStep(task, data);
      findStepBtn.disabled = false;
      findStepBtn.textContent = 'Find My Next Step ✨';
      return;
    }
  } catch {}

  // Offline fallback
  const fallbackStep = {
    actionText: `Open '${task}' and read just the title and first line.`,
    suggestedDurationMinutes: 2,
    whyItIsManageable: 'Friction-free starter action to dissolve task freeze.',
  };
  showStep(task, fallbackStep);
  findStepBtn.disabled = false;
  findStepBtn.textContent = 'Find My Next Step ✨';
});

// Too Big (Shrink)
tooBigBtn.addEventListener('click', async () => {
  if (!currentStep) return;
  tooBigBtn.disabled = true;
  tooBigBtn.textContent = 'Shrinking...';

  try {
    const res = await fetch(`${API_BASE}/sequence/shrink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskTitle: currentTask,
        currentActionText: currentStep.actionText,
        energyLevel: 'low',
      }),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      showStep(currentTask, data);
      tooBigBtn.disabled = false;
      tooBigBtn.textContent = 'Too Big';
      return;
    }
  } catch {}

  // Offline shrink
  const shrunk = {
    actionText: `Just look at '${currentTask}' for 30 seconds without writing anything.`,
    suggestedDurationMinutes: 1,
    whyItIsManageable: 'Near-zero cognitive demand. Overcomes task paralysis.',
  };
  showStep(currentTask, shrunk);
  tooBigBtn.disabled = false;
  tooBigBtn.textContent = 'Too Big';
});

// Done button
doneBtn.addEventListener('click', () => {
  doneBtn.textContent = 'Small Win! ✨';
  setTimeout(() => {
    doneBtn.textContent = 'Done! ✨';
    clearState();
  }, 900);
});

// Rest button
restBtn.addEventListener('click', () => {
  stepView.classList.add('hidden');
  starterView.classList.add('hidden');
  restView.classList.remove('hidden');
});

endRestBtn.addEventListener('click', () => {
  restView.classList.add('hidden');
  if (currentStep) {
    stepView.classList.remove('hidden');
  } else {
    starterView.classList.remove('hidden');
  }
});

// Dismiss button
dismissBtn.addEventListener('click', () => {
  clearState();
});

// Initialize on load
loadState();

