import React, { useState } from 'react';
import { Task } from '../types.ts';
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
      if (target) target.style.opacity = '0.5';
    }, 0);
  };

  const onDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    const target = e.target as HTMLElement;
    if (target) target.style.opacity = '1';
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-xl border-2 border-indigo-500 shadow-xl animate-in zoom-in-95">
        <input 
          autoFocus
          className="w-full text-sm font-bold mb-2 outline-none p-2 bg-slate-50 rounded-lg border border-slate-100"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea 
          className="w-full text-xs text-slate-500 mb-4 outline-none resize-none p-2 bg-slate-50 rounded-lg border border-slate-100"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:bg-slate-50 rounded-lg">CANCEL</button>
          <button onClick={handleUpdate} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold">SAVE</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing relative ${
        isDragging ? 'rotate-1' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-2 pr-6">
          <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 mt-0.5 flex-shrink-0" />
          <h4 className="text-sm font-bold text-slate-800 leading-tight">{task.title}</h4>
        </div>
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1 absolute top-3 right-3">
          <button onClick={() => setIsEditing(true)} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit3 className="w-3.5 h-3.5" /></button>
          <button onClick={() => confirm('Delete task?') && onDelete()} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold tracking-wider">
          <Calendar className="w-3 h-3" />
          <span>{new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.id}`} className="w-5 h-5 rounded-full border border-slate-100 shadow-sm" />
      </div>
    </div>
  );
};