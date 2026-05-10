'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { useApp } from '@/lib/context';
import {
  Camera, LayoutDashboard, Calendar, Briefcase, ClipboardList, ChevronRight,
  Flame, BookOpen, PanelLeftClose, PanelLeft, Moon, Sun, Settings, LogOut, Search, User, Pencil, Lightbulb
} from 'lucide-react';
import ProfileModal from '@/components/ProfileModal';

type View = 'dashboard' | 'learning' | 'ideation' | 'events' | 'projects' | 'internships' | 'logs';

interface SidebarProps {
  currentView: View;
  onViewChange: (v: View) => void;
  streak: number;
  completedToday: boolean;
}

const NAV_ITEMS: { id: View; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'dashboard',   label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'learning',    label: 'Learning Tracker', icon: BookOpen },
  { id: 'ideation',    label: 'Ideation Hub',     icon: Lightbulb },
  { id: 'events',      label: 'Event Hub',        icon: Calendar },
  { id: 'projects',    label: 'All Projects',     icon: Camera }, // Folder or similar icon
  { id: 'internships', label: 'Internship CRM',   icon: Briefcase },
  { id: 'logs',        label: 'Daily Progress',   icon: ClipboardList },
];

export default function Sidebar({ currentView, onViewChange, streak, completedToday }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const [showProfile, setShowProfile] = useState(false);
  const { theme, setTheme } = useTheme();
  const { state, dispatch } = useApp();

  React.useEffect(() => {
    const handleToggle = () => setCollapsed(prev => !prev);
    window.addEventListener('career-os-toggle-sidebar', handleToggle);
    return () => window.removeEventListener('career-os-toggle-sidebar', handleToggle);
  }, []);

  const handleLogout = () => {
    // Reset state to log out
    if (confirm("Are you sure you want to sign out?")) {
      dispatch({ type: 'RESET_STATE' });
      window.location.reload();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="mobile-only" 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90, backdropFilter: 'blur(2px)' }} 
          onClick={() => setCollapsed(true)} 
        />
      )}

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      <aside
      style={{
        width: collapsed ? 72 : 240,
        minWidth: collapsed ? 72 : 240,
        height: '100vh',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: collapsed ? '24px 8px' : '24px 12px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        transform: collapsed ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: collapsed ? 'none' : '20px 0 50px rgba(0,0,0,0.1)',
      }}
      className="mobile-sidebar"
    >
      {/* Mobile Toggle inside sidebar (only visible when expanded on mobile) */}
      <button 
        className="mobile-only btn-ghost" 
        style={{ position: 'absolute', right: -40, top: 20, background: 'var(--bg-sidebar)', border: '1px solid var(--border-subtle)', borderRadius: '0 8px 8px 0', padding: 8 }}
        onClick={() => setCollapsed(true)}
      >
        <PanelLeftClose size={20} />
      </button>
      {/* Header Profile Area */}
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', marginBottom: 24, padding: collapsed ? 0 : '0 8px', cursor: 'pointer' }}
        onClick={() => setShowProfile(true)}
        title="Edit profile"
      >
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <div style={{
              width: 36, height: 36, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={18} color="white" />
            </div>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {state.profile?.name || 'Engineer'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {state.profile?.focusArea || 'Career OS'}
              </div>
            </div>
            <Pencil size={13} color="var(--text-dim)" style={{ flexShrink: 0 }} />
          </div>
        )}
        {collapsed && (
          <div style={{
            width: 36, height: 36, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} title={state.profile?.name}>
            <User size={18} color="white" />
          </div>
        )}
      </div>

      {/* Global Search Hint & Collapse Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {!collapsed && (
          <div
            style={{ 
              flex: 1, padding: '8px 12px', background: 'var(--bg-root)', 
              border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', 
              alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
            title="Search (Ctrl+K)"
            onClick={() => window.dispatchEvent(new CustomEvent('career-os-search'))}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <Search size={14} /> Search
            </div>
            <div style={{ fontSize: 10, background: 'var(--bg-hover)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>⌘K</div>
          </div>
        )}
        {collapsed && (
          <button className="btn-ghost" style={{ flex: 1, padding: 8, borderRadius: 8, background: 'var(--bg-root)', border: '1px solid var(--border-subtle)' }} title="Search (Cmd+K)">
            <Search size={16} />
          </button>
        )}
        <button className="btn-ghost" style={{ padding: '8px', background: 'var(--bg-root)', border: '1px solid var(--border-subtle)', borderRadius: 8 }} onClick={() => setCollapsed(!collapsed)} title="Toggle Sidebar">
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '12px 0' : '10px 12px' }}
              onClick={() => onViewChange(item.id)}
              title={collapsed ? item.label : ''}
            >
              <Icon size={18} />
              {!collapsed && (
                <>
                  <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
                  {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                </>
              )}
            </button>
          );
        })}

        {/* Streak Badge inline with nav */}
        <div style={{
          marginTop: 12,
          padding: collapsed ? '10px 0' : '10px 12px',
          background: streak > 0 ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-root)',
          border: `1px solid ${streak > 0 ? 'rgba(245, 158, 11, 0.2)' : 'var(--border-subtle)'}`,
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 8,
          flexShrink: 0
        }} title={collapsed ? `${streak} day streak` : ''}>
          <Flame size={18} style={{ color: streak > 0 ? '#f59e0b' : 'var(--text-dim)' }} />
          {!collapsed && (
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: streak > 0 ? '#fbbf24' : 'var(--text-dim)' }}>
                {streak} day streak
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                {completedToday ? '✓ Logged today' : 'Log today to continue'}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom (Themes / Sign Out) */}
      <div style={{ paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4, justifyContent: collapsed ? 'center' : 'space-between', flexWrap: 'wrap' }}>
          {(['system', 'light', 'dark'] as const).map(t => (
            <button key={t} className="btn-ghost" style={{ 
              padding: collapsed ? 8 : '6px 8px', flex: collapsed ? 'none' : 1, justifyContent: 'center',
              background: theme === t ? 'var(--bg-hover)' : 'transparent',
              color: theme === t ? 'var(--text-primary)' : 'var(--text-muted)'
            }} onClick={() => setTheme(t)} title={`Theme: ${t}`}>
              {t === 'system' ? <Settings size={14} /> : t === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          ))}
        </div>
        
        <button className="btn-ghost" style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '12px 0' : '8px 12px', marginTop: 4, color: '#fb7185' }} onClick={handleLogout} title="Sign out">
          <LogOut size={16} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
    </>
  );
}
