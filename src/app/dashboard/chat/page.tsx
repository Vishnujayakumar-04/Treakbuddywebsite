'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Trash2, Sparkles, Zap, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

import { getAIResponse, getAIResponseStream } from '@/services/chatService';

const SUGGESTION_CHIPS = [
    { label: 'What are the best beaches in Pondicherry?', query: 'What are the best beaches in Pondicherry?' },
    { label: 'Recommend a 2-day itinerary', query: 'Create a 2-day itinerary for Pondicherry' },
    { label: 'Best French restaurants to try', query: 'Recommend the best French restaurants in Pondicherry' },
    { label: 'Best shopping spots', query: 'Where are the best shopping spots?' },
];

export default function AIChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Namaste! 🙏 I'm your TrekBuddy AI guide. I know everything about Pondicherry – from the best sunrise spots at Promenade Beach to hidden French cafés in White Town. How can I help you plan your perfect trip today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (text?: string) => {
        const userText = (text || inputText).trim();
        if (!userText) return;

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
            // Create placeholder message
            const botMessageId = (Date.now() + 1).toString();
            const botMessage: Message = {
                id: botMessageId,
                text: '', // Start empty
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);

            // Stream response
            let fullText = '';
            for await (const chunk of getAIResponseStream(userText)) {
                fullText += chunk;
                if (fullText.length > 0) setIsTyping(false);
                setMessages(prev => prev.map(msg =>
                    msg.id === botMessageId ? { ...msg, text: fullText } : msg
                ));
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I encountered a connection error. Please try again.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage();
    };

    const clearChat = () => {
        setMessages([{
            id: Date.now().toString(),
            text: "Chat cleared. What else can I help you with?",
            sender: 'bot',
            timestamp: new Date()
        }]);
        toast.success('Chat history cleared');
    };

    const showSuggestions = messages.length <= 1;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            {/* Header */}
            <div className="flex-none border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl z-10">
                <div className="container max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-white shadow-sm border border-slate-100">
                                <div className="h-10 w-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white font-display tracking-tight">
                                TrekBuddy AI Guide
                            </h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Online • Ask me anything about Pondicherry</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 container max-w-4xl mx-auto">
                <div className="py-3 text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full">
                        Today
                    </span>
                </div>

                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.sender === 'bot' && (
                                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/15 shrink-0 mt-1">
                                    <Bot className="w-4 h-4" />
                                </div>
                            )}

                            <div
                                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed transition-all
                                    ${message.sender === 'user'
                                        ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-tr-md shadow-lg shadow-slate-900/15'
                                        : 'bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-md shadow-md shadow-slate-900/5 backdrop-blur-sm'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap">{message.text}</div>
                                <div className={`text-[10px] mt-2 text-right ${message.sender === 'user' ? 'text-white/50' : 'text-slate-400'}`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            {message.sender === 'user' && (
                                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 mt-1">
                                    <User className="w-4 h-4" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Suggestion Chips */}
                {showSuggestions && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap gap-2 justify-center pt-4"
                    >
                        {SUGGESTION_CHIPS.map((chip) => (
                            <motion.button
                                key={chip.label}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSendMessage(chip.query)}
                                className="px-5 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all shadow-sm"
                            >
                                {chip.label}
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {/* Typing indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 justify-start"
                    >
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-md px-5 py-4 flex items-center gap-2 shadow-md">
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce"></span>
                            </div>
                            <span className="text-xs text-slate-400 ml-2 font-medium">Thinking...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-none p-4 pb-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80">
                <form onSubmit={handleSubmit} className="container max-w-4xl mx-auto relative">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5 focus-within:border-cyan-300/50 dark:focus-within:border-cyan-700/50 transition-colors">
                            <Sparkles className="w-4 h-4 text-slate-400 ml-5 shrink-0" />
                            <Input
                                placeholder="Ask about places, food, itineraries..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="flex-1 h-14 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base pl-3 pr-14 placeholder:text-slate-400"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-2 h-10 w-12 rounded-xl bg-rose-400 hover:bg-rose-500 text-white shadow-lg shadow-rose-400/20 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!inputText.trim() || isTyping}
                            >
                                <Send className="w-5 h-5 ml-1" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-3 text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <p className="text-[11px] font-medium">
                            Powered by TrekBuddy AI • Your Pondicherry expert
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
