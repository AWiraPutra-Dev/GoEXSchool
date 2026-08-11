import { c as defineEventHandler, h as getQuery, p as prisma } from '../../../_/nitro.mjs';
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

const members_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const query = getQuery(event);
  const members = await prisma.member.findMany({
    where: {
      student: { institutionId: auth.institutionId },
      ...query.ekskulId ? { extracurricularId: String(query.ekskulId) } : {}
    },
    include: {
      student: { select: { nis: true, name: true, class: true } },
      extracurricular: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return members.map((m) => ({
    id: m.id,
    studentId: m.studentId,
    nis: m.student.nis,
    name: m.student.name,
    class: m.student.class,
    ekskul: m.extracurricular.name,
    ekskulId: m.extracurricular.id,
    joinDate: m.joinDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    status: m.status
  }));
});

export { members_get as default };
//# sourceMappingURL=members.get.mjs.map
