import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const existing = await prisma.news.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Berita tidak ditemukan.' })
  const scope = await getOperatorScope(event)
  assertScope(scope, existing.extracurricularId)
  const { title, content, isPublic, extracurricularId, author, coverImage, displayStatus } = await readBody(event)
  if (extracurricularId) assertScope(scope, extracurricularId)
  // Operator hanya boleh mengajukan (pending) atau menarik pengajuan (none).
  // Status approved/rejected hanya bisa diatur oleh admin.
  if (displayStatus !== undefined) {
    if (!['pending', 'none'].includes(displayStatus)) {
      throw createError({ statusCode: 403, message: 'Hanya admin yang dapat menyetujui atau menolak pengajuan tampil.' })
    }
  }
  const updated = await prisma.news.update({
    where: { id },
    data: {
      title, content, isPublic: !!isPublic, author, coverImage: coverImage ?? existing.coverImage, extracurricularId,
      ...(displayStatus !== undefined ? { displayStatus } : {}),
    },
  })
  return { success: true, displayStatus: updated.displayStatus }
})
