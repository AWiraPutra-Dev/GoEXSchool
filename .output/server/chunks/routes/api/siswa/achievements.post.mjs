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

const achievements_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { title, description, date, type, extracurricularId, level, proof } = await readBody(event);
  if (!title || !type || !extracurricularId || !level) {
    throw createError({ statusCode: 400, message: "Judul, jenis, ekskul, dan tingkat wajib diisi." });
  }
  const achievement = await prisma.achievement.create({
    data: {
      title,
      description,
      date: date ? new Date(date) : /* @__PURE__ */ new Date(),
      type,
      level,
      proofUrl: proof || null,
      studentId: auth.studentId,
      extracurricularId
    },
    include: {
      extracurricular: { select: { name: true } },
      student: { select: { name: true, class: true } }
    }
  });
  return {
    id: achievement.id,
    title: achievement.title,
    description: achievement.description,
    date: achievement.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    type: achievement.type,
    ekskul: achievement.extracurricular.name,
    ekskulId: achievement.extracurricularId,
    level: achievement.level,
    proof: achievement.proofUrl,
    studentName: achievement.student.name,
    studentClass: achievement.student.class
  };
});

export { achievements_post as default };
//# sourceMappingURL=achievements.post.mjs.map
