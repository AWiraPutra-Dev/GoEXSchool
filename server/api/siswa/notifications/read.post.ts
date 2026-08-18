import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string }
  const body = await readBody(event).catch(() => ({}))
  // Bisa tandai semua dibaca ({}) atau satu notifikasi ({ id })
  if (body?.id) {
    await prisma.notification.updateMany({
      where: { id: body.id, userId: auth.userId },
      data: { read: true },
    })
  } else {
    await prisma.notification.updateMany({
      where: { userId: auth.userId, read: false },
      data: { read: true },
    })
  }
  return { success: true }
})
