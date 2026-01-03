
import React, { useState } from 'react';
import { Board, List, Task } from '../types';
import { Plus, X, Trash2, LayoutList, MoreHorizontal, LayoutGrid } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './Modals';

interface BoardViewProps {
  board: Board;
  lists: List[];
  tasks: Task[];
  onAddList: (title: string) => void;
  onDeleteList: (id: string) => void;
  onAddTask: (listId: string, title: string, desc: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (taskId: string, targetListId: string) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({ 
  board, lists, tasks, onAddList, onDeleteList, onAddTask, onUpdateTask, onDeleteTask, onMoveTask 
}) => {
  const [newListTitle, setNewListTitle] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [activeListForTask, setActiveListForTask] = useState<string | null>(null);
  const [dragTargetList, setDragTargetList] = useState<string | null>(null);

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListTitle.trim()) {
      onAddList(newListTitle);
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  const handleDragOver = (e: React.DragEvent, listId: string) => {
    e.preventDefault();
    setDragTargetList(listId);
  };

  const handleDrop = (e: React.DragEvent, listId: string) => {
    e.preventDefault();
    setDragTargetList(null);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onMoveTask(taskId, listId);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-300">
      <div className="px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{board.title}</h2>
            <p className="text-sm text-slate-500 font-medium">{board.description || 'Organize your work visually.'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex -space-x-2">
            {[1, 2, 3].map(i => (
              <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} className="w-9 h-9 rounded-full border-2 border-white shadow-sm" />
            ))}
          </div>
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-8 flex items-start gap-8 bg-slate-50/50 custom-scrollbar">
        {lists.sort((a, b) => a.position - b.position).map(list => (
          <div 
            key={list.id} 
            className="flex-shrink-0 w-[320px] flex flex-col max-h-full"
            onDragOver={(e) => handleDragOver(e, list.id)}
            onDragLeave={() => setDragTargetList(null)}
            onDrop={(e) => handleDrop(e, list.id)}
          >
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-3">
                <h3 className="font-extrabold text-slate-800 tracking-tight text-sm uppercase">{list.title}</h3>
                <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-black shadow-sm">
                  {tasks.filter(t => t.listId === list.id).length}
                </span>
              </div>
              <button 
                onClick={() => confirm('Delete list?') && onDeleteList(list.id)}
                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className={`flex-1 overflow-y-auto flex flex-col gap-4 min-h-[150px] p-2 rounded-2xl transition-all ${
              dragTargetList === list.id ? 'bg-indigo-50 border-2 border-indigo-200 border-dashed' : 'bg-transparent'
            }`}>
              {tasks
                .filter(t => t.listId === list.id)
                .sort((a, b) => a.position - b.position)
                .map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onDelete={() => onDeleteTask(task.id)}
                    onUpdate={(updates) => onUpdateTask(task.id, updates)}
                  />
                ))}
              
              {tasks.filter(t => t.listId === list.id).length === 0 && !dragTargetList && (
                <div className="flex flex-col items-center justify-center py-10 text-slate-300 border border-dashed border-slate-200 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-50">Drop here</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setActiveListForTask(list.id)}
              className="mt-4 flex items-center justify-center gap-2 py-3 w-full bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-200 rounded-2xl text-xs font-black transition-all border border-slate-100 shadow-sm group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              ADD NEW TASK
            </button>
          </div>
        ))}

        <div className="flex-shrink-0 w-[320px]">
          {isAddingList ? (
            <form onSubmit={handleAddList} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xl animate-in zoom-in-95">
              <input 
                autoFocus
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="List title (e.g. Backlog)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none mb-3 text-sm font-bold"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700">CREATE</button>
                <button type="button" onClick={() => setIsAddingList(false)} className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setIsAddingList(true)}
              className="w-full bg-slate-200/40 hover:bg-slate-200/60 text-slate-500 p-5 rounded-3xl flex items-center justify-center gap-2 border border-slate-300 border-dashed transition-all active:scale-95 group"
            >
              <Plus className="w-5 h-5 group-hover:scale-125 transition-transform" />
              <span className="font-black text-xs uppercase tracking-widest">New List</span>
            </button>
          )}
        </div>
      </div>

      <CreateTaskModal 
        isOpen={activeListForTask !== null}
        onClose={() => setActiveListForTask(null)}
        onSubmit={(title, desc) => {
          if (activeListForTask) {
            onAddTask(activeListForTask, title, desc);
            setActiveListForTask(null);
          }
        }}
      />
    </div>
  );
};
