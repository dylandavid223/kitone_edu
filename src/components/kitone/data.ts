// Kitone Edu — mock data & helpers (Kenyan context: KES, CBC, Swahili, EAT)
// All data is illustrative for the demo. No backend required.

export type Role =
  | "admin"
  | "teacher"
  | "parent"
  | "student"
  | "finance";

export interface RoleInfo {
  id: Role;
  label: string;
  swahili: string;
  icon: string; // lucide icon name handled in component
}

export const roles: RoleInfo[] = [
  { id: "admin", label: "Institution Admin", swahili: "Msimamizi", icon: "shield" },
  { id: "teacher", label: "Teacher", swahili: "Mwalimu", icon: "book" },
  { id: "finance", label: "Finance Officer", swahili: "Afisa Fedha", icon: "wallet" },
  { id: "parent", label: "Parent / Guardian", swahili: "Mzazi", icon: "users" },
  { id: "student", label: "Student", swahili: "Mwanafunzi", icon: "graduation" },
];

export const institution = {
  name: "Alliance High School",
  shortName: "Alliance High",
  slug: "alliance-high",
  motto: "Strong to Serve",
  type: "Secondary · CBC & 8-4-4",
  plan: "Pro",
  curriculum: "CBC",
  term: "Term 2 · 2025",
  academicYear: "2025",
  timezone: "Africa/Nairobi (EAT)",
  currency: "KES",
  languages: ["English", "Kiswahili"],
  totalStudents: 1247,
  totalStaff: 96,
  activeClasses: 32,
  enrollmentCap: 2000,
  storageUsedGb: 4.2,
  storageCapGb: 10,
  smsUsed: 8400,
  smsCap: 15000,
  established: 1926,
  location: "Kikuyu, Kiambu County",
};

export const cbcLevels = [
  { code: "EE", label: "Exceeding Expectation", tone: "emerald", min: 80 },
  { code: "ME", label: "Meeting Expectation", tone: "green", min: 60 },
  { code: "AE", label: "Approaching Expectation", tone: "amber", min: 45 },
  { code: "BE", label: "Below Expectation", tone: "rose", min: 0 },
] as const;

export function cbcFor(score: number) {
  return (
    cbcLevels.find((l) => score >= l.min) ?? cbcLevels[cbcLevels.length - 1]
  );
}

