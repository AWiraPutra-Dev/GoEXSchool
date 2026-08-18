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
  const material = await prisma.extracurricularMaterial.findFirst({
    where: { id, institutionId: auth.institutionId }
  });
  if (!material) {
    throw createError({ statusCode: 404, message: "Materi tidak ditemukan." });
  }
  const scope = await getOperatorScope(event);
  assertScope(scope, material.extracurricularId);
  await prisma.extracurricularMaterial.delete({ where: { id } });
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
