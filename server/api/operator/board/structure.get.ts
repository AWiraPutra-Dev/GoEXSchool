import { prisma } from '~~/server/utils/prisma'

// Pengaturan tampilan Struktur Organisasi per ekskul.
// Dipakai halaman admin/operator (pilih ekskul → atur mode, tema, desain).
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const scope = await getOperatorScope(event)

  const ekskuls = await prisma.extracurricular.findMany({
    where: {
      institutionId: auth.institutionId,
      ...(scope.isScoped ? { id: scope.extracurricularId ?? '' } : {}),
    },
    select: {
      id: true,
      name: true,
      logoUrl: true,
      structureMode: true,
      structureImageUrl: true,
      structureTheme: true,
      _count: { select: { boardPositions: true } },
    },
    orderBy: { name: 'asc' },
  })

  return ekskuls.map(e => ({
    ekskulId: e.id,
    ekskul: e.name,
    ekskulLogo: e.logoUrl,
    mode: e.structureMode,
    imageUrl: e.structureImageUrl,
    theme: e.structureTheme,
    positionCount: e._count.boardPositions,
  }))
})
