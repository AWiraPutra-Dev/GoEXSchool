<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const auth = useAuthStore()
const siswa = useSiswaDataStore()
const dashboard = ref<any>(null)

onMounted(async () => {
  try { dashboard.value = await $fetch('/api/siswa/dashboard') } catch {}
})

const summary = computed(() => ({
  ekskulCount: dashboard.value?.ekskulCount ?? [...new Set(siswa.attendance.map(a => a.ekskul))].length,
  attendanceRate: dashboard.value?.attendanceRate ?? (Math.round((siswa.attendance.filter(a => a.status === 'Hadir').length / siswa.attendance.length) * 100) || 0),
  achievementCount: dashboard.value?.achievementCount ?? siswa.achievements.length,
  totalSessions: dashboard.value?.totalSessions ?? siswa.attendance.length,
  upcomingSchedule: dashboard.value?.upcoming?.length
    ? dashboard.value.upcoming
    : [
        { id: 1, day: 'Senin', date: '22 Jul 2026', time: '14.00 - 15.30', title: 'Latihan Basket (GOR)', coach: 'Ahmad Hidayat', status: 'akan_datang' },
        { id: 2, day: 'Rabu', date: '24 Jul 2026', time: '14.00 - 15.30', title: 'Latihan Basket (GOR)', coach: 'Ahmad Hidayat', status: 'akan_datang' },
        { id: 3, day: 'Kamis', date: '25 Jul 2026', time: '15.30 - 17.00', title: 'KIR (Lab IPA)', coach: 'Dr. Rina Amelia', status: 'akan_datang' }
      ],
      recentActivity: [
    { id: 1, text: 'Absensi Basket — Hadir', time: 'Kemarin, 14:05', type: 'attendance' },
    { id: 2, text: `Nilai ${siswa.grades.length} ekskul diupdate`, time: '2 hari lalu', type: 'grade' },
    { id: 3, text: `${dashboard.value?.achievementCount ?? siswa.achievements.length} prestasi tercatat`, time: '5 hari lalu', type: 'achievement' },
    { id: 4, text: `${siswa.feed.length} feed komunitas`, time: '1 minggu lalu', type: 'poll' }
  ]
}))

const attendanceChart = computed(() => ({
  labels: ['Hadir', 'Izin', 'Alpha'],
  datasets: [{
    label: 'Total',
    data: [siswa.attendance.filter(a => a.status === 'Hadir').length, siswa.attendance.filter(a => a.status === 'Izin').length, siswa.attendance.filter(a => a.status === 'Alpha').length],
    backgroundColor: ['#7BA87B', '#D4C089', '#D46A5A']
  }]
}))
const gradeTrend = {
  labels: ['Ganjil 2025', 'Genap 2025', 'Ganjil 2026'],
  datasets: [{ label: 'Basket', data: [82, 85, 88], borderColor: '#8B9467', backgroundColor: 'rgba(139,148,103,0.1)', fill: true, tension: 0.4 }, { label: 'KIR', data: [78, 82, 0], borderColor: '#4A9E9E', backgroundColor: 'rgba(74,158,158,0.1)', fill: true, tension: 0.4 }]
}
const weeklyHours = {
  labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  datasets: [{ label: 'Jam Aktivitas', data: [1.5, 0, 1.5, 1.5, 0, 0], backgroundColor: '#8B9467' }]
}
</script>

