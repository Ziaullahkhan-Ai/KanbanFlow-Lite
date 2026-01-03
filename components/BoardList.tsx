import React from 'react';
import { Board } from '../types.ts';
import { Clock, Trash2, ArrowRight, Layout } from 'lucide-react';

interface BoardListProps {
  boards: Board[];
  onSelectBoard: (id: string) => void;
  onDeleteBoard: (id: string) => void;
}

export const BoardList: React.FC<BoardListProps> = ({ boards, onSelectBoard, onDeleteBoard }) => {
  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Workspaces</h2>
          <p className="text-slate-500 font-medium">Create and manage your project boards.</p>
        </div>
      </div>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
          <Layout className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-slate-500 font-bold mb-4">No boards created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map(board => (
            <div 
              key={board.id}
              className="group bg-white rounded-3xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col cursor-pointer animate-in fade-in zoom-in-95"
              onClick={() => onSelectBoard(board.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl transition-colors">
                  <Layout className="w-5 h-5" />
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm('Delete this board?')) onDeleteBoard(board.id);
                  }}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {board.title}
              </h3>
              
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-grow font-medium leading-relaxed">
                {board.description || 'Manage your project tasks here.'}
              </p>

              <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(board.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};