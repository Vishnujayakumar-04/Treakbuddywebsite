import { TripDraft, TripType } from "@/types/planner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MapPin } from "lucide-react";

interface StepProps {
    draft: TripDraft;
    updateDraft: (updates: Partial<TripDraft>) => void;
}

export function TripStepBasics({ draft, updateDraft }: StepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="tripName">Trip Name</Label>
                <Input
                    id="tripName"
                    value={draft.name}
                    onChange={(e) => updateDraft({ name: e.target.value })}
                    placeholder="e.g. Summer Vacation in Pondy"
                    className="h-12 text-lg"
                    autoFocus
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="tripType">Who are you traveling with?</Label>
                    <Select
                        value={draft.type}
                        onValueChange={(val) => updateDraft({ type: val as TripType })}
                    >
                        <SelectTrigger id="tripType" className="h-12">
                            <SelectValue placeholder="Select trip type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Solo">Solo Traveler</SelectItem>
                            <SelectItem value="Friends">Friends Group</SelectItem>
                            <SelectItem value="Family">Family</SelectItem>
                            <SelectItem value="Honeymoon">Honeymoon / Couple</SelectItem>
                            <SelectItem value="Business + Leisure">Business + Leisure</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="travelers">Number of Travelers</Label>
                    <div className="relative">
                        <Users className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <Input
                            id="travelers"
                            type="number"
                            min={1}
                            max={20}
                            value={draft.travelers}
                            onChange={(e) => updateDraft({ travelers: parseInt(e.target.value) || 1 })}
                            className="pl-10 h-12"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Destination City</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-cyan-500" />
                    <Input
                        value="Puducherry, India"
                        disabled
                        className="pl-10 h-12 bg-slate-50 dark:bg-slate-900 border-none font-medium"
                    />
                </div>
            </div>
        </div>
    );
}
