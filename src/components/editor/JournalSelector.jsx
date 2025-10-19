import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen } from "lucide-react";

export default function JournalSelector({ journals, selectedJournalId, onJournalChange }) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[#8B7355]" />
        Journal
      </Label>
      <Select value={selectedJournalId} onValueChange={onJournalChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a journal" />
        </SelectTrigger>
        <SelectContent>
          {journals.map(journal => (
            <SelectItem key={journal.id} value={journal.id}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: journal.color }}
                />
                {journal.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}