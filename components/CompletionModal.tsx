
import React, { useState } from 'react';
import { Task } from '../types';
import { Check, X, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';

interface CompletionModalProps {
  task: Task;
  onComplete: (id: string, actualTime: number, onTime: boolean) => void;
  onCancel: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ task, onComplete, onCancel }) => {
  const [actualTime, setActualTime] = useState(task.estimatedTime);
  const [onTime, setOnTime] = useState(true);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="bg-indigo-600 px-6 py-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4 border border-white/30">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black mb-1">Task Completed!</h2>
            <p className="text-indigo-100 text-sm opacity-90">"{task.title}"</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
              How long did it actually take?
            </label>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <input
                  type="range"
                  min="5"
                  max={Math.max(120, task.estimatedTime * 2)}
                  step="5"
                  value={actualTime}
                  onChange={(e) => setActualTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
                  <span>Fast</span>
                  <span>Average</span>
                  <span>Long</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 min-w-[80px]">
                <span className="text-2xl font-black text-indigo-600 leading-none">{actualTime}</span>
                <span className="text-[10px] font-bold text-indigo-400 uppercase">Min</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-center text-gray-400">
              Estimation was <span className="font-bold text-gray-600">{task.estimatedTime}m</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
              Was it completed on time?
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setOnTime(true)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  onTime 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-100 scale-105' 
                    : 'bg-white border-gray-100 text-gray-400 grayscale'
                }`}
              >
                <ThumbsUp className={`w-6 h-6 ${onTime ? 'text-emerald-500' : ''}`} />
                <span className="text-sm font-bold">On Schedule</span>
              </button>
              <button
                onClick={() => setOnTime(false)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  !onTime 
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-lg shadow-amber-100 scale-105' 
                    : 'bg-white border-gray-100 text-gray-400 grayscale'
                }`}
              >
                <ThumbsDown className={`w-6 h-6 ${!onTime ? 'text-amber-500' : ''}`} />
                <span className="text-sm font-bold">Behind</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onComplete(task.id, actualTime, onTime)}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save Performance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
