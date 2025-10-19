import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MapPin, Plus, Filter, Map } from 'lucide-react';

export default function MapView() {
  const [selectedJournal, setSelectedJournal] = useState('all');

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

  // Filter entries with location data
  const entriesWithLocation = entries.filter(entry => entry.location && entry.location.lat && entry.location.lng);
  
  const filteredEntries = selectedJournal === 'all' 
    ? entriesWithLocation 
    : entriesWithLocation.filter(entry => entry.journal_id === selectedJournal);

  const getJournalColor = (journalId) => {
    const journal = journals.find(j => j.id === journalId);
    return journal?.color || '#8B7355';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F6] to-[#F5F0E8]">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#3C3835] mb-2">Map View</h1>
              <p className="text-[#8B7355]">Explore your entries by location</p>
            </div>
            <Button className="bg-[#8B7355] hover:bg-[#6F5A44] text-white shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              New Entry
            </Button>
          </div>

          {/* Filter Controls */}
          <Card className="mb-6 border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-[#8B7355]" />
                <span className="text-[#3C3835] font-medium">Filter by journal:</span>
                <select
                  value={selectedJournal}
                  onChange={(e) => setSelectedJournal(e.target.value)}
                  className="px-3 py-2 border border-[#E8DDD0] rounded-lg bg-white text-[#3C3835] focus:border-[#8B7355] focus:outline-none"
                >
                  <option value="all">All Journals</option>
                  {journals.map((journal) => (
                    <option key={journal.id} value={journal.id}>
                      {journal.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Placeholder */}
        <Card className="mb-6 border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center">
              <Map className="w-16 h-16 mx-auto mb-4 text-[#8B7355]" />
              <h3 className="text-xl font-semibold text-[#3C3835] mb-2">Interactive Map</h3>
              <p className="text-[#8B7355] mb-4">
                This would display an interactive map showing your journal entry locations.
                {filteredEntries.length > 0 && ` Found ${filteredEntries.length} entries with location data.`}
              </p>
              {filteredEntries.length === 0 && (
                <p className="text-sm text-[#C4A57B]">
                  No entries with location data found. Add location information to your entries to see them on the map.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Entries List */}
        {filteredEntries.length > 0 && (
          <Card className="border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-[#3C3835] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#8B7355]" />
                Entries with Locations ({filteredEntries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEntries.map((entry) => {
                  const journal = journals.find(j => j.id === entry.journal_id);
                  return (
                    <Card key={entry.id} className="border border-[#E8DDD0] hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-[#3C3835] line-clamp-1">{entry.title}</h4>
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
                        
                        <div className="space-y-2 text-sm text-[#8B7355]">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {entry.location.city && entry.location.country 
                                ? `${entry.location.city}, ${entry.location.country}`
                                : entry.location.address || 'Unknown location'
                              }
                            </span>
                          </div>
                          
                          <div className="text-xs">
                            {new Date(entry.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                          
                          {entry.mood && (
                            <div className="text-xs">
                              Mood: <span className="capitalize">{entry.mood}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredEntries.length === 0 && entriesWithLocation.length === 0 && (
          <Card className="p-12 text-center border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-[#8B7355]" />
            <h3 className="text-xl font-semibold text-[#3C3835] mb-2">No location data yet</h3>
            <p className="text-[#8B7355] mb-6">
              Add location information to your journal entries to see them on the map
            </p>
            <Button className="bg-[#8B7355] hover:bg-[#6F5A44] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Entry with Location
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}