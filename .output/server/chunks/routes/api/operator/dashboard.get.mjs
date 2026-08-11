import { c as defineEventHandler, p as prisma } from '../../../_/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:path';

const dashboard_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const [activeMembers, uniqueEkskul, recentSessions, pollsCount, newsCount, galleryCount] = await Promise.all([
    prisma.member.count({ where: { status: "active", student: { institutionId: auth.institutionId } } }),
    prisma.extracurricular.count({ where: { institutionId: auth.institutionId } }),
    prisma.attendanceSession.findMany({
      where: { extracurricular: { institutionId: auth.institutionId } },
      include: { extracurricular: { select: { name: true } }, _count: { select: { records: true } } },
      orderBy: { date: "desc" },
      take: 5
    }),
    prisma.poll.count({ where: { institutionId: auth.institutionId, active: true } }),
    prisma.news.count({ where: { institutionId: auth.institutionId } }),
    prisma.gallery.count({ where: { institutionId: auth.institutionId } })
  ]);
  return {
    totalMembers: activeMembers,
    activeEkskul: uniqueEkskul,
    pendingAssessments: 0,
    myEkskul: "",
    attendanceHistory: recentSessions.map((s) => ({
      date: s.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      ekskul: s.extracurricular.name,
      hadir: s._count.records,
      total: s._count.records,
      status: s.qrExpiresAt > /* @__PURE__ */ new Date() ? "Berlangsung" : "Selesai"
    })),
    activePolls: pollsCount,
    newsCount,
    galleryCount
  };
});

export { dashboard_get as default };
//# sourceMappingURL=dashboard.get.mjs.map
