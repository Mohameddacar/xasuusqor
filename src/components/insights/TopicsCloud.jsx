import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

const sentimentColors = {
  positive: "bg-green-100 text-green-800 border-green-300",
  neutral: "bg-gray-100 text-gray-800 border-gray-300",
  negative: "bg-orange-100 text-orange-800 border-orange-300"
};

export default function TopicsCloud({ topics }) {
  const maxCount = Math.max(...topics.map(t => t.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#8B7355]" />
          Recurring Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {topics.map((topic, index) => {
            const size = Math.max(14, Math.min(24, (topic.count / maxCount) * 24));
            return (
              <Badge
                key={index}
                className={`${sentimentColors[topic.sentiment]} transition-all hover:scale-110 cursor-default`}
                style={{ fontSize: `${size}px`, padding: '8px 16px' }}
              >
                {topic.name}
                <span className="ml-2 text-xs opacity-70">×{topic.count}</span>
              </Badge>
            );
          })}
        </div>
        <div className="mt-4 flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-[#8B7355]">Positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full" />
            <span className="text-[#8B7355]">Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <span className="text-[#8B7355]">Challenging</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}