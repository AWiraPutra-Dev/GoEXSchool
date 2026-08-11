import { c as defineEventHandler, g as getRouterParam, p as prisma, e as createError } from '../../../../../_/nitro.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const session = await prisma.attendanceSession.findUnique({
    where: { id },
    include: {
      records: {
        include: { student: { select: { nis: true, name: true, class: true } } },
        orderBy: { createdAt: "desc" }
      },
      extracurricular: { select: { name: true } }
    }
  });
  if (!session) throw createError({ statusCode: 404, message: "Sesi absensi tidak ditemukan." });
  return {
    id: session.id,
    token: session.qrToken,
    expiresAt: session.qrExpiresAt,
    ekskul: session.extracurricular.name,
    date: session.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    records: session.records.map((r) => ({
      id: r.id,
      nis: r.student.nis,
      name: r.student.name,
      class: r.student.class,
      status: r.status,
      time: r.time,
      notes: r.notes
    }))
  };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
