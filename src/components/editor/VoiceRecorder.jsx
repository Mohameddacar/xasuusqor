import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function VoiceRecorder({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
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
        const audioFile = new File([audioBlob], 'voice-note.webm', { type: 'audio/webm' });
        
        setIsProcessing(true);
        
        const { file_url } = await base44.integrations.Core.UploadFile({ file: audioFile });
        
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: "Transcribe the audio file accurately. Return only the transcribed text, nothing else.",
          file_urls: [file_url]
        });
        
        onTranscript(result);
        setIsProcessing(false);
        
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

  return (
    <div className="flex items-center gap-2">
      {!isRecording ? (
        <Button
          type="button"
          variant="outline"
          onClick={startRecording}
          disabled={isProcessing}
          className="border-[#8B7355] text-[#8B7355] hover:bg-[#F5F0E8]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Voice to Text
            </>
          )}
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