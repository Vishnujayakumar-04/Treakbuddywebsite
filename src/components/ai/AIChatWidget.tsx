'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, limit, serverTimestamp } from 'firebase/firestore';
import { aiService } from '@/services/ai';
import { getLocalResponse } from '@/utils/localKnowledge';
import { usePathname } from 'next/navigation';
import { MASTER_SYSTEM_PROMPT } from '@/lib/prompts';

const PUDUCHERRY_SYSTEM_PROMPT = MASTER_SYSTEM_PROMPT;

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! I'm your Puducherry Guide. Ask me about beaches, history, or local food!",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Auto-open on chat page
    useEffect(() => {
        if (pathname === '/dashboard/chat') {
            setIsOpen(true);
        }
    }, [pathname]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userText = inputText.trim();
        const userMessage: Message = {
            id: Date.now().toString(),
            text: userText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        try {
            // 1. Check Local Knowledge (Priority: Instant & Offline)
            const localAnswer = getLocalResponse(userText);
            if (localAnswer) {
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        text: localAnswer,
                        sender: 'bot',
                        timestamp: new Date()
                    }]);
                    setIsTyping(false);
                }, 500);
                return;
            }

            // 2. Check Firestore Cache
            try {
                const cacheQuery = query(
                    collection(db, 'ai_cache'),
                    where('question', '==', userText.toLowerCase()),
                    limit(1)
                );
                const cacheSnapshot = await getDocs(cacheQuery);

                if (!cacheSnapshot.empty) {
                    const cachedData = cacheSnapshot.docs[0].data();
                    setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        text: cachedData.answer,
                        sender: 'bot',
                        timestamp: new Date()
                    }]);
                    setIsTyping(false);
                    return;
                }
            } catch (cacheError) {
                // 3. Use Groq AI
                try {
                    const chatHistory = [...messages, userMessage]
                        .slice(-6)
                        .map(m => `${m.sender === 'user' ? 'User' : 'Guide'}: ${m.text}`)
                        .join('\n');

                    const fullPrompt = `${chatHistory}\nUser: ${userText}\nGuide:`;
                    const responseText = await aiService.generateResponse(fullPrompt, PUDUCHERRY_SYSTEM_PROMPT);

                    const botMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        text: responseText,
                        sender: 'bot',
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, botMessage]);

                    // 4. Save to Firestore Cache (Async, best-effort)
                    addDoc(collection(db, 'ai_cache'), {
                        question: userText.toLowerCase(),
                        answer: responseText,
                        createdAt: serverTimestamp()
                    }).catch(() => { /* ignore cache write failures */ });

                } catch (error: unknown) {
                    console.error('AI response error:', error);

                    let fallbackText = "I'm having trouble connecting to Groq AI.";
                    const errorStr = (error instanceof Error) ? error.message : String(error);

                    if (errorStr?.includes('fetch') || errorStr?.includes('Failed') || errorStr?.includes('API_KEY')) {
                        fallbackText = "I can't reach Groq AI. Please check your API key configuration.\n\nTry asking about:\n• Popular Beaches\n• Heritage Sites\n• Best Cafes";
                    } else {
                        fallbackText = "That took longer than expected. Please try again.\n\nAsk me about:\n• Bike Rentals\n• Ashrams\n• Local Food";
                    }

                    setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        text: fallbackText,
                        sender: 'bot',
                        timestamp: new Date()
                    }]);
                }
            }
        } finally {
            setIsTyping(false);
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: Date.now().toString(),
                text: "Chat cleared. Ask me something new!",
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="fixed bottom-6 right-6 z-50"
            >
                {!isOpen && (
                    <Button
                        onClick={() => setIsOpen(true)}
                        size="lg"
                        className="h-16 w-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 group"
                    >
                        <Bot className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </span>
                    </Button>
                )}
            </motion.div>

            {/* Chat Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[85vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">TrekBuddy AI</h3>
                                    <p className="text-xs text-cyan-100">Local Expert • Online</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={clearChat} className="h-8 w-8 text-white hover:bg-white/20 rounded-full" title="Clear Chat">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-white hover:bg-white/20 rounded-full">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}
                                >
                                    <Avatar className={`h-8 w-8 shrink-0 ${message.sender === 'bot' ? 'ring-1 ring-cyan-200' : 'ring-1 ring-slate-200'}`}>
                                        {message.sender === 'bot' ? (
                                            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs"><Bot className="w-4 h-4" /></AvatarFallback>
                                        ) : (
                                            <AvatarFallback className="bg-slate-800 text-white text-xs"><User className="w-4 h-4" /></AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div
                                        className={`max-w-[80%] px-4 py-2.5 text-sm rounded-2xl shadow-sm whitespace-pre-wrap ${message.sender === 'user'
                                            ? 'bg-cyan-600 text-white rounded-br-none'
                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                                            }`}
                                    >
                                        {message.text}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-3 items-end">
                                    <Avatar className="h-8 w-8 ring-1 ring-cyan-200">
                                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs"><Bot className="w-4 h-4" /></AvatarFallback>
                                    </Avatar>
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
                            <form onSubmit={handleSendMessage} className="relative flex items-center">
                                <Input
                                    placeholder="Type a message..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="pr-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-cyan-500 rounded-full"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className={`absolute right-1 w-8 h-8 rounded-full transition-all ${inputText.trim() ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
                                    disabled={!inputText.trim() || isTyping}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                            <div className="flex justify-center mt-2 gap-4 text-[10px] text-slate-400 font-medium">
                                <span className="hover:text-cyan-600 cursor-pointer">Local Transport</span>
                                <span className="hover:text-cyan-600 cursor-pointer">Best Food</span>
                                <span className="hover:text-cyan-600 cursor-pointer">History</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
