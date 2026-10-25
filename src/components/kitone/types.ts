// Shared types for Kitone shell + modules — kept separate to avoid circular imports.

export interface ActionSignal {
  id: string;
  ts: number;
}

export type KitoneView =
  | "dashboard"
  | "students"
  | "attendance"
  | "gradebook"
  | "fees"
  | "assessments"
  | "classrooms"
  | "analytics"
  | "communications"
  | "settings";

export const viewMeta: Record<
  KitoneView,
  { title: string; description: string; group: string }
> = {
  dashboard: {
    title: "Dashboard",
    description: "Institution overview · real-time pulse",
    group: "Academic",
  },
  students: {
    title: "Students",
    description: "Student Information System (SIS)",
    group: "Academic",
  },
  attendance: {
    title: "Attendance",
    description: "Roll-call · absentee alerts",
    group: "Academic",
  },
  gradebook: {
    title: "Gradebook",
    description: "CBC-aligned scores & report cards",
    group: "Academic",
  },
  assessments: {
    title: "Assessments",
    description: "Question bank · live online tests",
    group: "Academic",
  },
  classrooms: {
    title: "Online Classrooms",
    description: "Live sessions & recordings",
    group: "Engagement",
  },
  communications: {
    title: "Communications",
    description: "Announcements · SMS · email",
    group: "Engagement",
  },
  analytics: {
    title: "Analytics & Reports",
    description: "Trends, funnels, role-based reports",
    group: "Engagement",
  },
  fees: {
    title: "Fees & Payments",
    description: "Invoices · M-PESA · reconciliation",
    group: "Finance",
  },
  settings: {
    title: "Settings",
    description: "Institution · roles · integrations · billing",
    group: "System",
  },
};

export const navGroups: { label: string; items: KitoneView[] }[] = [
  { label: "Academic",   items: ["dashboard", "students", "attendance", "gradebook", "assessments"] },
  { label: "Engagement", items: ["classrooms", "communications", "analytics"] },
  { label: "Finance",    items: ["fees"] },
  { label: "System",     items: ["settings"] },
];
