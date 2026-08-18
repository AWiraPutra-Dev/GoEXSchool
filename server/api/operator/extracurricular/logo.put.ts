import { prisma } from '~~/server/utils/prisma'

// Operator ekskul mengupdate logo ekskul miliknya.
// Hanya bisa mengubah ekskul dalam scope-nya (dicek server-side dari DB).
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const scope = await getOperatorScope(event)
  if (!scope.isScoped || !scope.extracurricularId) {
    throw createError({ statusCode: 403, message: 'Akun belum diikat ke ekskul. Hubungi admin.' })
  }

  const { logoUrl } = await readBody(event)
  if (typeof logoUrl !== 'string') {
    throw createError({ statusCode: 400, message: 'URL logo tidak valid.' })
  }

  const ekskul = await prisma.extracurricular.findFirst({
    where: { id: scope.extracurricularId, institutionId: auth.institutionId },
  })
  if (!ekskul) throw createError({ statusCode: 404, message: 'Ekskul tidak ditemukan.' })

  return prisma.extracurricular.update({
    where: { id: ekskul.id },
    data: { logoUrl: logoUrl || null },
  })
})
