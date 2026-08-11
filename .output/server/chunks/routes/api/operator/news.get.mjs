import { c as defineEventHandler, h as getQuery, p as prisma } from '../../../_/nitro.mjs';
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

const news_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const query = getQuery(event);
  const where = { institutionId: auth.institutionId };
  if (query.ekskulId) where.extracurricularId = String(query.ekskulId);
  const news = await prisma.news.findMany({
    where,
    include: { extracurricular: { select: { name: true } } },
    orderBy: { createdAt: "desc" }
  });
  return news.map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    isPublic: n.isPublic,
    ekskul: n.extracurricular.name,
    ekskulId: n.extracurricularId,
    author: n.author,
    date: n.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  }));
});

export { news_get as default };
//# sourceMappingURL=news.get.mjs.map
