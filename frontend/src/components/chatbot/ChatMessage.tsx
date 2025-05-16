import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex mb-2", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 break-words whitespace-pre-wrap",
          isUser
            ? "bg-[#005dff] text-white rounded-br-none"
            : "bg-white text-black border border-[#d1d1d1] shadow-sm rounded-bl-none"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
