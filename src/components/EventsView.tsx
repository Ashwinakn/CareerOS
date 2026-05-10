'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { Plus, Trash2, ExternalLink, Calendar, Users, Trophy } from 'lucide-react';
import { HackathonEvent, EventStatus } from '@/lib/store';

const EVENT_STATUSES: EventStatus[] = ['Interested', 'Applied', 'Attending', 'Completed', 'Missed'];

const STATUS_STYLES: Record<EventStatus, string> = {
  Interested: 'status-interested',
  Applied: 'status-applied',
  Attending: 'status-attending',
  Completed: 'status-completed',
  Missed: 'status-ghosted',
};

function AddEventModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState<Omit<HackathonEvent, 'id' | 'createdAt'>>({
    name: '', date: '', registrationLink: '', status: 'Interested', teamNotes: '', prize: '', location: '',
    projectTitle: '', projectDescription: '', githubRepo: '', demoLink: '', pptLink: ''
  });

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name.trim()) return;
    dispatch({ type: 'ADD_EVENT', payload: form });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Add Event / Hackathon</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Event Name *</label>
            <input className="input-base" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Smart India Hackathon 2025" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Date</label>
              <input className="input-base" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Status</label>
              <select className="input-base" value={form.status} onChange={e => set('status', e.target.value)}>
                {EVENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Prize / Reward</label>
              <input className="input-base" value={form.prize} onChange={e => set('prize', e.target.value)} placeholder="e.g. ₹1,00,000" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Location</label>
              <input className="input-base" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Online / IIT Bombay" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Registration Link</label>
            <input className="input-base" value={form.registrationLink} onChange={e => set('registrationLink', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Team Formation Notes</label>
            <textarea className="input-base" value={form.teamNotes} onChange={e => set('teamNotes', e.target.value)} rows={3} placeholder="Looking for teammates, ideas, stack to use..." />
          </div>
          
          <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border-subtle)', marginTop: 8 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Trophy size={14} color="#fbbf24" /> Project Details (Optional)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input-base" value={form.projectTitle || ''} onChange={e => set('projectTitle', e.target.value)} placeholder="Project Name" />
              <textarea className="input-base" value={form.projectDescription || ''} onChange={e => set('projectDescription', e.target.value)} rows={2} placeholder="What are you building?" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input className="input-base" value={form.githubRepo || ''} onChange={e => set('githubRepo', e.target.value)} placeholder="GitHub Repo URL" />
                <input className="input-base" value={form.demoLink || ''} onChange={e => set('demoLink', e.target.value)} placeholder="Demo / Deployed Link" />
              </div>
              <input className="input-base" value={form.pptLink || ''} onChange={e => set('pptLink', e.target.value)} placeholder="PPT / Pitch Deck URL" />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}><Plus size={14} /> Add Event</button>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: HackathonEvent }) {
  const { dispatch } = useApp();
  const [expanded, setExpanded] = useState(false);

  const daysUntil = event.date ? Math.ceil((new Date(event.date).getTime() - Date.now()) / 86400000) : null;

  return (
    <div className="card glass-hover" style={{ padding: 20, cursor: 'pointer' }} onClick={() => setExpanded(e => !e)}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Date block */}
        <div style={{
          minWidth: 56, textAlign: 'center', background: 'var(--bg-root)',
          border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 4px',
        }}>
          {event.date ? (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                {new Date(event.date + 'T00:00:00').getDate()}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {new Date(event.date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short' })}
              </div>
            </>
          ) : <Calendar size={20} color="var(--text-dim)" />}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{event.name}</span>
            <span className={`tag ${STATUS_STYLES[event.status]}`}>{event.status}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {event.location && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {event.location}</span>}
            {event.prize && <span style={{ fontSize: 12, color: '#fbbf24' }}>🏆 {event.prize}</span>}
            {daysUntil !== null && daysUntil > 0 && (
              <span style={{ fontSize: 12, color: '#22d3ee' }}>⏱ {daysUntil}d left</span>
            )}
            {daysUntil !== null && daysUntil <= 0 && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Event passed</span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {event.registrationLink && (
            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()} style={{ color: 'var(--accent-primary)' }}>
              <ExternalLink size={15} />
            </a>
          )}
          <button className="btn-ghost" style={{ padding: '4px 6px' }}
            onClick={e => { e.stopPropagation(); dispatch({ type: 'DELETE_EVENT', payload: event.id }); }}>
            <Trash2 size={14} style={{ color: '#ef4444' }} />
          </button>
        </div>
      </div>

      {expanded && event.teamNotes && (
        <div style={{
          marginTop: 12, padding: '10px 12px',
          background: 'var(--bg-root)', borderRadius: 8, border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Users size={13} color="var(--text-muted)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Team Notes</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{event.teamNotes}</p>
        </div>
      )}

      {expanded && event.projectTitle && (
        <div style={{ marginTop: 12, padding: '12px', background: 'rgba(56,189,248,0.05)', borderRadius: 8, border: '1px solid rgba(56,189,248,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Trophy size={14} color="#38bdf8" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{event.projectTitle}</span>
          </div>
          {event.projectDescription && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{event.projectDescription}</p>}
          
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {event.githubRepo && <a href={event.githubRepo} target="_blank" className="btn-secondary" style={{ fontSize: 11, padding: '2px 8px' }}>GitHub</a>}
            {event.demoLink && <a href={event.demoLink} target="_blank" className="btn-secondary" style={{ fontSize: 11, padding: '2px 8px' }}>Demo / Deployed</a>}
            {event.pptLink && <a href={event.pptLink} target="_blank" className="btn-secondary" style={{ fontSize: 11, padding: '2px 8px' }}>PPT</a>}
          </div>
        </div>
      )}

      {/* Status changer */}
      {expanded && (
        <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
          {EVENT_STATUSES.map(s => (
            <button key={s} className="btn-ghost" style={{
              fontSize: 12, padding: '3px 10px',
              background: event.status === s ? 'rgba(99,102,241,0.15)' : '',
              color: event.status === s ? 'var(--accent-secondary)' : 'var(--text-muted)',
              border: event.status === s ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
            }} onClick={() => dispatch({ type: 'UPDATE_EVENT', payload: { id: event.id, data: { status: s } } })}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EventsView() {
  const { state } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<EventStatus | 'All'>('All');

  const filtered = filter === 'All' ? state.events : state.events.filter(e => e.status === filter);
  const sorted = [...filtered].sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Event & Hackathon Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 2 }}>{state.events.length} events tracked</p>
        </div>
        <button className="btn-primary" id="add-event-btn" onClick={() => setShowAdd(true)}><Plus size={15} /> Add Event</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {(['All', ...EVENT_STATUSES] as const).map(s => (
          <button key={s} className="btn-ghost" style={{
            fontSize: 12, padding: '4px 12px',
            background: filter === s ? 'rgba(99,102,241,0.15)' : '',
            color: filter === s ? 'var(--accent-secondary)' : 'var(--text-muted)',
            border: filter === s ? '1px solid rgba(99,102,241,0.3)' : '1px solid var(--border-subtle)',
            borderRadius: 99,
          }} onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.map(ev => <EventCard key={ev.id} event={ev} />)}
      </div>

      {sorted.length === 0 && (
        <div className="card empty-state">
          <Calendar size={32} color="var(--border-active)" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 15, color: 'var(--text-dim)', marginBottom: 8 }}>No events yet</div>
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add your first event</button>
        </div>
      )}

      {showAdd && <AddEventModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
