import { c as defineEventHandler, e as createError, p as prisma, m as toInstitutionSummary } from '../../../_/nitro.mjs';
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

const me_get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const auth = event.context.auth;
  if (!auth) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: {
      student: true,
      institution: true,
      extracurricularOperator: { select: { id: true, name: true } }
    }
  });
  if (!user) {
    throw createError({ statusCode: 404, message: "User tidak ditemukan." });
  }
  return {
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      nis: ((_a = user.student) == null ? void 0 : _a.nis) || null,
      class: ((_b = user.student) == null ? void 0 : _b.class) || null,
      phone: user.phone,
      avatar: ((_c = user.student) == null ? void 0 : _c.nis) ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4A9E9E&color=fff` : null,
      extracurricular: user.extracurricularOperator ? { id: user.extracurricularOperator.id, name: user.extracurricularOperator.name } : null
    },
    institution: toInstitutionSummary(user.institution)
  };
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
