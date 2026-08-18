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

const extracurriculars_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { name, quota, scheduleInfo, description, teacherId, logoUrl } = await readBody(event);
  if (!name) {
    throw createError({ statusCode: 400, message: "Nama ekskul wajib diisi." });
  }
  return prisma.extracurricular.create({
    data: { name, quota: quota || 30, scheduleInfo, description, teacherId, logoUrl: typeof logoUrl === "string" ? logoUrl : null, institutionId: auth.institutionId },
    include: { teacher: true, _count: { select: { members: true } } }
  });
});

export { extracurriculars_post as default };
//# sourceMappingURL=extracurriculars.post.mjs.map
