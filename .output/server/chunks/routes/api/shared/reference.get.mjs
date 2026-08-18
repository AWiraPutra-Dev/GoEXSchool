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

const reference_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const [students, extracurriculars] = await Promise.all([
    prisma.student.findMany({
      where: { institutionId: auth.institutionId },
      orderBy: { name: "asc" }
    }),
    prisma.extracurricular.findMany({
      where: { institutionId: auth.institutionId },
      include: {
        teacher: { select: { name: true } },
        _count: { select: { members: true } }
      },
      orderBy: { name: "asc" }
    })
  ]);
  return { students, extracurriculars };
});

export { reference_get as default };
//# sourceMappingURL=reference.get.mjs.map