export function formatKES(n: number): string {
  return "KES " + n.toLocaleString("en-KE");
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

const palette = [
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-lime-600",
  "bg-cyan-600",
];
export function avatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

export interface Student {
  id: string;
  admissionNo: string;
  name: string;
  gender: "M" | "F";
  grade: string;
  stream: string;
  guardian: string;
  guardianPhone: string;
  feeBalance: number;
  attendance: number; // %
  avgScore: number;
  cbc: string;
  status: "active" | "suspended";
}

export const students: Student[] = [
  { id: "s1", admissionNo: "AHS-2025-0142", name: "Wanjiru Kamau", gender: "F", grade: "Grade 9", stream: "East", guardian: "Peter Kamau", guardianPhone: "+254 712 345 678", feeBalance: 0, attendance: 96, avgScore: 88, cbc: "EE", status: "active" },
  { id: "s2", admissionNo: "AHS-2025-0143", name: "Brian Otieno", gender: "M", grade: "Grade 9", stream: "East", guardian: "Grace Otieno", guardianPhone: "+254 722 456 789", feeBalance: 12500, attendance: 91, avgScore: 74, cbc: "ME", status: "active" },
  { id: "s3", admissionNo: "AHS-2025-0144", name: "Achieng Wanjala", gender: "F", grade: "Grade 9", stream: "East", guardian: "Samuel Wanjala", guardianPhone: "+254 733 567 890", feeBalance: 0, attendance: 98, avgScore: 92, cbc: "EE", status: "active" },
  { id: "s4", admissionNo: "AHS-2025-0145", name: "Dennis Mwangi", gender: "M", grade: "Grade 9", stream: "West", guardian: "Jane Mwangi", guardianPhone: "+254 700 111 222", feeBalance: 34000, attendance: 78, avgScore: 51, cbc: "AE", status: "active" },
  { id: "s5", admissionNo: "AHS-2025-0146", name: "Cherono Kiprop", gender: "F", grade: "Grade 9", stream: "West", guardian: "Daniel Kiprop", guardianPhone: "+254 711 333 444", feeBalance: 8500, attendance: 94, avgScore: 81, cbc: "ME", status: "active" },
  { id: "s6", admissionNo: "AHS-2025-0147", name: "Kevin Njoroge", gender: "M", grade: "Form 3", stream: "North", guardian: "Mary Njoroge", guardianPhone: "+254 722 555 666", feeBalance: 0, attendance: 89, avgScore: 77, cbc: "ME", status: "active" },
  { id: "s7", admissionNo: "AHS-2025-0148", name: "Faith Awuor", gender: "F", grade: "Form 3", stream: "North", guardian: "Joseph Awuor", guardianPhone: "+254 733 777 888", feeBalance: 22000, attendance: 85, avgScore: 68, cbc: "ME", status: "active" },
  { id: "s8", admissionNo: "AHS-2025-0149", name: "Mutua Kyalo", gender: "M", grade: "Form 3", stream: "South", guardian: "Ruth Kyalo", guardianPhone: "+254 700 999 000", feeBalance: 0, attendance: 93, avgScore: 84, cbc: "EE", status: "active" },
  { id: "s9", admissionNo: "AHS-2025-0150", name: "Cynthia Wairimu", gender: "F", grade: "Form 3", stream: "South", guardian: "Stephen Wairimu", guardianPhone: "+254 711 222 333", feeBalance: 6700, attendance: 90, avgScore: 79, cbc: "ME", status: "active" },
  { id: "s10", admissionNo: "AHS-2025-0151", name: "Collins Kibe", gender: "M", grade: "Grade 7", stream: "East", guardian: "Ann Kibe", guardianPhone: "+254 722 444 555", feeBalance: 15000, attendance: 72, avgScore: 48, cbc: "AE", status: "active" },
  { id: "s11", admissionNo: "AHS-2025-0152", name: "Mercy Chebet", gender: "F", grade: "Grade 7", stream: "East", guardian: "David Chebet", guardianPhone: "+254 733 666 777", feeBalance: 0, attendance: 97, avgScore: 90, cbc: "EE", status: "active" },
  { id: "s12", admissionNo: "AHS-2025-0153", name: "Victor Maina", gender: "M", grade: "Grade 7", stream: "West", guardian: "Loise Maina", guardianPhone: "+254 700 888 999", feeBalance: 45000, attendance: 64, avgScore: 41, cbc: "BE", status: "suspended" },
  { id: "s13", admissionNo: "AHS-2025-0154", name: "Esther Nyambura", gender: "F", grade: "Grade 7", stream: "West", guardian: "James Nyambura", guardianPhone: "+254 711 111 222", feeBalance: 0, attendance: 95, avgScore: 86, cbc: "EE", status: "active" },
  { id: "s14", admissionNo: "AHS-2025-0155", name: "Felix Otieno", gender: "M", grade: "Form 4", stream: "North", guardian: "Caroline Otieno", guardianPhone: "+254 722 333 444", feeBalance: 18000, attendance: 88, avgScore: 73, cbc: "ME", status: "active" },
  { id: "s15", admissionNo: "AHS-2025-0156", name: "Gloria Akinyi", gender: "F", grade: "Form 4", stream: "North", guardian: "Paul Akinyi", guardianPhone: "+254 733 555 666", feeBalance: 0, attendance: 96, avgScore: 89, cbc: "EE", status: "active" },
  { id: "s16", admissionNo: "AHS-2025-0157", name: "Samuel Kariuki", gender: "M", grade: "Form 4", stream: "South", guardian: "Esther Kariuki", guardianPhone: "+254 700 777 888", feeBalance: 9200, attendance: 82, avgScore: 66, cbc: "ME", status: "active" },
  { id: "s17", admissionNo: "AHS-2025-0158", name: "Priscilla Naliaka", gender: "F", grade: "Form 4", stream: "South", guardian: "Benjamin Naliaka", guardianPhone: "+254 711 999 000", feeBalance: 0, attendance: 94, avgScore: 83, cbc: "EE", status: "active" },
  { id: "s18", admissionNo: "AHS-2025-0159", name: "John Mutiso", gender: "M", grade: "Grade 8", stream: "East", guardian: "Grace Mutiso", guardianPhone: "+254 722 111 222", feeBalance: 27500, attendance: 76, avgScore: 55, cbc: "AE", status: "active" },
  { id: "s19", admissionNo: "AHS-2025-0160", name: "Naomi Kosgei", gender: "F", grade: "Grade 8", stream: "East", guardian: "Michael Kosgei", guardianPhone: "+254 733 444 555", feeBalance: 0, attendance: 98, avgScore: 91, cbc: "EE", status: "active" },
  { id: "s20", admissionNo: "AHS-2025-0161", name: "Ian Kibet", gender: "M", grade: "Grade 8", stream: "West", guardian: "Joyce Kibet", guardianPhone: "+254 700 222 333", feeBalance: 13000, attendance: 87, avgScore: 70, cbc: "ME", status: "active" },
  { id: "s21", admissionNo: "AHS-2025-0162", name: "Brenda Nabwire", gender: "F", grade: "Grade 8", stream: "West", guardian: "Patrick Nabwire", guardianPhone: "+254 711 555 666", feeBalance: 0, attendance: 92, avgScore: 80, cbc: "ME", status: "active" },
  { id: "s22", admissionNo: "AHS-2025-0163", name: "Caleb Wafula", gender: "M", grade: "Grade 8", stream: "North", guardian: "Nancy Wafula", guardianPhone: "+254 722 777 888", feeBalance: 38000, attendance: 69, avgScore: 44, cbc: "BE", status: "active" },
  { id: "s23", admissionNo: "AHS-2025-0164", name: "Diana Atieno", gender: "F", grade: "Grade 9", stream: "North", guardian: "Charles Atieno", guardianPhone: "+254 733 000 111", feeBalance: 0, attendance: 95, avgScore: 87, cbc: "EE", status: "active" },
  { id: "s24", admissionNo: "AHS-2025-0165", name: "Emmanuel Asamba", gender: "M", grade: "Grade 9", stream: "North", guardian: "Florence Asamba", guardianPhone: "+254 700 444 555", feeBalance: 21000, attendance: 81, avgScore: 63, cbc: "ME", status: "active" },
];

export const staff = [
  { id: "u1", name: "Dr. Margaret Wanjiku", role: "Principal", email: "principal@alliance.ac.ke", phone: "+254 700 100 200", avatar: "MW" },
  { id: "u2", name: "Mr. John Kibicho", role: "Deputy Principal", email: "kibicho@alliance.ac.ke", phone: "+254 722 100 200", avatar: "JK" },
  { id: "u3", name: "Mrs. Grace Wambui", role: "Teacher · Mathematics", email: "grace@alliance.ac.ke", phone: "+254 733 100 200", avatar: "GW" },
  { id: "u4", name: "Mr. Peter Maina", role: "Teacher · Integrated Science", email: "maina@alliance.ac.ke", phone: "+254 700 200 300", avatar: "PM" },
  { id: "u5", name: "Ms. Susan Achieng", role: "Teacher · Kiswahili", email: "susan@alliance.ac.ke", phone: "+254 711 200 300", avatar: "SA" },
  { id: "u6", name: "Mr. David Kiprop", role: "Teacher · English", email: "kiprop@alliance.ac.ke", phone: "+254 722 300 400", avatar: "DK" },
  { id: "u7", name: "Mrs. Lucy Njoroge", role: "Finance Officer", email: "finance@alliance.ac.ke", phone: "+254 733 300 400", avatar: "LN" },
  { id: "u8", name: "Mr. Samuel Mutua", role: "Exam Officer", email: "exams@alliance.ac.ke", phone: "+254 700 400 500", avatar: "SM" },
];

export const classes = [
  { id: "c1", name: "Grade 7 East", grade: "Grade 7", stream: "East", teacher: "Mrs. Grace Wambui", students: 38, room: "Block A · Rm 12" },
  { id: "c2", name: "Grade 7 West", grade: "Grade 7", stream: "West", teacher: "Mr. Peter Maina", students: 36, room: "Block A · Rm 14" },
  { id: "c3", name: "Grade 8 East", grade: "Grade 8", stream: "East", teacher: "Ms. Susan Achieng", students: 40, room: "Block B · Rm 8" },
  { id: "c4", name: "Grade 8 West", grade: "Grade 8", stream: "West", teacher: "Mr. David Kiprop", students: 37, room: "Block B · Rm 10" },
  { id: "c5", name: "Grade 8 North", grade: "Grade 8", stream: "North", teacher: "Mrs. Grace Wambui", students: 35, room: "Block B · Rm 11" },
  { id: "c6", name: "Grade 9 East", grade: "Grade 9", stream: "East", teacher: "Mr. Peter Maina", students: 41, room: "Block C · Rm 5" },
  { id: "c7", name: "Grade 9 West", grade: "Grade 9", stream: "West", teacher: "Ms. Susan Achieng", students: 39, room: "Block C · Rm 7" },
  { id: "c8", name: "Grade 9 North", grade: "Grade 9", stream: "North", teacher: "Mr. David Kiprop", students: 38, room: "Block C · Rm 9" },
  { id: "c9", name: "Form 3 North", grade: "Form 3", stream: "North", teacher: "Mrs. Grace Wambui", students: 42, room: "Block D · Rm 3" },
  { id: "c10", name: "Form 3 South", grade: "Form 3", stream: "South", teacher: "Mr. Peter Maina", students: 40, room: "Block D · Rm 4" },
  { id: "c11", name: "Form 4 North", grade: "Form 4", stream: "North", teacher: "Mr. David Kiprop", students: 38, room: "Block D · Rm 5" },
  { id: "c12", name: "Form 4 South", grade: "Form 4", stream: "South", teacher: "Ms. Susan Achieng", students: 41, room: "Block D · Rm 6" },
];

export const subjects = [
  { id: "sub1", name: "Mathematics", code: "MATH", strands: 6, color: "emerald" },
  { id: "sub2", name: "English", code: "ENG", strands: 5, color: "teal" },
  { id: "sub3", name: "Kiswahili", code: "KIS", strands: 5, color: "amber" },
  { id: "sub4", name: "Integrated Science", code: "ISC", strands: 7, color: "rose" },
  { id: "sub5", name: "Social Studies", code: "SST", strands: 4, color: "violet" },
  { id: "sub6", name: "Pre-Technical Studies", code: "PTS", strands: 5, color: "cyan" },
  { id: "sub7", name: "Christian Religious Ed.", code: "CRE", strands: 4, color: "lime" },
  { id: "sub8", name: "Agriculture & Nutrition", code: "AGR", strands: 4, color: "orange" },
];

export interface Invoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  paid: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  items: { label: string; amount: number }[];
}

