import React from "react";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

const colors = [
  { hex: "#8B7355", name: "Brown" },
  { hex: "#6366F1", name: "Indigo" },
  { hex: "#EC4899", name: "Pink" },
  { hex: "#10B981", name: "Green" },
  { hex: "#F59E0B", name: "Amber" },
  { hex: "#8B5CF6", name: "Purple" },
  { hex: "#EF4444", name: "Red" },
  { hex: "#06B6D4", name: "Cyan" },
];

export default function JournalColorPicker({ value, onChange }) {
  return (
    <div className="space-y-3">
      <Label className="text-[#3C3835] font-semibold text-sm">Color</Label>
      <div className="grid grid-cols-4 gap-3">
        {colors.map(color => (
          <button
            key={color.hex}
            type="button"
            onClick={() => onChange(color.hex)}
            className={`h-14 rounded-xl border-2 transition-all hover:scale-105 relative ${
              value === color.hex
                ? "border-[#3C3835] shadow-lg ring-2 ring-[#3C3835]/20"
                : "border-[#E8DDD0] hover:border-[#8B7355]"
            }`}
            style={{ 
              backgroundColor: color.hex,
              boxShadow: value === color.hex ? `0 4px 12px ${color.hex}40` : undefined
            }}
            title={color.name}
          >
            {value === color.hex && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4 text-[#3C3835]" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}