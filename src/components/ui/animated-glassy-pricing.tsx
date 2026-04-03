'use client';

import { useEffect, useRef, useState } from 'react';

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
  onClick,
}: PricingCardProps) {
  const [hovered, setHovered] = useState(false);

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
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
        <span
          style={{
            fontFamily: 'ScotchDisplay, serif',
            fontSize: '20px',
            color: 'var(--text-primary)',
            fontWeight: 700,
          }}
        >
          {priceSymbol}
        </span>
        <span
          style={{
            fontFamily: 'ScotchDisplay, serif',
            fontSize: '52px',
            color: 'var(--text-primary)',
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {price}
        </span>
      </div>

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
    features: ['To-do List', 'AI Doubt Solver (3/day)', 'Class schedule view'],
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
    price: '499',
    priceSymbol: '₹',
    billingLabel: '/year',
    savingsLabel: 'Save ₹1,889 vs monthly',
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
  onSelectPlan: (plan: 'FREE' | 'MONTHLY' | 'YEARLY') => void;
  userName?: string;
}

export default function AnimatedGlassyPricing({
  isMobile,
  onSelectPlan,
  userName,
}: AnimatedGlassyPricingProps) {
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
    </div>
  );
}