export const invoices: Invoice[] = [
  { id: "i1", invoiceNo: "INV-2025-0481", studentId: "s4", studentName: "Dennis Mwangi", className: "Grade 9 West", amount: 45000, paid: 11000, dueDate: "2025-05-30", status: "overdue", items: [{ label: "Tuition (Term 2)", amount: 32000 }, { label: "Boarding", amount: 9000 }, { label: "PTA Levy", amount: 2000 }, { label: "Transport", amount: 2000 }] },
  { id: "i2", invoiceNo: "INV-2025-0482", studentId: "s7", studentName: "Faith Awuor", className: "Form 3 North", amount: 45000, paid: 23000, dueDate: "2025-06-15", status: "pending", items: [{ label: "Tuition (Term 2)", amount: 32000 }, { label: "Boarding", amount: 9000 }, { label: "PTA Levy", amount: 2000 }, { label: "Transport", amount: 2000 }] },
  { id: "i3", invoiceNo: "INV-2025-0483", studentId: "s1", studentName: "Wanjiru Kamau", className: "Grade 9 East", amount: 45000, paid: 45000, dueDate: "2025-05-15", status: "paid", items: [{ label: "Tuition (Term 2)", amount: 32000 }, { label: "Boarding", amount: 9000 }, { label: "PTA Levy", amount: 2000 }, { label: "Transport", amount: 2000 }] },
  { id: "i4", invoiceNo: "INV-2025-0484", studentId: "s12", studentName: "Victor Maina", className: "Grade 7 West", amount: 45000, paid: 0, dueDate: "2025-05-30", status: "overdue", items: [{ label: "Tuition (Term 2)", amount: 32000 }, { label: "Boarding", amount: 9000 }, { label: "PTA Levy", amount: 2000 }, { label: "Transport", amount: 2000 }] },
  { id: "i5", invoiceNo: "INV-2025-0485", studentId: "s15", studentName: "Gloria Akinyi", className: "Form 4 North", amount: 48000, paid: 48000, dueDate: "2025-05-15", status: "paid", items: [{ label: "Tuition (Term 2 · KCSE)", amount: 34000 }, { label: "Boarding", amount: 10000 }, { label: "Exam Fee", amount: 4000 }] },
  { id: "i6", invoiceNo: "INV-2025-0486", studentId: "s18", studentName: "John Mutiso", className: "Grade 8 East", amount: 45000, paid: 17500, dueDate: "2025-06-15", status: "pending", items: [{ label: "Tuition (Term 2)", amount: 32000 }, { label: "Boarding", amount: 9000 }, { label: "PTA Levy", amount: 2000 }, { label: "Transport", amount: 2000 }] },
  { id: "i7", invoiceNo: "INV-2025-0487", studentId: "s22", studentName: "Caleb Wafula", className: "Grade 8 North", amount: 45000, paid: 7000, dueDate: "2025-05-30", status: "overdue", items: [{ label: "Tuition (Term 2)", amount: 32000 }, { label: "Boarding", amount: 9000 }, { label: "PTA Levy", amount: 2000 }, { label: "Transport", amount: 2000 }] },
  { id: "i8", invoiceNo: "INV-2025-0488", studentId: "s24", studentName: "Emmanuel Asamba", className: "Grade 9 North", amount: 45000, paid: 24000, dueDate: "2025-06-15", status: "pending", items: [{ label: "Tuition (Term 2)", amount: 32000 }, { label: "Boarding", amount: 9000 }, { label: "PTA Levy", amount: 2000 }, { label: "Transport", amount: 2000 }] },
  { id: "i9", invoiceNo: "INV-2025-0489", studentId: "s10", studentName: "Collins Kibe", className: "Grade 7 East", amount: 45000, paid: 30000, dueDate: "2025-06-15", status: "pending", items: [{ label: "Tuition (Term 2)", amount: 32000 }, { label: "Boarding", amount: 9000 }, { label: "PTA Levy", amount: 2000 }, { label: "Transport", amount: 2000 }] },
  { id: "i10", invoiceNo: "INV-2025-0490", studentId: "s14", studentName: "Felix Otieno", className: "Form 4 North", amount: 48000, paid: 30000, dueDate: "2025-06-15", status: "pending", items: [{ label: "Tuition (Term 2 · KCSE)", amount: 34000 }, { label: "Boarding", amount: 10000 }, { label: "Exam Fee", amount: 4000 }] },
];

