<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const auth = useAuthStore()
const master = useMasterDataStore()

const loading = ref(true)
const dashboardData = ref<any>({
  students: 0, classes: 0, teachers: 0, extracurriculars: 0,
  activeOperators: 0, remainingQuota: 1288,
  todaySchedule: [], activityLogs: []
})

onMounted(async () => {
  await Promise.all([
    master.fetchAll(),
    $fetch('/api/admin/dashboard').then(d => { dashboardData.value = d }).catch(() => {})
  ])
  loading.value = false
})

const summary = computed(() => ({
  students: master.totalStudents || dashboardData.value.students,
  classes: master.totalClasses || dashboardData.value.classes,
  teachers: master.totalTeachers || dashboardData.value.teachers,
  extracurriculars: master.totalEkskul || dashboardData.value.extracurriculars,
  activeOperators: master.activeUsers || dashboardData.value.activeOperators,
  totalUsers: master.totalUsers,
  remainingQuota: dashboardData.value.remainingQuota,
  todaySchedule: dashboardData.value.todaySchedule || [],
  activityLogs: dashboardData.value.activityLogs || []
}))

const ekskulChart = computed(() => {
  const eks = master.extracurriculars
  return {
    labels: eks.map(e => e.name),
    datasets: [{ label: 'Anggota', data: eks.map(e => e.members || 0), backgroundColor: '#8B9467' }]
  }
})
const genderChart = {
  labels: ['Laki-laki', 'Perempuan'],
  datasets: [{ label: 'Jumlah', data: [0, 0], backgroundColor: ['#4A9E9E', '#D4C089'] }]
}
const attendanceTrend = {
  labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5'],
  datasets: [{ label: 'Kehadiran %', data: [78, 82, 85, 79, 88], borderColor: '#8B9467', backgroundColor: 'rgba(139,148,103,0.1)', fill: true, tension: 0.4 }]
}
const classDistribution = {
  labels: ['X IPA 1', 'X IPA 2', 'XI IPA 1', 'XI IPA 2', 'XI IPS 1', 'XI IPS 2', 'XII IPA 1', 'XII IPA 2'],
  datasets: [{ label: 'Siswa', data: [55, 52, 48, 50, 42, 38, 70, 65], backgroundColor: ['#2D6A6A', '#4A9E9E', '#7BA87B', '#8B9467', '#D4C089', '#D4956A', '#D46A5A', '#C45A4A'] }]
}
</script>

<template>
  <div class="dashboard-page">
    <div class="welcome-section">
      <div>
        <h1 class="page-title">Dashboard Admin</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">{{ auth.institution?.name }} · Tahun {{ auth.institution?.activeYear }} Semester {{ auth.institution?.activeSemester }}</p>
      </div>
      <div class="header-actions"><div class="date-badge">{{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</div></div>
    </div>

    <div class="stats-grid">
      <StatCard label="Total Siswa" :value="summary.students" icon="i-lucide-users" :color="'var(--teal-dark)'" />
      <StatCard label="Rombel" :value="summary.classes" icon="i-lucide-school" :color="'var(--teal-mid)'" />
      <StatCard label="Guru/Pembina" :value="summary.teachers" icon="i-lucide-user-check" :color="'var(--teal)'" />
      <StatCard label="Ekskul Aktif" :value="summary.extracurriculars" icon="i-lucide-shield" :color="'var(--yellow-cream)'" />
      <StatCard label="Operator" :value="summary.activeOperators" icon="i-lucide-user-cog" :color="'var(--orange)'" />
      <StatCard label="Sisa Lisensi" :value="summary.remainingQuota" icon="i-lucide-ticket" :color="'var(--red-orange)'" />
    </div>

    <div class="charts-grid">
      <ClientOnly><ChartCard title="Anggota per Ekskul" type="bar" :labels="ekskulChart.labels" :datasets="ekskulChart.datasets" /></ClientOnly>
      <ClientOnly><ChartCard title="Distribusi Gender" type="doughnut" :labels="genderChart.labels" :datasets="genderChart.datasets" /></ClientOnly>
      <ClientOnly><ChartCard title="Tren Kehadiran Bulanan" type="line" :labels="attendanceTrend.labels" :datasets="attendanceTrend.datasets" /></ClientOnly>
      <ClientOnly><ChartCard title="Siswa per Kelas" type="bar" :labels="classDistribution.labels" :datasets="classDistribution.datasets" /></ClientOnly>
    </div>

    <div class="content-grid-2col">
      <section class="panel-card">
        <div class="panel-header"><span>Kegiatan Ekskul Hari Ini</span><span class="panel-count">{{ summary.todaySchedule.length }} kegiatan</span></div>
        <ul class="panel-list">
          <li v-for="item in summary.todaySchedule" :key="item.id" class="panel-list-item">
            <div class="time-badge">{{ item.time }}</div>
            <div class="flex-1"><div class="font-semibold text-[13px]">{{ item.title }}</div><div class="text-[11px]" style="color: var(--text-secondary);">{{ item.coach }}</div></div>
            <span class="status-badge status-upcoming">{{ item.status === 'akan_datang' ? 'Akan Datang' : 'Sedang Berlangsung' }}</span>
          </li>
          <li v-if="!summary.todaySchedule.length" class="panel-empty"><Icon name="i-lucide-calendar-off" class="w-6 h-6 mb-2" style="color: var(--text-muted);" /><p>Tidak ada kegiatan terjadwal hari ini.</p></li>
        </ul>
      </section>
      <section class="panel-card">
        <div class="panel-header"><span>Aktivitas Terbaru</span><span class="panel-count">Real-time</span></div>
        <ul class="panel-list">
          <li v-for="log in summary.activityLogs" :key="log.id" class="panel-list-item">
            <div class="activity-avatar">{{ log.avatar }}</div>
            <div class="flex-1"><div class="text-[13px]"><strong>{{ log.actor }}</strong> {{ log.action }}</div><div class="text-[11px]" style="color: var(--text-muted);">{{ log.timestamp }}</div></div>
          </li>
        </ul>
      </section>
    </div>

    <section class="quick-actions-card">
      <div class="panel-header">Aksi Cepat</div>
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
.panel-header { display: flex; align-items: center; justify-content: space-between; background: var(--olive-primary); color: white; font-weight: var(--font-semibold); text-transform: uppercase; font-size: 12px; padding: 10px 16px; letter-spacing: 0.02em; }
.panel-count { font-size: var(--text-xs); opacity: 0.8; text-transform: none; }
.panel-list { list-style: none; margin: 0; padding: 0; }
.panel-list-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border-light); transition: background 0.15s; }
.panel-list-item:hover { background: var(--bg-hover); }
.panel-list-item:last-child { border-bottom: none; }
.time-badge { font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--olive-primary); background: var(--olive-bg); padding: 4px 8px; border-radius: 4px; white-space: nowrap; font-family: 'Courier New', monospace; }
.status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); white-space: nowrap; }
.status-upcoming { background: rgba(139,148,103,0.15); color: var(--olive-primary); }
.panel-empty { display: flex; flex-direction: column; align-items: center; padding: 32px 16px; color: var(--text-muted); font-size: var(--text-sm); }
.activity-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--olive-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: var(--font-bold); flex-shrink: 0; }
.quick-actions-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.quick-actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; padding: 16px; }
.quick-action-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; background: var(--olive-bg); border-radius: 8px; color: var(--text-primary); text-decoration: none; font-size: var(--text-sm); font-weight: var(--font-medium); transition: all 0.2s; }
.quick-action-btn:hover { background: var(--olive-primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(139,148,103,0.3); }
</style>
