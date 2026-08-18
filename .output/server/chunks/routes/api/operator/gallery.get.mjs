import { c as defineEventHandler, n as getOperatorScope, p as prisma, o as scopeFilter } from '../../../_/nitro.mjs';
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

const gallery_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const galleries = await prisma.gallery.findMany({
    where: { institutionId: auth.institutionId, ...scopeFilter(scope) },
    include: {
      extracurricular: { select: { name: true, logoUrl: true } },
      images: { select: { id: true, url: true }, orderBy: { createdAt: "asc" } }
    },
    orderBy: { date: "desc" }
  });
  return galleries.map((g) => ({
    id: g.id,
    title: g.title,
    ekskul: g.extracurricular.name,
    ekskulLogo: g.extracurricular.logoUrl,
    ekskulId: g.extracurricularId,
    date: g.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    color: g.color,
    imageCount: g.imageCount,
    images: g.images
  }));
});

export { gallery_get as default };
//# sourceMappingURL=gallery.get.mjs.map
