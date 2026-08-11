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
      name: 'SMA Negeri 1 Kota Bandung',
      npsn: '20200001',
      address: 'Jl. Merdeka No. 1, Kota Bandung',
      phone: '022-4234567',
      email: 'info@sman1bandung.sch.id',
      headmaster: 'Dr. H. Ahmad Fauzi, M.Pd.',
      activeYear: '2025/2026',
      activeSemester: 'Ganjil',
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
    prisma.extracurricular.create({ data: { name: 'Basket', quota: 30, scheduleInfo: 'Senin & Rabu 15.30-17.00', description: 'Latihan basket rutin untuk persiapan kompetisi', teacherId: teachers[0].id, institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'Paduan Suara', quota: 25, scheduleInfo: 'Selasa & Kamis 16.00-17.30', description: 'Paduan suara sekolah', teacherId: teachers[1].id, institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'Robotik', quota: 20, scheduleInfo: 'Rabu & Jumat 15.30-17.00', description: 'Belajar robotik dan pemrograman', teacherId: teachers[2].id, institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'Pramuka', quota: 80, scheduleInfo: 'Sabtu 08.00-12.00', description: 'Kegiatan pramuka sekolah', teacherId: teachers[3].id, institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'KIR', quota: 15, scheduleInfo: 'Jumat 15.30-17.00', description: 'Kelompok Ilmiah Remaja', teacherId: teachers[4].id, institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'Seni Tari', quota: 25, scheduleInfo: 'Selasa & Kamis 15.30-17.00', description: 'Seni tari tradisional dan modern', institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'Futsal', quota: 20, scheduleInfo: 'Senin & Jumat 16.00-17.30', description: 'Futsal sekolah', institutionId: inst.id } }),
    prisma.extracurricular.create({ data: { name: 'English Club', quota: 25, scheduleInfo: 'Rabu 15.30-17.00', description: 'English conversation and debate', institutionId: inst.id } }),
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

  // Student user (one registered student)
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
  ])

  // Schedule
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const scheduleData = [
    { day: 'Senin', timeStart: '15:30', timeEnd: '17:00', coach: 'Drs. Budi Hartono', location: 'Lapangan Basket', ekskul: ekskuls[0] },
    { day: 'Senin', timeStart: '16:00', timeEnd: '17:30', coach: 'Rizky Pratama, S.Si.', location: 'Lapangan Futsal', ekskul: ekskuls[6] },
    { day: 'Selasa', timeStart: '15:30', timeEnd: '17:00', coach: 'Pelatih Tari', location: 'Ruang Kesenian', ekskul: ekskuls[5] },
    { day: 'Selasa', timeStart: '16:00', timeEnd: '17:30', coach: 'Dra. Sari Dewi', location: 'Ruang Musik', ekskul: ekskuls[1] },
    { day: 'Rabu', timeStart: '15:30', timeEnd: '17:00', coach: 'Drs. Budi Hartono', location: 'Lapangan Basket', ekskul: ekskuls[0] },
    { day: 'Rabu', timeStart: '15:30', timeEnd: '17:00', coach: 'Asep Kurniawan, S.T.', location: 'Lab Komputer', ekskul: ekskuls[2] },
    { day: 'Rabu', timeStart: '15:30', timeEnd: '17:00', coach: 'Mr. John', location: 'Ruang Bahasa', ekskul: ekskuls[7] },
    { day: 'Kamis', timeStart: '15:30', timeEnd: '17:00', coach: 'Pelatih Tari', location: 'Ruang Kesenian', ekskul: ekskuls[5] },
    { day: 'Kamis', timeStart: '16:00', timeEnd: '17:30', coach: 'Dra. Sari Dewi', location: 'Ruang Musik', ekskul: ekskuls[1] },
    { day: 'Jumat', timeStart: '15:30', timeEnd: '17:00', coach: 'Asep Kurniawan, S.T.', location: 'Lab Komputer', ekskul: ekskuls[2] },
    { day: 'Jumat', timeStart: '15:30', timeEnd: '17:00', coach: 'Rizky Pratama, S.Si.', location: 'Ruang KIR', ekskul: ekskuls[4] },
    { day: 'Jumat', timeStart: '16:00', timeEnd: '17:30', coach: 'Pelatih Futsal', location: 'Lapangan Futsal', ekskul: ekskuls[6] },
    { day: 'Sabtu', timeStart: '08:00', timeEnd: '12:00', coach: 'Dra. Nina Marlina', location: 'Lapangan Upacara', ekskul: ekskuls[3] },
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
        }
      })
    )
  )

  // Assessments
  await Promise.all([
    prisma.assessment.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[0].id, score: 85, grade: 'A', notes: 'Baik sekali', date: new Date('2026-06-15') } }),
    prisma.assessment.create({ data: { studentId: students[0].id, extracurricularId: ekskuls[2].id, score: 82, grade: 'A-', notes: 'Kreatif', date: new Date('2026-06-20') } }),
    prisma.assessment.create({ data: { studentId: students[1].id, extracurricularId: ekskuls[1].id, score: 88, grade: 'A', notes: 'Suara merdu', date: new Date('2026-06-18') } }),
    prisma.assessment.create({ data: { studentId: students[2].id, extracurricularId: ekskuls[0].id, score: 78, grade: 'B+', notes: 'Perlu latihan dribble', date: new Date('2026-06-15') } }),
    prisma.assessment.create({ data: { studentId: students[4].id, extracurricularId: ekskuls[3].id, score: 90, grade: 'A', notes: 'Sangat aktif', date: new Date('2026-06-22') } }),
  ])

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

  // Achievements
  await Promise.all([
    prisma.achievement.create({ data: { title: 'Juara 1 Lomba Basket', description: 'Kejuaraan Basket Antar Sekolah tingkat Kota', type: 'juara', level: 'kota', date: new Date('2026-05-10'), studentId: students[0].id, extracurricularId: ekskuls[0].id } }),
    prisma.achievement.create({ data: { title: 'Sertifikat Kompetisi Robotik', description: 'Peserta kompetisi robotik tingkat provinsi', type: 'sertifikat', level: 'provinsi', date: new Date('2026-04-20'), studentId: students[0].id, extracurricularId: ekskuls[2].id } }),
    prisma.achievement.create({ data: { title: 'Juara 3 Olimpiade Sains', description: 'Olimpiade Sains tingkat Kota Bandung', type: 'juara', level: 'kota', date: new Date('2026-03-15'), studentId: students[4].id, extracurricularId: ekskuls[3].id } }),
    prisma.achievement.create({ data: { title: 'Sertifikat Pramuka Garuda', description: 'Tergabung dalam Pramuka Garuda tingkat Kwartir Cabang', type: 'sertifikat', level: 'kota', date: new Date('2026-02-28'), studentId: students[4].id, extracurricularId: ekskuls[3].id } }),
    prisma.achievement.create({ data: { title: 'Partisipasi Pentas Seni', description: 'Pentas seni budaya dalam acara HUT Kota Bandung', type: 'partisipasi', level: 'kota', date: new Date('2026-01-20'), studentId: students[1].id, extracurricularId: ekskuls[1].id } }),
  ])

  // News
  await Promise.all([
    prisma.news.create({ data: { title: 'Jadwal Latihan Basket Tambahan', content: 'Mulai besok, jadwal latihan basket akan ditambah setiap hari Sabtu pukul 08.00 - 10.00 WIB dalam rangka persiapan lomba.', isPublic: true, author: operator.name, extracurricularId: ekskuls[0].id, institutionId: inst.id, createdById: operator.id } }),
    prisma.news.create({ data: { title: 'Seleksi Anggota Baru Paduan Suara', content: 'Akan diadakan seleksi anggota baru untuk ekskul Paduan Suara pada hari Selasa, 5 Agustus 2026. Pendaftaran dibuka sampai 3 Agustus.', isPublic: true, author: operator.name, extracurricularId: ekskuls[1].id, institutionId: inst.id, createdById: operator.id } }),
    prisma.news.create({ data: { title: 'Informasi Internal Pembina', content: 'Rapat pembina ekskul akan dilaksanakan hari Jumat pukul 14.00 WIB di ruang guru.', isPublic: false, author: operator.name, extracurricularId: ekskuls[0].id, institutionId: inst.id, createdById: operator.id } }),
    prisma.news.create({ data: { title: 'Pengumuman Hasil Seleksi', content: 'Hasil seleksi anggota Robotik telah keluar. Silakan cek di papan pengumuman ekskul.', isPublic: true, author: operator.name, extracurricularId: ekskuls[2].id, institutionId: inst.id, createdById: operator.id } }),
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

  // Feed posts
  const feed1 = await prisma.feedPost.create({
    data: {
      type: 'announcement',
      title: 'Latihan Rutin Basket',
      content: 'Latihan basket hari ini dimulai pukul 15.30 di lapangan basket. Harap hadir tepat waktu.',
      author: 'Drs. Budi Hartono',
      avatar: '/avatars/coach-budi.png',
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
      avatar: '/avatars/coach-asep.png',
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

  // Activity logs
  await Promise.all([
    prisma.activityLog.create({ data: { action: 'Membuat sesi absensi baru', userId: operator.id, institutionId: inst.id } }),
    prisma.activityLog.create({ data: { action: 'Mengimpor 32 data siswa baru', userId: (await prisma.user.findFirst({ where: { role: 'admin', institutionId: inst.id } }))!.id, institutionId: inst.id } }),
    prisma.activityLog.create({ data: { action: 'Input nilai ekskul Basket', userId: operator.id, institutionId: inst.id } }),
  ])

  console.log('✅ Seed data berhasil dibuat!')
  console.log('---')
  console.log('Admin login   → username: admin, password: admin123')
  console.log('Operator login → username: operator, password: operator123')
  console.log('Siswa login   → username: 20260001, password: siswa123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
