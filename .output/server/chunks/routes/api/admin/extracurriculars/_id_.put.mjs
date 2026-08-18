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
  const { name, quota, scheduleInfo, description, teacherId, logoUrl } = await readBody(event);
  const ekskul = await prisma.extracurricular.findFirst({
    where: { id, institutionId: auth.institutionId }
  });
  if (!ekskul) throw createError({ statusCode: 404, message: "Ekskul tidak ditemukan." });
  return prisma.extracurricular.update({
    where: { id },
    data: { name, quota, scheduleInfo, description, teacherId, logoUrl: typeof logoUrl === "string" ? logoUrl : null },
    include: { teacher: true, _count: { select: { members: true } } }
  });
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
