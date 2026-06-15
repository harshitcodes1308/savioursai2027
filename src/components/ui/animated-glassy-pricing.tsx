'use client';

import { useEffect, useRef, useState } from 'react';
import { trpc } from '@/lib/trpc/client';

// ─── WebGL Shader Background ─────────────────────────────────

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float uTime;
  uniform vec2 uResolution;

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float t = uTime * 0.15;

    // Subtle flowing gradient
    float wave1 = sin(uv.x * 3.0 + t) * 0.5 + 0.5;
    float wave2 = cos(uv.y * 2.5 + t * 0.7) * 0.5 + 0.5;
    float wave3 = sin((uv.x + uv.y) * 2.0 + t * 0.5) * 0.5 + 0.5;

    float blend = wave1 * 0.33 + wave2 * 0.33 + wave3 * 0.33;

    // Dark base with very subtle cyan accents
    vec3 base = vec3(0.039, 0.039, 0.059); // #0A0A0F
    vec3 accent = vec3(0.0, 0.15, 0.2);    // Dark cyan tint
    vec3 color = mix(base, base + accent * 0.15, blend * 0.4);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERTEX_SHADER);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAGMENT_SHADER);
    gl.compileShader(fs);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Full-screen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'uTime');
    const resLoc = gl.getUniformLocation(program, 'uResolution');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const startTime = performance.now();
    const render = () => {
      const t = (performance.now() - startTime) / 1000;
      gl.uniform1f(timeLoc, t);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}

// ─── Pricing Card ─────────────────────────────────────────────

export interface PricingCardProps {
  planName: string;
  description: string;
  price: string;
  priceSymbol: string;
  billingLabel: string;
  savingsLabel?: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'primary' | 'secondary';
  isPopular: boolean;
  discountedPrice?: string;
  discountPct?: number;
  creatorName?: string;
  onClick?: () => void;
}

