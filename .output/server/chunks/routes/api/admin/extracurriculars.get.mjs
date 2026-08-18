import { c as defineEventHandler, p as prisma } from '../../../_/nitro.mjs';
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

const extracurriculars_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  return prisma.extracurricular.findMany({
    where: { institutionId: auth.institutionId },
    include: { teacher: true, _count: { select: { members: true } } },
    orderBy: { name: "asc" }
  });
});

export { extracurriculars_get as default };
//# sourceMappingURL=extracurriculars.get.mjs.map
