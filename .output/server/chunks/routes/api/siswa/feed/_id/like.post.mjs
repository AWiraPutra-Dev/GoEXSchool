import { c as defineEventHandler, g as getRouterParam, p as prisma } from '../../../../../_/nitro.mjs';
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

const like_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const feedPostId = getRouterParam(event, "id");
  const existing = await prisma.feedLike.findUnique({
    where: { userId_feedPostId: { userId: auth.userId, feedPostId } }
  });
  if (existing) {
    await prisma.feedLike.delete({ where: { id: existing.id } });
    await prisma.feedPost.update({ where: { id: feedPostId }, data: { likesCount: { decrement: 1 } } });
    return { liked: false };
  } else {
    await prisma.feedLike.create({ data: { userId: auth.userId, feedPostId } });
    await prisma.feedPost.update({ where: { id: feedPostId }, data: { likesCount: { increment: 1 } } });
    return { liked: true };
  }
});

export { like_post as default };
//# sourceMappingURL=like.post.mjs.map
