'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import {
  Plus, Trash2, ExternalLink, ChevronDown, ChevronRight,
  Camera, Brain, BookOpen, GraduationCap, Zap, Target,
  FileText, PlayCircle, Globe, Link2, Edit3, Check, X
} from 'lucide-react';
import { Topic, Module, Project, Resource, StatusTag, genId } from '@/lib/store';

const ICON_OPTIONS = ['Camera', 'Brain', 'BookOpen', 'GraduationCap', 'Zap', 'Target'];
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Camera, Brain, BookOpen, GraduationCap, Zap, Target,
};
const STATUS_OPTIONS: StatusTag[] = ['Planned', 'In-Progress', 'Completed'];
const RESOURCE_TYPES = ['paper', 'docs', 'youtube', 'article', 'other'] as const;

function StatusBadge({ status }: { status: StatusTag }) {
  const cls = status === 'Planned' ? 'status-planned' : status === 'In-Progress' ? 'status-in-progress' : 'status-completed';
  return <span className={`tag ${cls}`}>{status}</span>;
}

function ResourceIcon({ type }: { type: string }) {
  if (type === 'paper') return <FileText size={13} />;
  if (type === 'youtube') return <PlayCircle size={13} />;
  if (type === 'docs') return <Globe size={13} />;
  return <Link2 size={13} />;
}

