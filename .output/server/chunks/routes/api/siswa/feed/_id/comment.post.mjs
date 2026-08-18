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

const comment_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const feedPostId = getRouterParam(event, "id");
  const { text } = await readBody(event);
  if (!(text == null ? void 0 : text.trim())) {
    throw createError({ statusCode: 400, message: "Komentar tidak boleh kosong." });
  }
  const comment = await prisma.feedComment.create({
    data: { text, userId: auth.userId, feedPostId },
    include: { user: { select: { name: true } } }
  });
  return {
    id: comment.id,
    user: comment.user.name,
    avatar: comment.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
    text: comment.text,
    time: "Baru saja"
  };
});

export { comment_post as default };
//# sourceMappingURL=comment.post.mjs.map
