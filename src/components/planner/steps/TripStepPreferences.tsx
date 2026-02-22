
import {
    TripDraft, TripInterest, BudgetType, TravelPace
} from "@/types/planner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Umbrella, Landmark, Utensils, Mountain, ShoppingBag,
    Moon, Waves, Star, Accessibility, Baby, User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const INTERESTS: { id: TripInterest; label: string; icon: any }[] = [
    { id: 'Beaches', label: 'Beaches', icon: Waves },
    { id: 'Heritage', label: 'Heritage', icon: Landmark },
    { id: 'Spiritual', label: 'Spiritual', icon: Star },
    { id: 'Food & Cafes', label: 'Food', icon: Utensils },
    { id: 'Nature', label: 'Nature', icon: Mountain },
    { id: 'Adventure', label: 'Adventure', icon: Mountain },
    { id: 'Shopping', label: 'Shopping', icon: ShoppingBag },
    // { id: 'Nightlife', label: 'Nightlife', icon: Moon } // Removed as it's not in the Type definition yet, stick to types
];

interface StepProps {
    draft: TripDraft;
    updateDraft: (updates: Partial<TripDraft>) => void;
}

export function TripStepPreferences({ draft, updateDraft }: StepProps) {

    const toggleInterest = (interest: TripInterest) => {
        const current = draft.interests || [];
        if (current.includes(interest)) {
            updateDraft({ interests: current.filter(i => i !== interest) });
        } else {
            updateDraft({ interests: [...current, interest] });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Budget */}
            <div className="space-y-3">
                <Label className="text-base font-semibold">Budget (INR)</Label>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <Input
                            type="number"
                            min={1000}
                            step={500}
                            value={draft.budgetAmount}
                            onChange={(e) => updateDraft({ budgetAmount: parseInt(e.target.value) || 0 })}
                            className="h-12 text-lg"
                        />
                    </div>
                    <RadioGroup
                        value={draft.budgetType}
                        onValueChange={(v) => updateDraft({ budgetType: v as BudgetType })}
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="per person" id="per-person" />
                            <Label htmlFor="per-person">Per Person</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="total" id="total" />
                            <Label htmlFor="total">Total</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            {/* Pace */}
            <div className="space-y-3">
                <Label className="text-base font-semibold">Travel Pace</Label>
                <div className="grid grid-cols-3 gap-3">
                    {['Relaxed', 'Balanced', 'Fast-paced'].map((pace) => (
                        <button
                            key={pace}
                            onClick={() => updateDraft({ pace: pace as TravelPace })}
                            className={`p-3 rounded-xl border transition-all ${draft.pace === pace
                                    ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-200 dark:ring-slate-800'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                }`}
                        >
                            <span className="text-sm font-medium">{pace}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Interests */}
            <div className="space-y-3">
                <Label className="text-base font-semibold">Interests</Label>
                <div className="flex flex-wrap gap-3">
                    {INTERESTS.map((interest) => (
                        <button
                            key={interest.id}
                            onClick={() => toggleInterest(interest.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${draft.interests?.includes(interest.id)
                                    ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                                }`}
                        >
                            <interest.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{interest.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Enhancers (New!) */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Label className="text-base font-semibold">Additional Considerations</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mobility */}
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <input
                            type="checkbox"
                            checked={draft.mobilityDetails}
                            onChange={(e) => updateDraft({ mobilityDetails: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                            <Accessibility className="w-5 h-5 text-slate-400" />
                            <span className="font-medium">Mobility / Accessibility needs</span>
                        </div>
                    </label>

                    {/* Kids */}
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <input
                            type="checkbox"
                            checked={draft.travelingWithKids}
                            onChange={(e) => updateDraft({ travelingWithKids: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                            <Baby className="w-5 h-5 text-slate-400" />
                            <span className="font-medium">Traveling with Kids</span>
                        </div>
                    </label>

                    {/* Elderly */}
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <input
                            type="checkbox"
                            checked={draft.travelingWithElderly}
                            onChange={(e) => updateDraft({ travelingWithElderly: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                            <User className="w-5 h-5 text-slate-400" />
                            <span className="font-medium">Traveling with Elderly</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}
