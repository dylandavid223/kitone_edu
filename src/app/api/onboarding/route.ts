import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/onboarding — fetch the saved institution + all related data
export async function GET() {
  try {
    const inst = await db.institution.findFirst({
      include: {
        classes: true,
        staff: true,
        subjects: true,
        students: true,
        feeStructures: true,
        invoices: true,
        payments: true,
        sessions: true,
        announcements: true,
        assessments: true,
      },
    });

    if (!inst) {
      return NextResponse.json({ setupComplete: false, info: null });
    }

    return NextResponse.json({
      info: {
        name: inst.name,
        shortName: inst.shortName ?? '',
        slug: inst.slug,
        motto: inst.motto ?? '',
        type: inst.type,
        curriculum: inst.curriculum,
        location: inst.location ?? '',
        established: inst.established ?? '',
        timezone: inst.timezone,
        currency: inst.currency,
        languages: inst.languages.split(',').filter(Boolean),
        logoText: inst.logoText ?? '',
        term: inst.term,
        academicYear: inst.academicYear,
      },
      setupComplete: inst.setupComplete,
      setupStep: 0,
      classes: inst.classes.map((c) => ({
        id: c.id,
        name: c.name,
        grade: c.grade,
        stream: c.stream ?? '',
        teacherId: c.teacherId ?? null,
        room: c.room ?? '',
      })),
      staff: inst.staff.map((s) => ({
        id: s.id,
        name: s.name,
        role: s.role,
        email: s.email ?? '',
        phone: s.phone ?? '',
        subjects: s.subjects ? s.subjects.split(',') : [],
        avatarColor: s.avatarColor ?? 'bg-emerald-500',
      })),
      subjects: inst.subjects.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        color: s.color,
      })),
      students: inst.students.map((s) => ({
        id: s.id,
        admissionNo: s.admissionNo,
        name: s.name,
        gender: s.gender as 'M' | 'F',
        grade: s.grade,
        stream: s.stream ?? '',
        guardian: s.guardian ?? '',
        guardianPhone: s.guardianPhone ?? '',
        feeBalance: s.feeBalance,
        attendance: s.attendance,
        avgScore: s.avgScore,
        cbc: s.cbc ?? '',
        status: s.status as 'active' | 'suspended',
      })),
      feeStructures: inst.feeStructures.map((f) => ({
        id: f.id,
        grade: f.grade,
        items: f.items as { label: string; amount: number }[],
      })),
      invoices: inst.invoices.map((i) => ({
        id: i.id,
        invoiceNo: i.invoiceNo,
        studentId: i.studentId ?? '',
        studentName: i.studentName,
        className: i.className,
        amount: i.amount,
        paid: i.paid,
        dueDate: i.dueDate ?? '',
        status: i.status as 'paid' | 'pending' | 'overdue',
        items: i.items as { label: string; amount: number }[],
      })),
      payments: inst.payments.map((p) => ({
        id: p.id,
        invoiceNo: p.invoiceNo ?? '',
        studentName: p.studentName,
        method: p.method as 'M-PESA' | 'Airtel Money' | 'Bank' | 'Cash',
        amount: p.amount,
        code: p.code,
        phone: p.phone ?? '',
        timestamp: p.timestamp.toISOString(),
      })),
      sessions: inst.sessions.map((s) => ({
        id: s.id,
        classId: s.classId ?? '',
        className: s.className,
        subject: s.subject,
        teacher: s.teacher ?? '',
        scheduledAt: s.scheduledAt,
        duration: s.duration,
        status: s.status as 'scheduled' | 'live' | 'ended',
      })),
      announcements: inst.announcements.map((a) => ({
        id: a.id,
        title: a.title,
        body: a.body,
        audience: a.audience,
        author: a.author,
        date: a.date.toISOString(),
        views: a.views,
      })),
      assessments: inst.assessments.map((a) => ({
        id: a.id,
        title: a.title,
        subject: a.subject,
        className: a.className,
        questions: a.questions,
        window: a.window,
        duration: a.duration,
        status: a.status as 'Draft' | 'Scheduled' | 'Live' | 'Closed',
        avgScore: a.avgScore,
        attempts: a.attempts,
      })),
    });
  } catch (e) {
    console.error('GET /api/onboarding error:', e);
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}

