'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Laptop, Settings as SettingsIcon, Globe, Palette, Check } from 'lucide-react';
import { toast } from 'sonner';

const THEME_OPTIONS = [
    { value: 'light', label: 'Light', icon: Sun, desc: 'Clean & bright', color: 'from-amber-400 to-orange-500' },
    { value: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes', color: 'from-indigo-500 to-purple-600' },
    { value: 'system', label: 'System', icon: Laptop, desc: 'Match your OS', color: 'from-slate-500 to-slate-700' },
];

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    const handleSave = () => {
        toast.success('Settings saved successfully');
    };

    return (
        <div className="min-h-screen pb-24">
            {/* Header */}
            <div className="container max-w-3xl mx-auto px-4 md:px-6 pt-8 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                            <SettingsIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Settings</h1>
                            <p className="text-sm text-slate-500">Manage your application preferences</p>
                        </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent dark:from-slate-800 dark:via-slate-900" />
                </motion.div>
            </div>

            <div className="container max-w-3xl mx-auto px-4 md:px-6 space-y-6">
                {/* Theme Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
                                <Palette className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Appearance</h3>
                                <p className="text-xs text-slate-500">Customize the look and feel</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 block">Theme</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {THEME_OPTIONS.map(opt => (
                                <motion.button
                                    key={opt.value}
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setTheme(opt.value)}
                                    className={`relative p-5 rounded-xl text-left transition-all duration-300 border-2 ${theme === opt.value
                                            ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-50/50 dark:bg-cyan-900/10 shadow-md shadow-cyan-500/10'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                                        }`}
                                >
                                    {/* Selected check */}
                                    {theme === opt.value && (
                                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}

                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                                        <opt.icon className="w-5 h-5" />
                                    </div>
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">{opt.label}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Language Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Language</h3>
                                <p className="text-xs text-slate-500">Select your preferred language</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <Label htmlFor="language" className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">Display Language</Label>
                        <Select defaultValue="en">
                            <SelectTrigger id="language" className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="en">🇬🇧 English</SelectItem>
                                <SelectItem value="fr">🇫🇷 French (Français)</SelectItem>
                                <SelectItem value="ta">🇮🇳 Tamil (தமிழ்)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>

                {/* Save Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-end"
                >
                    <Button
                        onClick={handleSave}
                        className="rounded-xl h-12 px-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold shadow-lg shadow-cyan-500/15 transition-all hover:-translate-y-0.5"
                    >
                        Save Changes
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
