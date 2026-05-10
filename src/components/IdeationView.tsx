'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import {
  Plus, Trash2, X, Lightbulb, ExternalLink, Link2,
  FileText, PlayCircle, Globe, BookOpen, Tag, ChevronDown, ChevronRight, Pencil
} from 'lucide-react';
import { IdeaProject, IdeaStatus, IdeaResource } from '@/lib/store';

const STATUSES: IdeaStatus[] = ['Idea', 'Prototyping', 'Building', 'Completed', 'Paused'];
const STATUS_STYLE: Record<IdeaStatus, { bg: string; color: string }> = {
  Idea:        { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8' },
  Prototyping: { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24' },
  Building:    { bg: 'rgba(16,185,129,0.12)',  color: '#34d399' },
  Completed:   { bg: 'rgba(52,211,153,0.12)',  color: '#34d399' },
  Paused:      { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8' },
};

const RES_TYPES = ['paper', 'docs', 'youtube', 'article', 'other'] as const;

function ResIcon({ type }: { type: string }) {
  if (type === 'paper') return <FileText size={13} />;
  if (type === 'youtube') return <PlayCircle size={13} />;
  if (type === 'docs') return <Globe size={13} />;
  return <Link2 size={13} />;
}

function AddIdeaModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IdeaStatus>('Idea');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [githubRepo, setGithubRepo] = useState('');
  const [demoLink, setDemoLink] = useState('');
  const [pptLink, setPptLink] = useState('');

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags(prev => [...prev, t]); setTagInput(''); }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch({ type: 'ADD_IDEA', payload: { title: title.trim(), description, status, tags, githubRepo, demoLink, pptLink } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lightbulb size={18} color="var(--accent-primary)" /> New Project Idea
          </h3>
          <button className="btn-ghost" style={{ padding: 4 }} onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Title *</label>
            <input className="input-base" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Real-time Crack Detection System" />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea className="input-base" value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="What's the idea? What problem does it solve?" style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Status</label>
              <select className="input-base" value={status} onChange={e => setStatus(e.target.value as IdeaStatus)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Tags</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input className="input-base" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} placeholder="e.g. PyTorch, ONNX" style={{ flex: 1 }} />
              <button type="button" className="btn-secondary" onClick={addTag} style={{ flexShrink: 0 }}>Add</button>
            </div>
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {tags.map(t => (
                  <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 99, background: 'var(--accent-transparent)', color: 'var(--accent-secondary)', fontSize: 12 }}>
                    {t} <button type="button" onClick={() => setTags(prev => prev.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>GitHub Repo</label>
              <input className="input-base" value={githubRepo} onChange={e => setGithubRepo(e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Demo / Deployed</label>
              <input className="input-base" value={demoLink} onChange={e => setDemoLink(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>PPT / Pitch Deck</label>
            <input className="input-base" value={pptLink} onChange={e => setPptLink(e.target.value)} placeholder="https://..." />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}><Plus size={14} /> Add Idea</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddResourceModal({ ideaId, onClose }: { ideaId: string; onClose: () => void }) {
  const { dispatch } = useApp();
  const [resTitle, setResTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'paper' | 'docs' | 'youtube' | 'article' | 'other'>('article');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !url.trim()) return;
    dispatch({ type: 'ADD_IDEA_RESOURCE', payload: { ideaId, data: { title: resTitle.trim(), url, type } } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Add Resource</h3>
          <button className="btn-ghost" style={{ padding: 4 }} onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input className="input-base" required placeholder="Resource title" value={resTitle} onChange={e => setResTitle(e.target.value)} />
          <input className="input-base" required placeholder="URL" type="url" value={url} onChange={e => setUrl(e.target.value)} />
          <select className="input-base" value={type} onChange={e => setType(e.target.value as any)}>
            {RES_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}><Plus size={13} /> Add Resource</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function IdeaCard({ idea }: { idea: IdeaProject }) {
  const { state, dispatch } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [showAddRes, setShowAddRes] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editRes, setEditRes] = useState<IdeaResource | null>(null);
  const style = STATUS_STYLE[idea.status];

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Card header */}
      <div style={{ padding: '14px 16px', borderBottom: expanded ? '1px solid var(--border-subtle)' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{idea.title}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: style.bg, color: style.color }}>{idea.status}</span>
            </div>
            {idea.description && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>{idea.description}</p>}
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {idea.tags.map(tag => (
                <span key={tag} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'var(--bg-hover)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Tag size={9} />{tag}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <button className="btn-ghost" style={{ padding: '4px 6px' }} onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
            <button className="btn-ghost" style={{ padding: '4px 6px' }} onClick={() => setShowEdit(true)}>
              <Pencil size={13} color="var(--text-muted)" />
            </button>
            <button className="btn-ghost" style={{ padding: '4px 6px' }} onClick={() => dispatch({ type: 'DELETE_IDEA', payload: idea.id })}>
              <Trash2 size={13} style={{ color: '#fb7185' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Inline Status changer */}
      {expanded && (
        <div style={{ padding: '12px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)' }} onClick={e => e.stopPropagation()}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', alignSelf: 'center', marginRight: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</span>
          {STATUSES.map(s => (
            <button key={s} className="btn-ghost" style={{
              fontSize: 11, padding: '3px 10px',
              background: idea.status === s ? 'rgba(99,102,241,0.15)' : '',
              color: idea.status === s ? 'var(--accent-secondary)' : 'var(--text-muted)',
              border: idea.status === s ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
            }} onClick={() => dispatch({ type: 'UPDATE_IDEA', payload: { id: idea.id, data: { status: s } } })}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Resources (expanded) */}
      {expanded && (
        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Resources ({idea.resources.length})</span>
            <button className="btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => setShowAddRes(true)}>
              <Plus size={12} /> Add
            </button>
          </div>
          {idea.resources.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', padding: '8px 0' }}>No resources yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {idea.resources.map(res => (
                <div key={res.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-root)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}><ResIcon type={res.type} /></span>
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--text-secondary)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{res.title}</span>
                  <a href={res.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} color="var(--accent-primary)" /></a>
                  <button className="btn-ghost" style={{ padding: '2px 4px' }} onClick={() => setEditRes(res)}>
                    <Pencil size={12} color="var(--text-muted)" />
                  </button>
                  <button className="btn-ghost" style={{ padding: '2px 4px' }} onClick={() => dispatch({ type: 'DELETE_IDEA_RESOURCE', payload: { ideaId: idea.id, resourceId: res.id } })}>
                    <Trash2 size={12} style={{ color: '#fb7185' }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showAddRes && <AddResourceModal ideaId={idea.id} onClose={() => setShowAddRes(false)} />}
      {showEdit && <EditIdeaModal idea={idea} onClose={() => setShowEdit(false)} />}
      {editRes && <EditIdeaResourceModal ideaId={idea.id} resource={editRes} onClose={() => setEditRes(null)} />}
    </div>
  );
}

function EditIdeaModal({ idea, onClose }: { idea: IdeaProject; onClose: () => void }) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState(idea.description || '');
  const [status, setStatus] = useState<IdeaStatus>(idea.status);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(idea.tags || []);
  const [githubRepo, setGithubRepo] = useState(idea.githubRepo || '');
  const [demoLink, setDemoLink] = useState(idea.demoLink || '');
  const [pptLink, setPptLink] = useState(idea.pptLink || '');

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags(prev => [...prev, t]); setTagInput(''); }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch({ type: 'UPDATE_IDEA', payload: { id: idea.id, data: { title: title.trim(), description, status, tags, githubRepo, demoLink, pptLink } } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pencil size={18} color="var(--accent-primary)" /> Edit Project Idea
          </h3>
          <button className="btn-ghost" style={{ padding: 4 }} onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Title *</label>
            <input className="input-base" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Real-time Crack Detection System" />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea className="input-base" value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="What's the idea? What problem does it solve?" style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Status</label>
              <select className="input-base" value={status} onChange={e => setStatus(e.target.value as IdeaStatus)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Tags</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input className="input-base" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} placeholder="e.g. PyTorch, ONNX" style={{ flex: 1 }} />
              <button type="button" className="btn-secondary" onClick={addTag} style={{ flexShrink: 0 }}>Add</button>
            </div>
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {tags.map(t => (
                  <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 99, background: 'var(--accent-transparent)', color: 'var(--accent-secondary)', fontSize: 12 }}>
                    {t} <button type="button" onClick={() => setTags(prev => prev.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>GitHub Repo</label>
              <input className="input-base" value={githubRepo} onChange={e => setGithubRepo(e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Demo / Deployed</label>
              <input className="input-base" value={demoLink} onChange={e => setDemoLink(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>PPT / Pitch Deck</label>
            <input className="input-base" value={pptLink} onChange={e => setPptLink(e.target.value)} placeholder="https://..." />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}><Pencil size={14} /> Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditIdeaResourceModal({ ideaId, resource, onClose }: { ideaId: string; resource: IdeaResource; onClose: () => void }) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState(resource.title);
  const [url, setUrl] = useState(resource.url);
  const [type, setType] = useState<IdeaResource['type']>(resource.type);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    dispatch({ type: 'UPDATE_IDEA_RESOURCE', payload: { ideaId, resourceId: resource.id, data: { title: title.trim(), url: url.trim(), type } } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pencil size={18} color="var(--accent-primary)" /> Edit Resource
          </h3>
          <button className="btn-ghost" style={{ padding: 4 }} onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Title *</label>
            <input className="input-base" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. System Design Spec" />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>URL *</label>
            <input className="input-base" required type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Type</label>
            <select className="input-base" value={type} onChange={e => setType(e.target.value as any)}>
              {RES_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}><Pencil size={14} /> Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function IdeationView() {
  const { state } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  const ideas = (state.ideas || []);

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Lightbulb size={22} color="var(--accent-primary)" /> Ideation Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            {ideas.length} ideas · Capture, link, and build on your project concepts
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={15} /> New Idea</button>
      </div>

      {/* Ideas */}
      {ideas.length === 0 ? (
        <div className="empty-state card" style={{ padding: 64 }}>
          <Lightbulb size={40} color="var(--border-active)" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: 16, color: 'var(--text-dim)', marginBottom: 12 }}>No ideas yet</div>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 20 }}>Capture your project ideas before they vanish!</p>
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Capture First Idea</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ideas.map(idea => <IdeaCard key={idea.id} idea={idea} />)}
        </div>
      )}

      {showAdd && <AddIdeaModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
