import { c as defineEventHandler, y as syncNotifications, p as prisma } from '../../../_/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:path';

const notifications_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  await syncNotifications({ ...auth });
  const notifications = await prisma.notification.findMany({
    where: { userId: auth.userId },
    orderBy: [{ read: "asc" }, { createdAt: "desc" }],
    take: 50
  });
  return {
    unread: notifications.filter((n) => !n.read).length,
    list: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      link: n.link,
      read: n.read,
      createdAt: n.createdAt.toISOString()
    }))
  };
});

export { notifications_get as default };
//# sourceMappingURL=notifications.get.mjs.map
