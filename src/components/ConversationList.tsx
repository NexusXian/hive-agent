import type { Conversation, User } from "../types";

export function ConversationList({
  user,
  conversations,
  activeConversationId,
  isStreaming,
  isLoading,
  onNew,
  onSelect,
  onLogout,
}: {
  user: User;
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  isLoading: boolean;
  onNew: () => void;
  onSelect: (id: string) => void;
  onLogout: () => void;
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div>
          <div className="sidebar-title">会话</div>
          <div className="sidebar-user">{user.email}</div>
        </div>
        <button type="button" onClick={onLogout}>
          退出
        </button>
      </div>
      <button type="button" className="new-chat" disabled={isStreaming} onClick={onNew}>
        新对话
      </button>
      <div className="conversation-list">
        {isLoading ? <div className="empty-conversations">加载中...</div> : null}
        {!isLoading && conversations.length === 0 ? <div className="empty-conversations">暂无会话</div> : null}
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            className={conversation.id === activeConversationId ? "conversation-item active" : "conversation-item"}
            disabled={isStreaming}
            onClick={() => onSelect(conversation.id)}
          >
            {conversation.title}
          </button>
        ))}
      </div>
    </aside>
  );
}
