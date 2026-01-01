
import React, { useState } from 'react';
import { Task } from '../../types';
import { 
  Download, 
  Upload, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldAlert, 
  Trash2, 
  Info,
  Smartphone,
  Laptop
} from 'lucide-react';

interface SyncViewProps {
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
  onClearAll: () => void;
}

const SyncView: React.FC<SyncViewProps> = ({ tasks, onImport, onClearAll }) => {
  const [syncCode, setSyncCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const exportData = () => {
    const data = JSON.stringify(tasks);
    const encoded = btoa(encodeURIComponent(data));
    setSyncCode(encoded);
    navigator.clipboard.writeText(encoded);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setMessage({ type: 'success', text: 'Sync code copied to clipboard! Paste it on your other device.' });
  };

  const importData = () => {
    if (!syncCode.trim()) return;
    try {
      const decoded = decodeURIComponent(atob(syncCode));
      const importedTasks = JSON.parse(decoded);
      if (Array.isArray(importedTasks)) {
        if (confirm(`Are you sure you want to import ${importedTasks.length} tasks? This will merge with your current list.`)) {
          onImport(importedTasks);
          setMessage({ type: 'success', text: `Successfully imported ${importedTasks.length} tasks!` });
          setSyncCode('');
        }
      } else {
        throw new Error('Invalid data format');
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Invalid sync code. Please make sure you copied the full string.' });
    }
  };

  const downloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `chronos_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImport(json);
          setMessage({ type: 'success', text: 'Backup restored successfully!' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to read backup file.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-800 mb-2">Cross-Device Sync</h2>
          <p className="text-gray-500">Access your tasks on your laptop, phone, or tablet.</p>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'
          }`}>
            <Info className="w-5 h-5" />
            <p className="text-sm font-semibold">{message.text}</p>
            <button onClick={() => setMessage(null)} className="ml-auto text-current opacity-50 hover:opacity-100"><X className="w-4 h-4"/></button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Method 1: Sync Code */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 p-3 rounded-2xl">
                <RefreshCw className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Quick Transfer</h3>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Device to Device</p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-center items-center gap-4 py-4 opacity-40">
                <Laptop className="w-8 h-8" />
                <div className="h-px flex-1 border-t-2 border-dashed border-gray-300"></div>
                <Smartphone className="w-8 h-8" />
              </div>

              <textarea 
                value={syncCode}
                onChange={(e) => setSyncCode(e.target.value)}
                placeholder="Paste sync code here to import..."
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              />

              <div className="flex gap-3">
                <button 
                  onClick={exportData}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Generate & Copy
                </button>
                <button 
                  onClick={importData}
                  disabled={!syncCode}
                  className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  Import
                </button>
              </div>
            </div>
          </div>

          {/* Method 2: File Backup */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-3 rounded-2xl">
                <Download className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">File Backup</h3>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Storage & Security</p>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Download a JSON file containing all your tasks. Use this for cold storage or manually moving data between browsers.
                </p>
              </div>

              <button 
                onClick={downloadBackup}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Backup
              </button>

              <div className="relative">
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-300 hover:text-emerald-500 transition-all">
                  <Upload className="w-6 h-6 mb-2" />
                  <span className="text-sm font-bold">Upload JSON file</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-2xl">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">Danger Zone</h3>
              <p className="text-sm text-red-700 opacity-70">Irreversibly delete all tasks and performance data.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (confirm('DANGER: This will delete ALL tasks and history. This cannot be undone. Are you absolutely sure?')) {
                onClearAll();
                setMessage({ type: 'error', text: 'All data has been wiped.' });
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-red-100"
          >
            <Trash2 className="w-4 h-4" />
            Clear Everything
          </button>
        </div>
      </div>
    </div>
  );
};

const X = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default SyncView;
