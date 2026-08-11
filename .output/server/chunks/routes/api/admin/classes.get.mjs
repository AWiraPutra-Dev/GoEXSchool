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

const classes_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  return prisma.class.findMany({
    where: { institutionId: auth.institutionId },
    orderBy: [{ grade: "asc" }, { name: "asc" }]
  });
});

export { classes_get as default };
//# sourceMappingURL=classes.get.mjs.map
