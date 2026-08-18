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

const settings_put = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { name, npsn, address, phone, email, website, headmaster, activeYear, activeSemester, themeColor, logo, latitude, longitude, attendanceRadius } = await readBody(event);
  let lat = null;
  let lng = null;
  let radius = null;
  if (latitude != null && longitude != null) {
    lat = Number(latitude);
    lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw createError({ statusCode: 400, message: "Koordinat lokasi sekolah tidak valid." });
    }
    radius = Math.max(50, Math.min(2e3, Number(attendanceRadius) || 200));
  }
  return prisma.institution.update({
    where: { id: auth.institutionId },
    data: {
      name,
      npsn,
      address,
      phone,
      email,
      website,
      headmaster,
      activeYear,
      activeSemester,
      logo: typeof logo === "string" ? logo : null,
      // Validasi: hanya terima hex 6 digit (#RRGGBB)
      themeColor: typeof themeColor === "string" && /^#[0-9a-fA-F]{6}$/.test(themeColor) ? themeColor : null,
      latitude: lat,
      longitude: lng,
      attendanceRadius: radius
    }
  });
});

export { settings_put as default };
//# sourceMappingURL=settings.put.mjs.map