export interface Payment {
  id: string;
  invoiceNo: string;
  studentName: string;
  method: "M-PESA" | "Airtel Money" | "Bank" | "Cash";
  amount: number;
  code: string;
  phone: string;
  timestamp: string;
}

export const payments: Payment[] = [
  { id: "p1", invoiceNo: "INV-2025-0483", studentName: "Wanjiru Kamau", method: "M-PESA", amount: 45000, code: "SI7K2P9XHM", phone: "+254 712 *** 678", timestamp: "2025-05-14T10:24:00" },
  { id: "p2", invoiceNo: "INV-2025-0485", studentName: "Gloria Akinyi", method: "M-PESA", amount: 48000, code: "SH3M8N2KPL", phone: "+254 733 *** 666", timestamp: "2025-05-13T16:08:00" },
  { id: "p3", invoiceNo: "INV-2025-0481", studentName: "Dennis Mwangi", method: "M-PESA", amount: 11000, code: "QW9R4T1YU", phone: "+254 700 *** 222", timestamp: "2025-05-12T09:11:00" },
  { id: "p4", invoiceNo: "INV-2025-0490", studentName: "Felix Otieno", method: "Bank", amount: 30000, code: "BNK-44782", phone: "—", timestamp: "2025-05-11T14:30:00" },
  { id: "p5", invoiceNo: "INV-2025-0489", studentName: "Collins Kibe", method: "M-PESA", amount: 30000, code: "PL2K8M3NQZ", phone: "+254 722 *** 555", timestamp: "2025-05-10T11:47:00" },
  { id: "p6", invoiceNo: "INV-2025-0488", studentName: "Emmanuel Asamba", method: "M-PESA", amount: 24000, code: "RT6Y2H7VB", phone: "+254 700 *** 555", timestamp: "2025-05-09T13:22:00" },
  { id: "p7", invoiceNo: "INV-2025-0487", studentName: "Caleb Wafula", method: "Cash", amount: 7000, code: "RCT-1129", phone: "—", timestamp: "2025-05-08T08:55:00" },
];

