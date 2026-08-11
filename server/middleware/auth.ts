import { verifyToken } from '../utils/jwt'

const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/check-nis']

export default defineEventHandler(async (event) => {
  const path = event.path || event.node.req.url || ''

  if (publicRoutes.some(r => path.startsWith(r))) {
    return
  }

  if (!path.startsWith('/api/')) {
    return
  }

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    const token = authHeader.slice(7)
    const payload = verifyToken(token)
    event.context.auth = payload
  } catch {
    throw createError({ statusCode: 401, message: 'Token tidak valid atau kadaluarsa' })
  }
})
