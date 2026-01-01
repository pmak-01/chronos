
import React from 'react';
import { Task } from '../../types';
import { getStartOfWeek, getWeekDays, isSameDay, getShortDayName, formatToISODate } from '../../utils/dateUtils';
import TaskCard from '../TaskCard';
import { Plus } from 'lucide-react';

interface WeekViewProps {
  currentDate: Date;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onAddTask: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  tasks,
  onToggleTask,
  onEditTask,
  onAddTask
}) => {
  const startOfWeek = getStartOfWeek(currentDate);
  const days = getWeekDays(startOfWeek);
  const today = new Date();

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-4 p-2 overflow-x-auto min-h-0">
      {days.map(day => {
        const isoDate = formatToISODate(day);
        const dayTasks = tasks
          .filter(t => t.date === isoDate)
          .sort((a, b) => b.priorityScore - a.priorityScore);
        const isToday = isSameDay(day, today);

        return (
          <div 
            key={day.toISOString()}
            className="flex-1 min-w-[280px] bg-white rounded-2xl border border-gray-200 flex flex-col shadow-sm"
          >
            <div className={`p-4 border-b ${isToday ? 'bg-indigo-50/50' : ''}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {getShortDayName(day.getDay())}
                  </h3>
                  <p className={`text-2xl font-black ${isToday ? 'text-indigo-600' : 'text-gray-800'}`}>
                    {day.getDate()}
                  </p>
                </div>
                <button 
                  onClick={() => onAddTask(day)}
                  className="p-2 hover:bg-white rounded-full transition-all hover:shadow-sm group"
                >
                  <Plus className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
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
                <div className="h-full flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-100 rounded-xl">
                  <p className="text-sm text-gray-400 font-medium">No tasks</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;
