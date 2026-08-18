import { c as defineEventHandler, p as prisma } from '../../../_/nitro.mjs';
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

const feed_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const posts = await prisma.feedPost.findMany({
    where: { institutionId: auth.institutionId },
    include: {
      extracurricular: { select: { name: true } },
      comments: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "asc" }
      },
      likes: { where: { userId: auth.userId }, select: { id: true } },
      _count: { select: { likes: true, comments: true } }
    },
    orderBy: { date: "desc" }
  });
  const initialsOf = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const safeAvatar = (avatar, author) => avatar && !avatar.includes("/") && avatar.length <= 3 ? avatar : initialsOf(author);
  return posts.map((p) => ({
    id: p.id,
    type: p.type,
    title: p.title,
    content: p.content,
    author: p.author,
    ekskul: p.extracurricular.name,
    avatar: safeAvatar(p.avatar, p.author),
    date: p.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) + ", " + p.createdAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    likes: p._count.likes,
    liked: p.likes.length > 0,
    comments: p.comments.map((c) => ({
      id: c.id,
      user: c.user.name,
      avatar: c.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      text: c.text,
      time: ""
    })),
    commentCount: p._count.comments
  }));
});

export { feed_get as default };
//# sourceMappingURL=feed.get.mjs.map
