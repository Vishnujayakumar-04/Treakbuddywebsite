
import { TripDraft } from "@/types/planner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format, differenceInDays } from "date-fns";
import { AlertCircle } from "lucide-react";

interface StepProps {
    draft: TripDraft;
    updateDraft: (updates: Partial<TripDraft>) => void;
}

export function TripStepDates({ draft, updateDraft }: StepProps) {
    const handleDateChange = (field: "startDate" | "endDate", value: string) => {
        updateDraft({ [field]: value });
    };

    const days = draft.startDate && draft.endDate
        ? differenceInDays(new Date(draft.endDate), new Date(draft.startDate)) + 1
        : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={draft.startDate}
                        onChange={(e) => handleDateChange("startDate", e.target.value)}
                        className="h-12"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                        id="endDate"
                        type="date"
                        min={draft.startDate || new Date().toISOString().split("T")[0]}
                        value={draft.endDate}
                        onChange={(e) => handleDateChange("endDate", e.target.value)}
                        className="h-12"
                    />
                </div>
            </div>

            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-100 dark:border-cyan-800 flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-200">
                    <span className="font-bold text-lg">{days > 0 ? days : "?"}</span>
                </div>
                <div>
                    <h4 className="font-semibold text-cyan-900 dark:text-cyan-100">Total Trip Duration</h4>
                    <p className="text-sm text-cyan-700 dark:text-cyan-300">
                        {days > 0
                            ? `${days} days of adventure in Puducherry!`
                            : "Select both dates to see trip length."}
                    </p>
                </div>
            </div>

            {days > 7 && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg text-sm border border-amber-200 dark:border-amber-800">
                    <AlertCircle className="w-4 h-4" />
                    <span>Longer trips might take a bit more time for AI to generate.</span>
                </div>
            )}
        </div>
    );
}
