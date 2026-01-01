
import React, { useMemo } from 'react';
import { Task } from '../../types';
import TaskCard from '../TaskCard';
import { Target, Zap, Clock, Trash2, ArrowRight, ArrowDown } from 'lucide-react';

interface MatrixViewProps {
  currentDate: Date;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

const MatrixView: React.FC<MatrixViewProps> = ({
  currentDate,
  tasks,
  onToggleTask,
  onEditTask,
}) => {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Filter tasks for current month context to keep it relevant
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const taskDate = new Date(t.date);
      return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
    });
  }, [tasks, currentMonth, currentYear]);

  // Eisenhower categorization
  // Threshold: High >= 4, Low <= 3
  const quadrants = useMemo(() => {
    return {
      q1: filteredTasks.filter(t => t.urgency >= 4 && t.importance >= 4), // Urgent & Important (Do)
      q2: filteredTasks.filter(t => t.urgency < 4 && t.importance >= 4),  // Not Urgent & Important (Schedule)
      q3: filteredTasks.filter(t => t.urgency >= 4 && t.importance < 4),  // Urgent & Not Important (Delegate)
      q4: filteredTasks.filter(t => t.urgency < 4 && t.importance < 4),   // Not Urgent & Not Important (Eliminate)
    };
  }, [filteredTasks]);

  const QuadrantHeader = ({ title, subtitle, icon: Icon, colorClass, badgeText }: any) => (
    <div className={`flex items-start justify-between mb-4 pb-2 border-b border-gray-100`}>
      <div className="flex gap-3">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colorClass}`}>
        {badgeText}
      </span>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 bg-gray-50 overflow-hidden">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
          Eisenhower Priority Matrix
          <span className="text-sm font-medium text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200">
            {filteredTasks.length} tasks this month
          </span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">Automatically arranged by Urgency and Importance scores.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 min-h-0">
        {/* Q1: Do First */}
        <div className="bg-white rounded-3xl border border-red-100 shadow-sm flex flex-col p-5 overflow-hidden ring-1 ring-red-50">
          <QuadrantHeader 
            title="Do First" 
            subtitle="Urgent & Important" 
            icon={Zap} 
            colorClass="bg-red-100 text-red-600" 
            badgeText="Quadrant I"
          />
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {quadrants.q1.length > 0 ? quadrants.q1.map(t => (
              <TaskCard key={t.id} task={t} onToggle={onToggleTask} onEdit={onEditTask} />
            )) : <EmptyState message="No critical tasks" />}
          </div>
        </div>

        {/* Q2: Schedule */}
        <div className="bg-white rounded-3xl border border-amber-100 shadow-sm flex flex-col p-5 overflow-hidden ring-1 ring-amber-50">
          <QuadrantHeader 
            title="Schedule" 
            subtitle="Important, Not Urgent" 
            icon={Target} 
            colorClass="bg-amber-100 text-amber-600" 
            badgeText="Quadrant II"
          />
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {quadrants.q2.length > 0 ? quadrants.q2.map(t => (
              <TaskCard key={t.id} task={t} onToggle={onToggleTask} onEdit={onEditTask} />
            )) : <EmptyState message="Focus on long-term goals" />}
          </div>
        </div>

        {/* Q3: Delegate */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm flex flex-col p-5 overflow-hidden ring-1 ring-blue-50">
          <QuadrantHeader 
            title="Delegate" 
            subtitle="Urgent, Not Important" 
            icon={Clock} 
            colorClass="bg-blue-100 text-blue-600" 
            badgeText="Quadrant III"
          />
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {quadrants.q3.length > 0 ? quadrants.q3.map(t => (
              <TaskCard key={t.id} task={t} onToggle={onToggleTask} onEdit={onEditTask} />
            )) : <EmptyState message="Busy but not impactful" />}
          </div>
        </div>

        {/* Q4: Eliminate */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col p-5 overflow-hidden ring-1 ring-gray-100">
          <QuadrantHeader 
            title="Eliminate" 
            subtitle="Neither Urgent nor Important" 
            icon={Trash2} 
            colorClass="bg-gray-100 text-gray-600" 
            badgeText="Quadrant IV"
          />
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {quadrants.q4.length > 0 ? quadrants.q4.map(t => (
              <TaskCard key={t.id} task={t} onToggle={onToggleTask} onEdit={onEditTask} />
            )) : <EmptyState message="Clear of distractions" />}
          </div>
        </div>
      </div>

      {/* Axis Labels - Desktop Only */}
      <div className="hidden lg:block relative mt-4 h-8">
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <ArrowRight className="w-4 h-4" /> Urgency
        </div>
        <div className="absolute top-[-300px] left-[-30px] -rotate-90 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest origin-center">
          <ArrowDown className="w-4 h-4" /> Importance
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
    <span className="text-gray-300 text-sm font-medium italic">{message}</span>
  </div>
);

export default MatrixView;