<template>
  <div class="dashboard-page">
    <div class="welcome-section">
      <div>
        <h1 class="page-title">Halo, {{ auth.user?.name }}! 👋</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">Kelas {{ auth.user?.class || '11 IPA 1' }} · NIS {{ auth.user?.nis || '2025001' }}</p>
      </div>
      <div class="header-actions"><div class="date-badge">{{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</div></div>
    </div>

    <div class="stats-grid">
      <StatCard label="Ekskul Diikuti" :value="summary.ekskulCount" icon="i-lucide-shield" :color="'var(--teal-dark)'" />
      <StatCard label="Kehadiran" :value="`${summary.attendanceRate}%`" icon="i-lucide-check-square" :color="'var(--teal-mid)'" />
      <StatCard label="Prestasi" :value="summary.achievementCount" icon="i-lucide-award" :color="'var(--yellow-cream)'" />
      <StatCard label="Total Sesi" :value="summary.totalSessions" icon="i-lucide-calendar" :color="'var(--green-soft)'" />
    </div>

    <div class="charts-grid">
      <ClientOnly><ChartCard title="Rekap Kehadiran Saya" type="doughnut" :labels="attendanceChart.labels" :datasets="attendanceChart.datasets" /></ClientOnly>
      <ClientOnly><ChartCard title="Perkembangan Nilai" type="line" :labels="gradeTrend.labels" :datasets="gradeTrend.datasets" /></ClientOnly>
      <ClientOnly><ChartCard title="Jam Aktivitas Mingguan" type="bar" :labels="weeklyHours.labels" :datasets="weeklyHours.datasets" /></ClientOnly>
    </div>

    <div class="content-grid-2col">
      <section class="panel-card">
        <div class="panel-header"><span>Jadwal Terdekat</span><NuxtLink to="/siswa/schedule" class="panel-link">Lihat Semua</NuxtLink></div>
        <ul class="panel-list">
          <li v-for="item in summary.upcomingSchedule" :key="item.id" class="panel-list-item">
            <div class="schedule-date-box"><span class="date-day">{{ item.day }}</span><span class="date-num">{{ (item.date || '').split(' ')[0] }}</span></div>
            <div class="flex-1"><div class="font-semibold text-[13px]">{{ item.title }}</div><div class="text-[11px]" style="color: var(--text-secondary);">{{ item.coach }} · {{ item.time }}</div></div>
            <span class="status-badge status-upcoming">{{ item.status === 'akan_datang' ? 'Akan Datang' : 'Sekarang' }}</span>
          </li>
          <li v-if="!summary.upcomingSchedule.length" class="panel-empty"><Icon name="i-lucide-calendar-off" class="w-6 h-6" style="color: var(--text-muted);" /><p>Tidak ada jadwal mendatang.</p></li>
        </ul>
      </section>
      <section class="panel-card">
        <div class="panel-header"><span>Aktivitas Terbaru</span><span class="panel-count">Saya</span></div>
        <ul class="panel-list">
          <li v-for="a in summary.recentActivity" :key="a.id" class="panel-list-item">
            <div class="activity-icon-wrapper" :class="`act-${a.type}`"><Icon :name="a.type === 'attendance' ? 'i-lucide-check' : a.type === 'grade' ? 'i-lucide-clipboard-check' : 'i-lucide-award'" class="w-4 h-4 text-white" /></div>
            <div class="flex-1"><div class="text-[13px]">{{ a.text }}</div><div class="text-[11px]" style="color: var(--text-muted);">{{ a.time }}</div></div>
          </li>
        </ul>
      </section>
    </div>

    <section class="quick-actions-card">
      <div class="panel-header">Menu Cepat</div>
      <div class="quick-actions-grid">
        <NuxtLink to="/siswa/attendance" class="quick-action-btn"><Icon name="i-lucide-qr-code" class="w-5 h-5" /><span>Scan Absensi</span></NuxtLink>
        <NuxtLink to="/siswa/grades" class="quick-action-btn"><Icon name="i-lucide-clipboard-list" class="w-5 h-5" /><span>Nilai Saya</span></NuxtLink>
        <NuxtLink to="/siswa/feed" class="quick-action-btn"><Icon name="i-lucide-newspaper" class="w-5 h-5" /><span>Feed Komunitas</span></NuxtLink>
        <NuxtLink to="/siswa/achievements" class="quick-action-btn"><Icon name="i-lucide-award" class="w-5 h-5" /><span>Portofolio</span></NuxtLink>
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
.panel-link { color: white; font-size: var(--text-xs); text-decoration: none; opacity: 0.8; text-transform: none; }
.panel-link:hover { opacity: 1; text-decoration: underline; }
.panel-list { list-style: none; margin: 0; padding: 0; }
.panel-list-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border-light); transition: background 0.15s; }
.panel-list-item:hover { background: var(--bg-hover); }
.panel-list-item:last-child { border-bottom: none; }
.panel-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px; color: var(--text-muted); font-size: var(--text-sm); }
.schedule-date-box { text-align: center; background: var(--olive-bg); padding: 6px 14px; border-radius: 8px; min-width: 50px; }
.date-day { display: block; font-size: 10px; color: var(--text-muted); text-transform: uppercase; }
.date-num { display: block; font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--olive-primary); }
.status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); white-space: nowrap; }
.status-upcoming { background: rgba(139,148,103,0.15); color: var(--olive-primary); }
.activity-icon-wrapper { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.act-attendance { background: var(--teal); }
.act-grade { background: var(--orange); }
.act-achievement { background: var(--yellow-cream); }
.act-poll { background: var(--green-soft); }
.quick-actions-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.quick-actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; padding: 16px; }
.quick-action-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; background: var(--olive-bg); border-radius: 8px; color: var(--text-primary); text-decoration: none; font-size: var(--text-sm); font-weight: var(--font-medium); transition: all 0.2s; }
.quick-action-btn:hover { background: var(--olive-primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(139,148,103,0.3); }
</style>
