
import React from 'react';
import { Layout, Plus, Home } from 'lucide-react';

interface HeaderProps {
  onHome: () => void;
  onAddBoard: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHome, onAddBoard }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onHome}>
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Layout className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">TrelloLite</h1>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onHome}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          title="Home"
        >
          <Home className="w-5 h-5" />
        </button>
        <button 
          onClick={onAddBoard}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Board</span>
        </button>
      </div>
    </header>
  );
};
