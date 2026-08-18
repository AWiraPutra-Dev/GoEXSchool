import { prisma } from '~~/server/utils/prisma'

const STRUCTURE_MODES = ['cards', 'image']
const STRUCTURE_THEMES = ['indigo', 'sunset', 'forest']

// Perbarui pengaturan Struktur Organisasi sebuah ekskul
// (mode kartu / upload desain, gambar desain, dan tema tampilan).
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const ekskul = await prisma.extracurricular.findUnique({ where: { id } })
  if (!ekskul) throw createError({ statusCode: 404, message: 'Ekskul tidak ditemukan.' })

  const scope = await getOperatorScope(event)
  assertScope(scope, ekskul.id)

  const body = await readBody(event)
  const data: any = {}
  if (body.mode !== undefined) {
    if (!STRUCTURE_MODES.includes(body.mode)) {
      throw createError({ statusCode: 400, message: 'Mode struktur tidak valid.' })
    }
    data.structureMode = body.mode
  }
  if (body.imageUrl !== undefined) {
    data.structureImageUrl = typeof body.imageUrl === 'string' && body.imageUrl ? body.imageUrl : null
  }
  if (body.theme !== undefined) {
    if (!STRUCTURE_THEMES.includes(body.theme)) {
      throw createError({ statusCode: 400, message: 'Tema struktur tidak valid.' })
    }
    data.structureTheme = body.theme
  }

  const updated = await prisma.extracurricular.update({ where: { id }, data })
  return {
    ekskulId: updated.id,
    ekskul: updated.name,
    ekskulLogo: updated.logoUrl,
    mode: updated.structureMode,
    imageUrl: updated.structureImageUrl,
    theme: updated.structureTheme,
  }
})
