import { prisma } from '~~/server/utils/prisma'
import { syncNotifications } from '~~/server/utils/notifications'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; institutionId: string; role: string; studentId?: string }
  await syncNotifications({ ...auth })

  const notifications = await prisma.notification.findMany({
    where: { userId: auth.userId },
    orderBy: [{ read: 'asc' }, { createdAt: 'desc' }],
    take: 50,
  })

  return {
    unread: notifications.filter(n => !n.read).length,
    list: notifications.map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      link: n.link,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    })),
  }
})
