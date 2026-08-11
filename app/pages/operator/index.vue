<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const auth = useAuthStore()
const op = useOperatorDataStore()
const dashboard = ref<any>(null)

onMounted(async () => {
  try { dashboard.value = await $fetch('/api/operator/dashboard') } catch {}
})

const summary = computed(() => ({
  totalMembers: dashboard.value?.totalMembers ?? op.members.filter(m => m.status === 'active').length,
  activeEkskul: dashboard.value?.activeEkskul ?? [...new Set(op.members.map(m => m.ekskul))].length,
  attendanceToday: dashboard.value?.attendanceHistory?.[0]?.hadir ?? 67,
  pendingAssessments: dashboard.value?.pendingAssessments ?? op.assessments.length,
  myEkskul: [dashboard.value?.myEkskul].filter(Boolean).join(', ') || 'Basket & Paduan Suara',
  todaySchedule: op.schedule.length > 0
    ? op.schedule.map(s => ({ id: s.id, ekskul: s.ekskul, time: s.time || `${s.timeStart} - ${s.timeEnd}`, location: s.location, status: 'akan_datang' }))
    : [
        { id: 1, ekskul: 'Basket', time: '14.00 - 15.30', location: 'GOR', status: 'akan_datang' },
        { id: 2, ekskul: 'Paduan Suara', time: '14.00 - 15.30', location: 'Aula', status: 'akan_datang' },
        { id: 3, ekskul: 'Robotik', time: '15.30 - 17.00', location: 'Lab Komputer', status: 'akan_datang' },
        { id: 4, ekskul: 'Pramuka', time: '15.30 - 17.00', location: 'Lapangan', status: 'akan_datang' }
      ],
  recentActivity: [
    ...(dashboard.value?.attendanceHistory?.length ? [{ id: 'a1', text: `Absensi ${dashboard.value.attendanceHistory[0].ekskul} — ${dashboard.value.attendanceHistory[0].hadir} hadir dari ${dashboard.value.attendanceHistory[0].total} anggota`, time: 'Kemarin, 14:05', type: 'attendance' as const }] : []),
    { id: 'a2', text: `Nilai ${dashboard.value?.pendingAssessments ?? op.assessments.length} siswa diupload`, time: '2 hari lalu', type: 'assessment' as const },
    { id: 'a3', text: `${dashboard.value?.activePolls ?? op.polls.filter(p => p.active).length} voting aktif`, time: '3 hari lalu', type: 'poll' as const },
    { id: 'a4', text: `${dashboard.value?.galleryCount ?? op.gallery.length} galeri foto tersedia`, time: '4 hari lalu', type: 'gallery' as const }
  ]
}))

const attendanceByEkskul = {
  labels: ['Basket', 'P. Suara', 'Robotik', 'Pramuka', 'KIR', 'Seni Tari', 'Futsal', 'English'],
  datasets: [{ label: 'Anggota Aktif', data: [28, 22, 15, 60, 12, 18, 20, 16], backgroundColor: '#4A9E9E' }]
}
const attendanceRate = {
  labels: ['Hadir', 'Izin', 'Alpha', 'Sakit'],
  datasets: [{ label: 'Total', data: [112, 18, 8, 7], backgroundColor: ['#7BA87B', '#D4C089', '#D46A5A', '#4A9E9E'] }]
}
const weeklyTrend = {
  labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  datasets: [{ label: 'Hadir', data: [45, 38, 52, 41, 35, 60], borderColor: '#8B9467', backgroundColor: 'rgba(139,148,103,0.1)', fill: true, tension: 0.4 }]
}
const assessmentDistribution = {
  labels: ['A (≥85)', 'B+ (80-84)', 'B (75-79)', 'C (<75)'],
  datasets: [{ label: 'Siswa', data: [42, 28, 15, 5], backgroundColor: ['#7BA87B', '#D4C089', '#D4956A', '#D46A5A'] }]
}
const scheduleIcons: Record<string, string> = {
  Basket: 'i-lucide-circle-dot', 'Paduan Suara': 'i-lucide-music', Robotik: 'i-lucide-cpu',
  Pramuka: 'i-lucide-map', KIR: 'i-lucide-flask-conical', 'Seni Tari': 'i-lucide-arrow-left-right',
  Futsal: 'i-lucide-circle', 'English Club': 'i-lucide-book-open'
}
</script>

