import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const { name, quota, scheduleInfo, description, teacherId, logoUrl } = await readBody(event)

  if (!name) {
    throw createError({ statusCode: 400, message: 'Nama ekskul wajib diisi.' })
  }

  return prisma.extracurricular.create({
    data: { name, quota: quota || 30, scheduleInfo, description, teacherId, logoUrl: typeof logoUrl === 'string' ? logoUrl : null, institutionId: auth.institutionId },
    include: { teacher: true, _count: { select: { members: true } } }
  })
})
