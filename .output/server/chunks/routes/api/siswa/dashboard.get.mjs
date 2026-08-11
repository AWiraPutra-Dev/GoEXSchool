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
  const [memberships, attendanceRecords, achievements] = await Promise.all([
    prisma.member.findMany({
      where: { studentId: auth.studentId, status: "active" },
      include: {
        extracurricular: {
          include: {
            schedules: { take: 3, orderBy: [{ day: "asc" }, { timeStart: "asc" }] }
          }
        }
      }
    }),
    prisma.attendanceRecord.findMany({
      where: { studentId: auth.studentId },
      orderBy: { date: "desc" }
    }),
    prisma.achievement.count({ where: { studentId: auth.studentId } })
  ]);
  const total = attendanceRecords.length;
  const hadir = attendanceRecords.filter((r) => r.status === "hadir").length;
  const attendanceRate = total ? Math.round(hadir / total * 100) : 0;
  return {
    ekskulCount: memberships.length,
    attendanceRate,
    achievementCount: achievements,
    totalSessions: total,
    upcoming: memberships.flatMap(
      (m) => m.extracurricular.schedules.map((s) => ({
        id: s.id,
        day: s.day,
        date: "",
        time: s.timeEnd ? `${s.timeStart} - ${s.timeEnd}` : s.timeStart,
        title: `${m.extracurricular.name} - ${s.location}`,
        coach: s.coach,
        status: "akan_datang"
      }))
    )
  };
});

export { dashboard_get as default };
//# sourceMappingURL=dashboard.get.mjs.map
