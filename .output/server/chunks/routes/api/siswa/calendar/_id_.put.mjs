import { c as defineEventHandler, g as getRouterParam, r as readBody, p as prisma, e as createError } from '../../../../_/nitro.mjs';
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
  const { title, description, date, timeStart, timeEnd, color } = await readBody(event);
  const existing = await prisma.agenda.findFirst({ where: { id, userId: auth.userId } });
  if (!existing) throw createError({ statusCode: 404, message: "Agenda tidak ditemukan." });
  const agenda = await prisma.agenda.update({
    where: { id },
    data: {
      title: title != null ? title : existing.title,
      description: description !== void 0 ? description : existing.description,
      date: date ? new Date(date) : existing.date,
      timeStart: timeStart != null ? timeStart : existing.timeStart,
      timeEnd: timeEnd !== void 0 ? timeEnd : existing.timeEnd,
      color: color != null ? color : existing.color
    }
  });
  return {
    id: agenda.id,
    source: "manual",
    title: agenda.title,
    description: agenda.description,
    date: agenda.date.toISOString().slice(0, 10),
    timeStart: agenda.timeStart,
    timeEnd: agenda.timeEnd || "",
    color: agenda.color,
    mandatory: false
  };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
