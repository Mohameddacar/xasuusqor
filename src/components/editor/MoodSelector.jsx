import React from "react";
import { Label } from "@/components/ui/label";

const moods = [
  { value: "great", emoji: "🌟", label: "Great" },
  { value: "good", emoji: "😊", label: "Good" },
  { value: "okay", emoji: "😐", label: "Okay" },
  { value: "low", emoji: "😔", label: "Low" },
  { value: "difficult", emoji: "😰", label: "Difficult" }
];

export default function MoodSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-[#8B7355]">How are you feeling?</Label>
      <div className="flex gap-2">
        {moods.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 ${
              value === mood.value
                ? "border-[#8B7355] bg-[#F5F0E8] scale-110"
                : "border-[#E8DDD0] hover:border-[#C4A57B]"
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs text-[#8B7355]">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}