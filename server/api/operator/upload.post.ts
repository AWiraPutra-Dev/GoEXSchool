import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'text/plain',
]

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'Tidak ada file yang diupload.' })
  }

  const fileField = formData.find(f => f.name === 'file')
  if (!fileField || !fileField.filename) {
    throw createError({ statusCode: 400, message: 'File tidak valid.' })
  }

  if (!ALLOWED_TYPES.includes(fileField.type as string)) {
    throw createError({ statusCode: 400, message: 'Tipe file tidak diizinkan. Gunakan PDF, gambar, atau dokumen.' })
  }

  if ((fileField.data.length) > MAX_SIZE) {
    throw createError({ statusCode: 400, message: 'Ukuran file maksimal 10MB.' })
  }

  const ext = fileField.filename.split('.').pop() || 'bin'
  const fileName = `${randomUUID()}.${ext}`
  const uploadDir = join(process.cwd(), 'public', 'uploads')
  const filePath = join(uploadDir, fileName)

  try {
    await mkdir(uploadDir, { recursive: true })
    await writeFile(filePath, fileField.data)
  } catch (e) {
    throw createError({ statusCode: 500, message: 'Gagal menyimpan file.' })
  }

  const fileUrl = `/uploads/${fileName}`

  return {
    url: fileUrl,
    filename: fileField.filename,
    size: fileField.data.length,
    type: fileField.type,
  }
})
