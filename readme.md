Kitone Edu 🎓
One platform, every school type. From PP1 to University.
A multi-tenant learning management & school administration platform purpose-built for the Kenyan education system — supporting CBC, 8-4-4, TVET, and University curricula.

<p align="left">
<img src="https://img.shields.io/badge/Kitone-Edu-10B981?style=for-the-badge&logo=graduationcap&logoColor=white" />
<img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
<img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" />
<img src="https://img.shields.io/badge/license-MIT-22C55E?style=for-the-badge" />
</p>

Built for Kenya: KES billing, M-Pesa STK Push, Africa's Talking SMS, EAT timezone, +254 validation, Swahili UX, and DPA 2019 compliance.

📑 Table of Contents
Why Kitone Edu?
✨ Features
🏗️ Architecture
🧰 Tech Stack
🚀 Quick Start
🔧 Environment Variables
📂 Project Structure
🗄️ Database Schema
🔌 Real-Time Classroom
💳 Fees & M-Pesa Flow
🔐 Roles & Security
🎨 Customization
🛠 Scripts
🚢 Deployment
📋 Roadmap
🤝 Contributing
🐛 Troubleshooting
🌍 Why Kitone Edu?
Most school systems in Kenya are fragmented — Excel for grades, M-Pesa for fees, WhatsApp for comms. Kitone unifies everything.

Key Differentiators:

Curriculum-aware from day one: Onboarding adapts if you're a CBC Primary, JSS, Senior Secondary, TVET college, or University.
Offline-first attendance: Teachers can mark attendance on low-end devices in rural areas; it syncs when back online.
Kenyan payments native: Not an afterthought. Invoices, aging reports, and STK Push are core.
Multi-tenant by design: One codebase can serve 100 schools with complete data isolation via institutionId.
Role-aware everything: A finance officer, a PP1 teacher, and a parent see completely different dashboards.
✨ Features
1. Core Academic
Module	What it does
Onboarding Wizard	6-step flow: Institution → Classes/Streams → Staff → Subjects → Fee Structure → Review. Type-aware suggestions (e.g., TVET shows modules, University shows faculties).
SIS - Students	Admission, search/filter by class/gender/status, profile drawer with CBC competency levels (EE/ME/AE/BE), restricted medical notes (ABAC).
Attendance	Mobile-first grid. Cycle: Present → Late → Absent. Bulk actions, chronically absent auto-flagging (>10% absenteeism), offline queue.
Gradebook	Spreadsheet-like editable grid, weighted CATs/Exams, auto-mean, CBC performance levels, class ranks, termly reports export.
Assessments	Question bank (MCQ, Short, Essay), online player with timer, question navigator, anti-cheat: tab-switch detection, fullscreen lockdown, copy-paste block.
Online Classrooms	Live sessions (Socket.IO). Features: chat, presence, hand-raise, shared whiteboard, mic/cam toggles, host recording, auto-host reassignment.
2. Finance & Ops
Module	What it does
Fees & Invoices	Per-grade fee structures (JSON), auto-invoicing, status tracking (Paid/Pending/Overdue/Partial), aging report.
M-Pesa Integration	3-step UX: Confirm Phone → STK Push Pending (simulated 3s delay) → Success with Daraja confirmation code. Auto-reconciliation to invoice.
Analytics	Role-aware dashboards: Attendance heatmaps, CBC distribution, Grade distribution, Revenue vs Arrears, Export to PDF/Excel via Recharts.
Communications	Announcements (targeted by role/class), Parent↔Teacher inbox, SMS log ready for Africa's Talking API.
3. Cross-cutting Experience
Command Palette (⌘K / Ctrl+K): Fuzzy-search navigation, switch roles, cycle themes.
Appearance Engine: Light/Dark/System + 8 accent colors (Emerald default), radius & font-size sliders, live preview, persisted in localStorage.
Responsive Shell: Collapsible sidebar (desktop) + gesture drawer (mobile), topbar with breadcrumbs.
DPA 2019 Compliant: Field-level restrictions, audit trails, encrypted messaging at-rest.
🏗️ Architecture
High-Level Data Flow
flowchart TD
    A[User: Onboarding Wizard] --> B[syncToServer() POST /api/onboarding]
    B --> C[Prisma ORM]
    C --> D[(MySQL 8.0: kitone_edu)]
    D --> E[setupComplete = true]
    E --> F[Celebration Screen]
    F --> G[Dashboard - Role Aware]
    G --> H{Next Visit}
    H -->|GET /api/onboarding| D
    H -->|Instant Render| I[localStorage Cache]
    J[Classroom Service :3003] <-->|Socket.IO Room: kitone-{sessionId}| G
