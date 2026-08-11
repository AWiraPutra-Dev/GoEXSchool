import { c as defineEventHandler, g as getRouterParam, r as readBody, e as createError, p as prisma } from '../../../../../_/nitro.mjs';
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

const vote_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const pollId = getRouterParam(event, "id");
  const { pollOptionId } = await readBody(event);
  if (!pollOptionId) {
    throw createError({ statusCode: 400, message: "Opsi voting wajib dipilih." });
  }
  const poll = await prisma.poll.findUnique({ where: { id: pollId } });
  if (!poll) throw createError({ statusCode: 404, message: "Voting tidak ditemukan." });
  if (!poll.active) throw createError({ statusCode: 400, message: "Voting sudah ditutup." });
  const option = await prisma.pollOption.findUnique({ where: { id: pollOptionId } });
  if (!option || option.pollId !== pollId) {
    throw createError({ statusCode: 400, message: "Opsi tidak valid." });
  }
  const existingVote = await prisma.pollVote.findUnique({
    where: { pollId_userId: { pollId, userId: auth.userId } }
  });
  if (existingVote) {
    throw createError({ statusCode: 409, message: "Kamu sudah memberikan suara." });
  }
  await prisma.$transaction([
    prisma.pollVote.create({ data: { pollOptionId, pollId, userId: auth.userId } }),
    prisma.pollOption.update({ where: { id: pollOptionId }, data: { votesCount: { increment: 1 } } })
  ]);
  return { success: true };
});

export { vote_post as default };
//# sourceMappingURL=vote.post.mjs.map
