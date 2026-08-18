import { reportBuilders, isReportType } from '~~/server/utils/reports'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const type = (getQuery(event).type as string) || ''

  if (!isReportType(type)) {
    throw createError({ statusCode: 400, message: 'Tipe laporan tidak dikenal.' })
  }

  return reportBuilders[type](auth.institutionId)
})
