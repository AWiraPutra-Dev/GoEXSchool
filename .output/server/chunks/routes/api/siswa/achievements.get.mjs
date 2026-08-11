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

const achievements_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const achievements = await prisma.achievement.findMany({
    where: { studentId: auth.studentId },
    include: { extracurricular: { select: { name: true } } },
    orderBy: { date: "desc" }
  });
  return achievements.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    date: a.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    type: a.type,
    ekskul: a.extracurricular.name,
    ekskulId: a.extracurricularId,
    level: a.level,
    proof: a.proofUrl
  }));
});

export { achievements_get as default };
//# sourceMappingURL=achievements.get.mjs.map
