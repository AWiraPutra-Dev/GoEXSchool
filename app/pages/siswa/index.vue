<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const auth = useAuthStore()
const siswa = useSiswaDataStore()
const ui = useUiStore()
const dashboard = ref<any>(null)
let pollTimer: ReturnType<typeof setInterval>

async function loadDashboard() {
  try {
    dashboard.value = await $fetch('/api/siswa/dashboard')
  } catch {}
}

onMounted(async () => {
  await Promise.all([loadDashboard(), siswa.fetchAll(), siswa.fetchNews(true)])
  pollTimer = setInterval(() => {
    loadDashboard()
    siswa.fetchAll()
  }, 30_000)
})
onUnmounted(() => clearInterval(pollTimer))

const summary = computed(() => {
  const d = dashboard.value
  return {
    ekskulCount: d?.ekskulCount ?? siswa.attendance.length,
    attendanceRate: d?.attendanceRate ?? 0,
    achievementCount: d?.achievementCount ?? siswa.achievements.length,
    totalSessions: d?.totalSessions ?? siswa.attendance.length,
    upcoming: d?.upcoming ?? [],
    recentActivity: d?.recentActivity ?? [],
  }
})

const attendanceChart = computed(() => {
  const d = dashboard.value
  const c = accentChartPalette(auth.institution?.themeColor || '#4F46E5')
  return {
    labels: d?.charts?.attendance?.labels ?? ['Hadir', 'Izin', 'Alpha'],
    datasets: [{
      label: 'Total',
      data: d?.charts?.attendance?.data ?? [0, 0, 0],
      backgroundColor: [c.primary, c.light, c.lighter],
    }],
  }
})
const weeklyHours = computed(() =>
  dashboard.value?.charts?.weeklyHours ?? { labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'], data: [0, 0, 0, 0, 0, 0] }
)

// Notifikasi ringkas untuk panel dashboard
const notifCount = ref(0)
onMounted(async () => {
  try {
    const res = await $fetch<{ unread: number }>('/api/siswa/notifications')
    notifCount.value = res.unread
  } catch {}
})
</script>

<template>
  <div class="dashboard-page">
    <div class="welcome-section">
      <div>
        <h1 class="page-title">{{ ui.t('dashboard.siswa') }}</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">{{ auth.institution?.name || 'Sekolah' }} · Kelas {{ auth.user?.class || '-' }} · NIS {{ auth.user?.nis || '-' }}</p>
      </div>
      <div class="header-actions">
        <NuxtLink to="/siswa/calendar" class="date-badge cal-link"><Icon name="i-lucide-calendar-days" class="w-4 h-4" /> {{ ui.t('menu.calendar') }}</NuxtLink>
        <div class="date-badge">{{ formatSchoolTime(new Date(), auth.institution, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</div>
      </div>
    </div>

    <!-- Event Board: berita berjalan yang disetujui admin -->
    <EventBoard :items="siswa.news" />

    <div class="stats-grid">
      <StatCard :label="ui.t('stat.totalEkskul')" :value="summary.ekskulCount" icon="i-lucide-shield" :color="'var(--accent)'" />
      <StatCard :label="ui.t('stat.kehadiranRate')" :value="`${summary.attendanceRate}%`" icon="i-lucide-check-square" :color="'var(--accent)'" />
      <StatCard :label="ui.t('notif.achievement')" :value="summary.achievementCount" icon="i-lucide-award" :color="'var(--accent)'" />
      <StatCard :label="ui.t('stat.totalHadir')" :value="summary.totalSessions" icon="i-lucide-calendar" :color="'var(--accent)'" />
    </div>

    <div class="charts-grid">
      <ClientOnly><ChartCard title="Rekap Kehadiran Saya" type="doughnut" :labels="attendanceChart.labels" :datasets="attendanceChart.datasets" /></ClientOnly>
      <ClientOnly><ChartCard title="Jam Aktivitas Mingguan" type="bar" :labels="weeklyHours.labels" :datasets="[{ label: 'Jam Aktivitas', data: weeklyHours.data, backgroundColor: accentChartPalette(auth.institution?.themeColor || '#4F46E5').soft }]" /></ClientOnly>
    </div>

    <div class="content-grid-2col">
      <section class="panel-card">
        <div class="panel-header"><span>Jadwal Terdekat</span><NuxtLink to="/siswa/schedule" class="panel-link">Lihat Semua</NuxtLink></div>
        <ul class="panel-list">
          <li v-for="item in summary.upcoming" :key="item.id" class="panel-list-item">
            <div class="schedule-date-box"><span class="date-day">{{ item.day }}</span><span class="date-num">{{ item.date.split(' ')[0] }}</span></div>
            <div class="flex-1">
              <div class="font-semibold text-[13px]">{{ item.title }}</div>
              <div class="text-[11px]" style="color: var(--text-secondary);">{{ item.coach }} · {{ item.time }}</div>
            </div>
            <span v-if="item.mandatory" class="status-badge status-upcoming">Wajib</span>
            <span v-else class="status-badge status-optional">Opsional</span>
          </li>
          <li v-if="!summary.upcoming.length" class="panel-empty"><Icon name="i-lucide-calendar-off" class="w-6 h-6" style="color: var(--text-muted);" /><p>Tidak ada jadwal mendatang.</p></li>
        </ul>
      </section>
      <section class="panel-card">
        <div class="panel-header"><span>Aktivitas Terbaru</span><span class="panel-count">Real-time</span></div>
        <ul class="panel-list">
          <li v-for="a in summary.recentActivity" :key="a.id" class="panel-list-item">
            <div class="activity-icon-wrapper" :class="`act-${a.type}`"><Icon :name="a.type === 'attendance' ? 'i-lucide-check' : 'i-lucide-award'" class="w-4 h-4 text-white" /></div>
            <div class="flex-1"><div class="text-[13px]">{{ a.text }}</div><div class="text-[11px]" style="color: var(--text-muted);">{{ a.time }}</div></div>
          </li>
          <li v-if="!summary.recentActivity.length" class="panel-empty"><Icon name="i-lucide-inbox" class="w-6 h-6" style="color: var(--text-muted);" /><p>Belum ada aktivitas.</p></li>
        </ul>
      </section>
    </div>

    <section class="quick-actions-card">
      <div class="panel-header">
        Menu Cepat
        <NuxtLink to="/siswa/calendar" class="panel-link"><Icon name="i-lucide-calendar-days" class="w-3.5 h-3.5" /> Buka Kalender</NuxtLink>
      </div>
      <div class="quick-actions-grid">
        <NuxtLink to="/siswa/attendance" class="quick-action-btn"><Icon name="i-lucide-qr-code" class="w-5 h-5" /><span>Scan Absensi</span></NuxtLink>
        <NuxtLink to="/siswa/news" class="quick-action-btn"><Icon name="i-lucide-megaphone" class="w-5 h-5" /><span>Berita & Info</span></NuxtLink>
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
.date-badge { font-size: var(--text-sm); color: var(--text-secondary); background: var(--bg-card); padding: 8px 16px; border-radius: 4px; border: 1px solid var(--border-light); white-space: nowrap; }
.cal-link { display: inline-flex; align-items: center; gap: 6px; color: var(--olive-primary); font-weight: var(--font-semibold); text-decoration: none; }
.cal-link:hover { background: var(--olive-bg); }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.content-grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 1024px) { .content-grid-2col { grid-template-columns: 1fr; } }
.panel-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.panel-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: var(--bg-card); color: var(--text-primary); font-weight: var(--font-semibold); text-transform: uppercase; font-size: 12px; padding: 12px 16px; letter-spacing: 0.02em; border-bottom: 1px solid var(--border-light); }
.panel-header::before { content: ''; width: 4px; height: 14px; border-radius: 2px; background: var(--accent); flex-shrink: 0; }
.panel-count { font-size: var(--text-xs); color: var(--text-secondary); text-transform: none; font-weight: var(--font-normal); }
.panel-link { color: var(--accent); font-size: var(--text-xs); text-decoration: none; text-transform: none; display: inline-flex; align-items: center; gap: 4px; font-weight: var(--font-medium); }
.panel-link:hover { text-decoration: underline; }
.panel-list { list-style: none; margin: 0; padding: 0; }
.panel-list-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border-light); transition: background 0.15s; }
.panel-list-item:hover { background: var(--bg-hover); }
.panel-list-item:last-child { border-bottom: none; }
.panel-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px; color: var(--text-muted); font-size: var(--text-sm); }
.schedule-date-box { text-align: center; background: var(--olive-bg); padding: 6px 14px; border-radius: 4px; min-width: 50px; }
.date-day { display: block; font-size: 12px; color: var(--text-muted); text-transform: uppercase; }
.date-num { display: block; font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--olive-primary); }
.status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 4px; font-weight: var(--font-medium); white-space: nowrap; }
.status-upcoming { background: rgba(139,148,103,0.15); color: var(--olive-primary); }
.status-optional { background: rgba(212,192,137,0.25); color: #A8863C; }
.activity-icon-wrapper { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.act-attendance { background: var(--teal); }
.act-achievement { background: var(--yellow-cream); }
.act-poll { background: var(--green-soft); }
.quick-actions-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.quick-actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; padding: 16px; }
.quick-action-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; background: var(--olive-bg); border-radius: 8px; color: var(--text-primary); text-decoration: none; font-size: var(--text-sm); font-weight: var(--font-medium); transition: all 0.2s; }
.quick-action-btn:hover { background: var(--olive-primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(139,148,103,0.3); }
</style>
