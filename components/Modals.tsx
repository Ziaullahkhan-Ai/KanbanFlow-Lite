
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, desc: string) => void;
  title: string;
  placeholderTitle: string;
  placeholderDesc: string;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, title, placeholderTitle, placeholderDesc }) => {
  const [valTitle, setValTitle] = useState('');
  const [valDesc, setValDesc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valTitle.trim()) {
      onSubmit(valTitle, valDesc);
      setValTitle('');
      setValDesc('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input 
              autoFocus
              type="text"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder={placeholderTitle}
              value={valTitle}
              onChange={(e) => setValTitle(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              rows={4}
              placeholder={placeholderDesc}
              value={valDesc}
              onChange={(e) => setValDesc(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CreateBoardModal: React.FC<Omit<ModalProps, 'title' | 'placeholderTitle' | 'placeholderDesc'>> = (props) => (
  <BaseModal 
    {...props} 
    title="Create New Board" 
    placeholderTitle="e.g. Marketing Project" 
    placeholderDesc="What's this board about?" 
  />
);

export const CreateTaskModal: React.FC<Omit<ModalProps, 'title' | 'placeholderTitle' | 'placeholderDesc'>> = (props) => (
  <BaseModal 
    {...props} 
    title="Add New Task" 
    placeholderTitle="e.g. Fix navbar bug" 
    placeholderDesc="Add some details about this task..." 
  />
);
