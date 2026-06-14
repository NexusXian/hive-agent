import type { Conversation, Message, StreamChunk, User } from "../types";

const base = import.meta.env.VITE_API_URL ?? "";

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

export async function getMe(): Promise<User | null> {
  const res = await fetch(`${base}/auth/me`, { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(await readError(res));
  const data = (await res.json()) as { user: User };
  return data.user;
}

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await readError(res));
  const data = (await res.json()) as { user: User };
  return data.user;
}

export async function logout(): Promise<void> {
  await fetch(`${base}/auth/logout`, { method: "POST", credentials: "include" });
}

export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch(`${base}/conversations`, { credentials: "include" });
  if (!res.ok) throw new Error(await readError(res));
  const data = (await res.json()) as { conversations: Conversation[] };
  return data.conversations;
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const res = await fetch(`${base}/conversations/${conversationId}/messages`, { credentials: "include" });
  if (!res.ok) throw new Error(await readError(res));
  const data = (await res.json()) as { messages: Message[] };
  return data.messages;
}

export async function* streamChat(
  message: string,
  conversationId: string | null,
  signal: AbortSignal,
): AsyncGenerator<StreamChunk> {
  const res = await fetch(`${base}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ message, conversationId }),
    signal,
  });

  if (!res.ok || !res.body) {
    yield { type: "error", message: await readError(res) };
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let sep: number;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);

        for (const line of frame.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;
          yield JSON.parse(payload) as StreamChunk;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
