import crypto from 'node:crypto'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; userId: string }
  const { extracurricularId } = await readBody(event)
  if (!extracurricularId) {
    throw createError({ statusCode: 400, message: 'Ekskul wajib diisi.' })
  }
  const token = crypto.randomBytes(12).toString('hex')
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
  const session = await prisma.attendanceSession.create({
    data: { extracurricularId, qrToken: token, qrExpiresAt: expiresAt,       createdById: auth.userId, date: new Date() },
  })
  return {
    id: session.id,
    token: session.qrToken,
    expiresAt: expiresAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  }
})
