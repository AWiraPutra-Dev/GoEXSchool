import { c as defineEventHandler, r as readBody, e as createError, p as prisma } from '../../../_/nitro.mjs';
import { compare, hash } from 'bcrypt-ts';
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

const changePassword_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { oldPassword, newPassword } = await readBody(event);
  if (!oldPassword || !newPassword) {
    throw createError({ statusCode: 400, message: "Password lama dan baru wajib diisi." });
  }
  if (newPassword.length < 6) {
    throw createError({ statusCode: 400, message: "Password baru minimal 6 karakter." });
  }
  const user = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!user) {
    throw createError({ statusCode: 404, message: "User tidak ditemukan." });
  }
  const valid = await compare(oldPassword, user.passwordHash);
  if (!valid) {
    throw createError({ statusCode: 400, message: "Password lama salah." });
  }
  const hashed = await hash(newPassword, 10);
  await prisma.user.update({
    where: { id: auth.userId },
    data: { passwordHash: hashed }
  });
  return { success: true, message: "Password berhasil diubah." };
});

export { changePassword_post as default };
//# sourceMappingURL=change-password.post.mjs.map
