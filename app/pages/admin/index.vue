<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const auth = useAuthStore()
const master = useMasterDataStore()
const ui = useUiStore()

const loading = ref(true)
const dashboardData = ref<any>(null)
let pollTimer: ReturnType<typeof setInterval>

async function loadDashboard() {
  try { dashboardData.value = await $fetch('/api/admin/dashboard') } catch {}
}

onMounted(async () => {
  await Promise.all([loadDashboard(), master.fetchAll()])
  loading.value = false
  pollTimer = setInterval(() => {
    loadDashboard()
    master.fetchAll()
  }, 30_000)
})
onUnmounted(() => clearInterval(pollTimer))

const summary = computed(() => {
  const d = dashboardData.value
  return {
    students: master.totalStudents || d?.students || 0,
    teachers: master.totalTeachers || d?.teachers || 0,
    extracurriculars: master.totalEkskul || d?.extracurriculars || 0,
    activeOperators: master.activeUsers || d?.activeOperators || 0,
    totalUsers: master.totalUsers,
    remainingQuota: d?.remainingQuota ?? 1288,
    todaySchedule: d?.todaySchedule || [],
    activityLogs: d?.activityLogs || [],
  }
})

const ekskulChart = computed(() => {
  const d = dashboardData.value
  const labels = d?.charts?.ekskulMembers?.labels ?? master.extracurriculars.map(e => e.name)
  const data = d?.charts?.ekskulMembers?.data ?? master.extracurriculars.map(e => e.members || 0)
  return { labels, data }
})
const genderChart = computed(() => {
  const d = dashboardData.value
  return {
    labels: d?.charts?.gender?.labels ?? ['Laki-laki', 'Perempuan'],
    data: d?.charts?.gender?.data ?? [0, 0],
  }
})
const attendanceTrend = computed(() => {
  const d = dashboardData.value
  return {
    labels: d?.charts?.attendanceTrend?.labels ?? [],
    data: d?.charts?.attendanceTrend?.data ?? [],
  }
})

// Warna grafik mengikuti warna aksen tema yang dipilih admin di Pengaturan
const chartColors = computed(() => accentChartPalette(auth.institution?.themeColor || '#4F46E5'))
</script>

