'use client';

import { useState, useEffect, useCallback } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import {
  MONTHLY_MISSION,
  getCurrentMonthIndex,
  getMonthTaskCounts,
  getSubjectMeta,
} from '@/data/monthly-mission';

// ── localStorage ─────────────────────────────────────────────────────────────

const KEY = 'saviours-monthly-mission-v2';

function load(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
  catch { return {}; }
}
function save(c: Record<string, boolean>) {
  localStorage.setItem(KEY, JSON.stringify(c));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MonthlyMissionPage() {
  const { isMobile } = useResponsive();
  const [activeMonth, setActiveMonth] = useState(getCurrentMonthIndex());
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  // Only the first week (index 0) of each month starts open; rest start collapsed
  const [collapsedWeeks, setCollapsedWeeks] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    MONTHLY_MISSION.forEach((m, mi) => {
      m.weeks.forEach((w, wi) => {
        if (wi !== 0) init[`${mi}:${w.id}`] = true;
      });
    });
    return init;
  });

  useEffect(() => { setChecked(load()); setMounted(true); }, []);

  const toggle = useCallback((key: string) => {
    setChecked(prev => {
      const next = { ...prev, [key]: !prev[key] };
      save(next);
      return next;
    });
  }, []);

  const toggleWeek = (key: string) =>
    setCollapsedWeeks(prev => ({ ...prev, [key]: !prev[key] }));

  const month = MONTHLY_MISSION[activeMonth];
  const { total: mTotal, done: mDone } = mounted
    ? getMonthTaskCounts(activeMonth, checked)
    : { total: 1, done: 0 };
  const mPct = mTotal > 0 ? Math.round((mDone / mTotal) * 100) : 0;
  const isCurrentMonth = activeMonth === getCurrentMonthIndex();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <div style={{
        padding: isMobile ? '16px' : '20px 32px',
        borderBottom: '1px solid var(--bg-border)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: isMobile ? 20 : 26,
              color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0, marginBottom: 2,
            }}>Monthly Mission</h1>
            <div style={{
              fontFamily: 'var(--font-tagline)', fontSize: 12, fontStyle: 'italic',
              color: 'var(--text-muted)',
            }}>12-month ICSE board prep — one month at a time.</div>
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
            color: mPct === 100 ? 'var(--status-green)' : 'var(--accent-gold)',
          }}>
            {mounted ? `${mDone}/${mTotal} done` : '—'}
          </div>
        </div>

        {/* Month pills */}
        <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none', marginBottom: 10 }}>
          {MONTHLY_MISSION.map((m, i) => {
            const isActive = i === activeMonth;
            const isCurr = i === getCurrentMonthIndex();
            const { done, total } = mounted ? getMonthTaskCounts(i, checked) : { done: 0, total: 1 };
            const done100 = total > 0 && done === total;
            return (
              <button
                key={m.month}
                onClick={() => setActiveMonth(i)}
                style={{
                  flexShrink: 0, padding: '6px 14px', borderRadius: 100,
                  border: isActive ? '1.5px solid var(--accent-gold)' : isCurr ? '1.5px solid var(--accent-gold-border)' : '1.5px solid var(--bg-border)',
                  background: isActive ? 'var(--accent-gold-glow)' : 'transparent',
                  color: isActive ? 'var(--accent-gold)' : isCurr ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                {m.month.slice(0, 3)}
                {mounted && done100 && <span style={{ color: 'var(--status-green)', fontSize: 9 }}>✓</span>}
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-muted)' }}>{month.month} progress</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: mPct === 100 ? 'var(--status-green)' : 'var(--accent-gold)' }}>{mPct}%</span>
        </div>
        <div style={{ height: 3, background: 'var(--bg-border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${mPct}%`, height: '100%',
            background: mPct === 100 ? 'var(--status-green)' : 'var(--accent-gold)',
            transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* Month hero */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--bg-border)',
            borderRadius: 16,
            padding: isMobile ? '18px 16px' : '24px 26px',
            marginBottom: 20,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 28, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {month.month}
              </span>
              <span style={{ fontFamily: 'var(--font-tagline)', fontSize: isMobile ? 14 : 17, fontStyle: 'italic', color: 'var(--accent-gold)' }}>
                "{month.tagline}"
              </span>
              {isCurrentMonth && (
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--status-green)',
                  background: 'rgba(62,207,142,0.1)', padding: '2px 8px', borderRadius: 100,
                  border: '1px solid rgba(62,207,142,0.2)',
                }}>NOW</span>
              )}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
              {month.brief}
            </p>
          </div>

          {/* Week cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {month.weeks.map((wk) => {
              const wkKey = `${activeMonth}:${wk.id}`;
              const isCollapsed = collapsedWeeks[wkKey];

              // Per-week counts
              let wkTotal = wk.tasks.length + wk.addons.length;
              let wkDone = mounted ? (
                wk.tasks.filter(t => checked[`${activeMonth}:${wk.id}:${t.id}`]).length +
                wk.addons.filter((_, i) => checked[`${activeMonth}:${wk.id}:a${i}`]).length
              ) : 0;
              const wkPct = wkTotal > 0 ? Math.round((wkDone / wkTotal) * 100) : 0;
              const wkDone100 = wkTotal > 0 && wkDone === wkTotal;

              return (
                <div key={wk.id} style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${wkDone100 ? 'rgba(62,207,142,0.3)' : 'var(--bg-border)'}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease',
                }}>
                  {/* Week header */}
                  <button
                    onClick={() => toggleWeek(wkKey)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: isMobile ? '13px 14px' : '15px 20px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {wkDone100 ? (
                        <span style={{
                          width: 22, height: 22, borderRadius: 7, background: 'rgba(62,207,142,0.15)',
                          border: '1px solid rgba(62,207,142,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, color: 'var(--status-green)', flexShrink: 0,
                        }}>✓</span>
                      ) : (
                        <span style={{
                          width: 22, height: 22, borderRadius: 7, background: 'var(--accent-gold-glow)',
                          border: '1px solid var(--accent-gold-border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, fontWeight: 700, color: 'var(--accent-gold)',
                          fontFamily: 'var(--font-body)', flexShrink: 0,
                        }}>W</span>
                      )}
                      <span style={{
                        fontFamily: 'var(--font-display)', fontSize: isMobile ? 14 : 15,
                        color: wkDone100 ? 'var(--text-muted)' : 'var(--text-primary)',
                        letterSpacing: '-0.01em',
                        textDecoration: wkDone100 ? 'line-through' : 'none',
                      }}>{wk.label}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {/* Mini progress bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 56, height: 3, background: 'var(--bg-border)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{
                            width: `${wkPct}%`, height: '100%',
                            background: wkDone100 ? 'var(--status-green)' : 'var(--accent-gold)',
                            transition: 'width 0.4s ease',
                          }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: wkDone100 ? 'var(--status-green)' : 'var(--text-muted)', minWidth: 28, textAlign: 'right' }}>
                          {mounted ? `${wkDone}/${wkTotal}` : '—'}
                        </span>
                      </div>
                      <span style={{ fontSize: 9, color: 'var(--text-muted)', transform: isCollapsed ? 'none' : 'rotate(90deg)', transition: 'transform 0.2s ease' }}>▶</span>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {!isCollapsed && (
                    <div style={{ borderTop: '1px solid var(--bg-border)' }}>

                      {/* Tasks */}
                      {wk.tasks.length > 0 && (
                        <div style={{ padding: isMobile ? '10px 14px' : '12px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {wk.tasks.map((task) => {
                            const taskKey = `${activeMonth}:${wk.id}:${task.id}`;
                            const isDone = !!checked[taskKey];
                            const meta = task.subject ? getSubjectMeta(task.subject) : null;

                            return (
                              <label
                                key={task.id}
                                style={{
                                  display: 'flex', alignItems: 'flex-start', gap: 10,
                                  padding: '9px 10px', borderRadius: 8, cursor: 'pointer',
                                  background: isDone ? 'rgba(62,207,142,0.04)' : 'transparent',
                                  transition: 'background 0.15s ease',
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isDone}
                                  onChange={() => toggle(taskKey)}
                                  style={{ width: 15, height: 15, minWidth: 15, marginTop: 2, cursor: 'pointer', accentColor: meta?.color ?? 'var(--accent-gold)' }}
                                />
                                {meta && (
                                  <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                    padding: '2px 8px', borderRadius: 100,
                                    background: `${meta.color}14`,
                                    border: `1px solid ${meta.color}28`,
                                    fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
                                    color: isDone ? 'var(--text-muted)' : meta.color,
                                    whiteSpace: 'nowrap', flexShrink: 0,
                                    transition: 'color 0.15s ease',
                                    textDecoration: isDone ? 'line-through' : 'none',
                                  }}>
                                    <span style={{ fontSize: 11 }}>{meta.icon}</span>
                                    {meta.short}
                                  </span>
                                )}
                                <span style={{
                                  fontFamily: 'var(--font-body)', fontSize: isMobile ? 12 : 13,
                                  color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                                  lineHeight: 1.5,
                                  textDecoration: isDone ? 'line-through' : 'none',
                                  transition: 'color 0.15s ease',
                                  flex: 1,
                                }}>
                                  {task.task}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Addons */}
                      {wk.addons.length > 0 && (
                        <div style={{
                          borderTop: '1px solid var(--bg-border)',
                          padding: isMobile ? '10px 14px' : '10px 20px',
                          background: 'rgba(0,212,255,0.02)',
                        }}>
                          <div style={{
                            fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700,
                            letterSpacing: '0.16em', textTransform: 'uppercase',
                            color: 'var(--accent-gold)', opacity: 0.8, marginBottom: 6,
                            paddingLeft: 10,
                          }}>
                            Weekly Add-ons
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {wk.addons.map((addon, i) => {
                              const addonKey = `${activeMonth}:${wk.id}:a${i}`;
                              const isDone = !!checked[addonKey];
                              return (
                                <label
                                  key={i}
                                  style={{
                                    display: 'flex', alignItems: 'flex-start', gap: 10,
                                    padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
                                    background: isDone ? 'rgba(62,207,142,0.04)' : 'transparent',
                                    transition: 'background 0.15s ease',
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isDone}
                                    onChange={() => toggle(addonKey)}
                                    style={{ width: 14, height: 14, minWidth: 14, marginTop: 2, cursor: 'pointer', accentColor: 'var(--accent-gold)' }}
                                  />
                                  <span style={{
                                    fontFamily: 'var(--font-body)', fontSize: isMobile ? 11 : 12,
                                    color: isDone ? 'var(--text-muted)' : 'var(--text-secondary)',
                                    lineHeight: 1.5,
                                    textDecoration: isDone ? 'line-through' : 'none',
                                    transition: 'color 0.15s ease',
                                  }}>
                                    {addon}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom spacer */}
          <div style={{ height: 32 }} />
        </div>
      </div>
    </div>
  );
}
