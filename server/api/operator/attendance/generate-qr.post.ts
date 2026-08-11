import crypto from 'node:crypto'
// import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { ekskulId } = await readBody(event)
  if (!ekskulId) {
    throw createError({ statusCode: 400, message: 'ekskulId wajib diisi.' })
  }

  const token = crypto.randomBytes(12).toString('hex')
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // berlaku 15 menit

  // await prisma.attendanceSession.create({
  //   data: { ekskulId, qrToken: token, qrExpiresAt: expiresAt, date: new Date() }
  // })

  return {
    token,
    expiresAt: expiresAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
})
