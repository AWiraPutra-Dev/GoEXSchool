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

const _id__put = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) throw createError({ statusCode: 404, message: "Anggota tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, member.extracurricularId);
  const updated = await prisma.member.update({
    where: { id },
    data: { status: member.status === "active" ? "inactive" : "active" }
  });
  return { success: true, status: updated.status };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
