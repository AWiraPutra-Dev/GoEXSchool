import { c as defineEventHandler, g as getRouterParam, r as readBody, p as prisma, e as createError, n as getOperatorScope, q as assertScope } from '../../../../_/nitro.mjs';
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
  const { title, content, excerpt, coverImage, category, tags, status } = await readBody(event);
  const article = await prisma.article.findFirst({
    where: { id, institutionId: auth.institutionId }
  });
  if (!article) {
    throw createError({ statusCode: 404, message: "Artikel tidak ditemukan." });
  }
  const scope = await getOperatorScope(event);
  assertScope(scope, article.extracurricularId || void 0);
  const updated = await prisma.article.update({
    where: { id },
    data: {
      ...title && { title },
      ...content && { content },
      ...excerpt !== void 0 && { excerpt },
      ...coverImage !== void 0 && { coverImage },
      ...category && { category },
      ...tags !== void 0 && { tags },
      ...status && { status }
    }
  });
  return { success: true, id: updated.id, status: updated.status };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