<template>
  <div class="dashboard-page">
    <div class="welcome-section">
      <div>
        <h1 class="page-title">{{ ui.t('dashboard.admin') }}</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">{{ auth.institution?.name }} · Tahun {{ auth.institution?.activeYear }} Semester {{ auth.institution?.activeSemester }}</p>
      </div>
      <div class="header-actions"><div class="date-badge">{{ formatSchoolTime(new Date(), auth.institution, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</div></div>
    </div>

    <div class="stats-grid">
      <StatCard :label="ui.t('stat.totalStudents')" :value="summary.students" icon="i-lucide-users" :color="'var(--accent)'" />
      <StatCard :label="ui.t('stat.totalTeachers')" :value="summary.teachers" icon="i-lucide-user-check" :color="'var(--accent)'" />
      <StatCard :label="ui.t('stat.totalEkskul')" :value="summary.extracurriculars" icon="i-lucide-shield" :color="'var(--accent)'" />
      <StatCard :label="ui.t('stat.activeEkskul')" :value="summary.activeOperators" icon="i-lucide-user-cog" :color="'var(--accent)'" />
      <StatCard :label="ui.t('stat.totalMembers')" :value="summary.remainingQuota" icon="i-lucide-ticket" :color="'var(--accent)'" />
    </div>

    <div class="charts-grid">
      <ClientOnly><ChartCard title="Anggota per Ekskul" type="bar" :labels="ekskulChart.labels" :datasets="[{ label: 'Anggota', data: ekskulChart.data, backgroundColor: chartColors.soft }]" /></ClientOnly>
      <ClientOnly><ChartCard title="Distribusi Gender" type="doughnut" :labels="genderChart.labels" :datasets="[{ label: 'Jumlah', data: genderChart.data, backgroundColor: [chartColors.primary, chartColors.light] }]" /></ClientOnly>
      <ClientOnly><ChartCard v-if="attendanceTrend.labels.length" title="Tren Kehadiran (4 Minggu)" type="line" :labels="attendanceTrend.labels" :datasets="[{ label: 'Kehadiran %', data: attendanceTrend.data, borderColor: chartColors.primary, backgroundColor: chartColors.area, fill: true, tension: 0.4 }]" /></ClientOnly>
    </div>

    <div class="content-grid-2col">
      <section class="panel-card">
        <div class="panel-header"><span>{{ ui.t('stat.todaySchedule') }}</span><span class="panel-count">{{ summary.todaySchedule.length }}</span></div>
        <ul class="panel-list">
          <li v-for="item in summary.todaySchedule" :key="item.id" class="panel-list-item">
            <div class="time-badge">{{ item.time }}</div>
            <div class="flex-1"><div class="font-semibold text-[13px]">{{ item.title }}</div><div class="text-[11px]" style="color: var(--text-secondary);">{{ item.location }}</div></div>
            <span class="status-badge status-upcoming">Akan Datang</span>
          </li>
          <li v-if="!summary.todaySchedule.length" class="panel-empty"><Icon name="i-lucide-calendar-off" class="w-6 h-6 mb-2" style="color: var(--text-muted);" /><p>{{ ui.t('stat.noScheduleToday') }}</p></li>
        </ul>
      </section>
      <section class="panel-card">
        <div class="panel-header"><span>{{ ui.t('stat.recentActivity') }}</span><span class="panel-count">Real-time</span></div>
        <ul class="panel-list">
          <li v-for="log in summary.activityLogs" :key="log.id" class="panel-list-item">
            <div class="activity-avatar">{{ log.avatar }}</div>
            <div class="flex-1"><div class="text-[13px]"><strong>{{ log.actor }}</strong> {{ log.action }}</div><div class="text-[11px]" style="color: var(--text-muted);">{{ log.timestamp }}</div></div>
          </li>
          <li v-if="!summary.activityLogs.length" class="panel-empty"><Icon name="i-lucide-inbox" class="w-6 h-6 mb-2" style="color: var(--text-muted);" /><p>Belum ada aktivitas.</p></li>
        </ul>
      </section>
    </div>

    <section class="quick-actions-card">
      <div class="panel-header">{{ ui.t('stat.quickActions') }}</div>
      <div class="quick-actions-grid">
        <NuxtLink to="/admin/students" class="quick-action-btn"><Icon name="i-lucide-user-plus" class="w-5 h-5" /><span>Tambah Siswa</span></NuxtLink>
        <NuxtLink to="/admin/users" class="quick-action-btn"><Icon name="i-lucide-shield" class="w-5 h-5" /><span>Atur Privileges</span></NuxtLink>
        <NuxtLink to="/admin/reports" class="quick-action-btn"><Icon name="i-lucide-file-text" class="w-5 h-5" /><span>Buat Laporan</span></NuxtLink>
        <NuxtLink to="/admin/settings" class="quick-action-btn"><Icon name="i-lucide-settings" class="w-5 h-5" /><span>Pengaturan</span></NuxtLink>
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
.status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); white-space: nowrap; }
.status-upcoming { background: rgba(139,148,103,0.15); color: var(--olive-primary); }
.panel-empty { display: flex; flex-direction: column; align-items: center; padding: 32px 16px; color: var(--text-muted); font-size: var(--text-sm); }
.activity-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--olive-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: var(--font-bold); flex-shrink: 0; }
.quick-actions-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.quick-actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; padding: 16px; }
.quick-action-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; background: var(--olive-bg); border-radius: 8px; color: var(--text-primary); text-decoration: none; font-size: var(--text-sm); font-weight: var(--font-medium); transition: all 0.2s; }
.quick-action-btn:hover { background: var(--olive-primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(139,148,103,0.3); }
</style>
