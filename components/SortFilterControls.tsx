
import React from 'react';
import { SortField, SortOrder } from '../types';
import { Filter, SortAsc, SortDesc } from 'lucide-react';

interface SortFilterProps {
  sortBy: SortField;
  sortOrder: SortOrder;
  showCompleted: boolean;
  onSortChange: (field: SortField) => void;
  onOrderToggle: () => void;
  onFilterToggle: () => void;
}

const SortFilterControls: React.FC<SortFilterProps> = ({
  sortBy,
  sortOrder,
  showCompleted,
  onSortChange,
  onOrderToggle,
  onFilterToggle
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-xl border border-gray-200 mb-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort by</span>
        <select 
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortField)}
          className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="priorityScore">Priority Score</option>
          <option value="urgency">Urgency</option>
          <option value="importance">Importance</option>
          <option value="estimatedTime">Time</option>
          <option value="title">Alphabetical</option>
        </select>
        <button 
          onClick={onOrderToggle}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
        </button>
      </div>

      <div className="h-4 w-px bg-gray-200 hidden sm:block" />

      <button 
        onClick={onFilterToggle}
        className={`flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-lg transition-all border ${
          showCompleted 
            ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>{showCompleted ? 'Showing All' : 'Hide Completed'}</span>
      </button>
    </div>
  );
};

export default SortFilterControls;
