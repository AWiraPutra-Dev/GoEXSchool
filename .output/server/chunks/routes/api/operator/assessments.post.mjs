import { c as defineEventHandler, r as readBody, e as createError, p as prisma } from '../../../_/nitro.mjs';
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

function getGrade(score) {
  return score >= 85 ? "A" : score >= 80 ? "A-" : score >= 75 ? "B+" : score >= 70 ? "B" : "C";
}
const assessments_post = defineEventHandler(async (event) => {
  const { studentId, extracurricularId, score, notes } = await readBody(event);
  if (!studentId || !extracurricularId || score == null) {
    throw createError({ statusCode: 400, message: "Siswa, ekskul, dan nilai wajib diisi." });
  }
  const assessment = await prisma.assessment.create({
    data: { studentId, extracurricularId, score, grade: getGrade(score), notes, date: /* @__PURE__ */ new Date() },
    include: {
      student: { select: { name: true } },
      extracurricular: { select: { name: true } }
    }
  });
  return {
    id: assessment.id,
    student: assessment.student.name,
    studentId: assessment.studentId,
    ekskul: assessment.extracurricular.name,
    ekskulId: assessment.extracurricularId,
    score: assessment.score,
    grade: assessment.grade,
    notes: assessment.notes,
    date: assessment.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  };
});

export { assessments_post as default };
//# sourceMappingURL=assessments.post.mjs.map
