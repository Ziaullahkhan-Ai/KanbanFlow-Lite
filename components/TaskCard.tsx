
import React, { useState } from 'react';
import { Task } from '../types';
import { Trash2, Edit3, Check, X, Calendar, AlignLeft } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
  onUpdate: (updates: Partial<Task>) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleUpdate = () => {
    onUpdate({ title, description });
    setIsEditing(false);
  };

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('sourceListId', task.listId);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-3 rounded-xl border-2 border-indigo-500 shadow-lg">
        <input 
          autoFocus
          className="w-full text-sm font-semibold mb-2 outline-none p-1 border-b border-slate-100"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea 
          className="w-full text-xs text-slate-500 mb-3 outline-none resize-none p-1 bg-slate-50 rounded"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => setIsEditing(false)}
            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
          <button 
            onClick={handleUpdate}
            className="bg-indigo-600 text-white p-1.5 rounded hover:bg-indigo-700"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      className="group bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">{task.title}</h4>
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      {task.description && (
        <div className="flex items-start gap-1.5 text-slate-400 mb-2">
          <AlignLeft className="w-3 h-3 mt-0.5" />
          <p className="text-[11px] line-clamp-2 leading-relaxed">{task.description}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-50">
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
          <Calendar className="w-3 h-3" />
          <span>{new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex -space-x-1">
          <img src={`https://picsum.photos/seed/${task.id}/20/20`} className="w-4 h-4 rounded-full border border-white" />
        </div>
      </div>
    </div>
  );
};
