import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Menu } from "lucide-react";
import VoiceRecorder from "@/components/chatbot/VoiceRecorder";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

interface QuickPrompt {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  isMobile: boolean;
  quickPrompts: QuickPrompt[];
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStartRecording: () => void;
  onQuickPromptClick: (prompt: string) => void;
  onVoiceInput: (transcript: string) => void;
}

export default function ChatInput({
  input,
  isLoading,
  isMobile,
  quickPrompts,
  onInputChange,
  onSubmit,
  onVoiceInput,
  onQuickPromptClick,
}: ChatInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="max-w-3xl mx-auto ">
      {isRecording ? (
        <VoiceRecorder
          onTranscript={(transcript) => {
            onVoiceInput(transcript);
            setIsRecording(false);
          }}
          onCancel={() => setIsRecording(false)}
        />
      ) : (
        <form
          onSubmit={onSubmit}
          className="space-y-2 rounded-lg border border-[#d1d1d1] p-2 shadow-sm"
        >
          {/* Input with buttons */}
          <div className="flex flex-col items-center gap-1">
            <Textarea
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ask anything"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent shadow-none resize-none overflow-auto min-h-[50px] max-h-[200px]"
              rows={1}
            />

            {isMobile && (
              <div className="flex justify-between items-center w-full">
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#747474]"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      {quickPrompts.map((prompt) => (
                        <Button
                          type="button"
                          key={prompt.label}
                          variant="outline"
                          className={`justify-center h-12 ${
                            prompt.highlight
                              ? "bg-[#005dff] text-white hover:bg-[#0051e0] border-[#005dff]"
                              : "bg-white text-[#747474] hover:bg-[#f5f5f5] border-[#d1d1d1]"
                          }`}
                          onClick={() => {
                            onQuickPromptClick(prompt.value);
                            setIsDrawerOpen(false);
                          }}
                        >
                          {prompt.label}
                        </Button>
                      ))}
                    </div>
                  </DrawerContent>
                </Drawer>
                <div className="space-x-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-[#747474]"
                    onClick={() => setIsRecording(true)}
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-[#005dff] text-white hover:bg-[#0051e0] disabled:opacity-50"
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {!isMobile && (
            <div className="flex flex-wrap justify-between gap-2">
              <div className="flex gap-2 items-center">
                {quickPrompts.map((prompt) => (
                  <Button
                    key={prompt.label}
                    type="button"
                    variant="outline"
                    className={`${
                      prompt.highlight
                        ? "bg-[#005dff] text-white hover:bg-[#0051e0] border-[#005dff]"
                        : "bg-white text-[#747474] hover:bg-[#f5f5f5] border-[#d1d1d1]"
                    }`}
                    onClick={() => onQuickPromptClick(prompt.value)}
                  >
                    {prompt.label}
                  </Button>
                ))}
              </div>
              <div className="space-x-2">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-[#747474]"
                  onClick={() => setIsRecording(true)}
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="bg-[#005dff] text-white hover:bg-[#0051e0] disabled:opacity-50"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
