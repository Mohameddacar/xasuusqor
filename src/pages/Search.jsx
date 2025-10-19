import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search as SearchIcon, Filter, Calendar, Tag, Heart, X } from 'lucide-react';
import { format } from 'date-fns';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJournal, setSelectedJournal] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  const { data: entries } = useQuery({
    queryKey: ['entries'],
    queryFn: () => base44.entities.JournalEntry.list('-date'),
    initialData: [],
  });

  const { data: journals } = useQuery({
    queryKey: ['journals'],
    queryFn: () => base44.entities.Journal.list(),
    initialData: [],
  });

  // Get all unique tags and moods for filters
  const allTags = [...new Set(entries.flatMap(e => [...(e.tags || []), ...(e.auto_tags || [])]))];
  const allMoods = [...new Set(entries.map(e => e.mood).filter(Boolean))];

  // Filter entries based on search criteria
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.summary && entry.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesJournal = selectedJournal === 'all' || entry.journal_id === selectedJournal;
    
    const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => 
        entry.tags?.includes(tag) || 
        entry.auto_tags?.includes(tag)
      );
    
    const matchesDateRange = (!dateRange.start || new Date(entry.date) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(entry.date) <= new Date(dateRange.end));

    return matchesSearch && matchesJournal && matchesMood && matchesTags && matchesDateRange;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedJournal('all');
    setSelectedMood('all');
    setSelectedTags([]);
    setDateRange({ start: '', end: '' });
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getJournalColor = (journalId) => {
    const journal = journals.find(j => j.id === journalId);
    return journal?.color || '#8B7355';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F6] to-[#F5F0E8]">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#3C3835] mb-2">Advanced Search</h1>
          <p className="text-[#8B7355]">Find specific entries with detailed filters</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                <Input
                  placeholder="Search entries, titles, content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 border-[#E8DDD0] focus:border-[#8B7355] h-12 rounded-xl"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-[#E8DDD0] text-[#8B7355] hover:bg-[#F5F0E8] h-12 px-6"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="mb-6 border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-[#3C3835]">Advanced Filters</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-[#8B7355] hover:bg-[#F5F0E8]"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Journal Filter */}
              <div>
                <label className="block text-sm font-medium text-[#3C3835] mb-2">Journal</label>
                <select
                  value={selectedJournal}
                  onChange={(e) => setSelectedJournal(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8DDD0] rounded-lg bg-white text-[#3C3835] focus:border-[#8B7355] focus:outline-none"
                >
                  <option value="all">All Journals</option>
                  {journals.map((journal) => (
                    <option key={journal.id} value={journal.id}>
                      {journal.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mood Filter */}
              <div>
                <label className="block text-sm font-medium text-[#3C3835] mb-2">Mood</label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8DDD0] rounded-lg bg-white text-[#3C3835] focus:border-[#8B7355] focus:outline-none"
                >
                  <option value="all">All Moods</option>
                  {allMoods.map((mood) => (
                    <option key={mood} value={mood} className="capitalize">
                      {mood}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-[#3C3835] mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 20).map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedTags.includes(tag)
                          ? 'bg-[#8B7355] text-white'
                          : 'border-[#E8DDD0] text-[#8B7355] hover:bg-[#F5F0E8]'
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3C3835] mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="border-[#E8DDD0] focus:border-[#8B7355]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3C3835] mb-2">End Date</label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="border-[#E8DDD0] focus:border-[#8B7355]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        <Card className="border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-[#3C3835] flex items-center gap-2">
              <SearchIcon className="w-5 h-5 text-[#8B7355]" />
              Search Results ({filteredEntries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 mx-auto mb-4 text-[#8B7355]" />
                <h3 className="text-xl font-semibold text-[#3C3835] mb-2">No entries found</h3>
                <p className="text-[#8B7355] mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-[#E8DDD0] text-[#8B7355] hover:bg-[#F5F0E8]"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEntries.map((entry) => {
                  const journal = journals.find(j => j.id === entry.journal_id);
                  return (
                    <Card key={entry.id} className="border border-[#E8DDD0] hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[#3C3835] mb-2">{entry.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-[#8B7355] mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(entry.date), 'MMM d, yyyy')}
                              </div>
                              {entry.mood && (
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  <span className="capitalize">{entry.mood}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge 
                            className="text-xs"
                            style={{ 
                              backgroundColor: getJournalColor(entry.journal_id) + '20',
                              color: getJournalColor(entry.journal_id),
                              border: `1px solid ${getJournalColor(entry.journal_id)}40`
                            }}
                          >
                            {journal?.name || 'Unknown'}
                          </Badge>
                        </div>
                        
                        {entry.summary && (
                          <p className="text-[#3C3835] mb-3 line-clamp-2">{entry.summary}</p>
                        )}
                        
                        <div className="text-sm text-[#3C3835] line-clamp-3" 
                             dangerouslySetInnerHTML={{ __html: entry.content }} />
                        
                        {(entry.tags?.length > 0 || entry.auto_tags?.length > 0) && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {[...(entry.tags || []), ...(entry.auto_tags || [])].map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-[#E8DDD0] text-[#8B7355]">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
