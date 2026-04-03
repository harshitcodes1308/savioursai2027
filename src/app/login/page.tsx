"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { useResponsive } from "@/hooks/useResponsive";

const VIDEO_URL = "https://res.cloudinary.com/dv0w2nfnw/video/upload/v1774898701/videoplayback_tgdakw.mp4";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [warpActive, setWarpActive] = useState(false);
  const [warpText, setWarpText] = useState(0);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemoSignin = async () => {
    setDemoLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "signin" }),
      });
      const data = await res.json();
      if (data.success) {
        setWarpActive(true);
        setTimeout(() => setWarpText(1), 400);
        setTimeout(() => setWarpText(2), 1600);
        setTimeout(() => router.push(data.redirectTo), 3200);
      } else {
        setError(data.error || "Demo login failed");
      }
    } catch {
      setError("Demo login failed");
    }
    setDemoLoading(false);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      // Trigger warp transition instead of immediate redirect
      setWarpActive(true);
      setTimeout(() => setWarpText(1), 400);
      setTimeout(() => setWarpText(2), 1600);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3200);
    },
    onError: (err) => setError(err.message || "Invalid credentials"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields"); return; }
    loginMutation.mutate({ email, password, rememberMe: true });
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const baseUrl = window.location.origin;
    const redirectUri = `${baseUrl}/api/auth/google/callback`;
    const scope = "openid email profile";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&prompt=select_account`;
    window.location.href = authUrl;
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      background: "var(--bg-base)",
    }}>

      {/* ── LEFT VIDEO PANEL ── */}
      {!isMobile && (
        <div style={{
          width: "55%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}>
          <video
            ref={videoRef}
            src={VIDEO_URL}
            autoPlay muted playsInline loop
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%) brightness(0.35)",
            }}
          />
          {/* Cyan tinted overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 40% 50%, rgba(0,212,255,0.15) 0%, rgba(13,13,26,0.85) 70%)",
          }} />

          <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 420, padding: "0 48px" }}>
            {/* Logo mark */}
            <div style={{ marginBottom: 24 }}>
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="25" stroke="rgba(0,212,255,0.6)" strokeWidth="1"/>
                <path d="M26 8L42 20L26 44L10 20L26 8Z" fill="none" stroke="rgba(0,212,255,0.9)" strokeWidth="1.5"/>
                <path d="M26 8L42 20L26 32L10 20L26 8Z" fill="rgba(0,212,255,0.15)"/>
              </svg>
            </div>
            <div style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "rgba(0,212,255,0.8)",
              textTransform: "uppercase",
              marginBottom: 32,
            }}>
              Saviours AI
            </div>
            <div style={{
              fontFamily: "var(--font-tagline)",
              fontSize: 28,
              letterSpacing: "-0.01em",
              lineHeight: 1.35,
              color: "var(--text-primary)",
              fontWeight: 400,
              fontStyle: "italic",
            }}>
              "Every great board result starts with one decision."
            </div>
          </div>
        </div>
      )}

      {/* ── RIGHT FORM PANEL ── */}
      <div style={{
        width: isMobile ? "100%" : "45%",
        minHeight: "100vh",
        background: "var(--bg-surface)",
        borderLeft: isMobile ? "none" : "1px solid var(--bg-border)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: isMobile ? "40px 24px" : "60px 52px",
        overflowY: "auto",
        position: "relative",
        zIndex: 2,
      }}>

        {/* Mobile logo */}
        {isMobile && (
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <svg width="36" height="36" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="25" stroke="rgba(0,212,255,0.6)" strokeWidth="1"/>
              <path d="M26 8L42 20L26 44L10 20L26 8Z" fill="none" stroke="rgba(0,212,255,0.9)" strokeWidth="1.5"/>
              <path d="M26 8L42 20L26 32L10 20L26 8Z" fill="rgba(0,212,255,0.15)"/>
            </svg>
          </div>
        )}

        <div style={{ maxWidth: 380, width: "100%" }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? 32 : 38,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "var(--text-primary)",
            marginBottom: 6,
          }}>
            Welcome back.
          </h1>
          <p style={{
            fontFamily: "var(--font-tagline)",
            fontSize: "var(--text-sm)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--text-muted)",
            marginBottom: 36,
          }}>
            Pick up right where you left off.
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: "var(--radius-md)",
              padding: "11px 16px",
              marginBottom: 20,
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--status-red)",
            }}>
              {error}
            </div>
          )}

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "13px 20px",
              background: "var(--bg-base)",
              border: "1.5px solid var(--bg-border)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 20,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--accent-gold-border)";
              e.currentTarget.style.background = "var(--bg-elevated)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--bg-border)";
              e.currentTarget.style.background = "var(--bg-base)";
            }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--bg-border)" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
              or continue with email
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--bg-border)" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: focused === "email" ? "var(--accent-gold)" : "var(--text-muted)",
                marginBottom: 8,
                transition: "color 0.15s ease",
              }}>
                Email
              </label>
              <input
                className="sa-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: focused === "password" ? "var(--accent-gold)" : "var(--text-muted)",
                  transition: "color 0.15s ease",
                }}>
                  Password
                </label>
                <a href="#" style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--accent-gold)",
                  textDecoration: "none",
                  opacity: 0.8,
                }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  className="sa-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent", border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    fontSize: 15, lineHeight: 1, padding: 2,
                  }}
                >
                  {showPassword ? "○" : "◉"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="btn-gold"
              style={{
                width: "100%",
                marginTop: 6,
                opacity: loginMutation.isPending ? 0.6 : 1,
                fontSize: "var(--text-base)",
                padding: "14px 28px",
                borderRadius: "var(--radius-md)",
                cursor: loginMutation.isPending ? "not-allowed" : "pointer",
              }}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p style={{
            marginTop: 28,
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            color: "var(--text-muted)",
            textAlign: "center",
          }}>
            New here?{" "}
            <Link href="/signup" style={{ color: "var(--accent-gold)", textDecoration: "none", fontWeight: 600 }}>
              Create an account
            </Link>
          </p>

          {/* Demo button for testing */}
          {process.env.NODE_ENV !== "production" && (
            <button
              onClick={handleDemoSignin}
              disabled={demoLoading}
              style={{
                width: "100%",
                marginTop: 16,
                padding: "12px 20px",
                background: "transparent",
                border: "1.5px dashed var(--bg-border-light)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                cursor: demoLoading ? "wait" : "pointer",
                opacity: demoLoading ? 0.5 : 0.7,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = "var(--status-green)"; e.currentTarget.style.color = "var(--status-green)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.borderColor = "var(--bg-border-light)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              {demoLoading ? "Loading..." : "Demo Sign In → Straight to Dashboard"}
            </button>
          )}
        </div>
      </div>

      {/* ── WARP TRANSITION OVERLAY ── */}
      {warpActive && (
        <div style={{
          position: 'fixed', inset: 0,
          zIndex: 9999,
          background: '#030308',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          animation: 'fadeIn 500ms ease-out both',
          overflow: 'hidden',
        }}>
          {/* Space warp video background */}
          <video
            src={VIDEO_URL}
            autoPlay muted playsInline loop
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.5)',
              opacity: 0.7,
            }}
          />
          {/* Blue tint overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.12) 0%, rgba(3,3,8,0.75) 70%)',
            pointerEvents: 'none',
          }} />

          {/* Cinematic text */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: isMobile ? 32 : 52,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              opacity: warpText >= 1 ? 1 : 0,
              transform: warpText >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
              transition: 'all 800ms cubic-bezier(0.16,1,0.3,1)',
              marginBottom: 16,
            }}>
              Taking you to the craziest ICSE tool.
            </div>
            <div style={{
              fontFamily: 'var(--font-tagline)',
              fontSize: isMobile ? 14 : 18,
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--accent-gold)',
              opacity: warpText >= 2 ? 1 : 0,
              transform: warpText >= 2 ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 600ms cubic-bezier(0.16,1,0.3,1)',
            }}>
              Hold tight. It's about to get crazy.
            </div>
          </div>

          {/* Subtle loading indicator */}
          <div style={{
            position: 'absolute',
            bottom: isMobile ? 60 : 48,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            opacity: warpText >= 1 ? 0.5 : 0,
            transition: 'opacity 0.6s ease 0.6s',
          }}>
            <div style={{
              width: 6, height: 6,
              borderRadius: '50%',
              background: 'var(--accent-gold)',
              animation: 'pulse 1.2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Loading your workspace
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
