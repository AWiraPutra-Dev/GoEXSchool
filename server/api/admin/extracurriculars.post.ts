import { prisma } from '~~/server/utils/prisma'
import { generateInitialsLogo } from '~~/server/utils/initials-logo'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const { name, quota, scheduleInfo, description, teacherId, logoUrl } = await readBody(event)

  if (!name) {
    throw createError({ statusCode: 400, message: 'Nama ekskul wajib diisi.' })
  }

  // Tanpa logo diunggah → buatkan logo inisial otomatis (mis. "Palang Merah Remaja" → PMR)
  let finalLogo = typeof logoUrl === 'string' && logoUrl ? logoUrl : null
  if (!finalLogo) {
    finalLogo = await generateInitialsLogo(name)
  }

  return prisma.extracurricular.create({
    data: { name, quota: quota || 30, scheduleInfo, description, teacherId, logoUrl: finalLogo, institutionId: auth.institutionId },
    include: { teacher: true, _count: { select: { members: true } } }
  })
})
