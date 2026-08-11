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

const polls_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const polls = await prisma.poll.findMany({
    where: { institutionId: auth.institutionId },
    include: {
      options: { select: { id: true, label: true, votesCount: true } },
      extracurricular: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return polls.map((p) => ({
    id: p.id,
    question: p.question,
    options: p.options.map((o) => ({ id: o.id, label: o.label, votes: o.votesCount })),
    ekskul: p.extracurricular.name,
    ekskulId: p.extracurricularId,
    endDate: p.endDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    active: p.active
  }));
});

export { polls_get as default };
//# sourceMappingURL=polls.get.mjs.map
