import { prisma } from '~~/server/utils/prisma'

// Admin (hanya admin / super_admin — dijaga middleware /api/admin/*) menghapus
// prestasi siswa mana pun di instansinya.
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const existing = await prisma.achievement.findFirst({
    where: { id, student: { institutionId: auth.institutionId } },
  })
  if (!existing) throw createError({ statusCode: 404, message: 'Prestasi tidak ditemukan.' })
  await prisma.achievement.delete({ where: { id } })
  return { success: true }
})
