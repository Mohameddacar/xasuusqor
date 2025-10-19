
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Search, Calendar as CalendarIcon, Map, Star } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import EntryCard from "../components/entries/EntryCard";
import EmptyState from "../components/entries/EmptyState";
import SearchBar from "../components/entries/SearchBar";
import OnThisDay from "../components/entries/OnThisDay";

export default function Entries() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJournal, setSelectedJournal] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  
  const { data: entries, isLoading } = useQuery({
    queryKey: ['entries'],
    queryFn: () => base44.entities.JournalEntry.list("-date"),
    initialData: [],
  });

  const { data: journals } = useQuery({
    queryKey: ['journals'],
    queryFn: () => base44.entities.Journal.list("-created_date"),
    initialData: [],
  });

  const allTags = [...new Set(entries.flatMap(e => [...(e.tags || []), ...(e.auto_tags || [])]))];
  const allEmotions = [...new Set(entries.flatMap(e => e.emotions || []))];

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (entry.summary && entry.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesJournal = selectedJournal === "all" || entry.journal_id === selectedJournal;
    const matchesFavorite = !showFavoritesOnly || entry.is_favorite;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => 
                         entry.tags?.includes(tag) || 
                         entry.auto_tags?.includes(tag)
                       );
    const matchesEmotions = selectedEmotions.length === 0 ||
                           selectedEmotions.some(emotion => entry.emotions?.includes(emotion));
    
    return matchesSearch && matchesJournal && matchesFavorite && matchesTags && matchesEmotions;
  });

  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    const month = new Date(entry.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(entry);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F6] to-[#F5F0E8]">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#3C3835] mb-2">My Entries</h1>
              <p className="text-[#8B7355]">
                {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
                {showFavoritesOnly && " (favorites only)"}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link to={createPageUrl("CalendarView")}>
                <Button variant="outline" className="border-[#8B7355] text-[#8B7355]">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
              </Link>
              <Link to={createPageUrl("MapView")}>
                <Button variant="outline" className="border-[#8B7355] text-[#8B7355]">
                  <Map className="w-4 h-4 mr-2" />
                  Map
                </Button>
              </Link>
              <Link to={createPageUrl("Search")}>
                <Button variant="outline" className="border-[#8B7355] text-[#8B7355]">
                  <Search className="w-4 h-4 mr-2" />
                  Advanced
                </Button>
              </Link>
              <Link to={createPageUrl("NewEntry")}>
                <Button className="bg-[#8B7355] hover:bg-[#6F5A44] text-white shadow-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  New Entry
                </Button>
              </Link>
            </div>
          </div>

          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedJournal={selectedJournal}
            onJournalChange={setSelectedJournal}
            showFavoritesOnly={showFavoritesOnly}
            onFavoritesToggle={setShowFavoritesOnly}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            selectedEmotions={selectedEmotions}
            onEmotionsChange={setSelectedEmotions}
            journals={journals}
            allTags={allTags}
            allEmotions={allEmotions}
          />
        </div>

        <OnThisDay entries={entries} />

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <EmptyState hasEntries={entries.length > 0} />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedEntries).map(([month, monthEntries]) => (
              <div key={month}>
                <div className="flex items-center gap-3 mb-4">
                  <CalendarIcon className="w-4 h-4 text-[#8B7355]" />
                  <h2 className="text-lg font-semibold text-[#3C3835]">{month}</h2>
                  <div className="flex-1 h-px bg-[#E8DDD0]" />
                </div>
                <div className="grid gap-4">
                  {monthEntries.map((entry, index) => (
                    <EntryCard key={entry.id} entry={entry} index={index} journals={journals} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
