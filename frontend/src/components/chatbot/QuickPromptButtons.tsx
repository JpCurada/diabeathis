import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickPromptButtonsProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

export default function QuickPromptButtons({
  onSelectPrompt,
  className,
}: QuickPromptButtonsProps) {
  const prompts = [
    {
      label: "Routine",
      value: "Create a daily routine for me",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#005dff]"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      label: "Meal Plan",
      value: "Generate a healthy meal plan for the week",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-yellow-500"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 12h-6.5a2 2 0 1 0 0 4H12" />
        </svg>
      ),
    },
    {
      label: "Doctor's Report",
      value: "Analyze my doctor's report and explain it in simple terms",
      highlight: true,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-500"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
    {
      label: "Analyze",
      value: "Analyze this data for insights",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-orange-500"
        >
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
    },
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {prompts.map((prompt) => (
        <Button
          key={prompt.label}
          variant="outline"
          size="lg"
          onClick={() => onSelectPrompt(prompt.value)}
          className={cn(
            "rounded-full text-sm bg-white border-[#d1d1d1] text-[#747474] hover:bg-[#f5f5f5]",
            prompt.highlight && "border-green-500/50 text-black font-medium"
          )}
        >
          <span className="mr-2">{prompt.icon}</span>
          {prompt.label}
        </Button>
      ))}
    </div>
  );
}
