import { c as defineEventHandler, r as readBody, e as createError, p as prisma, x as formatSchoolTimeServer } from '../../../../_/nitro.mjs';
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

function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371e3;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
const scan_post = defineEventHandler(async (event) => {
  var _a;
  const auth = event.context.auth;
  const { token, latitude, longitude } = await readBody(event);
  if (!token) {
    throw createError({ statusCode: 400, message: "Token QR wajib diisi." });
  }
  const session = await prisma.attendanceSession.findUnique({
    where: { qrToken: token },
    include: { extracurricular: { select: { institutionId: true } } }
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
  let zoneLat = null;
  let zoneLng = null;
  let zoneRadius = 200;
  let zoneName = null;
  if (typeof session.latitude === "number" && typeof session.longitude === "number") {
    zoneLat = session.latitude;
    zoneLng = session.longitude;
    zoneRadius = (_a = session.radius) != null ? _a : 200;
    zoneName = session.locationName;
  } else {
    const inst = await prisma.institution.findUnique({
      where: { id: auth.institutionId },
      select: { latitude: true, longitude: true, attendanceRadius: true }
    });
    if (!(inst == null ? void 0 : inst.latitude) || !(inst == null ? void 0 : inst.longitude)) {
      throw createError({ statusCode: 400, message: "Lokasi absensi belum diatur. Operator perlu menandai lokasi saat membuat QR, atau admin mengatur lokasi sekolah di Pengaturan Instansi." });
    }
    zoneLat = inst.latitude;
    zoneLng = inst.longitude;
    zoneRadius = inst.attendanceRadius || 200;
  }
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw createError({ statusCode: 400, message: "Lokasi kamu tidak valid. Aktifkan GPS dan coba lagi." });
  }
  const radius = zoneRadius;
  const distance = haversineMeters(lat, lng, zoneLat, zoneLng);
  const allowed = radius + 30;
  if (distance > allowed) {
    throw createError({
      statusCode: 403,
      message: `Kamu berada di luar area sekolah (jarak ${Math.round(distance)} m dari sekolah, batas ${Math.round(allowed)} m). Absensi hanya bisa dilakukan di sekitar area sekolah.`
    });
  }
  const now = /* @__PURE__ */ new Date();
  const record = await prisma.attendanceRecord.create({
    data: {
      studentId: auth.studentId,
      extracurricularId: session.extracurricularId,
      status: "hadir",
      time: formatSchoolTimeServer(now, zoneLng, { hour: "2-digit", minute: "2-digit" }),
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
    date: formatSchoolTimeServer(record.date, zoneLng, { day: "2-digit", month: "short", year: "numeric" }),
    location: zoneName
  };
});

export { scan_post as default };
//# sourceMappingURL=scan.post.mjs.map
