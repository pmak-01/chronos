
import React from 'react';
import { Task } from '../../types';
import { getDaysInMonth, getMonthName, getShortDayName, formatToISODate } from '../../utils/dateUtils';

interface YearViewProps {
  currentDate: Date;
  tasks: Task[];
  onMonthClick: (month: number) => void;
  onDateClick: (date: Date) => void;
}

const YearView: React.FC<YearViewProps> = ({
  currentDate,
  tasks,
  onMonthClick,
  onDateClick
}) => {
  const year = currentDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i);

  const getTaskIntensity = (date: Date) => {
    const iso = formatToISODate(date);
    const count = tasks.filter(t => t.date === iso).length;
    if (count === 0) return 'bg-white';
    if (count === 1) return 'bg-indigo-100';
    if (count <= 3) return 'bg-indigo-300';
    return 'bg-indigo-600';
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {months.map(monthIndex => {
          const days = getDaysInMonth(year, monthIndex);
          const firstDay = days[0].getDay();
          const padding = Array(firstDay).fill(null);

          return (
            <div 
              key={monthIndex} 
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <button 
                onClick={() => onMonthClick(monthIndex)}
                className="text-lg font-bold text-gray-800 mb-4 hover:text-indigo-600 text-left"
              >
                {getMonthName(monthIndex)}
              </button>
              
              <div className="grid grid-cols-7 gap-1 text-[10px] text-center text-gray-400 mb-2 font-bold uppercase tracking-tighter">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {padding.map((_, i) => <div key={`p-${i}`} className="aspect-square" />)}
                {days.map(day => (
                  <div 
                    key={day.toISOString()}
                    onClick={() => onDateClick(day)}
                    className={`aspect-square flex items-center justify-center rounded-md text-[10px] font-medium cursor-pointer border border-gray-50 transition-all hover:ring-2 hover:ring-indigo-300 ${getTaskIntensity(day)} ${
                      getTaskIntensity(day) === 'bg-indigo-600' ? 'text-white' : 'text-gray-700'
                    }`}
                    title={`${tasks.filter(t => t.date === formatToISODate(day)).length} tasks`}
                  >
                    {day.getDate()}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearView;
