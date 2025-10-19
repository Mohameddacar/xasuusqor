import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus, Sparkles, Loader2 } from "lucide-react";

export default function TagInput({ tags, onTagsChange, showAIButton, onAnalyze, isAnalyzing }) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Tags</Label>
        {showAIButton && onAnalyze && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="text-[#8B7355] hover:bg-[#F5F0E8]"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 mr-1" />
                AI Suggestions
              </>
            )}
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add tags (press Enter)"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={addTag}
          className="border-[#8B7355] text-[#8B7355]"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag} className="bg-[#8B7355] hover:bg-[#6F5A44] text-white flex items-center gap-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}