export const assessmentData = [
  { id: "a1", title: "Mathematics · Algebra CAT", subject: "Mathematics", className: "Grade 9 East", questions: 20, window: "Today · 09:00–10:00", duration: 60, attempts: 38, avgScore: 74, status: "Live" },
  { id: "a2", title: "Integrated Science · Cells Quiz", subject: "Integrated Science", className: "Grade 7 East", questions: 15, window: "Tomorrow · 08:00–08:30", duration: 30, attempts: 0, avgScore: 0, status: "Scheduled" },
  { id: "a3", title: "Kiswahili · Sarufi End Term", subject: "Kiswahili", className: "Grade 8 West", questions: 25, window: "12 Jun · 14:00–15:30", duration: 90, attempts: 0, avgScore: 0, status: "Scheduled" },
  { id: "a4", title: "English · Comprehension Test", subject: "English", className: "Form 3 North", questions: 18, window: "Yesterday · 11:00–12:00", duration: 60, attempts: 42, avgScore: 68, status: "Closed" },
  { id: "a5", title: "Social Studies · Map Reading", subject: "Social Studies", className: "Grade 9 West", questions: 12, window: "09 Jun · 10:00–10:45", duration: 45, attempts: 0, avgScore: 0, status: "Draft" },
];

export const questionBank = [
  { id: "q1", subject: "Mathematics", topic: "Linear Equations", type: "MCQ", difficulty: "Medium", stem: "Solve for x: 3x + 7 = 22" },
  { id: "q2", subject: "Mathematics", topic: "Algebra", type: "Short Answer", difficulty: "Easy", stem: "Expand and simplify: (x+2)(x-3)" },
  { id: "q3", subject: "Integrated Science", topic: "Cells", type: "True/False", difficulty: "Easy", stem: "The cell membrane controls what enters and leaves the cell." },
  { id: "q4", subject: "Integrated Science", topic: "Human Body", type: "MCQ", difficulty: "Medium", stem: "Which organ filters blood and produces urine?" },
  { id: "q5", subject: "English", topic: "Comprehension", type: "Essay", difficulty: "Hard", stem: "Discuss the theme of resilience in the set text." },
  { id: "q6", subject: "Kiswahili", topic: "Sarufi", type: "Fill in blank", difficulty: "Medium", stem: "Jaza nafasi: Mtoto ____ shulani." },
  { id: "q7", subject: "Social Studies", topic: "Map Reading", type: "MCQ", difficulty: "Medium", stem: "What does a blue line on a topographical map usually represent?" },
  { id: "q8", subject: "Mathematics", topic: "Geometry", type: "MCQ", difficulty: "Hard", stem: "Find the area of a circle with radius 7cm (π=22/7)." },
];

export const gradebookConfig = [
  { component: "CAT 1", weight: 15 },
  { component: "CAT 2", weight: 15 },
  { component: "Assignment", weight: 10 },
  { component: "Project", weight: 20 },
  { component: "End Term", weight: 40 },
];

export const gradebookRows = students.slice(0, 12).map((s, i) => ({
  student: s,
  scores: {
    "CAT 1": 60 + ((i * 7) % 35),
    "CAT 2": 55 + ((i * 11) % 40),
    Assignment: 65 + ((i * 5) % 30),
    Project: 58 + ((i * 9) % 38),
    "End Term": 52 + ((i * 13) % 45),
  },
}));

