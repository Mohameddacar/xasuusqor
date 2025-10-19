import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Image, Video, Scan, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MediaGallery({ mediaAttachments }) {
  const [selectedMedia, setSelectedMedia] = useState(null);

  if (!mediaAttachments || mediaAttachments.length === 0) return null;

  return (
    <>
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-[#8B7355] flex items-center gap-2">
          <Image className="w-4 h-4" />
          Attachments ({mediaAttachments.length})
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaAttachments.map((media, index) => (
            <Card 
              key={index} 
              className="relative group overflow-hidden border-[#E8DDD0] cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setSelectedMedia(media)}
            >
              <div className="aspect-square relative">
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt="Entry media"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[#F5F0E8] flex items-center justify-center">
                    <Video className="w-12 h-12 text-[#8B7355]" />
                  </div>
                )}
                
                {media.extracted_text && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-[#8B7355]/90 text-white text-xs">
                      <Scan className="w-3 h-3 mr-1" />
                      OCR
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl p-0">
          {selectedMedia && (
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              >
                <X className="w-4 h-4" />
              </Button>
              
              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.url}
                  alt="Full size media"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-full h-auto max-h-[80vh]"
                />
              )}
              
              {selectedMedia.extracted_text && (
                <div className="p-6 bg-[#F5F0E8]">
                  <h5 className="font-semibold text-[#3C3835] mb-2 flex items-center gap-2">
                    <Scan className="w-4 h-4 text-[#8B7355]" />
                    Extracted Text
                  </h5>
                  <p className="text-[#8B7355] text-sm whitespace-pre-wrap">
                    {selectedMedia.extracted_text}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}