import { c as defineEventHandler, g as getRouterParam, p as prisma, e as createError, n as getOperatorScope, q as assertScope } from '../../../../_/nitro.mjs';
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
  const id = getRouterParam(event, "id");
  const poll = await prisma.poll.findUnique({ where: { id } });
  if (!poll) throw createError({ statusCode: 404, message: "Voting tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, poll.extracurricularId);
  await prisma.pollVote.deleteMany({ where: { pollId: id } });
  await prisma.pollOption.deleteMany({ where: { pollId: id } });
  await prisma.poll.delete({ where: { id } });
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
