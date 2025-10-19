import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Edit2, Trash2, Heart, Calendar, MapPin, Tag, Star, Mic, Image } from 'lucide-react';
import { format } from 'date-fns';
import { createPageUrl } from '../utils';

export default function ViewEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: entry, isLoading } = useQuery({
    queryKey: ['entry', id],
    queryFn: () => base44.entities.JournalEntry.list().then(entries => 
      entries.find(e => e.id === id)
    ),
    enabled: !!id,
  });

  const { data: journals } = useQuery({
    queryKey: ['journals'],
    queryFn: () => base44.entities.Journal.list(),
    initialData: [],
  });

  const deleteEntryMutation = useMutation({
    mutationFn: (entryId) => base44.entities.JournalEntry.delete(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      navigate(createPageUrl('Entries'));
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (entryId) => base44.entities.JournalEntry.update(entryId, {
      is_favorite: !entry?.is_favorite
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entry', id] });
      queryClient.invalidateQueries({ queryKey: ['entries'] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FBF9F6] to-[#F5F0E8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto mb-4"></div>
          <p className="text-[#8B7355]">Loading entry...</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FBF9F6] to-[#F5F0E8] flex items-center justify-center">
        <Card className="p-12 text-center border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-[#3C3835] mb-4">Entry not found</h2>
          <p className="text-[#8B7355] mb-6">The entry you're looking for doesn't exist or has been deleted.</p>
          <Button
            onClick={() => navigate(createPageUrl('Entries'))}
            className="bg-[#8B7355] hover:bg-[#6F5A44] text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Entries
          </Button>
        </Card>
      </div>
    );
  }

  const journal = journals.find(j => j.id === entry.journal_id);
  const allTags = [...(entry.tags || []), ...(entry.auto_tags || [])];

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      deleteEntryMutation.mutate(entry.id);
    }
  };

  const handleToggleFavorite = () => {
    toggleFavoriteMutation.mutate(entry.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F6] to-[#F5F0E8]">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl('Entries'))}
            className="text-[#8B7355] hover:bg-[#F5F0E8]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Entries
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleToggleFavorite}
              className={`border-[#E8DDD0] hover:bg-[#F5F0E8] ${
                entry.is_favorite ? 'text-yellow-600' : 'text-[#8B7355]'
              }`}
            >
              <Star className={`w-4 h-4 mr-2 ${entry.is_favorite ? 'fill-current' : ''}`} />
              {entry.is_favorite ? 'Favorited' : 'Add to Favorites'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl('NewEntry') + `?edit=${entry.id}`)}
              className="border-[#E8DDD0] text-[#8B7355] hover:bg-[#F5F0E8]"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDelete}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Entry Card */}
        <Card className="border-2 border-[#E8DDD0] bg-white/80 backdrop-blur-sm">
          <div 
            className="absolute top-0 left-0 w-full h-2 rounded-t-lg"
            style={{ backgroundColor: journal?.color || '#8B7355' }}
          />
          
          <CardHeader className="pt-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#3C3835] mb-2">{entry.title}</h1>
                <div className="flex items-center gap-4 text-sm text-[#8B7355]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}
                  </div>
                  {entry.mood && (
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span className="capitalize">{entry.mood}</span>
                    </div>
                  )}
                  {entry.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {entry.location.city && entry.location.country 
                        ? `${entry.location.city}, ${entry.location.country}`
                        : entry.location.address || 'Unknown location'
                      }
                    </div>
                  )}
                </div>
              </div>
              
              {journal && (
                <Badge 
                  className="text-sm px-3 py-1"
                  style={{ 
                    backgroundColor: journal.color + '20',
                    color: journal.color,
                    border: `1px solid ${journal.color}40`
                  }}
                >
                  {journal.name}
                </Badge>
              )}
            </div>

            {/* Summary */}
            {entry.summary && (
              <div className="p-4 bg-[#F5F0E8] rounded-xl border border-[#E8DDD0] mb-4">
                <p className="text-[#3C3835] italic">"{entry.summary}"</p>
              </div>
            )}

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {allTags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-[#E8DDD0] text-[#8B7355]">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Emotions and Key Themes */}
            {(entry.emotions?.length > 0 || entry.key_themes?.length > 0) && (
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {entry.emotions?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#3C3835] mb-2">Emotions</h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.emotions.map((emotion, index) => (
                        <Badge key={index} variant="secondary" className="bg-[#F5F0E8] text-[#8B7355] text-xs">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {entry.key_themes?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#3C3835] mb-2">Key Themes</h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.key_themes.map((theme, index) => (
                        <Badge key={index} variant="outline" className="border-[#C4A57B] text-[#8B7355] text-xs">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardHeader>

          <CardContent>
            {/* Media Attachments */}
            {entry.media_attachments?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#3C3835] mb-3 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Media Attachments
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {entry.media_attachments.map((media, index) => (
                    <div key={index} className="relative">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.caption || media.auto_caption || 'Attachment'}
                          className="w-full h-24 object-cover rounded-lg border border-[#E8DDD0]"
                        />
                      ) : (
                        <div className="w-full h-24 bg-[#F5F0E8] rounded-lg border border-[#E8DDD0] flex items-center justify-center">
                          <span className="text-[#8B7355] text-sm">File</span>
                        </div>
                      )}
                      {(media.caption || media.auto_caption) && (
                        <p className="text-xs text-[#8B7355] mt-1 line-clamp-2">
                          {media.caption || media.auto_caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audio */}
            {entry.audio_url && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#3C3835] mb-3 flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Audio Recording
                </h4>
                <audio controls className="w-full">
                  <source src={entry.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-[#3C3835] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />
            </div>

            {/* Template Used */}
            {entry.template_used && (
              <div className="mt-6 p-3 bg-[#F5F0E8] rounded-lg border border-[#E8DDD0]">
                <p className="text-sm text-[#8B7355]">
                  <span className="font-medium">Template used:</span> {entry.template_used}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}