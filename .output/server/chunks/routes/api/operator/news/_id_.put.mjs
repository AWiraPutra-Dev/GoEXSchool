import { c as defineEventHandler, g as getRouterParam, p as prisma, e as createError, n as getOperatorScope, q as assertScope, r as readBody } from '../../../../_/nitro.mjs';
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
  const id = getRouterParam(event, "id");
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) throw createError({ statusCode: 404, message: "Berita tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, existing.extracurricularId);
  const { title, content, isPublic, extracurricularId, author } = await readBody(event);
  if (extracurricularId) assertScope(scope, extracurricularId);
  await prisma.news.update({
    where: { id },
    data: { title, content, isPublic: !!isPublic, author, extracurricularId }
  });
  return { success: true };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
