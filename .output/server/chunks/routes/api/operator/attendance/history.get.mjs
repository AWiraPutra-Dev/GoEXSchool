import { c as defineEventHandler, n as getOperatorScope, p as prisma, v as scopeRelationFilter } from '../../../../_/nitro.mjs';
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

const history_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const sessions = await prisma.attendanceSession.findMany({
    where: { extracurricular: { institutionId: auth.institutionId, ...scopeRelationFilter(scope) } },
    include: {
      extracurricular: { select: { name: true } },
      records: {
        include: { student: { select: { nis: true, name: true, class: true } } },
        orderBy: { createdAt: "asc" }
      }
    },
    orderBy: { date: "desc" },
    take: 50
  });
  return sessions.map((s) => {
    const total = s.records.length;
    const hadir = s.records.filter((r) => r.status === "hadir").length;
    return {
      id: s.id,
      date: s.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      ekskul: s.extracurricular.name,
      hadir,
      total,
      status: s.qrExpiresAt > /* @__PURE__ */ new Date() ? "Berlangsung" : "Selesai",
      locationName: s.locationName,
      // Detail per siswa: siapa hadir, izin, alpha, beserta keterangan/alasan
      records: s.records.map((r) => ({
        id: r.id,
        student: r.student.name,
        nis: r.student.nis,
        class: r.student.class,
        status: r.status,
        time: r.time || null,
        notes: r.notes || null
      }))
    };
  });
});

export { history_get as default };
//# sourceMappingURL=history.get.mjs.map
