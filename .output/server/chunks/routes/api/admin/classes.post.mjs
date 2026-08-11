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

const classes_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { name, grade, major, homeroom } = await readBody(event);
  if (!name || !grade) {
    throw createError({ statusCode: 400, message: "Nama kelas dan tingkat wajib diisi." });
  }
  return prisma.class.create({
    data: { name, grade, major: major || "", homeroom, institutionId: auth.institutionId }
  });
});

export { classes_post as default };
//# sourceMappingURL=classes.post.mjs.map
