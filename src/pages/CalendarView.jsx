import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntriesForDate = (date) => {
    return entries.filter(entry => isSameDay(new Date(entry.date), date));
  };

  const getJournalColor = (journalId) => {
    const journal = journals.find(j => j.id === journalId);
    return journal?.color || '#8B7355';
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F6] to-[#F5F0E8]">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#3C3835] mb-2">Calendar View</h1>
              <p className="text-[#8B7355]">View your entries in a calendar format</p>
            </div>
            <Button className="bg-[#8B7355] hover:bg-[#6F5A44] text-white shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              New Entry
            </Button>
          </div>

          {/* Calendar Header */}
          <Card className="mb-6 border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-[#8B7355]" />
                  <h2 className="text-2xl font-bold text-[#3C3835]">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="border-[#E8DDD0] text-[#8B7355] hover:bg-[#F5F0E8]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                    className="border-[#E8DDD0] text-[#8B7355] hover:bg-[#F5F0E8]"
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="border-[#E8DDD0] text-[#8B7355] hover:bg-[#F5F0E8]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Calendar Grid */}
        <Card className="border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-semibold text-[#8B7355]">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((day, index) => {
                const dayEntries = getEntriesForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[120px] p-2 border border-[#E8DDD0] rounded-lg ${
                      isCurrentMonth ? 'bg-white' : 'bg-[#F5F0E8]'
                    } ${isToday ? 'ring-2 ring-[#8B7355]' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      isCurrentMonth ? 'text-[#3C3835]' : 'text-[#C4A57B]'
                    } ${isToday ? 'text-[#8B7355] font-bold' : ''}`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEntries.slice(0, 3).map((entry) => (
                        <div
                          key={entry.id}
                          className="text-xs p-1 rounded truncate cursor-pointer hover:bg-[#F5F0E8]"
                          style={{ 
                            backgroundColor: getJournalColor(entry.journal_id) + '20',
                            borderLeft: `3px solid ${getJournalColor(entry.journal_id)}`
                          }}
                          title={entry.title}
                        >
                          {entry.title}
                        </div>
                      ))}
                      {dayEntries.length > 3 && (
                        <div className="text-xs text-[#8B7355] font-medium">
                          +{dayEntries.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-6 border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#3C3835]">Journal Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {journals.map((journal) => (
                <div key={journal.id} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: journal.color }}
                  />
                  <span className="text-sm text-[#3C3835]">{journal.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}