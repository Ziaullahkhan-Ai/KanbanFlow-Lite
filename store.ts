
import { useState, useEffect, useCallback } from 'react';
import { Board, List, Task, AppState, ViewState } from './types';

const STORAGE_KEY = 'trellolite_data';

const initialData: AppState = {
  boards: [
    { id: 'b1', title: 'Welcome Board', description: 'Start managing your tasks here!', createdAt: new Date().toISOString() }
  ],
  lists: [
    { id: 'l1', boardId: 'b1', title: 'To Do', position: 0, tasks: [] },
    { id: 'l2', boardId: 'b1', title: 'Doing', position: 1, tasks: [] },
    { id: 'l3', boardId: 'b1', title: 'Done', position: 2, tasks: [] }
  ],
  tasks: [
    { id: 't1', listId: 'l1', title: 'Example Task', description: 'Drag me around!', position: 0, createdAt: new Date().toISOString() }
  ],
  activeBoardId: null,
  view: 'boards'
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
    const newBoard: Board = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      boards: [...prev.boards, newBoard]
    }));
  }, []);

  const updateBoard = useCallback((id: string, updates: Partial<Board>) => {
    setState(prev => ({
      ...prev,
      boards: prev.boards.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
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
      position: state.lists.filter(l => l.boardId === boardId).length,
      tasks: []
    };
    setState(prev => ({
      ...prev,
      lists: [...prev.lists, newList]
    }));
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
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  }, [state.tasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  }, []);

  const moveTask = useCallback((taskId: string, targetListId: string, newPosition: number) => {
    setState(prev => {
      const taskIndex = prev.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;

      const newTasks = [...prev.tasks];
      const [movedTask] = newTasks.splice(taskIndex, 1);
      
      movedTask.listId = targetListId;
      movedTask.position = newPosition;

      // Simple re-index logic for tasks in the affected lists
      // In a real app we'd need more complex logic for insertion
      return { ...prev, tasks: [...newTasks, movedTask] };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  }, []);

  return {
    ...state,
    setView,
    addBoard,
    updateBoard,
    deleteBoard,
    addList,
    deleteList,
    addTask,
    updateTask,
    deleteTask,
    moveTask
  };
}
