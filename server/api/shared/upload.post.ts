import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

// Upload file untuk SEMUA role yang sudah login (siswa & operator ekskul
// memakai ini untuk foto profil). Tipe dibatasi gambar agar aman.
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

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
    throw createError({ statusCode: 400, message: 'Tipe file tidak diizinkan. Gunakan gambar JPG, PNG, GIF, atau WEBP.' })
  }

  if ((fileField.data.length) > MAX_SIZE) {
    throw createError({ statusCode: 400, message: 'Ukuran file maksimal 5MB.' })
  }

  const ext = fileField.filename.split('.').pop() || 'png'
  const fileName = `${randomUUID()}.${ext}`
  const uploadDir = join(process.cwd(), 'public', 'uploads')
  const filePath = join(uploadDir, fileName)

  try {
    await mkdir(uploadDir, { recursive: true })
    await writeFile(filePath, fileField.data)
  } catch {
    throw createError({ statusCode: 500, message: 'Gagal menyimpan file.' })
  }

  return {
    url: `/uploads/${fileName}`,
    filename: fileField.filename,
    size: fileField.data.length,
    type: fileField.type,
  }
})
