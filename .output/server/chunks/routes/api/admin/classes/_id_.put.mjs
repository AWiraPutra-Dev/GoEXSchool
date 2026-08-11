import { c as defineEventHandler, g as getRouterParam, r as readBody, e as createError, p as prisma } from '../../../../_/nitro.mjs';
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
  const { name, grade, major, homeroom } = await readBody(event);
  if (!name || !grade) {
    throw createError({ statusCode: 400, message: "Nama kelas dan tingkat wajib diisi." });
  }
  return prisma.class.update({
    where: { id, institutionId: auth.institutionId },
    data: { name, grade, major: major || "", homeroom }
  });
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
