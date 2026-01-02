
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { MessageSquare, Send, X, Bot, Loader2, Sparkles, Trash2 } from 'lucide-react';

interface ChatBotProps {
  store: any;
}

export const ChatBot: React.FC<ChatBotProps> = ({ store }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [store.chatHistory, isOpen]);

  const createTaskTool: FunctionDeclaration = {
    name: 'create_task',
    parameters: {
      type: Type.OBJECT,
      description: 'Create a new task in a specific list on the current board.',
      properties: {
        listId: { type: Type.STRING, description: 'The ID of the list to add the task to.' },
        title: { type: Type.STRING, description: 'The title of the task.' },
        description: { type: Type.STRING, description: 'Detailed description of the task.' },
      },
      required: ['listId', 'title'],
    },
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    store.addChatMessage({ role: 'user', content: userMessage });
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Build context of current state for the AI
      const currentBoard = store.boards.find((b: any) => b.id === store.activeBoardId);
      const activeLists = store.activeBoardId ? store.lists.filter((l: any) => l.boardId === store.activeBoardId) : [];
      
      const context = `
        Current View: ${store.view}
        Active Board: ${currentBoard ? currentBoard.title : 'None selected'}
        Available Boards: ${store.boards.map((b: any) => `${b.title} (ID: ${b.id})`).join(', ')}
        ${store.activeBoardId ? `Active Lists on this board: ${activeLists.map((l: any) => `${l.title} (ID: ${l.id})`).join(', ')}` : ''}
        Total Tasks Count: ${store.tasks.length}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `CONTEXT:\n${context}\n\nUSER MESSAGE: ${userMessage}` }] }
        ],
        config: {
          systemInstruction: "You are TrelloLite Assistant, a highly efficient project manager. Help users organize tasks, suggest workflows, and summarize project progress. You can create tasks using the tools provided if the user requests it. If they ask to create a task but no board/list is active, ask them which one to use. Keep responses concise and professional.",
          tools: [{ functionDeclarations: [createTaskTool] }],
        },
      });

      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        for (const fc of functionCalls) {
          if (fc.name === 'create_task') {
            const { listId, title, description } = fc.args as any;
            store.addTask(listId, title, description || '');
            store.addChatMessage({ role: 'model', content: `✅ I've created the task "${title}" for you!` });
          }
        }
      } else {
        const text = response.text;
        if (text) {
          store.addChatMessage({ role: 'model', content: text });
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      store.addChatMessage({ role: 'model', content: "I'm sorry, I encountered an error. Please check your API key or try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-[60] flex items-center gap-2 group ${
          isOpen ? 'bg-slate-800 text-white rotate-90 scale-90' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <>
            <MessageSquare className="w-6 h-6" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-medium whitespace-nowrap">
              Ask Assistant
            </span>
          </>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[600px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-[60] transition-all duration-300 transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-none">AI Assistant</h3>
              <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">Powered by Gemini</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={store.clearChat}
              title="Clear conversation"
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-400 hover:bg-white rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30"
        >
          {store.chatHistory.map((msg: any, i: number) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-400 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white rounded-b-2xl">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to suggest tasks or create them..."
              className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
            />
            <button
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Try "List my boards" or "Add a task to To Do titled Refactor CSS"</span>
          </div>
        </form>
      </div>
    </>
  );
};
