
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { MessageSquare, Send, X, Bot, Loader2, Sparkles, Trash2, Zap } from 'lucide-react';

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
      description: 'Creates a new task in a specified list. Useful when user says "Add a task to To Do list called Fix Bugs"',
      properties: {
        listId: { type: Type.STRING, description: 'The exact ID of the list.' },
        title: { type: Type.STRING, description: 'The title of the task.' },
        description: { type: Type.STRING, description: 'Description of the task.' },
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
      
      const activeLists = store.activeBoardId 
        ? store.lists.filter((l: any) => l.boardId === store.activeBoardId) 
        : [];
      
      const context = `
        Context:
        Active Board: ${store.activeBoardId ? store.boards.find((b:any) => b.id === store.activeBoardId)?.title : 'None'}
        Lists Available: ${activeLists.map((l:any) => `${l.title} (ID: ${l.id})`).join(', ')}
        Recent Tasks: ${store.tasks.slice(-5).map((t:any) => t.title).join(', ')}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `${context}\n\nUser Question: ${userMessage}` }] }
        ],
        config: {
          systemInstruction: "You are a smart Project Manager Assistant for TrelloLite. You are proactive and helpful. You can use the create_task tool to actually add tasks to the board. If the user doesn't specify which list, ask them. If no board is active, tell them to open a board first. Use Markdown for formatting.",
          tools: [{ functionDeclarations: [createTaskTool] }],
        },
      });

      const fc = response.functionCalls?.[0];
      if (fc && fc.name === 'create_task') {
        const args = fc.args as any;
        store.addTask(args.listId, args.title, args.description || '');
        store.addChatMessage({ role: 'model', content: `Done! I've added "**${args.title}**" to your list. ✅` });
      } else {
        const text = response.text;
        store.addChatMessage({ role: 'model', content: text || "I understood, but couldn't generate a text response." });
      }
    } catch (error) {
      console.error(error);
      store.addChatMessage({ role: 'model', content: "Oops! I hit a snag connecting to the brain. Check your connection or API key." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-2xl shadow-xl transition-all duration-500 z-50 flex items-center gap-2 ${
          isOpen ? 'bg-slate-800 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && <span className="font-bold text-xs uppercase tracking-widest px-2">Ask AI</span>}
      </button>

      <div
        className={`fixed bottom-24 right-6 w-[380px] max-w-[90vw] h-[550px] max-h-[75vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col z-50 transition-all duration-300 transform ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-indigo-50/40 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">AI Assistant</h3>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>
          <button onClick={store.clearChat} className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-50/20">
          {store.chatHistory.map((msg: any, i: number) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                <span className="text-xs font-medium italic">Processing...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-5 border-t border-slate-100 bg-white rounded-b-3xl">
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to summarize or add a task..."
              className="w-full pl-4 pr-12 py-3 bg-slate-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none text-sm transition-all"
            />
            <button
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 top-1.5 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>AI Guided Productivity</span>
          </div>
        </form>
      </div>
    </>
  );
};
