import { c as defineEventHandler, n as getOperatorScope, e as createError, r as readBody, p as prisma } from '../../../../_/nitro.mjs';
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

const logo_put = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  if (!scope.isScoped || !scope.extracurricularId) {
    throw createError({ statusCode: 403, message: "Akun belum diikat ke ekskul. Hubungi admin." });
  }
  const { logoUrl } = await readBody(event);
  if (typeof logoUrl !== "string") {
    throw createError({ statusCode: 400, message: "URL logo tidak valid." });
  }
  const ekskul = await prisma.extracurricular.findFirst({
    where: { id: scope.extracurricularId, institutionId: auth.institutionId }
  });
  if (!ekskul) throw createError({ statusCode: 404, message: "Ekskul tidak ditemukan." });
  return prisma.extracurricular.update({
    where: { id: ekskul.id },
    data: { logoUrl: logoUrl || null }
  });
});

export { logo_put as default };
//# sourceMappingURL=logo.put.mjs.map
