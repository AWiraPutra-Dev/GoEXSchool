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

const scan_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { token } = await readBody(event);
  if (!token) {
    throw createError({ statusCode: 400, message: "Token QR wajib diisi." });
  }
  const session = await prisma.attendanceSession.findUnique({
    where: { qrToken: token }
  });
  if (!session) {
    throw createError({ statusCode: 404, message: "QR Code tidak valid." });
  }
  if (/* @__PURE__ */ new Date() > session.qrExpiresAt) {
    throw createError({ statusCode: 410, message: "QR Code sudah kadaluarsa." });
  }
  const existing = await prisma.attendanceRecord.findFirst({
    where: { studentId: auth.studentId, sessionId: session.id }
  });
  if (existing) {
    throw createError({ statusCode: 409, message: "Kamu sudah melakukan absensi di sesi ini." });
  }
  const now = /* @__PURE__ */ new Date();
  const record = await prisma.attendanceRecord.create({
    data: {
      studentId: auth.studentId,
      extracurricularId: session.extracurricularId,
      status: "hadir",
      time: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      date: now,
      sessionId: session.id
    },
    include: { extracurricular: { select: { name: true } } }
  });
  return {
    id: record.id,
    ekskul: record.extracurricular.name,
    status: "Hadir",
    time: record.time,
    date: record.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  };
});

export { scan_post as default };
//# sourceMappingURL=scan.post.mjs.map
