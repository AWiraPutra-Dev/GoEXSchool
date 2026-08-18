import { c as defineEventHandler, g as getRouterParam, n as getOperatorScope, r as readBody, q as assertScope, p as prisma, e as createError } from '../../../../_/nitro.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const scope = await getOperatorScope(event);
  const { day, timeStart, timeEnd, coach, location, extracurricularId, mandatory } = await readBody(event);
  if (extracurricularId) assertScope(scope, extracurricularId);
  const existing = await prisma.schedule.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!existing) throw createError({ statusCode: 404, message: "Jadwal tidak ditemukan." });
  assertScope(scope, existing.extracurricularId);
  const schedule = await prisma.schedule.update({
    where: { id },
    data: { day, timeStart, timeEnd, coach, location, extracurricularId, mandatory: mandatory !== void 0 ? mandatory : void 0 },
    include: { extracurricular: { select: { name: true } } }
  });
  return {
    id: schedule.id,
    day: schedule.day,
    timeStart: schedule.timeStart,
    timeEnd: schedule.timeEnd,
    time: schedule.timeEnd ? `${schedule.timeStart} - ${schedule.timeEnd}` : schedule.timeStart,
    ekskul: schedule.extracurricular.name,
    ekskulId: schedule.extracurricularId,
    coach: schedule.coach,
    location: schedule.location,
    mandatory: schedule.mandatory
  };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
