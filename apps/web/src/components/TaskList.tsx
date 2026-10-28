import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  Search,
  RotateCcw,
  ListOrdered,
} from 'lucide-react';
import { Task, EnergyLevel } from '@sparkstart/shared';

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onCreateTask: (title: string, energy: EnergyLevel, description?: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onMarkDone: (taskId: string, stepId?: string) => Promise<any>;
  onReopenTask?: (taskId: string) => Promise<any>;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onSelectTask,
  onCreateTask,
  onDeleteTask,
  onMarkDone,
  onReopenTask,
}) => {
  const [filter, setFilter] = useState<'active' | 'completed' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEnergy, setNewEnergy] = useState<EnergyLevel>('unsure');

  const toggleExpand = (taskId: string) => {
    setExpandedTaskIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const filteredTasks = tasks.filter((t) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    // Status filter
    if (filter === 'active') return t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await onCreateTask(newTitle.trim(), newEnergy, newDesc.trim() || undefined);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await onDeleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black ss-text-primary tracking-tight">
            My Tasks & Projects
          </h2>
          <p className="ss-support mt-1">
            Zero pressure or punitive deadlines. Every task is scaffolded into 2-to-5 minute starter steps.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="ss-btn-primary text-sm py-2.5 px-5 cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Task</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl ss-subtle border border-[var(--border)]">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 ss-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your tasks or assignments..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-transparent border-none outline-none ss-text-primary placeholder:ss-text-muted"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-1 text-xs font-bold ss-text-secondary self-start sm:self-auto">
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'active'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'hover:bg-[var(--bg-hover)]'
            }`}
          >
            Active ({tasks.filter((t) => t.status !== 'completed').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'completed'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'hover:bg-[var(--bg-hover)]'
            }`}
          >
            Completed ({tasks.filter((t) => t.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'hover:bg-[var(--bg-hover)]'
            }`}
          >
            All ({tasks.length})
          </button>
        </div>
      </div>

      {/* Task Cards List */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] p-12 text-center">
          <Layers className="w-12 h-12 ss-text-muted mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold ss-text-primary">
            {filter === 'completed'
              ? 'No completed tasks yet'
              : filter === 'active'
              ? 'No active tasks'
              : 'No tasks found'}
          </h3>
          <p className="ss-support mt-1 max-w-sm mx-auto">
            {filter === 'completed'
              ? 'Finished tasks will appear here as gentle victories. Zero pressure!'
              : 'Add an assignment or project and SparkStart will sequence it into low-friction steps.'}
          </p>
          {filter !== 'active' && (
            <button
              onClick={() => setFilter('active')}
              className="mt-4 px-4 py-2 text-xs font-bold text-[var(--accent)] hover:underline cursor-pointer"
            >
              Back to Active Tasks
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const subtasks = task.subtasks || [];
            const totalSteps = task.totalStepsCount || (subtasks.length > 0 ? subtasks.length : 4);
            const completedSteps = task.completedStepsCount || subtasks.filter((s) => s.status === 'completed').length;
            const progressPercent = Math.min(100, Math.round((completedSteps / totalSteps) * 100));
            const nextIncompleteStep = subtasks.find((s) => s.status !== 'completed');
            const nextStepNum = completedSteps + 1;
            const isExpanded = expandedTaskIds[task.id] ?? false;

            return (
              <div
                key={task.id}
                className={`group flex flex-col p-5 sm:p-6 rounded-2xl ss-card hover:border-[var(--border-accent)] hover:shadow-md transition-all ${
                  isCompleted ? 'opacity-85' : ''
                }`}
              >
                {/* Main Task Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Complete Checkbox Button */}
                    <button
                      onClick={() => onMarkDone(task.id)}
                      className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        isCompleted
                          ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                          : 'border-[var(--border)] hover:border-[var(--accent)] text-transparent hover:text-[var(--accent)]'
                      }`}
                      title={isCompleted ? 'Completed task' : 'Mark current step completed'}
                    >
                      <Check className="w-4 h-4" />
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`text-base sm:text-lg font-bold ss-text-primary ${
                            isCompleted ? 'line-through opacity-70' : ''
                          }`}
                        >
                          {task.title}
                        </h4>

                        {isCompleted ? (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            Completed Victory 🎉
                          </span>
                        ) : (
                          <span className="ss-badge-accent text-xs font-semibold px-2.5 py-0.5">
                            {completedSteps} of {totalSteps} steps ({progressPercent}%)
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="ss-body-sm line-clamp-2">{task.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-xs ss-text-muted pt-1">
                        <span className="capitalize font-medium">Energy: {task.energy || 'flexible'}</span>
                        {task.deadline && (
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            Target: {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                        {subtasks.length > 0 && (
                          <button
                            onClick={() => toggleExpand(task.id)}
                            className="text-[var(--accent)] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <ListOrdered className="w-3.5 h-3.5" />
                            <span>{subtasks.length} Micro-Steps</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--border)]">
                    {!isCompleted ? (
                      <button
                        onClick={() => onSelectTask(task)}
                        className="ss-btn-primary text-xs sm:text-sm py-2 px-4 cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {completedSteps === 0 ? 'Start Step 1' : `Continue to Step ${nextStepNum}`}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      onReopenTask && (
                        <button
                          onClick={() => onReopenTask(task.id)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold ss-subtle border border-[var(--border)] ss-text-secondary hover:ss-text-primary transition-all cursor-pointer"
                          title="Reopen task to continue adding steps"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reopen Task</span>
                        </button>
                      )
                    )}

                    <button
                      onClick={() => setTaskToDelete(task.id)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3.5 w-full h-1.5 rounded-full ss-subtle overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(5, progressPercent)}%` }}
                  />
                </div>

                {/* Expandable Child Micro-Steps Sequence */}
                {isExpanded && subtasks.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[var(--border)] space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider ss-text-muted mb-2">
                      Sequential Micro-Steps:
                    </div>
                    {subtasks.map((step, idx) => {
                      const stepDone = step.status === 'completed';
                      return (
                        <div
                          key={step.id || idx}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                            stepDone
                              ? 'bg-emerald-500/5 border-emerald-500/20 ss-text-muted line-through'
                              : 'ss-subtle border-[var(--border)] ss-text-primary'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                                stepDone ? 'bg-[var(--accent)] text-white' : 'border border-[var(--border)] ss-text-muted'
                              }`}
                            >
                              {stepDone ? <Check className="w-3 h-3" /> : idx + 1}
                            </span>
                            <span className="font-semibold">{step.actionText}</span>
                          </div>
                          <span className="text-[10px] ss-text-muted font-medium shrink-0">
                            ~{step.suggestedDurationMinutes}m
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl ss-card p-6 sm:p-7 shadow-2xl border border-[var(--border)]">
            <h3 className="text-xl font-black ss-text-primary mb-1">Add a New Task</h3>
            <p className="ss-support mb-4">
              Enter any project or goal. SparkStart will automatically decompose it into sequential 2-to-5 minute starter steps.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold ss-text-secondary mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Study Control Systems Chapter 4"
                  className="ss-input text-base py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-bold ss-text-secondary mb-1">Notes / Context (Optional)</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Any links, requirements, or thoughts..."
                  rows={3}
                  className="ss-input text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold ss-text-secondary mb-1">Preferred Energy</label>
                <select
                  value={newEnergy}
                  onChange={(e) => setNewEnergy(e.target.value as EnergyLevel)}
                  className="ss-select w-full"
                >
                  <option value="low">Low Energy (1–3 min starter action)</option>
                  <option value="medium">Medium Energy (5–8 min blocks)</option>
                  <option value="high">Higher Capacity (10–12 min focus)</option>
                  <option value="unsure">Not sure / Flexible</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="ss-btn-ghost text-sm py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ss-btn-primary text-sm py-2.5 px-6 cursor-pointer"
                >
                  Save & Sequence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl ss-card p-6 shadow-2xl border border-[var(--border)] text-center space-y-4">
            <h3 className="text-lg font-bold ss-text-primary">Delete this task?</h3>
            <p className="ss-support text-xs">
              This will remove the task and all its micro-steps. This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="ss-btn-ghost text-xs py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