function PricingCard({
  planName,
  description,
  price,
  priceSymbol,
  billingLabel,
  savingsLabel,
  features,
  buttonText,
  buttonVariant,
  isPopular,
  discountedPrice,
  discountPct,
  creatorName,
  onClick,
}: PricingCardProps) {
  const [hovered, setHovered] = useState(false);
  const hasDiscount = !!discountedPrice && !!discountPct;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'linear-gradient(135deg, rgba(26,26,36,0.85), rgba(17,17,24,0.7))',
        border: isPopular
          ? '1.5px solid var(--accent-gold-border)'
          : '1.5px solid var(--bg-border)',
        borderRadius: '20px',
        backdropFilter: 'blur(14px)',
        padding: '32px 28px',
        position: 'relative',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isPopular
          ? '0 0 32px rgba(0,212,255,0.15)'
          : hovered
          ? '0 12px 40px rgba(0,0,0,0.4)'
          : '0 4px 24px rgba(0,0,0,0.3)',
        transition: 'all 350ms cubic-bezier(0.16,1,0.3,1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {isPopular && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 20,
            background: 'var(--accent-gold)',
            color: '#0A0A0F',
            fontFamily: 'Coolvetica, sans-serif',
            letterSpacing: '0.08em',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            padding: '5px 14px 6px',
            borderRadius: '0 0 8px 8px',
          }}
        >
          Most Popular
        </div>
      )}

      {/* Plan name */}
      <div
        style={{
          fontFamily: 'Coolvetica, sans-serif',
          fontSize: '13px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '16px',
        }}
      >
        {planName}
      </div>

      {/* Price */}
      {hasDiscount ? (
        <div style={{ marginBottom: '4px' }}>
          {/* Creator discount badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 100, marginBottom: 6,
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            fontFamily: 'Helvetica Neue, sans-serif', fontSize: 11, fontWeight: 700,
            color: '#22c55e', letterSpacing: '0.02em',
          }}>
            🎉 {discountPct}% off via {creatorName}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontFamily: 'ScotchDisplay, serif', fontSize: 20,
              color: 'var(--text-muted)', fontWeight: 700,
              textDecoration: 'line-through', opacity: 0.5,
            }}>
              {priceSymbol}{price}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <span style={{ fontFamily: 'ScotchDisplay, serif', fontSize: 18, color: '#22c55e', fontWeight: 700 }}>{priceSymbol}</span>
              <span style={{ fontFamily: 'ScotchDisplay, serif', fontSize: 48, color: '#22c55e', fontWeight: 700, lineHeight: 1 }}>{discountedPrice}</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
          <span style={{
            fontFamily: 'ScotchDisplay, serif', fontSize: '20px',
            color: 'var(--text-primary)', fontWeight: 700,
          }}>
            {priceSymbol}
          </span>
          <span style={{
            fontFamily: 'ScotchDisplay, serif', fontSize: '52px',
            color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1,
          }}>
            {price}
          </span>
        </div>
      )}

      {/* Billing label */}
      <div
        style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: savingsLabel ? '8px' : '12px',
        }}
      >
        {billingLabel}
      </div>

      {/* Savings label */}
      {savingsLabel && (
        <div
          style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '12px',
            color: 'var(--status-green)',
            marginBottom: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(62,207,142,0.08)',
            padding: '3px 10px',
            borderRadius: '100px',
            width: 'fit-content',
          }}
        >
          {savingsLabel}
        </div>
      )}

      {/* Description */}
      <p
        style={{
          fontFamily: 'Helvetica Neue, sans-serif',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: '20px',
          margin: '0 0 20px',
        }}
      >
        {description}
      </p>

      {/* Divider */}
      <div
        style={{
          borderTop: '1px solid var(--bg-border)',
          marginBottom: '16px',
        }}
      />

      {/* Features */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1,
        }}
      >
        {features.map((f) => (
          <li
            key={f}
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <span style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '1px' }}>
              ✦
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        onClick={onClick}
        style={{
          width: '100%',
          padding: '13px 24px',
          borderRadius: '100px',
          fontFamily: 'Coolvetica, sans-serif',
          fontSize: '15px',
          letterSpacing: '0.03em',
          cursor: 'pointer',
          transition: 'all 200ms ease',
          ...(buttonVariant === 'primary'
            ? {
                background: 'var(--accent-gold)',
                color: '#0A0A0F',
                border: 'none',
                fontWeight: 600,
              }
            : {
                background: 'transparent',
                border: '1.5px solid var(--bg-border)',
                color: 'var(--text-secondary)',
              }),
        }}
        onMouseOver={(e) => {
          if (buttonVariant === 'primary') {
            e.currentTarget.style.filter = 'brightness(1.1)';
          } else {
            e.currentTarget.style.borderColor = 'var(--accent-gold-border)';
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.filter = 'none';
          if (buttonVariant !== 'primary') {
            e.currentTarget.style.borderColor = 'var(--bg-border)';
          }
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

// ─── Pricing Page ─────────────────────────────────────────────

const savioursPlans: PricingCardProps[] = [
  {
    planName: 'Free',
    description: 'Start your prep without spending a rupee.',
    price: '0',
    priceSymbol: '₹',
    billingLabel: 'forever',
    features: ['Smart Planner', 'Monthly Mission', 'Dashboard & Subjects'],
    buttonText: 'Get Started Free',
    buttonVariant: 'secondary',
    isPopular: false,
  },
  {
    planName: 'Monthly',
    description: 'Full access, one month at a time.',
    price: '199',
    priceSymbol: '₹',
    billingLabel: '/month',
    features: [
      'Everything in Free',
      'AI Doubt Solver (unlimited)',
      'Smart Planner',
      'Competency Test',
      'Customise Test',
      'Flip the Question',
      'Focus Mode',
    ],
    buttonText: 'Choose Monthly',
    buttonVariant: 'primary',
    isPopular: false,
  },
  {
    planName: 'Yearly',
    description: 'Commit to your boards. Best value.',
    price: '599',
    priceSymbol: '₹',
    billingLabel: '/year',
    savingsLabel: 'Save ₹1,789 vs monthly',
    features: [
      'Everything in Monthly',
      'Priority AI responses',
      'Early access to new features',
      'Yearly progress report',
    ],
    buttonText: 'Get Yearly Access',
    buttonVariant: 'primary',
    isPopular: true,
  },
];

interface AnimatedGlassyPricingProps {
  isMobile: boolean;
  onSelectPlan: (plan: 'FREE' | 'MONTHLY' | 'YEARLY' | 'DOMIN8', domin8Code?: string) => void;
  userName?: string;
  // Optional: pass creator discount directly (avoids DB lag in onboarding flow)
  creatorDiscount?: { discountPercentage: number; creatorName: string } | null;
}

export default function AnimatedGlassyPricing({
  isMobile,
  onSelectPlan,
  userName,
  creatorDiscount,
}: AnimatedGlassyPricingProps) {
  const [showDomin8Modal, setShowDomin8Modal] = useState(false);
  const [domin8Code, setDomin8Code] = useState('');
  // Fall back to DB query if no prop passed (used on /pricing standalone page)
  const { data: dbDiscount } = trpc.creator.getMyDiscount.useQuery(undefined, {
    enabled: creatorDiscount === undefined,
  });

  const activeDiscount = creatorDiscount !== undefined ? creatorDiscount : dbDiscount;
  const discountPct = activeDiscount?.discountPercentage ?? 0;
  const creatorName = activeDiscount?.creatorName ?? undefined;
  // Discount applies to yearly only
  const yearlyDiscounted = discountPct > 0 ? String(Math.round(599 * (1 - discountPct / 100))) : undefined;
  const [domin8Error, setDomin8Error] = useState('');
  const [domin8Loading, setDomin8Loading] = useState(false);

  const handleDomin8Submit = () => {
    const code = domin8Code.trim();
    if (!code || !code.startsWith('W')) {
      setDomin8Error('Invalid code. Please try again.');
      return;
    }
    setDomin8Error('');
    setDomin8Loading(true);
    onSelectPlan('DOMIN8', code);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        zIndex: 1000,
      }}
    >
      <ShaderCanvas />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1060px',
          width: '100%',
          padding: isMobile ? '24px 16px' : '48px 32px',
          animation: 'fadeIn 600ms ease-out both',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: 'ScotchDisplay, serif',
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            textAlign: 'center',
            marginBottom: '8px',
            lineHeight: 1.1,
          }}
        >
          Choose your <span style={{ color: 'var(--accent-gold)' }}>plan</span>
          {userName ? `, ${userName.split(' ')[0]}` : ''}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: isMobile ? '14px' : '16px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginBottom: isMobile ? '32px' : '48px',
          }}
        >
          Your boards are in 10 months. Every day counts.
        </p>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '16px' : '20px',
            marginBottom: '32px',
          }}
        >
          {savioursPlans.map((plan, i) => (
            <div
              key={plan.planName}
              style={{
                animation: `slideInUp 0.5s ease-out ${i * 100}ms both`,
              }}
            >
              <PricingCard
                {...plan}
                discountedPrice={
                  plan.planName === 'Yearly' ? yearlyDiscounted : undefined
                }
                discountPct={plan.planName === 'Yearly' ? discountPct || undefined : undefined}
                creatorName={plan.planName === 'Yearly' ? creatorName : undefined}
                onClick={() =>
                  onSelectPlan(
                    plan.planName.toUpperCase() as 'FREE' | 'MONTHLY' | 'YEARLY'
                  )
                }
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <p
          style={{
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            opacity: 0.5,
          }}
        >
          Secure payment via Razorpay. Cancel anytime.
        </p>
      </div>

      {/* ── Domin8 Pro Code Modal ── */}
      {showDomin8Modal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 200ms ease-out both',
          }}
          onClick={(e) => { if (e.target === e.currentTarget && !domin8Loading) setShowDomin8Modal(false); }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,36,0.95), rgba(17,17,24,0.9))',
              border: '1.5px solid var(--accent-gold-border)',
              borderRadius: '20px',
              backdropFilter: 'blur(14px)',
              padding: isMobile ? '28px 22px' : '36px 32px',
              maxWidth: '420px',
              width: isMobile ? 'calc(100% - 32px)' : '100%',
              boxShadow: '0 0 40px rgba(0,212,255,0.12)',
              animation: 'slideInUp 0.4s ease-out both',
            }}
          >
            {/* Header */}
            <div
              style={{
                fontFamily: 'ScotchDisplay, serif',
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                textAlign: 'center',
                marginBottom: '6px',
              }}
            >
              Domin8 <span style={{ color: 'var(--accent-gold)' }}>Pro</span>
            </div>
            <p
              style={{
                fontFamily: 'Helvetica Neue, sans-serif',
                fontSize: '13px',
                color: 'var(--text-muted)',
                textAlign: 'center',
                marginBottom: '24px',
                lineHeight: 1.5,
              }}
            >
              Enter the special code provided to you
            </p>

            {domin8Loading ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '16px', padding: '20px 0',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '3px solid rgba(255,255,255,0.08)',
                  borderTopColor: 'var(--accent-gold)',
                  animation: 'spin360 0.7s linear infinite',
                }} />
                <div style={{
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontSize: '14px', color: 'var(--text-muted)',
                }}>
                  Activating your access...
                </div>
              </div>
            ) : (
              <>
                {/* Code Input */}
                <input
                  type="text"
                  value={domin8Code}
                  onChange={(e) => { setDomin8Code(e.target.value); setDomin8Error(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleDomin8Submit(); }}
                  placeholder="Enter your code"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: domin8Error
                      ? '1.5px solid rgba(239,68,68,0.5)'
                      : '1.5px solid var(--bg-border)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Coolvetica, sans-serif',
                    fontSize: '16px',
                    letterSpacing: '0.08em',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 200ms ease',
                    textAlign: 'center',
                  }}
                  onFocus={(e) => {
                    if (!domin8Error) e.currentTarget.style.borderColor = 'var(--accent-gold-border)';
                  }}
                  onBlur={(e) => {
                    if (!domin8Error) e.currentTarget.style.borderColor = 'var(--bg-border)';
                  }}
                />

                {/* Error */}
                {domin8Error && (
                  <div
                    style={{
                      fontFamily: 'Helvetica Neue, sans-serif',
                      fontSize: '12px',
                      color: '#ef4444',
                      textAlign: 'center',
                      marginTop: '10px',
                    }}
                  >
                    {domin8Error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleDomin8Submit}
                  style={{
                    width: '100%',
                    padding: '13px 24px',
                    borderRadius: '100px',
                    fontFamily: 'Coolvetica, sans-serif',
                    fontSize: '15px',
                    letterSpacing: '0.03em',
                    cursor: 'pointer',
                    background: 'var(--accent-gold)',
                    color: '#0A0A0F',
                    border: 'none',
                    fontWeight: 600,
                    marginTop: '18px',
                    transition: 'all 200ms ease',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; }}
                >
                  Activate Access
                </button>

                {/* Cancel */}
                <button
                  onClick={() => setShowDomin8Modal(false)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'transparent',
                    border: 'none',
                    fontFamily: 'Helvetica Neue, sans-serif',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    marginTop: '10px',
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
