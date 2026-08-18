import { c as defineEventHandler, g as getRouterParam, r as readBody, p as prisma, e as createError } from '../../../../_/nitro.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const { name, phone, email, status, permissions, extracurricularId } = await readBody(event);
  const existing = await prisma.user.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!existing) throw createError({ statusCode: 404, message: "User tidak ditemukan." });
  const data = {};
  if (name !== void 0) data.name = name;
  if (phone !== void 0) data.phone = phone;
  if (email !== void 0) data.email = email;
  if (status !== void 0) data.status = status;
  if (existing.role === "operator" && extracurricularId !== void 0) {
    if (extracurricularId) {
      const ex = await prisma.extracurricular.findFirst({
        where: { id: extracurricularId, institutionId: auth.institutionId },
        select: { id: true }
      });
      if (!ex) throw createError({ statusCode: 400, message: "Ekskul tidak ditemukan di instansi ini." });
      data.extracurricularId = ex.id;
    } else {
      data.extracurricularId = null;
    }
  }
  if (permissions !== void 0) {
    const permList = Array.isArray(permissions) ? permissions : [];
    data.permissions = {
      deleteMany: {},
      create: permList.map((p) => ({ permissionId: p }))
    };
  }
  const u = await prisma.user.update({
    where: { id },
    data,
    include: {
      permissions: true,
      student: { select: { nis: true, class: true } }
    }
  });
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
    class: (_d = (_c = u.student) == null ? void 0 : _c.class) != null ? _d : null
  };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
