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
  const { name, class: className, gender, phone } = await readBody(event);
  const student = await prisma.student.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!student) throw createError({ statusCode: 404, message: "Siswa tidak ditemukan." });
  const updated = await prisma.student.update({
    where: { id },
    data: { name, class: className, gender, phone }
  });
  return updated;
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
