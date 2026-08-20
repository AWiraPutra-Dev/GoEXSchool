// xlsx diimpor dinamis agar tidak ikut dimuat saat server start.
export default defineEventHandler(async (event) => {
  const XLSX = (await import('xlsx')).default
  const wb = XLSX.utils.book_new()

  const wsData = [
    ['NIS', 'Nama Lengkap', 'Kelas', 'Jenis Kelamin', 'Telepon'],
    ['20260001', 'Contoh: Ahmad Rizki', '11 IPA 1', 'L', '081234567890'],
    ['20260002', 'Contoh: Siti Nurhaliza', '11 IPA 2', 'P', ''],
  ]
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  ws['!cols'] = [
    { wch: 12 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Template')

  const petunjuk = XLSX.utils.aoa_to_sheet([
    ['PETUNJUK PENGISIAN TEMPLATE IMPORT SISWA'],
    [],
    ['1. NIS (wajib): nomor induk siswa. Jika dikosongkan, sistem membuatkan otomatis.'],
    ['2. Nama Lengkap (wajib).'],
    ['3. Kelas (wajib): contoh "11 IPA 1".'],
    ['4. Jenis Kelamin (wajib): isi "L" (Laki-laki) atau "P" (Perempuan).'],
    ['5. Telepon: opsional, boleh dikosongkan.'],
    [],
    ['Baris contoh di sheet "Template" hanya panduan — hapus baris contoh sebelum mengunggah file Anda.'],
  ])
  petunjuk['!cols'] = [{ wch: 90 }]
  XLSX.utils.book_append_sheet(wb, petunjuk, 'Petunjuk')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setHeader(event, 'Content-Disposition', 'attachment; filename="template-import-siswa.xlsx"')

  return buf
})
