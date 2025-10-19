import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, PenLine, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EmptyState({ hasEntries }) {
  if (hasEntries) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-[#F5F0E8] rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-[#8B7355]" />
        </div>
        <h3 className="text-xl font-semibold text-[#3C3835] mb-2">No matching entries</h3>
        <p className="text-[#8B7355] mb-6">Try adjusting your search query</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-[#8B7355] to-[#C4A57B] rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-[#8B7355]/20">
        <BookOpen className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-[#3C3835] mb-3">Start Your Journey</h3>
      <p className="text-[#8B7355] mb-8 max-w-md">
        Begin documenting your thoughts, feelings, and experiences. Your private diary awaits.
      </p>
      <Link to={createPageUrl("NewEntry")}>
        <Button className="bg-[#8B7355] hover:bg-[#6F5A44] text-white shadow-lg shadow-[#8B7355]/20">
          <PenLine className="w-5 h-5 mr-2" />
          Write Your First Entry
        </Button>
      </Link>
    </div>
  );
}