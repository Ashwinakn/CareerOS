// ─── Types ───────────────────────────────────────────────────────────────────

export type StatusTag = 'Planned' | 'In-Progress' | 'Completed';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'paper' | 'docs' | 'youtube' | 'article' | 'other';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: StatusTag;
  linkedInternshipIds: string[];
  tags: string[];
  githubRepo?: string;
  demoLink?: string; // deployed link or demo video
  pptLink?: string;
  createdAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  status: StatusTag;
  projects: Project[];
}

export interface Topic {
  id: string;
  title: string;
  icon: string; // lucide icon name
  description: string;
  modules: Module[];
  resources: Resource[];
  createdAt: string;
}

// ─── Event Hub ───────────────────────────────────────────────────────────────

export type EventStatus = 'Interested' | 'Applied' | 'Attending' | 'Completed' | 'Missed';

export interface HackathonEvent {
  id: string;
  name: string;
  date: string;
  registrationLink: string;
  status: EventStatus;
  teamNotes: string;
  prize?: string;
  location?: string;
  projectTitle?: string;
  projectDescription?: string;
  githubRepo?: string;
  demoLink?: string;
  pptLink?: string;
  createdAt: string;
}

// ─── Internship CRM ──────────────────────────────────────────────────────────

export type AppStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Ghosted' | 'Rejected' | 'Withdrawn';

export interface InternshipApp {
  id: string;
  company: string;
  role: string;
  dateApplied: string;
  status: AppStatus;
  resumeLink: string;
  coverLetterLink: string;
  jobUrl: string;
  notes: string;
  linkedProjectIds: string[];
  createdAt: string;
}

// ─── Daily Log ───────────────────────────────────────────────────────────────

export interface DailyLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  accomplished: string;
  planned: string;
  mood: 1 | 2 | 3 | 4 | 5;
}

// ─── Root State ──────────────────────────────────────────────────────────────

export interface UserProfile {
  email: string;
  name: string;
  focusArea: string;          // Kept for backward compatibility
  preferences: string[];      // Up to 3 preferences
  learningGoal: string;       // e.g. "Land a CV internship by Dec 2025"
  studyHoursPerDay: string;   // e.g. "3–4 hours"
  preferredTime: string;      // e.g. "Evening"
}

// ─── Todo Checklist ─────────────────────────────────────────────────────────

export interface TodoItem {
  id: string;
  date: string;    // YYYY-MM-DD
  text: string;
  done: boolean;
}

// ─── Ideation Hub ──────────────────────────────────────────────────────────

export type IdeaStatus = 'Idea' | 'Prototyping' | 'Building' | 'Completed' | 'Paused';

export interface IdeaResource {
  id: string;
  title: string;
  url: string;
  type: 'paper' | 'docs' | 'youtube' | 'article' | 'other';
}

export interface IdeaProject {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  linkedTopicId?: string;   // Links to a Topic in Learning Tracker
  tags: string[];
  githubRepo?: string;
  demoLink?: string;
  pptLink?: string;
  resources: IdeaResource[];
  createdAt: string;
}

export interface AppState {
  profile?: UserProfile;
  topics: Topic[];
  events: HackathonEvent[];
  internships: InternshipApp[];
  logs: DailyLog[];
  todos: TodoItem[];
  ideas: IdeaProject[];
}

// ─── Default seed data ───────────────────────────────────────────────────────

export const DEFAULT_STATE: AppState = {
  // profile is intentionally undefined — login required
  topics: [
    {
      id: 'topic-cv',
      title: 'Computer Vision',
      icon: 'Camera',
      description: 'Deep learning-based visual perception systems, anomaly detection, and real-time inference.',
      createdAt: '2025-01-01',
      modules: [
        {
          id: 'mod-anomaly',
          title: 'Anomaly Detection',
          description: 'Industrial anomaly detection using PatchCore and related methods.',
          status: 'In-Progress',
          projects: [
            {
              id: 'proj-patchcore',
              title: 'PatchCore PCB Defect Detection',
              description: 'Industrial PCB defect detection using PatchCore memory bank approach on MVTec-style dataset.',
              status: 'In-Progress',
              tags: ['PatchCore', 'PyTorch', 'WideResNet50', 'MVTec'],
              linkedInternshipIds: [],
              createdAt: '2025-03-01',
            },
          ],
        },
        {
          id: 'mod-segmentation',
          title: 'Semantic Segmentation',
          description: 'Pixel-wise scene understanding for autonomous systems.',
          status: 'Planned',
          projects: [],
        },
        {
          id: 'mod-object-detection',
          title: 'Object Detection',
          description: 'YOLO, RT-DETR, and transformer-based detection pipelines.',
          status: 'Planned',
          projects: [],
        },
      ],
      resources: [
        {
          id: 'res-patchcore-paper',
          title: 'PatchCore Paper (CVPR 2022)',
          url: 'https://arxiv.org/abs/2106.08265',
          type: 'paper',
        },
        {
          id: 'res-mvtec',
          title: 'MVTec AD Dataset',
          url: 'https://www.mvtec.com/company/research/datasets/mvtec-ad',
          type: 'docs',
        },
      ],
    },
    {
      id: 'topic-dl',
      title: 'Deep Learning',
      icon: 'Brain',
      description: 'Foundational neural architectures, training dynamics, and optimization techniques.',
      createdAt: '2025-01-01',
      modules: [
        {
          id: 'mod-transformers',
          title: 'Transformers & Attention',
          description: 'Vision Transformers, DINO, and self-supervised learning.',
          status: 'In-Progress',
          projects: [],
        },
      ],
      resources: [
        {
          id: 'res-d2l',
          title: 'Dive into Deep Learning',
          url: 'https://d2l.ai',
          type: 'docs',
        },
      ],
    },
    {
      id: 'topic-academics',
      title: 'Academics',
      icon: 'GraduationCap',
      description: 'College coursework, semester tracking, and academic projects.',
      createdAt: '2025-01-01',
      modules: [
        {
          id: 'mod-sem6',
          title: 'Semester 6',
          description: 'Current semester subjects.',
          status: 'In-Progress',
          projects: [],
        },
      ],
      resources: [],
    },
  ],
  events: [
    {
      id: 'evt-1',
      name: 'Smart India Hackathon 2025',
      date: '2025-09-01',
      registrationLink: 'https://sih.gov.in',
      status: 'Interested',
      teamNotes: 'Looking for ML + backend teammates.',
      prize: '₹1,00,000',
      location: 'Pan India',
      createdAt: '2025-05-01',
    },
  ],
  internships: [
    {
      id: 'int-1',
      company: 'Samsung R&D',
      role: 'CV/ML Intern',
      dateApplied: '2025-04-15',
      status: 'Applied',
      resumeLink: '',
      coverLetterLink: '',
      jobUrl: '',
      notes: 'Emphasis on PatchCore project in resume.',
      linkedProjectIds: ['proj-patchcore'],
      createdAt: '2025-04-15',
    },
  ],
  logs: [
    {
      id: 'log-1',
      date: new Date().toISOString().split('T')[0],
      accomplished: 'Set up Career OS. Ready to grind! 🚀',
      planned: 'Complete PatchCore training loop tomorrow.',
      mood: 4,
    },
  ],
  todos: [],
  ideas: [],
};

// ─── Storage helpers ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'career-os-v1';

export function loadState(): AppState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw) as AppState;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error('Failed to save state to localStorage');
  }
}

// ─── ID generator ─────────────────────────────────────────────────────────────

export function genId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
