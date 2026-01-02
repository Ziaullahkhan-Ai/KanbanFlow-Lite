
export interface Task {
  id: string;
  listId: string;
  title: string;
  description: string;
  position: number;
  createdAt: string;
}

export interface List {
  id: string;
  boardId: string;
  title: string;
  position: number;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export type ViewState = 'boards' | 'board-detail';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AppState {
  boards: Board[];
  lists: List[];
  tasks: Task[];
  activeBoardId: string | null;
  view: ViewState;
  chatHistory: ChatMessage[];
}
