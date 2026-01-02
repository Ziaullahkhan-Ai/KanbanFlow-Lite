
import React, { useState } from 'react';
import { useAppStore } from './store';
import { Header } from './components/Header';
import { BoardList } from './components/BoardList';
import { BoardView } from './components/BoardView';
import { CreateBoardModal } from './components/Modals';
import { ChatBot } from './components/ChatBot';

const App: React.FC = () => {
  const store = useAppStore();
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Header 
        onHome={() => store.setView('boards')} 
        onAddBoard={() => setIsCreateBoardOpen(true)} 
      />
      
      <main className="flex-1 overflow-hidden relative">
        {store.view === 'boards' ? (
          <BoardList 
            boards={store.boards} 
            onSelectBoard={(id) => store.setView('board-detail', id)}
            onDeleteBoard={store.deleteBoard}
          />
        ) : (
          <BoardView 
            board={store.boards.find(b => b.id === store.activeBoardId)!}
            lists={store.lists.filter(l => l.boardId === store.activeBoardId)}
            tasks={store.tasks}
            onAddList={(title) => store.addList(store.activeBoardId!, title)}
            onDeleteList={store.deleteList}
            onAddTask={store.addTask}
            onUpdateTask={store.updateTask}
            onDeleteTask={store.deleteTask}
            onMoveTask={store.moveTask}
          />
        )}
        
        {/* Chatbot is always available */}
        <ChatBot store={store} />
      </main>

      <CreateBoardModal 
        isOpen={isCreateBoardOpen} 
        onClose={() => setIsCreateBoardOpen(false)} 
        onSubmit={(title, desc) => {
          const id = store.addBoard(title, desc);
          store.setView('board-detail', id);
          setIsCreateBoardOpen(false);
        }}
      />
    </div>
  );
};

export default App;
