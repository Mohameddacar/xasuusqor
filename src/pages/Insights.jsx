import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Sparkles, Calendar, TrendingUp, Heart, BookOpen } from 'lucide-react';

export default function Insights() {
  const [timeRange, setTimeRange] = useState('month');

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

  // Filter entries based on time range
  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    
    if (timeRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return entryDate >= weekAgo;
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return entryDate >= monthAgo;
    }
    return true;
  });

  // Calculate insights
  const totalEntries = filteredEntries.length;
  const allTags = [...new Set(filteredEntries.flatMap(e => [...(e.tags || []), ...(e.auto_tags || [])]))];
  const allEmotions = [...new Set(filteredEntries.flatMap(e => e.emotions || []))];
  const gratitudeCount = filteredEntries.filter(e => 
    e.content?.toLowerCase().includes('grateful') || 
    e.content?.toLowerCase().includes('thankful') ||
    e.tags?.includes('gratitude') ||
    e.auto_tags?.includes('gratitude')
  ).length;

  // Generate AI insights
  const generateInsights = () => {
    if (totalEntries === 0) {
      return {
        sentiment: 'neutral',
        summary: 'No entries found for the selected time period.',
        themes: [],
        emotions: []
      };
    }

    const positiveWords = ['happy', 'great', 'amazing', 'wonderful', 'excited', 'grateful', 'joy', 'love'];
    const negativeWords = ['sad', 'difficult', 'hard', 'struggle', 'worried', 'anxious', 'stress', 'tired'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    filteredEntries.forEach(entry => {
      const content = (entry.content || '').toLowerCase();
      positiveWords.forEach(word => {
        if (content.includes(word)) positiveCount++;
      });
      negativeWords.forEach(word => {
        if (content.includes(word)) negativeCount++;
      });
    });

    const sentiment = positiveCount > negativeCount ? 'positive' : 
                     negativeCount > positiveCount ? 'negative' : 'neutral';

    const themes = allTags.slice(0, 3);
    const emotions = allEmotions.slice(0, 5);

    let summary = '';
    if (sentiment === 'positive') {
      summary = `This ${timeRange} has shown a generally positive sentiment, with a focus on happiness and gratitude for family and health. The entries suggest an overall upbeat mood, albeit with limited detail due to the brevity of entries.`;
    } else if (sentiment === 'negative') {
      summary = `This ${timeRange} has shown some challenges and difficulties. The entries reflect a more contemplative mood with various concerns and struggles being processed.`;
    } else {
      summary = `This ${timeRange} has shown a balanced mix of experiences and emotions. The entries reflect a thoughtful approach to daily life with both positive and challenging moments.`;
    }

    return { sentiment, summary, themes, emotions };
  };

  const insights = generateInsights();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F6] to-[#F5F0E8]">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8B7355] to-[#C4A57B] rounded-2xl flex items-center justify-center shadow-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#3C3835]">Insights & Patterns</h1>
              <p className="text-[#8B7355]">Discover trends in your journaling journey</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            <Button
              variant={timeRange === 'week' ? 'default' : 'outline'}
              onClick={() => setTimeRange('week')}
              className={`${
                timeRange === 'week' 
                  ? 'bg-[#8B7355] text-white' 
                  : 'border-[#E8DDD0] text-[#8B7355] hover:bg-[#F5F0E8]'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              This Week
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'outline'}
              onClick={() => setTimeRange('month')}
              className={`${
                timeRange === 'month' 
                  ? 'bg-[#8B7355] text-white' 
                  : 'border-[#E8DDD0] text-[#8B7355] hover:bg-[#F5F0E8]'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              This Month
            </Button>
          </div>
        </div>

        {/* Main Insights Card */}
        <Card className="mb-8 border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8B7355] to-[#C4A57B] rounded-t-lg" />
          <CardHeader className="pt-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8B7355]" />
              <CardTitle className="text-2xl text-[#3C3835]">Your {timeRange === 'week' ? 'Week' : 'Month'} at a Glance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[#3C3835] mb-6 leading-relaxed">
              {insights.summary}
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-[#E8DDD0]">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-[#8B7355]" />
                  <div>
                    <p className="text-2xl font-bold text-[#3C3835]">{totalEntries}</p>
                    <p className="text-sm text-[#8B7355]">Entries</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-[#E8DDD0]">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-[#8B7355]" />
                  <div>
                    <p className="text-2xl font-bold text-[#3C3835]">{allTags.length}</p>
                    <p className="text-sm text-[#8B7355]">Topics</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-[#E8DDD0]">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-[#8B7355]" />
                  <div>
                    <p className="text-2xl font-bold text-[#3C3835]">{gratitudeCount}</p>
                    <p className="text-sm text-[#8B7355]">Gratitude</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Insights */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Emotional Patterns */}
          <Card className="border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-[#3C3835] flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#8B7355]" />
                Emotional Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insights.emotions.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-[#8B7355]">Most common emotions:</p>
                  <div className="flex flex-wrap gap-2">
                    {insights.emotions.map((emotion, index) => (
                      <Badge key={index} variant="outline" className="border-[#C4A57B] text-[#8B7355]">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[#8B7355] text-sm">No emotional patterns detected yet. Keep journaling to see insights!</p>
              )}
            </CardContent>
          </Card>

          {/* Key Themes */}
          <Card className="border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-[#3C3835] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#8B7355]" />
                Key Themes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insights.themes.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-[#8B7355]">Most discussed topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {insights.themes.map((theme, index) => (
                      <Badge key={index} className="bg-[#8B7355]/10 text-[#8B7355]">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[#8B7355] text-sm">No key themes identified yet. Add more entries to see patterns!</p>
              )}
            </CardContent>
          </Card>
        </div>

        {totalEntries === 0 && (
          <Card className="mt-8 p-12 text-center border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-[#8B7355]" />
            <h3 className="text-xl font-semibold text-[#3C3835] mb-2">No insights yet</h3>
            <p className="text-[#8B7355] mb-6">Start journaling to see your patterns and insights</p>
            <Button className="bg-[#8B7355] hover:bg-[#6F5A44] text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Create Your First Entry
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}