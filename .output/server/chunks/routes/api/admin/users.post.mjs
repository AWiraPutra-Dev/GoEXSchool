import { c as defineEventHandler, r as readBody, e as createError, p as prisma } from '../../../_/nitro.mjs';
import { hash } from 'bcrypt-ts';
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

const users_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { username, password, name, role, phone, email, permissions } = await readBody(event);
  if (!username || !password || !name || !role) {
    throw createError({ statusCode: 400, message: "Username, password, nama, dan role wajib diisi." });
  }
  if (password.length < 6) {
    throw createError({ statusCode: 400, message: "Password minimal 6 karakter." });
  }
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) throw createError({ statusCode: 409, message: "Username sudah digunakan." });
  const passwordHash = await hash(password, 10);
  return prisma.user.create({
    data: {
      username,
      passwordHash,
      name,
      role,
      phone,
      email,
      institutionId: auth.institutionId,
      permissions: (permissions == null ? void 0 : permissions.length) ? {
        create: permissions.map((p) => ({ permissionId: p }))
      } : void 0
    },
    include: { permissions: true }
  });
});

export { users_post as default };
//# sourceMappingURL=users.post.mjs.map
