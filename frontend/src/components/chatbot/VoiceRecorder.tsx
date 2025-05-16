import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceRecorder({
  onTranscript,
  onCancel,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [open, setOpen] = useState(true);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        stopRecording();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    setTranscript("");
    setIsRecording(true);
    recognitionRef.current?.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current?.stop();
  };

  const handleSubmit = () => {
    if (transcript) {
      setIsProcessing(true);
      setTimeout(() => {
        onTranscript(transcript);
        setIsProcessing(false);
        setOpen(false);
      }, 500);
    } else {
      onCancel();
      setOpen(false);
    }
  };

  useEffect(() => {
    startRecording();
    return () => stopRecording();
  }, []);

  const VoiceRecorderContent = (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-xl mb-1">Voice Input</h3>
        <p className="text-sm text-[#747474]">
          {isRecording ? "Listening..." : "Processing your voice..."}
        </p>
      </div>

      <div className="w-full p-3 bg-[#f9f9f9] rounded-md min-h-[60px] text-center border border-[#d1d1d1]">
        {transcript || "Speak now..."}
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        {isRecording ? (
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={stopRecording}
          >
            <Square className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 border-[#d1d1d1]"
            onClick={startRecording}
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}

        <div className="flex gap-2 items-center justify-center mt-4 border-t pt-4 w-full">
          <Button
            onClick={handleSubmit}
            className="rounded-full bg-[#005dff] hover:bg-[#0051e0] text-white px-6"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isProcessing ? "Processing" : "Send"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onCancel();
              setOpen(false);
            }}
            className="rounded-full border-[#d1d1d1]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  const handleDialogClose = () => {
    onCancel();
    setOpen(false);
  };

  return !isMobile ? (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        if (!openState) handleDialogClose();
      }}
    >
      <DialogTrigger asChild>
        <div />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        {VoiceRecorderContent}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div />
      </DrawerTrigger>
      <DrawerContent className="p-4">{VoiceRecorderContent}</DrawerContent>
    </Drawer>
  );
}
