import { prisma } from '~~/server/utils/prisma'

const TILE_TYPES = ['person', 'image']

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const existing = await prisma.boardPosition.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Jabatan tidak ditemukan.' })

  // Hanya admin & operator pemilik ekskul yang boleh mengubah struktur.
  await assertStructureEditor(event, existing.extracurricularId)

  const body = await readBody(event)
  const data: any = {}
  const type = TILE_TYPES.includes(body.type) ? body.type : existing.type

  if (type === 'person') {
    if (body.name !== undefined) data.name = body.name
    if (body.className !== undefined) data.className = typeof body.className === 'string' && body.className ? body.className : null
    if (body.position !== undefined) data.position = body.position
    if (body.photoUrl !== undefined) data.photoUrl = typeof body.photoUrl === 'string' && body.photoUrl ? body.photoUrl : null
  } else {
    if (body.imageUrl !== undefined) data.imageUrl = typeof body.imageUrl === 'string' && body.imageUrl ? body.imageUrl : null
  }
  if (body.type !== undefined) data.type = type
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0

  const updated = await prisma.boardPosition.update({
    where: { id },
    data,
    include: { extracurricular: { select: { name: true, logoUrl: true } } },
  })
  return {
    id: updated.id,
    type: updated.type,
    name: updated.name,
    className: updated.className,
    position: updated.position,
    photoUrl: updated.photoUrl,
    imageUrl: updated.imageUrl,
    sortOrder: updated.sortOrder,
    ekskulId: updated.extracurricularId,
    ekskul: updated.extracurricular.name,
    ekskulLogo: updated.extracurricular.logoUrl,
  }
})
