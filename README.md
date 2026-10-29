<div align="center">

# Kitone Edu 🎓
### One Platform, Every School Type

**A multi-tenant learning platform built for Kenya — from PP1/PP2 through Primary, JSS, Senior Secondary, TVET, and University.**

<br/>

[Kitone](https://img.shields.io/badge/Kitone-Edu-10B981?style=for-the-badge&logo=graduationcap&logoColor=white)
[Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
[TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
[MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
[Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
[License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)

<br/>

**Built for Kenya:** KES billing • M-Pesa STK Push • Africa's Talking SMS • EAT timezone • +254 validation • CBC curriculum • DPA 2019

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Database](#-database-schema) • [Roadmap](#-roadmap)

</div>

---

## 📑 Table of Contents

- [Why Kitone Edu?](#-why-kitone-edu)
- [✨ Features](#-features)
- [🏗 Tech Stack](#-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [🔧 Environment Variables](#-environment-variables)
- [📂 Project Structure](#-project-structure)
- [🗄 Database Schema](#-database-schema)
- [🔄 Data Flow](#-data-flow)
- [🎨 Customization](#-customization)
- [🔌 Real-Time Classroom](#-real-time-classroom)
- [💳 Testing M-Pesa Flow](#-testing-the-m-pesa-flow)
- [🛠 Scripts](#-scripts)
- [🐛 Troubleshooting](#-troubleshooting)
- [📋 Roadmap](#-roadmap)

---

## 🌍 Why Kitone Edu?

Most Kenyan schools juggle Excel for grades, M-Pesa for fees, and WhatsApp for communication. Kitone unifies everything into one fast, offline-ready platform.

| Principle              | How We Implement It                                                    |
| :--------------------- | :--------------------------------------------------------------------- |
| **Curriculum Aware**   | Onboarding adapts: CBC Primary, JSS, Senior Secondary, TVET, University |
| **Offline First**      | Attendance queue syncs when back online, localStorage instant render    |
| **Kenyan Payments**    | Invoices, aging report, and STK Push are core, not plugins              |
| **Multi-Tenant**       | Every query scoped by `institutionId` for 100% data isolation          |
| **Role Aware**         | Admin, Teacher, Finance, Parent, Student see different dashboards       |

---

## ✨ Features

### Core Modules

| Module                  | Description                                                                                                  |
| :---------------------- | :----------------------------------------------------------------------------------------------------------- |
| **Onboarding Wizard**   | 6-step flow: Institution → Classes → Staff → Subjects → Fees → Review with type-aware suggestions             |
| **Dashboard**           | Role-aware KPIs, overview charts (Recharts), recent activity, quick actions                                 |
| **Students (SIS)**      | Admit, search, filter by class/gender/status, profile drawer with CBC levels EE/ME/AE/BE, restricted medical |
| **Attendance**          | Mobile-first roll-call grid: Present → Late → Absent, bulk actions, chronic absenteeism alerts, offline-ready |
| **Gradebook**           | Editable spreadsheet, weight-based aggregation, CBC performance levels, auto-ranks, termly export           |
| **Fees & Payments**     | Invoices, aging report, M-PESA STK Push 3-step (confirm → pending → success), auto-reconciliation           |
| **Assessments**         | Question bank (MCQ/Short/Essay), timed player, navigator, anti-cheat: lockdown, tab-switch, copy-paste block |
| **Online Classrooms**   | Real-time via Socket.IO: chat, presence, hand-raise, whiteboard, mic/cam toggle, host recording              |
| **Analytics**           | CBC distribution, grade distribution, finance summary, exportable PDF/Excel                                 |
| **Communications**      | Announcements (targeted), Parent↔Teacher inbox, SMS log ready for Africa's Talking                          |
| **Settings**            | Institution profile, Appearance (8 accents, radius, font), Roles & Permissions matrix, Billing               |

### Cross-Cutting

| Feature                  | Details                                                                 |
| :----------------------- | :---------------------------------------------------------------------- |
| **Multi-Tenant Ready**   | Institution-scoped models, RBAC + ABAC, composite indexes               |
| **Customizable**         | Light/Dark/System, 8 accent colors, border-radius & font sliders, live preview |
| **Command Palette**      | ⌘K / Ctrl+K to navigate modules, switch roles, cycle themes             |
| **Kenyan Context**       | KES currency, EAT timezone, Swahili greetings, +254 phone formats       |
| **DPA 2019 Compliant**   | Restricted fields, audit-ready, encryption-at-rest messaging            |
| **Responsive**           | Collapsible sidebar (desktop) + drawer (mobile), h-16 topbar, p-6 grid  |

---

## 🏗 Tech Stack

| Layer        | Technology                              | Purpose                          |
| :----------- | :-------------------------------------- | :------------------------------- |
| **Framework**| Next.js 16 (App Router, Turbopack)      | RSC, API routes, fast HMR        |
| **Language** | TypeScript 5 (strict)                   | Type safety for finance/grades   |
| **Styling**  | Tailwind CSS 4 + shadcn/ui (New York)   | Accessible, consistent UI        |
| **Database** | MySQL 8.0 + Prisma ORM                  | Reliable, cheap KE hosting       |
| **Real-time**| Socket.IO (mini-service on :3003)       | Room isolation, presence         |
| **Charts**   | Recharts                                | Analytics dashboards             |
| **Icons**    | Lucide React                            | 1,000+ consistent icons          |
| **State**    | React Context + localStorage            | Offline-first cache              |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (18+ works)
- Bun 1.1+ or npm 10+
- MySQL 8.0 running locally
- VS Code (recommended)

### 1. Install Dependencies

```bash
bun install
# or
npm install
```

### 2. Set Up Database

Create the database in MySQL:

```sql
CREATE DATABASE kitone_edu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Create `.env` at project root:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/kitone_edu"
NEXT_PUBLIC_CLASSROOM_WS_URL="http://localhost:3003"
```

### 3. Push Prisma Schema

```bash
bun run db:generate
bun run db:push
```

### 4. Install Classroom Service

```bash
cd mini-services/classroom-service
bun install
cd ../..
```

### 5. Run The App

Run in two terminals:

**Terminal 1 - WebSocket Service:**

```bash
cd mini-services/classroom-service
bun run dev
```

**Terminal 2 - Main App:**

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) — onboarding wizard appears on first visit.

---

## 🔧 Environment Variables

| Variable                         | Required | Example                                      | Description                  |
| :------------------------------- | :------- | :------------------------------------------- | :--------------------------- |
| `DATABASE_URL`                   | ✅ Yes   | `mysql://root:pass@localhost:3306/kitone_edu`| Prisma connection string     |
| `NEXT_PUBLIC_CLASSROOM_WS_URL`   | ✅ Yes   | `http://localhost:3003`                      | Socket.IO endpoint           |
| `CLASSROOM_SERVICE_PORT`         | No       | `3003`                                       | WS server port               |
| `MPESA_CONSUMER_KEY`             | Planned  | `...`                                        | Daraja STK Push              |
| `MPESA_CONSUMER_SECRET`          | Planned  | `...`                                        | Daraja secret                |
| `MPESA_SHORTCODE`                | Planned  | `174379`                                     | Paybill / Till               |
| `AFRICASTALKING_API_KEY`         | Planned  | `...`                                        | SMS integration              |

---

## 📂 Project Structure

```
.
├── prisma/
│   └── schema.prisma                    # MySQL schema (11 models, cascade deletes)
├── mini-services/
│   └── classroom-service/               # Socket.IO real-time server (port 3003)
│       ├── index.ts
│       └── package.json
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── onboarding/route.ts      # GET/POST institution data to MySQL
│   │   ├── globals.css                  # Emerald theme + scrollbar styles
│   │   ├── layout.tsx                   # Metadata + no-flash theme script
│   │   └── page.tsx                     # Routes: loading → onboarding → dashboard
│   ├── components/
│   │   ├── kitone/
│   │   │   ├── onboarding/
│   │   │   │   └── onboarding-wizard.tsx
│   │   │   ├── modules/
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
│   │   │   ├── institution-store.tsx    # React Context + MySQL sync
│   │   │   ├── theme-provider.tsx
│   │   │   ├── appearance-settings.tsx
│   │   │   ├── shell.tsx                # Sidebar + Topbar + Footer
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   ├── command-palette.tsx      # ⌘K palette
│   │   │   ├── theme-toggle.tsx
│   │   │   ├── empty-state.tsx
│   │   │   └── data.ts                  # Roles + permissions
│   │   └── ui/                          # shadcn/ui components
│   ├── lib/
│   │   ├── db.ts                        # Prisma client singleton
│   │   └── utils.ts                     # cn(), KES formatter, validators
│   └── hooks/
│       └── use-toast.ts
├── .env                                 # DATABASE_URL
└── package.json
```

---

## 🗄 Database Schema

All 11 models include `institutionId` for multi-tenant isolation and composite indexes starting with `institutionId`.

| Model              | Purpose                                      | Key Fields                          |
| :----------------- | :------------------------------------------- | :---------------------------------- |
| `Institution`      | Tenant record                                | name, type, curriculum, branding    |
| `Class`            | Grade + stream + room                        | grade, stream, room, teacherId      |
| `Staff`            | Teachers, admin, finance                     | role, TSC No, phone (+254)          |
| `Subject`          | CBC / 8-4-4 / TVET / University              | code, strand, category              |
| `Student`          | Admissions, guardian, CBC levels             | admissionNo, UPI, guardian, medical |
| `FeeStructure`     | Per-grade fee items (JSON)                   | gradeId, items [{name, amount}]     |
| `Invoice`          | Student bills                                | studentId, total, status, dueDate   |
| `Payment`          | M-PESA / Bank / Cash receipts                | invoiceId, method, confirmationCode |
| `ClassroomSession` | Scheduled / live / ended sessions            | subjectId, status, hostId           |
| `Announcement`     | Targeted comms                               | audience, body, priority            |
| `Assessment`       | Online tests with anti-cheat                 | questions JSON, duration, config    |

---

## 🔄 Data Flow

```
User fills onboarding wizard
        ↓
syncToServer() POSTs to /api/onboarding
        ↓
Prisma upserts Institution + creates related records
        ↓
setupComplete = true saved to MySQL
        ↓
Celebration screen → Dashboard
        ↓
Next visit: GET /api/onboarding loads from MySQL → instant dashboard
```

**Caching:** React store also writes to `localStorage` so UI renders instantly while MySQL fetch is in-flight.

---

## 🎨 Customization

### Theme

- Top bar sun/moon button → Light / Dark / System
- Settings → Appearance → 8 accent colors, border-radius slider, font-size slider, live preview, reset

### Institution

- Settings → Institution → Edit name, motto, term, logo
- Settings → Institution → "Reset & re-run setup" → Wipes MySQL + restarts onboarding

### Adding A New Module

1. Create `src/components/kitone/modules/yourmodule.tsx`
2. Import it in `shell.tsx` and add to the view switch
3. Add a `ViewId` entry + nav item in `sidebar.tsx`
4. Add a `viewMeta` entry in `shell.tsx` for the page title

---

## 🔌 Real-Time Classroom

The `classroom-service` mini-service runs Socket.IO on port 3003. Caddy gateway forwards via `XTransformPort` query parameter.

| Feature                    | Description                                      |
| :------------------------- | :----------------------------------------------- |
| **Room Isolation**         | `kitone-{sessionId}` namespace                   |
| **Real-Time Chat**         | System + user messages, timestamps               |
| **Presence**               | Join / leave / update events                     |
| **Media Controls**         | Mic / cam toggle broadcasting                    |
| **Hand Raise**             | Raise / lower with notifications                 |
| **Shared Whiteboard**      | Canvas strokes synced across browsers            |
| **Host Controls**          | Recording toggle & board clear (host-only)       |
| **Auto Reassignment**      | Host reassigned on disconnect                    |
| **Cleanup**                | Empty room cleanup after 60s                     |

---

## 💳 Testing The M-PESA Flow

1. Go to **Fees & Payments**
2. Click **"New Invoice"** (or use existing)
3. Click **"Pay"** on any pending/overdue invoice
4. M-PESA modal → enter phone → **"Send STK Push"**
5. Wait ~3 seconds (simulated STK delay)
6. Success screen with auto-generated confirmation code
7. Payment recorded in MySQL and appears in Recent Payments

---

## 🛠 Scripts

| Command              | Description                              |
| :------------------- | :--------------------------------------- |
| `bun run dev`        | Start dev server (port 3000)             |
| `bun run build`      | Production build                         |
| `bun run start`      | Start production server                  |
| `bun run lint`       | ESLint + TypeScript check                |
| `bun run db:generate`| Generate Prisma client                   |
| `bun run db:push`    | Push schema to MySQL (dev)               |
| `bun run db:migrate` | Create migration (prod)                  |
| `bun run db:reset`   | Reset database                           |
| `bun run db:studio`  | Open Prisma Studio                       |

---

## 🐛 Troubleshooting

| Issue                              | Fix                                                                                      |
| :--------------------------------- | :--------------------------------------------------------------------------------------- |
| `Can't reach database server`      | Ensure MySQL is running on port 3306: `brew services start mysql`                        |
| `Access denied for user`           | Check `.env` credentials in `DATABASE_URL`                                               |
| `Unknown database 'kitone_edu'`    | Run `CREATE DATABASE kitone_edu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`       |
| Socket.IO connection fails         | Start classroom-service: `cd mini-services/classroom-service && bun run dev`            |
| Blank page after onboarding        | Clear localStorage: DevTools → Application → Clear, ensure MySQL reachable              |
| `Cannot find module 'socket.io-client'` | Run `bun add socket.io-client` in root                                            |
| ESLint `set-state-in-effect` errors| Disable in `eslint.config.mjs`: `{ rules: { "react-hooks/set-state-in-effect": "off" } }` |

### ESLint Config Note

The `react-hooks/set-state-in-effect` rule flags legitimate effects (Socket.IO, matchMedia, Embla). Disable it:

```js
// eslint.config.mjs
{
  rules: {
    "react-hooks/set-state-in-effect": "off"
  }
}
```

---

## 📋 Roadmap

### v0.2 — Payments & Comms (Next)

- [ ] Real M-PESA Daraja API integration (STK Push + C2B callbacks)
- [ ] Africa's Talking SMS integration
- [ ] PDF report card generation

### v0.3 — Auth & Multi-Tenancy

- [ ] Authentication (NextAuth.js with MFA for admin/finance)
- [ ] Multi-tenant subdomain routing (`school.kitone.co.ke`)
- [ ] Role-based route guards

### v0.4 — Scale

- [ ] CSV/Excel student bulk import
- [ ] WebRTC peer-to-peer video in classrooms
- [ ] Offline-first PWA + Kiswahili localization

### v1.0 — GA

- [ ] KNEC/KICD report formats
- [ ] Audit logs & DPA 2019 export
- [ ] Mobile app (Capacitor wrapper)

---

## 📄 License

MIT — Built with ❤ for Kenyan education.

---

## 🙏 Acknowledgements

| Library        | Purpose                  | Link                          |
| :------------- | :----------------------- | :---------------------------- |
| **Next.js**    | React framework          | https://nextjs.org/           |
| **shadcn/ui**  | Component library        | https://ui.shadcn.com/        |
| **Prisma**     | Database ORM             | https://www.prisma.io/        |
| **Socket.IO**  | Real-time communication  | https://socket.io/            |
| **Recharts**   | Charts                   | https://recharts.org/         |
| **Lucide**     | Icons                    | https://lucide.dev/           |
| **Tailwind**   | Styling                  | https://tailwindcss.com/      |

---

<div align="center">

**Kitone Edu** — *One platform, every school type.* 🇰🇪

*Eldoret • Nairobi • Built for Africa*

</div>
