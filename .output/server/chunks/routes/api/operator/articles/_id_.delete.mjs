import { c as defineEventHandler, g as getRouterParam, p as prisma, e as createError, n as getOperatorScope, q as assertScope } from '../../../../_/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const article = await prisma.article.findFirst({
    where: { id, institutionId: auth.institutionId }
  });
  if (!article) {
    throw createError({ statusCode: 404, message: "Artikel tidak ditemukan." });
  }
  const scope = await getOperatorScope(event);
  assertScope(scope, article.extracurricularId || void 0);
  await prisma.article.delete({ where: { id } });
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
