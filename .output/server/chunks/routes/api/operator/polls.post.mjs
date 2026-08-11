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

const polls_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { question, options, extracurricularId, endDate } = await readBody(event);
  if (!question || !(options == null ? void 0 : options.length) || !extracurricularId || !endDate) {
    throw createError({ statusCode: 400, message: "Pertanyaan, opsi, ekskul, dan tanggal berakhir wajib diisi." });
  }
  const poll = await prisma.poll.create({
    data: {
      question,
      endDate: new Date(endDate),
      active: true,
      extracurricularId,
      institutionId: auth.institutionId,
      createdById: auth.userId,
      options: { create: options.map((o) => ({ label: o })) }
    },
    include: {
      options: { select: { id: true, label: true, votesCount: true } },
      extracurricular: { select: { name: true } }
    }
  });
  return {
    id: poll.id,
    question: poll.question,
    options: poll.options.map((o) => ({ id: o.id, label: o.label, votes: o.votesCount })),
    ekskul: poll.extracurricular.name,
    ekskulId: poll.extracurricularId,
    endDate: poll.endDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    active: poll.active
  };
});

export { polls_post as default };
//# sourceMappingURL=polls.post.mjs.map
