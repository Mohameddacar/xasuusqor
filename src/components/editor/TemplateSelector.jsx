import React from "react";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const templates = [
  {
    name: "Daily Reflection",
    title: "Daily Reflection",
    content: `# Today's Reflection\n\n**What went well today?**\n\n\n**What could have been better?**\n\n\n**What am I grateful for?**\n\n\n**Tomorrow's intentions:**\n- `
  },
  {
    name: "Gratitude Journal",
    title: "Gratitude Journal",
    content: `# Today I'm Grateful For\n\n**Three things I'm grateful for:**\n1. \n2. \n3. \n\n**Why these matter to me:**\n\n\n**How can I express this gratitude?**\n`
  },
  {
    name: "Goal Setting",
    title: "Goal Setting",
    content: `# My Goals\n\n**Short-term goals (this week):**\n- \n\n**Long-term goals (this month/year):**\n- \n\n**Action steps:**\n- \n\n**Potential obstacles and solutions:**\n`
  },
  {
    name: "Dream Journal",
    title: "Dream Journal",
    content: `# Dream Log\n\n**Date:** \n\n**Dream description:**\n\n\n**Emotions felt:**\n\n\n**Possible meanings or insights:**\n`
  },
  {
    name: "Self-Care Check",
    title: "Self-Care Check-In",
    content: `# Self-Care Reflection\n\n**Physical wellness:**\n- Exercise: \n- Sleep: \n- Nutrition: \n\n**Mental wellness:**\n- Stress level: \n- Mood: \n\n**What I need today:**\n`
  },
  {
    name: "Creative Writing",
    title: "Creative Writing",
    content: `# Creative Thoughts\n\n*Let your imagination flow...*\n\n`
  }
];

export default function TemplateSelector({ onSelect }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#3C3835] flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#8B7355]" />
        Choose a Template
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.name}
            className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-[#E8DDD0] hover:border-[#8B7355] group"
            onClick={() => onSelect(template)}
          >
            <h4 className="font-semibold text-[#3C3835] group-hover:text-[#8B7355] transition-colors mb-2">
              {template.name}
            </h4>
            <p className="text-sm text-[#8B7355]/60 line-clamp-2">
              {template.content.slice(0, 80)}...
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}