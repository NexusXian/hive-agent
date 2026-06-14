export type StreamChunk =
  | { type: "status"; message: string }
  | { type: "conversation"; conversation: Conversation }
  | { type: "token"; content: string }
  | { type: "done" }
  | { type: "error"; message: string };

export type Role = "user" | "assistant";

export interface Message {
  id?: string;
  role: Role;
  content: string;
  createdAt?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
}