Caching Strategy: React Context InstitutionStore writes to MySQL and localStorage. UI hydrates instantly from cache while revalidating from MySQL in background — critical for slow connections.

Service Map
Main App (Next.js 16, App Router, Turbopack): Port 3000. All business logic, API routes, UI.
Classroom Service (Mini-service): Port 3003. Pure Socket.IO server. No DB access, ephemeral room state.
Gateway: Caddy/Nginx forwards via XTransformPort query for WS upgrades.
🧰 Tech Stack
Layer	Technology	Reason
Framework	Next.js 16 (App Router)	RSC, Turbopack, API routes
Language	TypeScript 5 (strict)	Type safety for fees/grades
Styling	Tailwind CSS 4 + shadcn/ui (New York)	Rapid, accessible UI
DB	MySQL 8.0 + Prisma ORM	Reliable, cheap hosting in KE
Real-time	Socket.IO 4 + Node	Room isolation, presence
Charts	Recharts	Dashboard analytics
State	React Context + localStorage	Offline-first cache
Icons	Lucide React	Consistent iconography
Validation	Zod	Phone, KES, CBC level validation
🚀 Quick Start
Prerequisites
Node.js 20+ (Node 18 works, 20+ recommended for Turbopack)
Bun 1.1+ or npm 10+
MySQL 8.0+ (or PlanetScale / Railway MySQL)
Git
1. Clone & Install
git clone https://github.com/your-org/kitone-edu.git
cd kitone-edu
bun install
# or: npm install
2. Setup Database
Create DB:

CREATE DATABASE kitone_edu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
3. Configure Env
Create .env at root (see full list below):

DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/kitone_edu"
NEXT_PUBLIC_CLASSROOM_WS_URL="http://localhost:3003"
CLASSROOM_SERVICE_PORT=3003
4. Prisma Setup
bun run db:generate
bun run db:push
# For production migrations:
# bun run db:migrate
5. Install Classroom Service
cd mini-services/classroom-service
bun install
cd ../..
6. Run (2 terminals)
# Terminal 1 - Realtime Service
cd mini-services/classroom-service
bun run dev
# Terminal 2 - Main App
bun run dev
Open http://localhost:3000 → Onboarding Wizard will appear on first run.

Docker Alternative (coming soon): docker-compose up will spin up MySQL + App + Classroom Service.

🔧 Environment Variables
Create .env and .env.local:

Variable	Required	Example	Description
DATABASE_URL	✅	mysql://root:pass@localhost:3306/kitone_edu	Prisma connection string
NEXT_PUBLIC_CLASSROOM_WS_URL	✅	http://localhost:3003	WS endpoint for client
CLASSROOM_SERVICE_PORT	❌	3003	Socket.IO port
MPESA_CONSUMER_KEY	🔜	...	Daraja API (for real STK)
MPESA_CONSUMER_SECRET	🔜	...	Daraja API
MPESA_SHORTCODE	🔜	174379	Paybill/Till
AFRICASTALKING_API_KEY	🔜	...	SMS integration
AFRICASTALKING_USERNAME	🔜	...	SMS integration
📂 Project Structure
kitone-edu/
├── prisma/
│   ├── schema.prisma              # 11 models, composite indexes, cascade deletes
│   └── seed.ts                    # (planned) CBC subjects & fee templates
├── mini-services/
│   └── classroom-service/
│       ├── index.ts               # Socket.IO server, room mgmt, host logic
│       └── package.json
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── onboarding/route.ts      # Institution upsert + bootstrap
│   │   │   ├── students/route.ts        # (planned) CRUD
│   │   │   └── mpesa/callback/route.ts  # (planned) Daraja C2B callback
│   │   ├── globals.css            # Emerald theme, scrollbar, CSS vars
│   │   ├── layout.tsx             # Theme no-flash script, metadata
│   │   └── page.tsx               # App entry: loading → onboarding → dashboard
│   ├── components/
│   │   ├── kitone/
│   │   │   ├── onboarding/onboarding-wizard.tsx
│   │   │   ├── modules/           # 9 core modules
│   │   │   │   ├── dashboard.tsx
│   │   │   │   ├── students.tsx
│   │   │   │   ├── attendance.tsx
│   │   │   │   ├── gradebook.tsx
│   │   │   │   ├── fees.tsx
│   │   │   │   ├── assessments.tsx
│   │   │   │   ├── classrooms.tsx
│   │   │   │   ├── analytics.tsx
│   │   │   │   ├── communications.tsx
│   │   │   │   └── settings.tsx
│   │   │   ├── institution-store.tsx    # Global context + MySQL sync
│   │   │   ├── theme-provider.tsx
│   │   │   ├── shell.tsx                # App shell orchestrator
│   │   │   ├── sidebar.tsx              # Nav + ViewId enum
│   │   │   ├── topbar.tsx
│   │   │   └── command-palette.tsx
│   │   └── ui/                    # shadcn/ui primitives
│   ├── lib/
│   │   ├── db.ts                  # Prisma singleton
│   │   └── utils.ts               # cn(), KES formatter, phone validator
│   └── hooks/
│       └── use-toast.ts
└── package.json
To add a new module:

