import { c as defineEventHandler, n as getOperatorScope, o as scopeFilter, p as prisma } from '../../../_/nitro.mjs';
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

const articles_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const where = { institutionId: auth.institutionId, ...scopeFilter(scope) };
  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      extracurricular: { select: { name: true, logoUrl: true } },
      _count: { select: { views: true } }
    }
  });
  return articles.map((a) => {
    var _a, _b, _c, _d;
    return {
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      category: a.category,
      status: a.status,
      author: a.author.name,
      ekskul: (_b = (_a = a.extracurricular) == null ? void 0 : _a.name) != null ? _b : null,
      ekskulLogo: (_d = (_c = a.extracurricular) == null ? void 0 : _c.logoUrl) != null ? _d : null,
      ekskulId: a.extracurricularId,
      viewCount: a._count.views,
      createdAt: a.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      updatedAt: a.updatedAt
    };
  });
});

export { articles_get as default };
//# sourceMappingURL=articles.get.mjs.map
