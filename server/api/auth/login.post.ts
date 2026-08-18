import { prisma } from '~~/server/utils/prisma'
import { generateToken } from '~~/server/utils/jwt'
import { compare } from 'bcrypt-ts'
import { toInstitutionSummary } from '~~/server/utils/institution'

export default defineEventHandler(async (event) => {
  const { identifier, password, role } = await readBody(event)

  if (!identifier || !password || !role) {
    throw createError({ statusCode: 400, message: 'Username/NIS, password, dan role wajib diisi.' })
  }

  let user

  if (role === 'student') {
    user = await prisma.user.findFirst({
      where: { username: identifier, role: 'student' },
      include: {
        student: true,
        institution: true,
        permissions: true,
        extracurricularOperator: { select: { id: true, name: true } },
      }
    })
  } else {
    user = await prisma.user.findFirst({
      where: { username: identifier, role: role as 'admin' | 'operator' },
      include: {
        institution: true,
        permissions: true,
        extracurricularOperator: { select: { id: true, name: true } },
      }
    })
  }

  if (!user) {
    throw createError({ statusCode: 401, message: 'Akun tidak ditemukan.' })
  }

  if (user.status === 'inactive') {
    throw createError({ statusCode: 403, message: 'Akun ini telah dinonaktifkan.' })
  }

  const valid = await compare(password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Password salah.' })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  })

  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role,
    institutionId: user.institutionId,
    studentId: user.student?.id || undefined,
  })

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      nis: user.student?.nis || null,
      class: user.student?.class || null,
      phone: user.phone,
      avatar: user.avatarUrl || null,
      extracurricular: user.extracurricularOperator ? { id: user.extracurricularOperator.id, name: user.extracurricularOperator.name } : null,
      permissions: user.permissions.map(p => p.permissionId)
    },
    institution: toInstitutionSummary(user.institution)
  }
})
