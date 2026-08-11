import { c as defineEventHandler, g as getRouterParam, p as prisma, e as createError } from '../../../../_/nitro.mjs';
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
  const teacher = await prisma.teacher.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!teacher) throw createError({ statusCode: 404, message: "Guru tidak ditemukan." });
  await prisma.extracurricular.updateMany({ where: { teacherId: id }, data: { teacherId: null } });
  await prisma.teacher.delete({ where: { id } });
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
