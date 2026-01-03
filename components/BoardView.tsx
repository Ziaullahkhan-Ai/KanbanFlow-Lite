import React, { useState } from 'react';
import { Board, List, Task } from '../types.ts';
import { Plus, X, Trash2, LayoutGrid, MoreHorizontal } from 'lucide-react';
import { TaskCard } from './TaskCard.tsx';
import { CreateTaskModal } from './Modals.tsx';

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
    if (dragTargetList !== listId) {
      setDragTargetList(listId);
    }
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
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-300 bg-slate-100">
      <div className="px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">{board.title}</h2>
            <p className="text-xs text-slate-500 font-medium">{board.description || 'Workspace'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex -space-x-2">
            {[1, 2, 3].map(i => (
              <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + (board.id.length % 10)}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
            ))}
          </div>
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-8 flex items-start gap-6 custom-scrollbar">
        {lists.sort((a, b) => a.position - b.position).map(list => (
          <div 
            key={list.id} 
            className="flex-shrink-0 w-[300px] flex flex-col max-h-full"
            onDragOver={(e) => handleDragOver(e, list.id)}
            onDragLeave={() => setDragTargetList(null)}
            onDrop={(e) => handleDrop(e, list.id)}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-700 text-sm tracking-tight">{list.title}</h3>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {tasks.filter(t => t.listId === list.id).length}
                </span>
              </div>
              <button 
                onClick={() => confirm('Delete this list and all its tasks?') && onDeleteList(list.id)}
                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-white rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className={`flex-1 overflow-y-auto flex flex-col gap-3 min-h-[100px] p-2 rounded-xl transition-all duration-200 ${
              dragTargetList === list.id ? 'bg-indigo-50/50 ring-2 ring-indigo-200 ring-dashed' : 'bg-slate-200/30'
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
            </div>

            <button 
              onClick={() => setActiveListForTask(list.id)}
              className="mt-4 flex items-center justify-center gap-2 py-2.5 w-full bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-200 rounded-xl text-xs font-bold transition-all border border-slate-200 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              ADD TASK
            </button>
          </div>
        ))}

        <div className="flex-shrink-0 w-[300px]">
          {isAddingList ? (
            <form onSubmit={handleAddList} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xl animate-in zoom-in-95">
              <input 
                autoFocus
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="List title..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none mb-3 text-sm font-bold"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-indigo-700">CREATE</button>
                <button type="button" onClick={() => setIsAddingList(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setIsAddingList(true)}
              className="w-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 p-4 rounded-2xl flex items-center justify-center gap-2 border border-slate-300 border-dashed transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-bold text-xs tracking-wider">NEW LIST</span>
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