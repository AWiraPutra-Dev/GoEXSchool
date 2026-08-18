import { c as defineEventHandler, f as getQuery, j as attendanceRows } from '../../../../_/nitro.mjs';
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

const attendanceDetail_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const q = getQuery(event);
  const ekskul = q.ekskul || "";
  const start = q.start || "";
  const end = q.end || "";
  const page = Math.max(1, Number(q.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(q.pageSize) || 20));
  const { total, records } = await attendanceRows(
    auth.institutionId,
    { ekskul, start, end },
    { skip: (page - 1) * pageSize, take: pageSize }
  );
  return {
    records,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  };
});

export { attendanceDetail_get as default };
//# sourceMappingURL=attendance-detail.get.mjs.map
