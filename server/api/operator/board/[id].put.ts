import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const existing = await prisma.boardPosition.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Jabatan tidak ditemukan.' })

  const scope = await getOperatorScope(event)
  assertScope(scope, existing.extracurricularId)

  const body = await readBody(event)
  const data: any = {}
  if (body.name !== undefined) data.name = body.name
  if (body.className !== undefined) data.className = typeof body.className === 'string' && body.className ? body.className : null
  if (body.position !== undefined) data.position = body.position
  if (body.photoUrl !== undefined) data.photoUrl = typeof body.photoUrl === 'string' && body.photoUrl ? body.photoUrl : null
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0

  const updated = await prisma.boardPosition.update({
    where: { id },
    data,
    include: { extracurricular: { select: { name: true, logoUrl: true } } },
  })
  return {
    id: updated.id,
    name: updated.name,
    className: updated.className,
    position: updated.position,
    photoUrl: updated.photoUrl,
    sortOrder: updated.sortOrder,
    ekskulId: updated.extracurricularId,
    ekskul: updated.extracurricular.name,
    ekskulLogo: updated.extracurricular.logoUrl,
  }
})
