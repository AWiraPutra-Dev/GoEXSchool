import { c as defineEventHandler, e as createError, p as prisma } from '../../_/nitro.mjs';
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

const settings_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  if (!(auth == null ? void 0 : auth.institutionId)) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const inst = await prisma.institution.findUnique({ where: { id: auth.institutionId } });
  if (!inst) throw createError({ statusCode: 404, message: "Sekolah tidak ditemukan." });
  return inst;
});

export { settings_get as default };
//# sourceMappingURL=settings.get.mjs.map
