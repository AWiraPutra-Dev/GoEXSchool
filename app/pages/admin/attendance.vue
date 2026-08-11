<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const master = useMasterDataStore()

const totalStudents = computed(() => master.totalStudents)
const totalAttendance = computed(() => op.attendanceHistory.length)
const totalHadir = computed(() => op.attendanceHistory.reduce((s, h) => s + h.hadir, 0))
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">Rekap Absensi</h1>
    <p class="text-[13px]" style="color: var(--text-secondary);">Pantau kehadiran seluruh kegiatan ekskul</p>

    <div class="stats-row">
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal-dark);">{{ totalStudents }}</span><span class="stat-mini-label">Total Siswa</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal);">{{ totalAttendance }}</span><span class="stat-mini-label">Sesi Absensi</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--green-soft);">{{ totalHadir }}</span><span class="stat-mini-label">Total Hadir</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--orange);">{{ op.members.length }}</span><span class="stat-mini-label">Anggota Aktif</span></div>
    </div>

    <div class="table-card">
      <div class="table-toolbar"><h3 class="font-semibold text-[14px]">Riwayat Absensi</h3></div>
      <table class="data-table">
        <thead><tr><th>Tanggal</th><th>Ekskul</th><th>Hadir</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          <tr v-for="h in op.attendanceHistory" :key="h.date + h.ekskul">
            <td>{{ h.date }}</td><td class="font-semibold">{{ h.ekskul }}</td>
            <td>{{ h.hadir }}</td><td>{{ h.total }}</td>
            <td><span class="status-badge status-done">{{ h.status }}</span></td>
          </tr>
          <tr v-if="!op.attendanceHistory.length"><td colspan="5" class="text-center py-8" style="color: var(--text-muted);">Belum ada data absensi</td></tr>
        </tbody>
      </table>
    </div>

    <div class="quick-actions-card">
      <div class="panel-header">Info</div>
      <div class="quick-links">
        <span class="info-text">Halaman ini menampilkan rekap absensi. Pembuatan sesi absensi dilakukan oleh Operator.</span>
        <NuxtLink to="/admin/students" class="quick-link">Kelola Data Siswa</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-mini { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px; text-align: center; }
.stat-mini-value { display: block; font-size: var(--text-xl); font-weight: var(--font-bold); }
.stat-mini-label { font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; }
.table-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.table-toolbar { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); }
.status-done { background: rgba(74,158,158,0.15); color: var(--teal); }
.quick-actions-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.panel-header { background: var(--olive-primary); color: white; font-weight: var(--font-semibold); text-transform: uppercase; font-size: 12px; padding: 10px 16px; }
.quick-links { display: flex; gap: 12px; padding: 16px; flex-wrap: wrap; }
.quick-link { padding: 8px 16px; background: var(--olive-bg); border-radius: 6px; color: var(--text-primary); text-decoration: none; font-size: var(--text-sm); transition: all 0.2s; }
.quick-link:hover { background: var(--olive-primary); color: white; }
.info-text { font-size: var(--text-sm); color: var(--text-secondary); padding: 8px 0; }
</style>
