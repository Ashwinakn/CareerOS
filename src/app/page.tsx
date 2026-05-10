'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/lib/context';
import { Menu as SidebarIcon } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import DashboardView from '@/components/DashboardView';
import LearningView from '@/components/LearningView';
import EventsView from '@/components/EventsView';
import InternshipsView from '@/components/InternshipsView';
import LogsView, { calcStreak } from '@/components/LogsView';
import IdeationView from '@/components/IdeationView';
import ProjectsView from '@/components/ProjectsView';
import CommandPalette from '@/components/CommandPalette';
import AuthView from '@/components/AuthView';

type View = 'dashboard' | 'learning' | 'ideation' | 'events' | 'projects' | 'internships' | 'logs';

export default function Home() {
  const { state } = useApp();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    supabase!.auth.getSession().then(({ data: { session } }) => { setSession(session); setLoading(false); });
    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const streak = useMemo(() => calcStreak(state.logs), [state.logs]);
  const today = new Date().toISOString().split('T')[0];
  const completedToday = state.logs.some(l => l.date === today);

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (!state.profile) return <AuthView onComplete={() => setCurrentView('dashboard')} />;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Sidebar currentView={currentView} onViewChange={setCurrentView} streak={streak} completedToday={completedToday} />
      
      {/* Mobile Menu Trigger */}
      <button 
        className="mobile-only"
        style={{ 
          position: 'fixed', bottom: 24, right: 24, zIndex: 80,
          width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-primary)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px var(--accent-transparent)', border: 'none'
        }}
        onClick={() => {
          // Find the sidebar toggle and click it, or we can use a custom event.
          // For simplicity, we'll just use a window event.
          window.dispatchEvent(new CustomEvent('career-os-toggle-sidebar'));
        }}
      >
        <SidebarIcon size={24} />
      </button>

      <main style={{ 
        flex: 1, 
        overflowY: 'auto', 
        height: '100vh', 
        position: 'relative', 
        background: 'var(--bg-root)',
        marginLeft: 'var(--sidebar-width, 240px)',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* CSS Variable to handle margin responsiveness */}
        <style jsx global>{`
          :root {
            --sidebar-width: 240px;
          }
          @media (max-width: 1024px) {
            :root { --sidebar-width: 0px; }
          }
        `}</style>
        {currentView === 'dashboard' && <DashboardView streak={streak} onNavigate={v => setCurrentView(v)} />}
        {currentView === 'learning' && <LearningView />}
        {currentView === 'ideation' && <IdeationView />}
        {currentView === 'events' && <EventsView />}
        {currentView === 'projects' && <ProjectsView />}
        {currentView === 'internships' && <InternshipsView />}
        {currentView === 'logs' && <LogsView />}
        <CommandPalette onViewChange={setCurrentView} />
      </main>
    </div>
  );
}
