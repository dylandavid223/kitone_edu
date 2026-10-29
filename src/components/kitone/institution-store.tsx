'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// ---- Types ---------------------------------------------------------------
export type InstitutionType =
  | 'pre_primary' | 'primary' | 'jss' | 'sss' | 'tvet' | 'university' | 'combined';

export type Curriculum = 'CBC' | '8-4-4 (Legacy)' | 'University' | 'TVET';

export interface InstitutionInfo {
  name: string;
  shortName: string;
  slug: string;
  motto: string;
  type: InstitutionType;
  curriculum: Curriculum;
  location: string;
  established: string;
  timezone: string;
  currency: string;
  languages: string[];
  logoText: string;
  term: string;
  academicYear: string;
}

export interface SchoolClass { id: string; name: string; grade: string; stream: string; teacherId: string | null; room: string; }
export interface StaffMember { id: string; name: string; role: string; email: string; phone: string; subjects: string[]; avatarColor: string; }
export interface Subject { id: string; name: string; code: string; color: string; }
export interface Student {
  id: string; admissionNo: string; name: string; gender: 'M' | 'F';
  grade: string; stream: string; guardian: string; guardianPhone: string;
  feeBalance: number; attendance: number; avgScore: number; cbc: string;
  status: 'active' | 'suspended';
}
export interface FeeItem { label: string; amount: number; }
export interface FeeStructure { id: string; grade: string; items: FeeItem[]; }
export interface Invoice {
  id: string; invoiceNo: string; studentId: string; studentName: string;
  className: string; amount: number; paid: number; dueDate: string;
  status: 'paid' | 'pending' | 'overdue'; items: FeeItem[];
}
export interface Payment {
  id: string; invoiceNo: string; studentName: string;
  method: 'M-PESA' | 'Airtel Money' | 'Bank' | 'Cash';
  amount: number; code: string; phone: string; timestamp: string;
}
export interface ClassroomSession {
  id: string; classId: string; className: string; subject: string;
  teacher: string; scheduledAt: string; duration: number;
  status: 'scheduled' | 'live' | 'ended';
}
export interface Announcement { id: string; title: string; body: string; audience: string; author: string; date: string; views: number; }
export interface Assessment {
  id: string; title: string; subject: string; className: string;
  questions: number; window: string; duration: number;
  status: 'Draft' | 'Scheduled' | 'Live' | 'Closed'; avgScore: number; attempts: number;
}

export interface InstitutionData {
  info: InstitutionInfo | null;
  setupComplete: boolean;
  setupStep: number;
  classes: SchoolClass[];
  staff: StaffMember[];
  subjects: Subject[];
  students: Student[];
  feeStructures: FeeStructure[];
  invoices: Invoice[];
  payments: Payment[];
  sessions: ClassroomSession[];
  announcements: Announcement[];
  assessments: Assessment[];
}

const EMPTY: InstitutionData = {
  info: null, setupComplete: false, setupStep: 0,
  classes: [], staff: [], subjects: [], students: [],
  feeStructures: [], invoices: [], payments: [], sessions: [],
  announcements: [], assessments: [],
};

const STORAGE_KEY = 'kitone-institution';

// ---- Context -------------------------------------------------------------
interface StoreValue {
  data: InstitutionData;
  loading: boolean;
  setInfo: (i: InstitutionInfo) => void;
  setSetupStep: (n: number) => void;
  completeSetup: () => void;
  resetInstitution: () => void;
  syncToServer: () => Promise<void>;
  addClass: (c: Omit<SchoolClass, 'id'>) => void;
  updateClass: (id: string, c: Partial<SchoolClass>) => void;
  removeClass: (id: string) => void;
  addStaff: (s: Omit<StaffMember, 'id'>) => void;
  removeStaff: (id: string) => void;
  addSubject: (s: Omit<Subject, 'id'>) => void;
  removeSubject: (id: string) => void;
  addStudent: (s: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, s: Partial<Student>) => void;
  removeStudent: (id: string) => void;
  addFeeStructure: (f: Omit<FeeStructure, 'id'>) => void;
  addInvoice: (i: Omit<Invoice, 'id'>) => void;
  addPayment: (p: Omit<Payment, 'id'>) => void;
  addSession: (s: Omit<ClassroomSession, 'id'>) => void;
  updateSession: (id: string, s: Partial<ClassroomSession>) => void;
  removeSession: (id: string) => void;
  addAnnouncement: (a: Omit<Announcement, 'id'>) => void;
  addAssessment: (a: Omit<Assessment, 'id'>) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function readStored(): InstitutionData {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch { return EMPTY; }
}

const PALETTE = ['bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500', 'bg-violet-500', 'bg-orange-500', 'bg-lime-600', 'bg-cyan-600'];
export function pickColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function initials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join('');
}

