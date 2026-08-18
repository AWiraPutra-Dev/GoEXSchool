<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const auth = useAuthStore()
const op = useOperatorDataStore()
const ui = useUiStore()
const dashboard = ref<any>(null)
let pollTimer: ReturnType<typeof setInterval>

async function loadDashboard() {
  try { dashboard.value = await $fetch('/api/operator/dashboard') } catch {}
}

onMounted(async () => {
  await Promise.all([loadDashboard(), op.fetchAll()])
  pollTimer = setInterval(() => {
    loadDashboard()
    op.fetchAll()
  }, 30_000)
})
onUnmounted(() => clearInterval(pollTimer))

const summary = computed(() => {
  const d = dashboard.value
  return {
    totalMembers: d?.totalMembers ?? op.members.length,
    activeEkskul: d?.activeEkskul ?? 0,
    attendanceToday: d?.attendanceToday ?? 0,
    todaySchedule: d?.todaySchedule ?? [],
    recentActivity: [
      ...(d?.attendanceHistory?.length ? [{ id: 'a1', text: `Sesi ${d.attendanceHistory[0].ekskul}: ${d.attendanceHistory[0].hadir} hadir dari ${d.attendanceHistory[0].total} anggota`, time: d.attendanceHistory[0].date, type: 'attendance' as const }] : []),
      { id: 'a3', text: `${d?.activePolls ?? op.polls.length} voting aktif`, time: 'Real-time', type: 'poll' as const },
      { id: 'a4', text: `${d?.galleryCount ?? op.gallery.length} galeri foto tersedia`, time: 'Real-time', type: 'gallery' as const },
    ],
  }
})

const membersPerEkskul = computed(() =>
  dashboard.value?.charts?.membersPerEkskul ?? { labels: [], data: [] }
)
const attendanceRate = computed(() =>
  dashboard.value?.charts?.attendanceStatus ?? { labels: ['Hadir', 'Izin', 'Alpha'], data: [0, 0, 0] }
)
const weeklyTrend = computed(() =>
  dashboard.value?.charts?.weeklyTrend ?? { labels: [], data: [] }
)
const scheduleIcons: Record<string, string> = {
  Basket: 'i-lucide-circle-dot', 'Paduan Suara': 'i-lucide-music', Robotik: 'i-lucide-cpu',
  Pramuka: 'i-lucide-map', KIR: 'i-lucide-flask-conical', 'Seni Tari': 'i-lucide-arrow-left-right',
  Futsal: 'i-lucide-circle', 'English Club': 'i-lucide-book-open'
}

// Warna grafik mengikuti warna aksen tema yang dipilih admin di Pengaturan
const chartColors = computed(() => accentChartPalette(auth.institution?.themeColor || '#4F46E5'))
</script>

