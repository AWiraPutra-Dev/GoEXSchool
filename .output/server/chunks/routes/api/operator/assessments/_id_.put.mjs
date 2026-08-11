import { c as defineEventHandler, g as getRouterParam, p as prisma, e as createError, r as readBody } from '../../../../_/nitro.mjs';
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
const _id__put = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const existing = await prisma.assessment.findUnique({ where: { id } });
  if (!existing) throw createError({ statusCode: 404, message: "Penilaian tidak ditemukan." });
  const { score, notes } = await readBody(event);
  const updated = await prisma.assessment.update({
    where: { id },
    data: { score, grade: getGrade(score), notes }
  });
  return { success: true, ...updated };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