const uid = () => Math.random().toString(36).slice(2, 10);

export function InstitutionProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<InstitutionData>(EMPTY);
  const [loading, setLoading] = useState(true);

  // On mount: fetch from MySQL API, fall back to localStorage
  useEffect(() => {
    let cancelled = false;
    fetch('/api/onboarding')
      .then((r) => r.json())
      .then((server: InstitutionData) => {
        if (cancelled) return;
        if (server && server.info) {
          setData(server);
        } else {
          setData(readStored());
        }
      })
      .catch(() => { if (!cancelled) setData(readStored()); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Persist to localStorage on every change (cache)
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }, [data]);

  const setInfo = useCallback((info: InstitutionInfo) => setData((d) => ({ ...d, info })), []);
  const setSetupStep = useCallback((setupStep: number) => setData((d) => ({ ...d, setupStep })), []);
  const completeSetup = useCallback(() => setData((d) => ({ ...d, setupComplete: true })), []);
  const resetInstitution = useCallback(() => {
    setData(EMPTY);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    fetch('/api/onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ info: { name: '', slug: 'reset', type: 'jss', curriculum: 'CBC', term: '', academicYear: '' }, setupComplete: false }) }).catch(() => {});
  }, []);

  // Sync full state to MySQL
  const syncToServer = useCallback(async () => {
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, setupComplete: true }),
      });
    } catch (e) {
      console.error('syncToServer failed:', e);
    }
  }, [data]);

  const addClass = useCallback((c: Omit<SchoolClass, 'id'>) => setData((d) => ({ ...d, classes: [...d.classes, { ...c, id: uid() }] })), []);
  const updateClass = useCallback((id: string, c: Partial<SchoolClass>) => setData((d) => ({ ...d, classes: d.classes.map((x) => x.id === id ? { ...x, ...c } : x) })), []);
  const removeClass = useCallback((id: string) => setData((d) => ({ ...d, classes: d.classes.filter((x) => x.id !== id) })), []);
  const addStaff = useCallback((s: Omit<StaffMember, 'id'>) => setData((d) => ({ ...d, staff: [...d.staff, { ...s, id: uid() }] })), []);
  const removeStaff = useCallback((id: string) => setData((d) => ({ ...d, staff: d.staff.filter((x) => x.id !== id) })), []);
  const addSubject = useCallback((s: Omit<Subject, 'id'>) => setData((d) => ({ ...d, subjects: [...d.subjects, { ...s, id: uid() }] })), []);
  const removeSubject = useCallback((id: string) => setData((d) => ({ ...d, subjects: d.subjects.filter((x) => x.id !== id) })), []);
  const addStudent = useCallback((s: Omit<Student, 'id'>) => setData((d) => ({ ...d, students: [...d.students, { ...s, id: uid() }] })), []);
  const updateStudent = useCallback((id: string, s: Partial<Student>) => setData((d) => ({ ...d, students: d.students.map((x) => x.id === id ? { ...x, ...s } : x) })), []);
  const removeStudent = useCallback((id: string) => setData((d) => ({ ...d, students: d.students.filter((x) => x.id !== id) })), []);
  const addFeeStructure = useCallback((f: Omit<FeeStructure, 'id'>) => setData((d) => ({ ...d, feeStructures: [...d.feeStructures, { ...f, id: uid() }] })), []);
  const addInvoice = useCallback((i: Omit<Invoice, 'id'>) => setData((d) => ({ ...d, invoices: [...d.invoices, { ...i, id: uid() }] })), []);
  const addPayment = useCallback((p: Omit<Payment, 'id'>) => setData((d) => ({ ...d, payments: [...d.payments, { ...p, id: uid() }] })), []);
  const addSession = useCallback((s: Omit<ClassroomSession, 'id'>) => setData((d) => ({ ...d, sessions: [...d.sessions, { ...s, id: uid() }] })), []);
  const updateSession = useCallback((id: string, s: Partial<ClassroomSession>) => setData((d) => ({ ...d, sessions: d.sessions.map((x) => x.id === id ? { ...x, ...s } : x) })), []);
  const removeSession = useCallback((id: string) => setData((d) => ({ ...d, sessions: d.sessions.filter((x) => x.id !== id) })), []);
  const addAnnouncement = useCallback((a: Omit<Announcement, 'id'>) => setData((d) => ({ ...d, announcements: [...d.announcements, { ...a, id: uid() }] })), []);
  const addAssessment = useCallback((a: Omit<Assessment, 'id'>) => setData((d) => ({ ...d, assessments: [...d.assessments, { ...a, id: uid() }] })), []);

  const value: StoreValue = {
    data, loading, setInfo, setSetupStep, completeSetup, resetInstitution, syncToServer,
    addClass, updateClass, removeClass,
    addStaff, removeStaff,
    addSubject, removeSubject,
    addStudent, updateStudent, removeStudent,
    addFeeStructure, addInvoice, addPayment,
    addSession, updateSession, removeSession,
    addAnnouncement, addAssessment,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useInstitution() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useInstitution must be used within InstitutionProvider');
  return ctx;
}

