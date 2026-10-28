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

export type MicroTaskStatus = 'suggested' | 'accepted' | 'completed' | 'shrunk' | 'dismissed';

export interface MicroTask {
  id: string;
  taskId: string;
  actionText: string;
  suggestedDurationMinutes: number;
  status: MicroTaskStatus;
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
  actionText: string;
  suggestedDurationMinutes: number;
  encouragement: string;
  whyItIsManageable: string;
  alternativeSmallerStep: string;
  sourceReferences: KnowledgeSourceRef[];
  isFallback: boolean;
  timestamp: string;
}

export type AppTheme = 'light' | 'dark' | 'forest' | 'lavender' | 'warm' | 'high-contrast';

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
