import { attendanceRows } from '~~/server/utils/reports'

// Detail kehadiran terpaginasi + terfilter (ekskul & rentang tanggal).
// Dipakai halaman laporan admin agar halaman tetap ringan — tidak semua
// catatan dikirim sekaligus.
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const q = getQuery(event)

  const ekskul = (q.ekskul as string) || ''
  const start = (q.start as string) || ''
  const end = (q.end as string) || ''
  const page = Math.max(1, Number(q.page) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(q.pageSize) || 20))

  const { total, records } = await attendanceRows(
    auth.institutionId,
    { ekskul, start, end },
    { skip: (page - 1) * pageSize, take: pageSize }
  )

  return {
    records,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
})
