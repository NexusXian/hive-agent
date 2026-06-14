import { useState } from "react";

export function InputBox({
  isStreaming,
  onSend,
  onStop,
}: {
  isStreaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}) {
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  return (
    <div className="input-box">
      <textarea
        value={text}
        placeholder="输入消息，Enter 发送"
        rows={1}
        disabled={isStreaming}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      {isStreaming ? (
        <button type="button" className="stop" onClick={onStop}>
          停止
        </button>
      ) : (
        <button type="button" onClick={submit}>
          发送
        </button>
      )}
    </div>
  );
}
