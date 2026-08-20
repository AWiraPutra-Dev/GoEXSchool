import { prisma } from '~~/server/utils/prisma'
import { hash } from 'bcrypt-ts'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const { password } = await readBody(event).catch(() => ({}))

  const existing = await prisma.user.findFirst({ where: { id, institutionId: auth.institutionId } })
  if (!existing) throw createError({ statusCode: 404, message: 'User tidak ditemukan.' })

  // Jika admin tidak mengirim password baru, generate password sementara.
  const newPassword = (password && typeof password === 'string' && password.length >= 6)
    ? password
    : Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 4)

  const passwordHash = await hash(newPassword, 10)

  await prisma.user.update({
    where: { id },
    data: { passwordHash },
  })

  return { success: true, username: existing.username, password: newPassword }
})