// POST /api/onboarding — full upsert (wipes related records, recreates)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const info = body.info;
    if (!info) {
      return NextResponse.json({ error: 'Missing info' }, { status: 400 });
    }

    // Find existing institution (by slug or first one)
    const existing = await db.institution.findFirst({
      where: { slug: info.slug },
    });

    const institutionId = existing?.id;

    // If exists, delete all related records first (clean slate)
    if (existing) {
      await db.class.deleteMany({ where: { institutionId: existing.id } });
      await db.staff.deleteMany({ where: { institutionId: existing.id } });
      await db.subject.deleteMany({ where: { institutionId: existing.id } });
      await db.student.deleteMany({ where: { institutionId: existing.id } });
      await db.feeStructure.deleteMany({ where: { institutionId: existing.id } });
      await db.invoice.deleteMany({ where: { institutionId: existing.id } });
      await db.payment.deleteMany({ where: { institutionId: existing.id } });
      await db.classroomSession.deleteMany({ where: { institutionId: existing.id } });
      await db.announcement.deleteMany({ where: { institutionId: existing.id } });
      await db.assessment.deleteMany({ where: { institutionId: existing.id } });
    }

    // Upsert institution
    const inst = await db.institution.upsert({
      where: { slug: info.slug },
      create: {
        name: info.name,
        shortName: info.shortName || null,
        slug: info.slug,
        motto: info.motto || null,
        type: info.type,
        curriculum: info.curriculum,
        location: info.location || null,
        established: info.established || null,
        timezone: info.timezone || 'Africa/Nairobi',
        currency: info.currency || 'KES',
        languages: (info.languages || []).join(','),
        logoText: info.logoText || null,
        term: info.term || 'Term 1',
        academicYear: info.academicYear || String(new Date().getFullYear()),
        setupComplete: body.setupComplete ?? false,
      },
      update: {
        name: info.name,
        shortName: info.shortName || null,
        motto: info.motto || null,
        type: info.type,
        curriculum: info.curriculum,
        location: info.location || null,
        established: info.established || null,
        timezone: info.timezone || 'Africa/Nairobi',
        currency: info.currency || 'KES',
        languages: (info.languages || []).join(','),
        logoText: info.logoText || null,
        term: info.term || 'Term 1',
        academicYear: info.academicYear || String(new Date().getFullYear()),
        setupComplete: body.setupComplete ?? false,
      },
    });

    const iid = inst.id;

    // Create related records
    if (body.classes?.length) {
      await db.class.createMany({
        data: body.classes.map((c: any) => ({
          institutionId: iid,
          name: c.name,
          grade: c.grade,
          stream: c.stream || null,
          teacherId: c.teacherId || null,
          room: c.room || null,
        })),
      });
    }

    if (body.staff?.length) {
      await db.staff.createMany({
        data: body.staff.map((s: any) => ({
          institutionId: iid,
          name: s.name,
          role: s.role,
          email: s.email || null,
          phone: s.phone || null,
          subjects: (s.subjects || []).join(','),
          avatarColor: s.avatarColor || null,
        })),
      });
    }

    if (body.subjects?.length) {
      await db.subject.createMany({
        data: body.subjects.map((s: any) => ({
          institutionId: iid,
          name: s.name,
          code: s.code,
          color: s.color,
        })),
      });
    }

    if (body.students?.length) {
      await db.student.createMany({
        data: body.students.map((s: any) => ({
          institutionId: iid,
          admissionNo: s.admissionNo,
          name: s.name,
          gender: s.gender,
          grade: s.grade,
          stream: s.stream || null,
          guardian: s.guardian || null,
          guardianPhone: s.guardianPhone || null,
          feeBalance: s.feeBalance || 0,
          attendance: s.attendance || 100,
          avgScore: s.avgScore || 0,
          cbc: s.cbc || null,
          status: s.status || 'active',
        })),
      });
    }

    if (body.feeStructures?.length) {
      await db.feeStructure.createMany({
        data: body.feeStructures.map((f: any) => ({
          institutionId: iid,
          grade: f.grade,
          items: f.items,
        })),
      });
    }

    if (body.invoices?.length) {
      await db.invoice.createMany({
        data: body.invoices.map((i: any) => ({
          institutionId: iid,
          invoiceNo: i.invoiceNo,
          studentId: i.studentId || null,
          studentName: i.studentName,
          className: i.className,
          amount: i.amount,
          paid: i.paid || 0,
          dueDate: i.dueDate || null,
          status: i.status || 'pending',
          items: i.items,
        })),
      });
    }

    if (body.payments?.length) {
      await db.payment.createMany({
        data: body.payments.map((p: any) => ({
          institutionId: iid,
          invoiceNo: p.invoiceNo || null,
          studentName: p.studentName,
          method: p.method,
          amount: p.amount,
          code: p.code,
          phone: p.phone || null,
          timestamp: p.timestamp ? new Date(p.timestamp) : new Date(),
        })),
      });
    }

    if (body.sessions?.length) {
      await db.classroomSession.createMany({
        data: body.sessions.map((s: any) => ({
          institutionId: iid,
          classId: s.classId || null,
          className: s.className,
          subject: s.subject,
          teacher: s.teacher || null,
          scheduledAt: s.scheduledAt,
          duration: s.duration,
          status: s.status || 'scheduled',
        })),
      });
    }

    if (body.announcements?.length) {
      await db.announcement.createMany({
        data: body.announcements.map((a: any) => ({
          institutionId: iid,
          title: a.title,
          body: a.body,
          audience: a.audience,
          author: a.author,
          date: a.date ? new Date(a.date) : new Date(),
          views: a.views || 0,
        })),
      });
    }

    if (body.assessments?.length) {
      await db.assessment.createMany({
        data: body.assessments.map((a: any) => ({
          institutionId: iid,
          title: a.title,
          subject: a.subject,
          className: a.className,
          questions: a.questions || 0,
          window: a.window,
          duration: a.duration,
          status: a.status || 'Draft',
          avgScore: a.avgScore || 0,
          attempts: a.attempts || 0,
        })),
      });
    }

    return NextResponse.json({ ok: true, id: iid });
  } catch (e) {
    console.error('POST /api/onboarding error:', e);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}