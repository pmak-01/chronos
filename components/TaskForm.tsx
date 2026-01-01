
import React, { useState, useEffect } from 'react';
import { Task, UrgencyLevel, ImportanceLevel } from '../types';
import { X, Trash2, Clock, Activity, Target } from 'lucide-react';

interface TaskFormProps {
  initialDate?: Date;
  taskToEdit?: Task | null;
  onSave: (task: Omit<Task, 'id' | 'priorityScore'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  initialDate, 
  taskToEdit, 
  onSave, 
  onDelete, 
  onClose 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [urgency, setUrgency] = useState<UrgencyLevel>(3);
  const [importance, setImportance] = useState<ImportanceLevel>(3);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDate(taskToEdit.date);
      setEstimatedTime(taskToEdit.estimatedTime);
      setUrgency(taskToEdit.urgency);
      setImportance(taskToEdit.importance);
    } else if (initialDate) {
      setDate(initialDate.toISOString().split('T')[0]);
    }
  }, [taskToEdit, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    
    onSave({
      id: taskToEdit?.id,
      title,
      description,
      date,
      estimatedTime,
      urgency,
      importance,
      completed: taskToEdit?.completed || false,
    });
    onClose();
  };

  const score = urgency * importance;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input
              autoFocus
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Finalize project roadmap"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add some details..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Est. Time (min)
              </label>
              <input
                type="number"
                min="1"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> Urgency (1-5)
              </label>
              <div className="flex justify-between gap-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setUrgency(lvl as UrgencyLevel)}
                    className={`flex-1 py-1 rounded-md text-sm font-bold border transition-all ${
                      urgency === lvl 
                        ? 'bg-indigo-600 text-white border-indigo-600 scale-105' 
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Importance (1-5)
              </label>
              <div className="flex justify-between gap-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setImportance(lvl as ImportanceLevel)}
                    className={`flex-1 py-1 rounded-md text-sm font-bold border transition-all ${
                      importance === lvl 
                        ? 'bg-indigo-600 text-white border-indigo-600 scale-105' 
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Priority Score Calculation:</span>
            <div className="flex items-center gap-2">
              <span className="text-indigo-600 font-bold text-xl">{score}</span>
              <span className="text-xs text-gray-400">({urgency} × {importance})</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {taskToEdit && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this task?')) {
                    onDelete(taskToEdit.id);
                    onClose();
                  }
                }}
                className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              {taskToEdit ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
