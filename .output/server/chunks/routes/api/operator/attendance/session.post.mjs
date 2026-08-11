import { c as defineEventHandler, r as readBody, e as createError, p as prisma } from '../../../../_/nitro.mjs';
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

const session_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { extracurricularId } = await readBody(event);
  if (!extracurricularId) {
    throw createError({ statusCode: 400, message: "Ekskul wajib diisi." });
  }
  const token = nodeCrypto.randomBytes(12).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1e3);
  const session = await prisma.attendanceSession.create({
    data: { extracurricularId, qrToken: token, qrExpiresAt: expiresAt, createdById: auth.userId, date: /* @__PURE__ */ new Date() }
  });
  return {
    id: session.id,
    token: session.qrToken,
    expiresAt: expiresAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  };
});

export { session_post as default };
//# sourceMappingURL=session.post.mjs.map
