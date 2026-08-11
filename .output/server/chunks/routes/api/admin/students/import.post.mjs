import { c as defineEventHandler, r as readBody, e as createError, p as prisma } from '../../../../_/nitro.mjs';
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

const import_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { students } = await readBody(event);
  if (!students || !Array.isArray(students) || students.length === 0) {
    throw createError({ statusCode: 400, message: "Data siswa wajib diisi." });
  }
  const year = (/* @__PURE__ */ new Date()).getFullYear().toString();
  const lastStudent = await prisma.student.findFirst({
    where: { institutionId: auth.institutionId, nis: { startsWith: year } },
    orderBy: { nis: "desc" }
  });
  let nextSeq = lastStudent ? Number(lastStudent.nis.slice(4)) + 1 : 1;
  const created = [];
  for (const s of students) {
    if (!s.name || !s.class || !s.gender) continue;
    const nis = `${year}${String(nextSeq).padStart(4, "0")}`;
    const student = await prisma.student.create({
      data: { nis, name: s.name, class: s.class, gender: s.gender, phone: s.phone || null, institutionId: auth.institutionId }
    });
    created.push(student);
    nextSeq++;
  }
  await prisma.activityLog.create({
    data: { action: `Mengimpor ${created.length} data siswa baru`, userId: auth.userId, institutionId: auth.institutionId }
  });
  return { success: true, count: created.length, students: created };
});

export { import_post as default };
//# sourceMappingURL=import.post.mjs.map
