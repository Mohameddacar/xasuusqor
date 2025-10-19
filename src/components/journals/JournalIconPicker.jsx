import React from "react";
import { Label } from "@/components/ui/label";
import { BookOpen, Briefcase, Heart, Plane, Dumbbell, Palette, Music, Code } from "lucide-react";

const icons = [
  { name: "BookOpen", Icon: BookOpen },
  { name: "Briefcase", Icon: Briefcase },
  { name: "Heart", Icon: Heart },
  { name: "Plane", Icon: Plane },
  { name: "Dumbbell", Icon: Dumbbell },
  { name: "Palette", Icon: Palette },
  { name: "Music", Icon: Music },
  { name: "Code", Icon: Code },
];

export default function JournalIconPicker({ value, onChange }) {
  return (
    <div className="space-y-3">
      <Label className="text-[#3C3835] font-semibold text-sm">Icon</Label>
      <div className="grid grid-cols-4 gap-3">
        {icons.map(({ name, Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
              value === name
                ? "border-[#8B7355] bg-gradient-to-br from-[#8B7355]/10 to-[#C4A57B]/10 shadow-md"
                : "border-[#E8DDD0] bg-white hover:border-[#C4A57B] hover:bg-[#F5F0E8]"
            }`}
          >
            <Icon className={`w-6 h-6 mx-auto ${value === name ? 'text-[#8B7355]' : 'text-[#C4A57B]'}`} />
          </button>
        ))}
      </div>
    </div>
  );
}