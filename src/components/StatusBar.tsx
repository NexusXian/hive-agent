export function StatusBar({
  status,
  isStreaming,
}: {
  status: string;
  isStreaming: boolean;
}) {
  if (!isStreaming || !status) return null;
  return <div className="status-bar">{status}</div>;
}
