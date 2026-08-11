import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; userId: string }
  const { title, description, fileUrl, fileType, content, extracurricularId } = await readBody(event)

  if (!title || !extracurricularId) {
    throw createError({ statusCode: 400, message: 'Judul dan ekskul wajib diisi.' })
  }

  if (!fileUrl && !content) {
    throw createError({ statusCode: 400, message: 'Upload file atau isi konten terlebih dahulu.' })
  }

  const material = await prisma.extracurricularMaterial.create({
    data: {
      title,
      description,
      fileUrl,
      fileType: fileType || 'link',
      content,
      extracurricularId,
      uploadedById: auth.userId,
      institutionId: auth.institutionId,
    },
    include: {
      uploadedBy: { select: { name: true } },
      extracurricular: { select: { name: true } },
    },
  })

  return {
    id: material.id,
    title: material.title,
    description: material.description,
    fileUrl: material.fileUrl,
    fileType: material.fileType,
    content: material.content,
    ekskul: material.extracurricular.name,
    ekskulId: material.extracurricularId,
    uploadedBy: material.uploadedBy.name,
    createdAt: material.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }
})
