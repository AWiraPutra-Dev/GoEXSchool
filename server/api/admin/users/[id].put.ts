import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const { name, phone, email, status, permissions } = await readBody(event)

  const user = await prisma.user.findFirst({ where: { id, institutionId: auth.institutionId } })
  if (!user) throw createError({ statusCode: 404, message: 'User tidak ditemukan.' })

  const data: any = { name, phone, email }
  if (status) data.status = status

  if (permissions !== undefined) {
    await prisma.userPermission.deleteMany({ where: { userId: id } })
    if (permissions.length > 0) {
      await prisma.userPermission.createMany({
        data: permissions.map((p: string) => ({ userId: id, permissionId: p }))
      })
    }
  }

  return prisma.user.update({
    where: { id },
    data,
    include: { permissions: true }
  })
})
