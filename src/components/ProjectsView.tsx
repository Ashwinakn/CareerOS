'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { Camera, Folder, Lightbulb, Tag, Search, ChevronRight, ChevronDown, PlayCircle, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { Project, IdeaProject } from '@/lib/store';

type ProjectItem = {
  type: 'learning';
  id: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
  topicTitle: string;
  source: Project;
} | {
  type: 'idea';
  id: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
  source: IdeaProject;
} | {
  type: 'hackathon';
  id: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
  topicTitle: string;
  source: any; // HackathonEvent
};

const STATUS_COLORS: Record<string, string> = {
  'Planned': '#94a3b8',
  'In-Progress': '#38bdf8',
  'Completed': '#34d399',
  'Idea': '#818cf8',
  'Prototyping': '#fbbf24',
  'Building': '#10b981',
  'Paused': '#64748b',
};

function ProjectCard({ project }: { project: ProjectItem }) {
  const [expanded, setExpanded] = useState(false);
  const isLearning = project.type === 'learning';
  const color = STATUS_COLORS[project.status] || '#94a3b8';
  
  return (
    <div className="card glass-hover" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isLearning ? <Folder size={16} color="var(--accent-primary)" /> : project.type === 'hackathon' ? <Camera size={16} color="#22d3ee" /> : <Lightbulb size={16} color="#fbbf24" />}
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{project.title}</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: isLearning ? 'var(--accent-secondary)' : project.type === 'hackathon' ? '#22d3ee' : '#fbbf24', display: 'flex', alignItems: 'center', gap: 4, opacity: 0.9 }}>
            {isLearning ? 'Learning Tracker' : project.type === 'hackathon' ? 'Hackathon' : 'Ideation Hub'} {(isLearning || project.type === 'hackathon') && project.topicTitle && `• ${project.topicTitle}`}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: `${color}15`, color: color, border: `1px solid ${color}30` }}>
            {project.status}
          </span>
          <button className="btn-ghost" style={{ padding: '4px' }}>
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
          {project.description && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{project.description}</p>
          )}
      
      {/* Links */}
      {((project.source as any).githubRepo || (project.source as any).demoLink || (project.source as any).pptLink) && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          {(project.source as any).githubRepo && <a href={(project.source as any).githubRepo} target="_blank" className="btn-secondary" style={{ fontSize: 11, padding: '2px 8px' }}>GitHub</a>}
          {(project.source as any).demoLink && <a href={(project.source as any).demoLink} target="_blank" className="btn-secondary" style={{ fontSize: 11, padding: '2px 8px' }}>Demo / Deployed</a>}
          {(project.source as any).pptLink && <a href={(project.source as any).pptLink} target="_blank" className="btn-secondary" style={{ fontSize: 11, padding: '2px 8px' }}>PPT</a>}
        </div>
      )}

      {/* Warning if Completed but missing demo */}
      {(project.status === 'Completed' || project.status === 'Building') && !(project.source as any).demoLink && (
        <div style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 6, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          ⚠️ Action Needed: Add a demo or deployed link to complete this project.
        </div>
      )}

          {project.tags && project.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {project.tags.map(t => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 6, background: 'var(--bg-hover)', color: 'var(--text-muted)', fontSize: 11 }}>
                  <Tag size={10} /> {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProjectsView() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'learning' | 'idea'>('all');

  // Gather all projects
  const learningProjects: ProjectItem[] = state.topics.flatMap(t => 
    t.modules.flatMap(m => 
      m.projects.map(p => ({
        type: 'learning',
        id: p.id,
        title: p.title,
        description: p.description,
        status: p.status,
        tags: p.tags,
        topicTitle: t.title,
        source: p
      }))
    )
  );

  const ideaProjects: ProjectItem[] = (state.ideas || []).map(i => ({
    type: 'idea',
    id: i.id,
    title: i.title,
    description: i.description,
    status: i.status,
    tags: i.tags,
    topicTitle: '',
    source: i
  }));

  const hackathonProjects: ProjectItem[] = state.events
    .filter(e => e.projectTitle)
    .map(e => ({
      type: 'hackathon',
      id: `hack-proj-${e.id}`,
      title: e.projectTitle!,
      description: e.projectDescription || '',
      status: e.status === 'Completed' ? 'Completed' : 'Building',
      tags: ['Hackathon'],
      topicTitle: e.name,
      source: e
    }));

  let allProjects = [...learningProjects, ...ideaProjects, ...hackathonProjects];

  // Apply filters
  if (filterType !== 'all') {
    allProjects = allProjects.filter(p => p.type === filterType);
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    allProjects = allProjects.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Group by status for summary
  const completed = allProjects.filter(p => p.status === 'Completed' || p.status === 'Building').length;
  const inProgress = allProjects.filter(p => p.status === 'In-Progress' || p.status === 'Prototyping').length;

  return (
    <div className="animate-fade-in" style={{ padding: '32px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Camera size={22} color="var(--accent-primary)" /> All Projects
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            {allProjects.length} projects across Learning Tracker and Ideation Hub
          </p>
        </div>
      </div>

      {/* Summary Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div className="card" style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{completed}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed / Built</div>
          </div>
        </div>
        <div className="card" style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlayCircle size={18} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{inProgress}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Progress / Proto</div>
          </div>
        </div>
        <div className="card" style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Folder size={18} color="#a855f7" />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{allProjects.length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Projects</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-root)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '0 12px', flex: 1, minWidth: 200 }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            className="input-base"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', flex: 1, padding: '10px 8px' }}
          />
        </div>
        
        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
          {(['all', 'learning', 'idea', 'hackathon'] as const).map(m => (
            <button key={m} onClick={() => setFilterType(m as any)} style={{
              padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit', textTransform: 'capitalize',
              background: filterType === m ? 'var(--accent-primary)' : 'transparent',
              color: filterType === m ? 'white' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
            }}>
              {m === 'idea' ? 'Ideas' : m === 'learning' ? 'Learning' : m === 'hackathon' ? 'Hackathons' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {allProjects.length === 0 ? (
          <div className="empty-state" style={{ padding: 64, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
            <Camera size={40} color="var(--border-active)" style={{ margin: '0 auto 16px' }} />
            <div style={{ fontSize: 16, color: 'var(--text-dim)', marginBottom: 8 }}>No projects found</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Adjust your filters or add projects in Learning Tracker and Ideation Hub.</div>
          </div>
        ) : (
          allProjects.map(p => <ProjectCard key={p.id} project={p} />)
        )}
      </div>
    </div>
  );
}
