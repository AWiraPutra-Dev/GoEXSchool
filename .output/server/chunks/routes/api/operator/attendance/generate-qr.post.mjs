import { c as defineEventHandler, r as readBody, e as createError } from '../../../../_/nitro.mjs';
import nodeCrypto from 'node:crypto';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import '@iconify/utils';
import 'consola';
import 'node:path';

const generateQr_post = defineEventHandler(async (event) => {
  const { ekskulId } = await readBody(event);
  if (!ekskulId) {
    throw createError({ statusCode: 400, message: "ekskulId wajib diisi." });
  }
  const token = nodeCrypto.randomBytes(12).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1e3);
  return {
    token,
    expiresAt: expiresAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  };
});

export { generateQr_post as default };
//# sourceMappingURL=generate-qr.post.mjs.map
