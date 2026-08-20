import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const { name, phone, email, status, permissions, extracurricularId } = await readBody(event)

  const existing = await prisma.user.findFirst({ where: { id, institutionId: auth.institutionId } })
  if (!existing) throw createError({ statusCode: 404, message: 'User tidak ditemukan.' })

  const data: Record<string, any> = {}
  if (name !== undefined) data.name = name
  if (phone !== undefined) data.phone = phone
  if (email !== undefined) data.email = email
  if (status !== undefined) data.status = status

  // Update ikatan ekskul operator (hanya untuk role operator)
  if (existing.role === 'operator' && extracurricularId !== undefined) {
    if (extracurricularId) {
      const ex = await prisma.extracurricular.findFirst({
        where: { id: extracurricularId, institutionId: auth.institutionId },
        select: { id: true },
      })
      if (!ex) throw createError({ statusCode: 400, message: 'Ekskul tidak ditemukan di instansi ini.' })
      data.extracurricularId = ex.id
    } else {
      data.extracurricularId = null
    }
  }
  if (permissions !== undefined) {
    const permList = Array.isArray(permissions) ? permissions : []
    data.permissions = {
      deleteMany: {},
      create: (permList as string[]).map((p: string) => ({ permissionId: p }))
    }
  }

  const u = await prisma.user.update({
    where: { id },
    data,
    include: {
      permissions: true,
      student: { select: { nis: true, class: true } }
    }
  })

  return {
    id: u.id,
    name: u.name,
    username: u.username,
    role: u.role,
    phone: u.phone,
    email: u.email,
    status: u.status,
    lastLogin: u.lastLogin,
    permissions: u.permissions,
    nis: u.student?.nis ?? null,
    class: u.student?.class ?? null
  }
})
