'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { User, Target, BookOpen, Clock, Sunrise, X, Check } from 'lucide-react';

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

const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 0', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: 14, fontFamily: 'inherit' };
const selectStyle: React.CSSProperties = { ...inputStyle, WebkitAppearance: 'none' };

const Field = ({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) => (
  <div>
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-root)', border: '1px solid var(--border-active)', padding: '0 12px', borderRadius: 8 }}>
      <Icon size={16} color="var(--text-muted)" />
      {children}
    </div>
  </div>
);

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useApp();
  const p = state.profile!;

  const [name, setName] = useState(p.name);
  const isCustomFocus = !FOCUS_OPTIONS.includes(p.focusArea);
  const [focusArea, setFocusArea] = useState(isCustomFocus ? 'Others' : p.focusArea);
  const [otherFocusArea, setOtherFocusArea] = useState(isCustomFocus ? p.focusArea : '');
  const [learningGoal, setLearningGoal] = useState(p.learningGoal || '');
  const [studyHoursPerDay, setStudyHoursPerDay] = useState(p.studyHoursPerDay || '3–4 hours');
  const [preferredTime, setPreferredTime] = useState(p.preferredTime || 'Evening');
  const [preferences, setPreferences] = useState<string[]>(p.preferences || []);
  const [prefInput, setPrefInput] = useState('');
  const [saved, setSaved] = useState(false);

  const addPreference = () => {
    const t = prefInput.trim();
    if (t && !preferences.includes(t) && preferences.length < 3) {
      setPreferences(prev => [...prev, t]);
      setPrefInput('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFocusArea = focusArea === 'Others' ? otherFocusArea : focusArea;
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: { email: p.email, name, focusArea: finalFocusArea, preferences, learningGoal, studyHoursPerDay, preferredTime },
    });

    // Also update the user registry so next login restores the name
    try {
      const users: any[] = JSON.parse(localStorage.getItem('career_os_users') || '[]');
      const idx = users.findIndex(u => u.email === p.email);
      if (idx !== -1) {
        users[idx] = { ...users[idx], name, focusArea: finalFocusArea, preferences, learningGoal, studyHoursPerDay, preferredTime };
        localStorage.setItem('career_os_users', JSON.stringify(users));
      }
    } catch {}

    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };



  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Edit Profile</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{p.email}</p>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: 6 }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field icon={User} label="Display Name">
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
          </Field>

          <Field icon={Target} label="Primary Focus Area">
            <select value={focusArea} onChange={e => setFocusArea(e.target.value)} style={selectStyle}>
              {FOCUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>

          {focusArea === 'Others' && (
            <Field icon={Target} label="Custom Focus Area">
              <input type="text" required placeholder="Type your focus area..." value={otherFocusArea} onChange={e => setOtherFocusArea(e.target.value)} style={inputStyle} />
            </Field>
          )}


          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Preferences (Max 3)</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--bg-root)', border: '1px solid var(--border-active)', padding: '0 12px', borderRadius: 8 }}>
              <Target size={16} color="var(--text-muted)" />
              <input value={prefInput} onChange={e => setPrefInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPreference(); } }} placeholder="e.g. Backend, Devops" style={inputStyle} disabled={preferences.length >= 3} />
              <button type="button" onClick={addPreference} className="btn-secondary" style={{ padding: '4px 8px', fontSize: 12, height: 'fit-content' }} disabled={preferences.length >= 3 || !prefInput.trim()}>Add</button>
            </div>
            {preferences.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {preferences.map(pref => (
                  <span key={pref} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 99, background: 'var(--accent-transparent)', color: 'var(--accent-secondary)', fontSize: 12 }}>
                    {pref} <button type="button" onClick={() => setPreferences(prev => prev.filter(x => x !== pref))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Field icon={BookOpen} label="Learning Goal">
            <input value={learningGoal} onChange={e => setLearningGoal(e.target.value)} placeholder="e.g. Land a CV internship by Dec 2025" style={inputStyle} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field icon={Clock} label="Daily Study Hours">
              <select value={studyHoursPerDay} onChange={e => setStudyHoursPerDay(e.target.value)} style={selectStyle}>
                {HOURS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field icon={Sunrise} label="Preferred Study Time">
              <select value={preferredTime} onChange={e => setPreferredTime(e.target.value)} style={selectStyle}>
                {TIME_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
              {saved ? <><Check size={16} /> Saved!</> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