export const announcements = [
  { id: "an1", title: "Term 2 Mid-term Break Notice", audience: "All", author: "Dr. Margaret Wanjiku", date: "2025-06-02", views: 1187, body: "Mid-term break begins 20 June. Students resume 30 June. Buses depart at 4:00 PM." },
  { id: "an2", title: "PTA General Meeting", audience: "Parents", author: "Mr. John Kibicho", date: "2025-06-05", views: 642, body: "PTA general meeting on 14 June at 10:00 AM in the main hall." },
  { id: "an3", title: "Science Congress Practice", audience: "Grade 9", author: "Mr. Peter Maina", date: "2025-06-06", views: 318, body: "Science Congress practice every Tuesday & Thursday 4–5 PM in the lab." },
  { id: "an4", title: "Fees Payment Reminder", audience: "Parents", author: "Mrs. Lucy Njoroge", date: "2025-06-07", views: 804, body: "Kindly clear Term 2 fee balances by 15 June. Pay via M-PESA Paybill 247247." },
  { id: "an5", title: "Staff CPD Workshop", audience: "Staff", author: "Dr. Margaret Wanjiku", date: "2025-06-08", views: 96, body: "Competency-Based Assessment training on 18 June, 9 AM." },
];

export interface SmsLog {
  id: string;
  recipient: string;
  phone: string;
  type: "Absence Alert" | "Fee Reminder" | "Exam Notice" | "General";
  preview: string;
  status: "Delivered" | "Pending" | "Failed";
  cost: number;
  timestamp: string;
}

export const smsLog: SmsLog[] = [
  { id: "sms1", recipient: "Peter Kamau", phone: "+254 712 345 678", type: "Absence Alert", preview: "Dear parent, Wanjiru was absent today. Please contact the office.", status: "Delivered", cost: 1.0, timestamp: "2025-06-10T08:12:00" },
  { id: "sms2", recipient: "Jane Mwangi", phone: "+254 700 111 222", type: "Fee Reminder", preview: "Kindly clear the outstanding KES 34,000 by 15 June. Paybill 247247.", status: "Delivered", cost: 1.0, timestamp: "2025-06-10T09:30:00" },
  { id: "sms3", recipient: "Loise Maina", phone: "+254 700 888 999", type: "Fee Reminder", preview: "Outstanding KES 45,000. Avoid disruption of classes.", status: "Delivered", cost: 1.0, timestamp: "2025-06-10T09:31:00" },
  { id: "sms4", recipient: "Ann Kibe", phone: "+254 722 444 555", type: "Exam Notice", preview: "Math CAT tomorrow 9 AM. Bring geometry set.", status: "Delivered", cost: 1.0, timestamp: "2025-06-09T16:00:00" },
  { id: "sms5", recipient: "Esther Kariuki", phone: "+254 700 777 888", type: "Fee Reminder", preview: "Outstanding KES 9,200. Clear by 15 June.", status: "Pending", cost: 1.0, timestamp: "2025-06-10T09:32:00" },
  { id: "sms6", recipient: "Grace Otieno", phone: "+254 722 456 789", type: "General", preview: "PTA meeting 14 June 10 AM. Main hall.", status: "Delivered", cost: 1.0, timestamp: "2025-06-08T11:00:00" },
  { id: "sms7", recipient: "Nancy Wafula", phone: "+254 722 777 888", type: "Absence Alert", preview: "Caleb was absent today. Please contact class teacher.", status: "Failed", cost: 1.0, timestamp: "2025-06-10T08:14:00" },
];

export const enrollTrend = [
  { m: "Jan", students: 1180 },
  { m: "Feb", students: 1192 },
  { m: "Mar", students: 1205 },
  { m: "Apr", students: 1212 },
  { m: "May", students: 1228 },
  { m: "Jun", students: 1247 },
  { m: "Jul", students: 1251 },
  { m: "Aug", students: 1249 },
  { m: "Sep", students: 1262 },
  { m: "Oct", students: 1270 },
  { m: "Nov", students: 1268 },
  { m: "Dec", students: 1247 },
];

export const feeCollectionTrend = [
  { m: "Jan", billed: 6.2, collected: 4.1 },
  { m: "Feb", billed: 6.8, collected: 5.0 },
  { m: "Mar", billed: 7.1, collected: 6.2 },
  { m: "Apr", billed: 6.5, collected: 5.8 },
  { m: "May", billed: 9.4, collected: 7.6 },
  { m: "Jun", billed: 9.4, collected: 8.4 },
];

export const attendanceByGrade = [
  { grade: "Grade 7", rate: 93 },
  { grade: "Grade 8", rate: 90 },
  { grade: "Grade 9", rate: 95 },
  { grade: "Form 3", rate: 88 },
  { grade: "Form 4", rate: 96 },
];

export const performanceBySubject = [
  { subject: "Math", avg: 74 },
  { subject: "Eng", avg: 78 },
  { subject: "Kisw", avg: 81 },
  { subject: "Sci", avg: 70 },
  { subject: "SST", avg: 83 },
  { subject: "CRE", avg: 86 },
];

