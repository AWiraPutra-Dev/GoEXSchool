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

const students_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const students = await prisma.student.findMany({
    where: { institutionId: auth.institutionId },
    orderBy: { nis: "asc" }
  });
  return students;
});

export { students_get as default };
//# sourceMappingURL=students.get.mjs.map
