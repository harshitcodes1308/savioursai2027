"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { LayoutDashboard, Users, CreditCard, ChartNoAxesCombined, LogOut, RefreshCw, ArrowUpRight, ShieldCheck } from "lucide-react";

const navigation = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Revenue", href: "/admin/revenue", icon: CreditCard },
  { label: "Features", href: "/admin/features", icon: ChartNoAxesCombined },
];
export default function AdminShell({ children, adminEmail }: { children: React.ReactNode; adminEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loggingOut, setLoggingOut] = useState(false);
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") startTransition(() => router.refresh()); };
    const timer = setInterval(refresh, 30_000);
    return () => clearInterval(timer);
  }, [router]);
  const logout = async () => {
    setLoggingOut(true);
    try {
      const result = await fetch("/api/admin/logout", { method: "POST" });
      if (!result.ok) throw new Error();
      localStorage.removeItem("admin-token");
      window.location.assign("/admin");
    } catch { setLoggingOut(false); }
  };
  return <div className="admin-root admin-shell">
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand"><span className="admin-brand-mark">S</span><span>Saviours AI<small>ADMIN WORKSPACE</small></span></Link>
      <div className="admin-nav-label">Workspace</div>
      <nav aria-label="Admin navigation">{navigation.map(({ label, href, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`admin-nav-item ${pathname === href ? "active" : ""}`}><Icon size={18} strokeWidth={1.6}/>{label}</Link>)}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-account"><ShieldCheck size={18}/><div>Administrator<small>{adminEmail}</small></div></div><Link href="/dashboard" className="admin-nav-item"><ArrowUpRight size={17}/>Student dashboard</Link><button onClick={logout} disabled={loggingOut} className="admin-nav-item"><LogOut size={17}/>{loggingOut ? "Signing out…" : "Sign out"}</button></div>
    </aside>
    <div className="admin-main"><header className="admin-topbar"><span>Workspace <span className="admin-slash">/</span> <strong>{navigation.find(n => n.href === pathname)?.label ?? "Admin"}</strong></span><div className="admin-topbar-actions"><span className="admin-live"><i/>Updates every 30s</span><button className="admin-button" onClick={() => startTransition(() => router.refresh())} disabled={pending} aria-label="Refresh dashboard"><RefreshCw size={14} className={pending ? "admin-spinning" : ""}/><span>{pending ? "Refreshing…" : "Refresh"}</span></button><button className="admin-button" onClick={logout} disabled={loggingOut} aria-label="Sign out"><LogOut size={14}/></button></div></header>{children}</div>
  </div>;
}
