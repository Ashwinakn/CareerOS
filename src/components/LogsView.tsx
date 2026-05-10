'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import {
  Plus, Trash2, Flame, Check, Calendar,
  CheckCircle2, Target, Frown, Meh, Smile, SmilePlus, Zap, Sunrise
} from 'lucide-react';
import { DailyLog } from '@/lib/store';

// Mood config using only icons
const MOOD_CONFIG: Record<number, { icon: React.ComponentType<{ size?: number; color?: string }>; color: string; label: string }> = {
  1: { icon: Frown,     color: '#fb7185', label: 'Rough' },
  2: { icon: Meh,       color: '#94a3b8', label: 'Okay' },
  3: { icon: Smile,     color: '#fbbf24', label: 'Good' },
  4: { icon: SmilePlus, color: '#34d399', label: 'Great' },
  5: { icon: Zap,       color: '#a78bfa', label: 'Legendary' },
};

export function calcStreak(logs: DailyLog[]): number {
  if (logs.length === 0) return 0;
  const dates = [...new Set(logs.map(l => l.date))].sort((a, b) => b.localeCompare(a));
  const today = new Date().toISOString().split('T')[0];
  if (dates[0] !== today) return 0;
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function LogCard({ log }: { log: DailyLog }) {
  const { dispatch } = useApp();
  const isToday = log.date === new Date().toISOString().split('T')[0];
  const mood = MOOD_CONFIG[log.mood];
  const MoodIcon = mood.icon;

  return (
    <div className="card" style={{ padding: 20, borderLeft: isToday ? '3px solid var(--accent-primary)' : '3px solid transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: isToday ? 'rgba(99,102,241,0.12)' : 'var(--bg-hover)',
            color: isToday ? 'var(--accent-secondary)' : 'var(--text-muted)',
            border: isToday ? '1px solid rgba(99,102,241,0.25)' : '1px solid var(--border-subtle)',
          }}>
            {formatDate(log.date)}
          </div>
          {isToday && <span style={{ fontSize: 11, color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.05em' }}>● TODAY</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Mood icon with label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, background: `${mood.color}18`, border: `1px solid ${mood.color}30` }} title={mood.label}>
            <MoodIcon size={14} color={mood.color} />
            <span style={{ fontSize: 11, fontWeight: 600, color: mood.color }}>{mood.label}</span>
          </div>
          <button className="btn-ghost" style={{ padding: '4px 6px' }} onClick={() => dispatch({ type: 'DELETE_LOG', payload: log.id })}>
            <Trash2 size={13} style={{ color: '#fb7185' }} />
          </button>
        </div>
      </div>

      <div style={{ marginBottom: log.planned ? 12 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
          <CheckCircle2 size={12} color="#34d399" /> Accomplished
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{log.accomplished}</p>
      </div>

      {log.planned && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            <Target size={12} color="var(--accent-secondary)" /> Planned Next
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{log.planned}</p>
        </div>
      )}
    </div>
  );
}

export default function LogsView() {
  const { state, dispatch } = useApp();
  const [accomplished, setAccomplished] = useState('');
  const [planned, setPlanned] = useState('');
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(3);

  const today = new Date().toISOString().split('T')[0];
  const alreadyLoggedToday = state.logs.some(l => l.date === today);
  const streak = calcStreak(state.logs);

  const submit = () => {
    if (!accomplished.trim()) return;
    dispatch({ type: 'ADD_LOG', payload: { date: today, accomplished: accomplished.trim(), planned: planned.trim(), mood } });
    setAccomplished('');
    setPlanned('');
    setMood(3);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em' }}>Daily Progress Log</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 2 }}>{state.logs.length} entries · Standup-style journaling</p>
        </div>
        {streak > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12 }}>
            <Flame size={20} style={{ color: '#f59e0b' }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fbbf24' }}>{streak}</div>
              <div style={{ fontSize: 11, color: '#92400e' }}>day streak</div>
            </div>
          </div>
        )}
      </div>

      {/* Log Form */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600 }}>
            {alreadyLoggedToday
              ? <><Plus size={16} color="var(--accent-primary)" /> Add Another Entry</>
              : <><Sunrise size={16} color="#fbbf24" /> Today's Standup</>
            }
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>
              <CheckCircle2 size={13} color="#34d399" /> What did you accomplish today? *
            </label>
            <textarea
              className="input-base"
              value={accomplished}
              onChange={e => setAccomplished(e.target.value)}
              rows={3}
              placeholder="e.g. Completed the PatchCore training loop. Achieved 94% AUROC on MVTec."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>
              <Target size={13} color="var(--accent-secondary)" /> Plan for tomorrow?
            </label>
            <textarea
              className="input-base"
              value={planned}
              onChange={e => setPlanned(e.target.value)}
              rows={2}
              placeholder="e.g. Add anomaly heatmap visualization. Start writing README."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 10, fontWeight: 600 }}>
              How was your day?
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {([1, 2, 3, 4, 5] as const).map(m => {
                const cfg = MOOD_CONFIG[m];
                const Icon = cfg.icon;
                const selected = mood === m;
                return (
                  <button key={m} onClick={() => setMood(m)} title={cfg.label} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                    border: `2px solid ${selected ? cfg.color : 'var(--border-subtle)'}`,
                    background: selected ? `${cfg.color}15` : 'var(--bg-root)',
                    transition: 'all 0.15s ease', fontFamily: 'inherit',
                    color: selected ? cfg.color : 'var(--text-muted)',
                    fontSize: 12, fontWeight: selected ? 600 : 400,
                  }}>
                    <Icon size={16} color={selected ? cfg.color : 'var(--text-muted)'} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={submit} disabled={!accomplished.trim()} style={{ opacity: accomplished.trim() ? 1 : 0.5 }}>
            <Check size={15} /> Log Progress
          </button>
        </div>
      </div>

      {/* Activity strip */}
      {state.logs.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.06em' }}>ACTIVITY — LAST 30 DAYS</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {Array.from({ length: 30 }, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (29 - i));
              const ds = d.toISOString().split('T')[0];
              const has = state.logs.some(l => l.date === ds);
              const isToday = ds === today;
              return (
                <div key={ds} title={ds} style={{
                  width: 18, height: 18, borderRadius: 4,
                  background: has ? (isToday ? 'var(--accent-primary)' : 'var(--accent-primary-hover)80') : 'var(--bg-hover)',
                  border: isToday ? '2px solid var(--accent-secondary)' : 'none',
                  transition: 'all 0.15s ease',
                }} />
              );
            })}
          </div>
        </div>
      )}

      {/* Log Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {state.logs.length === 0 ? (
          <div className="card empty-state">
            <Calendar size={32} color="var(--border-active)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 15, color: 'var(--text-dim)' }}>No logs yet. Log your first day above!</div>
          </div>
        ) : (
          state.logs.map(log => <LogCard key={log.id} log={log} />)
        )}
      </div>
    </div>
  );
}
