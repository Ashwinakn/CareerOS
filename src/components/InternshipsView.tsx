'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { Plus, Trash2, ExternalLink, Building2, X } from 'lucide-react';
import { InternshipApp, AppStatus } from '@/lib/store';

const STATUSES: AppStatus[] = ['Applied', 'Interviewing', 'Offer', 'Ghosted', 'Rejected'];

const STATUS_COLOR: Record<AppStatus, { dot: string; bg: string; text: string }> = {
  Applied:      { dot: '#38bdf8', bg: 'rgba(14,165,233,0.1)',   text: '#38bdf8' },
  Interviewing: { dot: '#a78bfa', bg: 'rgba(139,92,246,0.1)',   text: '#a78bfa' },
  Offer:        { dot: '#34d399', bg: 'rgba(16,185,129,0.1)',   text: '#34d399' },
  Ghosted:      { dot: '#52525b', bg: 'rgba(63,63,70,0.15)',    text: '#71717a' },
  Rejected:     { dot: '#fb7185', bg: 'rgba(244,63,94,0.1)',    text: '#fb7185' },
  Withdrawn:    { dot: '#52525b', bg: 'rgba(63,63,70,0.15)',    text: '#71717a' },
};

function StatusBadge({ status }: { status: AppStatus }) {
  const c = STATUS_COLOR[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: c.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function AddModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useApp();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<AppStatus>('Applied');
  const [jobUrl, setJobUrl] = useState('');
  const [notes, setNotes] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;
    dispatch({
      type: 'ADD_INTERNSHIP',
      payload: { company, role, dateApplied: date, status, jobUrl, notes, resumeLink: '', coverLetterLink: '', linkedProjectIds: [] },
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>Add Application</h3>
          <button className="btn-ghost" style={{ padding: 4 }} onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Company *</label>
              <input className="input-base" required value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google" />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Role</label>
              <input className="input-base" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. ML Intern" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Date Applied</label>
              <input className="input-base" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Status</label>
              <select className="input-base" value={status} onChange={e => setStatus(e.target.value as AppStatus)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Job URL</label>
            <input className="input-base" value={jobUrl} onChange={e => setJobUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Notes</label>
            <textarea className="input-base" value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Referral, key points, etc." style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}><Plus size={14} /> Add Application</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InternshipsView() {
  const { state, dispatch } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = state.internships.filter(i => i.status === s).length;
    return acc;
  }, {} as Record<AppStatus, number>);

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em' }}>Internship CRM</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 2 }}>{state.internships.length} applications tracked</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={15} /> Add Application</button>
      </div>

      {/* Status Summary Row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        {STATUSES.map(s => {
          const c = STATUS_COLOR[s];
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: c.bg, border: `1px solid ${c.dot}25`, borderRadius: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: c.dot }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{counts[s]}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s}</span>
            </div>
          );
        })}
      </div>

      {/* Application List */}
      {state.internships.length === 0 ? (
        <div className="empty-state" style={{ padding: 64 }}>
          <Building2 size={40} color="var(--border-active)" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: 16, color: 'var(--text-dim)', marginBottom: 12 }}>No applications yet</div>
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add your first application</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {state.internships.map(app => (
            <div key={app.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Color accent */}
              <div style={{ width: 4, height: 40, borderRadius: 99, background: STATUS_COLOR[app.status].dot, flexShrink: 0 }} />

              {/* Main info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>{app.company}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 1 }}>{app.role}</div>
              </div>

              {/* Date */}
              <div style={{ fontSize: 12, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                {app.dateApplied ? new Date(app.dateApplied + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
              </div>

              {/* Status dropdown */}
              <select
                value={app.status}
                onChange={e => dispatch({ type: 'UPDATE_INTERNSHIP', payload: { id: app.id, data: { status: e.target.value as AppStatus } } })}
                style={{ background: STATUS_COLOR[app.status].bg, color: STATUS_COLOR[app.status].text, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {/* Job link */}
              {app.jobUrl ? (
                <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" title="Open job posting">
                  <ExternalLink size={15} color="var(--text-dim)" />
                </a>
              ) : (
                <span style={{ width: 15 }} />
              )}

              {/* Delete */}
              <button className="btn-ghost" style={{ padding: '4px 6px' }} onClick={() => dispatch({ type: 'DELETE_INTERNSHIP', payload: app.id })} title="Delete">
                <Trash2 size={14} style={{ color: '#fb7185' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
