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
  const instId = auth.institutionId;
  const [students, classes, teachers, ekskuls, operators, logs, todaySchedule] = await Promise.all([
    prisma.student.count({ where: { institutionId: instId } }),
    prisma.class.count({ where: { institutionId: instId } }),
    prisma.teacher.count({ where: { institutionId: instId } }),
    prisma.extracurricular.count({ where: { institutionId: instId } }),
    prisma.user.count({ where: { institutionId: instId, role: "operator", status: "active" } }),
    prisma.activityLog.findMany({
      where: { institutionId: instId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true } } }
    }),
    prisma.schedule.findMany({
      where: { institutionId: instId, day: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][(/* @__PURE__ */ new Date()).getDay() === 0 ? 6 : (/* @__PURE__ */ new Date()).getDay() - 1] },
      include: { extracurricular: { select: { name: true } } },
      take: 5
    })
  ]);
  return {
    students,
    classes,
    teachers,
    extracurriculars: ekskuls,
    activeOperators: operators,
    remainingQuota: 1288,
    todaySchedule: todaySchedule.map((s) => ({
      id: s.id,
      time: `${s.timeStart} - ${s.timeEnd || "selesai"}`,
      title: `Ekskul ${s.extracurricular.name} - ${s.coach}`
    })),
    activityLogs: logs.map((l) => ({
      id: l.id,
      actor: l.user.name,
      action: l.action,
      timestamp: l.createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    }))
  };
});

export { dashboard_get as default };
//# sourceMappingURL=dashboard.get.mjs.map
