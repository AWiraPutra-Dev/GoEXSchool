import { prisma } from '~~/server/utils/prisma'

const TILE_TYPES = ['person', 'image']

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const body = await readBody(event)
  const { name, className, position, photoUrl, imageUrl, sortOrder, extracurricularId } = body
  const type = TILE_TYPES.includes(body.type) ? body.type : 'person'

  if (type === 'person') {
    if (!name || !position) {
      throw createError({ statusCode: 400, message: 'Nama dan jabatan wajib diisi.' })
    }
  } else if (!imageUrl) {
    throw createError({ statusCode: 400, message: 'Gambar desain wajib diupload.' })
  }
  // Hanya admin & operator pemilik ekskul yang boleh mengubah struktur.
  await assertStructureEditor(event, extracurricularId)

  const created = await prisma.boardPosition.create({
    data: {
      type,
      name: type === 'person' ? name : '',
      className: type === 'person' && typeof className === 'string' && className ? className : null,
      position: type === 'person' ? position : '',
      photoUrl: type === 'person' && typeof photoUrl === 'string' && photoUrl ? photoUrl : null,
      imageUrl: type === 'image' && typeof imageUrl === 'string' ? imageUrl : null,
      sortOrder: Number(sortOrder) || 0,
      extracurricularId,
      institutionId: auth.institutionId,
    },
    include: { extracurricular: { select: { name: true, logoUrl: true } } },
  })
  return {
    id: created.id,
    type: created.type,
    name: created.name,
    className: created.className,
    position: created.position,
    photoUrl: created.photoUrl,
    imageUrl: created.imageUrl,
    sortOrder: created.sortOrder,
    ekskulId: created.extracurricularId,
    ekskul: created.extracurricular.name,
    ekskulLogo: created.extracurricular.logoUrl,
  }
})
