
import React, { useState, useEffect, useCallback } from 'react';
import { ViewType, Task, UrgencyLevel, ImportanceLevel } from './types';
import Header from './components/Header';
import DayView from './components/views/DayView';
import WeekView from './components/views/WeekView';
import MonthView from './components/views/MonthView';
import YearView from './components/views/YearView';
import MatrixView from './components/views/MatrixView';
import InsightsView from './components/views/InsightsView';
import SyncView from './components/views/SyncView';
import TaskForm from './components/TaskForm';
import CompletionModal from './components/CompletionModal';

const STORAGE_KEY = 'chronos_tasks';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>(ViewType.MONTH);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // AI Logic States
  const [taskToFinalize, setTaskToFinalize] = useState<Task | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(currentDate);
    if (direction === 'today') {
      setCurrentDate(new Date());
      return;
    }

    const multiplier = direction === 'next' ? 1 : -1;

    switch (view) {
      case ViewType.DAY:
        newDate.setDate(newDate.getDate() + multiplier);
        break;
      case ViewType.WEEK:
        newDate.setDate(newDate.getDate() + (multiplier * 7));
        break;
      case ViewType.MONTH:
      case ViewType.MATRIX:
        newDate.setMonth(newDate.getMonth() + multiplier);
        break;
      case ViewType.YEAR:
        newDate.setFullYear(newDate.getFullYear() + multiplier);
        break;
    }
    setCurrentDate(newDate);
  };

  const saveTask = (taskData: Omit<Task, 'id' | 'priorityScore'> & { id?: string }) => {
    const priorityScore = taskData.urgency * taskData.importance;
    
    if (taskData.id) {
      setTasks(prev => prev.map(t => 
        t.id === taskData.id 
          ? { ...t, ...taskData, priorityScore } 
          : t
      ));
    } else {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        priorityScore,
      };
      setTasks(prev => [...prev, newTask]);
    }
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (!task.completed) {
      setTaskToFinalize(task);
    } else {
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, completed: false, actualTime: undefined, onTime: undefined } : t
      ));
    }
  };

  const finalizeTask = (id: string, actualTime: number, onTime: boolean) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: true, actualTime, onTime } : t
    ));
    setTaskToFinalize(null);
  };

  const openEditForm = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const openCreateForm = (date?: Date) => {
    setSelectedDate(date || currentDate);
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  // Sync Handlers
  const handleImport = (importedTasks: Task[]) => {
    // Unique check to avoid double imports
    setTasks(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const newUnique = importedTasks.filter(t => !existingIds.has(t.id));
      return [...prev, ...newUnique];
    });
  };

  const handleClearAll = () => {
    setTasks([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentDate={currentDate} 
        view={view} 
        setView={setView} 
        onNavigate={handleNavigate}
        onAddTask={() => openCreateForm()}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {view === ViewType.DAY && (
          <DayView 
            currentDate={currentDate} 
            tasks={tasks}
            onToggleTask={toggleTaskStatus}
            onEditTask={openEditForm}
            onAddTask={openCreateForm}
          />
        )}
        {view === ViewType.WEEK && (
          <WeekView 
            currentDate={currentDate} 
            tasks={tasks}
            onToggleTask={toggleTaskStatus}
            onEditTask={openEditForm}
            onAddTask={openCreateForm}
          />
        )}
        {view === ViewType.MONTH && (
          <MonthView 
            currentDate={currentDate} 
            tasks={tasks}
            onToggleTask={toggleTaskStatus}
            onEditTask={openEditForm}
            onDateClick={(date) => {
              setCurrentDate(date);
              setView(ViewType.DAY);
            }}
          />
        )}
        {view === ViewType.YEAR && (
          <YearView 
            currentDate={currentDate} 
            tasks={tasks}
            onMonthClick={(m) => {
              const d = new Date(currentDate);
              d.setMonth(m);
              setCurrentDate(d);
              setView(ViewType.MONTH);
            }}
            onDateClick={(date) => {
              setCurrentDate(date);
              setView(ViewType.DAY);
            }}
          />
        )}
        {view === ViewType.MATRIX && (
          <MatrixView 
            currentDate={currentDate} 
            tasks={tasks}
            onToggleTask={toggleTaskStatus}
            onEditTask={openEditForm}
          />
        )}
        {view === ViewType.INSIGHTS && (
          <InsightsView tasks={tasks} />
        )}
        {view === ViewType.SYNC && (
          <SyncView tasks={tasks} onImport={handleImport} onClearAll={handleClearAll} />
        )}
      </main>

      {isFormOpen && (
        <TaskForm 
          initialDate={selectedDate}
          taskToEdit={selectedTask}
          onSave={saveTask}
          onDelete={deleteTask}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedTask(null);
          }}
        />
      )}

      {taskToFinalize && (
        <CompletionModal 
          task={taskToFinalize}
          onCancel={() => setTaskToFinalize(null)}
          onComplete={finalizeTask}
        />
      )}

      <button 
        onClick={() => openCreateForm()}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-transform active:scale-90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
};

export default App;
