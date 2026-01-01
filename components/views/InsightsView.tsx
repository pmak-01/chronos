
import React, { useState, useEffect } from 'react';
import { Task } from '../../types';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, TrendingUp, AlertCircle, BrainCircuit, Loader2, Calendar, Target, Clock } from 'lucide-react';

interface InsightsViewProps {
  tasks: Task[];
}

const InsightsView: React.FC<InsightsViewProps> = ({ tasks }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completedTasks = tasks.filter(t => t.completed && t.actualTime !== undefined);

  const generateInsights = async () => {
    if (completedTasks.length < 3) return;
    
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const taskDataString = completedTasks.map(t => 
        `- ${t.title}: Est ${t.estimatedTime}m, Actual ${t.actualTime}m, On-Time: ${t.onTime ? 'Yes' : 'No'}, Urgency: ${t.urgency}, Importance: ${t.importance}`
      ).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these completed tasks and provide 3-4 specific, actionable scheduling suggestions to improve my productivity. 
        Focus on time estimation accuracy and quadrant priority habits.
        Keep the response professional, encouraging, and formatted with clean markdown bullet points.
        
        Task History:
        ${taskDataString}`,
        config: {
          systemInstruction: "You are a world-class productivity coach. You analyze task completion data to help users schedule better and estimate time more accurately.",
          temperature: 0.7
        }
      });

      setInsight(response.text || "No insights available yet.");
    } catch (err) {
      console.error(err);
      setError("Failed to reach AI coach. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (completedTasks.length >= 3 && !insight) {
      generateInsights();
    }
  }, [completedTasks.length]);

  const stats = {
    accuracy: completedTasks.length > 0 
      ? Math.round((completedTasks.reduce((acc, t) => acc + (t.onTime ? 1 : 0), 0) / completedTasks.length) * 100) 
      : 0,
    timeEfficiency: completedTasks.length > 0
      ? Math.round((completedTasks.reduce((acc, t) => acc + (t.estimatedTime / (t.actualTime || 1)), 0) / completedTasks.length) * 100)
      : 0
  };

  return (
    <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
              <BrainCircuit className="w-10 h-10" />
              Chronos AI Coach
            </h2>
            <p className="text-indigo-100 text-lg opacity-90 max-w-xl">
              I analyze your past performance to help you master your schedule and eliminate time-estimation bias.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <Target className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <div className="text-4xl font-black text-gray-800">{stats.accuracy}%</div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Accuracy</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <Clock className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <div className="text-4xl font-black text-gray-800">{stats.timeEfficiency}%</div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Efficiency</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <div className="text-4xl font-black text-gray-800">{completedTasks.length}</div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Analyzed</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              Personalized Recommendations
            </h3>
            <button 
              onClick={generateInsights}
              disabled={loading || completedTasks.length < 3}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 disabled:text-gray-300 transition-colors"
            >
              Refresh Analysis
            </button>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Brewing insights from your performance history...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-gray-600 mb-2 font-bold">{error}</p>
              <button onClick={generateInsights} className="text-indigo-600 underline font-medium">Try again</button>
            </div>
          ) : completedTasks.length < 3 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <TrendingUp className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 max-w-sm">
                Complete at least <span className="font-bold text-indigo-600">3 tasks</span> with performance feedback to unlock AI insights.
              </p>
            </div>
          ) : (
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed">
              {insight?.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsView;
