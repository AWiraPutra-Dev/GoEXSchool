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
  const user = await prisma.user.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!user) throw createError({ statusCode: 404, message: "User tidak ditemukan." });
  await prisma.userPermission.deleteMany({ where: { userId: id } });
  await prisma.feedComment.deleteMany({ where: { userId: id } });
  await prisma.feedLike.deleteMany({ where: { userId: id } });
  await prisma.pollVote.deleteMany({ where: { userId: id } });
  await prisma.activityLog.deleteMany({ where: { userId: id } });
  await prisma.attendanceSession.deleteMany({ where: { createdById: id } });
  if (user.studentId) {
    await prisma.student.update({ where: { id: user.studentId }, data: { accountStatus: "imported" } });
  }
  await prisma.user.delete({ where: { id } });
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
