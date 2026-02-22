'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, X, Send, Bot, Sparkles, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { getAIResponse } from '@/services/chatService';

export function AIWidget() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const isPlanner = pathname.includes('planner');
    const isExplore = pathname.includes('categories');

    // Hide widget on the dedicated chat page to avoid duplication
    if (pathname === '/dashboard/chat') return null;

    // Context-aware suggestion
    const suggestion = isPlanner
        ? "Help me plan a 3-day relaxation trip..."
        : isExplore
            ? "What are the best hidden beaches?"
            : "Suggest a good cafe in White Town.";

    return (
        <div className="fixed bottom-6 right-6 z-50 print:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative flex items-center justify-center p-0"
                    >
                        <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
                        <div className="relative h-14 w-14 rounded-full bg-slate-900 hover:bg-black text-white shadow-2xl flex items-center justify-center border border-slate-700/50">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <span className="absolute right-full mr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Ask AI Guide
                        </span>
                    </motion.button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[100vw] sm:w-[400px] p-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col shadow-2xl">

                    {/* Header */}
                    <div className="flex-none p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">TrekBuddy AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <p className="text-xs text-slate-500 font-medium">Online • Context Aware</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-hidden relative">
                        <AIChatLogic defaultSuggestion={suggestion} />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

function AIChatLogic({ defaultSuggestion }: { defaultSuggestion: string }) {
    const [messages, setMessages] = useState<{ id: string, text: string, sender: 'bot' | 'user' }[]>([
        { id: '1', text: "Hello! I'm your Puducherry guide. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now().toString(), text, sender: 'user' as const };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const reply = await getAIResponse(text);

            const botMsg = {
                id: (Date.now() + 1).toString(),
                text: reply,
                sender: 'bot' as const
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                text: "My connection to the cloud seems foggy. Please try again.",
                sender: 'bot' as const
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'bot' && (
                            <Avatar className="h-8 w-8 mt-0.5 border border-slate-100 bg-white">
                                <AvatarFallback className="bg-cyan-50 text-cyan-600"><Bot className="w-4 h-4" /></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                            ? 'bg-slate-900 text-white rounded-tr-sm'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3">
                        <Avatar className="h-8 w-8 mt-0.5 border border-slate-100 bg-white">
                            <AvatarFallback className="bg-cyan-50 text-cyan-600"><Bot className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}

                {messages.length === 1 && !isTyping && (
                    <div className="mt-4">
                        <p className="text-xs text-slate-400 font-medium mb-3 uppercase tracking-wider text-center">Suggested</p>
                        <button
                            onClick={() => handleSend(defaultSuggestion)}
                            className="w-full text-left p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all flex items-center gap-3 group"
                        >
                            <Sparkles className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
                            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 font-medium truncate">
                                "{defaultSuggestion}"
                            </span>
                        </button>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                    className="relative flex items-center gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 h-12 rounded-full border-slate-200 bg-slate-50 focus:bg-white focus:ring-cyan-500/20 pr-12 transition-all"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-1 w-10 h-10 rounded-full bg-slate-900 hover:bg-black text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}

