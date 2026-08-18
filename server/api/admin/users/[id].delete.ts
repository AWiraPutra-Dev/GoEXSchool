import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')

  const existing = await prisma.user.findFirst({ where: { id, institutionId: auth.institutionId } })
  if (!existing) throw createError({ statusCode: 404, message: 'User tidak ditemukan.' })

  if (existing.role === 'admin') {
    throw createError({ statusCode: 400, message: 'Akun admin tidak dapat dihapus.' })
  }

  // Hapus user beserta seluruh data terkaitnya (dalam satu transaksi)
  // agar tidak gagal karena foreign key constraint.
  await prisma.$transaction(async (tx) => {
    // Suara user pada polling
    await tx.pollVote.deleteMany({ where: { userId: id } })

    // Feed: like & komentar
    await tx.feedLike.deleteMany({ where: { userId: id } })
    await tx.feedComment.deleteMany({ where: { userId: id } })

    // Log aktivitas & materi yang diunggah
    await tx.activityLog.deleteMany({ where: { userId: id } })
    await tx.extracurricularMaterial.deleteMany({ where: { uploadedById: id } })

    // Artikel yang ditulis user
    await tx.article.deleteMany({ where: { authorId: id } })

    // Berita: lepaskan keterkaitan pembuat (konten tetap tersimpan)
    await tx.news.updateMany({ where: { createdById: id }, data: { createdById: null } })

    // Polling yang dibuat user (beserta opsi & suara di dalamnya)
    const createdPolls = await tx.poll.findMany({ where: { createdById: id }, select: { id: true } })
    const pollIds = createdPolls.map(p => p.id)
    if (pollIds.length) {
      await tx.pollVote.deleteMany({ where: { pollId: { in: pollIds } } })
      await tx.pollOption.deleteMany({ where: { pollId: { in: pollIds } } })
      await tx.poll.deleteMany({ where: { id: { in: pollIds } } })
    }

    // Sesi absensi yang dibuat user (beserta rekamannya)
    const sessions = await tx.attendanceSession.findMany({ where: { createdById: id }, select: { id: true } })
    const sessionIds = sessions.map(s => s.id)
    if (sessionIds.length) {
      await tx.attendanceRecord.deleteMany({ where: { sessionId: { in: sessionIds } } })
      await tx.attendanceSession.deleteMany({ where: { id: { in: sessionIds } } })
    }

    // Izin & akun itu sendiri
    await tx.userPermission.deleteMany({ where: { userId: id } })
    await tx.user.delete({ where: { id } })
  })

  return { success: true }
})