export const cbcDistribution = [
  { level: "EE", label: "Exceeding", value: 312, color: "var(--chart-1)" },
  { level: "ME", label: "Meeting", value: 598, color: "var(--chart-2)" },
  { level: "AE", label: "Approaching", value: 247, color: "var(--chart-3)" },
  { level: "BE", label: "Below", value: 90, color: "var(--chart-5)" },
];

export const recentActivity = [
  { id: "ra1", type: "payment", text: "Wanjiru Kamau paid KES 45,000 via M-PESA", time: "2 min ago", code: "SI7K2P9XHM" },
  { id: "ra2", type: "admission", text: "New admission: Emmanuel Asamba (Grade 9 North)", time: "18 min ago" },
  { id: "ra3", type: "attendance", text: "3 students absent in Grade 8 North — parents notified", time: "1 hr ago" },
  { id: "ra4", type: "payment", text: "Gloria Akinyi paid KES 48,000 via M-PESA", time: "2 hr ago", code: "SH3M8N2KPL" },
  { id: "ra5", type: "assessment", text: "Mathematics CAT published for Grade 9 East", time: "3 hr ago" },
  { id: "ra6", type: "alert", text: "Victor Maina suspended — pending disciplinary review", time: "5 hr ago" },
  { id: "ra7", type: "payment", text: "Collins Kibe paid KES 30,000 via M-PESA", time: "6 hr ago", code: "PL2K8M3NQZ" },
  { id: "ra8", type: "announcement", text: "PTA General Meeting announcement sent to 642 parents", time: "8 hr ago" },
];

export const pendingApprovals = [
  { id: "pa1", type: "Fee Refund", text: "Refund KES 5,000 to Wanjiru Kamau (double payment)", requester: "Mrs. Lucy Njoroge", amount: 5000 },
  { id: "pa2", type: "Fee Refund", text: "Refund KES 2,400 to Felix Otieno (overpayment)", requester: "Mrs. Lucy Njoroge", amount: 2400 },
  { id: "pa3", type: "Promotion", text: "Promote 2 students from BE to AE after re-sit", requester: "Mr. Samuel Mutua", amount: 0 },
];

export const timetableSnapshot = [
  { period: "08:00–08:40", subject: "Mathematics", room: "C5", teacher: "Mrs. Wambui" },
  { period: "08:40–09:20", subject: "English", room: "C5", teacher: "Mr. Kiprop" },
  { period: "09:20–10:00", subject: "Kiswahili", room: "C5", teacher: "Ms. Achieng" },
  { period: "10:20–11:00", subject: "Break", room: "—", teacher: "—" },
  { period: "11:00–11:40", subject: "Integrated Science", room: "C5", teacher: "Mr. Maina" },
  { period: "11:40–12:20", subject: "Social Studies", room: "C5", teacher: "Mr. Maina" },
];

export const classroomSessions = [
  { id: "cs1", class: "Grade 9 East", subject: "Mathematics", teacher: "Mrs. Grace Wambui", time: "Today · 14:00–15:00", status: "live", participants: 38, recording: false },
  { id: "cs2", class: "Form 4 North", subject: "English", teacher: "Mr. David Kiprop", time: "Today · 15:30–16:30", status: "upcoming", participants: 0, recording: false },
  { id: "cs3", class: "Grade 7 East", subject: "Integrated Science", teacher: "Mr. Peter Maina", time: "Today · 16:00–17:00", status: "upcoming", participants: 0, recording: false },
  { id: "cs4", class: "Grade 8 West", subject: "Kiswahili", teacher: "Ms. Susan Achieng", time: "Yesterday · 14:00–15:00", status: "past", participants: 36, recording: true, duration: "58 min" },
  { id: "cs5", class: "Form 3 South", subject: "Mathematics", teacher: "Mrs. Grace Wambui", time: "Yesterday · 11:00–12:00", status: "past", participants: 40, recording: true, duration: "61 min" },
];

export const chatMessages = [
  { id: "cm1", from: "Mrs. Wambui", role: "teacher", text: "Good afternoon class. Today we cover linear equations.", time: "14:01" },
  { id: "cm2", from: "Brian Otieno", role: "student", text: "Good afternoon teacher!", time: "14:02" },
  { id: "cm3", from: "Achieng Wanjala", role: "student", text: "Teacher, can you repeat the last example?", time: "14:08" },
  { id: "cm4", from: "Mrs. Wambui", role: "teacher", text: "Sure — sharing the whiteboard again now.", time: "14:09" },
  { id: "cm5", from: "Wanjiru Kamau", role: "student", text: "Thank you, understood.", time: "14:11" },
];

export const roles_permissions = [
  { role: "Institution Admin", perms: { "students:read": true, "students:write": true, "grades:write": true, "fees:refund": true, "exams:publish": true, "classes:host": true } },
  { role: "Teacher", perms: { "students:read": true, "students:write": false, "grades:write": true, "fees:refund": false, "exams:publish": true, "classes:host": true } },
  { role: "Finance Officer", perms: { "students:read": true, "students:write": false, "grades:write": false, "fees:refund": true, "exams:publish": false, "classes:host": false } },
  { role: "Parent", perms: { "students:read": true, "students:write": false, "grades:write": false, "fees:refund": false, "exams:publish": false, "classes:host": false } },
  { role: "Student", perms: { "students:read": false, "students:write": false, "grades:write": false, "fees:refund": false, "exams:publish": false, "classes:host": false } },
];

