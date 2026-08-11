import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const { name, class: className, gender, phone } = await readBody(event)

  const student = await prisma.student.findFirst({ where: { id, institutionId: auth.institutionId } })
  if (!student) throw createError({ statusCode: 404, message: 'Siswa tidak ditemukan.' })

  const updated = await prisma.student.update({
    where: { id },
    data: { name, class: className, gender, phone }
  })

  return updated
})
