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
  const myMemberEkskulIds = (await prisma.member.findMany({ where: { studentId: auth.studentId }, select: { extracurricularId: true } })).map((m) => m.extracurricularId);
  const polls = await prisma.poll.findMany({
    where: {
      institutionId: auth.institutionId,
      extracurricularId: { in: myMemberEkskulIds }
    },
    include: {
      options: { select: { id: true, label: true, votesCount: true } },
      extracurricular: { select: { name: true, logoUrl: true } },
      votes: { where: { userId: auth.userId }, select: { pollOptionId: true } }
    },
    orderBy: [{ active: "desc" }, { createdAt: "desc" }]
  });
  return polls.map((p) => {
    var _a;
    return {
      id: p.id,
      question: p.question,
      options: p.options.map((o) => ({
        id: o.id,
        label: o.label,
        votes: o.votesCount
      })),
      ekskul: p.extracurricular.name,
      ekskulLogo: p.extracurricular.logoUrl,
      endDate: p.endDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      active: p.active,
      myVote: ((_a = p.votes[0]) == null ? void 0 : _a.pollOptionId) || null,
      totalVotes: p.options.reduce((sum, o) => sum + o.votesCount, 0)
    };
  });
});

export { polls_get as default };
//# sourceMappingURL=polls.get.mjs.map
