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

const gallery_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const galleries = await prisma.gallery.findMany({
    where: { institutionId: auth.institutionId },
    include: { extracurricular: { select: { name: true } } },
    orderBy: { date: "desc" }
  });
  return galleries.map((g) => ({
    id: g.id,
    title: g.title,
    ekskul: g.extracurricular.name,
    ekskulId: g.extracurricularId,
    date: g.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    color: g.color,
    imageCount: g.imageCount
  }));
});

export { gallery_get as default };
//# sourceMappingURL=gallery.get.mjs.map
