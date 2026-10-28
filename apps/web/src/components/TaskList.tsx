import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  Check,
  Search,
  Filter,
} from 'lucide-react';
import { Task, EnergyLevel } from '@sparkstart/shared';

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onCreateTask: (title: string, energy: EnergyLevel, description?: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onMarkDone: (taskId: string) => Promise<any>;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onSelectTask,
  onCreateTask,
  onDeleteTask,
  onMarkDone,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEnergy, setNewEnergy] = useState<EnergyLevel>('unsure');

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
          <h2 className="text-2xl sm:text-3xl font-extrabold ss-text-primary tracking-tight">
            My Tasks
          </h2>
          <p className="ss-support mt-1">
            Zero pressure or punitive deadlines. Select any task to receive a manageable micro-step.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="ss-btn-primary text-sm py-2.5 px-5 cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
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
            placeholder="Search your tasks..."
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
          <h3 className="text-base font-bold ss-text-primary">No tasks in this view</h3>
          <p className="ss-support mt-1 max-w-sm mx-auto">
            {filter === 'completed'
              ? 'Completed tasks will be recorded here without pressure.'
              : 'Add an assignment or project and we will break it into micro-steps.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl ss-card hover:border-[var(--border-accent)] hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Complete checkbox button */}
                <button
                  onClick={() => onMarkDone(task.id)}
                  className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    task.status === 'completed'
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                      : 'border-[var(--border)] hover:border-[var(--accent)] text-transparent hover:text-[var(--accent)]'
                  }`}
                  title={task.status === 'completed' ? 'Completed' : 'Mark completed'}
                >
                  <Check className="w-4 h-4" />
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className={`text-base sm:text-lg font-bold ss-text-primary ${
                        task.status === 'completed' ? 'line-through opacity-50' : ''
                      }`}
                    >
                      {task.title}
                    </h4>
                    {task.completedStepsCount > 0 && (
                      <span className="ss-badge-accent text-xs font-semibold px-2.5 py-0.5">
                        {task.completedStepsCount} {task.completedStepsCount === 1 ? 'step' : 'steps'} done
                      </span>
                    )}
                  </div>

                  {task.description && (
                    <p className="ss-body-sm mt-1 line-clamp-2">{task.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs ss-text-muted mt-2">
                    <span className="capitalize font-medium">Energy: {task.energy || 'flexible'}</span>
                    {task.deadline && (
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        Target: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--border)]">
                {task.status !== 'completed' && (
                  <button
                    onClick={() => onSelectTask(task)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[var(--accent-light)] text-[var(--accent)] hover:opacity-90 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Find Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setTaskToDelete(task.id)}
                  className="p-2.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl ss-card p-6 sm:p-7 shadow-2xl">
            <h3 className="text-xl font-extrabold ss-text-primary mb-1">Add a New Task</h3>
            <p className="ss-support mb-4">
              Enter any project or goal you wish to make steady, low-pressure progress on.
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
                  placeholder="Any links, requirements, or initial thoughts..."
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
                  <option value="low">Low Energy (2–3 min micro-step)</option>
                  <option value="medium">Medium Energy (5–10 min blocks)</option>
                  <option value="high">Higher Capacity (10–15 min focus)</option>
                  <option value="unsure">Not sure / Flexible</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="ss-btn-secondary text-sm py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="ss-btn-primary text-sm py-2 px-5 cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl ss-card p-6 shadow-2xl text-center">
            <h4 className="text-lg font-bold ss-text-primary mb-2">Delete this task?</h4>
            <p className="ss-support mb-5">
              This will remove the task from your local list. This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setTaskToDelete(null)}
                className="ss-btn-secondary text-xs py-2 px-4 cursor-pointer"
              >
                Keep Task
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
