import React from 'react';
import { Layout, Plus, Home } from 'lucide-react';

interface HeaderProps {
  onHome: () => void;
  onAddBoard: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHome, onAddBoard }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onHome}>
        <div className="bg-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
          <Layout className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">TrelloLite Pro</h1>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onHome}
          className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-all active:scale-95"
          title="Home"
        >
          <Home className="w-5 h-5" />
        </button>
        <button 
          onClick={onAddBoard}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Board</span>
        </button>
      </div>
    </header>
  );
};