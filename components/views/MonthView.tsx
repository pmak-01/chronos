
import React from 'react';
import { Task } from '../../types';
import { getDaysInMonth, isSameDay, getShortDayName, formatToISODate } from '../../utils/dateUtils';
import TaskCard from '../TaskCard';

interface MonthViewProps {
  currentDate: Date;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDateClick: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  tasks,
  onToggleTask,
  onEditTask,
  onDateClick
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const days = getDaysInMonth(year, month);
  const firstDayOfMonth = days[0].getDay();
  const paddingStart = Array(firstDayOfMonth).fill(null);
  
  // Padding end logic for a full grid (usually 42 cells)
  const totalCells = paddingStart.length + days.length;
  const paddingEnd = Array((7 - (totalCells % 7)) % 7).fill(null);

  const getTasksForDay = (date: Date) => {
    const iso = formatToISODate(date);
    return tasks.filter(t => t.date === iso).sort((a, b) => b.priorityScore - a.priorityScore);
  };

  const today = new Date();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-200 overflow-hidden rounded-xl border border-gray-200 shadow-lg">
      <div className="grid grid-cols-7 bg-white border-b border-gray-200">
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
            {getShortDayName(i)}
          </div>
        ))}
      </div>
      
      <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-6 auto-rows-fr gap-px min-h-0 overflow-y-auto">
        {paddingStart.map((_, i) => (
          <div key={`padding-start-${i}`} className="bg-gray-50 min-h-[80px]" />
        ))}
        
        {days.map(day => {
          const dayTasks = getTasksForDay(day);
          const isToday = isSameDay(day, today);
          
          return (
            <div 
              key={day.toISOString()} 
              onClick={() => onDateClick(day)}
              className={`bg-white min-h-[100px] flex flex-col p-1.5 transition-colors hover:bg-indigo-50/30 cursor-pointer group`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-semibold inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
                  isToday ? 'bg-indigo-600 text-white' : 'text-gray-700 group-hover:text-indigo-600'
                }`}>
                  {day.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {dayTasks.length}
                  </span>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-1">
                {dayTasks.slice(0, 4).map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    compact 
                    onToggle={onToggleTask} 
                    onEdit={onEditTask} 
                  />
                ))}
                {dayTasks.length > 4 && (
                  <div className="text-[10px] font-bold text-indigo-600 pl-2">
                    + {dayTasks.length - 4} more
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {paddingEnd.map((_, i) => (
          <div key={`padding-end-${i}`} className="bg-gray-50 min-h-[80px]" />
        ))}
      </div>
    </div>
  );
};

export default MonthView;
