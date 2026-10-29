// Kitone Edu — static app-level data only (roles, current demo user, permission matrix).
// Institution-specific data lives in the InstitutionProvider store.

export type Role = 'admin' | 'teacher' | 'parent' | 'student' | 'finance';

export interface RoleInfo {
  id: Role;
  label: string;
  swahili: string;
}

export const roles: RoleInfo[] = [
  { id: 'admin', label: 'Institution Admin', swahili: 'Msimamizi' },
  { id: 'teacher', label: 'Teacher', swahili: 'Mwalimu' },
  { id: 'finance', label: 'Finance Officer', swahili: 'Afisa Fedha' },
  { id: 'parent', label: 'Parent / Guardian', swahili: 'Mzazi' },
  { id: 'student', label: 'Student', swahili: 'Mwanafunzi' },
];

export const currentUser = {
  name: 'Institution Admin',
  email: 'admin@kitone.edu',
  avatar: 'IA',
};

export const roles_permissions = [
  { role: 'Institution Admin', perms: { 'students:read': true, 'students:write': true, 'grades:write': true, 'fees:refund': true, 'exams:publish': true, 'classes:host': true } },
  { role: 'Teacher', perms: { 'students:read': true, 'students:write': false, 'grades:write': true, 'fees:refund': false, 'exams:publish': true, 'classes:host': true } },
  { role: 'Finance Officer', perms: { 'students:read': true, 'students:write': false, 'grades:write': false, 'fees:refund': true, 'exams:publish': false, 'classes:host': false } },
  { role: 'Parent', perms: { 'students:read': true, 'students:write': false, 'grades:write': false, 'fees:refund': false, 'exams:publish': false, 'classes:host': false } },
  { role: 'Student', perms: { 'students:read': false, 'students:write': false, 'grades:write': false, 'fees:refund': false, 'exams:publish': false, 'classes:host': false } },
];

export const integrations = [
  { id: 'int1', name: 'M-PESA Daraja', category: 'Payments', status: 'connected' as const, detail: 'Paybill 247247 · STK Push + C2B', lastSync: '2 min ago' },
  { id: 'int2', name: "Africa's Talking", category: 'SMS', status: 'connected' as const, detail: 'Sender ID: SCHOOL', lastSync: '5 min ago' },
  { id: 'int3', name: 'Flutterwave', category: 'Payments', status: 'disconnected' as const, detail: 'Cards & bank transfers', lastSync: '—' },
  { id: 'int4', name: 'SendGrid', category: 'Email', status: 'connected' as const, detail: 'Transactional email', lastSync: '12 min ago' },
  { id: 'int5', name: 'Google Workspace SSO', category: 'Auth', status: 'disconnected' as const, detail: 'OIDC · for university tier', lastSync: '—' },
  { id: 'int6', name: 'Jitsi Meet', category: 'Video', status: 'connected' as const, detail: 'Self-hosted classroom', lastSync: '1 hr ago' },
];