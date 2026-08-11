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

const grades_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const assessments = await prisma.assessment.findMany({
    where: { studentId: auth.studentId },
    include: { extracurricular: { select: { name: true } } },
    orderBy: { date: "desc" }
  });
  return assessments.map((a) => ({
    id: a.id,
    ekskul: a.extracurricular.name,
    semester: "",
    score: a.score,
    grade: a.grade,
    notes: a.notes,
    date: a.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  }));
});

export { grades_get as default };
//# sourceMappingURL=grades.get.mjs.map
