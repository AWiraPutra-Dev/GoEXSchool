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

const teachers_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  return prisma.teacher.findMany({
    where: { institutionId: auth.institutionId },
    orderBy: { name: "asc" }
  });
});

export { teachers_get as default };
//# sourceMappingURL=teachers.get.mjs.map
