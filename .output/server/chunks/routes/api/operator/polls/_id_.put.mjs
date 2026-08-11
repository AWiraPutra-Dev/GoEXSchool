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

const _id__put = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const poll = await prisma.poll.findUnique({ where: { id } });
  if (!poll) throw createError({ statusCode: 404, message: "Voting tidak ditemukan." });
  const updated = await prisma.poll.update({
    where: { id },
    data: { active: !poll.active }
  });
  return { success: true, active: updated.active };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
