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

const _id__put = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const existing = await prisma.achievement.findFirst({ where: { id, studentId: auth.studentId } });
  if (!existing) throw createError({ statusCode: 404, message: "Prestasi tidak ditemukan." });
  const { title, description, date, type, extracurricularId, level, proof } = await readBody(event);
  await prisma.achievement.update({
    where: { id },
    data: { title, description, date: date ? new Date(date) : void 0, type, level, proofUrl: proof || null, extracurricularId }
  });
  return { success: true };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