// ---- Pure helpers -------------------------------------------------------
export function formatKES(n: number): string { return 'KES ' + n.toLocaleString('en-KE'); }

export const cbcLevels = [
  { code: 'EE', label: 'Exceeding Expectation', tone: 'emerald', min: 80 },
  { code: 'ME', label: 'Meeting Expectation', tone: 'green', min: 60 },
  { code: 'AE', label: 'Approaching Expectation', tone: 'amber', min: 45 },
  { code: 'BE', label: 'Below Expectation', tone: 'rose', min: 0 },
] as const;

export function cbcFor(score: number) {
  return cbcLevels.find((l) => score >= l.min) ?? cbcLevels[cbcLevels.length - 1];
}

export function fmtEAT(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-KE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' });
  } catch { return iso; }
}

export function fmtDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Africa/Nairobi' });
  } catch { return iso; }
}

export const institutionTypeMeta: Record<InstitutionType, { label: string; grades: string[]; defaultSubjects: string[] }> = {
  pre_primary: { label: 'Pre-Primary (PP1/PP2)', grades: ['PP1', 'PP2'], defaultSubjects: ['Language Activities', 'Mathematical Activities', 'Environmental Activities', 'Psychomotor & Creative Activities', 'Religious Activities'] },
  primary: { label: 'Primary (Grade 1–6)', grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'], defaultSubjects: ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Social Studies', 'CRE', 'Creative Arts', 'Agriculture & Nutrition'] },
  jss: { label: 'Junior Secondary (Grade 7–9)', grades: ['Grade 7', 'Grade 8', 'Grade 9'], defaultSubjects: ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Social Studies', 'Pre-Technical Studies', 'CRE', 'Agriculture & Nutrition', 'Creative Arts'] },
  sss: { label: 'Senior Secondary (Grade 10–12)', grades: ['Grade 10', 'Grade 11', 'Grade 12'], defaultSubjects: ['Mathematics', 'English', 'Kiswahili', 'Chemistry', 'Biology', 'Physics', 'Geography', 'History', 'Business Studies'] },
  tvet: { label: 'TVET / College', grades: ['Level 4', 'Level 5', 'Level 6'], defaultSubjects: ['Communication Skills', 'Numeracy', 'Digital Literacy', 'Entrepreneurship', 'Trade Theory', 'Trade Practical'] },
  university: { label: 'University', grades: ['Year 1', 'Year 2', 'Year 3', 'Year 4'], defaultSubjects: ['Core Module', 'Elective Module', 'Research Methods', 'Industrial Attachment'] },
  combined: { label: 'Combined (multiple levels)', grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'], defaultSubjects: ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Social Studies', 'CRE'] },
};

export const streamSuggestions = ['East', 'West', 'North', 'South', 'A', 'B', 'C', 'Red', 'Blue', 'Green'];
export const staffRoleSuggestions = ['Principal', 'Deputy Principal', 'Teacher', 'Class Teacher', 'Finance Officer', 'Exam Officer', 'Librarian', 'Nurse', 'Bursar', 'Dean of Studies'];