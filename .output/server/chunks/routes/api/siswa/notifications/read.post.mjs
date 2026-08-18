import { c as defineEventHandler, r as readBody, p as prisma } from '../../../../_/nitro.mjs';
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

const read_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const body = await readBody(event).catch(() => ({}));
  if (body == null ? void 0 : body.id) {
    await prisma.notification.updateMany({
      where: { id: body.id, userId: auth.userId },
      data: { read: true }
    });
  } else {
    await prisma.notification.updateMany({
      where: { userId: auth.userId, read: false },
      data: { read: true }
    });
  }
  return { success: true };
});

export { read_post as default };
//# sourceMappingURL=read.post.mjs.map
