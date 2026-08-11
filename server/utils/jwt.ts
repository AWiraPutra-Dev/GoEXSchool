import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'eskulhub-jwt-secret-key-2026'

export interface JwtPayload {
  userId: string
  username: string
  role: string
  institutionId: string
  studentId?: string
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload
}
