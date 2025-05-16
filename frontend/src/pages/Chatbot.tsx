import { useState } from "react";
import ChatArea from "@/components/chatbot/ChatArea";
import { useThinkingProcess } from "@/hooks/use-thinking-process";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

interface Model {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

const defaultModel: Model = {
  id: "1",
  name: "GPT-4o",
  description: "Advanced model with strong reasoning capabilities",
  prompt: "You are Debie, a specialized AI assistant for diabetes management.",
};

const defaultConversation: Message[] = [
  { id: "1", role: "system", content: defaultModel.prompt },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(defaultConversation);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    isThinking,
    thinkingSteps,
    currentStep,
    finalResponse,
    startThinking,
    resetThinking,
  } = useThinkingProcess();

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: (messages.length + 1).toString(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    startThinking(message);

    try {
      const thinkingTime = 8 * 5000 + 2000;
      await new Promise((resolve) => setTimeout(resolve, thinkingTime));

      if (finalResponse) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const aiMessage: Message = {
          id: (messages.length + 2).toString(),
          role: "assistant",
          content: finalResponse,
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      resetThinking();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ChatArea
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        isThinking={isThinking}
        thinkingSteps={thinkingSteps}
        currentStep={currentStep}
        finalResponse={finalResponse}
      />
    </div>
  );
}