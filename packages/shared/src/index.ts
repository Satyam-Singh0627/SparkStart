/**
 * SparkStart & SparkBuddy - Shared Domain Models & Types
 * Autonomous, adaptive, low-pressure productivity architecture.
 */

export type EnergyLevel = 'low' | 'medium' | 'high' | 'unsure';

export interface EnergyOption {
  value: EnergyLevel;
  label: string;
  description: string;
  emoji: string;
}

export const ENERGY_OPTIONS: EnergyOption[] = [
  {
    value: 'low',
    label: 'Low Energy',
    description: 'Tired, foggy, or overloaded. We\'ll suggest 1–3 minute, friction-free micro-steps.',
    emoji: '🌙',
  },
  {
    value: 'medium',
    label: 'Medium Energy',
    description: 'Steady pace. Manageable 5–10 minute focus blocks.',
    emoji: '☀️',
  },
  {
    value: 'high',
    label: 'Higher Capacity',
    description: 'Feeling clear-headed and ready for structured work.',
    emoji: '⚡',
  },
  {
    value: 'unsure',
    label: 'Not Sure / Skip',
    description: 'No pressure to label it. We\'ll suggest a gentle micro-start.',
    emoji: '🌿',
  },
];

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'archived';

export interface KnowledgeSourceRef {
  id: string;
  title: string;
  sourceUrl?: string;
  excerpt?: string;
}

export type MicroTaskStatus = 'suggested' | 'accepted' | 'completed' | 'shrunk' | 'dismissed' | 'pending';

export interface MicroTask {
  id: string;
  taskId: string;
  actionText: string;
  suggestedDurationMinutes: number;
  status: MicroTaskStatus;
  stepOrder?: number;
  encouragement: string;
  whyItIsManageable: string;
  alternativeSmallerStep?: string;
  sourceReferences: KnowledgeSourceRef[];
  isFallback: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  energy?: EnergyLevel;
  status: TaskStatus;
  deadline?: string;
  completedStepsCount: number;
  totalStepsCount?: number;
  subtasks?: MicroTask[];
  createdAt: string;
  updatedAt: string;
  currentMicroTask?: MicroTask | null;
}

export interface SequenceRequest {
  taskId?: string;
  taskTitle: string;
  taskDescription?: string;
  energyLevel?: EnergyLevel;
  currentStepText?: string;
  previousStepCompleted?: boolean;
  preferredDurationMinutes?: number;
  obstacle?: string;
}

export interface SequenceResponse {
  taskId?: string;
  stepId?: string;
  stepOrder?: number;
  totalSteps?: number;
  actionText: string;
  suggestedDurationMinutes: number;
  encouragement: string;
  whyItIsManageable: string;
  alternativeSmallerStep: string;
  sourceReferences: KnowledgeSourceRef[];
  isFallback: boolean;
  timestamp: string;
}

export type AppTheme =
  | 'paper-sage'
  | 'midnight-pulse'
  | 'forest-canopy'
  | 'lavender-haze'
  | 'sunlit-terracotta'
  | 'ink-lime'
  // Legacy aliases for backward-compatibility with previously stored preferences:
  | 'light'
  | 'dark'
  | 'forest'
  | 'lavender'
  | 'warm'
  | 'high-contrast';

export interface ThemeOption {
  id: AppTheme;
  name: string;
  description: string;
  previewAccent: string;
  previewBg: string;
  previewCard: string;
  previewText: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'paper-sage',
    name: 'Paper & Sage',
    description: 'Warm off-white surfaces with natural sage green accents.',
    previewAccent: '#2e7d5a',
    previewBg: '#fafaf7',
    previewCard: '#ffffff',
    previewText: '#181e1b',
  },
  {
    id: 'midnight-pulse',
    name: 'Midnight Pulse',
    description: 'Deep navy/charcoal backgrounds with cool electric sky accents.',
    previewAccent: '#38bdf8',
    previewBg: '#0b1120',
    previewCard: '#151e32',
    previewText: '#f1f5f9',
  },
  {
    id: 'forest-canopy',
    name: 'Forest Canopy',
    description: 'Rich dark forest-green surfaces with warm cream & moss highlights.',
    previewAccent: '#22c55e',
    previewBg: '#0d1f14',
    previewCard: '#132c1c',
    previewText: '#ecfdf5',
  },
  {
    id: 'lavender-haze',
    name: 'Lavender Haze',
    description: 'Soft lavender mist surfaces with soothing violet & plum tones.',
    previewAccent: '#8b5cf6',
    previewBg: '#f8f5fd',
    previewCard: '#ffffff',
    previewText: '#2e1065',
  },
  {
    id: 'sunlit-terracotta',
    name: 'Sunlit Terracotta',
    description: 'Warm cream backgrounds with grounding terracotta and amber accents.',
    previewAccent: '#ea580c',
    previewBg: '#fdf8f3',
    previewCard: '#fffaf5',
    previewText: '#431407',
  },
  {
    id: 'ink-lime',
    name: 'Ink & Lime',
    description: 'High-contrast stark near-black & white surfaces with vivid lime focus.',
    previewAccent: '#84cc16',
    previewBg: '#09090b',
    previewCard: '#18181b',
    previewText: '#fafafa',
  },
];

export type CompanionCharacter = 'sprout' | 'panda' | 'fox' | 'cat' | 'cloud' | 'robot';

export interface CharacterOption {
  id: CompanionCharacter;
  name: string;
  description: string;
  emoji: string;
}

export const CHARACTER_OPTIONS: CharacterOption[] = [
  { id: 'sprout', name: 'Sprout', description: 'The original green plant mascot. Grows with you.', emoji: '🌱' },
  { id: 'panda', name: 'Panda', description: 'Calm, wise, and wonderfully patient.', emoji: '🐼' },
  { id: 'fox', name: 'Fox', description: 'Curious and energetic — always ready to explore.', emoji: '🦊' },
  { id: 'cat', name: 'Cat', description: 'Relaxed, intuitive, and comforting.', emoji: '🐱' },
  { id: 'cloud', name: 'Cloud', description: 'Soft and minimal — floats beside you.', emoji: '☁️' },
  { id: 'robot', name: 'Robot', description: 'A small, friendly productivity helper.', emoji: '🤖' },
];

export interface Preferences {
  defaultEnergy: EnergyLevel;
  preferredStepDurationMinutes: number;
  enableSparkBuddy: boolean;
  enableDesktopNotifications: boolean;
  reminderFrequencyMinutes: number;
  quietHoursStart: string;
  quietHoursEnd: string;
  globalPause: boolean;
  enableRemoteAI: boolean;
  aiProvider: 'mock' | 'gemini' | 'openai' | 'ollama';
  reducedMotion: boolean;
  theme: AppTheme;
  character: CompanionCharacter;
}

export const DEFAULT_PREFERENCES: Preferences = {
  defaultEnergy: 'unsure',
  preferredStepDurationMinutes: 5,
  enableSparkBuddy: true,
  enableDesktopNotifications: true,
  reminderFrequencyMinutes: 30,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  globalPause: false,
  enableRemoteAI: false,
  aiProvider: 'mock',
  reducedMotion: false,
  theme: 'light',
  character: 'sprout',
};

export interface MascotState {
  mood: 'idle' | 'encouraging' | 'thinking' | 'resting' | 'celebrating';
  speechBubbleText?: string;
}
