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

const calendar_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { title, description, date, timeStart, timeEnd, color } = await readBody(event);
  if (!title || !date || !timeStart) {
    throw createError({ statusCode: 400, message: "Judul, tanggal, dan jam mulai wajib diisi." });
  }
  const agenda = await prisma.agenda.create({
    data: {
      title,
      description: description || null,
      date: new Date(date),
      timeStart,
      timeEnd: timeEnd || null,
      color: color || "#4A9E9E",
      userId: auth.userId,
      institutionId: auth.institutionId
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

export { calendar_post as default };
//# sourceMappingURL=calendar.post.mjs.map
