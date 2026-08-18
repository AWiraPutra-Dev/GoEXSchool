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

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);
}
const articles_post = defineEventHandler(async (event) => {
  var _a, _b;
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const { title, content, excerpt, coverImage, category, tags, status, extracurricularId } = await readBody(event);
  if (!title || !content) {
    throw createError({ statusCode: 400, message: "Judul dan konten wajib diisi." });
  }
  let targetEkskul = extracurricularId;
  if (scope.isScoped) {
    targetEkskul = scope.extracurricularId;
  }
  assertScope(scope, targetEkskul || void 0);
  let slug = slugify(title) || "artikel-" + Date.now().toString(36);
  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }
  const article = await prisma.article.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || title.slice(0, 150),
      coverImage,
      category: category || "general",
      tags,
      status: status || "draft",
      authorId: auth.userId,
      institutionId: auth.institutionId,
      ...targetEkskul ? { extracurricularId: targetEkskul } : {}
    },
    include: {
      author: { select: { name: true } },
      extracurricular: { select: { name: true } }
    }
  });
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    status: article.status,
    author: article.author.name,
    ekskul: (_b = (_a = article.extracurricular) == null ? void 0 : _a.name) != null ? _b : null,
    ekskulId: article.extracurricularId,
    createdAt: article.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  };
});

export { articles_post as default };
//# sourceMappingURL=articles.post.mjs.map
