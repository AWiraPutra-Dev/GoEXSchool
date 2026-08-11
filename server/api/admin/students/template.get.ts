import XLSX from 'xlsx'

export default defineEventHandler(async (event) => {
  const wb = XLSX.utils.book_new()
  const wsData = [
    ['Nama Lengkap', 'Kelas', 'Jenis Kelamin', 'Telepon'],
    ['Contoh: Ahmad Rizki', '11 IPA 1', 'L', '081234567890'],
    ['Contoh: Siti Nurhaliza', '11 IPA 2', 'P', ''],
  ]
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  ws['!cols'] = [
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Template')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setHeader(event, 'Content-Disposition', 'attachment; filename="template-import-siswa.xlsx"')

  return buf
})
