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

const register_post = defineEventHandler(async (event) => {
  const { nis, password } = await readBody(event);
  if (!nis || !password || password.length < 8) {
    throw createError({ statusCode: 400, message: "NIS wajib diisi dan password minimal 8 karakter." });
  }
  const student = await prisma.student.findUnique({ where: { nis } });
  if (!student) {
    throw createError({ statusCode: 404, message: "NIS tidak terdaftar. Hubungi admin sekolah." });
  }
  if (student.accountStatus === "registered") {
    throw createError({ statusCode: 409, message: "NIS sudah terdaftar. Silakan login." });
  }
  const existingUser = await prisma.user.findUnique({ where: { username: nis } });
  if (existingUser) {
    throw createError({ statusCode: 409, message: "NIS sudah memiliki akun." });
  }
  const passwordHash = await hash(password, 10);
  await prisma.$transaction([
    prisma.user.create({
      data: {
        username: nis,
        passwordHash,
        name: student.name,
        role: "student",
        studentId: student.id,
        institutionId: student.institutionId,
        status: "active"
      }
    }),
    prisma.student.update({
      where: { id: student.id },
      data: { accountStatus: "registered" }
    })
  ]);
  return { success: true, message: `Akun untuk ${student.name} berhasil dibuat. Silakan login.` };
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
