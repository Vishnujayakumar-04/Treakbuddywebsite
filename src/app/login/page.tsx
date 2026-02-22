'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!auth || !db) {
                throw new Error('Authentication service not available');
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Best-effort Firestore profile check — don't block login if Firestore is unavailable
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    // Profile doesn't exist yet — create it now (e.g. user signed up before Firestore was set up)
                    console.warn(`User ${user.uid} has no Firestore profile, creating one now.`);
                    await setDoc(docRef, {
                        uid: user.uid,
                        userId: user.uid,
                        email: user.email,
                        displayName: user.displayName || '',
                        photoURL: user.photoURL || '',
                        createdAt: serverTimestamp(),
                        preferences: { language: 'en', theme: 'light' },
                        savedPlaces: [],
                        visitedPlaces: []
                    }).catch(() => { /* ignore if this also fails */ });
                }
            } catch (firestoreError) {
                // Don't block login — Firestore rules may not be deployed yet
                console.warn("Firestore profile check skipped (permissions issue):", firestoreError);
            }

            toast.success('Logged in successfully!');
            router.replace(redirectUrl || '/dashboard/planner?welcome=true');

        } catch (error: any) {
            console.error(error);
            let message = 'Failed to login';
            if (error.code) {
                switch (error.code) {
                    case 'auth/invalid-credential': message = 'Invalid email or password.'; break;
                    case 'auth/user-not-found': message = 'No account found with this email.'; break;
                    case 'auth/wrong-password': message = 'Incorrect password.'; break;
                    case 'auth/too-many-requests': message = 'Too many failed attempts. Please try again later.'; break;
                    default: message = error.message;
                }
            } else {
                message = error.message || message;
            }
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left — Visual Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900" />
                <Image src="/images/hero-bg.jpg" alt="Puducherry" fill className="object-cover opacity-60" priority />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/80 via-slate-950/60 to-violet-950/80" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(6,182,212,0.15),transparent_60%)]" />

                {/* Content overlay */}
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white font-bold text-lg border border-white/10">
                            TB
                        </div>
                        <span className="font-bold text-xl text-white/90 tracking-tight">TrekBuddy</span>
                    </Link>

                    <div className="space-y-6 max-w-md">
                        <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                            Your Puducherry
                            <br />
                            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                                adventure awaits.
                            </span>
                        </h2>
                        <p className="text-white/60 text-lg leading-relaxed">
                            AI-powered itineraries, local transit, and a personal guide — all in one place.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-white/40 text-sm">
                        <Sparkles className="w-4 h-4" />
                        Powered by AI intelligence
                    </div>
                </div>
            </div>

            {/* Right — Form Panel */}
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-950 px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[420px] space-y-8"
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-4">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-lg shadow-lg">TB</div>
                            <span className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight">TrekBuddy</span>
                        </Link>
                    </div>

                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                            Welcome back
                        </h1>
                        <p className="text-slate-500 text-base">Sign in to continue your journey.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</Label>
                            <Input
                                id="email" type="email" placeholder="name@example.com" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-cyan-400 dark:focus:border-cyan-600 focus:ring-0 text-base transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</Label>
                                <Link href="/forgot-password" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password" type={showPassword ? 'text' : 'password'} required
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-cyan-400 dark:focus:border-cyan-600 focus:ring-0 text-base pr-12 transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-base shadow-lg shadow-cyan-500/15 transition-all hover:-translate-y-0.5"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white dark:bg-slate-950 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">or continue with</span>
                        </div>
                    </div>

                    {/* Google button */}
                    <Button variant="outline" type="button" className="w-full h-12 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold text-base transition-all">
                        <svg className="mr-2.5 h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </Button>

                    <p className="text-center text-sm text-slate-500">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors">
                            Create one
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-cyan-500 animate-spin" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
