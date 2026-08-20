import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const existing = await prisma.boardPosition.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Jabatan tidak ditemukan.' })

  // Hanya admin & operator pemilik ekskul yang boleh menghapus struktur.
  await assertStructureEditor(event, existing.extracurricularId)

  await prisma.boardPosition.delete({ where: { id } })
  return { success: true }
})
