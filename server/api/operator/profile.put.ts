import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string }
  const { name, phone, email, avatarUrl } = await readBody(event)
  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
    },
  })
  return { success: true, avatar: user.avatarUrl || null, name: user.name }
})
