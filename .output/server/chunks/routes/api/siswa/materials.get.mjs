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

const materials_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const myMemberEkskulIds = (await prisma.member.findMany({
    where: { studentId: auth.studentId, status: "active" },
    select: { extracurricularId: true }
  })).map((m) => m.extracurricularId);
  if (myMemberEkskulIds.length === 0) {
    return [];
  }
  const materials = await prisma.extracurricularMaterial.findMany({
    where: {
      institutionId: auth.institutionId,
      extracurricularId: { in: myMemberEkskulIds }
    },
    orderBy: { createdAt: "desc" },
    include: {
      uploadedBy: { select: { name: true } },
      extracurricular: { select: { name: true } }
    }
  });
  return materials.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    fileUrl: m.fileUrl,
    fileType: m.fileType,
    content: m.content,
    ekskul: m.extracurricular.name,
    uploadedBy: m.uploadedBy.name,
    createdAt: m.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  }));
});

export { materials_get as default };
//# sourceMappingURL=materials.get.mjs.map
