
import { useState, useEffect, useCallback } from 'react';
import { Board, List, Task, AppState, ViewState, ChatMessage } from './types';

const STORAGE_KEY = 'trellolite_v3_data';

const initialData: AppState = {
  boards: [
    { id: 'welcome-board', title: '🚀 Get Started', description: 'Your first board to help you organize.', createdAt: new Date().toISOString() }
  ],
  lists: [
    { id: 'list-todo', boardId: 'welcome-board', title: 'To Do', position: 0 },
    { id: 'list-doing', boardId: 'welcome-board', title: 'Doing', position: 1 },
    { id: 'list-done', boardId: 'welcome-board', title: 'Done', position: 2 }
  ],
  tasks: [
    { id: 'task-1', listId: 'list-todo', title: 'Try dragging me!', description: 'Move me to the Doing list.', position: 0, createdAt: new Date().toISOString() },
    { id: 'task-2', listId: 'list-todo', title: 'Ask the AI', description: 'Click the chat bubble in the bottom right.', position: 1, createdAt: new Date().toISOString() }
  ],
  activeBoardId: null,
  view: 'boards',
  chatHistory: [
    { role: 'model', content: "Hi! I'm your TrelloLite AI assistant. I can help you organize your workflow, suggest task descriptions, or even create tasks for you directly. How can I assist today?" }
  ]
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialData;
    } catch {
      return initialData;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setView = useCallback((view: ViewState, boardId: string | null = null) => {
    setState(prev => ({ ...prev, view, activeBoardId: boardId }));
  }, []);

  const addBoard = useCallback((title: string, description: string) => {
    const id = `b-${Date.now()}`;
    const newBoard: Board = { id, title, description, createdAt: new Date().toISOString() };
    const defaultLists: List[] = [
      { id: `l-${id}-1`, boardId: id, title: 'To Do', position: 0 },
      { id: `l-${id}-2`, boardId: id, title: 'In Progress', position: 1 },
      { id: `l-${id}-3`, boardId: id, title: 'Done', position: 2 }
    ];
    setState(prev => ({
      ...prev,
      boards: [newBoard, ...prev.boards],
      lists: [...prev.lists, ...defaultLists]
    }));
    return id;
  }, []);

  const deleteBoard = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      boards: prev.boards.filter(b => b.id !== id),
      lists: prev.lists.filter(l => l.boardId !== id),
      tasks: prev.tasks.filter(t => {
        const list = prev.lists.find(l => l.id === t.listId);
        return list && list.boardId !== id;
      }),
      view: prev.activeBoardId === id ? 'boards' : prev.view,
      activeBoardId: prev.activeBoardId === id ? null : prev.activeBoardId
    }));
  }, []);

  const addList = useCallback((boardId: string, title: string) => {
    const newList: List = {
      id: `l-${Date.now()}`,
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
      id: `t-${Date.now()}`,
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

  const moveTask = useCallback((taskId: string, targetListId: string) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (!task) return prev;
      
      return {
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, listId: targetListId } : t)
      };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  }, []);

  const addChatMessage = useCallback((message: ChatMessage) => {
    setState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, message].slice(-50)
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
