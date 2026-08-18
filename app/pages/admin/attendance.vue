<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const op = useOperatorDataStore()
const master = useMasterDataStore()

onMounted(() => {
  op.fetchAll()
  master.fetchReference()
})

const totalStudents = computed(() => master.totalStudents)
const totalAttendance = computed(() => op.attendanceHistory.length)
const totalHadir = computed(() => op.attendanceHistory.reduce((s, h) => s + h.hadir, 0))

// Ekspansi baris riwayat: tampilkan detail per siswa
const expanded = ref<Record<string, boolean>>({})
function toggleRow(id: string) { expanded.value[id] = !expanded.value[id] }

const search = ref('')
const filteredHistory = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return op.attendanceHistory
  return op.attendanceHistory.filter((h: any) =>
    (h.ekskul || '').toLowerCase().includes(q) ||
    (h.date || '').toLowerCase().includes(q) ||
    (h.status || '').toLowerCase().includes(q)
  )
})
const { page, paged, totalPages } = usePagination(() => filteredHistory.value)

// Paginasi detail siswa di dalam baris yang diperluas (10 baris per halaman)
const detailPages = ref<Record<string, number>>({})
function pagedRecords(h: any): any[] {
  const pg = detailPages.value[h.id] ?? 1
  return ((h.records ?? []) as any[]).slice((pg - 1) * 10, pg * 10)
}

function countStatus(h: any, status: string) {
  return h.records?.filter((r: any) => r.status === status).length ?? 0
}

