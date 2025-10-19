import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Sparkles } from "lucide-react";

export default function GratitudeList({ items }) {
  return (
    <Card className="border-2 border-[#C4A57B] bg-gradient-to-br from-white to-[#F5F0E8]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#C4A57B] fill-current" />
          Moments of Gratitude
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border-2 border-[#E8DDD0] hover:border-[#C4A57B] transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C4A57B] to-[#8B7355] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <p className="flex-1 text-[#3C3835] leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-[#C4A57B]/10 to-transparent rounded-xl border-l-4 border-[#C4A57B]">
          <p className="text-sm text-[#8B7355] italic">
            "Gratitude turns what we have into enough" - Keep celebrating the good things in your life!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}