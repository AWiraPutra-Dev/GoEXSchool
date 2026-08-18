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
  const existing = await prisma.user.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!existing) throw createError({ statusCode: 404, message: "User tidak ditemukan." });
  if (existing.role === "admin") {
    throw createError({ statusCode: 400, message: "Akun admin tidak dapat dihapus." });
  }
  await prisma.$transaction(async (tx) => {
    await tx.pollVote.deleteMany({ where: { userId: id } });
    await tx.feedLike.deleteMany({ where: { userId: id } });
    await tx.feedComment.deleteMany({ where: { userId: id } });
    await tx.activityLog.deleteMany({ where: { userId: id } });
    await tx.extracurricularMaterial.deleteMany({ where: { uploadedById: id } });
    await tx.article.deleteMany({ where: { authorId: id } });
    await tx.news.updateMany({ where: { createdById: id }, data: { createdById: null } });
    const createdPolls = await tx.poll.findMany({ where: { createdById: id }, select: { id: true } });
    const pollIds = createdPolls.map((p) => p.id);
    if (pollIds.length) {
      await tx.pollVote.deleteMany({ where: { pollId: { in: pollIds } } });
      await tx.pollOption.deleteMany({ where: { pollId: { in: pollIds } } });
      await tx.poll.deleteMany({ where: { id: { in: pollIds } } });
    }
    const sessions = await tx.attendanceSession.findMany({ where: { createdById: id }, select: { id: true } });
    const sessionIds = sessions.map((s) => s.id);
    if (sessionIds.length) {
      await tx.attendanceRecord.deleteMany({ where: { sessionId: { in: sessionIds } } });
      await tx.attendanceSession.deleteMany({ where: { id: { in: sessionIds } } });
    }
    await tx.userPermission.deleteMany({ where: { userId: id } });
    await tx.user.delete({ where: { id } });
  });
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
