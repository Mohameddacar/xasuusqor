import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const moodValues = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  difficult: 1
};

const moodColors = {
  great: "#10B981",
  good: "#8B7355",
  okay: "#F59E0B",
  low: "#EF4444",
  difficult: "#991B1B"
};

export default function EmotionalPatterns({ emotions }) {
  const chartData = emotions.map(e => ({
    day: e.day,
    value: moodValues[e.mood] || 3,
    mood: e.mood,
    fill: moodColors[e.mood] || "#8B7355"
  }));

  const averageMood = emotions.reduce((sum, e) => sum + (moodValues[e.mood] || 3), 0) / emotions.length;
  const happiestDay = emotions.reduce((prev, curr) => 
    (moodValues[curr.mood] || 0) > (moodValues[prev.mood] || 0) ? curr : prev
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-[#8B7355]" />
          Emotional Patterns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-[#F5F0E8] rounded-xl">
            <p className="text-sm text-[#8B7355] mb-1">Average Mood</p>
            <p className="text-2xl font-bold text-[#3C3835]">
              {averageMood > 4 ? "Great" : averageMood > 3.5 ? "Good" : averageMood > 2.5 ? "Okay" : "Low"}
            </p>
          </div>
          <div className="p-4 bg-[#F5F0E8] rounded-xl">
            <p className="text-sm text-[#8B7355] mb-1">Happiest Day</p>
            <p className="text-2xl font-bold text-[#3C3835]">{happiestDay.day}</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" />
            <XAxis dataKey="day" stroke="#8B7355" />
            <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#8B7355" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '2px solid #E8DDD0',
                borderRadius: '12px'
              }}
              formatter={(value, name, props) => [props.payload.mood, "Mood"]}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}