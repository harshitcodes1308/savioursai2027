"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) { setError(data.error ?? "Unable to sign in"); return; }
      localStorage.removeItem("admin-token");
      router.refresh();
    } catch { setError("Unable to connect. Please try again."); }
    finally { setLoading(false); }
  };
  return <div className="admin-root admin-login"><form onSubmit={submit} className="admin-login-card">
    <div className="admin-brand"><span className="admin-brand-mark">S</span><span>Saviours AI<small>ADMIN WORKSPACE</small></span></div>
    <div><div className="admin-eyebrow">Restricted access</div><h1>Welcome back.</h1><p>Sign in to manage your Saviours workspace.</p></div>
    {error && <div className="admin-error" role="alert">{error}</div>}
    <label>Email address<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/></label>
    <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)}/></label>
    <button className="admin-button primary" disabled={loading}>{loading ? "Signing in…" : "Sign in"}<ArrowRight size={16}/></button>
    <div className="admin-login-foot"><ShieldCheck size={14}/>For authorised administrators only</div>
  </form></div>;
}
