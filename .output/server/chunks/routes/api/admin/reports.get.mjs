import { c as defineEventHandler, f as getQuery, i as isReportType, e as createError, h as reportBuilders } from '../../../_/nitro.mjs';
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

const reports_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const type = getQuery(event).type || "";
  if (!isReportType(type)) {
    throw createError({ statusCode: 400, message: "Tipe laporan tidak dikenal." });
  }
  return reportBuilders[type](auth.institutionId);
});

export { reports_get as default };
//# sourceMappingURL=reports.get.mjs.map
