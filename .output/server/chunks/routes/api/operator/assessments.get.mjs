import { c as defineEventHandler, h as getQuery, p as prisma } from '../../../_/nitro.mjs';
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

const assessments_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const query = getQuery(event);
  const where = { student: { institutionId: auth.institutionId } };
  if (query.ekskulId) where.extracurricularId = String(query.ekskulId);
  const assessments = await prisma.assessment.findMany({
    where,
    include: {
      student: { select: { name: true } },
      extracurricular: { select: { name: true } }
    },
    orderBy: { date: "desc" }
  });
  return assessments.map((a) => ({
    id: a.id,
    student: a.student.name,
    studentId: a.studentId,
    ekskul: a.extracurricular.name,
    ekskulId: a.extracurricularId,
    score: a.score,
    grade: a.grade,
    notes: a.notes,
    date: a.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  }));
});

export { assessments_get as default };
//# sourceMappingURL=assessments.get.mjs.map
