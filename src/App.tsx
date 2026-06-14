import { useEffect, useState } from "react";
import { getMe, login, logout } from "./api/chat";
import { ChatWindow } from "./components/ChatWindow";
import { ConversationList } from "./components/ConversationList";
import { InputBox } from "./components/InputBox";
import { LoginForm } from "./components/LoginForm";
import { useChat } from "./hooks/useChat";
import type { User } from "./types";
import "./App.css";

function ChatShell({ user, onLogout }: { user: User; onLogout: () => void }) {
  const chat = useChat();

  return (
    <div className="shell">
      <ConversationList
        user={user}
        conversations={chat.conversations}
        activeConversationId={chat.activeConversationId}
        isStreaming={chat.isStreaming}
        isLoading={chat.isLoadingConversations}
        onNew={chat.newConversation}
        onSelect={chat.selectConversation}
        onLogout={onLogout}
      />
      <main className="app">
        <header className="app-header">hive-agent</header>
        <ChatWindow messages={chat.messages} status={chat.status} isStreaming={chat.isStreaming} />
        {chat.error && <div className="error-bar">{chat.error}</div>}
        <InputBox isStreaming={chat.isStreaming} onSend={chat.send} onStop={chat.stop} />
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsReady(true));
  }, []);

  async function handleLogin(email: string, password: string) {
    setUser(await login(email, password));
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  if (!isReady) return <div className="login-page">加载中...</div>;
  if (!user) return <LoginForm onLogin={handleLogin} />;
  return <ChatShell user={user} onLogout={handleLogout} />;
}

export default App;
