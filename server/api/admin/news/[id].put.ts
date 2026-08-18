import { prisma } from '~~/server/utils/prisma'

// Admin menyetujui / menolak / membatalkan tampil berita di Event Board siswa.
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const { displayStatus } = await readBody(event)
  if (!['none', 'pending', 'approved', 'rejected'].includes(displayStatus)) {
    throw createError({ statusCode: 400, message: 'Status tampil tidak valid.' })
  }
  const existing = await prisma.news.findFirst({ where: { id, institutionId: auth.institutionId } })
  if (!existing) throw createError({ statusCode: 404, message: 'Berita tidak ditemukan.' })

  const updated = await prisma.news.update({
    where: { id },
    data: { displayStatus },
  })
  return { success: true, displayStatus: updated.displayStatus }
})
