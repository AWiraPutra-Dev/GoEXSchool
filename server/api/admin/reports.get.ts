import { reportBuilders, isReportType, type ReportType } from '~~/server/utils/reports'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const q = getQuery(event)
  const type = (q.type as string) || ''

  if (!isReportType(type)) {
    throw createError({ statusCode: 400, message: 'Tipe laporan tidak dikenal.' })
  }

  const builder = reportBuilders[type] as Function

  if (type === 'achievements') {
    return builder(auth.institutionId, {
      level: (q.level as string) || undefined,
      class: (q.class as string) || undefined,
    })
  }

  if (type === 'annual') {
    return builder(auth.institutionId, {
      ekskul: (q.ekskul as string) || undefined,
      class: (q.class as string) || undefined,
    })
  }

  return builder(auth.institutionId)
})