
import React, { useState, useMemo } from 'react';
import { Task, SortField, SortOrder } from '../../types';
import { formatToISODate } from '../../utils/dateUtils';
import TaskCard from '../TaskCard';
import SortFilterControls from '../SortFilterControls';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

interface DayViewProps {
  currentDate: Date;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onAddTask: (date: Date) => void;
}

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  tasks,
  onToggleTask,
  onEditTask,
  onAddTask
}) => {
  const [sortBy, setSortBy] = useState<SortField>('priorityScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showCompleted, setShowCompleted] = useState(true);

  const isoDate = formatToISODate(currentDate);
  const dayTasks = useMemo(() => {
    let filtered = tasks.filter(t => t.date === isoDate);
    
    if (!showCompleted) {
      filtered = filtered.filter(t => !t.completed);
    }

    return filtered.sort((a, b) => {
      const multiplier = sortOrder === 'desc' ? -1 : 1;
      const fieldA = a[sortBy];
      const fieldB = b[sortBy];

      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return multiplier * fieldA.localeCompare(fieldB);
      }
      return multiplier * ((fieldA as number) - (fieldB as number));
    });
  }, [tasks, isoDate, sortBy, sortOrder, showCompleted]);

  const stats = useMemo(() => {
    const total = dayTasks.length;
    const completed = dayTasks.filter(t => t.completed).length;
    const pending = total - completed;
    const totalTime = dayTasks.reduce((acc, t) => acc + t.estimatedTime, 0);
    return { total, completed, pending, totalTime };
  }, [dayTasks]);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <CalendarIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tasks</p>
            <p className="text-2xl font-black text-gray-800">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl">
            <Info className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Completed</p>
            <p className="text-2xl font-black text-emerald-600">{stats.completed}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-xl">
            <Info className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Duration</p>
            <p className="text-2xl font-black text-amber-600">{stats.totalTime}m</p>
          </div>
        </div>
      </div>

      <SortFilterControls 
        sortBy={sortBy}
        sortOrder={sortOrder}
        showCompleted={showCompleted}
        onSortChange={setSortBy}
        onOrderToggle={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        onFilterToggle={() => setShowCompleted(prev => !prev)}
      />

      <div className="flex-1 space-y-4">
        {dayTasks.length > 0 ? (
          dayTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onToggle={onToggleTask} 
              onEdit={onEditTask} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-lg text-gray-500 font-medium">No tasks found for this day.</p>
            <button 
              onClick={() => onAddTask(currentDate)}
              className="mt-4 text-indigo-600 font-bold hover:underline"
            >
              Add your first task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayView;
