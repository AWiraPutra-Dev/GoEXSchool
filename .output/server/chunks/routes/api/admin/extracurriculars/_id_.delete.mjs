import { c as defineEventHandler, g as getRouterParam, p as prisma, e as createError } from '../../../../_/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const ekskul = await prisma.extracurricular.findFirst({
    where: { id, institutionId: auth.institutionId }
  });
  if (!ekskul) throw createError({ statusCode: 404, message: "Ekskul tidak ditemukan." });
  await prisma.member.deleteMany({ where: { extracurricularId: id } });
  await prisma.schedule.deleteMany({ where: { extracurricularId: id } });
  await prisma.attendanceSession.deleteMany({ where: { extracurricularId: id } });
  await prisma.attendanceRecord.deleteMany({ where: { extracurricularId: id } });
  await prisma.poll.deleteMany({ where: { extracurricularId: id } });
  await prisma.news.deleteMany({ where: { extracurricularId: id } });
  await prisma.gallery.deleteMany({ where: { extracurricularId: id } });
  await prisma.achievement.deleteMany({ where: { extracurricularId: id } });
  await prisma.feedPost.deleteMany({ where: { extracurricularId: id } });
  await prisma.extracurricular.delete({ where: { id } });
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
