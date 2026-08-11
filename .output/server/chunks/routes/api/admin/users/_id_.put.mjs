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
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const { name, phone, email, status, permissions } = await readBody(event);
  const user = await prisma.user.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!user) throw createError({ statusCode: 404, message: "User tidak ditemukan." });
  const data = { name, phone, email };
  if (status) data.status = status;
  if (permissions !== void 0) {
    await prisma.userPermission.deleteMany({ where: { userId: id } });
    if (permissions.length > 0) {
      await prisma.userPermission.createMany({
        data: permissions.map((p) => ({ userId: id, permissionId: p }))
      });
    }
  }
  return prisma.user.update({
    where: { id },
    data,
    include: { permissions: true }
  });
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
