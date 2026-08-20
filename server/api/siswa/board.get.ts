import { prisma } from '~~/server/utils/prisma'

// Struktur Organisasi: semua siswa bisa melihat struktur SEMUA ekskul
// di instansinya (bukan hanya yang diikuti). Setiap ekskul membawa grid
// struktur: kumpulan tile — kartu pengurus (person) atau gambar desain
// (image, mis. potongan Canva).
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }

  const ekskuls = await prisma.extracurricular.findMany({
    where: { institutionId: auth.institutionId },
    select: {
      id: true,
      name: true,
      logoUrl: true,
      boardPositions: {
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        select: { id: true, type: true, name: true, className: true, position: true, photoUrl: true, imageUrl: true, sortOrder: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  // Hanya tampilkan ekskul yang sudah punya isi struktur (minimal 1 tile).
  const groups = ekskuls
    .filter(e => e.boardPositions.length > 0)
    .map(e => ({
      id: e.id,
      ekskul: e.name,
      ekskulLogo: e.logoUrl,
      positions: e.boardPositions.map(p => ({
        id: p.id,
        type: p.type,
        name: p.name,
        className: p.className,
        position: p.position,
        photoUrl: p.photoUrl,
        imageUrl: p.imageUrl,
        sortOrder: p.sortOrder,
      })),
    }))

  return groups
})
