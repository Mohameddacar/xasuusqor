
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mic, Sparkles, Image, Mail, Star, MapPin, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const moodEmojis = {
  great: "🌟",
  good: "😊",
  okay: "😐",
  low: "😔",
  difficult: "😰"
};

export default function EntryCard({ entry, index, journals }) {
  // Modified excerpt to prioritize entry.summary
  const excerpt = entry.summary || 
    entry.content.replace(/[#*_~`]/g, '').slice(0, 150) + 
    (entry.content.length > 150 ? '...' : '');
  
  const mediaCount = entry.media_attachments?.length || 0;
  const journal = journals?.find(j => j.id === entry.journal_id);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={createPageUrl("ViewEntry") + `?id=${entry.id}`}>
        <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-white border-[#E8DDD0] hover:border-[#8B7355] cursor-pointer group relative">
          {journal && (
            <div 
              className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
              style={{ backgroundColor: journal.color }}
            />
          )}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-[#8B7355]">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(entry.date), "MMM d, yyyy")}</span>
              {journal && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" style={{ color: journal.color }} />
                    <span>{journal.name}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {entry.is_favorite && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
              {entry.source === "email" && (
                <Badge variant="outline" className="border-[#C4A57B] text-[#8B7355]">
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Badge>
              )}
              {entry.audio_url && (
                <Badge variant="outline" className="border-[#C4A57B] text-[#8B7355]">
                  <Mic className="w-3 h-3 mr-1" />
                  Audio
                </Badge>
              )}
              {mediaCount > 0 && (
                <Badge variant="outline" className="border-[#C4A57B] text-[#8B7355]">
                  <Image className="w-3 h-3 mr-1" />
                  {mediaCount}
                </Badge>
              )}
              {entry.location && (
                <Badge variant="outline" className="border-[#C4A57B] text-[#8B7355]">
                  <MapPin className="w-3 h-3 mr-1" />
                  Location
                </Badge>
              )}
              {entry.template_used && (
                <Badge variant="outline" className="border-[#C4A57B] text-[#8B7355]">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Template
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            {entry.mood && (
              <div className="text-3xl mt-1">{moodEmojis[entry.mood]}</div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-[#3C3835] mb-2 group-hover:text-[#8B7355] transition-colors line-clamp-1">
                {entry.title}
              </h3>

              {/* AI Summary or Excerpt */}
              {entry.summary && (
                <div className="mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-[#8B7355]" />
                    <span className="text-xs text-[#8B7355]">Summary</span>
                  </div>
                  <p className="text-[#8B7355]/80 leading-relaxed line-clamp-2 italic">
                    {entry.summary}
                  </p>
                </div>
              )}

              {/* This paragraph now displays the 'excerpt' variable, which could be the summary or content excerpt */}
              <p className="text-[#8B7355]/80 leading-relaxed line-clamp-2 mb-2">
                {excerpt}
              </p>

              {/* Emotion Labels */}
              {entry.emotions && entry.emotions.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {entry.emotions.slice(0, 3).map((emotion, idx) => (
                    <Badge 
                      key={idx}
                      className="bg-gradient-to-r from-[#8B7355]/20 to-[#C4A57B]/20 text-[#8B7355] text-xs border-none"
                    >
                      {emotion}
                    </Badge>
                  ))}
                  {entry.emotions.length > 3 && (
                    <Badge 
                      variant="outline"
                      className="text-xs border-[#8B7355] text-[#8B7355]"
                    >
                      +{entry.emotions.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Manual Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {entry.tags.slice(0, 4).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-[#F5F0E8] text-[#8B7355]">
                      {tag}
                    </Badge>
                  ))}
                  {entry.tags.length > 4 && (
                    <Badge variant="secondary" className="text-xs bg-[#F5F0E8] text-[#8B7355]">
                      +{entry.tags.length - 4}
                    </Badge>
                  )}
                </div>
              )}

              {/* AI Tags */}
              {entry.auto_tags && entry.auto_tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <Sparkles className="w-3 h-3 text-[#8B7355] mt-0.5" />
                  {entry.auto_tags.slice(0, 3).map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs border-[#8B7355]/30 text-[#8B7355]/70"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
