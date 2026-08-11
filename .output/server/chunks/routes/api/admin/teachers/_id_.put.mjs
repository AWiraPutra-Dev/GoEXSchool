import { c as defineEventHandler, g as getRouterParam, r as readBody, p as prisma, e as createError } from '../../../../_/nitro.mjs';
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
  const { nip, name, subject, phone } = await readBody(event);
  const teacher = await prisma.teacher.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!teacher) throw createError({ statusCode: 404, message: "Guru tidak ditemukan." });
  return prisma.teacher.update({ where: { id }, data: { nip, name, subject, phone } });
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
