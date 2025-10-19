import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Trash2, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";

export default function AudioRecorder({ onRecordingComplete, currentAudioUrl }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(currentAudioUrl || "");
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'audio-note.webm', { type: 'audio/webm' });
        
        const { file_url } = await base44.integrations.Core.UploadFile({ file: audioFile });
        
        setAudioUrl(file_url);
        onRecordingComplete(file_url);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const removeAudio = () => {
    setAudioUrl("");
    onRecordingComplete("");
    setIsPlaying(false);
  };

  if (audioUrl && !isRecording) {
    return (
      <div className="flex items-center gap-2 p-3 bg-[#F5F0E8] rounded-xl border border-[#E8DDD0]">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={togglePlayback}
          className="text-[#8B7355]"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Badge variant="outline" className="border-[#8B7355] text-[#8B7355]">
          <Mic className="w-3 h-3 mr-1" />
          Audio attached
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={removeAudio}
          className="text-red-500 ml-auto"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      </div>
    );
  }

  return (
    <div>
      {!isRecording ? (
        <Button
          type="button"
          variant="outline"
          onClick={startRecording}
          className="border-[#8B7355] text-[#8B7355] hover:bg-[#F5F0E8]"
        >
          <Mic className="w-4 h-4 mr-2" />
          Record Audio
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={stopRecording}
          className="border-red-500 text-red-600 hover:bg-red-50 animate-pulse"
        >
          <Square className="w-4 h-4 mr-2 fill-current" />
          Stop Recording
        </Button>
      )}
    </div>
  );
}