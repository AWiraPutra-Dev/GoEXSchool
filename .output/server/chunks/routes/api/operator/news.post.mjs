import { c as defineEventHandler, n as getOperatorScope, r as readBody, e as createError, q as assertScope, p as prisma } from '../../../_/nitro.mjs';
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

const news_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const { title, content, isPublic, extracurricularId, author } = await readBody(event);
  if (!title || !content || !extracurricularId || !author) {
    throw createError({ statusCode: 400, message: "Judul, konten, ekskul, dan penulis wajib diisi." });
  }
  assertScope(scope, extracurricularId);
  const news = await prisma.news.create({
    data: { title, content, isPublic: !!isPublic, author, extracurricularId, institutionId: auth.institutionId, createdById: auth.userId },
    include: { extracurricular: { select: { name: true } } }
  });
  return {
    id: news.id,
    title: news.title,
    content: news.content,
    isPublic: news.isPublic,
    ekskul: news.extracurricular.name,
    ekskulId: news.extracurricularId,
    author: news.author,
    date: news.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  };
});

export { news_post as default };
//# sourceMappingURL=news.post.mjs.map
