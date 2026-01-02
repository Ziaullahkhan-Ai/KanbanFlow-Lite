
import React, { useState } from 'react';
import { Board, List, Task } from '../types';
import { Plus, X, Trash2, LayoutList, MoreVertical } from 'lucide-react';
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
  onMoveTask: (taskId: string, targetListId: string, position: number) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({ 
  board, lists, tasks, onAddList, onDeleteList, onAddTask, onUpdateTask, onDeleteTask, onMoveTask 
}) => {
  const [newListTitle, setNewListTitle] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [activeListForTask, setActiveListForTask] = useState<string | null>(null);
  const [dragOverListId, setDragOverListId] = useState<string | null>(null);

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListTitle.trim()) {
      onAddList(newListTitle);
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  const onDragOver = (e: React.DragEvent, listId: string) => {
    e.preventDefault();
    setDragOverListId(listId);
  };

  const onDrop = (e: React.DragEvent, listId: string) => {
    e.preventDefault();
    setDragOverListId(null);
    const taskId = e.dataTransfer.getData('taskId');
    const sourceListId = e.dataTransfer.getData('sourceListId');
    
    if (taskId) {
      onMoveTask(taskId, listId, 0);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutList className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Project Board</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">{board.title}</h2>
          <p className="text-sm text-slate-500 font-medium">{board.description || 'Manage your project tasks below.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden ring-2 ring-slate-100">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${board.id}${i}`} 
                  className="w-full h-full object-cover bg-indigo-50"
                  alt="team member" 
                />
              </div>
            ))}
            <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white ring-2 ring-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-500 shadow-inner">
              +12
            </div>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-slate-50/50 p-6 flex items-start gap-6">
        {lists.sort((a, b) => a.position - b.position).map(list => (
          <div 
            key={list.id} 
            className={`flex-shrink-0 w-80 flex flex-col max-h-full transition-all duration-200 ${
              dragOverListId === list.id ? 'scale-[1.02]' : ''
            }`}
            onDragOver={(e) => onDragOver(e, list.id)}
            onDragLeave={() => setDragOverListId(null)}
            onDrop={(e) => onDrop(e, list.id)}
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-slate-700 tracking-tight">{list.title}</h3>
                <span className="text-[10px] bg-white text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full font-bold shadow-sm">
                  {tasks.filter(t => t.listId === list.id).length}
                </span>
              </div>
              <button 
                onClick={() => {
                  if(confirm('Are you sure you want to delete this list and all its tasks?')) {
                    onDeleteList(list.id);
                  }
                }}
                className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 sm:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className={`flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-[100px] p-2 rounded-xl transition-colors ${
              dragOverListId === list.id ? 'bg-indigo-50/50 ring-2 ring-indigo-200 ring-dashed' : ''
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
              
              {tasks.filter(t => t.listId === list.id).length === 0 && !dragOverListId && (
                <div className="flex flex-col items-center justify-center py-8 text-slate-300 border border-dashed border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Empty List</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setActiveListForTask(list.id)}
              className="mt-4 flex items-center justify-center gap-2 py-2.5 w-full bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-300 rounded-xl text-xs font-bold transition-all border border-slate-200 shadow-sm hover:shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              ADD TASK
            </button>
          </div>
        ))}

        <div className="flex-shrink-0 w-80">
          {isAddingList ? (
            <form onSubmit={handleAddList} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xl animate-in zoom-in-95 duration-200">
              <input 
                autoFocus
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="List Title (e.g. Backlog)"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none mb-3 text-sm font-semibold"
              />
              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  CREATE LIST
                </button>
                <button 
                  type="button"
                  onClick={() => setIsAddingList(false)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setIsAddingList(true)}
              className="w-full bg-slate-200/30 hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 p-4 rounded-2xl flex items-center justify-center gap-2 border border-slate-200 border-dashed transition-all hover:scale-[1.02] active:scale-95 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span className="font-bold text-xs uppercase tracking-widest">New List</span>
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
