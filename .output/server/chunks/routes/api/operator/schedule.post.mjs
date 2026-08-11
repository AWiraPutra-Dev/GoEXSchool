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

const schedule_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { day, timeStart, timeEnd, coach, location, extracurricularId } = await readBody(event);
  if (!day || !timeStart || !coach || !location || !extracurricularId) {
    throw createError({ statusCode: 400, message: "Semua field wajib diisi." });
  }
  const schedule = await prisma.schedule.create({
    data: { day, timeStart, timeEnd, coach, location, extracurricularId, institutionId: auth.institutionId },
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

export { schedule_post as default };
//# sourceMappingURL=schedule.post.mjs.map
