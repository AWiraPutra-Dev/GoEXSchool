// Template Excel untuk import akun user secara massal (admin/operator/siswa).
// xlsx diimpor dinamis agar tidak ikut dimuat saat server start.
export default defineEventHandler(async (event) => {
  const XLSX = (await import('xlsx')).default
  const wb = XLSX.utils.book_new()

  const wsData = [
    ['Role', 'NIS', 'Username', 'Nama Lengkap', 'Kelas', 'Password', 'Ekskul', 'Telepon', 'Email'],
    ['Siswa', '20250001', '', '', '11 IPA 1', '123456', '', '081234567890', ''],
    ['Operator', '', 'op.basket', 'Budi Santoso', '', '123456', 'Basket', '081298765432', ''],
    ['Admin', '', 'admin2', 'Siti Aminah', '', '123456', '', '', ''],
  ]
  const ws = XLSX.utils.aoa_to_sheet(wsData)
  ws['!cols'] = [
    { wch: 10 },
    { wch: 12 },
    { wch: 16 },
    { wch: 22 },
    { wch: 12 },
    { wch: 12 },
    { wch: 14 },
    { wch: 16 },
    { wch: 24 },
  ]
  XLSX.utils.book_append_sheet(wb, ws, 'Template')

  const petunjuk = XLSX.utils.aoa_to_sheet([
    ['PETUNJUK PENGISIAN TEMPLATE IMPORT AKUN'],
    [],
    ['1. Role (wajib): isi "Admin", "Operator", atau "Siswa".'],
    ['2. NIS (wajib untuk Siswa): NIS harus sudah terdaftar di menu Data Siswa.'],
    ['3. Username (wajib unik): untuk Siswa boleh dikosongkan — otomatis memakai NIS.'],
    ['4. Nama Lengkap (wajib): untuk Siswa boleh dikosongkan — otomatis memakai nama di Data Siswa.'],
    ['5. Kelas (opsional, untuk Siswa): jika diisi, kelas siswa di Data Siswa ikut diperbarui.'],
    ['6. Password (wajib): minimal 6 karakter.'],
    ['7. Ekskul (wajib untuk Operator): isi nama ekskul persis seperti di menu Ekstrakurikuler.'],
    ['8. Telepon & Email: opsional, boleh dikosongkan.'],
    [],
    ['Baris contoh di sheet "Template" hanya panduan — hapus baris contoh sebelum mengunggah file Anda.'],
  ])
  petunjuk['!cols'] = [{ wch: 100 }]
  XLSX.utils.book_append_sheet(wb, petunjuk, 'Petunjuk')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setHeader(event, 'Content-Disposition', 'attachment; filename="template-import-akun.xlsx"')

  return buf
})
