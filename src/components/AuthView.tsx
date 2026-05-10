'use client';

import React, { useState } from 'react';
import { Camera, Mail, Lock, User, Target, BookOpen, Clock, Sunrise } from 'lucide-react';
import { useApp } from '@/lib/context';

type ProfilePayload = {
  email: string;
  name: string;
  focusArea: string;
  preferences: string[];
  learningGoal: string;
  studyHoursPerDay: string;
  preferredTime: string;
};

const FOCUS_OPTIONS = [
  'Computer Vision', 'Natural Language Processing', 'Deep Learning', 'Machine Learning', 'Data Science', 
  'Full Stack Web Development', 'Frontend Engineering', 'Backend Engineering', 'DevOps & Cloud Infrastructure', 
  'Cybersecurity', 'Mobile App Development', 'Embedded Systems & IoT', 'Robotics & Autonomous Systems', 
  'Game Development', 'AR/VR/XR Development', 'Blockchain & Web3', 'Database Administration', 
  'Network Engineering', 'UI/UX Design', 'Product Management', 'Quality Assurance & Testing', 
  'Bioinformatics', 'Quantum Computing', 'Edge Computing', 'Cloud Architecture', 'Microservices Architecture', 
  'Site Reliability Engineering', 'Big Data Engineering', 'Distributed Systems', 'High Performance Computing', 
  'Human-Computer Interaction', 'Graphics Programming', 'Compiler Design', 'Operating Systems', 
  'Digital Signal Processing', 'Parallel Programming', 'Financial Technology (FinTech)', 'Health Informatics', 
  'E-commerce Systems', 'Information Retrieval', 'Semantic Web', 'Computer Security & Cryptography', 
  'Cloud Native Development', 'Serverless Architecture', 'APIs & Integration', 'Technical Writing', 
  'Scientific Computing', 'VLSI Design', 'Computational Geometry', 'Software Architecture', 'Others'
];
const HOURS_OPTIONS = ['1 hour', '2 hours', '3–4 hours', '4–6 hours', '6+ hours'];
const TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Late Night'];

const Field = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-root)', border: '1px solid var(--border-active)', padding: '0 14px', borderRadius: 10 }}>
    <Icon size={18} color="var(--text-muted)" />
    {children}
  </div>
);

const inputStyle: React.CSSProperties = { width: '100%', padding: '14px 0', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: 15, fontFamily: 'inherit' };
const selectStyle: React.CSSProperties = { ...inputStyle, WebkitAppearance: 'none' };

export default function AuthView({ onComplete }: { onComplete?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [focusArea, setFocusArea] = useState('Computer Vision');
  const [otherFocusArea, setOtherFocusArea] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [studyHoursPerDay, setStudyHoursPerDay] = useState('3–4 hours');
  const [preferredTime, setPreferredTime] = useState('Evening');
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [error, setError] = useState('');
  const { dispatch } = useApp();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usersStr = localStorage.getItem('career_os_users') || '[]';
    const users: ProfilePayload[] = JSON.parse(usersStr);

    if (mode === 'signup') {
      if (users.find(u => u.email === email)) {
        setError('An account with this email already exists. Please sign in instead.');
        return;
      }
      const finalFocusArea = focusArea === 'Others' ? otherFocusArea : focusArea;
      const profile: ProfilePayload = { email, name: name || 'Engineer', focusArea: finalFocusArea, preferences: [], learningGoal, studyHoursPerDay, preferredTime };
      users.push({ ...profile, ...{ password } as any });
      localStorage.setItem('career_os_users', JSON.stringify(users));
      dispatch({ type: 'UPDATE_PROFILE', payload: profile });
      if (onComplete) onComplete();
    } else {
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (!user) {
        setError('Invalid email or password.');
        return;
      }
      dispatch({ type: 'UPDATE_PROFILE', payload: { email: user.email, name: user.name, focusArea: user.focusArea, preferences: user.preferences || [], learningGoal: user.learningGoal || '', studyHoursPerDay: user.studyHoursPerDay || '3–4 hours', preferredTime: user.preferredTime || 'Evening' } });
      if (onComplete) onComplete();
    }
  };



  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card glass" style={{ width: '100%', maxWidth: 460, padding: '40px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, left: -100, width: 250, height: 250, background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: 0.15, zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px var(--accent-transparent)' }}>
              <Camera size={28} color="white" />
            </div>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 700, textAlign: 'center', marginBottom: 6, letterSpacing: '-0.02em' }}>
            {mode === 'login' ? 'Welcome back' : 'Join Career OS'}
          </h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: 14, marginBottom: 28 }}>
            {mode === 'login' ? 'Enter your credentials to continue.' : 'Set up your personalized workspace.'}
          </p>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'signup' && (
              <>
                <Field icon={User}>
                  <input type="text" required placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                </Field>

                <Field icon={Target}>
                  <select value={focusArea} onChange={e => setFocusArea(e.target.value)} style={selectStyle}>
                    {FOCUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>

                {focusArea === 'Others' && (
                  <Field icon={Target}>
                    <input type="text" required placeholder="Type your focus area..." value={otherFocusArea} onChange={e => setOtherFocusArea(e.target.value)} style={inputStyle} />
                  </Field>
                )}


                <Field icon={BookOpen}>
                  <input type="text" placeholder="Learning Goal  (e.g. Land a CV intern by Dec)" value={learningGoal} onChange={e => setLearningGoal(e.target.value)} style={inputStyle} />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field icon={Clock}>
                    <select value={studyHoursPerDay} onChange={e => setStudyHoursPerDay(e.target.value)} style={selectStyle}>
                      {HOURS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field icon={Sunrise}>
                    <select value={preferredTime} onChange={e => setPreferredTime(e.target.value)} style={selectStyle}>
                      {TIME_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                </div>

                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
              </>
            )}

            <Field icon={Mail}>
              <input type="email" required placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </Field>

            <Field icon={Lock}>
              <input type="password" required placeholder="Password (min. 6 chars)" minLength={6} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
            </Field>

            {error && (
              <div style={{ color: '#fb7185', fontSize: 13, background: 'rgba(244,63,94,0.1)', padding: '10px 14px', borderRadius: 10 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 4, fontSize: 15, borderRadius: 10 }}>
              {mode === 'login' ? 'Sign In' : 'Get Started →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'var(--text-muted)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
