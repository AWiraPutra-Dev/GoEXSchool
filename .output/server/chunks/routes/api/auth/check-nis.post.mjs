import { c as defineEventHandler, r as readBody, e as createError, p as prisma } from '../../../_/nitro.mjs';
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

const checkNis_post = defineEventHandler(async (event) => {
  const { nis } = await readBody(event);
  if (!nis) {
    throw createError({ statusCode: 400, message: "NIS wajib diisi." });
  }
  const student = await prisma.student.findUnique({ where: { nis } });
  if (!student) {
    throw createError({ statusCode: 404, message: "NIS tidak terdaftar. Hubungi admin sekolah." });
  }
  if (student.accountStatus === "registered") {
    throw createError({ statusCode: 409, message: "NIS sudah digunakan. Silakan login." });
  }
  return { name: student.name, institutionId: student.institutionId };
});

export { checkNis_post as default };
//# sourceMappingURL=check-nis.post.mjs.map
