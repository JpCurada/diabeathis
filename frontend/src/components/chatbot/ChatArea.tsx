import ChatInput from "@/components/chatbot/ChatInput";
import { useIsMobile } from "@/hooks/use-mobile";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/chatbot/ChatMessage";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import ThinkingProcess from "@/components/chatbot/ThinkingProcess";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (input: string) => void;
  isLoading?: boolean;
  isThinking: boolean;
  thinkingSteps: string[];
  currentStep: number;
  finalResponse: string | null;
}

export default function ChatArea({
  messages,
  onSendMessage,
  isLoading = false,
  isThinking,
  thinkingSteps,
  currentStep,
  finalResponse,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<string>("");
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const displayName = user?.first_name || "User";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const handleVoiceInput = (transcript: string) => {
    setInput(transcript);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const visibleMessages = messages.filter((m) => m.role !== "system");
  const hasMessages = visibleMessages.length > 0;

  const quickPrompts = [
    {
      label: "Blood Sugar",
      value: "My blood sugar has been high after dinner. Any ideas why?",
      highlight: true,
    },
    { label: "Exercise", value: "Can you suggest a workout plan for me?" },
    {
      label: "Medication",
      value: "I keep forgetting to take my evening medication",
    },
    {
      label: "Diet",
      value: "What are some healthy snack options between meals?",
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-2">
        {/* If there are no messages, show the welcome screen */}
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-screen space-y-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-center mb-2 sm:mb-4 bg-gradient-to-l from-blue-700 to-blue-300 bg-clip-text text-transparent">
              Welcome to Debie, {displayName}!
            </h1>
            <p className="text-[#747474] text-sm sm:text-base text-center max-w-md mb-8">
              Ask me anything about your diabetes management or use one of the
              quick prompts below to get started.
            </p>

            {isMobile && (
              <div className="flex justify-center gap-2 items-center flex-wrap">
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
                    onClick={() => {
                      setInput(prompt.value);
                    }}
                  >
                    {prompt.label}
                  </Button>
                ))}
              </div>
            )}

            <div className="w-full max-w-3xl">
              <ChatInput
                input={input}
                isLoading={isLoading}
                isMobile={isMobile}
                quickPrompts={quickPrompts}
                onInputChange={setInput}
                onSubmit={handleSubmit}
                onStartRecording={() => {}}
                onVoiceInput={handleVoiceInput}
                onQuickPromptClick={(prompt) => {
                  setInput(prompt);
                }}
              />
            </div>
          </div>
        ) : (
          // When there are messages, display the chat area
          <ScrollArea className="max-h-[calc(100vh-300px)]">
            <div className="space-y-4 max-w-3xl mx-auto">
              {visibleMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-black border border-[#d1d1d1] shadow-sm rounded-lg rounded-bl-none px-4 py-2 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Always show Chat Input at the bottom */}
      {hasMessages && (
        <div className="w-full max-w-3xl mx-auto space-y-4 p-4">
          {(isThinking || finalResponse) && (
            <ThinkingProcess
              isThinking={isThinking}
              thinkingSteps={thinkingSteps}
              currentStep={currentStep}
              finalResponse={finalResponse}
            />
          )}

          <ChatInput
            input={input}
            isLoading={isLoading}
            isMobile={isMobile}
            quickPrompts={quickPrompts}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            onStartRecording={() => {}}
            onVoiceInput={handleVoiceInput}
            onQuickPromptClick={(prompt) => {
              setInput(prompt);
            }}
          />
        </div>
      )}
    </div>
  );
}