import { c as defineEventHandler, r as readBody, e as createError, p as prisma } from '../../../_/nitro.mjs';
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

const students_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { name, class: className, gender, phone } = await readBody(event);
  if (!name || !className || !gender) {
    throw createError({ statusCode: 400, message: "Nama, kelas, dan jenis kelamin wajib diisi." });
  }
  const year = (/* @__PURE__ */ new Date()).getFullYear().toString();
  const lastStudent = await prisma.student.findFirst({
    where: { institutionId: auth.institutionId, nis: { startsWith: year } },
    orderBy: { nis: "desc" }
  });
  const nextSeq = lastStudent ? String(Number(lastStudent.nis.slice(4)) + 1).padStart(4, "0") : "0001";
  const nis = `${year}${nextSeq}`;
  const student = await prisma.student.create({
    data: { nis, name, class: className, gender, phone, institutionId: auth.institutionId }
  });
  return student;
});

export { students_post as default };
//# sourceMappingURL=students.post.mjs.map
