
import React from 'react';
import { Board } from '../types';
import { Clock, Trash2, ArrowRight } from 'lucide-react';

interface BoardListProps {
  boards: Board[];
  onSelectBoard: (id: string) => void;
  onDeleteBoard: (id: string) => void;
}

export const BoardList: React.FC<BoardListProps> = ({ boards, onSelectBoard, onDeleteBoard }) => {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Your Boards</h2>
        <p className="text-slate-500">Manage your projects and tasks across different workspaces.</p>
      </div>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-500 mb-4">No boards found. Create your first board to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map(board => (
            <div 
              key={board.id}
              className="group bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col cursor-pointer"
              onClick={() => onSelectBoard(board.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {board.title}
                </h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm('Are you sure you want to delete this board?')) {
                      onDeleteBoard(board.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-grow">
                {board.description || 'No description provided.'}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(board.createdAt).toLocaleDateString()}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