// ─── Add Topic Modal ──────────────────────────────────────────────────────────
function AddTopicModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('Camera');

  const submit = () => {
    if (!title.trim()) return;
    dispatch({ type: 'ADD_TOPIC', payload: { title: title.trim(), description: desc.trim(), icon } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Add Topic</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Icon</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ICON_OPTIONS.map(ic => {
                const Ic = ICON_MAP[ic];
                return (
                  <button key={ic} onClick={() => setIcon(ic)} style={{
                    width: 38, height: 38, borderRadius: 8, border: `2px solid ${icon === ic ? 'var(--accent-primary)' : 'var(--border-active)'}`,
                    background: icon === ic ? 'rgba(99,102,241,0.15)' : 'var(--bg-root)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Ic size={16} color={icon === ic ? 'var(--accent-secondary)' : 'var(--text-muted)'} />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Title *</label>
            <input className="input-base" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Computer Vision" onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Description</label>
            <textarea className="input-base" value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="Brief description..." />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}><Plus size={14} /> Add Topic</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Module Modal ─────────────────────────────────────────────────────────
function AddModuleModal({ topicId, onClose }: { topicId: string; onClose: () => void }) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState<StatusTag>('Planned');

  const submit = () => {
    if (!title.trim()) return;
    dispatch({ type: 'ADD_MODULE', payload: { topicId, data: { title: title.trim(), description: desc.trim(), status } } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Add Module</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Title *</label>
            <input className="input-base" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Anomaly Detection" onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Description</label>
            <textarea className="input-base" value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="Brief description..." />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Status</label>
            <select className="input-base" value={status} onChange={e => setStatus(e.target.value as StatusTag)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}><Plus size={14} /> Add Module</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Project Modal ────────────────────────────────────────────────────────
function AddProjectModal({ topicId, moduleId, onClose }: { topicId: string; moduleId: string; onClose: () => void }) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState<StatusTag>('Planned');
  const [tags, setTags] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [demoLink, setDemoLink] = useState('');
  const [pptLink, setPptLink] = useState('');

  const submit = () => {
    if (!title.trim()) return;
    dispatch({
      type: 'ADD_PROJECT',
      payload: {
        topicId, moduleId,
        data: { title: title.trim(), description: desc.trim(), status, tags: tags.split(',').map(t => t.trim()).filter(Boolean), githubRepo, demoLink, pptLink }
      }
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Add Project</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Title *</label>
            <input className="input-base" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. PatchCore PCB Defect Detection" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Description</label>
            <textarea className="input-base" value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="What are you building?" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Status</label>
            <select className="input-base" value={status} onChange={e => setStatus(e.target.value as StatusTag)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Tags (comma-separated)</label>
            <input className="input-base" value={tags} onChange={e => setTags(e.target.value)} placeholder="PyTorch, PatchCore, WideResNet50" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>GitHub Repo</label>
              <input className="input-base" value={githubRepo} onChange={e => setGithubRepo(e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Demo / Deployed Link</label>
              <input className="input-base" value={demoLink} onChange={e => setDemoLink(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>PPT / Pitch Deck</label>
            <input className="input-base" value={pptLink} onChange={e => setPptLink(e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}><Plus size={14} /> Add Project</button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Resource Modal ───────────────────────────────────────────────────────
function AddResourceModal({ topicId, onClose }: { topicId: string; onClose: () => void }) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<Resource['type']>('paper');

  const submit = () => {
    if (!title.trim() || !url.trim()) return;
    dispatch({ type: 'ADD_RESOURCE', payload: { topicId, data: { title: title.trim(), url: url.trim(), type } } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Add Resource</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Title *</label>
            <input className="input-base" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. PatchCore Paper (CVPR 2022)" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>URL *</label>
            <input className="input-base" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Type</label>
            <select className="input-base" value={type} onChange={e => setType(e.target.value as Resource['type'])}>
              {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}><Plus size={14} /> Add Resource</button>
        </div>
      </div>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, topicId, moduleId }: { project: Project; topicId: string; moduleId: string }) {
  const { dispatch } = useApp();
  const [editing, setEditing] = useState(false);
  const [editProject, setEditProject] = useState(false);
  const [status, setStatus] = useState<StatusTag>(project.status);

  const updateStatus = (s: StatusTag) => {
    setStatus(s);
    dispatch({ type: 'UPDATE_PROJECT', payload: { topicId, moduleId, projectId: project.id, data: { status: s } } });
    setEditing(false);
  };

  return (
    <div style={{
      background: 'var(--bg-root)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '12px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{project.title}</div>
        {project.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{project.description}</div>}
        {project.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {project.tags.map(tag => (
              <span key={tag} style={{ padding: '2px 6px', borderRadius: 4, background: 'var(--bg-hover)', border: '1px solid var(--border-active)', fontSize: 10, color: 'var(--text-muted)' }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
        {editing ? (
          <select className="input-base" value={status} onChange={e => updateStatus(e.target.value as StatusTag)} style={{ padding: '4px 8px', fontSize: 12 }}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        ) : (
          <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <StatusBadge status={project.status} />
          </button>
        )}
        <button className="btn-ghost" style={{ padding: '4px 6px' }} onClick={() => setEditProject(true)}>
          <Edit3 size={13} color="var(--text-muted)" />
        </button>
        <button className="btn-ghost" style={{ padding: '4px 6px' }}
          onClick={() => dispatch({ type: 'DELETE_PROJECT', payload: { topicId, moduleId, projectId: project.id } })}>
          <Trash2 size={13} style={{ color: '#ef4444' }} />
        </button>
      </div>
      {editProject && <EditProjectModal topicId={topicId} moduleId={moduleId} project={project} onClose={() => setEditProject(false)} />}
    </div>
  );
}

// ─── Module Row ───────────────────────────────────────────────────────────────
function ModuleRow({ mod, topicId }: { mod: Module; topicId: string }) {
  const { dispatch } = useApp();
  const [open, setOpen] = useState(true);
  const [addProject, setAddProject] = useState(false);
  const [editModule, setEditModule] = useState(false);
  const [editStatus, setEditStatus] = useState(false);

  return (
    <div style={{ marginLeft: 16, borderLeft: '2px solid var(--border-subtle)', paddingLeft: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: open ? 8 : 0, paddingBottom: 6 }}>
        <button className="btn-ghost" style={{ padding: '2px 4px' }} onClick={() => setOpen(o => !o)}>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', flex: 1 }}>{mod.title}</span>
        {editStatus ? (
          <select className="input-base" value={mod.status} style={{ padding: '3px 6px', fontSize: 12, width: 'auto' }}
            onChange={e => { dispatch({ type: 'UPDATE_MODULE', payload: { topicId, moduleId: mod.id, data: { status: e.target.value as StatusTag } } }); setEditStatus(false); }}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        ) : (
          <button onClick={() => setEditStatus(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <StatusBadge status={mod.status} />
          </button>
        )}
        <button className="btn-ghost" style={{ padding: '3px 6px', fontSize: 12, color: 'var(--accent-primary)' }} onClick={() => setAddProject(true)}>
          <Plus size={13} /> Project
        </button>
        <button className="btn-ghost" style={{ padding: '3px 6px' }} onClick={() => setEditModule(true)}>
          <Edit3 size={13} color="var(--text-muted)" />
        </button>
        <button className="btn-ghost" style={{ padding: '3px 6px' }}
          onClick={() => dispatch({ type: 'DELETE_MODULE', payload: { topicId, moduleId: mod.id } })}>
          <Trash2 size={13} style={{ color: '#ef4444' }} />
        </button>
      </div>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {mod.description && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{mod.description}</p>}
          {mod.projects.map(p => <ProjectCard key={p.id} project={p} topicId={topicId} moduleId={mod.id} />)}
          {mod.projects.length === 0 && <div style={{ fontSize: 12, color: 'var(--border-active)', paddingLeft: 4 }}>No projects yet.</div>}
        </div>
      )}
      {addProject && <AddProjectModal topicId={topicId} moduleId={mod.id} onClose={() => setAddProject(false)} />}
      {editModule && <EditModuleModal topicId={topicId} mod={mod} onClose={() => setEditModule(false)} />}
    </div>
  );
}

// ─── Topic Card ───────────────────────────────────────────────────────────────
function TopicCard({ topic }: { topic: Topic }) {
  const { dispatch } = useApp();
  const [open, setOpen] = useState(true);
  const [addModule, setAddModule] = useState(false);
  const [addResource, setAddResource] = useState(false);
  const [editTopic, setEditTopic] = useState(false);
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [activeTab, setActiveTab] = useState<'modules' | 'resources'>('modules');
  const Icon = ICON_MAP[topic.icon] || BookOpen;

  return (
    <div className="card" style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
          border: '1px solid rgba(99,102,241,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={18} color="var(--accent-secondary)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{topic.title}</div>
          {topic.description && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{topic.description}</div>}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button className="btn-ghost" style={{ padding: '4px 6px' }} onClick={() => setOpen(o => !o)}>
            {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
          <button className="btn-ghost" style={{ padding: '4px 6px' }} onClick={() => setEditTopic(true)}>
            <Edit3 size={14} color="var(--text-muted)" />
          </button>
          <button className="btn-ghost" style={{ padding: '4px 6px' }}
            onClick={() => dispatch({ type: 'DELETE_TOPIC', payload: topic.id })}>
            <Trash2 size={14} style={{ color: '#ef4444' }} />
          </button>
        </div>
      </div>

      {open && (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
            {(['modules', 'resources'] as const).map(tab => (
              <button key={tab} className="btn-ghost" style={{
                fontSize: 13, padding: '4px 12px', borderRadius: 6,
                color: activeTab === tab ? 'var(--accent-secondary)' : 'var(--text-muted)',
                background: activeTab === tab ? 'rgba(99,102,241,0.1)' : 'transparent',
              }} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>
                  ({tab === 'modules' ? topic.modules.length : topic.resources.length})
                </span>
              </button>
            ))}
          </div>

          {activeTab === 'modules' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {topic.modules.map(m => <ModuleRow key={m.id} mod={m} topicId={topic.id} />)}
              </div>
              <button className="btn-secondary" style={{ marginTop: 12, width: '100%', justifyContent: 'center', fontSize: 13 }} onClick={() => setAddModule(true)}>
                <Plus size={14} /> Add Module
              </button>
            </>
          )}

          {activeTab === 'resources' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {topic.resources.map(r => (
                  <div key={r.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', background: 'var(--bg-root)', borderRadius: 8, border: '1px solid var(--border-subtle)',
                  }}>
                    <ResourceIcon type={r.type} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--accent-secondary)', textDecoration: 'none', fontWeight: 500 }}>
                        {r.title}
                      </a>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{r.type}</div>
                    </div>
                    <a href={r.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} color="var(--text-dim)" /></a>
                    <button className="btn-ghost" style={{ padding: '3px 5px' }} onClick={() => setEditResource(r)}>
                      <Edit3 size={13} color="var(--text-muted)" />
                    </button>
                    <button className="btn-ghost" style={{ padding: '3px 5px' }}
                      onClick={() => dispatch({ type: 'DELETE_RESOURCE', payload: { topicId: topic.id, resourceId: r.id } })}>
                      <Trash2 size={13} style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                ))}
                {topic.resources.length === 0 && <div className="empty-state" style={{ padding: '16px 0' }}>No resources yet.</div>}
              </div>
              <button className="btn-secondary" style={{ marginTop: 12, width: '100%', justifyContent: 'center', fontSize: 13 }} onClick={() => setAddResource(true)}>
                <Plus size={14} /> Add Resource
              </button>
            </>
          )}
        </>
      )}

      {addModule && <AddModuleModal topicId={topic.id} onClose={() => setAddModule(false)} />}
      {addResource && <AddResourceModal topicId={topic.id} onClose={() => setAddResource(false)} />}
      {editTopic && <EditTopicModal topic={topic} onClose={() => setEditTopic(false)} />}
      {editResource && <EditResourceModal topicId={topic.id} resource={editResource} onClose={() => setEditResource(null)} />}
    </div>
  );
}

// ─── Edit Modals ─────────────────────────────────────────────────────────────
function EditTopicModal({ topic, onClose }: { topic: Topic; onClose: () => void }) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState(topic.title);
  const [desc, setDesc] = useState(topic.description || '');
  const [icon, setIcon] = useState(topic.icon);

  const submit = () => {
    if (!title.trim()) return;
    dispatch({ type: 'UPDATE_TOPIC', payload: { id: topic.id, data: { title: title.trim(), description: desc.trim(), icon } } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Edit Topic</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Icon</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ICON_OPTIONS.map(ic => {
                const Ic = ICON_MAP[ic];
                return (
                  <button key={ic} onClick={() => setIcon(ic)} style={{
                    width: 38, height: 38, borderRadius: 8, border: `2px solid ${icon === ic ? 'var(--accent-primary)' : 'var(--border-active)'}`,
                    background: icon === ic ? 'rgba(99,102,241,0.15)' : 'var(--bg-root)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Ic size={16} color={icon === ic ? 'var(--accent-secondary)' : 'var(--text-muted)'} />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Title *</label>
            <input className="input-base" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Computer Vision" onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Description</label>
            <textarea className="input-base" value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="Brief description..." />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}><Edit3 size={14} /> Save</button>
        </div>
      </div>
    </div>
  );
}

function EditModuleModal({ topicId, mod, onClose }: { topicId: string; mod: Module; onClose: () => void }) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState(mod.title);
  const [desc, setDesc] = useState(mod.description || '');
  const [status, setStatus] = useState<StatusTag>(mod.status);

  const submit = () => {
    if (!title.trim()) return;
    dispatch({ type: 'UPDATE_MODULE', payload: { topicId, moduleId: mod.id, data: { title: title.trim(), description: desc.trim(), status } } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Edit Module</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Title *</label>
            <input className="input-base" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Anomaly Detection" onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Description</label>
            <textarea className="input-base" value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="Brief description..." />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Status</label>
            <select className="input-base" value={status} onChange={e => setStatus(e.target.value as StatusTag)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}><Edit3 size={14} /> Save</button>
        </div>
      </div>
    </div>
  );
}

function EditProjectModal({ topicId, moduleId, project, onClose }: { topicId: string; moduleId: string; project: Project; onClose: () => void }) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState(project.title);
  const [desc, setDesc] = useState(project.description || '');
  const [status, setStatus] = useState<StatusTag>(project.status);
  const [tags, setTags] = useState(project.tags ? project.tags.join(', ') : '');
  const [githubRepo, setGithubRepo] = useState(project.githubRepo || '');
  const [demoLink, setDemoLink] = useState(project.demoLink || '');
  const [pptLink, setPptLink] = useState(project.pptLink || '');

  const submit = () => {
    if (!title.trim()) return;
    dispatch({
      type: 'UPDATE_PROJECT',
      payload: {
        topicId, moduleId, projectId: project.id,
        data: { title: title.trim(), description: desc.trim(), status, tags: tags.split(',').map(t => t.trim()).filter(Boolean), githubRepo, demoLink, pptLink }
      }
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Edit Project</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Title *</label>
            <input className="input-base" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. PatchCore PCB Defect Detection" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Description</label>
            <textarea className="input-base" value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="What are you building?" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Status</label>
            <select className="input-base" value={status} onChange={e => setStatus(e.target.value as StatusTag)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Tags (comma-separated)</label>
            <input className="input-base" value={tags} onChange={e => setTags(e.target.value)} placeholder="PyTorch, PatchCore, WideResNet50" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>GitHub Repo</label>
              <input className="input-base" value={githubRepo} onChange={e => setGithubRepo(e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Demo / Deployed Link</label>
              <input className="input-base" value={demoLink} onChange={e => setDemoLink(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>PPT / Pitch Deck</label>
            <input className="input-base" value={pptLink} onChange={e => setPptLink(e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}><Edit3 size={14} /> Save</button>
        </div>
      </div>
    </div>
  );
}

function EditResourceModal({ topicId, resource, onClose }: { topicId: string; resource: Resource; onClose: () => void }) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState(resource.title);
  const [url, setUrl] = useState(resource.url);
  const [type, setType] = useState<Resource['type']>(resource.type);

  const submit = () => {
    if (!title.trim() || !url.trim()) return;
    dispatch({ type: 'UPDATE_RESOURCE', payload: { topicId, resourceId: resource.id, data: { title: title.trim(), url: url.trim(), type } } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Edit Resource</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Title *</label>
            <input className="input-base" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. PatchCore Paper (CVPR 2022)" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>URL *</label>
            <input className="input-base" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Type</label>
            <select className="input-base" value={type} onChange={e => setType(e.target.value as Resource['type'])}>
              {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}><Edit3 size={14} /> Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Learning View ────────────────────────────────────────────────────────────
export default function LearningView() {
  const { state } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Learning Tracker</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 2 }}>{state.topics.length} topics · {state.topics.reduce((a, t) => a + t.modules.length, 0)} modules</p>
        </div>
        <button className="btn-primary" id="add-topic-btn" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> New Topic
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {state.topics.map(topic => <TopicCard key={topic.id} topic={topic} />)}
      </div>

      {state.topics.length === 0 && (
        <div className="card empty-state" style={{ padding: 48 }}>
          <BookOpen size={32} color="var(--border-active)" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 15, color: 'var(--text-dim)', marginBottom: 8 }}>No topics yet</div>
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add your first topic</button>
        </div>
      )}

      {showAdd && <AddTopicModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
