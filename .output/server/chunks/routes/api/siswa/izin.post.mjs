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

const izin_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { extracurricularId, date, reason } = await readBody(event);
  if (!extracurricularId || !date || !(reason == null ? void 0 : reason.trim())) {
    throw createError({ statusCode: 400, message: "Ekskul, tanggal, dan alasan izin wajib diisi." });
  }
  const member = await prisma.member.findFirst({
    where: { studentId: auth.studentId, extracurricularId, status: "active" }
  });
  if (!member) {
    throw createError({ statusCode: 403, message: "Kamu bukan anggota aktif ekskul ini." });
  }
  const d = /* @__PURE__ */ new Date(`${date}T00:00:00`);
  if (isNaN(d.getTime())) {
    throw createError({ statusCode: 400, message: "Tanggal tidak valid." });
  }
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  const dup = await prisma.attendanceRecord.findFirst({
    where: {
      studentId: auth.studentId,
      extracurricularId,
      status: "izin",
      date: { gte: start, lt: end }
    }
  });
  if (dup) {
    throw createError({ statusCode: 409, message: "Izin untuk ekskul dan tanggal ini sudah diajukan." });
  }
  const record = await prisma.attendanceRecord.create({
    data: {
      studentId: auth.studentId,
      extracurricularId,
      status: "izin",
      notes: reason.trim(),
      date: start,
      time: null
    },
    include: {
      student: { select: { nis: true, name: true, class: true } },
      extracurricular: { select: { id: true, name: true } }
    }
  });
  return {
    id: record.id,
    studentId: record.studentId,
    student: record.student.name,
    nis: record.student.nis,
    class: record.student.class,
    ekskulId: record.extracurricularId,
    ekskul: record.extracurricular.name,
    date: record.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    dateISO: record.date.toISOString(),
    reason: record.notes || ""
  };
});

export { izin_post as default };
//# sourceMappingURL=izin.post.mjs.map