Create src/components/kitone/modules/your-module.tsx
Add ViewId in sidebar.tsx + nav item
Register in shell.tsx view switch + viewMeta for title/breadcrumbs
🗄️ Database Schema
11 models, all tenant-isolated with institutionId + composite index @@index([institutionId, ...]).

erDiagram
    Institution ||--o{ Class : has
    Institution ||--o{ Staff : has
    Institution ||--o{ Subject : has
    Institution ||--o{ Student : has
    Institution ||--o{ Invoice : has
    Institution ||--o{ ClassroomSession : has
    Class ||--o{ Student : contains
    Student ||--o{ Invoice : billed
    Invoice ||--o{ Payment : paid_by
    FeeStructure ||--o{ Invoice : generates
Model	Purpose	Key Fields
Institution	Tenant root	name, type (CBC/8-4-4/TVET/University), curriculum, term, logo
Class	Grade + Stream	grade, stream, room, classTeacherId
Staff	HR	role, TSC No., phone (+254), subjects
Subject	Curriculum	code, CBC strand, category
Student	SIS	admissionNo, UPI, guardian, CBC level, medical (restricted)
FeeStructure	Template	gradeId, items JSON [{name, amount}]
Invoice	Billing	studentId, total, status, dueDate
Payment	Receipts	invoiceId, method (M-Pesa/Bank/Cash), confirmationCode
ClassroomSession	Live class	subjectId, status (scheduled/live/ended), hostId
Announcement	Comms	audience (role/class), body, priority
Assessment	Tests	questions JSON, anti-cheat config, duration
🔌 Real-Time Classroom
Stack: Socket.IO mini-service on :3003, room-based isolation.

Room ID: kitone-{sessionId}

Events:

join-room / leave-room / presence:update
chat:message (system + user)
media:toggle (mic/cam)
hand:raise / hand:lower
whiteboard:stroke (canvas paths synced)
host:recording:toggle, host:clear-board
host:reassign on disconnect
Empty room auto-cleanup after 60s
Caddy/Prod Note: Forward WS via ?XTransformPort=3003 query param to avoid CORS in proxied envs.

💳 Fees & M-Pesa Flow
Current implementation is simulated STK to allow testing without Daraja creds. Real integration is roadmap.

Test Flow:

Fees & Payments → New Invoice or select Pending/Overdue
Click Pay → M-Pesa modal
Enter +254 phone → Send STK Push
~3s delay → Success + auto-generated confirmation code (e.g., QJ...)
Payment row inserted in MySQL → appears in Recent Payments, invoice status → Paid
For Real Daraja:

Implement POST /api/mpesa/stkpush using Consumer Key/Secret
Handle POST /api/mpesa/callback for C2B confirmation
Store CheckoutRequestID in Payment model for reconciliation
🔐 Roles & Security
RBAC + ABAC Matrix
Permission	Admin	Teacher	Finance	Parent	Student
Manage Institution	✅	❌	❌	❌	❌
Admit/Edit Students	✅	✅	❌	❌	❌
View Medical Notes	✅	Restricted	❌	Own child	❌
Mark Attendance	✅	✅	❌	❌	❌
Edit Gradebook	✅	Own subjects	❌	❌	❌
Create Invoices	✅	❌	✅	❌	❌
Record Payments	✅	❌	✅	❌	❌
View Analytics (Finance)	✅	❌	✅	❌	❌
Join Live Class	✅	✅	❌	👀	✅
Multi-tenant: Every query scoped by institutionId. Middleware planned for subdomain routing.
DPA 2019: Restricted fields (medical, guardian ID) flagged in Prisma, audit logs planned.
Auth Roadmap: NextAuth.js + MFA for admin/finance, phone OTP for parents.
🎨 Customization
Theme Toggle: Topbar sun/moon → Light / Dark / System (no-flash script in layout.tsx prevents FOUC).

Appearance Settings (Settings → Appearance):

8 accent colors (Emerald, Blue, Violet, Rose, etc.)
Border-radius slider (0 - 1rem)
Font-size slider
Live preview panel + Reset to default
Persisted in localStorage + CSS vars
Institution Settings (Settings → Institution):

Edit name, motto, logo, term/semester, contact
Danger Zone: Reset & Re-run Setup → wipes MySQL tenant data + clears localStorage
🛠 Scripts
bun run dev          # Next.js dev with Turbopack (port 3000)
bun run build        # Production build
bun run start        # Start production
bun run lint         # ESLint + TypeScript check
bun run db:generate  # prisma generate
bun run db:push      # Push schema to DB (dev)
bun run db:migrate   # Create migration (prod)
bun run db:reset     # prisma migrate reset + seed (if seed exists)
bun run db:studio    # Open Prisma Studio
# Classroom Service
cd mini-services/classroom-service
bun run dev          # Socket.IO on 3003 with watch
bun run start        # Production
🚢 Deployment
Vercel + PlanetScale/Railway (Recommended)
Push to GitHub
Vercel → Import → Set DATABASE_URL
Set NEXT_PUBLIC_CLASSROOM_WS_URL to your WS service URL
Deploy Classroom Service separately (Railway/Fly.io) — ensure WS enabled
Run prisma migrate deploy in build step
Self-Hosted (VPS)
# Install Caddy for reverse proxy
# Caddyfile snippet:
:3000 {
  reverse_proxy localhost:3000
}
:3003 {
  reverse_proxy localhost:3003
}
Env for prod: Add MPESA_* and AFRICASTALKING_* secrets via Vercel env or .env.production.

📋 Roadmap
v0.2 - Payments & Comms (Next)
 Real M-Pesa Daraja STK Push + C2B callback verification
 Africa's Talking SMS bulk announcements
 PDF Report Cards & Fee Receipts
v0.3 - Auth & Multi-tenancy
 NextAuth.js (Credentials + Phone OTP)
 MFA for admin/finance
 Subdomain routing (school.kitone.co.ke)
 Role-based route guards
v0.4 - Scale
 CSV/Excel student bulk import
 WebRTC video (peer-to-peer) in classrooms
 Offline-first PWA (service worker)
 Kiswahili full localization
v1.0 - GA
 KNEC/KICD report formats
 Audit logs & DPA export
 Mobile app (Capacitor wrapper)
🤝 Contributing
We love contributions from Kenyan devs & educators!

Fork → Create branch feat/your-feature
Follow Conventional Commits (feat:, fix:, docs:)
Run bun run lint before PR
PR description should include: problem, solution, screenshots for UI changes
For major features, open an Issue first
See CONTRIBUTING.md (planned) for CBC data conventions.

🐛 Troubleshooting
Issue	Fix
Can't reach database server	brew services start mysql or sudo service mysql start, check port 3306
Access denied for user	Verify .env DATABASE_URL user/password
Unknown database 'kitone_edu'	Run CREATE DATABASE kitone_edu...
Socket.IO xhr poll error	Ensure classroom-service is running on 3003 + NEXT_PUBLIC_CLASSROOM_WS_URL matches
Blank page after onboarding	Open DevTools → Application → Clear localStorage → Reload. Check MySQL reachable
Cannot find module 'socket.io-client'	bun add socket.io-client in root
ESLint set-state-in-effect	Add to eslint.config.mjs: { rules: { "react-hooks/set-state-in-effect": "off" } } — needed for Socket.IO, matchMedia, Embla
Prisma P1001	MySQL not running or firewall blocking 3306
📄 License
MIT — Built with ❤ for Kenyan education. See LICENSE.

🙏 Acknowledgements
Next.js, Prisma, Socket.IO
shadcn/ui — beautiful, accessible components
Recharts, Lucide, Tailwind CSS
Kenyan teachers who gave feedback on CBC grading flows
<p align="center">
<b>Kitone Edu</b> — <i>One platform, every school type.</i> 🇰🇪<br/>
<sub>• Built for Africa</sub>
</p># kitone_edu
