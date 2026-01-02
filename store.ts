
import { useState, useEffect, useCallback } from 'react';
import { Board, List, Task, AppState, ViewState, ChatMessage } from './types';

const STORAGE_KEY = 'trellolite_data_v2';

const initialData: AppState = {
  boards: [
    { id: 'b1', title: '🚀 Launch Project', description: 'Everything needed for the big launch.', createdAt: new Date().toISOString() }
  ],
  lists: [
    { id: 'l1', boardId: 'b1', title: 'To Do', position: 0 },
    { id: 'l2', boardId: 'b1', title: 'In Progress', position: 1 },
    { id: 'l3', boardId: 'b1', title: 'Done', position: 2 }
  ],
  tasks: [
    { id: 't1', listId: 'l1', title: 'Design landing page', description: 'Create high-fidelity mockups for the home page.', position: 0, createdAt: new Date().toISOString() },
    { id: 't2', listId: 'l1', title: 'API Integration', description: 'Connect the frontend to the backend services.', position: 1, createdAt: new Date().toISOString() }
  ],
  activeBoardId: null,
  view: 'boards',
  chatHistory: [
    { role: 'model', content: 'Hello! I am your TrelloLite assistant. I can help you organize your boards, suggest tasks, or even create them for you. How can I help today?' }
  ]
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setView = useCallback((view: ViewState, boardId: string | null = null) => {
    setState(prev => ({ ...prev, view, activeBoardId: boardId }));
  }, []);

  const addBoard = useCallback((title: string, description: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newBoard: Board = { id, title, description, createdAt: new Date().toISOString() };
    const defaultLists: List[] = [
      { id: `l-${id}-1`, boardId: id, title: 'To Do', position: 0 },
      { id: `l-${id}-2`, boardId: id, title: 'Doing', position: 1 },
      { id: `l-${id}-3`, boardId: id, title: 'Done', position: 2 }
    ];
    setState(prev => ({
      ...prev,
      boards: [...prev.boards, newBoard],
      lists: [...prev.lists, ...defaultLists]
    }));
    return id;
  }, []);

  const deleteBoard = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      boards: prev.boards.filter(b => b.id !== id),
      lists: prev.lists.filter(l => l.boardId !== id),
      tasks: prev.tasks.filter(t => !prev.lists.find(l => l.id === t.listId && l.boardId === id)),
      view: prev.activeBoardId === id ? 'boards' : prev.view,
      activeBoardId: prev.activeBoardId === id ? null : prev.activeBoardId
    }));
  }, []);

  const addList = useCallback((boardId: string, title: string) => {
    const newList: List = {
      id: Math.random().toString(36).substr(2, 9),
      boardId,
      title,
      position: state.lists.filter(l => l.boardId === boardId).length
    };
    setState(prev => ({ ...prev, lists: [...prev.lists, newList] }));
  }, [state.lists]);

  const deleteList = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      lists: prev.lists.filter(l => l.id !== id),
      tasks: prev.tasks.filter(t => t.listId !== id)
    }));
  }, []);

  const addTask = useCallback((listId: string, title: string, description: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      listId,
      title,
      description,
      position: state.tasks.filter(t => t.listId === listId).length,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    return newTask;
  }, [state.tasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  }, []);

  const moveTask = useCallback((taskId: string, targetListId: string, newPosition: number) => {
    setState(prev => {
      const otherTasks = prev.tasks.filter(t => t.id !== taskId);
      const taskToMove = prev.tasks.find(t => t.id === taskId);
      if (!taskToMove) return prev;

      const updatedTask = { ...taskToMove, listId: targetListId, position: newPosition };
      return { ...prev, tasks: [...otherTasks, updatedTask] };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  }, []);

  const addChatMessage = useCallback((message: ChatMessage) => {
    setState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, message].slice(-50) // Keep last 50
    }));
  }, []);

  const clearChat = useCallback(() => {
    setState(prev => ({ ...prev, chatHistory: initialData.chatHistory }));
  }, []);

  return {
    ...state,
    setView,
    addBoard,
    deleteBoard,
    addList,
    deleteList,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addChatMessage,
    clearChat
  };
}
