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

const attendance_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const records = await prisma.attendanceRecord.findMany({
    where: { studentId: auth.studentId },
    include: { extracurricular: { select: { name: true } } },
    orderBy: { date: "desc" }
  });
  return records.map((r) => ({
    id: r.id,
    date: r.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    ekskul: r.extracurricular.name,
    status: r.status === "hadir" ? "Hadir" : r.status === "izin" ? "Izin" : "Alpha",
    time: r.time || "-",
    notes: r.notes || "-"
  }));
});

export { attendance_get as default };
//# sourceMappingURL=attendance.get.mjs.map
