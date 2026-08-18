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
    include: {
      permissions: true,
      student: { select: { nis: true, class: true } },
      extracurricularOperator: { select: { id: true, name: true } }
    },
    orderBy: { name: "asc" }
  });
  return users.map((u) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
      id: u.id,
      name: u.name,
      username: u.username,
      role: u.role,
      phone: u.phone,
      email: u.email,
      status: u.status,
      permissions: u.permissions,
      nis: (_b = (_a = u.student) == null ? void 0 : _a.nis) != null ? _b : null,
      class: (_d = (_c = u.student) == null ? void 0 : _c.class) != null ? _d : null,
      extracurricularId: (_e = u.extracurricularId) != null ? _e : null,
      ekskul: (_g = (_f = u.extracurricularOperator) == null ? void 0 : _f.name) != null ? _g : null
    };
  });
});

export { users_get as default };
//# sourceMappingURL=users.get.mjs.map
