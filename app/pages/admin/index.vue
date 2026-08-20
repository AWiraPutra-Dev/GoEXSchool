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

// ===== Grafik kehadiran per ekskul (4 bulan) =====
const selectedEkskul = ref<string>('')

const ekskulAttendanceData = computed(() => {
  const d = dashboardData.value?.charts?.ekskulAttendance
  return d // { labels: string[], months: string[], data: number[][] }
})

// Semua nama ekskul (dari master data) untuk dropdown
const allEkskulNames = computed(() =>
  master.extracurriculars.map(e => e.name)
)

// Set default ke ekskul pertama setelah data tersedia
watchEffect(() => {
  const names = allEkskulNames.value
  if (names.length && !selectedEkskul.value) {
    selectedEkskul.value = names[0]
  }
})

// Data chart yang ditampilkan berdasarkan pilihan dropdown
const attendanceChartDisplay = computed(() => {
  const d = ekskulAttendanceData.value
  if (!d?.labels?.length || !selectedEkskul.value) return { labels: [], datasets: [] }

  const idx = d.labels.indexOf(selectedEkskul.value)
  // Ekskul tanpa data kehadiran → tampilkan data 0 untuk semua bulan
  const data = idx >= 0 ? d.data[idx] : d.months.map(() => 0)
  return {
    labels: d.months,
    datasets: [{
      label: `Kehadiran ${selectedEkskul.value}`,
      data,
      borderColor: chartColors.value.primary,
      backgroundColor: chartColors.value.area,
      fill: true,
      tension: 0.4,
    }],
  }
})

const attendanceChartType = 'line' as const

// Warna grafik mengikuti warna aksen tema yang dipilih admin di Pengaturan
const chartColors = computed(() => accentChartPalette(auth.institution?.themeColor || '#4F46E5'))
</script>

<template>
  <div class="dashboard-page">
    <div class="welcome-section">
      <div>
        <h1 class="page-title">{{ ui.t('dashboard.admin') }}</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">{{ auth.institution?.name }} · {{ ui.t('reports.schoolYearLabel') }} {{ auth.institution?.activeYear }} {{ ui.t('reports.semesterLabel') }} {{ auth.institution?.activeSemester }}</p>
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

    <!-- Grafik Kehadiran Tiap Ekskul -->
    <div class="chart-section">
      <div class="chart-section-header">
        <span class="chart-section-title">{{ ui.t('dashboard.attendancePerEkskul') }}</span>
        <select v-model="selectedEkskul" class="ekskul-select">
          <option v-for="e in allEkskulNames" :key="e" :value="e">{{ e }}</option>
        </select>
      </div>
      <ClientOnly>
        <ChartCard
          v-if="attendanceChartDisplay.labels.length"
          :title="`Kehadiran ${selectedEkskul}`"
          type="line"
          :labels="attendanceChartDisplay.labels"
          :datasets="attendanceChartDisplay.datasets"
        />
        <div v-else class="chart-empty">
          <Icon name="i-lucide-bar-chart-3" class="w-8 h-8" style="color: var(--text-muted);" />
          <p>{{ ui.t('dashboard.noAttendanceData') }}</p>
        </div>
      </ClientOnly>
    </div>

    <div class="content-grid-2col">
      <section class="panel-card">
        <div class="panel-header"><span>{{ ui.t('stat.todaySchedule') }}</span><span class="panel-count">{{ summary.todaySchedule.length }}</span></div>
        <ul class="panel-list">
          <li v-for="item in summary.todaySchedule" :key="item.id" class="panel-list-item">
            <div class="time-badge">{{ item.time }}</div>
            <div class="flex-1"><div class="font-semibold text-[13px]">{{ item.title }}</div><div class="text-[11px]" style="color: var(--text-secondary);">{{ item.location }}</div></div>
            <span class="status-badge status-upcoming">{{ ui.t('attendance.berlangsung') }}</span>
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
          <li v-if="!summary.activityLogs.length" class="panel-empty"><Icon name="i-lucide-inbox" class="w-6 h-6 mb-2" style="color: var(--text-muted);" /><p>{{ ui.t('dashboard.noActivity') }}</p></li>
        </ul>
      </section>
    </div>

    <section class="quick-actions-card">
      <div class="panel-header">{{ ui.t('stat.quickActions') }}</div>
      <div class="quick-actions-grid">
        <NuxtLink to="/admin/students" class="quick-action-btn"><Icon name="i-lucide-user-plus" class="w-5 h-5" /><span>{{ ui.t('dashboard.addStudent') }}</span></NuxtLink>
        <NuxtLink to="/admin/users" class="quick-action-btn"><Icon name="i-lucide-shield" class="w-5 h-5" /><span>{{ ui.t('dashboard.manageRoles') }}</span></NuxtLink>
        <NuxtLink to="/admin/reports" class="quick-action-btn"><Icon name="i-lucide-file-text" class="w-5 h-5" /><span>{{ ui.t('dashboard.createReport') }}</span></NuxtLink>
        <NuxtLink to="/admin/settings" class="quick-action-btn"><Icon name="i-lucide-settings" class="w-5 h-5" /><span>{{ ui.t('dashboard.settings') }}</span></NuxtLink>
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
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.chart-section { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.chart-section-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.chart-section-title { font-weight: var(--font-semibold); font-size: 12px; text-transform: uppercase; letter-spacing: 0.02em; color: var(--text-primary); display: flex; align-items: center; gap: 8px; }
.chart-section-title::before { content: ''; width: 4px; height: 14px; border-radius: 2px; background: var(--accent); flex-shrink: 0; }
.ekskul-select { padding: 6px 10px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); background: var(--bg-card); cursor: pointer; outline: none; }
.ekskul-select:focus { border-color: var(--accent); }
.chart-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px 16px; color: var(--text-muted); font-size: var(--text-sm); }
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
.time-badge { font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--olive-primary); background: var(--olive-bg); border: 1px solid var(--border-light); padding: 4px 8px; border-radius: 4px; white-space: nowrap; font-variant-numeric: tabular-nums; letter-spacing: 0.02em; }
.status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 4px; font-weight: var(--font-medium); white-space: nowrap; }
.status-upcoming { background: rgba(139,148,103,0.15); color: var(--olive-primary); }
.panel-empty { display: flex; flex-direction: column; align-items: center; padding: 32px 16px; color: var(--text-muted); font-size: var(--text-sm); }
.activity-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--olive-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: var(--font-bold); flex-shrink: 0; }
.quick-actions-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.quick-actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; padding: 16px; }
.quick-action-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; background: var(--olive-bg); border-radius: 8px; color: var(--text-primary); text-decoration: none; font-size: var(--text-sm); font-weight: var(--font-medium); transition: all 0.2s; }
.quick-action-btn:hover { background: var(--olive-primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(139,148,103,0.3); }
</style>
