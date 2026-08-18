import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const scope = await getOperatorScope(event)
  const body = await readBody(event)
  const { name, className, position, photoUrl, sortOrder, extracurricularId } = body

  if (!name || !position) {
    throw createError({ statusCode: 400, message: 'Nama dan jabatan wajib diisi.' })
  }
  assertScope(scope, extracurricularId)

  const created = await prisma.boardPosition.create({
    data: {
      name,
      className: typeof className === 'string' && className ? className : null,
      position,
      photoUrl: typeof photoUrl === 'string' && photoUrl ? photoUrl : null,
      sortOrder: Number(sortOrder) || 0,
      extracurricularId,
      institutionId: auth.institutionId,
    },
    include: { extracurricular: { select: { name: true, logoUrl: true } } },
  })
  return {
    id: created.id,
    name: created.name,
    className: created.className,
    position: created.position,
    photoUrl: created.photoUrl,
    sortOrder: created.sortOrder,
    ekskulId: created.extracurricularId,
    ekskul: created.extracurricular.name,
    ekskulLogo: created.extracurricular.logoUrl,
  }
})
