import { prisma } from '~~/server/utils/prisma'
import { hash } from 'bcrypt-ts'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const { username, password, name, role, phone, email, permissions } = await readBody(event)

  if (!username || !password || !name || !role) {
    throw createError({ statusCode: 400, message: 'Username, password, nama, dan role wajib diisi.' })
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, message: 'Password minimal 6 karakter.' })
  }

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) throw createError({ statusCode: 409, message: 'Username sudah digunakan.' })

  const passwordHash = await hash(password, 10)

  return prisma.user.create({
    data: {
      username,
      passwordHash,
      name,
      role,
      phone,
      email,
      institutionId: auth.institutionId,
      permissions: permissions?.length ? {
        create: permissions.map((p: string) => ({ permissionId: p }))
      } : undefined
    },
    include: { permissions: true }
  })
})
