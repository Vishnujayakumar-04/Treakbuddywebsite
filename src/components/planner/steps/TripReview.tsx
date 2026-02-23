
import { TripDraft } from "@/types/planner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Calendar, Users, Wallet, MapPin, CheckCircle2,
    AlertCircle, Sparkles, Accessibility, Baby, User
} from "lucide-react";
import { motion } from "framer-motion";

interface StepProps {
    draft: TripDraft;
    isGenerating: boolean;
    onGenerate: () => void;
    onEditStep: (step: number) => void;
}

export function TripReview({ draft, isGenerating, onGenerate, onEditStep }: StepProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-200 transition-colors cursor-pointer" onClick={() => onEditStep(0)}>
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl text-cyan-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trip</p>
                            <h4 className="font-bold text-slate-900 dark:text-white">{draft.name}</h4>
                            <p className="text-sm text-slate-500">{draft.type} • {draft.travelers} Travelers</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Dates */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-200 transition-colors cursor-pointer" onClick={() => onEditStep(1)}>
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl text-violet-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dates</p>
                            <h4 className="font-bold text-slate-900 dark:text-white">
                                {draft.startDate} <span className="text-slate-400">to</span> {draft.endDate}
                            </h4>
                            <p className="text-sm text-slate-500">Duration calculated automatically</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Budget & Pace */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-200 transition-colors cursor-pointer" onClick={() => onEditStep(2)}>
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Style</p>
                            <h4 className="font-bold text-slate-900 dark:text-white">
                                ₹{draft.budgetAmount} <span className="text-xs font-normal text-slate-500">({draft.budgetType})</span>
                            </h4>
                            <p className="text-sm text-slate-500">{draft.pace} Pace</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Enhancers Summary */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-200 transition-colors cursor-pointer" onClick={() => onEditStep(2)}>
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Needs</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {draft.mobilityDetails && <Badge variant="outline" className="text-xs"><Accessibility className="w-3 h-3 mr-1" /> Mobility</Badge>}
                                {draft.travelingWithKids && <Badge variant="outline" className="text-xs"><Baby className="w-3 h-3 mr-1" /> Kids</Badge>}
                                {draft.travelingWithElderly && <Badge variant="outline" className="text-xs"><User className="w-3 h-3 mr-1" /> Elderly</Badge>}
                                {!draft.mobilityDetails && !draft.travelingWithKids && !draft.travelingWithElderly && <span className="text-sm text-slate-500">Standard</span>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Error / Warning Area (Placeholder logic for validation if needed, though validation happens before this step) */}

            <div className="pt-6">
                <Button
                    size="lg"
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className="w-full h-14 text-lg font-bold rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                    {isGenerating ? (
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            <span>Generating Itinerary...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 fill-white/20" />
                            Generate My Trip
                        </div>
                    )}
                </Button>
                <p className="text-center text-xs text-slate-400 mt-3">
                    Powered by Groq AI • Blazing Fast ⚡
                </p>
            </div>
        </div>
    );
}
