
import React from 'react';
import { ViewType } from '../types';
import { getMonthName } from '../utils/dateUtils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  LayoutGrid, 
  Columns, 
  Rows, 
  Plus,
  Grid2X2,
  Sparkles,
  Database
} from 'lucide-react';

interface HeaderProps {
  currentDate: Date;
  view: ViewType;
  setView: (view: ViewType) => void;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
  onAddTask: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentDate, 
  view, 
  setView, 
  onNavigate, 
  onAddTask 
}) => {
  const renderDateLabel = () => {
    const year = currentDate.getFullYear();
    const month = getMonthName(currentDate.getMonth());
    
    switch (view) {
      case ViewType.DAY:
        return `${currentDate.getDate()} ${month} ${year}`;
      case ViewType.WEEK:
        return `Week of ${month} ${year}`;
      case ViewType.MONTH:
      case ViewType.MATRIX:
        return `${month} ${year}`;
      case ViewType.YEAR:
        return `${year}`;
      case ViewType.INSIGHTS:
        return 'AI Productivity Insights';
      case ViewType.SYNC:
        return 'Data & Sync';
      default:
        return '';
    }
  };

  const views = [
    { type: ViewType.DAY, icon: Rows, label: 'Day' },
    { type: ViewType.WEEK, icon: Columns, label: 'Week' },
    { type: ViewType.MONTH, icon: LayoutGrid, label: 'Month' },
    { type: ViewType.YEAR, icon: CalendarIcon, label: 'Year' },
    { type: ViewType.MATRIX, icon: Grid2X2, label: 'Matrix' },
    { type: ViewType.INSIGHTS, icon: Sparkles, label: 'AI Insights' },
    { type: ViewType.SYNC, icon: Database, label: 'Sync' },
  ];

  const hideNav = view === ViewType.INSIGHTS || view === ViewType.SYNC;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 py-3 sm:px-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-200 shadow-lg">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer" onClick={() => setView(ViewType.MONTH)}>
              Chronos
            </h1>
          </div>

          {!hideNav && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1 ml-4">
              <button 
                onClick={() => onNavigate('prev')}
                className="p-1 hover:bg-white hover:shadow-sm rounded transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => onNavigate('today')}
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm rounded transition-all"
              >
                Today
              </button>
              <button 
                onClick={() => onNavigate('next')}
                className="p-1 hover:bg-white hover:shadow-sm rounded transition-all"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
          
          <span className="text-lg font-semibold text-gray-800 ml-2 hidden sm:block">
            {renderDateLabel()}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex bg-gray-100 rounded-lg p-1 mr-2 whitespace-nowrap">
            {views.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => setView(type)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === type 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{label}</span>
              </button>
            ))}
          </div>
          
          <button 
            onClick={onAddTask}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>
      {!hideNav && (
        <div className="sm:hidden mt-2 text-center text-md font-semibold text-gray-800">
          {renderDateLabel()}
        </div>
      )}
    </header>
  );
};

export default Header;