<template>
  <div class="dashboard-page">
    <div class="welcome-section">
      <div>
        <h1 class="page-title">Selamat datang, {{ auth.user?.name }}! 👋</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">Anda adalah Operator Ekskul</p>
      </div>
      <div class="header-actions"><div class="date-badge">{{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</div></div>
    </div>

    <div class="stats-grid">
      <StatCard label="Total Anggota" :value="summary.totalMembers" icon="i-lucide-users" :color="'var(--teal-dark)'" />
      <StatCard label="Ekskul Aktif" :value="summary.activeEkskul" icon="i-lucide-shield" :color="'var(--teal-mid)'" />
      <StatCard label="Hadir Hari Ini" :value="summary.attendanceToday" icon="i-lucide-check-square" :color="'var(--green-soft)'" />
      <StatCard label="Nilai Perlu Diisi" :value="summary.pendingAssessments" icon="i-lucide-clipboard-list" :color="'var(--red-orange)'" />
    </div>

    <div class="charts-grid">
      <ClientOnly><ChartCard title="Anggota per Ekskul" type="bar" :labels="attendanceByEkskul.labels" :datasets="attendanceByEkskul.datasets" /></ClientOnly>
      <ClientOnly><ChartCard title="Rekap Kehadiran" type="doughnut" :labels="attendanceRate.labels" :datasets="attendanceRate.datasets" /></ClientOnly>
      <ClientOnly><ChartCard title="Kehadiran Mingguan" type="line" :labels="weeklyTrend.labels" :datasets="weeklyTrend.datasets" /></ClientOnly>
      <ClientOnly><ChartCard title="Distribusi Nilai" type="bar" :labels="assessmentDistribution.labels" :datasets="assessmentDistribution.datasets" /></ClientOnly>
    </div>

    <div class="content-grid-2col">
      <section class="panel-card">
        <div class="panel-header"><span>Jadwal Hari Ini</span><span class="panel-count">{{ summary.todaySchedule.length }} sesi</span></div>
        <ul class="panel-list">
          <li v-for="s in summary.todaySchedule" :key="s.id" class="panel-list-item">
            <div class="schedule-icon-wrapper"><Icon :name="scheduleIcons[s.ekskul] || 'i-lucide-calendar'" class="w-5 h-5" style="color: var(--olive-primary);" /></div>
            <div class="flex-1"><div class="font-semibold text-[13px]">{{ s.ekskul }}</div><div class="text-[11px]" style="color: var(--text-secondary);">{{ s.location }}</div></div>
            <div class="text-right"><div class="time-badge">{{ s.time }}</div></div>
          </li>
          <li v-if="!summary.todaySchedule.length" class="panel-empty"><Icon name="i-lucide-calendar-off" class="w-6 h-6" style="color: var(--text-muted);" /><p>Tidak ada jadwal hari ini.</p></li>
        </ul>
      </section>
      <section class="panel-card">
        <div class="panel-header"><span>Aktivitas Terbaru</span><span class="panel-count">Timeline</span></div>
        <ul class="panel-list">
          <li v-for="a in summary.recentActivity" :key="a.id" class="panel-list-item">
            <div class="activity-dot" :class="`dot-${a.type}`"></div>
            <div class="flex-1"><div class="text-[13px]">{{ a.text }}</div><div class="text-[11px]" style="color: var(--text-muted);">{{ a.time }}</div></div>
          </li>
        </ul>
      </section>
    </div>

    <section class="quick-actions-card">
      <div class="panel-header">Aksi Cepat</div>
      <div class="quick-actions-grid">
        <NuxtLink to="/operator/attendance" class="quick-action-btn"><Icon name="i-lucide-qr-code" class="w-5 h-5" /><span>Buat QR Absensi</span></NuxtLink>
        <NuxtLink to="/operator/assessments" class="quick-action-btn"><Icon name="i-lucide-clipboard-check" class="w-5 h-5" /><span>Input Nilai</span></NuxtLink>
        <NuxtLink to="/operator/news" class="quick-action-btn"><Icon name="i-lucide-megaphone" class="w-5 h-5" /><span>Buat Pengumuman</span></NuxtLink>
        <NuxtLink to="/operator/polls" class="quick-action-btn"><Icon name="i-lucide-vote" class="w-5 h-5" /><span>Buat Voting</span></NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-page { display: flex; flex-direction: column; gap: 20px; }
.welcome-section { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.header-actions { display: flex; align-items: center; gap: 8px; }
.date-badge { font-size: var(--text-sm); color: var(--text-secondary); background: var(--bg-card); padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-light); white-space: nowrap; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.content-grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 1024px) { .content-grid-2col { grid-template-columns: 1fr; } }
.panel-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.panel-header { display: flex; align-items: center; justify-content: space-between; background: var(--olive-primary); color: white; font-weight: var(--font-semibold); text-transform: uppercase; font-size: 12px; padding: 10px 16px; }
.panel-count { font-size: var(--text-xs); opacity: 0.8; text-transform: none; }
.panel-list { list-style: none; margin: 0; padding: 0; }
.panel-list-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border-light); transition: background 0.15s; }
.panel-list-item:hover { background: var(--bg-hover); }
.panel-list-item:last-child { border-bottom: none; }
.time-badge { font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--olive-primary); background: var(--olive-bg); padding: 4px 8px; border-radius: 4px; white-space: nowrap; font-family: 'Courier New', monospace; }
.panel-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px; color: var(--text-muted); font-size: var(--text-sm); }
.schedule-icon-wrapper { width: 36px; height: 36px; border-radius: 8px; background: var(--olive-bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.activity-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.dot-attendance { background: var(--teal); }
.dot-assessment { background: var(--orange); }
.dot-poll { background: var(--yellow-cream); }
.dot-gallery { background: var(--green-soft); }
.dot-schedule { background: var(--olive-primary); }
.quick-actions-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.quick-actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; padding: 16px; }
.quick-action-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; background: var(--olive-bg); border-radius: 8px; color: var(--text-primary); text-decoration: none; font-size: var(--text-sm); font-weight: var(--font-medium); transition: all 0.2s; }
.quick-action-btn:hover { background: var(--olive-primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(139,148,103,0.3); }
</style>
