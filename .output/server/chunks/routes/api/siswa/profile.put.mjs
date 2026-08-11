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

const profile_put = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { name, phone, class: className } = await readBody(event);
  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: { name, phone }
  });
  if (auth.studentId) {
    await prisma.student.update({
      where: { id: auth.studentId },
      data: { class: className, phone }
    });
  }
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    phone: user.phone
  };
});

export { profile_put as default };
//# sourceMappingURL=profile.put.mjs.map
