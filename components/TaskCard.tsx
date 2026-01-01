
import React from 'react';
import { Task } from '../types';
import { CheckCircle2, Circle, Clock, MoreVertical, Timer, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  compact?: boolean;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, compact = false, onToggle, onEdit }) => {
  const getPriorityColor = (score: number) => {
    if (score >= 20) return 'border-l-red-500 bg-red-50';
    if (score >= 12) return 'border-l-orange-400 bg-orange-50';
    if (score >= 6) return 'border-l-blue-400 bg-blue-50';
    return 'border-l-emerald-400 bg-emerald-50';
  };

  const getPriorityBadge = (score: number) => {
    if (score >= 20) return 'bg-red-100 text-red-700';
    if (score >= 12) return 'bg-orange-100 text-orange-700';
    if (score >= 6) return 'bg-blue-100 text-blue-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  if (compact) {
    return (
      <div 
        onClick={(e) => { e.stopPropagation(); onEdit(task); }}
        className={`group flex items-center gap-1.5 px-2 py-0.5 mb-1 rounded text-xs cursor-pointer border-l-2 transition-all hover:brightness-95 ${
          task.completed ? 'bg-gray-100 border-l-gray-300 opacity-60' : getPriorityColor(task.priorityScore)
        }`}
      >
        <span className={`truncate flex-1 ${task.completed ? 'line-through' : 'font-medium'}`}>
          {task.title}
        </span>
        {!task.completed && task.priorityScore > 15 && (
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div 
      className={`group relative p-3 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md border-l-4 ${
        task.completed ? 'bg-gray-50 border-l-gray-300 opacity-75 shadow-none border-gray-200' : getPriorityColor(task.priorityScore)
      }`}
    >
      <div className="flex items-start gap-3">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
          className="mt-0.5 text-gray-400 hover:text-indigo-600 transition-colors"
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
        
        <div className="flex-1 min-w-0" onClick={() => onEdit(task)}>
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold text-gray-900 truncate ${task.completed ? 'line-through text-gray-500 font-normal' : ''}`}>
              {task.title}
            </h3>
            {task.completed && task.onTime === false && (
              <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" /> Delay
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
            <div className={`flex items-center gap-1 bg-white/50 px-2 py-0.5 rounded-full border border-gray-100 ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>
              <Clock className="w-3 h-3" />
              <span>{task.estimatedTime}m</span>
              {task.completed && task.actualTime !== undefined && (
                <span className="flex items-center gap-1 border-l pl-2 border-gray-200 ml-1">
                  <Timer className="w-3 h-3" />
                  <span className={task.actualTime > task.estimatedTime ? 'text-red-500' : 'text-emerald-500'}>
                    {task.actualTime}m
                  </span>
                </span>
              )}
            </div>
            {!task.completed && (
              <>
                <div className={`px-2 py-0.5 rounded-full font-bold ${getPriorityBadge(task.priorityScore)}`}>
                  Score: {task.priorityScore}
                </div>
                <div className="flex gap-1">
                  <span className="text-gray-400 font-medium">U: {task.urgency}</span>
                  <span className="text-gray-400 font-medium">I: {task.importance}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <button 
          onClick={() => onEdit(task)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