const statusLabel: Record<string, string> = { hadir: 'Hadir', izin: 'Izin', alpha: 'Alpha' }
const statusIcon: Record<string, string> = {
  hadir: 'i-lucide-check-circle-2',
  izin: 'i-lucide-file-text',
  alpha: 'i-lucide-x-circle',
}
const statusColor: Record<string, string> = {
  hadir: 'var(--green-soft)',
  izin: 'var(--orange)',
  alpha: 'var(--red-orange)',
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">{{ ui.t('attendance.riwayat') }}</h1>
    <p class="text-[13px]" style="color: var(--text-secondary);">Pantau kehadiran seluruh kegiatan ekskul</p>

    <div class="stats-row">
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal-dark);">{{ totalStudents }}</span><span class="stat-mini-label">Total Siswa</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal);">{{ totalAttendance }}</span><span class="stat-mini-label">Sesi Absensi</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--green-soft);">{{ totalHadir }}</span><span class="stat-mini-label">Total Hadir</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--orange);">{{ op.members.length }}</span><span class="stat-mini-label">Anggota Aktif</span></div>
    </div>

    <div class="table-card">
      <div class="table-toolbar">
        <h3 class="font-semibold text-[14px]">Riwayat Absensi</h3>
        <input v-model="search" type="text" placeholder="Cari ekskul, tanggal, atau status..." class="search-input">
      </div>
      <table class="data-table">
        <thead><tr><th>Tanggal</th><th>Ekskul</th><th>Hadir</th><th>Izin</th><th>Alpha</th><th>Total</th><th>Status</th><th class="text-right"></th></tr></thead>
        <tbody>
          <template v-for="h in paged" :key="h.id">
            <tr class="history-row" :class="{ 'row-open': expanded[h.id] }" @click="toggleRow(h.id)">
              <td>{{ h.date }}</td><td class="font-semibold">{{ h.ekskul }}</td>
              <td><span class="count-chip count-hadir">{{ h.hadir }}</span></td>
              <td><span class="count-chip count-izin">{{ countStatus(h, 'izin') }}</span></td>
              <td><span class="count-chip count-alpha">{{ countStatus(h, 'alpha') }}</span></td>
              <td>{{ h.total }}</td>
              <td><span class="status-badge" :class="h.status === 'Berlangsung' ? 'status-live' : 'status-done'">{{ h.status }}</span></td>
              <td class="text-right">
                <button class="expand-btn" :class="{ 'expanded': expanded[h.id] }" title="Lihat detail siswa" @click.stop>
                  <Icon name="i-lucide-chevron-down" class="w-4 h-4" @click="toggleRow(h.id)" />
                </button>
              </td>
            </tr>
            <tr v-if="expanded[h.id]" class="detail-row">
              <td colspan="8">
                <div class="detail-wrap">
                  <div class="detail-stats">
                    <span class="detail-stat"><span class="dot" style="background: var(--green-soft);"></span>{{ countStatus(h, 'hadir') }} Hadir</span>
                    <span class="detail-stat"><span class="dot" style="background: var(--orange);"></span>{{ countStatus(h, 'izin') }} Izin</span>
                    <span class="detail-stat"><span class="dot" style="background: var(--red-orange);"></span>{{ countStatus(h, 'alpha') }} Alpha</span>
                  </div>
                  <table class="data-table detail-table">
                    <thead><tr><th>No</th><th>NIS</th><th>Nama Siswa</th><th>Kelas</th><th>Status</th><th>Waktu</th><th>Keterangan / Alasan</th></tr></thead>
                    <tbody>
                      <tr v-for="(r, i) in pagedRecords(h)" :key="r.id">
                        <td>{{ i + 1 }}</td>
                        <td>{{ r.nis }}</td>
                        <td class="font-semibold">{{ r.student }}</td>
                        <td>{{ r.class }}</td>
                        <td><span class="status-badge" :style="{ background: statusColor[r.status] + '22', color: statusColor[r.status] }">
                          <Icon :name="statusIcon[r.status] || 'i-lucide-user'" class="w-3.5 h-3.5" /> {{ statusLabel[r.status] || r.status }}
                        </span></td>
                        <td>{{ r.time || '-' }}</td>
                        <td class="notes-cell">{{ r.notes || (r.status === 'hadir' ? 'Hadir tepat waktu' : 'Tanpa keterangan') }}</td>
                      </tr>
                      <tr v-if="!h.records?.length"><td colspan="7" class="text-center py-6" style="color: var(--text-muted);">Belum ada catatan siswa pada sesi ini</td></tr>
                    </tbody>
                  </table>
                  <PaginationBar :page="detailPages[h.id] ?? 1" :total="h.records?.length ?? 0" @update:page="detailPages[h.id] = $event" />
                </div>
              </td>
            </tr>
          </template>
          <tr v-if="!filteredHistory.length"><td colspan="8" class="text-center py-8" style="color: var(--text-muted);">Belum ada data absensi</td></tr>
        </tbody>
      </table>
      <PaginationBar v-model:page="page" :total="filteredHistory.length" />
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
.table-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 240px; color: var(--text-primary); background: var(--bg-card); }
.search-input:focus { outline: none; border-color: var(--olive-primary); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.text-right { text-align: right; }
.history-row { cursor: pointer; transition: background 0.15s; }
.history-row:hover { background: var(--bg-hover); }
.row-open { background: rgba(139,148,103,0.05); }
.count-chip { display: inline-flex; align-items: center; justify-content: center; min-width: 26px; padding: 1px 8px; border-radius: 10px; font-size: var(--text-xs); font-weight: var(--font-bold); }
.count-hadir { background: rgba(99,183,132,0.15); color: var(--green-soft); }
.count-izin { background: rgba(212,192,137,0.25); color: var(--orange); }
.count-alpha { background: rgba(229,114,94,0.15); color: var(--red-orange); }
.expand-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px; border-radius: 4px; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
.expand-btn:hover { color: var(--accent); background: var(--bg-hover); }
.expand-btn svg { transition: transform 0.2s; }
.expand-btn.expanded svg { transform: rotate(180deg); }
.detail-row td { background: var(--bg-main); padding: 16px 20px !important; }
.detail-wrap { border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; background: var(--bg-card); }
.detail-stats { display: flex; gap: 16px; padding: 10px 16px; border-bottom: 1px solid var(--border-light); font-size: var(--text-xs); color: var(--text-secondary); font-weight: var(--font-medium); }
.detail-stat { display: inline-flex; align-items: center; gap: 6px; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.detail-table th { background: var(--bg-card); }
.detail-table td { padding: 8px 16px; font-size: var(--text-xs); }
.notes-cell { max-width: 260px; }
.status-badge { font-size: var(--text-xs); padding: 3px 10px; border-radius: 10px; font-weight: var(--font-medium); display: inline-flex; align-items: center; gap: 5px; }
.status-done { background: rgba(74,158,158,0.15); color: var(--teal); }
.status-live { background: rgba(139,148,103,0.15); color: var(--olive-primary); }
.quick-actions-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.panel-header { display: flex; align-items: center; gap: 10px; background: var(--bg-card); color: var(--text-primary); font-weight: var(--font-semibold); text-transform: uppercase; font-size: 12px; padding: 12px 16px; letter-spacing: 0.02em; border-bottom: 1px solid var(--border-light); }
.panel-header::before { content: ''; width: 4px; height: 14px; border-radius: 2px; background: var(--accent); flex-shrink: 0; }
.quick-links { display: flex; gap: 12px; padding: 16px; flex-wrap: wrap; }
.quick-link { padding: 8px 16px; background: var(--olive-bg); border-radius: 6px; color: var(--text-primary); text-decoration: none; font-size: var(--text-sm); transition: all 0.2s; }
.quick-link:hover { background: var(--olive-primary); color: white; }
.info-text { font-size: var(--text-sm); color: var(--text-secondary); padding: 8px 0; }
</style>
