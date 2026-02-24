import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

export interface ChatBubbleProps {
  role: "user" | "agent";
  sender: string;
  content: string;
  timestamp?: string;
}

export function ChatBubble({ role, sender, content, timestamp }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
        aria-hidden="true"
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        )}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-semibold opacity-80">{sender}</span>
          {timestamp && (
            <span className="text-xs opacity-50">{timestamp}</span>
          )}
        </div>
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
