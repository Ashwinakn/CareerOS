'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import {
  Camera, Brain, BookOpen, GraduationCap, Calendar, Briefcase,
  TrendingUp, CheckCircle2, Clock, Flame, Award, ArrowRight,
  Circle, Zap, Target, Timer, Plus, Trash2, ChevronLeft, ChevronRight,
  ListChecks, Hand, PartyPopper, Rocket
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>> = {
  Camera, Brain, BookOpen, GraduationCap, Zap, Target, TrendingUp, Award,
};

interface DashboardViewProps {
  onNavigate: (view: 'learning' | 'events' | 'internships' | 'logs') => void;
  streak: number;
}

function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: string | number; sub?: string;
  color: string; icon: React.ComponentType<{ size?: number; color?: string }>;
}) {
  return (
    <div className="card" style={{ padding: '18px 20px', flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, background: `${color}18`, border: `1px solid ${color}30`,
          borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={17} color={color} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: color, marginTop: 6, opacity: 0.85, display: 'flex', alignItems: 'center', gap: 4 }}>{sub}</div>}
    </div>
  );
}

function WeekendCountdown() {
  const [timeLeft, setTimeLeft] = React.useState('');

  React.useEffect(() => {
    const calc = () => {
      const now = new Date();
      const day = now.getDay();
      if (day === 6 || day === 0) return 'Weekend! 🚀';
      const target = new Date(now);
      target.setDate(now.getDate() + (5 - day));
      target.setHours(18, 0, 0, 0);
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) return 'Weekend starting...';
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      return `${d}d ${h}h ${m}m to sprint`;
    };
    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--accent-transparent)', borderColor: 'var(--accent-transparent-hover)', flex: 1 }}>
      <Timer size={16} color="var(--accent-secondary)" />
      <div>
        <div style={{ fontSize: 10, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Sprint Countdown</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{timeLeft}</div>
      </div>
    </div>
  );
}

// ── Todo Checklist Panel ────────────────────────────────────────────────────

function TodoPanel() {
  const { state, dispatch } = useApp();
  const [text, setText] = useState('');
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);

  const todos = (state.todos || []).filter(t => t.date === viewDate);
  const done = todos.filter(t => t.done).length;

  const addTodo = () => {
    if (!text.trim()) return;
    dispatch({ type: 'ADD_TODO', payload: { date: viewDate, text: text.trim() } });
    setText('');
  };

  const changeDay = (delta: number) => {
    const d = new Date(viewDate + 'T12:00:00'); // noon avoids all DST/timezone edge cases
    d.setDate(d.getDate() + delta);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setViewDate(`${yyyy}-${mm}-${dd}`);
  };

  const isToday = viewDate === new Date().toISOString().split('T')[0];

  const displayDate = () => {
    const d = new Date(viewDate + 'T00:00:00');
    if (isToday) return 'Today';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="card" style={{
      width: 260, minWidth: 260, flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      padding: 0, overflow: 'hidden',
      height: 'fit-content',
      position: 'sticky', top: 24,
    }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <ListChecks size={15} color="var(--accent-primary)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>To-Do</span>
          {todos.length > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, color: done === todos.length ? '#34d399' : 'var(--text-muted)' }}>
              {done}/{todos.length}
            </span>
          )}
        </div>
        {/* Date nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button className="btn-ghost" style={{ padding: '3px 6px' }} onClick={() => changeDay(-1)}>
            <ChevronLeft size={14} />
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: isToday ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{displayDate()}</div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{new Date(viewDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <button className="btn-ghost" style={{ padding: '3px 6px' }} onClick={() => changeDay(1)}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
        {todos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 16px', color: 'var(--text-dim)', fontSize: 12 }}>
            No tasks for this day
          </div>
        )}
        {todos.map((todo, idx) => (
          <div key={todo.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 14px',
            position: 'relative',
          }}>
            {/* Checkbox */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
              style={{
                width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 2,
                border: `2px solid ${todo.done ? 'var(--accent-primary)' : 'var(--border-active)'}`,
                background: todo.done ? 'var(--accent-primary)' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              {todo.done && <CheckCircle2 size={10} color="white" />}
            </button>
            {/* Text + dotted line */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: todo.done ? 'var(--text-dim)' : 'var(--text-secondary)', textDecoration: todo.done ? 'line-through' : 'none', lineHeight: 1.5, wordBreak: 'break-word' }}>
                {todo.text}
              </div>
              {/* Dotted separator */}
              {idx < todos.length - 1 && (
                <div style={{ marginTop: 8, borderBottom: '1px dashed var(--border-subtle)' }} />
              )}
            </div>
            <button className="btn-ghost" style={{ padding: '1px 3px', opacity: 0.4, flexShrink: 0 }}
              onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
              <Trash2 size={11} color="#fb7185" />
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addTodo(); }}
            placeholder="Add task..."
            style={{ flex: 1, background: 'var(--bg-root)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: 'var(--text-primary)', padding: '6px 10px', fontSize: 12, outline: 'none', fontFamily: 'inherit' }}
          />
          <button className="btn-primary" style={{ padding: '6px 10px' }} onClick={addTodo}>
            <Plus size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

export default function DashboardView({ onNavigate, streak }: DashboardViewProps) {
  const { state } = useApp();

  const allProjects: Array<{ status: string; title: string }> = [];
  for (const topic of state.topics) for (const mod of topic.modules) for (const proj of mod.projects) allProjects.push(proj);

  const completedProjects = allProjects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = allProjects.filter(p => p.status === 'In-Progress').length;
  const upcomingEvents = state.events.filter(e => e.status !== 'Completed' && e.status !== 'Missed').length;
  const activeApps = state.internships.filter(i => i.status === 'Interviewing').length;
  const totalApps = state.internships.length;
  const offers = state.internships.filter(i => i.status === 'Offer').length;

  const today = new Date().toISOString().split('T')[0];
  const todayLog = state.logs.find(l => l.date === today);
  const recentLogs = state.logs.slice(0, 3);

  const topicProgress = state.topics.map(topic => {
    const completed = topic.modules.filter(m => m.status === 'Completed').length;
    return { ...topic, completed, total: topic.modules.length };
  });

  const kanbanCounts = {
    Applied: state.internships.filter(i => i.status === 'Applied').length,
    Interviewing: state.internships.filter(i => i.status === 'Interviewing').length,
    Offer: state.internships.filter(i => i.status === 'Offer').length,
    Ghosted: state.internships.filter(i => i.status === 'Ghosted').length,
  };

  return (
    <div className="animate-fade-in" style={{ padding: '28px 32px', maxWidth: 1300, margin: '0 auto', minHeight: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 10 }}>
          Good {getGreeting()},{' '}
          <span>{state.profile?.name || 'Engineer'}</span>
          <Hand size={22} style={{ color: '#fbbf24' }} />
          {streak > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 99, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', fontSize: 12, fontWeight: 600, color: '#fbbf24' }}>
              <Flame size={12} style={{ color: '#f59e0b' }} /> {streak}d
            </span>
          )}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
          {todayLog ? `Today: "${todayLog.accomplished.slice(0, 80)}${todayLog.accomplished.length > 80 ? '…' : ''}"` : "Haven't logged today yet — keep your streak alive!"}
        </p>
      </div>

      {/* Main 2-col layout: left content + right checklist */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Left column */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Stat cards row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <WeekendCountdown />
            <StatCard label="In Progress" value={inProgressProjects} color="var(--accent-primary)" icon={Circle} sub={`${completedProjects} done`} />
            <StatCard label="Events" value={upcomingEvents} color="#22d3ee" icon={Calendar} sub="upcoming" />
            <StatCard label="Interviews" value={activeApps} color="#a78bfa" icon={Briefcase} sub={`${totalApps} total`} />
            <StatCard label="Offers" value={offers} color="#34d399" icon={Award} sub={offers > 0 ? 'Congrats!' : 'Keep at it!'} />
          </div>

          {/* Two-col cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Learning Progress */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Learning Progress</h2>
                <button className="btn-ghost" onClick={() => onNavigate('learning')} style={{ fontSize: 11 }}>
                  View all <ArrowRight size={12} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {topicProgress.map(topic => {
                  const Icon = ICON_MAP[topic.icon] || BookOpen;
                  const pct = topic.total === 0 ? 0 : Math.round((topic.completed / topic.total) * 100);
                  return (
                    <div key={topic.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Icon size={12} color="var(--accent-secondary)" />
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{topic.title}</span>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{topic.completed}/{topic.total}</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                    </div>
                  );
                })}
                {topicProgress.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-dim)', fontSize: 12 }}>
                    <div style={{ marginBottom: 8 }}>Ready to build something?</div>
                    <button className="btn-primary" onClick={() => onNavigate('learning')} style={{ fontSize: 11 }}>
                    <Rocket size={12} /> Start your first CV project
                  </button>
                  </div>
                )}
              </div>
            </div>

            {/* Internship Pipeline */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Internship Pipeline</h2>
                <button className="btn-ghost" onClick={() => onNavigate('internships')} style={{ fontSize: 11 }}>
                  View all <ArrowRight size={12} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Applied', value: kanbanCounts.Applied, color: '#38bdf8' },
                  { label: 'Interviewing', value: kanbanCounts.Interviewing, color: '#a78bfa' },
                  { label: 'Offer', value: kanbanCounts.Offer, color: '#34d399' },
                  { label: 'Ghosted', value: kanbanCounts.Ghosted, color: 'var(--text-muted)' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--bg-root)', border: `1px solid ${item.color}20`, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: item.color }}>{item.value}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{item.label}</div>
                  </div>
                ))}
              </div>
              {totalApps === 0 && <div style={{ color: 'var(--text-dim)', fontSize: 12, textAlign: 'center', marginTop: 8 }}>Start tracking applications!</div>}
            </div>
          </div>

          {/* Recent Logs */}
          <div className="card" style={{ padding: '20px 18px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Recent Progress</h2>
              <button className="btn-ghost" onClick={() => onNavigate('logs')} style={{ fontSize: 11 }}>View all <ArrowRight size={12} /></button>
            </div>
            {recentLogs.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>No logs yet. Start logging!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentLogs.map(log => (
                  <div key={log.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--bg-root)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ padding: '2px 8px', borderRadius: 6, background: 'var(--accent-transparent)', fontSize: 10, color: 'var(--accent-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {formatLogDate(log.date)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                      {log.accomplished.slice(0, 90)}{log.accomplished.length > 90 ? '…' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Checklist */}
        <TodoPanel />
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function formatLogDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
