'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Settings as SettingsIcon, LogOut, User, Camera, Shield, Bell, Palette, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { user, userProfile, logout } = useAuth();
    const { favorites } = useFavorites();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [updating, setUpdating] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!storage || !user) {
            toast.error("Storage not available");
            return;
        }

        setUploadingImage(true);
        const toastId = toast.loading("Uploading image...");

        try {
            // Create reference
            const storageRef = ref(storage, `users/${user.uid}/profile_${Date.now()}.jpg`);

            // Upload
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // Update Auth
            await updateProfile(user, { photoURL: downloadURL });

            // Update Firestore
            if (db) {
                await setDoc(doc(db, 'users', user.uid), {
                    photoURL: downloadURL,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
            }

            toast.dismiss(toastId);
            toast.success("Profile picture updated!");

            // Reload to reflect changes globally
            window.location.reload();

        } catch (error) {
            void 0; // console.("Upload failed", error);
            toast.dismiss(toastId);
            toast.error("Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
    };

    useEffect(() => {
        if (userProfile) {
            if (userProfile.displayName) setDisplayName(userProfile.displayName);
            if (userProfile.phone) setPhone(userProfile.phone);
            if (userProfile.dob) setDob(userProfile.dob);
            if (userProfile.gender) setGender(userProfile.gender);
        }
    }, [userProfile]);

    const handleUpdateProfile = async () => {
        setUpdating(true);
        if (user && db) {
            try {
                await setDoc(doc(db, 'users', user.uid), {
                    displayName,
                    phone,
                    dob,
                    gender,
                    email: user.email,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
                toast.success('Profile updated successfully');
            } catch (error) {
                void 0; // console.("Error updating profile:", error);
                toast.error("Failed to update profile");
            }
        } else {
            // Fallback for demo/offline
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Profile updated locally (connect DB for persistence)');
        }
        setUpdating(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center mb-6 shadow-xl">
                    <User className="w-10 h-10 text-cyan-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Please Login</h1>
                <p className="mb-6 text-slate-500">You need to be logged in to view your profile.</p>
                <Button asChild className="rounded-2xl px-8 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg">
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-950 flex flex-col relative">
            {/* Elegant Hero Banner */}
            <div className="absolute top-0 left-0 right-0 h-80 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/60 via-slate-50/10 to-slate-50 dark:from-indigo-950/40 dark:via-slate-950/10 dark:to-slate-950" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.1)_0%,transparent_50%)]" />
            </div>

            <div className="container max-w-6xl mx-auto px-4 md:px-8 mt-8 relative z-10">
                {/* Profile Title Header */}
                <div className="mb-8 p-4">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Your Account</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Manage your personal preferences, saved trips, and platform settings.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar — Profile card */}
                    <div className="w-full lg:w-80 space-y-6 shrink-0">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-slate-800/60 p-8 text-center relative overflow-hidden"
                        >
                            {/* Accent line at top */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-500 to-indigo-500" />

                            {/* Avatar */}
                            <div className="relative inline-block mb-6 mt-2">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-indigo-500 rounded-full blur-xl opacity-30 -z-10 animate-pulse" />
                                <Avatar className="w-28 h-28 ring-[6px] ring-white dark:ring-slate-950 shadow-2xl z-10 transition-transform duration-300 hover:scale-105">
                                    <AvatarImage src={user.photoURL || ''} className="object-cover" />
                                    <AvatarFallback className="text-3xl bg-slate-900 text-white font-black tracking-tighter">
                                        {user.displayName?.substring(0, 2).toUpperCase() || 'TB'}
                                    </AvatarFallback>
                                </Avatar>
                                <label
                                    htmlFor="avatar-upload"
                                    className={`absolute bottom-1 right-1 w-9 h-9 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 hover:scale-110 transition-all cursor-pointer z-20 ${uploadingImage ? 'opacity-50 cursor-not-allowed animate-spin' : ''}`}
                                >
                                    <Camera className="w-4 h-4" />
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImage}
                                    />
                                </label>
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user.displayName || 'Trekker'}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">{user.email}</p>

                            <div className="flex justify-center mb-8">
                                <Badge className="bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50 px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-widest shadow-sm">
                                    <Sparkles className="w-3 h-3 mr-1.5 inline -mt-0.5" /> Explorer Tier
                                </Badge>
                            </div>

                            <Button
                                variant="ghost"
                                className="w-full rounded-2xl h-12 font-bold bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 transition-all"
                                onClick={logout}
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Secure Log Out
                            </Button>
                        </motion.div>

                        {/* Quick Preferences Widget */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-slate-800/60 p-6"
                        >
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 ml-2">Quick Settings</h3>
                            <div className="space-y-2">
                                {[
                                    { icon: Palette, label: 'Theme (Auto)', value: 'System', bg: 'bg-indigo-50 dark:bg-indigo-900/20', color: 'text-indigo-600 dark:text-indigo-400' },
                                    { icon: Bell, label: 'Push Alerts', value: 'Active', bg: 'bg-rose-50 dark:bg-rose-900/20', color: 'text-rose-600 dark:text-rose-400' },
                                    { icon: Shield, label: 'Trip Privacy', value: 'Friends', bg: 'bg-emerald-50 dark:bg-emerald-900/20', color: 'text-emerald-600 dark:text-emerald-400' },
                                ].map(pref => (
                                    <div key={pref.label} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
                                        <div className="flex items-center gap-3.5">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pref.bg} ${pref.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                                <pref.icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{pref.label}</span>
                                        </div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{pref.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        <Tabs defaultValue="saved" className="w-full">
                            {/* Segmented Control UI */}
                            <TabsList className="bg-slate-200/50 dark:bg-slate-900/50 p-1.5 rounded-[1.25rem] shadow-inner mb-8 inline-flex h-14 items-center">
                                <TabsTrigger value="saved" className="gap-2 rounded-xl h-full px-6 font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all text-slate-600">
                                    <Heart className="w-4 h-4" /> Saved Locations
                                </TabsTrigger>
                                <TabsTrigger value="trips" className="gap-2 rounded-xl h-full px-6 font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all text-slate-600">
                                    <MapPin className="w-4 h-4" /> Itineraries
                                </TabsTrigger>
                                <TabsTrigger value="profile" className="gap-2 rounded-xl h-full px-6 font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm transition-all text-slate-600">
                                    <User className="w-4 h-4" /> Edit Details
                                </TabsTrigger>
                            </TabsList>

                            {/* SAVED PLACES TAB */}
                            <TabsContent value="saved" className="mt-0 outline-none">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
                                >
                                    <div className="p-8 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                                        <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">Saved Collections</h3>
                                        <p className="text-slate-500 font-medium mt-1">Destinations and attractions you've bookmarked for future trips.</p>
                                    </div>
                                    {favorites.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-slate-50/20 dark:bg-slate-950/20">
                                            <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-900/10 flex items-center justify-center mb-6 ring-8 ring-rose-50/50 dark:ring-rose-900/5">
                                                <Heart className="w-8 h-8 text-rose-500" />
                                            </div>
                                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Saved Places</h4>
                                            <p className="text-slate-500 font-medium mb-8 max-w-sm">Tap the heart icon on any place card across the app to save it to this collection.</p>
                                            <Button asChild className="rounded-full px-8 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/25">
                                                <Link href="/dashboard/categories">Start Exploring</Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/30 dark:bg-slate-950/30">
                                            {favorites.map((place, index) => (
                                                <Link href={`/dashboard/places/${place.id || 'unknown'}`} key={place.id || `fav-${index}`} className="block group">
                                                    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10">
                                                        <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10" />
                                                            <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm z-20 group-hover:scale-110 transition-transform">
                                                                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                                                            </div>
                                                            <div className="absolute bottom-4 left-4 z-20">
                                                                <div className="flex items-center text-amber-400 text-xs font-black gap-1 drop-shadow-md">
                                                                    <span>★</span> {place.rating}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-5">
                                                            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1.5 tracking-tight group-hover:text-indigo-600 transition-colors">{place.name}</h4>
                                                            <div className="flex items-center text-sm font-medium text-slate-500">
                                                                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                                                {place.location}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            </TabsContent>

                            {/* TRIPS TAB */}
                            <TabsContent value="trips" className="mt-0 outline-none">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
                                >
                                    <div className="p-8 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                                        <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">Active Itineraries</h3>
                                        <p className="text-slate-500 font-medium mt-1">Review and manage your AI-generated travel plans.</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-slate-50/20 dark:bg-slate-950/20">
                                        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center mb-6 ring-8 ring-emerald-50/50 dark:ring-emerald-900/5">
                                            <MapPin className="w-8 h-8 text-emerald-500" />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Trips</h4>
                                        <p className="text-slate-500 font-medium mb-8 max-w-sm">Use our AI planner to generate a hyper-personalized itinerary for your next stay.</p>
                                        <Button asChild className="rounded-full px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/25">
                                            <Link href="/dashboard/planner">Build a Trip</Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            </TabsContent>

                            {/* EDIT PROFILE TAB */}
                            <TabsContent value="profile" className="mt-0 outline-none">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
                                >
                                    <div className="p-8 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                                        <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">Profile Details</h3>
                                        <p className="text-slate-500 font-medium mt-1">Update your identity and personal records securely.</p>
                                    </div>
                                    
                                    <div className="p-8 space-y-8 bg-slate-50/30 dark:bg-slate-950/30">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2.5">
                                                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Display Name</Label>
                                                <Input
                                                    id="name"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    className="h-14 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2.5">
                                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Account Email</Label>
                                                <Input
                                                    id="email"
                                                    value={user.email || ''}
                                                    disabled
                                                    className="h-14 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border-transparent text-slate-500 cursor-not-allowed font-semibold"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <div className="space-y-2.5 mt-2">
                                                <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Mobile Number</Label>
                                                <Input
                                                    id="phone"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="+91 00000 00000"
                                                    className="h-14 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2.5 mt-2">
                                                <Label htmlFor="dob" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Date of Birth</Label>
                                                <Input
                                                    id="dob"
                                                    type="date"
                                                    value={dob}
                                                    onChange={(e) => setDob(e.target.value)}
                                                    className="h-14 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 max-w-sm">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Identity Profile</Label>
                                            <Select value={gender} onValueChange={setGender}>
                                                <SelectTrigger className="h-14 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-semibold shadow-sm overflow-hidden">
                                                    <SelectValue placeholder="Select classification" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl">
                                                    <SelectItem value="Male" className="font-medium cursor-pointer rounded-lg m-1 focus:bg-indigo-50">Male</SelectItem>
                                                    <SelectItem value="Female" className="font-medium cursor-pointer rounded-lg m-1 focus:bg-indigo-50">Female</SelectItem>
                                                    <SelectItem value="Other" className="font-medium cursor-pointer rounded-lg m-1 focus:bg-indigo-50">Other / Prefer not to say</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                            <Button
                                                onClick={handleUpdateProfile}
                                                disabled={updating}
                                                className="rounded-full h-12 px-8 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white font-bold shadow-xl shadow-slate-900/10 transition-all hover:scale-105"
                                            >
                                                {updating ? 'Securing Data...' : 'Save & Secure Details'}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
