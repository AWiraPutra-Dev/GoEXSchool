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

const teachers_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { nip, name, subject, phone } = await readBody(event);
  if (!nip || !name) {
    throw createError({ statusCode: 400, message: "NIP dan nama wajib diisi." });
  }
  return prisma.teacher.create({
    data: { nip, name, subject: subject || "", phone, institutionId: auth.institutionId }
  });
});

export { teachers_post as default };
//# sourceMappingURL=teachers.post.mjs.map
