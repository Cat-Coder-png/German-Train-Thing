
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Terminal, Minimize2, Maximize2 } from 'lucide-react';
import { GeminiRailService } from '../services/geminiService.ts';
import { Train } from '../types.ts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIConsoleProps {
  trains: Train[];
  networkStatusText: string;
}

const AIConsole: React.FC<AIConsoleProps> = ({ trains, networkStatusText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Moin! I'm Casey's ZugRadar AI. How can I help you navigate the German rail network today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const gemini = useRef(new GeminiRailService());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await gemini.current.getAssistantResponse(userMsg, networkStatusText);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-6 right-6 bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl flex items-center gap-3 group hover:border-red-500 transition-all z-40"
      >
        <div className="p-2 bg-red-600 rounded-lg group-hover:scale-110 transition-transform">
          <Bot className="text-white w-5 h-5" />
        </div>
        <div className="text-left">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Rail Assistant</div>
          <div className="text-[10px] text-slate-500">Ask about delays, routes...</div>
        </div>
        <div className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </button>
    );
  }

  return (
    <div className={`absolute bottom-6 right-6 w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-40 flex flex-col transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-800/50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-red-500" />
          <span className="text-xs font-bold text-white uppercase">Casey's ZugRadar AI Console</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-slate-700 rounded text-slate-400">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-700 rounded text-slate-400">
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="p-2 bg-slate-950/50 flex items-center gap-2 border-b border-slate-800">
            <Terminal className="w-3 h-3 text-slate-500" />
            <div className="text-[10px] font-mono text-slate-500 truncate italic">
              System Context: {networkStatusText.slice(0, 60)}...
            </div>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-red-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl text-slate-400 text-sm italic flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  Analyzing rail data...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full bg-slate-800 text-slate-200 pl-4 pr-12 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-red-500 transition-all text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AIConsole;
