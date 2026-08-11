import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; studentId?: string }
  const { name, phone, class: className } = await readBody(event)

  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: { name, phone },
  })

  if (auth.studentId) {
    await prisma.student.update({
      where: { id: auth.studentId },
      data: { class: className, phone },
    })
  }

  return {
    id: user.id,
    name: user.name,
    role: user.role,
    phone: user.phone,
  }
})
