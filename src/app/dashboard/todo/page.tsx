'use client';

import { useState, useEffect, useCallback } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { MONTHLY_MISSION, getCurrentMonthIndex } from '@/data/monthly-mission';
import type { MonthPlan, SubjectMonth } from '@/data/monthly-mission';

// ── localStorage persistence ────────────────────────────────

const STORAGE_KEY = 'saviours-monthly-mission';

function loadChecked(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveChecked(checked: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
}

// ── Component ───────────────────────────────────────────────

export default function MonthlyMissionPage() {
  const { isMobile } = useResponsive();
  const [activeMonth, setActiveMonth] = useState(getCurrentMonthIndex());
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setChecked(loadChecked());
    setMounted(true);
  }, []);

  const toggleCheck = useCallback((monthIdx: number, todoId: string) => {
    const key = `${monthIdx}:${todoId}`;
    setChecked(prev => {
      const next = { ...prev, [key]: !prev[key] };
      saveChecked(next);
      return next;
    });
  }, []);

  const month = MONTHLY_MISSION[activeMonth];

  // Stats
  const totalTodos = month.subjects.reduce((sum, s) => sum + s.todos.length, 0);
  const completedTodos = month.subjects.reduce(
    (sum, s) => sum + s.todos.filter(t => checked[`${activeMonth}:${t.id}`]).length, 0
  );
  const progressPercent = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  function getSubjectProgress(sub: SubjectMonth): { done: number; total: number } {
    const done = sub.todos.filter(t => checked[`${activeMonth}:${t.id}`]).length;
    return { done, total: sub.todos.length };
  }

  const isCurrentMonth = activeMonth === getCurrentMonthIndex();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: isMobile ? '16px' : '24px 32px',
        borderBottom: '1px solid var(--bg-border)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 12,
          marginBottom: 16,
        }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? 22 : 28,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: 0,
              marginBottom: 4,
            }}>
              Monthly Mission
            </h1>
            <p style={{
              fontFamily: 'var(--font-tagline)',
              fontSize: 13,
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--text-muted)',
              margin: 0,
            }}>
              12-month ICSE board prep — one month at a time.
            </p>
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--accent-gold)',
            fontWeight: 600,
          }}>
            {completedTodos}/{totalTodos} tasks done
          </div>
        </div>

        {/* ── Month selector (horizontal scroll) ── */}
        <div style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 8,
          scrollbarWidth: 'none',
        }}>
          {MONTHLY_MISSION.map((m, i) => {
            const isActive = i === activeMonth;
            const isCurrent = i === getCurrentMonthIndex();
            // Calculate progress for each month pill
            const mTotal = m.subjects.reduce((s, sub) => s + sub.todos.length, 0);
            const mDone = mounted ? m.subjects.reduce(
              (s, sub) => s + sub.todos.filter(t => checked[`${i}:${t.id}`]).length, 0
            ) : 0;
            const mPct = mTotal > 0 ? Math.round((mDone / mTotal) * 100) : 0;

            return (
              <button
                key={m.month}
                onClick={() => { setActiveMonth(i); setExpandedSubject(null); }}
                style={{
                  flexShrink: 0,
                  padding: '8px 16px',
                  borderRadius: 100,
                  border: isActive
                    ? '1.5px solid var(--accent-gold)'
                    : isCurrent
                    ? '1.5px solid var(--accent-gold-border)'
                    : '1.5px solid var(--bg-border)',
                  background: isActive
                    ? 'var(--accent-gold-glow)'
                    : 'transparent',
                  color: isActive
                    ? 'var(--accent-gold)'
                    : isCurrent
                    ? 'var(--text-primary)'
                    : 'var(--text-muted)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {m.month.slice(0, 3)}
                {mounted && mPct === 100 && (
                  <span style={{ color: 'var(--status-green)', fontSize: 10 }}>✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Progress bar ── */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' }}>
              {month.month} progress
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: 'var(--accent-gold)' }}>
              {progressPercent}%
            </span>
          </div>
          <div style={{ height: 4, background: 'var(--bg-border)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: progressPercent === 100
                ? 'var(--status-green)'
                : 'var(--accent-gold)',
              transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
        </div>
      </div>

      {/* ── Month content ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '16px' : '28px 32px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Month header card */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--bg-border)',
            borderRadius: 16,
            padding: isMobile ? '20px 16px' : '28px 24px',
            marginBottom: 20,
            animation: 'pageEnter 0.35s ease-out both',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: isMobile ? 24 : 32,
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}>
                {month.month}
              </span>
              <span style={{
                fontFamily: 'var(--font-tagline)',
                fontSize: isMobile ? 16 : 20,
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'var(--accent-gold)',
              }}>
                "{month.tagline}"
              </span>
              {isCurrentMonth && (
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--status-green)',
                  background: 'rgba(62,207,142,0.1)',
                  padding: '3px 8px',
                  borderRadius: 100,
                }}>
                  NOW
                </span>
              )}
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              margin: 0,
            }}>
              {month.brief}
            </p>
          </div>

          {/* Subject cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {month.subjects.map((sub, subIdx) => {
              const isExpanded = expandedSubject === sub.subject;
              const { done, total } = getSubjectProgress(sub);
              const subPct = total > 0 ? Math.round((done / total) * 100) : 0;
              const isHovered = hoveredSubject === sub.subject;
              const allDone = done === total;

              return (
                <div
                  key={sub.subject}
                  style={{
                    background: 'var(--bg-surface)',
                    border: isExpanded
                      ? `1.5px solid ${sub.color}50`
                      : `1px solid ${isHovered ? 'var(--bg-border-light)' : 'var(--bg-border)'}`,
                    borderRadius: 14,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    animation: `slideInUp 0.4s ease-out ${subIdx * 30}ms both`,
                  }}
                >
                  {/* Subject header (click to expand) */}
                  <button
                    onClick={() => setExpandedSubject(isExpanded ? null : sub.subject)}
                    onMouseEnter={() => setHoveredSubject(sub.subject)}
                    onMouseLeave={() => setHoveredSubject(null)}
                    style={{
                      width: '100%',
                      padding: isMobile ? '14px 14px' : '16px 20px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      textAlign: 'left',
                    }}
                  >
                    {/* Subject icon */}
                    <div style={{
                      width: 40, height: 40, minWidth: 40,
                      borderRadius: 10,
                      background: `${sub.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18,
                    }}>
                      {sub.icon}
                    </div>

                    {/* Name + progress */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 14,
                        fontWeight: 600,
                        color: allDone ? 'var(--text-muted)' : 'var(--text-primary)',
                        letterSpacing: '-0.01em',
                        textDecoration: allDone ? 'line-through' : 'none',
                        marginBottom: 4,
                      }}>
                        {sub.subject}
                      </div>
                      {/* Mini progress bar */}
                      <div style={{
                        height: 3,
                        background: 'var(--bg-border)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        maxWidth: 120,
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${subPct}%`,
                          background: allDone ? 'var(--status-green)' : sub.color,
                          transition: 'width 0.4s ease',
                        }} />
                      </div>
                    </div>

                    {/* Count */}
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: allDone ? 'var(--status-green)' : 'var(--text-muted)',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}>
                      {allDone ? '✓' : `${done}/${total}`}
                    </span>

                    {/* Expand arrow */}
                    <span style={{
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      transform: isExpanded ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                    }}>
                      ▶
                    </span>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{
                      borderTop: `1px solid ${sub.color}20`,
                      padding: isMobile ? '14px' : '16px 20px',
                      animation: 'fadeIn 0.25s ease-out both',
                    }}>
                      {/* Monthly focus */}
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: 'var(--text-secondary)',
                        marginBottom: 16,
                        padding: '12px 14px',
                        background: `${sub.color}08`,
                        borderRadius: 10,
                        borderLeft: `3px solid ${sub.color}60`,
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: sub.color,
                          display: 'block',
                          marginBottom: 6,
                        }}>
                          Monthly Focus
                        </span>
                        {sub.focus}
                      </div>

                      {/* To-do items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {sub.todos.map(todo => {
                          const key = `${activeMonth}:${todo.id}`;
                          const isDone = !!checked[key];
                          return (
                            <label
                              key={todo.id}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 10,
                                padding: '10px 12px',
                                borderRadius: 8,
                                cursor: 'pointer',
                                background: isDone ? 'rgba(62,207,142,0.04)' : 'transparent',
                                transition: 'background 0.15s ease',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() => toggleCheck(activeMonth, todo.id)}
                                style={{
                                  width: 18, height: 18, minWidth: 18,
                                  accentColor: sub.color,
                                  cursor: 'pointer',
                                  marginTop: 1,
                                }}
                              />
                              <span style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 13,
                                lineHeight: 1.5,
                                color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                                textDecoration: isDone ? 'line-through' : 'none',
                                transition: 'color 0.15s ease',
                              }}>
                                {todo.text}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
