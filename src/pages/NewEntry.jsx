
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Sparkles, Loader2 } from "lucide-react"; // Added Loader2
import { format } from "date-fns";

import RichTextEditor from "../components/editor/RichTextEditor";
import VoiceRecorder from "../components/editor/VoiceRecorder";
import AudioRecorder from "../components/editor/AudioRecorder";
import TemplateSelector from "../components/editor/TemplateSelector";
import MoodSelector from "../components/editor/MoodSelector";
import MediaUploader from "../components/editor/MediaUploader";
import LocationPicker from "../components/editor/LocationPicker";
import TagInput from "../components/editor/TagInput";
import JournalSelector from "../components/editor/JournalSelector";
import { Badge } from "@/components/ui/badge"; // Added Badge

export default function NewEntry() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [audioUrl, setAudioUrl] = useState("");
  const [mediaAttachments, setMediaAttachments] = useState([]);
  const [templateUsed, setTemplateUsed] = useState("");
  const [mood, setMood] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [tags, setTags] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedJournalId, setSelectedJournalId] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false); // New state for AI analysis
  const [aiSuggestions, setAiSuggestions] = useState(null); // New state for AI suggestions
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    initialData: null,
  });

  const { data: journals } = useQuery({
    queryKey: ['journals'],
    queryFn: () => base44.entities.Journal.list(),
    initialData: [],
  });

  // Load entry data if in edit mode
  const { data: editEntry } = useQuery({
    queryKey: ['entry', editId],
    queryFn: () => base44.entities.JournalEntry.list().then(entries =>
      entries.find(e => e.id === editId)
    ),
    enabled: !!editId,
  });

  useEffect(() => {
    if (editId && editEntry) {
      setIsEditMode(true);
      setTitle(editEntry.title || "");
      setContent(editEntry.content || "");
      setDate(editEntry.date || format(new Date(), "yyyy-MM-dd"));
      setAudioUrl(editEntry.audio_url || "");
      setMediaAttachments(editEntry.media_attachments || []);
      setTemplateUsed(editEntry.template_used || "");
      setMood(editEntry.mood || "");
      setTags(editEntry.tags || []);
      setLocation(editEntry.location || null);
      setSelectedJournalId(editEntry.journal_id || "");
    }
  }, [editId, editEntry]);

  useEffect(() => {
    if (journals.length > 0 && !selectedJournalId && !isEditMode) {
      const defaultJournal = journals.find(j => j.is_default);
      if (defaultJournal) {
        setSelectedJournalId(defaultJournal.id);
      } else {
        // If no default journal is found, select the first one as a fallback
        setSelectedJournalId(journals[0].id);
      }
    }
  }, [journals, selectedJournalId, isEditMode]);

  const isPremium = user?.subscription_plan === "premium";

  const createEntryMutation = useMutation({
    mutationFn: (entryData) => base44.entities.JournalEntry.create(entryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      navigate(createPageUrl("Entries"));
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: ({ id, entryData }) => base44.entities.JournalEntry.update(id, entryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['entry', editId] });
      navigate(createPageUrl("Entries"));
    },
  });

  const analyzeContent = async () => {
    if (!content.trim() || content.length < 100) {
      console.warn("Content too short or empty for AI analysis.");
      // Optionally, add a toast or visual feedback to the user
      return;
    }

    setIsAnalyzing(true);
    setAiSuggestions(null); // Clear previous suggestions when analyzing again

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this journal entry and provide:

Title: ${title}
Content: ${content}

Return JSON with:
1. suggested_tags: Array of 3-7 relevant tags/keywords (lowercase, single words or short phrases)
2. summary: If content is over 500 characters, provide a 2-3 sentence summary. Otherwise null.
3. emotions: Array of detected emotions (e.g., joy, stress, sadness, hope, anxiety, gratitude, excitement, worry, peace, frustration, love, fear)
4. key_themes: Array of 2-3 main themes discussed

Be insightful but concise. Focus on the most relevant tags and emotions.`,
        response_json_schema: {
          type: "object",
          properties: {
            suggested_tags: {
              type: "array",
              items: { type: "string" }
            },
            summary: { type: "string" },
            emotions: {
              type: "array",
              items: { type: "string" }
            },
            key_themes: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setAiSuggestions(response);
    } catch (error) {
      console.error("Content analysis error:", error);
      // Optionally provide user feedback about the error
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestions = () => {
    if (!aiSuggestions) return;

    if (aiSuggestions.suggested_tags && aiSuggestions.suggested_tags.length > 0) {
      const newTags = [...new Set([...tags, ...aiSuggestions.suggested_tags])];
      setTags(newTags);
    }

    // Clear suggestions after applying, or keep them visible if user might want to re-apply
    setAiSuggestions(null);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      console.error("Title and content cannot be empty.");
      // Add user-facing error message here
      return;
    }
    if (!selectedJournalId) {
      console.error("No journal selected.");
      // Add user-facing error message here
      return;
    }

    setIsAnalyzing(true); // Indicate that analysis/saving is in progress

    let finalSummary = null;
    let finalEmotions = [];
    let finalAutoTags = [];
    let finalKeyThemes = [];

    // Analyze content before saving if it meets criteria and user is premium
    if (isPremium && content.length > 100) { // Only analyze if content is substantial and user is premium
      try {
        const analysis = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze this journal entry:

Title: ${title}
Content: ${content}

Return JSON with:
1. suggested_tags: Array of 5-8 relevant tags (lowercase, single words or short phrases)
2. summary: If content is over 500 characters, provide a 2-3 sentence summary. Otherwise null.
3. emotions: Array of detected emotions (e.g., joy, stress, sadness, hope, anxiety, gratitude, excitement, worry, peace, frustration, love, fear)
4. key_themes: Array of 2-3 main themes discussed

Be accurate and insightful.`,
          response_json_schema: {
            type: "object",
            properties: {
              suggested_tags: { type: "array", items: { type: "string" } },
              summary: { type: "string" },
              emotions: { type: "array", items: { type: "string" } },
              key_themes: { type: "array", items: { type: "string" } }
            }
          }
        });

        finalSummary = analysis.summary;
        finalEmotions = analysis.emotions || [];
        finalAutoTags = analysis.suggested_tags || [];
        finalKeyThemes = analysis.key_themes || [];
      } catch (error) {
        console.error("Failed to analyze content during save:", error);
        // Continue saving without AI data if analysis fails
      }
    }

    // Generate captions for photos without captions if user is premium
    const finalMediaAttachments = await Promise.all(
      mediaAttachments.map(async (media) => {
        if (isPremium && media.type === "image" && !media.caption && !media.auto_caption) {
          try {
            // Check if media.url is available and valid for AI processing
            if (media.url) {
              const caption = await base44.integrations.Core.InvokeLLM({
                prompt: "Describe this image in one concise sentence (10-15 words). Focus on the main subject and setting.",
                file_urls: [media.url]
              });
              return { ...media, auto_caption: caption };
            }
          } catch (error) {
            console.error(`Failed to generate caption for image ${media.url}:`, error);
          }
        }
        return media; // Return original media if no caption needed or generation failed
      })
    );

    setIsAnalyzing(false); // AI analysis complete, now dispatching save mutation

    const entryData = {
      journal_id: selectedJournalId,
      title,
      content,
      summary: finalSummary,
      date,
      audio_url: audioUrl,
      media_attachments: finalMediaAttachments,
      template_used: templateUsed,
      mood,
      tags, // User-defined tags
      auto_tags: finalAutoTags, // AI-generated tags
      emotions: finalEmotions, // AI-detected emotions
      key_themes: finalKeyThemes, // AI-detected key themes
      location,
      source: "web",
      is_favorite: isEditMode ? (editEntry?.is_favorite || false) : false,
    };

    if (isEditMode && editId) {
      updateEntryMutation.mutate({ id: editId, entryData });
    } else {
      createEntryMutation.mutate(entryData);
    }
  };

  const handleTemplateSelect = (template) => {
    setTitle(template.title);
    setContent(template.content);
    setTemplateUsed(template.name);
    setShowTemplates(false);
  };

  const handleMediaAdd = (newMedia) => {
    setMediaAttachments([...mediaAttachments, newMedia]);
  };

  const handleMediaRemove = (index) => {
    setMediaAttachments(mediaAttachments.filter((_, i) => i !== index));
  };

  const handleOCRExtract = (extractedText) => {
    setContent(content + "\n\n" + extractedText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F6] to-[#F5F0E8]">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Entries"))}
            className="text-[#8B7355] hover:bg-[#F5F0E8]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Entries
          </Button>
          <Button
            onClick={() => setShowTemplates(!showTemplates)}
            variant="outline"
            className="border-[#8B7355] text-[#8B7355] hover:bg-[#F5F0E8]"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Use Template
          </Button>
        </div>

        {showTemplates && (
          <div className="mb-8">
            <TemplateSelector onSelect={handleTemplateSelect} />
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-6">
          <div className="space-y-4">
            <JournalSelector
              journals={journals}
              selectedJournalId={selectedJournalId}
              onJournalChange={setSelectedJournalId}
            />

            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-[#E8DDD0] focus:border-[#8B7355] h-12 rounded-xl text-[#8B7355]"
            />

            <Input
              placeholder="Entry title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-semibold border-none focus:ring-0 p-0 placeholder:text-[#C4A57B]/50 text-[#3C3835]"
            />

            <MoodSelector value={mood} onChange={setMood} />

            <TagInput
              tags={tags}
              onTagsChange={setTags}
              showAIButton={content.length > 100 && isPremium} // Only show AI button for premium users and sufficient content
              onAnalyze={analyzeContent}
              isAnalyzing={isAnalyzing}
            />

            {aiSuggestions && (
              <div className="p-4 bg-gradient-to-r from-[#F5F0E8] to-white rounded-xl border-2 border-[#8B7355]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#8B7355]" />
                    <h4 className="font-semibold text-[#3C3835]">AI Suggestions</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAiSuggestions(null)}
                    className="text-[#8B7355] hover:bg-[#F5F0E8]"
                  >
                    Dismiss
                  </Button>
                </div>

                {aiSuggestions.suggested_tags && aiSuggestions.suggested_tags.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-[#8B7355] mb-2">Suggested tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.suggested_tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          className="bg-[#8B7355]/10 text-[#8B7355] hover:bg-[#8B7355]/20 cursor-pointer"
                          onClick={() => {
                            // Add tag if not already present
                            if (!tags.includes(tag)) {
                              setTags([...tags, tag]);
                            }
                          }}
                        >
                          + {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {aiSuggestions.emotions && aiSuggestions.emotions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-[#8B7355] mb-2">Detected emotions:</p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.emotions.map((emotion, idx) => (
                        <Badge key={idx} variant="outline" className="border-[#C4A57B] text-[#8B7355]">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {aiSuggestions.key_themes && aiSuggestions.key_themes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-[#8B7355] mb-2">Key themes:</p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.key_themes.map((theme, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-[#F5F0E8] text-[#8B7355]">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {aiSuggestions.summary && (
                  <div>
                    <p className="text-sm text-[#8B7355] mb-2">Generated summary:</p>
                    <p className="text-sm text-[#3C3835] italic bg-white p-3 rounded-lg border border-[#E8DDD0]">
                      "{aiSuggestions.summary}"
                    </p>
                  </div>
                )}

                {(aiSuggestions.suggested_tags && aiSuggestions.suggested_tags.length > 0) && ( // Only show apply button if there are tags to apply
                  <Button
                    onClick={applySuggestions}
                    size="sm"
                    className="mt-3 bg-[#8B7355] hover:bg-[#6F5A44] text-white"
                  >
                    <Sparkles className="w-3 h-3 mr-2" />
                    Apply Tag Suggestions
                  </Button>
                )}
              </div>
            )}

            <LocationPicker location={location} onLocationChange={setLocation} />
          </div>

          <div className="flex flex-wrap gap-4">
            <VoiceRecorder onTranscript={(text) => setContent(content + "\n\n" + text)} />
            <AudioRecorder onRecordingComplete={setAudioUrl} currentAudioUrl={audioUrl} />
          </div>

          <MediaUploader
            mediaAttachments={mediaAttachments}
            onMediaAdd={handleMediaAdd}
            onMediaRemove={handleMediaRemove}
            onOCRExtract={handleOCRExtract}
            isPremium={isPremium}
          />

          <RichTextEditor value={content} onChange={setContent} />

          <div className="flex justify-end gap-3 pt-6 border-t border-[#E8DDD0]">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("Entries"))}
              className="border-[#E8DDD0] text-[#8B7355]"
              disabled={createEntryMutation.isPending || isAnalyzing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || createEntryMutation.isPending || updateEntryMutation.isPending || !selectedJournalId || isAnalyzing}
              className="bg-[#8B7355] hover:bg-[#6F5A44] text-white shadow-lg shadow-[#8B7355]/20"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (createEntryMutation.isPending || updateEntryMutation.isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Update Entry' : 'Save Entry'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
