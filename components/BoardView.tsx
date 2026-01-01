
import React, { useState } from 'react';
import { Board, List, Task } from '../types';
import { Plus, X, MoreHorizontal, Trash2 } from 'lucide-react';
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

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListTitle.trim()) {
      onAddList(newListTitle);
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  // Simplified Drag & Drop implementation using standard HTML5 Drag & Drop
  // for lightness in a single-response structure.
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, listId: string) => {
    const taskId = e.dataTransfer.getData('taskId');
    const sourceListId = e.dataTransfer.getData('sourceListId');
    
    if (sourceListId !== listId) {
      onMoveTask(taskId, listId, 0); // Logic for simple list change
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{board.title}</h2>
          <p className="text-sm text-slate-500">{board.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <img 
                key={i} 
                src={`https://picsum.photos/seed/${board.id}${i}/32/32`} 
                className="w-8 h-8 rounded-full border-2 border-white"
                alt="user" 
              />
            ))}
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
              +5
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-slate-50 p-6 flex items-start gap-6">
        {lists.sort((a, b) => a.position - b.position).map(list => (
          <div 
            key={list.id} 
            className="flex-shrink-0 w-80 flex flex-col max-h-full"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, list.id)}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-700">{list.title}</h3>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  {tasks.filter(t => t.listId === list.id).length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => onDeleteList(list.id)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-[50px]">
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
              className="mt-3 flex items-center justify-center gap-2 py-2 w-full text-slate-500 hover:bg-slate-200/50 rounded-lg text-sm font-medium transition-colors border border-dashed border-slate-300 hover:border-slate-400"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        ))}

        <div className="flex-shrink-0 w-80">
          {isAddingList ? (
            <form onSubmit={handleAddList} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <input 
                autoFocus
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Enter list title..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-2"
              />
              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  Add List
                </button>
                <button 
                  type="button"
                  onClick={() => setIsAddingList(false)}
                  className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setIsAddingList(true)}
              className="w-full bg-slate-200/40 hover:bg-slate-200/60 text-slate-600 p-3 rounded-xl flex items-center gap-2 border border-slate-300 border-dashed transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add another list</span>
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
