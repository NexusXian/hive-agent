import { useState } from "react";

export function LoginForm({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) return;
    setError("");
    setIsSubmitting(true);
    try {
      await onLogin(email, password);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h1>hive-agent</h1>
        <input value={email} type="email" placeholder="邮箱" disabled={isSubmitting} onChange={(e) => setEmail(e.target.value)} />
        <input value={password} type="password" placeholder="密码" disabled={isSubmitting} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="login-error">{error}</div>}
        <button type="submit" disabled={isSubmitting}>
          登录
        </button>
      </form>
    </div>
  );
}
