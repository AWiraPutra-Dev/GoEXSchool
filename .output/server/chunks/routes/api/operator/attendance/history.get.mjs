import { c as defineEventHandler, p as prisma } from '../../../../_/nitro.mjs';
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

const history_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const sessions = await prisma.attendanceSession.findMany({
    where: { extracurricular: { institutionId: auth.institutionId } },
    include: {
      extracurricular: { select: { name: true } },
      _count: { select: { records: true } },
      records: { take: 1, orderBy: { createdAt: "desc" } }
    },
    orderBy: { date: "desc" },
    take: 50
  });
  return sessions.map((s) => ({
    id: s.id,
    date: s.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    ekskul: s.extracurricular.name,
    hadir: s.records.filter((r) => r.status === "hadir").length + (s._count.records > 0 ? s._count.records - s.records.filter((r) => r.status !== "hadir").length : 0),
    total: s._count.records,
    status: s.qrExpiresAt > /* @__PURE__ */ new Date() ? "Berlangsung" : "Selesai"
  }));
});

export { history_get as default };
//# sourceMappingURL=history.get.mjs.map