export const integrations = [
  { id: "int1", name: "M-PESA Daraja", category: "Payments", status: "connected", detail: "Paybill 247247 · STK Push + C2B", lastSync: "2 min ago" },
  { id: "int2", name: "Africa's Talking", category: "SMS", status: "connected", detail: "Sender ID: ALLIANCE", lastSync: "5 min ago" },
  { id: "int3", name: "Flutterwave", category: "Payments", status: "disconnected", detail: "Cards & bank transfers", lastSync: "—" },
  { id: "int4", name: "SendGrid", category: "Email", status: "connected", detail: "Transactional email", lastSync: "12 min ago" },
  { id: "int5", name: "Google Workspace SSO", category: "Auth", status: "disconnected", detail: "OIDC · for university tier", lastSync: "—" },
  { id: "int6", name: "Jitsi Meet", category: "Video", status: "connected", detail: "Self-hosted classroom", lastSync: "1 hr ago" },
];

// Dashboard KPIs derived for each role
export function kpisForRole(role: Role) {
  switch (role) {
    case "teacher":
      return [
        { label: "My Classes", value: "5", sub: "32 students total", icon: "book", trend: "+2 this term", tone: "emerald" },
        { label: "Today's Lessons", value: "4", sub: "Next: Maths 9 East", icon: "clock", trend: "Maths · 14:00", tone: "amber" },
        { label: "Pending Grading", value: "18", sub: "Maths CAT submissions", icon: "clipboard", trend: "Due tomorrow", tone: "rose" },
        { label: "Class Avg", value: "74%", sub: "Grade 9 East · Maths", icon: "trending", trend: "+3 vs last CAT", tone: "emerald" },
      ];
    case "finance":
      return [
        { label: "Collected (Term 2)", value: "KES 8.4M", sub: "78% of billed", icon: "wallet", trend: "+12% vs T1", tone: "emerald" },
        { label: "Outstanding", value: "KES 2.4M", sub: "327 students", icon: "alert", trend: "−4% week", tone: "amber" },
        { label: "Overdue (90+)", value: "KES 890K", sub: "84 students", icon: "clock", trend: "+1.2% week", tone: "rose" },
        { label: "Refunds Pending", value: "2", sub: "KES 7,400 total", icon: "rotate", trend: "Awaiting approval", tone: "amber" },
      ];
    case "parent":
      return [
        { label: "Children", value: "2", sub: "Wanjiru · Grade 9, Brian · Grade 8", icon: "users", trend: "Both active", tone: "emerald" },
        { label: "Fee Balance", value: "KES 12,500", sub: "Brian Otieno · Grade 9 East", icon: "wallet", trend: "Due 15 Jun", tone: "amber" },
        { label: "Wanjiru Avg", value: "88%", sub: "Exceeding Expectation", icon: "trending", trend: "+4 vs last term", tone: "emerald" },
        { label: "Brian Attendance", value: "91%", sub: "Grade 9 East", icon: "check", trend: "1 absence this week", tone: "emerald" },
      ];
    case "student":
      return [
        { label: "My Avg", value: "88%", sub: "Exceeding Expectation", icon: "trending", trend: "Rank #3 · Grade 9 East", tone: "emerald" },
        { label: "Attendance", value: "96%", sub: "2 absences this term", icon: "check", trend: "Above 94% target", tone: "emerald" },
        { label: "Upcoming Test", value: "Today 9:00", sub: "Maths · Algebra CAT", icon: "clipboard", trend: "60 min · 20 Qs", tone: "amber" },
        { label: "Fee Balance", value: "KES 0", sub: "All clear · Term 2", icon: "wallet", trend: "Paid 14 May", tone: "emerald" },
      ];
    default: // admin
      return [
        { label: "Total Students", value: "1,247", sub: "Capacity 2,000 · 62%", icon: "users", trend: "+4.2% vs T1", tone: "emerald" },
        { label: "Attendance Rate", value: "94.6%", sub: "Today · all classes", icon: "check", trend: "+1.1% week", tone: "emerald" },
        { label: "Fees Collected (T2)", value: "KES 8.4M", sub: "78% of KES 10.8M billed", icon: "wallet", trend: "+12% vs T1", tone: "amber" },
        { label: "Active Classes", value: "32", sub: "96 staff · 8 departments", icon: "book", trend: "Grade 9 added", tone: "emerald" },
      ];
  }
}

export const currentUser = {
  name: "Dr. Margaret Wanjiku",
  role: "Institution Admin",
  email: "principal@alliance.ac.ke",
  avatar: "MW",
};

// EAT date helper — returns a formatted DD/MM/YYYY HH:mm string
export function fmtEAT(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-KE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Nairobi",
    });
  } catch {
    return iso;
  }
}

export function fmtDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Africa/Nairobi",
    });
  } catch {
    return iso;
  }
}
