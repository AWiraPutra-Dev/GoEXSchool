import { prisma } from '~~/server/utils/prisma'

// Struktur Organisasi: semua siswa bisa melihat struktur SEMUA ekskul
// di instansinya (bukan hanya yang diikuti). Setiap ekskul membawa
// pengaturan tampilannya: mode (kartu / gambar desain), tema, dan anggota.
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }

  const ekskuls = await prisma.extracurricular.findMany({
    where: { institutionId: auth.institutionId },
    select: {
      id: true,
      name: true,
      logoUrl: true,
      structureMode: true,
      structureImageUrl: true,
      structureTheme: true,
      boardPositions: {
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        select: { id: true, name: true, className: true, position: true, photoUrl: true, sortOrder: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  // Hanya tampilkan ekskul yang sudah punya isi struktur:
  // mode gambar → ada gambar desain; mode kartu → minimal 1 jabatan.
  const groups = ekskuls
    .filter(e => e.structureMode === 'image' ? !!e.structureImageUrl : e.boardPositions.length > 0)
    .map(e => ({
      id: e.id,
      ekskul: e.name,
      ekskulLogo: e.logoUrl,
      mode: e.structureMode,
      imageUrl: e.structureImageUrl,
      theme: e.structureTheme,
      positions: e.boardPositions.map(p => ({
        id: p.id,
        name: p.name,
        className: p.className,
        position: p.position,
        photoUrl: p.photoUrl,
        sortOrder: p.sortOrder,
      })),
    }))

  return groups
})
