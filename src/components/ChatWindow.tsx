import { useEffect, useRef } from "react";
import type { Message } from "../types";
import { MessageBubble } from "./MessageBubble";
import { StatusBar } from "./StatusBar";

export function ChatWindow({
  messages,
  status,
  isStreaming,
}: {
  messages: Message[];
  status: string;
  isStreaming: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <div className="chat-window">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}
      <StatusBar status={status} isStreaming={isStreaming} />
      <div ref={bottomRef} />
    </div>
  );
}
