
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TripDraft, GeneratedTrip } from '@/types/planner';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

// Firebase
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

// Steps
import { TripStepBasics } from './steps/TripStepBasics';
import { TripStepDates } from './steps/TripStepDates';
import { TripStepPreferences } from './steps/TripStepPreferences';
import { TripReview } from './steps/TripReview';

// Service
// Service (Now Server Action)
import { generateItinerary } from '@/app/actions/planner';

const INITIAL_DRAFT: TripDraft = {
    name: '',
    type: 'Solo',
    travelers: 1,
    startDate: '',
    endDate: '',
    budgetAmount: 5000,
    budgetType: 'per person',
    pace: 'Balanced',
    interests: ['Beaches', 'Heritage'],
    stayArea: 'Not decided',
    transport: 'Mixed',
    mobilityDetails: false,
    travelingWithKids: false,
    travelingWithElderly: false,
    preferredStartTime: 'Morning'
};

export function TripWizard({ onCancel }: { onCancel: () => void }) {
    const router = useRouter();
    const { user } = useAuth();
    const [step, setStep] = useState(0);
    const [draft, setDraft] = useState<TripDraft>(INITIAL_DRAFT);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateDraft = (updates: Partial<TripDraft>) => {
        setDraft(prev => ({ ...prev, ...updates }));
        setError(null);
    };

    const validateStep = () => {
        if (step === 0) {
            if (!draft.name.trim()) return "Please enter a trip name.";
            if (draft.travelers < 1) return "At least one traveler is required.";
        }
        if (step === 1) {
            if (!draft.startDate || !draft.endDate) return "Please select both start and end dates.";
            if (new Date(draft.startDate) > new Date(draft.endDate)) return "End date cannot be before start date.";
        }
        if (step === 2) {
            if (draft.interests.length === 0) return "Select at least one interest.";
        }
        return null;
    };

    const handleNext = () => {
        const errorMsg = validateStep();
        if (errorMsg) {
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
        setError(null);
    };

    const handleGenerate = async () => {
        if (!user) {
            toast.error("You must be logged in to save trips.");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            // 1. Call AI Service
            const itinerary = await generateItinerary(draft);

            // 2. Prepare Firestore Document
            const tripData: Omit<GeneratedTrip, 'id'> = {
                ...draft,
                userId: user.uid,
                createdAt: serverTimestamp(),
                itinerary: itinerary,
                status: 'confirmed',
                totalCostEstimate: `₹${draft.budgetAmount} ${draft.budgetType}`,
                places: itinerary.reduce((acc, day) => acc + day.activities.length, 0),
                image: "/images/trip-placeholder.jpg"
            };

            // 3. Save to Firestore
            const docRef = await addDoc(collection(db, "trips"), tripData);

            // 4. Success & Formatting
            toast.success("Trip generated successfully!");
            onCancel();

            // 5. Stay on list page (don't redirect)
            // router.push(`/dashboard/planner/${docRef.id}`);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong. Please try again.");
            toast.error("Failed to generate itinerary.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[85vh]">
            {/* Header */}
            <div className="flex-none bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {step === 3 ? "Review & Generate" : "Plan Your Adventure"}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {isGenerating ? (
                            <span className="flex items-center gap-2 text-amber-600 animate-pulse">
                                <Sparkles className="w-3 h-3" />
                                AI is thinking (High traffic, please wait)...
                            </span>
                        ) : (
                            `Step ${step + 1} of 4 • ${step === 0 ? "Basics" : step === 1 ? "Dates" : step === 2 ? "Preferences" : "Review"}`
                        )}
                    </p>
                </div>
                {/* On mobile, close button might be useful */}
            </div>

            {/* Progress Bar */}
            <div className="flex-none h-1 bg-slate-100 dark:bg-slate-800 w-full">
                <motion.div
                    className="h-full bg-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / 4) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            <TripStepBasics draft={draft} updateDraft={updateDraft} />
                        </motion.div>
                    )}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            <TripStepDates draft={draft} updateDraft={updateDraft} />
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            <TripStepPreferences draft={draft} updateDraft={updateDraft} />
                        </motion.div>
                    )}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            <TripReview draft={draft} isGenerating={isGenerating} onGenerate={handleGenerate} onEditStep={setStep} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-start gap-3"
                    >
                        <X className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">Unable to Generate Trip</p>
                            <p className="opacity-90 mt-1">{error}</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="flex-none p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                {step > 0 ? (
                    <Button variant="ghost" onClick={handleBack} disabled={isGenerating}>
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                ) : (
                    <div /> // Spacer
                )}

                {step < 3 ? (
                    <Button onClick={handleNext} className="rounded-full px-6 bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all">
                        Next Step <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <div />
                )}
            </div>
        </div>
    );
}
