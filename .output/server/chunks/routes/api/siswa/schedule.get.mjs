import { c as defineEventHandler, p as prisma } from '../../../_/nitro.mjs';
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
  const myMemberEkskulIds = (await prisma.member.findMany({ where: { studentId: auth.studentId }, select: { extracurricularId: true } })).map((m) => m.extracurricularId);
  const schedules = await prisma.schedule.findMany({
    where: { extracurricularId: { in: myMemberEkskulIds } },
    include: { extracurricular: { select: { name: true } } },
    orderBy: [{ day: "asc" }, { timeStart: "asc" }]
  });
  const grouped = {};
  const dayOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  for (const d of dayOrder) grouped[d] = [];
  for (const s of schedules) {
    if (!grouped[s.day]) grouped[s.day] = [];
    grouped[s.day].push({
      time: s.timeEnd ? `${s.timeStart} - ${s.timeEnd}` : s.timeStart,
      ekskul: s.extracurricular.name,
      coach: s.coach,
      location: s.location
    });
  }
  return grouped;
});

export { schedule_get as default };
//# sourceMappingURL=schedule.get.mjs.map
