import { c as defineEventHandler, f as getQuery, n as getOperatorScope, o as scopeFilter, p as prisma } from '../../../_/nitro.mjs';
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

const schedule_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const query = getQuery(event);
  const scope = await getOperatorScope(event);
  const where = { institutionId: auth.institutionId, ...scopeFilter(scope, query.ekskulId) };
  const schedules = await prisma.schedule.findMany({
    where,
    include: { extracurricular: { select: { name: true } } },
    orderBy: [{ day: "asc" }, { timeStart: "asc" }]
  });
  return schedules.map((s) => ({
    id: s.id,
    day: s.day,
    timeStart: s.timeStart,
    timeEnd: s.timeEnd,
    time: s.timeEnd ? `${s.timeStart} - ${s.timeEnd}` : s.timeStart,
    ekskul: s.extracurricular.name,
    ekskulId: s.extracurricularId,
    coach: s.coach,
    location: s.location,
    mandatory: s.mandatory
  }));
});

export { schedule_get as default };
//# sourceMappingURL=schedule.get.mjs.map
