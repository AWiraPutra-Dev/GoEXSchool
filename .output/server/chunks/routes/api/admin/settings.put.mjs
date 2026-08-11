import { c as defineEventHandler, r as readBody, p as prisma } from '../../../_/nitro.mjs';
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

const settings_put = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { name, npsn, address, phone, email, website, headmaster, activeYear, activeSemester } = await readBody(event);
  return prisma.institution.update({
    where: { id: auth.institutionId },
    data: { name, npsn, address, phone, email, website, headmaster, activeYear, activeSemester }
  });
});

export { settings_put as default };
//# sourceMappingURL=settings.put.mjs.map
