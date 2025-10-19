import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Image, Video, Upload, X, Loader2, Scan, AlertCircle, Crown, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function MediaUploader({ 
  mediaAttachments, 
  onMediaAdd, 
  onMediaRemove, 
  onOCRExtract,
  isPremium 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  const maxPhotos = isPremium ? 999 : 5;
  const canUploadMore = mediaAttachments.length < maxPhotos;

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (!canUploadMore) {
      setError(`Free plan is limited to ${maxPhotos} photos per entry. Upgrade to Premium for unlimited uploads.`);
      return;
    }

    const remainingSlots = maxPhotos - mediaAttachments.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots && !isPremium) {
      setError(`You can only upload ${remainingSlots} more ${remainingSlots === 1 ? 'photo' : 'photos'} on the free plan.`);
    }

    setIsUploading(true);
    setError("");

    for (const file of filesToUpload) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        
        const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
        
        let autoCaption = "";
        
        // Generate caption for images
        if (mediaType === 'image') {
          try {
            autoCaption = await base44.integrations.Core.InvokeLLM({
              prompt: "Describe this image in one concise, descriptive sentence (10-15 words). Focus on the main subject, setting, and mood.",
              file_urls: [file_url]
            });
          } catch (captionError) {
            console.error("Failed to generate caption:", captionError);
          }
        }
        
        onMediaAdd({
          url: file_url,
          type: mediaType,
          caption: "",
          auto_caption: autoCaption,
          extracted_text: ""
        });
      } catch (err) {
        console.error("Upload error:", err);
        setError("Failed to upload some files. Please try again.");
      }
    }

    setIsUploading(false);
  };

  const scanPhotoForText = async (mediaIndex) => {
    const media = mediaAttachments[mediaIndex];
    if (media.type !== 'image') return;

    setIsScanning(true);
    setError("");

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: "Extract all text from this image. Return ONLY the extracted text, nothing else. If there's no text, return an empty string.",
        file_urls: [media.url]
      });

      const updatedMedia = [...mediaAttachments];
      updatedMedia[mediaIndex] = {
        ...updatedMedia[mediaIndex],
        extracted_text: result
      };
      
      onMediaRemove(mediaIndex);
      onMediaAdd(updatedMedia[mediaIndex]);
      
      if (result && result.trim()) {
        onOCRExtract(result);
      }
    } catch (err) {
      console.error("OCR error:", err);
      setError("Failed to extract text. Please try again.");
    }

    setIsScanning(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-[#8B7355] flex items-center gap-2">
          <Image className="w-4 h-4" />
          Photos & Videos
          {!isPremium && (
            <Badge variant="outline" className="ml-2 text-xs border-[#C4A57B] text-[#8B7355]">
              {mediaAttachments.length}/{maxPhotos}
            </Badge>
          )}
        </h4>
        
        <div className="flex items-center gap-2">
          {!isPremium && !canUploadMore && (
            <Badge className="bg-[#C4A57B] text-white">
              <Crown className="w-3 h-3 mr-1" />
              Limit reached
            </Badge>
          )}
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="media-upload"
            disabled={isUploading || !canUploadMore}
          />
          <label htmlFor="media-upload">
            <Button
              type="button"
              variant="outline"
              className="border-[#8B7355] text-[#8B7355] hover:bg-[#F5F0E8]"
              disabled={isUploading || !canUploadMore}
              asChild
            >
              <span>
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Media
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-300 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isPremium && mediaAttachments.length >= 3 && (
        <Alert className="border-[#C4A57B] bg-[#F5F0E8]">
          <Crown className="h-4 w-4 text-[#8B7355]" />
          <AlertDescription className="text-[#8B7355]">
            Upgrade to Premium for unlimited photo and video uploads
          </AlertDescription>
        </Alert>
      )}

      {mediaAttachments.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mediaAttachments.map((media, index) => (
            <Card key={index} className="relative group overflow-hidden border-[#E8DDD0]">
              <div className="aspect-square relative">
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt="Entry media"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#F5F0E8] flex items-center justify-center">
                    <Video className="w-12 h-12 text-[#8B7355]" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {media.type === 'image' && (
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => scanPhotoForText(index)}
                      disabled={isScanning}
                      className="bg-white/90 hover:bg-white"
                    >
                      {isScanning ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Scan className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => onMediaRemove(index)}
                    className="bg-red-500/90 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {media.extracted_text && (
                    <Badge className="bg-[#8B7355] text-white text-xs">
                      <Scan className="w-3 h-3 mr-1" />
                      OCR
                    </Badge>
                  )}
                  {media.auto_caption && !media.caption && (
                    <Badge className="bg-[#C4A57B] text-white text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI
                    </Badge>
                  )}
                </div>
              </div>

              {(media.caption || media.auto_caption) && (
                <div className="p-2 bg-[#F5F0E8] border-t border-[#E8DDD0]">
                  <p className="text-xs text-[#3C3835] line-clamp-2">
                    {media.caption || media.auto_caption}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}