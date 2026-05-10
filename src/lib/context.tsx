'use client';

import React, { createContext, useContext, useEffect, useReducer, useCallback, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  AppState, Topic, Module, Project, Resource, HackathonEvent,
  InternshipApp, DailyLog, TodoItem, IdeaProject, IdeaResource, StatusTag, AppStatus, EventStatus,
  loadState, saveState, genId, DEFAULT_STATE, ViewType
} from './store';

// ─── Action Types ─────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'UPDATE_PROFILE'; payload: { email: string; name: string; focusArea: string; preferences: string[]; learningGoal: string; studyHoursPerDay: string; preferredTime: string } }
  // Topics
  | { type: 'ADD_TOPIC'; payload: Omit<Topic, 'id' | 'createdAt' | 'modules' | 'resources'> }
  | { type: 'UPDATE_TOPIC'; payload: { id: string; data: Partial<Topic> } }
  | { type: 'DELETE_TOPIC'; payload: string }
  // Modules
  | { type: 'ADD_MODULE'; payload: { topicId: string; data: Omit<Module, 'id' | 'projects'> } }
  | { type: 'UPDATE_MODULE'; payload: { topicId: string; moduleId: string; data: Partial<Module> } }
  | { type: 'DELETE_MODULE'; payload: { topicId: string; moduleId: string } }
  // Projects
  | { type: 'ADD_PROJECT'; payload: { topicId: string; moduleId: string; data: Omit<Project, 'id' | 'createdAt' | 'linkedInternshipIds'> } }
  | { type: 'UPDATE_PROJECT'; payload: { topicId: string; moduleId: string; projectId: string; data: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: { topicId: string; moduleId: string; projectId: string } }
  // Resources
  | { type: 'ADD_RESOURCE'; payload: { topicId: string; data: Omit<Resource, 'id'> } }
  | { type: 'UPDATE_RESOURCE'; payload: { topicId: string; resourceId: string; data: Partial<Resource> } }
  | { type: 'DELETE_RESOURCE'; payload: { topicId: string; resourceId: string } }
  // Events
  | { type: 'ADD_EVENT'; payload: Omit<HackathonEvent, 'id' | 'createdAt'> }
  | { type: 'UPDATE_EVENT'; payload: { id: string; data: Partial<HackathonEvent> } }
  | { type: 'DELETE_EVENT'; payload: string }
  // Internships
  | { type: 'ADD_INTERNSHIP'; payload: Omit<InternshipApp, 'id' | 'createdAt'> }
  | { type: 'UPDATE_INTERNSHIP'; payload: { id: string; data: Partial<InternshipApp> } }
  | { type: 'DELETE_INTERNSHIP'; payload: string }
  // Logs
  | { type: 'ADD_LOG'; payload: Omit<DailyLog, 'id'> }
  | { type: 'UPDATE_LOG'; payload: { id: string; data: Partial<DailyLog> } }
  | { type: 'DELETE_LOG'; payload: string }
  // Todos
  | { type: 'ADD_TODO'; payload: { date: string; text: string } }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  // Ideas
  | { type: 'ADD_IDEA'; payload: Omit<IdeaProject, 'id' | 'createdAt' | 'resources'> }
  | { type: 'UPDATE_IDEA'; payload: { id: string; data: Partial<IdeaProject> } }
  | { type: 'DELETE_IDEA'; payload: string }
  | { type: 'ADD_IDEA_RESOURCE'; payload: { ideaId: string; data: Omit<IdeaResource, 'id'> } }
  | { type: 'UPDATE_IDEA_RESOURCE'; payload: { ideaId: string; resourceId: string; data: Partial<IdeaResource> } }
  | { type: 'DELETE_IDEA_RESOURCE'; payload: { ideaId: string; resourceId: string } }
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'RESET_STATE' };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'UPDATE_PROFILE': {
      const next = { ...state, profile: action.payload };
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('career-os-v1', JSON.stringify(next)); } catch {}
      }
      return next;
    }
    // ── Topics ──
    case 'ADD_TOPIC':
      return {
        ...state,
        topics: [...state.topics, {
          ...action.payload,
          id: genId('topic'),
          createdAt: new Date().toISOString(),
          modules: [],
          resources: [],
        }],
      };
    case 'UPDATE_TOPIC':
      return {
        ...state,
        topics: state.topics.map(t => t.id === action.payload.id ? { ...t, ...action.payload.data } : t),
      };
    case 'DELETE_TOPIC':
      return { ...state, topics: state.topics.filter(t => t.id !== action.payload) };

    // ── Modules ──
    case 'ADD_MODULE':
      return {
        ...state,
        topics: state.topics.map(t => t.id === action.payload.topicId
          ? { ...t, modules: [...t.modules, { ...action.payload.data, id: genId('mod'), projects: [] }] }
          : t
        ),
      };
    case 'UPDATE_MODULE':
      return {
        ...state,
        topics: state.topics.map(t => t.id === action.payload.topicId
          ? { ...t, modules: t.modules.map(m => m.id === action.payload.moduleId ? { ...m, ...action.payload.data } : m) }
          : t
        ),
      };
    case 'DELETE_MODULE':
      return {
        ...state,
        topics: state.topics.map(t => t.id === action.payload.topicId
          ? { ...t, modules: t.modules.filter(m => m.id !== action.payload.moduleId) }
          : t
        ),
      };

    // ── Projects ──
    case 'ADD_PROJECT':
      return {
        ...state,
        topics: state.topics.map(t => t.id === action.payload.topicId
          ? {
            ...t, modules: t.modules.map(m => m.id === action.payload.moduleId
              ? {
                ...m, projects: [...m.projects, {
                  ...action.payload.data,
                  id: genId('proj'),
                  createdAt: new Date().toISOString(),
                  linkedInternshipIds: [],
                }]
              }
              : m
            )
          }
          : t
        ),
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        topics: state.topics.map(t => t.id === action.payload.topicId
          ? {
            ...t, modules: t.modules.map(m => m.id === action.payload.moduleId
              ? { ...m, projects: m.projects.map(p => p.id === action.payload.projectId ? { ...p, ...action.payload.data } : p) }
              : m
            )
          }
          : t
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        topics: state.topics.map(t => t.id === action.payload.topicId
          ? {
            ...t, modules: t.modules.map(m => m.id === action.payload.moduleId
              ? { ...m, projects: m.projects.filter(p => p.id !== action.payload.projectId) }
              : m
            )
          }
          : t
        ),
      };

    // ── Resources ──
    case 'ADD_RESOURCE':
      return {
        ...state,
        topics: state.topics.map(t => t.id === action.payload.topicId
          ? { ...t, resources: [...t.resources, { ...action.payload.data, id: genId('res') }] }
          : t
        ),
      };
    case 'UPDATE_RESOURCE':
      return {
        ...state,
        topics: state.topics.map(t => t.id === action.payload.topicId
          ? { ...t, resources: t.resources.map(r => r.id === action.payload.resourceId ? { ...r, ...action.payload.data } : r) }
          : t
        ),
      };
    case 'DELETE_RESOURCE':
      return {
        ...state,
        topics: state.topics.map(t => t.id === action.payload.topicId
          ? { ...t, resources: t.resources.filter(r => r.id !== action.payload.resourceId) }
          : t
        ),
      };

    // ── Events ──
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, { ...action.payload, id: genId('evt'), createdAt: new Date().toISOString() }],
      };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(e => e.id === action.payload.id ? { ...e, ...action.payload.data } : e),
      };
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter(e => e.id !== action.payload) };

    // ── Internships ──
    case 'ADD_INTERNSHIP':
      return {
        ...state,
        internships: [...state.internships, { ...action.payload, id: genId('int'), createdAt: new Date().toISOString() }],
      };
    case 'UPDATE_INTERNSHIP':
      return {
        ...state,
        internships: state.internships.map(i => i.id === action.payload.id ? { ...i, ...action.payload.data } : i),
      };
    case 'DELETE_INTERNSHIP':
      return { ...state, internships: state.internships.filter(i => i.id !== action.payload) };

    // ── Logs ──
    case 'ADD_LOG':
      return {
        ...state,
        logs: [{ ...action.payload, id: genId('log') }, ...state.logs],
      };
    case 'UPDATE_LOG':
      return {
        ...state,
        logs: state.logs.map(l => l.id === action.payload.id ? { ...l, ...action.payload.data } : l),
      };
    case 'DELETE_LOG':
      return { ...state, logs: state.logs.filter(l => l.id !== action.payload) };

    // ── Todos ──
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...(state.todos || []), { id: genId('todo'), date: action.payload.date, text: action.payload.text, done: false }],
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: (state.todos || []).map(t => t.id === action.payload ? { ...t, done: !t.done } : t),
      };
    case 'DELETE_TODO':
      return { ...state, todos: (state.todos || []).filter(t => t.id !== action.payload) };

    // ── Ideas ──
    case 'ADD_IDEA':
      return {
        ...state,
        ideas: [...(state.ideas || []), { ...action.payload, id: genId('idea'), createdAt: new Date().toISOString(), resources: [] }],
      };
    case 'UPDATE_IDEA':
      return {
        ...state,
        ideas: (state.ideas || []).map(i => i.id === action.payload.id ? { ...i, ...action.payload.data } : i),
      };
    case 'DELETE_IDEA':
      return { ...state, ideas: (state.ideas || []).filter(i => i.id !== action.payload) };
    case 'ADD_IDEA_RESOURCE':
      return {
        ...state,
        ideas: (state.ideas || []).map(i => i.id === action.payload.ideaId
          ? { ...i, resources: [...i.resources, { ...action.payload.data, id: genId('ires') }] }
          : i
        ),
      };
    case 'UPDATE_IDEA_RESOURCE':
      return {
        ...state,
        ideas: state.ideas?.map(i => i.id === action.payload.ideaId
          ? { ...i, resources: i.resources.map(r => r.id === action.payload.resourceId ? { ...r, ...action.payload.data } : r) }
          : i
        ) || [],
      };
    case 'DELETE_IDEA_RESOURCE':
      return {
        ...state,
        ideas: (state.ideas || []).map(i => i.id === action.payload.ideaId
          ? { ...i, resources: i.resources.filter(r => r.id !== action.payload.resourceId) }
          : i
        ),
      };

    case 'RESET_STATE':
      if (typeof window !== 'undefined') {
        localStorage.removeItem('career-os-v1');
      }
      return DEFAULT_STATE;

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  getTopicById: (id: string) => Topic | undefined;
  getAllProjects: () => Array<Project & { topicId: string; moduleId: string; topicTitle: string }>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const [initialized, setInitialized] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Sync with Supabase Auth
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      dispatch({ type: 'SET_STATE', payload: loadState() });
      setInitialized(true);
      return;
    }

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id || null);
      // If no session, set initialized to true so it can show AuthView
      if (!session) {
        setInitialized(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id || null);
      if (!session) {
        setInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data from Supabase once we have a userId
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    
    if (userId) {
      supabase.from('user_data').select('state').eq('user_id', userId).single()
        .then(({ data, error }) => {
          if (data && data.state && (data.state as any).profile) {
            // Merge cloud state with DEFAULT_STATE to ensure no keys are missing
            const mergedState = { ...DEFAULT_STATE, ...(data.state as AppState) };
            dispatch({ type: 'SET_STATE', payload: mergedState });
            console.log('Cloud state loaded and merged successfully.');
          } else {
            console.log('No valid profile found in cloud state.');
          }
          setInitialized(true);
        });
    } else {
      // Not logged in but supabase configured
      setInitialized(true);
    }
  }, [userId]);

  // Persist state changes
  useEffect(() => {
    if (!initialized) return;

    if (isSupabaseConfigured && supabase && userId) {
      // Sync to cloud
      supabase.from('user_data').upsert({ user_id: userId, state, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) {
            console.error('CRITICAL: Failed to sync state to Supabase', error);
          } else {
            console.log('Successfully synced state to Supabase');
          }
        });
      // Also save to localStorage as a local backup
      saveState(state);
    } else if (!isSupabaseConfigured) {
      // Sync to localStorage only
      saveState(state);
    }
  }, [state, initialized, userId]);

  const getTopicById = useCallback((id: string) => state.topics.find(t => t.id === id), [state.topics]);

  const getAllProjects = useCallback(() => {
    const result: Array<Project & { topicId: string; moduleId: string; topicTitle: string }> = [];
    for (const topic of state.topics) {
      for (const mod of topic.modules) {
        for (const proj of mod.projects) {
          result.push({ ...proj, topicId: topic.id, moduleId: mod.id, topicTitle: topic.title });
        }
      }
    }
    return result;
  }, [state.topics]);

  if (!initialized) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading App State...</div>;

  return (
    <AppContext.Provider value={{ state, dispatch, getTopicById, getAllProjects }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
