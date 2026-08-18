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
  const student = await prisma.student.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!student) throw createError({ statusCode: 404, message: "Siswa tidak ditemukan." });
  await prisma.member.deleteMany({ where: { studentId: id } });
  await prisma.attendanceRecord.deleteMany({ where: { studentId: id } });
  await prisma.achievement.deleteMany({ where: { studentId: id } });
  if (student.accountStatus === "registered") {
    const user = await prisma.user.findUnique({ where: { studentId: id } });
    if (user) {
      await prisma.feedComment.deleteMany({ where: { userId: user.id } });
      await prisma.feedLike.deleteMany({ where: { userId: user.id } });
      await prisma.pollVote.deleteMany({ where: { userId: user.id } });
      await prisma.userPermission.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
  }
  await prisma.student.delete({ where: { id } });
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
