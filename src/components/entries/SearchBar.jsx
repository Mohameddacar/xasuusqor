
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, X } from "lucide-react";

export default function SearchBar({
  searchQuery,
  onSearchChange,
  selectedJournal,
  onJournalChange,
  showFavoritesOnly,
  onFavoritesToggle,
  selectedTags,
  onTagsChange,
  selectedEmotions,
  onEmotionsChange,
  journals,
  allTags,
  allEmotions
}) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
        <Input
          placeholder="Search your entries..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 bg-white border-[#E8DDD0] focus:border-[#8B7355] h-12 rounded-xl shadow-sm"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Select value={selectedJournal} onValueChange={onJournalChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Journals" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Journals</SelectItem>
            {journals.map(journal => (
              <SelectItem key={journal.id} value={journal.id}>
                {journal.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showFavoritesOnly ? "default" : "outline"}
          onClick={() => onFavoritesToggle(!showFavoritesOnly)}
          className={showFavoritesOnly ? "bg-[#8B7355] hover:bg-[#6F5A44]" : "border-[#E8DDD0]"}
        >
          <Star className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          Favorites
        </Button>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 5).map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedTags.includes(tag)
                    ? "bg-[#8B7355] hover:bg-[#6F5A44]"
                    : "hover:bg-[#F5F0E8]"
                }`}
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    onTagsChange(selectedTags.filter(t => t !== tag));
                  } else {
                    onTagsChange([...selectedTags, tag]);
                  }
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {allEmotions && allEmotions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allEmotions.slice(0, 4).map(emotion => (
              <Badge
                key={emotion}
                variant={selectedEmotions?.includes(emotion) ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedEmotions?.includes(emotion)
                    ? "bg-gradient-to-r from-[#8B7355] to-[#C4A57B] hover:from-[#6F5A44] hover:to-[#A88B63] text-white"
                    : "border-[#C4A57B] text-[#8B7355] hover:bg-[#F5F0E8]"
                }`}
                onClick={() => {
                  if (selectedEmotions?.includes(emotion)) {
                    onEmotionsChange(selectedEmotions.filter(e => e !== emotion));
                  } else {
                    onEmotionsChange([...(selectedEmotions || []), emotion]);
                  }
                }}
              >
                {emotion}
              </Badge>
            ))}
          </div>
        )}

        {(selectedJournal !== "all" || showFavoritesOnly || selectedTags.length > 0 || (selectedEmotions?.length > 0)) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onJournalChange("all");
              onFavoritesToggle(false);
              onTagsChange([]);
              if (onEmotionsChange) onEmotionsChange([]);
            }}
            className="text-[#8B7355]"
          >
            <X className="w-4 h-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
