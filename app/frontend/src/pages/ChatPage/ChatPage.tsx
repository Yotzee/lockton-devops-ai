import { useState, useRef, useEffect, type FormEvent } from "react";
import { useAuth } from "@/resources/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatBubble } from "@/components/ChatBubble/ChatBubble";
import { SendHorizontal } from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
}

const MOCK_AGENT_RESPONSES = [
  "I can help you with that! Let me look into it.",
  "That's a great question. Here's what I found...",
  "Sure, I'll get right on it.",
  "Let me process that request for you.",
  "Interesting — I'll need a moment to think about that.",
];

function getMockResponse(): string {
  return MOCK_AGENT_RESPONSES[Math.floor(Math.random() * MOCK_AGENT_RESPONSES.length)];
}

export function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current && typeof bottomRef.current.scrollIntoView === "function") {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    const agentMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "agent",
      content: getMockResponse(),
    };

    setMessages((prev) => [...prev, userMessage, agentMessage]);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <h1 className="text-lg font-semibold">AI Chat</h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Send a message to start the conversation
          </div>
        )}
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              role={msg.role}
              sender={msg.role === "user" ? user?.username ?? "User" : "Agent"}
              content={msg.content}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            aria-label="Message input"
          />
          <Button type="submit" size="icon" aria-label="Send message">
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
