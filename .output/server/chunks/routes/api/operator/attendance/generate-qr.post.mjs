import { c as defineEventHandler, n as getOperatorScope, r as readBody, e as createError, q as assertScope, p as prisma } from '../../../../_/nitro.mjs';
import nodeCrypto from 'node:crypto';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import '@iconify/utils';
import 'consola';
import 'node:path';

const generateQr_post = defineEventHandler(async (event) => {
  const scope = await getOperatorScope(event);
  const body = await readBody(event);
  const { ekskulId, latitude, longitude, radius, locationName } = body;
  if (!ekskulId) {
    throw createError({ statusCode: 400, message: "ekskulId wajib diisi." });
  }
  assertScope(scope, ekskulId);
  let lat = null;
  let lng = null;
  let rad = null;
  if (latitude != null && longitude != null) {
    lat = Number(latitude);
    lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw createError({ statusCode: 400, message: "Koordinat lokasi absensi tidak valid." });
    }
    rad = Math.max(50, Math.min(2e3, Number(radius) || 200));
  }
  const token = nodeCrypto.randomBytes(12).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1e3);
  const auth = event.context.auth;
  const session = await prisma.attendanceSession.create({
    data: {
      extracurricularId: ekskulId,
      qrToken: token,
      qrExpiresAt: expiresAt,
      createdById: auth.userId,
      date: /* @__PURE__ */ new Date(),
      latitude: lat,
      longitude: lng,
      radius: rad,
      locationName: typeof locationName === "string" && locationName.trim() ? locationName.trim() : null
    }
  });
  return {
    id: session.id,
    token,
    expiresAt: expiresAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    locationName: session.locationName
  };
});

export { generateQr_post as default };
//# sourceMappingURL=generate-qr.post.mjs.map
