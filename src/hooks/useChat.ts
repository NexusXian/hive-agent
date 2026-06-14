import { useEffect, useRef, useState } from "react";
import { getConversationMessages, getConversations, streamChat } from "../api/chat";
import type { Conversation, Message } from "../types";

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    void refreshConversations();
  }, []);

  async function refreshConversations() {
    try {
      setConversations(await getConversations());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoadingConversations(false);
    }
  }

  function upsertConversation(conversation: Conversation) {
    setConversations((prev) => [conversation, ...prev.filter((item) => item.id !== conversation.id)]);
  }

  function appendToLast(content: string) {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === prev.length - 1 ? { ...msg, content: msg.content + content } : msg,
      ),
    );
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setError("");
    const conversationId = activeConversationId;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ]);
    setIsStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      for await (const chunk of streamChat(trimmed, conversationId, ctrl.signal)) {
        switch (chunk.type) {
          case "status":
            setStatus(chunk.message);
            break;
          case "conversation":
            setActiveConversationId(chunk.conversation.id);
            upsertConversation(chunk.conversation);
            break;
          case "token":
            appendToLast(chunk.content);
            break;
          case "done":
            return;
          case "error":
            setError(chunk.message);
            return;
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message);
      }
    } finally {
      setStatus("");
      setIsStreaming(false);
      abortRef.current = null;
      void refreshConversations();
    }
  }

  async function selectConversation(id: string) {
    if (isStreaming) return;
    setError("");
    setStatus("");
    setActiveConversationId(id);
    try {
      setMessages(await getConversationMessages(id));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function newConversation() {
    if (isStreaming) return;
    setError("");
    setStatus("");
    setActiveConversationId(null);
    setMessages([]);
  }

  function stop() {
    abortRef.current?.abort();
  }

  return {
    conversations,
    activeConversationId,
    messages,
    status,
    isStreaming,
    isLoadingConversations,
    error,
    send,
    stop,
    selectConversation,
    newConversation,
  };
}
