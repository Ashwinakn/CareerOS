'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/lib/context';
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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar currentView={currentView} onViewChange={setCurrentView} streak={streak} completedToday={completedToday} />
      <main style={{ flex: 1, overflowY: 'auto', height: '100vh', position: 'relative', background: 'var(--bg-root)' }}>
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
