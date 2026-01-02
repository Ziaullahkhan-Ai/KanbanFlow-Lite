
import React, { useState } from 'react';
import { Task } from '../types';
import { Trash2, Edit3, Check, X, Calendar, AlignLeft, GripVertical } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
  onUpdate: (updates: Partial<Task>) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpdate = () => {
    if (title.trim()) {
      onUpdate({ title, description });
      setIsEditing(false);
    }
  };

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('sourceListId', task.listId);
    setIsDragging(true);
    // Visual feedback for drag
    setTimeout(() => {
      const target = e.target as HTMLElement;
      target.style.opacity = '0.4';
    }, 0);
  };

  const onDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-2xl border-2 border-indigo-500 shadow-2xl animate-in zoom-in-95 duration-150">
        <input 
          autoFocus
          className="w-full text-sm font-bold mb-2 outline-none p-2 bg-slate-50 rounded-lg border border-slate-100 focus:border-indigo-200"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
        />
        <textarea 
          className="w-full text-xs text-slate-500 mb-4 outline-none resize-none p-2 bg-slate-50 rounded-lg border border-slate-100 focus:border-indigo-200"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details..."
        />
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => {
              setTitle(task.title);
              setDescription(task.description);
              setIsEditing(false);
            }}
            className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
          >
            CANCEL
          </button>
          <button 
            onClick={handleUpdate}
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            SAVE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-grab active:cursor-grabbing relative overflow-hidden ${
        isDragging ? 'rotate-2 scale-95 ring-2 ring-indigo-500' : ''
      }`}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-2 pr-6">
          <GripVertical className="w-4 h-4 text-slate-200 group-hover:text-slate-400 mt-0.5 flex-shrink-0" />
          <h4 className="text-sm font-bold text-slate-800 leading-snug break-words">{task.title}</h4>
        </div>
        <div className="flex opacity-0 group-hover:opacity-100 transition-all gap-1 absolute top-3 right-3">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); if(confirm('Delete task?')) onDelete(); }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {task.description && (
        <div className="flex items-start gap-2 text-slate-400 mb-4 bg-slate-50/50 p-2 rounded-xl">
          <AlignLeft className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] line-clamp-3 leading-relaxed font-medium">{task.description}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <Calendar className="w-3 h-3" />
          <span>{new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex -space-x-1.5">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.id}`} 
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm" 
            alt="assignee"
          />
        </div>
      </div>
    </div>
  );
};
