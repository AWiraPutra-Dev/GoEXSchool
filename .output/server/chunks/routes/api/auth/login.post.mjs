import { c as defineEventHandler, r as readBody, e as createError, p as prisma, f as generateToken } from '../../../_/nitro.mjs';
import { compare } from 'bcrypt-ts';
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

const login_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const { identifier, password, role } = await readBody(event);
  if (!identifier || !password || !role) {
    throw createError({ statusCode: 400, message: "Username/NIS, password, dan role wajib diisi." });
  }
  let user;
  if (role === "student") {
    user = await prisma.user.findFirst({
      where: { username: identifier, role: "student" },
      include: { student: true, institution: true }
    });
  } else {
    user = await prisma.user.findFirst({
      where: { username: identifier, role },
      include: { institution: true }
    });
  }
  if (!user) {
    throw createError({ statusCode: 401, message: "Akun tidak ditemukan." });
  }
  if (user.status === "inactive") {
    throw createError({ statusCode: 403, message: "Akun ini telah dinonaktifkan." });
  }
  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    throw createError({ statusCode: 401, message: "Password salah." });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: /* @__PURE__ */ new Date() }
  });
  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role,
    institutionId: user.institutionId,
    studentId: ((_a = user.student) == null ? void 0 : _a.id) || void 0
  });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      nis: ((_b = user.student) == null ? void 0 : _b.nis) || null,
      class: ((_c = user.student) == null ? void 0 : _c.class) || null,
      phone: user.phone,
      avatar: ((_d = user.student) == null ? void 0 : _d.nis) ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4A9E9E&color=fff` : null
    },
    institution: {
      id: user.institution.id,
      name: user.institution.name,
      activeYear: user.institution.activeYear,
      activeSemester: user.institution.activeSemester,
      logo: user.institution.logo
    }
  };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
