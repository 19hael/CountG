"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, X, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hola. Soy **Vixai**, tu estratega de negocios personal.\n\nEstoy conectado a internet y listo para analizar datos en tiempo real. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, citations: data.citations }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Lo siento, tuve un problema al conectar con mis servidores. Por favor verifica tu conexión o intenta más tarde." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat reiniciado. ¿En qué más puedo ayudarte?' }]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 border border-white/10 flex items-center gap-2"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 animate-pulse" />}
        {!isOpen && <span className="font-medium pr-1">Asistente IA</span>}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] flex flex-col bg-[#0a0b1e] border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden glass backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-indigo-900/20 border-b border-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Vixai AI</h3>
                  <p className="text-xs text-indigo-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online & Real-time
                  </p>
                </div>
              </div>
              <button 
                onClick={clearChat}
                className="p-2 hover:bg-white/5 rounded-lg text-indigo-200/60 hover:text-white transition-colors"
                title="Limpiar chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex w-full",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm",
                      msg.role === 'user'
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-white/5 text-indigo-100 rounded-tl-none border border-white/5"
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-xs font-semibold text-indigo-300 mb-1">Fuentes:</p>
                            <ul className="list-disc pl-4 space-y-0.5">
                              {msg.citations.map((cit, idx) => (
                                <li key={idx} className="text-[10px] text-indigo-200/60 truncate max-w-[250px]">
                                  {cit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span className="text-xs text-indigo-200 animate-pulse">Consultando fuentes en tiempo real...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-indigo-500/20 bg-black/20 backdrop-blur-md">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Pregunta sobre finanzas, mercado o tu negocio..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3.5 text-sm text-white placeholder:text-indigo-200/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all shadow-inner"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-center text-indigo-200/20 mt-2">
                Potenciado por Perplexity AI. La información puede variar.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
