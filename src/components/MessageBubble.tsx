import type { Message } from "../types";
import { Markdown } from "./Markdown";

export function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="msg-row user">
        <div className="user-bubble">{message.content}</div>
      </div>
    );
  }

  return (
    <div className="msg-row assistant">
      <div className="assistant-msg">
        {message.content ? (
          <Markdown content={message.content} />
        ) : (
          <span className="typing-dots">
            <span />
            <span />
            <span />
          </span>
        )}
      </div>
    </div>
  );
}
