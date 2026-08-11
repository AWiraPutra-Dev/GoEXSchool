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
  const id = getRouterParam(event, "id");
  const schedule = await prisma.schedule.findUnique({ where: { id } });
  if (!schedule) throw createError({ statusCode: 404, message: "Jadwal tidak ditemukan." });
  await prisma.schedule.delete({ where: { id } });
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
