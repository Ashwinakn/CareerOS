'use client';

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useApp } from '@/lib/context';
import { Search, Folder, Briefcase, Calendar } from 'lucide-react';

type View = 'dashboard' | 'learning' | 'ideation' | 'events' | 'projects' | 'internships' | 'logs';

export default function CommandPalette({ onViewChange }: { onViewChange: (view: View) => void }) {
  const [open, setOpen] = useState(false);
  const { state } = useApp();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(o => !o); }
    };
    const fromSidebar = () => setOpen(true);
    document.addEventListener('keydown', down);
    window.addEventListener('career-os-search', fromSidebar);
    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('career-os-search', fromSidebar);
    };
  }, []);

  if (!open) return null;

  const allProjects = state.topics.flatMap(t => t.modules.flatMap(m => m.projects.map(p => ({ ...p, topicTitle: t.title }))));

  return (
    <div className="modal-overlay" onClick={() => setOpen(false)} style={{ alignItems: 'flex-start', paddingTop: '10vh' }}>
      <div className="modal-content" style={{ padding: 0, maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <Command label="Global Command Menu" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-active)' }}>
            <Search size={18} style={{ color: 'var(--text-muted)', marginRight: 12 }} />
            <Command.Input 
              placeholder="Search projects, internships, events..." 
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 16, outline: 'none' }}
              autoFocus
            />
            <div style={{ fontSize: 11, color: 'var(--text-dim)', background: 'var(--bg-hover)', padding: '2px 6px', borderRadius: 4 }}>ESC</div>
          </div>

          <Command.List style={{ maxHeight: 400, overflowY: 'auto', padding: 8 }}>
            <Command.Empty style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>No results found.</Command.Empty>

            <Command.Group heading="Projects" style={{ color: 'var(--text-dim)', fontSize: 12, padding: '8px 8px 4px' }}>
              {allProjects.map(p => (
                <Command.Item 
                  key={p.id} 
                  onSelect={() => { onViewChange('learning'); setOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                  <Folder size={15} color="var(--accent-primary)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14 }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.topicTitle}</div>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Internships" style={{ color: 'var(--text-dim)', fontSize: 12, padding: '8px 8px 4px', marginTop: 8 }}>
              {state.internships.map(i => (
                <Command.Item 
                  key={i.id} 
                  onSelect={() => { onViewChange('internships'); setOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                  <Briefcase size={15} color="var(--accent-secondary)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14 }}>{i.company}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{i.role}</div>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
            
            <Command.Group heading="Events" style={{ color: 'var(--text-dim)', fontSize: 12, padding: '8px 8px 4px', marginTop: 8 }}>
              {state.events.map(e => (
                <Command.Item 
                  key={e.id} 
                  onSelect={() => { onViewChange('events'); setOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                  <Calendar size={15} color="#22d3ee" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14 }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.date}</div>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
