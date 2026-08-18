import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'studentbase-jwt-secret-key-2026'

export interface JwtPayload {
  userId: string
  username: string
  role: string
  institutionId: string
  studentId?: string
}

export function generateToken(payload: JwtPayload): string {
  // Sesi 7 hari — cukup lama agar pengguna yang sudah login tidak sering
  // di-logout, tapi tetap pendek sehingga token yang bocor tidak abadi.
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload
}