<template>
  <div class="dashboard-page">
    <div class="welcome-section">
      <div>
        <h1 class="page-title">{{ ui.t('dashboard.operator') }}</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">{{ auth.institution?.name || 'Operator Ekskul' }} · Tahun {{ auth.institution?.activeYear }} Semester {{ auth.institution?.activeSemester }}</p>
      </div>
      <div class="header-actions"><div class="date-badge">{{ formatSchoolTime(new Date(), auth.institution, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</div></div>
    </div>

    <div class="stats-grid">
      <StatCard :label="ui.t('stat.totalMembers')" :value="summary.totalMembers" icon="i-lucide-users" :color="'var(--accent)'" />
      <StatCard :label="ui.t('stat.activeEkskul')" :value="summary.activeEkskul" icon="i-lucide-shield" :color="'var(--accent)'" />
      <StatCard :label="ui.t('stat.hadir')" :value="summary.attendanceToday" icon="i-lucide-check-square" :color="'var(--accent)'" />
    </div>

    <div class="charts-grid">
      <ClientOnly><ChartCard title="Anggota per Ekskul" type="bar" :labels="membersPerEkskul.labels" :datasets="[{ label: 'Anggota Aktif', data: membersPerEkskul.data, backgroundColor: chartColors.soft }]" /></ClientOnly>
      <ClientOnly><ChartCard title="Rekap Kehadiran" type="doughnut" :labels="attendanceRate.labels" :datasets="[{ label: 'Total', data: attendanceRate.data, backgroundColor: [chartColors.primary, chartColors.light, chartColors.lighter] }]" /></ClientOnly>
      <ClientOnly><ChartCard title="Kehadiran 7 Hari Terakhir" type="line" :labels="weeklyTrend.labels" :datasets="[{ label: 'Hadir', data: weeklyTrend.data, borderColor: chartColors.primary, backgroundColor: chartColors.area, fill: true, tension: 0.4 }]" /></ClientOnly>
    </div>

    <div class="content-grid-2col">
      <section class="panel-card">
        <div class="panel-header"><span>{{ ui.t('stat.todaySchedule') }}</span><span class="panel-count">{{ summary.todaySchedule.length }}</span></div>
        <ul class="panel-list">
          <li v-for="s in summary.todaySchedule" :key="s.id" class="panel-list-item">
            <div class="schedule-icon-wrapper"><Icon :name="scheduleIcons[s.ekskul] || 'i-lucide-calendar'" class="w-5 h-5" style="color: var(--olive-primary);" /></div>
            <div class="flex-1"><div class="font-semibold text-[13px]">{{ s.ekskul }}</div><div class="text-[11px]" style="color: var(--text-secondary);">{{ s.location }} · {{ s.coach }}</div></div>
            <div class="text-right">
              <div class="time-badge">{{ s.time }}</div>
              <span v-if="s.mandatory === false" class="optional-badge">Tidak Wajib</span>
            </div>
          </li>
          <li v-if="!summary.todaySchedule.length" class="panel-empty"><Icon name="i-lucide-calendar-off" class="w-6 h-6" style="color: var(--text-muted);" /><p>{{ ui.t('stat.noScheduleToday') }}</p></li>
        </ul>
      </section>
      <section class="panel-card">
        <div class="panel-header"><span>{{ ui.t('stat.recentActivity') }}</span><span class="panel-count">Real-time</span></div>
        <ul class="panel-list">
          <li v-for="a in summary.recentActivity" :key="a.id" class="panel-list-item">
            <div class="activity-dot" :class="`dot-${a.type}`"></div>
            <div class="flex-1"><div class="text-[13px]">{{ a.text }}</div><div class="text-[11px]" style="color: var(--text-muted);">{{ a.time }}</div></div>
          </li>
        </ul>
      </section>
    </div>

    <section class="quick-actions-card">
      <div class="panel-header">{{ ui.t('stat.quickActions') }}</div>
      <div class="quick-actions-grid">
        <NuxtLink to="/operator/attendance" class="quick-action-btn"><Icon name="i-lucide-qr-code" class="w-5 h-5" /><span>Buat QR Absensi</span></NuxtLink>
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
.panel-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: var(--bg-card); color: var(--text-primary); font-weight: var(--font-semibold); text-transform: uppercase; font-size: 12px; padding: 12px 16px; letter-spacing: 0.02em; border-bottom: 1px solid var(--border-light); }
.panel-header::before { content: ''; width: 4px; height: 14px; border-radius: 2px; background: var(--accent); flex-shrink: 0; }
.panel-count { font-size: var(--text-xs); color: var(--text-secondary); text-transform: none; font-weight: var(--font-normal); }
.panel-list { list-style: none; margin: 0; padding: 0; }
.panel-list-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border-light); transition: background 0.15s; }
.panel-list-item:hover { background: var(--bg-hover); }
.panel-list-item:last-child { border-bottom: none; }
.time-badge { font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--olive-primary); background: var(--olive-bg); border: 1px solid var(--border-light); padding: 4px 8px; border-radius: 6px; white-space: nowrap; font-variant-numeric: tabular-nums; letter-spacing: 0.02em; }
.optional-badge { font-size: 10px; padding: 1px 8px; border-radius: 8px; background: rgba(212,192,137,0.25); color: #A8863C; font-weight: var(--font-medium); }
.panel-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px; color: var(--text-muted); font-size: var(--text-sm); }
.schedule-icon-wrapper { width: 36px; height: 36px; border-radius: 8px; background: var(--olive-bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.activity-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.dot-attendance { background: var(--teal); }
.dot-poll { background: var(--yellow-cream); }
.dot-gallery { background: var(--green-soft); }
.dot-schedule { background: var(--olive-primary); }
.quick-actions-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.quick-actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; padding: 16px; }
.quick-action-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; background: var(--olive-bg); border-radius: 8px; color: var(--text-primary); text-decoration: none; font-size: var(--text-sm); font-weight: var(--font-medium); transition: all 0.2s; }
.quick-action-btn:hover { background: var(--olive-primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(139,148,103,0.3); }
</style>
