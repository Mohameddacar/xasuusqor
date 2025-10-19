import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Calendar } from "lucide-react";
import { format, getMonth, getDate } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";

export default function OnThisDay({ entries }) {
  const today = new Date();
  const currentMonth = getMonth(today);
  const currentDay = getDate(today);

  const pastEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const entryYear = entryDate.getFullYear();
    return (
      getMonth(entryDate) === currentMonth &&
      getDate(entryDate) === currentDay &&
      entryYear < today.getFullYear()
    );
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (pastEntries.length === 0) return null;

  return (
    <Card className="mb-8 bg-gradient-to-br from-[#F5F0E8] to-white border-2 border-[#E8DDD0]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#3C3835]">
          <Sparkles className="w-5 h-5 text-[#C4A57B]" />
          On This Day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[#8B7355] mb-4">
          You have {pastEntries.length} {pastEntries.length === 1 ? 'memory' : 'memories'} from this day in previous years
        </p>
        <div className="space-y-3">
          {pastEntries.map(entry => {
            const yearsAgo = today.getFullYear() - new Date(entry.date).getFullYear();
            return (
              <Link key={entry.id} to={createPageUrl("ViewEntry") + `?id=${entry.id}`}>
                <div className="p-4 bg-white rounded-xl border border-[#E8DDD0] hover:border-[#8B7355] hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-[#3C3835]">{entry.title}</h4>
                    <Badge variant="outline" className="border-[#C4A57B] text-[#8B7355]">
                      <Calendar className="w-3 h-3 mr-1" />
                      {yearsAgo} {yearsAgo === 1 ? 'year' : 'years'} ago
                    </Badge>
                  </div>
                  <p className="text-sm text-[#8B7355]">
                    {format(new Date(entry.date), "MMMM d, yyyy")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}