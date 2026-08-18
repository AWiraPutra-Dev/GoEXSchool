import { c as defineEventHandler, p as prisma, n as getOperatorScope } from '../../../_/nitro.mjs';
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

const izin_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  let ekskulIds = null;
  if (auth.role === "student" && auth.studentId) {
    const members = await prisma.member.findMany({
      where: { studentId: auth.studentId, status: "active" },
      select: { extracurricularId: true }
    });
    ekskulIds = members.map((m) => m.extracurricularId);
    if (!ekskulIds.length) return [];
  } else if (auth.role === "operator") {
    const scope = await getOperatorScope(event);
    ekskulIds = scope.isScoped ? scope.extracurricularId ? [scope.extracurricularId] : [""] : null;
  }
  const where = {
    status: "izin",
    extracurricular: { institutionId: auth.institutionId }
  };
  if (ekskulIds) where.extracurricularId = { in: ekskulIds };
  const records = await prisma.attendanceRecord.findMany({
    where,
    include: {
      student: { select: { nis: true, name: true, class: true } },
      extracurricular: { select: { id: true, name: true } }
    },
    orderBy: { date: "desc" }
  });
  return records.map((r) => ({
    id: r.id,
    studentId: r.studentId,
    student: r.student.name,
    nis: r.student.nis,
    class: r.student.class,
    ekskulId: r.extracurricularId,
    ekskul: r.extracurricular.name,
    date: r.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    dateISO: r.date.toISOString(),
    reason: r.notes || ""
  }));
});

export { izin_get as default };
//# sourceMappingURL=izin.get.mjs.map
