import { c as defineEventHandler, r as readBody, e as createError, p as prisma } from '../../../_/nitro.mjs';
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

const gallery_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { title, extracurricularId, color, imageUrls } = await readBody(event);
  if (!title || !extracurricularId) {
    throw createError({ statusCode: 400, message: "Judul dan ekskul wajib diisi." });
  }
  const gallery = await prisma.gallery.create({
    data: {
      title,
      color: color || "#4A9E9E",
      imageCount: (imageUrls == null ? void 0 : imageUrls.length) || 0,
      extracurricularId,
      institutionId: auth.institutionId,
      images: (imageUrls == null ? void 0 : imageUrls.length) ? { create: imageUrls.map((url) => ({ url })) } : void 0
    },
    include: {
      extracurricular: { select: { name: true } },
      images: { select: { id: true, url: true } }
    }
  });
  return {
    id: gallery.id,
    title: gallery.title,
    ekskul: gallery.extracurricular.name,
    ekskulId: gallery.extracurricularId,
    date: gallery.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    color: gallery.color,
    imageCount: gallery.imageCount
  };
});

export { gallery_post as default };
//# sourceMappingURL=gallery.post.mjs.map
