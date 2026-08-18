import { PrismaClient } from '@prisma/client'
import { hash as hashBcrypt } from 'bcrypt-ts'

const prisma = new PrismaClient()

async function main() {
  const hash = await hashBcrypt('admin123', 10)
  const hashOp = await hashBcrypt('operator123', 10)
  const hashSiswa = await hashBcrypt('siswa123', 10)

  // Institution
  const inst = await prisma.institution.create({
    data: {
      name: 'SMKN 4 Bandung',
      npsn: '20219144',
      address: 'Jl. Kliningan No. 6, Turangga, Kec. Lengkong, Kota Bandung 40264',
      phone: '022-7303736',
      email: 'info@smkn4bdg.sch.id',
      headmaster: 'Dr. H. Ahmad Fauzi, M.Pd.',
      activeYear: '2025/2026',
      activeSemester: 'Ganjil',
      themeColor: '#4F46E5',
      logo: '/logos/school.svg',
      // Lokasi SMKN 4 Bandung (Jl. Kliningan No. 6, Lengkong) untuk absensi QR berbasis lokasi
      latitude: -6.9047,
      longitude: 107.6137,
      attendanceRadius: 200,
    }
  })

  // Admin
  await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: hash,
      name: 'Andhika Wira Putra',
      role: 'admin',
      phone: '081234567890',
      email: 'admin@sman1bandung.sch.id',
      institutionId: inst.id,
    }
  })

  // Operator
  const operator = await prisma.user.create({
    data: {
      username: 'operator',
      passwordHash: hashOp,
      name: 'Rina Marlina, S.Si.',
      role: 'operator',
      phone: '082345678901',
      email: 'rina@sman1bandung.sch.id',
      institutionId: inst.id,
    }
  })

  // Teachers
  const teachers = await Promise.all([
    prisma.teacher.create({ data: { nip: '196501011990011001', name: 'Drs. Budi Hartono', subject: 'Olahraga', phone: '081111111111', institutionId: inst.id } }),
    prisma.teacher.create({ data: { nip: '196702031992022002', name: 'Dra. Sari Dewi', subject: 'Seni Budaya', phone: '082222222222', institutionId: inst.id } }),
    prisma.teacher.create({ data: { nip: '197003041995033003', name: 'Asep Kurniawan, S.T.', subject: 'Teknologi Informasi', phone: '083333333333', institutionId: inst.id } }),
    prisma.teacher.create({ data: { nip: '197505051998044004', name: 'Dra. Nina Marlina', subject: 'Pramuka', phone: '084444444444', institutionId: inst.id } }),
    prisma.teacher.create({ data: { nip: '198006062001055005', name: 'Rizky Pratama, S.Si.', subject: 'IPA', phone: '085555555555', institutionId: inst.id } }),
  ])

  // Classes
  await Promise.all([
    prisma.class.create({ data: { name: '10 IPA 1', grade: '10', major: 'IPA', studentCount: 36, homeroom: 'Drs. Budi Hartono', institutionId: inst.id } }),
    prisma.class.create({ data: { name: '10 IPA 2', grade: '10', major: 'IPA', studentCount: 34, homeroom: 'Dra. Sari Dewi', institutionId: inst.id } }),
    prisma.class.create({ data: { name: '11 IPA 1', grade: '11', major: 'IPA', studentCount: 32, homeroom: 'Asep Kurniawan, S.T.', institutionId: inst.id } }),
    prisma.class.create({ data: { name: '11 IPA 2', grade: '11', major: 'IPA', studentCount: 33, homeroom: 'Dra. Nina Marlina', institutionId: inst.id } }),
    prisma.class.create({ data: { name: '11 IPS 1', grade: '11', major: 'IPS', studentCount: 30, homeroom: 'Rizky Pratama, S.Si.', institutionId: inst.id } }),
    prisma.class.create({ data: { name: '11 IPS 2', grade: '11', major: 'IPS', studentCount: 31, institutionId: inst.id } }),
    prisma.class.create({ data: { name: '12 IPA 1', grade: '12', major: 'IPA', studentCount: 35, homeroom: 'Drs. Budi Hartono', institutionId: inst.id } }),
    prisma.class.create({ data: { name: '12 IPA 2', grade: '12', major: 'IPA', studentCount: 33, institutionId: inst.id } }),
  ])

  // Extracurriculars
  const ekskuls = await Promise.all([
    prisma.extracurricular.create({ data: { name: 'Basket', quota: 30, scheduleInfo: 'Senin & Rabu 15.30-17.00', description: 'Latihan basket rutin untuk persiapan kompetisi', logoUrl: '/logos/basket.svg', teacherId: teachers[0].id, institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'Paduan Suara', quota: 25, scheduleInfo: 'Selasa & Kamis 16.00-17.30', description: 'Paduan suara sekolah', logoUrl: '/logos/paduan-suara.svg', teacherId: teachers[1].id, institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'Robotik', quota: 20, scheduleInfo: 'Rabu & Jumat 15.30-17.00', description: 'Belajar robotik dan pemrograman', logoUrl: '/logos/robotik.svg', teacherId: teachers[2].id, institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'Pramuka', quota: 80, scheduleInfo: 'Sabtu 08.00-12.00', description: 'Kegiatan pramuka sekolah', logoUrl: '/logos/pramuka.svg', teacherId: teachers[3].id, institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'KIR', quota: 15, scheduleInfo: 'Jumat 15.30-17.00', description: 'Kelompok Ilmiah Remaja', logoUrl: '/logos/kir.svg', teacherId: teachers[4].id, institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'Seni Tari', quota: 25, scheduleInfo: 'Selasa & Kamis 15.30-17.00', description: 'Seni tari tradisional dan modern', logoUrl: '/logos/seni-tari.svg', institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'Futsal', quota: 20, scheduleInfo: 'Senin & Jumat 16.00-17.30', description: 'Futsal sekolah', logoUrl: '/logos/futsal.svg', institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'English Club', quota: 25, scheduleInfo: 'Rabu 15.30-17.00', description: 'English conversation and debate', logoUrl: '/logos/english-club.svg', institutionId: inst.id } }),
  ])

  // Operator ekskul — hanya mengelola ekskul masing-masing
  const [opBasket, opFutsal] = await Promise.all([
    prisma.user.create({
      data: {
        username: 'operator.basket',
        passwordHash: hashOp,
        name: 'Budi Hartono (Operator Basket)',
        role: 'operator',
        institutionId: inst.id,
        extracurricularId: ekskuls[0].id, // Basket
      }
    }),
    prisma.user.create({
      data: {
        username: 'operator.futsal',
        passwordHash: hashOp,
        name: 'Rizky Pratama (Operator Futsal)',
        role: 'operator',
        institutionId: inst.id,
        extracurricularId: ekskuls[6].id, // Futsal
      }
    }),
  ])

  // Operator demo "operator" — ikat ke satu ekskul (Pramuka) agar konsisten
  // dengan aturan baru: operator ekskul WAJIB terikat satu ekskul.
  await prisma.user.update({
    where: { id: operator.id },
    data: { extracurricularId: ekskuls[3].id, name: 'Rina Marlina (Operator Pramuka)' },
  })

  // Ekskul tambahan: organisasi & kedisiplinan (OSIS, PMR, Paskibra, Satgas)
  const ekskulOsis = await prisma.extracurricular.create({ data: { name: 'OSIS', quota: 60, scheduleInfo: 'Jumat 15.30-17.00', description: 'Organisasi Siswa Intra Sekolah — wadah pengembangan kepemimpinan siswa', logoUrl: '/logos/osis.svg', institutionId: inst.id } })
  const ekskulPmr = await prisma.extracurricular.create({ data: { name: 'PMR', quota: 40, scheduleInfo: 'Kamis 15.30-17.00', description: 'Palang Merah Remaja — pendidikan kesehatan dan kemanusiaan', logoUrl: '/logos/pmr.svg', institutionId: inst.id } })
  const ekskulPaskibra = await prisma.extracurricular.create({ data: { name: 'Paskibra', quota: 30, scheduleInfo: 'Rabu & Sabtu 15.30-17.00', description: 'Pasukan Pengibar Bendera — kedisiplinan dan upacara', logoUrl: '/logos/paskibra.svg', institutionId: inst.id } })
  const ekskulSatgas = await prisma.extracurricular.create({ data: { name: 'Satgas', quota: 25, scheduleInfo: 'Selasa 15.30-17.00', description: 'Satuan Tugas — keamanan, ketertiban, dan kebersihan sekolah', logoUrl: '/logos/satgas.svg', institutionId: inst.id } })
  ekskuls.push(ekskulOsis, ekskulPmr, ekskulPaskibra, ekskulSatgas)

  // Operator ekskul baru — OSIS, PMR, Paskibra, Satgas
  const [opOsis, opPmr, opPaskibra, opSatgas] = await Promise.all([
    prisma.user.create({
      data: {
        username: 'operator.osis',
        passwordHash: hashOp,
        name: 'Sari Dewi (Operator OSIS)',
        role: 'operator',
        phone: '085111111111',
        institutionId: inst.id,
        extracurricularId: ekskulOsis.id,
      }
    }),
    prisma.user.create({
      data: {
        username: 'operator.pmr',
        passwordHash: hashOp,
        name: 'Asep Kurniawan (Operator PMR)',
        role: 'operator',
        phone: '085222222222',
        institutionId: inst.id,
        extracurricularId: ekskulPmr.id,
      }
    }),
    prisma.user.create({
      data: {
        username: 'operator.paskibra',
        passwordHash: hashOp,
        name: 'Nina Marlina (Operator Paskibra)',
        role: 'operator',
        phone: '085333333333',
        institutionId: inst.id,
        extracurricularId: ekskulPaskibra.id,
      }
    }),
    prisma.user.create({
      data: {
        username: 'operator.satgas',
        passwordHash: hashOp,
        name: 'Rizky Pratama (Operator Satgas)',
        role: 'operator',
        phone: '085444444444',
        institutionId: inst.id,
        extracurricularId: ekskulSatgas.id,
      }
    }),
  ])

  // Students
  const students = await Promise.all([
    prisma.student.create({ data: { nis: '20260001', name: 'Ahmad Rizki Fauzi', class: '11 IPA 1', gender: 'L', phone: '087111111111', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260002', name: 'Siti Nurhaliza', class: '11 IPA 1', gender: 'P', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260003', name: 'Budi Santoso', class: '11 IPA 2', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260004', name: 'Dewi Lestari', class: '11 IPA 2', gender: 'P', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260005', name: 'Citra Ayu Permata', class: '11 IPS 1', gender: 'P', phone: '087555555555', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260006', name: 'Dian Permata Sari', class: '10 IPA 1', gender: 'P', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260007', name: 'Eko Prasetyo', class: '10 IPA 2', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260008', name: 'Fitri Handayani', class: '11 IPS 1', gender: 'P', institutionId: inst.id } }),
  ])

  // Siswa tambahan — cakupan seluruh siswa sekolah, sebagian TIDAK mengikuti
  // ekskul mana pun agar aplikasi menyeluruh untuk semua siswa.
  const moreStudents = await Promise.all([
    prisma.student.create({ data: { nis: '20260009', name: 'Rina Amelia', class: '10 IPA 1', gender: 'P', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260010', name: 'Fajar Nugroho', class: '10 IPA 1', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260011', name: 'Salsa Aulia', class: '10 IPA 2', gender: 'P', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260012', name: 'Raka Aditya', class: '10 IPA 2', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260013', name: 'Nabila Zahra', class: '11 IPA 1', gender: 'P', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260014', name: 'Dimas Saputra', class: '11 IPA 2', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260015', name: 'Putri Melati', class: '11 IPS 1', gender: 'P', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260016', name: 'Yoga Pratama', class: '11 IPS 2', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260017', name: 'Ayu Lestari', class: '11 IPS 2', gender: 'P', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260018', name: 'Bayu Aji', class: '12 IPA 1', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260019', name: 'Mega Sari', class: '12 IPA 2', gender: 'P', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260020', name: 'Rizky Ramadhan', class: '12 IPA 2', gender: 'L', institutionId: inst.id } }),
  ])

  // Murid ekskul organisasi & kedisiplinan (OSIS, PMR, Paskibra, Satgas)
  const siswaOsis = await Promise.all([
    prisma.student.create({ data: { nis: '20260021', name: 'Arif Rahman', class: '11 IPS 1', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260022', name: 'Nadia Maharani', class: '11 IPS 2', gender: 'P', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260023', name: 'Fikri Alamsyah', class: '10 IPA 1', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260024', name: 'Rani Puspita', class: '10 IPA 2', gender: 'P', institutionId: inst.id } }),
  ])
  const siswaPmr = await Promise.all([
    prisma.student.create({ data: { nis: '20260025', name: 'Gilang Ramadhan', class: '11 IPA 1', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260026', name: 'Aulia Rahma', class: '11 IPA 2', gender: 'P', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260027', name: 'Sandi Wijaya', class: '12 IPA 1', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260028', name: 'Melati Ayu', class: '12 IPA 2', gender: 'P', institutionId: inst.id } }),
  ])
  const siswaPaskibra = await Promise.all([
    prisma.student.create({ data: { nis: '20260029', name: 'Rizky Hidayat', class: '11 IPS 1', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260030', name: 'Sinta Maharani', class: '11 IPS 2', gender: 'P', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260031', name: 'Bayu Prasetyo', class: '10 IPA 1', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260032', name: 'Wulan Sari', class: '10 IPA 2', gender: 'P', institutionId: inst.id } }),
  ])
  const siswaSatgas = await Promise.all([
    prisma.student.create({ data: { nis: '20260033', name: 'Dimas Anggara', class: '11 IPA 1', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260034', name: 'Laila Fitri', class: '11 IPA 2', gender: 'P', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260035', name: 'Hendra Gunawan', class: '12 IPA 1', gender: 'L', institutionId: inst.id } }),
    prisma.student.create({ data: { nis: '20260036', name: 'Putri Anjani', class: '12 IPA 2', gender: 'P', institutionId: inst.id } }),
  ])

  // User login siswa untuk ekskul organisasi (semua murid baru bisa login)
  const userOsis = await Promise.all(siswaOsis.map(s =>
    prisma.user.create({ data: { username: s.nis, passwordHash: hashSiswa, name: s.name, role: 'student', studentId: s.id, institutionId: inst.id } })
  ))
  const userPmr = await Promise.all(siswaPmr.map(s =>
    prisma.user.create({ data: { username: s.nis, passwordHash: hashSiswa, name: s.name, role: 'student', studentId: s.id, institutionId: inst.id } })
  ))
  const userPaskibra = await Promise.all(siswaPaskibra.map(s =>
    prisma.user.create({ data: { username: s.nis, passwordHash: hashSiswa, name: s.name, role: 'student', studentId: s.id, institutionId: inst.id } })
  ))
  const userSatgas = await Promise.all(siswaSatgas.map(s =>
    prisma.user.create({ data: { username: s.nis, passwordHash: hashSiswa, name: s.name, role: 'student', studentId: s.id, institutionId: inst.id } })
  ))

  // Student users (registered students yang bisa login)
  const studentUser = await prisma.user.create({
    data: {
      username: '20260001',
      passwordHash: hashSiswa,
      name: 'Ahmad Rizki Fauzi',
      role: 'student',
      studentId: students[0].id,
      institutionId: inst.id,
    }
  })
  const studentUser2 = await prisma.user.create({
    data: {
      username: '20260002',
      passwordHash: hashSiswa,
      name: 'Siti Nurhaliza',
      role: 'student',
      studentId: students[1].id,
      institutionId: inst.id,
    }
  })
  const studentUser3 = await prisma.user.create({
    data: {
      username: '20260003',
      passwordHash: hashSiswa,
      name: 'Budi Santoso',
      role: 'student',
      studentId: students[2].id,
      institutionId: inst.id,
    }
  })

  // Members
  await Promise.all([
    prisma.member.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[0].id, status: 'active' } }),
    prisma.member.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[2].id, status: 'active' } }),
    prisma.member.create({ data: { studentId: students[1].id, extracurricularId: ekskuls[1].id, status: 'active' } }),
    prisma.member.create({ data: { studentId: students[2].id, extracurricularId: ekskuls[0].id, status: 'active' } }),
    prisma.member.create({ data: { studentId: students[3].id, extracurricularId: ekskuls[1].id, status: 'inactive' } }),
    prisma.member.create({ data: { studentId: students[4].id, extracurricularId: ekskuls[3].id, status: 'active' } }),
    prisma.member.create({ data: { studentId: students[5].id, extracurricularId: ekskuls[4].id, status: 'active' } }),
    prisma.member.create({ data: { studentId: students[6].id, extracurricularId: ekskuls[2].id, status: 'active' } }),
    // Anggota tambahan agar semua ekskul punya anggota
    prisma.member.create({ data: { studentId: students[5].id, extracurricularId: ekskuls[3].id, status: 'active' } }), // Pramuka
    prisma.member.create({ data: { studentId: students[7].id, extracurricularId: ekskuls[3].id, status: 'active' } }), // Pramuka
    prisma.member.create({ data: { studentId: students[2].id, extracurricularId: ekskuls[6].id, status: 'active' } }), // Futsal
    prisma.member.create({ data: { studentId: students[6].id, extracurricularId: ekskuls[6].id, status: 'active' } }), // Futsal
    prisma.member.create({ data: { studentId: students[1].id, extracurricularId: ekskuls[4].id, status: 'active' } }), // KIR
    prisma.member.create({ data: { studentId: students[7].id, extracurricularId: ekskuls[4].id, status: 'active' } }), // KIR
    prisma.member.create({ data: { studentId: students[4].id, extracurricularId: ekskuls[5].id, status: 'active' } }), // Seni Tari
  ])

  // Keanggotaan siswa tambahan (English Club & Seni Tari jadi terisi; sisanya
  // sengaja TIDAK mengikuti ekskul mana pun)
  await Promise.all([
    prisma.member.create({ data: { studentId: moreStudents[0].id, extracurricularId: ekskuls[7].id, status: 'active' } }), // Rina → English Club
    prisma.member.create({ data: { studentId: moreStudents[1].id, extracurricularId: ekskuls[7].id, status: 'active' } }), // Fajar → English Club
    prisma.member.create({ data: { studentId: moreStudents[2].id, extracurricularId: ekskuls[5].id, status: 'active' } }), // Salsa → Seni Tari
    prisma.member.create({ data: { studentId: moreStudents[5].id, extracurricularId: ekskuls[5].id, status: 'active' } }), // Dimas → Seni Tari
    prisma.member.create({ data: { studentId: moreStudents[6].id, extracurricularId: ekskuls[7].id, status: 'active' } }), // Putri → English Club
  ])

  // Keanggotaan ekskul organisasi & kedisiplinan — semua murid jadi anggota
  await Promise.all([
    ...siswaOsis.map(s => prisma.member.create({ data: { studentId: s.id, extracurricularId: ekskulOsis.id, status: 'active' } })),
    ...siswaPmr.map(s => prisma.member.create({ data: { studentId: s.id, extracurricularId: ekskulPmr.id, status: 'active' } })),
    ...siswaPaskibra.map(s => prisma.member.create({ data: { studentId: s.id, extracurricularId: ekskulPaskibra.id, status: 'active' } })),
    ...siswaSatgas.map(s => prisma.member.create({ data: { studentId: s.id, extracurricularId: ekskulSatgas.id, status: 'active' } })),
  ])

  // Schedule — titik lokasi (lat/lng/radius) opsional: siswa hanya bisa absen
  // di dalam titik+radius ini saat pertemuan berlangsung. Kosong → ikuti sesi QR/sekolah.
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const scheduleData = [
    { day: 'Senin', timeStart: '15:30', timeEnd: '17:00', coach: 'Drs. Budi Hartono', location: 'Lapangan Basket', ekskul: ekskuls[0], latitude: -6.9055, longitude: 107.6155, radius: 120 },
    { day: 'Senin', timeStart: '16:00', timeEnd: '17:30', coach: 'Rizky Pratama, S.Si.', location: 'Lapangan Futsal', ekskul: ekskuls[6], latitude: -6.9058, longitude: 107.6160, radius: 120 },
    { day: 'Selasa', timeStart: '15:30', timeEnd: '17:00', coach: 'Pelatih Tari', location: 'Ruang Kesenian', ekskul: ekskuls[5], latitude: -6.9043, longitude: 107.6145, radius: 80 },
    { day: 'Selasa', timeStart: '16:00', timeEnd: '17:30', coach: 'Dra. Sari Dewi', location: 'Ruang Musik', ekskul: ekskuls[1], latitude: -6.9045, longitude: 107.6148, radius: 80 },
    { day: 'Rabu', timeStart: '15:30', timeEnd: '17:00', coach: 'Drs. Budi Hartono', location: 'Lapangan Basket', ekskul: ekskuls[0], latitude: -6.9055, longitude: 107.6155, radius: 120 },
    { day: 'Rabu', timeStart: '15:30', timeEnd: '17:00', coach: 'Asep Kurniawan, S.T.', location: 'Lab Komputer', ekskul: ekskuls[2], latitude: -6.9040, longitude: 107.6140, radius: 60 },
    { day: 'Rabu', timeStart: '15:30', timeEnd: '17:00', coach: 'Mr. John', location: 'Ruang Bahasa', ekskul: ekskuls[7], latitude: -6.9047, longitude: 107.6137, radius: 80 },
    { day: 'Kamis', timeStart: '15:30', timeEnd: '17:00', coach: 'Pelatih Tari', location: 'Ruang Kesenian', ekskul: ekskuls[5], latitude: -6.9043, longitude: 107.6145, radius: 80 },
    { day: 'Kamis', timeStart: '16:00', timeEnd: '17:30', coach: 'Dra. Sari Dewi', location: 'Ruang Musik', ekskul: ekskuls[1], latitude: -6.9045, longitude: 107.6148, radius: 80 },
    { day: 'Jumat', timeStart: '15:30', timeEnd: '17:00', coach: 'Asep Kurniawan, S.T.', location: 'Lab Komputer', ekskul: ekskuls[2], latitude: -6.9040, longitude: 107.6140, radius: 60 },
    { day: 'Jumat', timeStart: '15:30', timeEnd: '17:00', coach: 'Rizky Pratama, S.Si.', location: 'Ruang KIR', ekskul: ekskuls[4], latitude: -6.9042, longitude: 107.6143, radius: 60 },
    { day: 'Jumat', timeStart: '16:00', timeEnd: '17:30', coach: 'Pelatih Futsal', location: 'Lapangan Futsal', ekskul: ekskuls[6], latitude: -6.9058, longitude: 107.6160, radius: 120 },
    { day: 'Sabtu', timeStart: '08:00', timeEnd: '12:00', coach: 'Dra. Nina Marlina', location: 'Lapangan Upacara', ekskul: ekskuls[3], latitude: -6.9047, longitude: 107.6137, radius: 150 },
    { day: 'Jumat', timeStart: '15:30', timeEnd: '17:00', coach: 'Dra. Sari Dewi', location: 'Ruang OSIS', ekskul: ekskulOsis, latitude: -6.9049, longitude: 107.6146, radius: 60 },
    { day: 'Kamis', timeStart: '15:30', timeEnd: '17:00', coach: 'Asep Kurniawan, S.T.', location: 'UKS', ekskul: ekskulPmr, latitude: -6.9046, longitude: 107.6144, radius: 50 },
    { day: 'Rabu', timeStart: '15:30', timeEnd: '17:00', coach: 'Dra. Nina Marlina', location: 'Lapangan Upacara', ekskul: ekskulPaskibra, latitude: -6.9047, longitude: 107.6137, radius: 150 },
    { day: 'Sabtu', timeStart: '08:00', timeEnd: '10:00', coach: 'Dra. Nina Marlina', location: 'Lapangan Upacara', ekskul: ekskulPaskibra, latitude: -6.9047, longitude: 107.6137, radius: 150 },
    { day: 'Selasa', timeStart: '15:30', timeEnd: '17:00', coach: 'Rizky Pratama, S.Si.', location: 'Lingkungan Sekolah', ekskul: ekskulSatgas, latitude: -6.9052, longitude: 107.6152, radius: 100 },
  ]

  await Promise.all(
    scheduleData.map(s =>
      prisma.schedule.create({
        data: {
          day: s.day,
          timeStart: s.timeStart,
          timeEnd: s.timeEnd,
          coach: s.coach,
          location: s.location,
          extracurricularId: s.ekskul.id,
          institutionId: inst.id,
          latitude: s.latitude,
          longitude: s.longitude,
          radius: s.radius,
        }
      })
    )
  )

  // Attendance records
  await Promise.all([
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[0].id, status: 'hadir', date: new Date('2026-07-06') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[0].id, status: 'hadir', date: new Date('2026-07-08') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[2].id, status: 'hadir', date: new Date('2026-07-09') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[0].id, status: 'hadir', date: new Date('2026-07-13') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[0].id, status: 'izin', date: new Date('2026-07-15'), notes: 'Sakit' } }),
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[2].id, status: 'hadir', date: new Date('2026-07-16') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[0].id, status: 'hadir', date: new Date('2026-07-20') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[0].id, status: 'alpha', date: new Date('2026-07-22') } }),
  ])

  // Sesi absensi QR (histori untuk halaman Absensi QR operator & admin)
  const sessionBasket = await prisma.attendanceSession.create({
    data: {
      qrToken: 'qr-basket-20260810',
      qrExpiresAt: new Date('2026-08-10T18:00:00'),
      date: new Date('2026-08-10T15:30:00'),
      extracurricularId: ekskuls[0].id,
      createdById: opBasket.id,
    }
  })
  const sessionPramuka = await prisma.attendanceSession.create({
    data: {
      qrToken: 'qr-pramuka-20260808',
      qrExpiresAt: new Date('2026-08-08T13:00:00'),
      date: new Date('2026-08-08T08:00:00'),
      extracurricularId: ekskuls[3].id,
      createdById: operator.id,
    }
  })

  // Rekaman absensi tambahan — semua ekskul & siswa, termasuk tanggal terbaru
  // agar grafik tren kehadiran 7 hari terakhir dan laporan terisi.
  await Promise.all([
    // Basket (ekskul 0)
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[0].id, status: 'hadir', time: '15:35', date: new Date('2026-08-03') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[2].id, extracurricularId: ekskuls[0].id, status: 'hadir', time: '15:40', date: new Date('2026-08-03') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[0].id, status: 'hadir', time: '15:32', date: new Date('2026-08-05') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[2].id, extracurricularId: ekskuls[0].id, status: 'izin', time: '', notes: 'Sakit', date: new Date('2026-08-05') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[0].id, status: 'hadir', time: '15:30', date: new Date('2026-08-10'), sessionId: sessionBasket.id } }),
    prisma.attendanceRecord.create({ data: { studentId: students[2].id, extracurricularId: ekskuls[0].id, status: 'hadir', time: '15:33', date: new Date('2026-08-10'), sessionId: sessionBasket.id } }),
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[0].id, status: 'hadir', time: '15:31', date: new Date('2026-08-12') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[2].id, extracurricularId: ekskuls[0].id, status: 'alpha', time: '', date: new Date('2026-08-12') } }),
    // Paduan Suara (ekskul 1)
    prisma.attendanceRecord.create({ data: { studentId: students[1].id, extracurricularId: ekskuls[1].id, status: 'hadir', time: '16:05', date: new Date('2026-08-04') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[1].id, extracurricularId: ekskuls[1].id, status: 'hadir', time: '16:02', date: new Date('2026-08-06') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[1].id, extracurricularId: ekskuls[1].id, status: 'hadir', time: '16:10', date: new Date('2026-08-11') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[1].id, extracurricularId: ekskuls[1].id, status: 'izin', time: '', notes: 'Ada urusan keluarga', date: new Date('2026-08-13') } }),
    // Robotik (ekskul 2)
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[2].id, status: 'hadir', time: '15:34', date: new Date('2026-08-05') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[6].id, extracurricularId: ekskuls[2].id, status: 'hadir', time: '15:30', date: new Date('2026-08-05') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[2].id, status: 'hadir', time: '15:36', date: new Date('2026-08-07') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[6].id, extracurricularId: ekskuls[2].id, status: 'hadir', time: '15:38', date: new Date('2026-08-07') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[2].id, status: 'hadir', time: '15:33', date: new Date('2026-08-12') } }),
    // Pramuka (ekskul 3)
    prisma.attendanceRecord.create({ data: { studentId: students[4].id, extracurricularId: ekskuls[3].id, status: 'hadir', time: '08:05', date: new Date('2026-08-01') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[5].id, extracurricularId: ekskuls[3].id, status: 'hadir', time: '08:10', date: new Date('2026-08-01') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[7].id, extracurricularId: ekskuls[3].id, status: 'hadir', time: '08:02', date: new Date('2026-08-01') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[4].id, extracurricularId: ekskuls[3].id, status: 'hadir', time: '08:03', date: new Date('2026-08-08'), sessionId: sessionPramuka.id } }),
    prisma.attendanceRecord.create({ data: { studentId: students[5].id, extracurricularId: ekskuls[3].id, status: 'hadir', time: '08:07', date: new Date('2026-08-08'), sessionId: sessionPramuka.id } }),
    prisma.attendanceRecord.create({ data: { studentId: students[7].id, extracurricularId: ekskuls[3].id, status: 'izin', time: '', notes: 'Ibadah', date: new Date('2026-08-08'), sessionId: sessionPramuka.id } }),
    // KIR (ekskul 4)
    prisma.attendanceRecord.create({ data: { studentId: students[5].id, extracurricularId: ekskuls[4].id, status: 'hadir', time: '15:40', date: new Date('2026-08-07') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[1].id, extracurricularId: ekskuls[4].id, status: 'hadir', time: '15:42', date: new Date('2026-08-07') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[7].id, extracurricularId: ekskuls[4].id, status: 'hadir', time: '15:39', date: new Date('2026-08-14') } }),
    // Futsal (ekskul 6)
    prisma.attendanceRecord.create({ data: { studentId: students[2].id, extracurricularId: ekskuls[6].id, status: 'hadir', time: '16:05', date: new Date('2026-08-03') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[6].id, extracurricularId: ekskuls[6].id, status: 'hadir', time: '16:08', date: new Date('2026-08-03') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[2].id, extracurricularId: ekskuls[6].id, status: 'hadir', time: '16:04', date: new Date('2026-08-10') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[6].id, extracurricularId: ekskuls[6].id, status: 'alpha', time: '', date: new Date('2026-08-10') } }),
    prisma.attendanceRecord.create({ data: { studentId: students[2].id, extracurricularId: ekskuls[6].id, status: 'hadir', time: '16:06', date: new Date('2026-08-12') } }),
  ])

  // Achievements
  await Promise.all([
    prisma.achievement.create({ data: { title: 'Juara 1 Lomba Basket', description: 'Kejuaraan Basket Antar Sekolah tingkat Kota', type: 'juara', level: 'kota', date: new Date('2026-05-10'), studentId: students[0].id, extracurricularId: ekskuls[0].id, proofUrl: '/images/achievements/juara.svg' } }),
    prisma.achievement.create({ data: { title: 'Sertifikat Kompetisi Robotik', description: 'Peserta kompetisi robotik tingkat provinsi', type: 'sertifikat', level: 'provinsi', date: new Date('2026-04-20'), studentId: students[0].id, extracurricularId: ekskuls[2].id, proofUrl: '/images/achievements/sertifikat.svg' } }),
    prisma.achievement.create({ data: { title: 'Juara 3 Olimpiade Sains', description: 'Olimpiade Sains tingkat Kota Bandung', type: 'juara', level: 'kota', date: new Date('2026-03-15'), studentId: students[4].id, extracurricularId: ekskuls[3].id, proofUrl: '/images/achievements/juara.svg' } }),
    prisma.achievement.create({ data: { title: 'Sertifikat Pramuka Garuda', description: 'Tergabung dalam Pramuka Garuda tingkat Kwartir Cabang', type: 'sertifikat', level: 'kota', date: new Date('2026-02-28'), studentId: students[4].id, extracurricularId: ekskuls[3].id, proofUrl: '/images/achievements/sertifikat.svg' } }),
    prisma.achievement.create({ data: { title: 'Partisipasi Pentas Seni', description: 'Pentas seni budaya dalam acara HUT Kota Bandung', type: 'partisipasi', level: 'kota', date: new Date('2026-01-20'), studentId: students[1].id, extracurricularId: ekskuls[1].id, proofUrl: '/images/achievements/partisipasi.svg' } }),
    // Prestasi tambahan agar tiap role punya portofolio
    prisma.achievement.create({ data: { title: 'Pemain Terbaik Turnamen Basket Kota', description: 'Terpilih sebagai pemain terbaik dalam turnamen basket antar SMA', type: 'juara', level: 'kota', date: new Date('2026-07-30'), studentId: students[2].id, extracurricularId: ekskuls[0].id, proofUrl: '/images/achievements/juara.svg' } }),
    prisma.achievement.create({ data: { title: 'Sertifikat Lomba Tingkat Pramuka', description: 'Peserta Lomba Tingkat Pramuka Penggalang tingkat Kwartir Cabang', type: 'sertifikat', level: 'kota', date: new Date('2026-06-25'), studentId: students[4].id, extracurricularId: ekskuls[3].id, proofUrl: '/images/achievements/sertifikat.svg' } }),
    prisma.achievement.create({ data: { title: 'Partisipasi Hackathon Robotik Nasional', description: 'Finalis hackathon robotik tingkat nasional', type: 'partisipasi', level: 'nasional', date: new Date('2026-08-01'), studentId: students[6].id, extracurricularId: ekskuls[2].id, proofUrl: '/images/achievements/partisipasi.svg' } }),
    prisma.achievement.create({ data: { title: 'Juara 3 Kejuaraan Futsal Pelajar', description: 'Kejuaraan futsal pelajar se-Bandung Raya', type: 'juara', level: 'kota', date: new Date('2026-07-18'), studentId: students[2].id, extracurricularId: ekskuls[6].id, proofUrl: '/images/achievements/juara.svg' } }),
  ])

  // News — beberapa berita disetujui admin (displayStatus = approved) sehingga
  // langsung tampil di Event Board siswa di install baru.
  await Promise.all([
    prisma.news.create({ data: { title: 'Jadwal Latihan Basket Tambahan', content: 'Mulai besok, jadwal latihan basket akan ditambah setiap hari Sabtu pukul 08.00 - 10.00 WIB dalam rangka persiapan lomba.', isPublic: true, displayStatus: 'approved', author: operator.name, extracurricularId: ekskuls[0].id, institutionId: inst.id, createdById: operator.id } }),
    prisma.news.create({ data: { title: 'Seleksi Anggota Baru Paduan Suara', content: 'Akan diadakan seleksi anggota baru untuk ekskul Paduan Suara pada hari Selasa, 5 Agustus 2026. Pendaftaran dibuka sampai 3 Agustus.', isPublic: true, displayStatus: 'approved', author: operator.name, extracurricularId: ekskuls[1].id, institutionId: inst.id, createdById: operator.id } }),
    prisma.news.create({ data: { title: 'Informasi Internal Pembina', content: 'Rapat pembina ekskul akan dilaksanakan hari Jumat pukul 14.00 WIB di ruang guru.', isPublic: false, displayStatus: 'none', author: operator.name, extracurricularId: ekskuls[0].id, institutionId: inst.id, createdById: operator.id } }),
    prisma.news.create({ data: { title: 'Pengumuman Hasil Seleksi', content: 'Hasil seleksi anggota Robotik telah keluar. Silakan cek di papan pengumuman ekskul.', isPublic: true, displayStatus: 'approved', author: operator.name, extracurricularId: ekskuls[2].id, institutionId: inst.id, createdById: operator.id } }),
    // Berita tambahan untuk Pramuka (operator utama) & Futsal
    prisma.news.create({ data: { title: 'Perkemahan Sabtu-Minggu Pramuka', content: 'Kegiatan perkemahan akan dilaksanakan Sabtu-Minggu pekan depan di Bumi Perkemahan Cibubur. Bawa perlengkapan lengkap.', isPublic: true, displayStatus: 'approved', author: operator.name, extracurricularId: ekskuls[3].id, institutionId: inst.id, createdById: operator.id } }),
    prisma.news.create({ data: { title: 'Open Recruitment Anggota Futsal', content: 'Ekskul Futsal membuka pendaftaran anggota baru. Pendaftaran dibuka sampai akhir bulan ini.', isPublic: true, displayStatus: 'approved', author: opFutsal.name, extracurricularId: ekskuls[6].id, institutionId: inst.id, createdById: opFutsal.id } }),
    prisma.news.create({ data: { title: 'Jadwal Latihan Robotik Ditambah', content: 'Mulai bulan depan, latihan Robotik ditambah setiap hari Jumat sore untuk persiapan lomba nasional.', isPublic: true, displayStatus: 'pending', author: 'Andhika Wira Putra', extracurricularId: ekskuls[2].id, institutionId: inst.id, createdById: (await prisma.user.findFirst({ where: { role: 'admin', institutionId: inst.id } }))!.id } }),
  ])

  // Polls
  const poll1 = await prisma.poll.create({
    data: {
      question: 'Hari apa yang paling cocok untuk jadwal latihan tambahan?',
      active: true,
      endDate: new Date('2026-08-15'),
      extracurricularId: ekskuls[0].id,
      createdById: operator.id,
      institutionId: inst.id,
      options: {
        create: [
          { label: 'Sabtu Pagi', votesCount: 12 },
          { label: 'Sabtu Siang', votesCount: 8 },
          { label: 'Minggu Pagi', votesCount: 5 },
        ]
      }
    }
  })

  const poll2 = await prisma.poll.create({
    data: {
      question: 'Lomba apa yang ingin kita ikuti semester ini?',
      active: true,
      endDate: new Date('2026-08-20'),
      extracurricularId: ekskuls[1].id,
      createdById: operator.id,
      institutionId: inst.id,
      options: {
        create: [
          { label: 'Lomba Paduan Suara Nasional', votesCount: 15 },
          { label: 'Festival Seni Daerah', votesCount: 10 },
        ]
      }
    }
  })

  // Poll votes from student
  await prisma.pollVote.create({
    data: {
      pollOptionId: (await prisma.pollOption.findFirst({ where: { pollId: poll1.id, label: 'Sabtu Pagi' } }))!.id,
      pollId: poll1.id,
      userId: studentUser.id,
    }
  })

  // Poll tambahan untuk Pramuka (operator utama) & Futsal
  const poll3 = await prisma.poll.create({
    data: {
      question: 'Tema apa yang cocok untuk perkemahan bulan depan?',
      active: true,
      endDate: new Date('2026-08-28'),
      extracurricularId: ekskuls[3].id,
      createdById: operator.id,
      institutionId: inst.id,
      options: {
        create: [
          { label: 'Kepemimpinan & Kedisiplinan', votesCount: 9 },
          { label: 'Cinta Alam & Lingkungan', votesCount: 14 },
          { label: 'Kebersamaan & Persaudaraan', votesCount: 6 },
        ]
      }
    }
  })
  const poll4 = await prisma.poll.create({
    data: {
      question: 'Jam latihan futsal tambahan yang paling diminati?',
      active: true,
      endDate: new Date('2026-08-25'),
      extracurricularId: ekskuls[6].id,
      createdById: opFutsal.id,
      institutionId: inst.id,
      options: {
        create: [
          { label: 'Sabtu Pagi', votesCount: 7 },
          { label: 'Sabtu Sore', votesCount: 11 },
          { label: 'Minggu Pagi', votesCount: 4 },
        ]
      }
    }
  })
  await prisma.pollVote.create({
    data: {
      pollOptionId: (await prisma.pollOption.findFirst({ where: { pollId: poll3.id, label: 'Cinta Alam & Lingkungan' } }))!.id,
      pollId: poll3.id,
      userId: studentUser2.id,
    }
  })
  await prisma.pollVote.create({
    data: {
      pollOptionId: (await prisma.pollOption.findFirst({ where: { pollId: poll4.id, label: 'Sabtu Sore' } }))!.id,
      pollId: poll4.id,
      userId: studentUser3.id,
    }
  })

  // Gallery
  const gallery = await prisma.gallery.create({
    data: {
      title: 'Kejuaraan Basket 2026',
      color: '#4A9E9E',
      imageCount: 6,
      date: new Date('2026-06-10'),
      extracurricularId: ekskuls[0].id,
      institutionId: inst.id,
      images: {
        create: [
          { url: '/images/gallery/basket-1.jpg' },
          { url: '/images/gallery/basket-2.jpg' },
          { url: '/images/gallery/basket-3.jpg' },
          { url: '/images/gallery/basket-4.jpg' },
          { url: '/images/gallery/basket-5.jpg' },
          { url: '/images/gallery/basket-6.jpg' },
        ]
      }
    }
  })

  // Galeri tambahan
  await Promise.all([
    prisma.gallery.create({
      data: {
        title: 'Perkemahan Pramuka Agustus',
        color: '#8B9467',
        imageCount: 4,
        date: new Date('2026-08-02'),
        extracurricularId: ekskuls[3].id,
        institutionId: inst.id,
        images: {
          create: [
            { url: '/images/gallery/pramuka-1.jpg' },
            { url: '/images/gallery/pramuka-2.jpg' },
            { url: '/images/gallery/pramuka-3.jpg' },
            { url: '/images/gallery/pramuka-4.jpg' },
          ]
        }
      }
    }),
    prisma.gallery.create({
      data: {
        title: 'Pentas Seni Akhir Tahun',
        color: '#D4956A',
        imageCount: 3,
        date: new Date('2026-07-25'),
        extracurricularId: ekskuls[1].id,
        institutionId: inst.id,
        images: {
          create: [
            { url: '/images/gallery/pentas-1.jpg' },
            { url: '/images/gallery/pentas-2.jpg' },
            { url: '/images/gallery/pentas-3.jpg' },
          ]
        }
      }
    }),
    prisma.gallery.create({
      data: {
        title: 'Latihan Futsal Mingguan',
        color: '#4A9E9E',
        imageCount: 2,
        date: new Date('2026-07-20'),
        extracurricularId: ekskuls[6].id,
        institutionId: inst.id,
        images: {
          create: [
            { url: '/images/gallery/futsal-1.jpg' },
            { url: '/images/gallery/futsal-2.jpg' },
          ]
        }
      }
    }),
  ])

  // Feed posts
  const feed1 = await prisma.feedPost.create({
    data: {
      type: 'announcement',
      title: 'Latihan Rutin Basket',
      content: 'Latihan basket hari ini dimulai pukul 15.30 di lapangan basket. Harap hadir tepat waktu.',
      author: 'Drs. Budi Hartono',
      extracurricularId: ekskuls[0].id,
      institutionId: inst.id,
      likesCount: 5,
    }
  })

  const feed2 = await prisma.feedPost.create({
    data: {
      type: 'achievement',
      title: 'Selamat kepada Tim Robotik!',
      content: 'Tim Robotik berhasil meraih juara 2 dalam kompetisi robotik tingkat provinsi.',
      author: 'Asep Kurniawan, S.T.',
      extracurricularId: ekskuls[2].id,
      institutionId: inst.id,
      likesCount: 12,
    }
  })

  // Feed comments
  await prisma.feedComment.create({
    data: {
      text: 'Siap, Pak!',
      userId: studentUser.id,
      feedPostId: feed1.id,
    }
  })

  await prisma.feedComment.create({
    data: {
      text: 'Hebat! Mantap!',
      userId: studentUser.id,
      feedPostId: feed2.id,
    }
  })

  // Feed likes
  await prisma.feedLike.create({
    data: {
      userId: studentUser.id,
      feedPostId: feed1.id,
    }
  })

  await prisma.feedLike.create({
    data: {
      userId: studentUser.id,
      feedPostId: feed2.id,
    }
  })

  // Feed posts tambahan (variasi tipe agar feed terlihat hidup)
  const feed3 = await prisma.feedPost.create({
    data: {
      type: 'gallery',
      title: 'Foto Kejuaraan Basket 2026',
      content: 'Dokumentasi lengkap kejuaraan basket antar sekolah sudah diunggah di galeri. Lihat momen-momen terbaiknya!',
      author: opBasket.name,
      extracurricularId: ekskuls[0].id,
      institutionId: inst.id,
      likesCount: 8,
    }
  })
  const feed4 = await prisma.feedPost.create({
    data: {
      type: 'poll',
      title: 'Pilih lagu untuk pentas seni!',
      content: 'Kita sedang memilih lagu untuk penampilan paduan suara di pentas seni akhir tahun. Silakan berikan suaramu.',
      author: 'Dra. Sari Dewi',
      extracurricularId: ekskuls[1].id,
      institutionId: inst.id,
      likesCount: 3,
    }
  })
  const feed5 = await prisma.feedPost.create({
    data: {
      type: 'schedule',
      title: 'Jadwal Perkemahan Pramuka Sabtu Ini',
      content: 'Ingat ya adik-adik, perkemahan dimulai Sabtu pukul 08.00 di Bumi Perkemahan. Jangan lupa atribut lengkap.',
      author: operator.name,
      extracurricularId: ekskuls[3].id,
      institutionId: inst.id,
      likesCount: 6,
    }
  })
  const feed6 = await prisma.feedPost.create({
    data: {
      type: 'achievement',
      title: 'Futsal Menang 3-1!',
      content: 'Tim futsal sekolah berhasil mengalahkan SMA Bina Bangsa 3-1 dalam laga persahabatan. Pertahankan semangat!',
      author: opFutsal.name,
      extracurricularId: ekskuls[6].id,
      institutionId: inst.id,
      likesCount: 15,
    }
  })
  await Promise.all([
    prisma.feedComment.create({ data: { text: 'Keren! Galerinya lengkap banget.', userId: studentUser2.id, feedPostId: feed3.id } }),
    prisma.feedComment.create({ data: { text: 'Siap, Pak! Saya pilih yang nasional.', userId: studentUser3.id, feedPostId: feed4.id } }),
    prisma.feedComment.create({ data: { text: 'Siap, Kak!', userId: studentUser.id, feedPostId: feed5.id } }),
  ])
  await Promise.all([
    prisma.feedLike.create({ data: { userId: studentUser.id, feedPostId: feed3.id } }),
    prisma.feedLike.create({ data: { userId: studentUser2.id, feedPostId: feed5.id } }),
    prisma.feedLike.create({ data: { userId: studentUser3.id, feedPostId: feed6.id } }),
  ])

  // Blog & Artikel — biar halaman blog terisi di ketiga role
  const adminUser = (await prisma.user.findFirst({ where: { role: 'admin', institutionId: inst.id } }))!
  await Promise.all([
    prisma.article.create({
      data: {
        title: 'Persiapan Kejuaraan Basket Antar Sekolah',
        slug: 'persiapan-kejuaraan-basket-2026',
        content: 'Tim basket SMA Negeri 1 Bandung sedang mempersiapkan diri menghadapi kejuaraan antar sekolah bulan depan. Latihan rutin dilaksanakan setiap Senin dan Rabu pukul 15.30 di lapangan basket. Kami mengajak seluruh anggota untuk hadir tepat waktu dan menjaga kondisi fisik. Semoga hasil terbaik bisa kita raih tahun ini!',
        excerpt: 'Tim basket mempersiapkan diri menghadapi kejuaraan antar sekolah bulan depan.',
        coverImage: '/images/blog/basket-persiapan.jpg',
        category: 'event',
        tags: 'basket, kejuaraan, latihan',
        status: 'published',
        authorId: opBasket.id,
        extracurricularId: ekskuls[0].id,
        institutionId: inst.id,
      }
    }),
    prisma.article.create({
      data: {
        title: 'Kegiatan Perkemahan Sabtu-Minggu Pramuka',
        slug: 'perkemahan-sabtu-minggu-pramuka',
        content: 'Kegiatan perkemahan Sabtu-Minggu akan dilaksanakan di Bumi Perkemahan Cibubur. Agenda meliputi pionering, api unggun, dan jelajah alam. Seluruh peserta wajib membawa perlengkapan sesuai daftar yang sudah dibagikan. Keberangkatan dari sekolah pukul 06.30 WIB.',
        excerpt: 'Perkemahan rutin Pramuka dengan agenda pionering, api unggun, dan jelajah alam.',
        coverImage: '/images/blog/pramuka-perkemahan.jpg',
        category: 'event',
        tags: 'pramuka, perkemahan, outing',
        status: 'published',
        authorId: operator.id,
        extracurricularId: ekskuls[3].id,
        institutionId: inst.id,
      }
    }),
    prisma.article.create({
      data: {
        title: 'Tim Robotik Raih Juara 2 Tingkat Provinsi',
        slug: 'robotik-juara-2-provinsi',
        content: 'Selamat kepada tim Robotik yang berhasil meraih juara 2 dalam kompetisi robotik tingkat provinsi! Prestasi ini diraih setelah melalui babak penyisihan yang ketat. Terima kasih kepada pembina dan seluruh anggota yang telah berlatih keras. Prestasi ini menjadi motivasi untuk terus berkarya.',
        excerpt: 'Tim Robotik berhasil meraih juara 2 di kompetisi tingkat provinsi.',
        coverImage: '/images/blog/robotik-juara.jpg',
        category: 'achievement',
        tags: 'robotik, juara, prestasi',
        status: 'published',
        authorId: adminUser.id,
        extracurricularId: ekskuls[2].id,
        institutionId: inst.id,
      }
    }),
    prisma.article.create({
      data: {
        title: 'Seleksi Anggota Baru Paduan Suara',
        slug: 'seleksi-anggota-baru-paduan-suara',
        content: 'Paduan Suara membuka seleksi anggota baru. Seleksi akan dilaksanakan pada hari Selasa, 5 Agustus 2026 di ruang musik. Peserta diminta menyiapkan satu lagu bebas dan mengikuti tes vokal sederhana. Pendaftaran ditutup tanggal 3 Agustus. Jangan lewatkan kesempatan ini!',
        excerpt: 'Pendaftaran seleksi anggota baru Paduan Suara dibuka sampai 3 Agustus.',
        coverImage: '/images/blog/paduan-suara-seleksi.jpg',
        category: 'announcement',
        tags: 'paduan suara, seleksi, musik',
        status: 'published',
        authorId: adminUser.id,
        extracurricularId: ekskuls[1].id,
        institutionId: inst.id,
      }
    }),
    prisma.article.create({
      data: {
        title: 'Tips Latihan Fisik Pemain Futsal',
        slug: 'tips-latihan-fisik-futsal',
        content: 'Latihan fisik adalah kunci utama performa pemain futsal. Mulailah dengan pemanasan ringan 10 menit, lanjutkan dengan latihan interval 30 detik sprint dan 30 detik jogging sebanyak 8 putaran. Jangan lupa stretching setelah latihan untuk mencegah cedera. Konsistensi lebih penting daripada intensitas!',
        excerpt: 'Rutinitas latihan fisik sederhana yang bisa dilakukan di rumah.',
        coverImage: '/images/blog/futsal-tips.jpg',
        category: 'tip',
        tags: 'futsal, latihan, tips',
        status: 'published',
        authorId: opFutsal.id,
        extracurricularId: ekskuls[6].id,
        institutionId: inst.id,
      }
    }),
    prisma.article.create({
      data: {
        title: 'Latihan Dribble Dasar untuk Pemula',
        slug: 'latihan-dribble-dasar-pemula',
        content: 'Draf artikel: teknik dribble dasar untuk anggota baru basket. Konten sedang disempurnakan dan akan dipublikasikan setelah revisi.',
        excerpt: 'Draf teknik dribble dasar untuk anggota baru.',
        coverImage: '/images/blog/basket-dribble.jpg',
        category: 'tip',
        tags: 'basket, dribble, teknik',
        status: 'draft',
        authorId: opBasket.id,
        extracurricularId: ekskuls[0].id,
        institutionId: inst.id,
      }
    }),
  ])

  // Materi Ekskul — untuk halaman Materi operator & siswa
  await Promise.all([
    prisma.extracurricularMaterial.create({
      data: {
        title: 'Video Latihan Dribble Dasar',
        description: 'Video panduan latihan dribble untuk anggota baru basket.',
        fileUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        fileType: 'video',
        extracurricularId: ekskuls[0].id,
        uploadedById: opBasket.id,
        institutionId: inst.id,
      }
    }),
    prisma.extracurricularMaterial.create({
      data: {
        title: 'Taktik Menyerang Basket (PDF)',
        description: 'Dokumen taktik dan formasi menyerang yang dipakai tim basket.',
        fileUrl: '/files/basket-taktik-menyerang.pdf',
        fileType: 'pdf',
        extracurricularId: ekskuls[0].id,
        uploadedById: opBasket.id,
        institutionId: inst.id,
      }
    }),
    prisma.extracurricularMaterial.create({
      data: {
        title: 'Materi Pionering & Simpul',
        description: 'Ringkasan materi pionering dan macam-macam simpul dasar pramuka.',
        content: 'Simpul yang wajib dikuasai: simpul mati, simpul hidup, simpul anyam, simpul pangkal, dan simpul tambat. Latihan secara rutin agar hafal di luar kepala. Materi lengkap akan dibagikan saat perkemahan.',
        fileType: 'text',
        extracurricularId: ekskuls[3].id,
        uploadedById: operator.id,
        institutionId: inst.id,
      }
    }),
    prisma.extracurricularMaterial.create({
      data: {
        title: 'Pengenalan Arduino (PDF)',
        description: 'Modul pengenalan mikrokontroler Arduino untuk anggota Robotik.',
        fileUrl: '/files/robotik-pengenalan-arduino.pdf',
        fileType: 'pdf',
        extracurricularId: ekskuls[2].id,
        uploadedById: adminUser.id,
        institutionId: inst.id,
      }
    }),
    prisma.extracurricularMaterial.create({
      data: {
        title: 'Partitur Lagu Wajib Paduan Suara',
        description: 'Partitur lagu wajib yang sedang dilatih untuk pentas seni.',
        fileUrl: '/files/paduan-suara-partitur.pdf',
        fileType: 'pdf',
        extracurricularId: ekskuls[1].id,
        uploadedById: adminUser.id,
        institutionId: inst.id,
      }
    }),
    prisma.extracurricularMaterial.create({
      data: {
        title: 'Pola Bertahan 4-4-2 Futsal',
        description: 'Catatan pola bertahan yang digunakan tim futsal sekolah.',
        content: 'Formasi bertahan 4-4-2: dua pemain depan melakukan pressing, empat gelandang menjaga lini tengah, dan dua bek menjaga area penalti. Koordinasi antar lini adalah kunci utama.',
        fileType: 'text',
        extracurricularId: ekskuls[6].id,
        uploadedById: opFutsal.id,
        institutionId: inst.id,
      }
    }),
  ])

  // Kepengurusan / struktur organisasi ekskul (foto, nama, kelas & jabatan)
  const boardData = [
    { ekskul: ekskuls[0], positions: [
      { name: 'Ahmad Rizki Fauzi', className: 'XI IPA 1', position: 'Ketua', sortOrder: 0 },
      { name: 'Budi Santoso', className: 'XI IPA 2', position: 'Wakil Ketua', sortOrder: 1 },
      { name: 'Citra Ayu Permata', className: 'XI IPS 1', position: 'Sekretaris', sortOrder: 2 },
      { name: 'Dewi Lestari', className: 'XI IPA 3', position: 'Bendahara', sortOrder: 3 },
      { name: 'Eko Prasetyo', className: 'X MIPA 1', position: 'Koordinator Divisi Pertandingan', sortOrder: 4 },
    ] },
    { ekskul: ekskuls[1], positions: [
      { name: 'Siti Nurhaliza', className: 'XI IPA 2', position: 'Ketua', sortOrder: 0 },
      { name: 'Fitri Handayani', className: 'XI IPS 2', position: 'Wakil Ketua', sortOrder: 1 },
      { name: 'Dian Permata Sari', className: 'XI IPA 1', position: 'Sekretaris', sortOrder: 2 },
      { name: 'Ayu Lestari', className: 'X IPS 1', position: 'Bendahara', sortOrder: 3 },
    ] },
    { ekskul: ekskuls[3], positions: [
      { name: 'Citra Ayu Permata', className: 'XI IPA 1', position: 'Pradana (Ketua)', sortOrder: 0 },
      { name: 'Dian Permata Sari', className: 'XI IPS 1', position: 'Wakil Pradana', sortOrder: 1 },
      { name: 'Eko Prasetyo', className: 'X MIPA 1', position: 'Sekretaris', sortOrder: 2 },
      { name: 'Fitri Handayani', className: 'XI IPS 2', position: 'Bendahara', sortOrder: 3 },
    ] },
    { ekskul: ekskulOsis, positions: [
      { name: 'Arif Rahman', className: 'XII IPA 1', position: 'Ketua OSIS', sortOrder: 0 },
      { name: 'Nadia Maharani', className: 'XII IPS 1', position: 'Wakil Ketua', sortOrder: 1 },
      { name: 'Fikri Alamsyah', className: 'XI IPA 2', position: 'Sekretaris', sortOrder: 2 },
      { name: 'Rani Puspita', className: 'XI IPS 1', position: 'Bendahara', sortOrder: 3 },
    ] },
    { ekskul: ekskuls[2], positions: [
      { name: 'Eko Prasetyo', className: 'X MIPA 1', position: 'Ketua', sortOrder: 0 },
      { name: 'Rina Amelia', className: 'X MIPA 2', position: 'Wakil Ketua', sortOrder: 1 },
      { name: 'Fajar Nugroho', className: 'X IPS 1', position: 'Sekretaris', sortOrder: 2 },
    ] },
  ]
  await Promise.all(
    boardData.flatMap(b => b.positions.map((p, i) =>
      prisma.boardPosition.create({
        data: { name: p.name, className: p.className, position: p.position, sortOrder: p.sortOrder, extracurricularId: b.ekskul.id, institutionId: inst.id },
      })
    ))
  )

  // Tema tampilan struktur — contoh variasi agar semua tema terlihat di demo
  await Promise.all([
    prisma.extracurricular.update({ where: { id: ekskuls[0].id }, data: { structureTheme: 'indigo' } }),
    prisma.extracurricular.update({ where: { id: ekskuls[1].id }, data: { structureTheme: 'sunset' } }),
    prisma.extracurricular.update({ where: { id: ekskuls[3].id }, data: { structureTheme: 'forest' } }),
    prisma.extracurricular.update({ where: { id: ekskulOsis.id }, data: { structureTheme: 'indigo' } }),
    prisma.extracurricular.update({ where: { id: ekskuls[2].id }, data: { structureTheme: 'sunset' } }),
  ])

  // Agenda kalender siswa (akun siswa demo)
  await Promise.all([
    prisma.agenda.create({ data: { title: 'Latihan Basket Tambahan', description: 'Latihan ekstra persiapan kejuaraan', date: new Date('2026-08-15T00:00:00'), timeStart: '08:00', timeEnd: '10:00', color: '#2D6A6A', userId: studentUser.id, institutionId: inst.id } }),
    prisma.agenda.create({ data: { title: 'Pengumpulan Tugas Robotik', description: 'Kumpulkan laporan proyek robot line follower', date: new Date('2026-08-17T00:00:00'), timeStart: '15:30', color: '#4A9E9E', userId: studentUser.id, institutionId: inst.id } }),
    prisma.agenda.create({ data: { title: 'Pertandingan Persahabatan Basket', description: 'Lawan SMA Bina Bangsa di GOR', date: new Date('2026-08-22T00:00:00'), timeStart: '09:00', timeEnd: '12:00', color: '#D46A5A', userId: studentUser.id, institutionId: inst.id } }),
    prisma.agenda.create({ data: { title: 'Rapat Persiapan Lomba', description: 'Rapat anggota inti basket membahas strategi lomba', date: new Date('2026-08-25T00:00:00'), timeStart: '16:00', timeEnd: '17:00', color: '#D4C089', userId: studentUser.id, institutionId: inst.id } }),
    prisma.agenda.create({ data: { title: 'Ujian Tengah Semester', description: 'Persiapan UTS semester ganjil', date: new Date('2026-08-20T00:00:00'), timeStart: '07:00', color: '#D4956A', userId: studentUser.id, institutionId: inst.id } }),
  ])

  // Hak akses (permission) — supaya halaman User & Privileges terlihat terisi
  const allPerms = ['dashboard', 'students', 'teachers', 'extracurriculars', 'users', 'reports', 'settings', 'attendance', 'schedule', 'members', 'polls', 'news', 'gallery', 'feed', 'achievements', 'structure', 'profile']
  const opPerms = ['dashboard', 'attendance', 'schedule', 'materials', 'members', 'blog', 'polls', 'news', 'gallery', 'feed', 'achievements', 'profile']
  await Promise.all([
    ...allPerms.map(p => prisma.userPermission.create({ data: { permissionId: p, userId: adminUser.id } })),
    ...opPerms.map(p => prisma.userPermission.create({ data: { permissionId: p, userId: operator.id } })),
    ...opPerms.map(p => prisma.userPermission.create({ data: { permissionId: p, userId: opBasket.id } })),
    ...opPerms.map(p => prisma.userPermission.create({ data: { permissionId: p, userId: opFutsal.id } })),
    ...opPerms.map(p => prisma.userPermission.create({ data: { permissionId: p, userId: opOsis.id } })),
    ...opPerms.map(p => prisma.userPermission.create({ data: { permissionId: p, userId: opPmr.id } })),
    ...opPerms.map(p => prisma.userPermission.create({ data: { permissionId: p, userId: opPaskibra.id } })),
    ...opPerms.map(p => prisma.userPermission.create({ data: { permissionId: p, userId: opSatgas.id } })),
  ])

  // Activity logs
  await Promise.all([
    prisma.activityLog.create({ data: { action: 'Membuat sesi absensi baru', userId: operator.id, institutionId: inst.id } }),
    prisma.activityLog.create({ data: { action: 'Mengimpor 32 data siswa baru', userId: (await prisma.user.findFirst({ where: { role: 'admin', institutionId: inst.id } }))!.id, institutionId: inst.id } }),
    prisma.activityLog.create({ data: { action: 'Membuat postingan feed ekskul Basket', userId: operator.id, institutionId: inst.id } }),
  ])

  console.log('✅ Seed data berhasil dibuat!')
  console.log('---')
  console.log('Admin login    → username: admin, password: admin123')
  console.log('Operator login → username: operator (Pramuka), password: operator123')
  console.log('                 username: operator.basket, password: operator123')
  console.log('                 username: operator.futsal, password: operator123')
  console.log('                 username: operator.osis (OSIS), password: operator123')
  console.log('                 username: operator.pmr (PMR), password: operator123')
  console.log('                 username: operator.paskibra (Paskibra), password: operator123')
  console.log('                 username: operator.satgas (Satgas), password: operator123')
  console.log('Siswa login    → username: 20260001 (Ahmad Rizki Fauzi), password: siswa123')
  console.log('                 username: 20260002 (Siti Nurhaliza), password: siswa123')
  console.log('                 username: 20260003 (Budi Santoso), password: siswa123')
  console.log('                 (OSIS)       username: 20260021-20260024, password: siswa123')
  console.log('                 (PMR)        username: 20260025-20260028, password: siswa123')
  console.log('                 (Paskibra)   username: 20260029-20260032, password: siswa123')
  console.log('                 (Satgas)     username: 20260033-20260036, password: siswa123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
