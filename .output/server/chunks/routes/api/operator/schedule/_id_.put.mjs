import { c as defineEventHandler, g as getRouterParam, r as readBody, p as prisma } from '../../../../_/nitro.mjs';
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
  const { day, timeStart, timeEnd, coach, location, extracurricularId } = await readBody(event);
  const schedule = await prisma.schedule.update({
    where: { id, institutionId: auth.institutionId },
    data: { day, timeStart, timeEnd, coach, location, extracurricularId },
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
    location: schedule.location
  };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
