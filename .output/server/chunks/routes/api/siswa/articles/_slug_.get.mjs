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

const _slug__get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const auth = event.context.auth;
  const slug = getRouterParam(event, "slug");
  const article = await prisma.article.findUnique({
    where: { slug, status: "published" },
    include: {
      author: { select: { name: true } },
      extracurricular: { select: { name: true, logoUrl: true } },
      _count: { select: { views: true } }
    }
  });
  if (!article) {
    throw createError({ statusCode: 404, message: "Artikel tidak ditemukan." });
  }
  await prisma.articleView.upsert({
    where: { articleId_userId: { articleId: article.id, userId: auth.userId } },
    create: { articleId: article.id, userId: auth.userId },
    update: { viewedAt: /* @__PURE__ */ new Date() }
  }).catch(() => {
  });
  const viewCount = await prisma.articleView.count({ where: { articleId: article.id } });
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.excerpt,
    coverImage: article.coverImage,
    category: article.category,
    tags: article.tags,
    author: article.author.name,
    ekskul: (_b = (_a = article.extracurricular) == null ? void 0 : _a.name) != null ? _b : null,
    ekskulLogo: (_d = (_c = article.extracurricular) == null ? void 0 : _c.logoUrl) != null ? _d : null,
    viewCount,
    createdAt: article.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  };
});

export { _slug__get as default };
//# sourceMappingURL=_slug_.get.mjs.map
