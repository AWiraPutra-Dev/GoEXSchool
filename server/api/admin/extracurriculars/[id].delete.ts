import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')

  const ekskul = await prisma.extracurricular.findFirst({
    where: { id, institutionId: auth.institutionId },
    include: { teacher: true },
  })
  if (!ekskul) throw createError({ statusCode: 404, message: 'Ekskul tidak ditemukan.' })

  // Hitung data terkait dulu agar bisa ditampilkan sebagai peringatan di UI.
  const [memberCount, scheduleCount, assessmentCount, sessionCount, recordCount, pollCount, newsCount, galleryCount, achievementCount, feedCount, articleCount, materialCount, boardCount, operatorCount] = await Promise.all([
    prisma.member.count({ where: { extracurricularId: id } }),
    prisma.schedule.count({ where: { extracurricularId: id } }),
    prisma.assessment.count({ where: { extracurricularId: id } }),
    prisma.attendanceSession.count({ where: { extracurricularId: id } }),
    prisma.attendanceRecord.count({ where: { extracurricularId: id } }),
    prisma.poll.count({ where: { extracurricularId: id } }),
    prisma.news.count({ where: { extracurricularId: id } }),
    prisma.gallery.count({ where: { extracurricularId: id } }),
    prisma.achievement.count({ where: { extracurricularId: id } }),
    prisma.feedPost.count({ where: { extracurricularId: id } }),
    prisma.article.count({ where: { extracurricularId: id } }),
    prisma.extracurricularMaterial.count({ where: { extracurricularId: id } }),
    prisma.boardPosition.count({ where: { extracurricularId: id } }),
    prisma.user.count({ where: { extracurricularId: id } }),
  ])

  const related = [
    { label: 'Anggota ekskul', count: memberCount },
    { label: 'Jadwal', count: scheduleCount },
    { label: 'Penilaian', count: assessmentCount },
    { label: 'Sesi absensi', count: sessionCount },
    { label: 'Rekaman absensi', count: recordCount },
    { label: 'Voting', count: pollCount },
    { label: 'Pengumuman & berita', count: newsCount },
    { label: 'Galeri foto', count: galleryCount },
    { label: 'Prestasi', count: achievementCount },
    { label: 'Postingan feed', count: feedCount },
    { label: 'Artikel blog', count: articleCount },
    { label: 'Materi ekskul', count: materialCount },
    { label: 'Jabatan kepengurusan', count: boardCount },
    { label: 'Akun operator ekskul', count: operatorCount },
  ].filter(r => r.count > 0)

  // Hapus SEMUA data terkait dalam SATU transaction agar tidak ada data
  // yang tertinggal (yatim) bila salah satu langkah gagal di tengah jalan.
  await prisma.$transaction(async (tx) => {
    // Feed: komentar & suka harus dihapus sebelum postingannya.
    const feedPosts = await tx.feedPost.findMany({ where: { extracurricularId: id }, select: { id: true } })
    const feedIds = feedPosts.map(f => f.id)
    if (feedIds.length) {
      await tx.feedComment.deleteMany({ where: { feedPostId: { in: feedIds } } })
      await tx.feedLike.deleteMany({ where: { feedPostId: { in: feedIds } } })
    }

    // Galeri: gambar di dalamnya ikut dihapus.
    const galleries = await tx.gallery.findMany({ where: { extracurricularId: id }, select: { id: true } })
    const galleryIds = galleries.map(g => g.id)
    if (galleryIds.length) {
      await tx.galleryImage.deleteMany({ where: { galleryId: { in: galleryIds } } })
    }

    // Voting: opsi & suara ikut dihapus.
    const polls = await tx.poll.findMany({ where: { extracurricularId: id }, select: { id: true } })
    const pollIds = polls.map(p => p.id)
    if (pollIds.length) {
      await tx.pollVote.deleteMany({ where: { pollId: { in: pollIds } } })
      await tx.pollOption.deleteMany({ where: { pollId: { in: pollIds } } })
    }

    // Artikel: riwayat baca ikut dihapus.
    const articles = await tx.article.findMany({ where: { extracurricularId: id }, select: { id: true } })
    const articleIds = articles.map(a => a.id)
    if (articleIds.length) {
      await tx.articleView.deleteMany({ where: { articleId: { in: articleIds } } })
    }

    await tx.member.deleteMany({ where: { extracurricularId: id } })
    await tx.schedule.deleteMany({ where: { extracurricularId: id } })
    await tx.assessment.deleteMany({ where: { extracurricularId: id } })
    await tx.attendanceSession.deleteMany({ where: { extracurricularId: id } })
    await tx.attendanceRecord.deleteMany({ where: { extracurricularId: id } })
    await tx.poll.deleteMany({ where: { extracurricularId: id } })
    await tx.news.deleteMany({ where: { extracurricularId: id } })
    await tx.gallery.deleteMany({ where: { extracurricularId: id } })
    await tx.achievement.deleteMany({ where: { extracurricularId: id } })
    await tx.feedPost.deleteMany({ where: { extracurricularId: id } })
    await tx.article.deleteMany({ where: { extracurricularId: id } })
    await tx.extracurricularMaterial.deleteMany({ where: { extracurricularId: id } })
    await tx.boardPosition.deleteMany({ where: { extracurricularId: id } })

    // Operator yang terikat ke ekskul ini: lepas ikatannya (akun tetap ada,
    // tapi tidak lagi mengelola ekskul yang sudah dihapus).
    await tx.user.updateMany({
      where: { extracurricularId: id },
      data: { extracurricularId: null },
    })

    await tx.extracurricular.delete({ where: { id } })
  })

  return { success: true, deleted: related.reduce((s, r) => s + r.count, 0), related }
})
