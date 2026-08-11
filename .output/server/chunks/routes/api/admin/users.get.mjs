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

const users_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const users = await prisma.user.findMany({
    where: { institutionId: auth.institutionId },
    include: { permissions: true },
    orderBy: { name: "asc" }
  });
  return users;
});

export { users_get as default };
//# sourceMappingURL=users.get.mjs.map
