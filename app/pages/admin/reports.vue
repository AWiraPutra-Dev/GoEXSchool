<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const reportTypes = [
  { id: 'students', label: 'Laporan Data Siswa', icon: 'i-lucide-users', desc: 'Rekapitulasi data siswa per kelas', color: 'var(--teal-dark)' },
  { id: 'attendance', label: 'Laporan Kehadiran Ekskul', icon: 'i-lucide-check-square', desc: 'Rekap kehadiran siswa per ekskul', color: 'var(--teal-mid)' },
  { id: 'achievements', label: 'Laporan Prestasi', icon: 'i-lucide-award', desc: 'Pencapaian dan sertifikat siswa', color: 'var(--green-soft)' },
  { id: 'finance', label: 'Laporan Keuangan', icon: 'i-lucide-dollar-sign', desc: 'Iuran dan anggaran kegiatan ekskul', color: 'var(--yellow-cream)' },
  { id: 'annual', label: 'Laporan Tahunan', icon: 'i-lucide-file-text', desc: 'Rekapitulasi tahun ajaran', color: 'var(--orange)' }
]

const selectedId = ref('')
const loading = ref(false)
const errorMsg = ref('')
const reportData = ref<any>(null)
const generatedAt = ref('')

const selected = computed(() => reportTypes.find(r => r.id === selectedId.value))

async function showReport(r: { id: string }) {
  selectedId.value = r.id
  loading.value = true
  errorMsg.value = ''
  reportData.value = null
  try {
    reportData.value = await $fetch(`/api/admin/reports?type=${r.id}`)
    generatedAt.value = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Gagal memuat laporan.'
  } finally {
    loading.value = false
  }
}

function closeReport() {
  selectedId.value = ''
  reportData.value = null
}

function downloadExcel() {
  if (!selectedId.value) return
  window.open(`/api/admin/reports/export?type=${selectedId.value}`, '_blank')
}

function printReport() {
  window.print()
}

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'
const attLabels: Record<string, string> = { hadir: 'Hadir', izin: 'Izin', alpha: 'Alpha' }

// ---- Detail kehadiran: filter ekskul + rentang tanggal + paginasi ----
// Data detail diambil terpisah per halaman agar laporan tetap ringan.
const detailFilters = reactive({ ekskul: '', start: '', end: '' })
const detail = ref<any>({ records: [], total: 0, page: 1, pageSize: 10, totalPages: 1 })
const detailLoading = ref(false)

async function fetchDetail(page = 1) {
  detailLoading.value = true
  try {
    const params = new URLSearchParams({ page: String(page), pageSize: String(detail.value.pageSize) })
    if (detailFilters.ekskul) params.set('ekskul', detailFilters.ekskul)
    if (detailFilters.start) params.set('start', detailFilters.start)
    if (detailFilters.end) params.set('end', detailFilters.end)
    detail.value = await $fetch(`/api/admin/reports/attendance-detail?${params.toString()}`)
  } catch {
    detail.value = { records: [], total: 0, page: 1, pageSize: 20, totalPages: 1 }
  } finally {
    detailLoading.value = false
  }
}

function applyDetailFilter() { fetchDetail(1) }
function resetDetailFilter() {
  detailFilters.ekskul = ''
  detailFilters.start = ''
  detailFilters.end = ''
  fetchDetail(1)
}
function pickEkskul(name: string) {
  detailFilters.ekskul = detailFilters.ekskul === name ? '' : name
  fetchDetail(1)
}

watch(selectedId, (v) => { if (v === 'attendance') fetchDetail(1) })

// Paginasi on-screen untuk tabel detail laporan (10 baris per halaman, tetap ringan).
// Ekspor penuh tetap tersedia lewat tombol "Download Excel".
const { page: stuPage, paged: pagedStudents } = usePagination<any>(() => reportData.value?.students ?? [])
const { page: achPage, paged: pagedAchievements } = usePagination<any>(() => reportData.value?.achievements ?? [])
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">{{ ui.t('menu.reports') }}</h1>

    <div class="report-grid">
      <div v-for="r in reportTypes" :key="r.id" class="report-card" :class="{ active: selectedId === r.id }" @click="showReport(r)">
        <div class="report-icon" :style="{ background: r.color }">
          <Icon :name="r.icon" class="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 class="report-title">{{ r.label }}</h3>
          <p class="report-desc">{{ r.desc }}</p>
        </div>
        <Icon name="i-lucide-chevron-right" class="w-5 h-5" style="color: var(--text-muted); flex-shrink: 0;" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="preview-card">
      <div class="preview-body">
        <div class="loading-shimmer" style="height: 40px; border-radius: 6px;"></div>
        <div class="loading-shimmer" style="height: 200px; border-radius: 8px; margin-top: 16px;"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="errorMsg" class="preview-card">
      <div class="error-badge" style="margin: 20px;">
        <Icon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
        <span>{{ errorMsg }}</span>
      </div>
    </div>

    <!-- Report Content -->
    <div v-else-if="selected && reportData" class="preview-card print-area">
      <div class="preview-header">
        <div>
          <h3>{{ selected.label }}</h3>
          <p class="report-meta">{{ selected.desc }} · Dihasilkan {{ generatedAt }}</p>
        </div>
        <div class="preview-actions">
          <button class="btn-outline" @click="downloadExcel">
            <Icon name="i-lucide-file-spreadsheet" class="w-4 h-4" />
            Download Excel
          </button>
          <button class="btn-outline" @click="printReport">
            <Icon name="i-lucide-printer" class="w-4 h-4" />
            Cetak
          </button>
          <button class="btn-cancel-icon" @click="closeReport" title="Tutup"><Icon name="i-lucide-x" class="w-4 h-4" /></button>
        </div>
      </div>

      <div class="preview-body">
        <!-- ═══ Laporan Data Siswa ═══ -->
        <template v-if="selectedId === 'students'">
          <div class="stats-row">
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal-dark);">{{ reportData.total }}</span><span class="stat-mini-label">Total Siswa</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal);">{{ reportData.male }}</span><span class="stat-mini-label">Laki-laki</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--orange);">{{ reportData.female }}</span><span class="stat-mini-label">Perempuan</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--olive-primary);">{{ reportData.registered }}</span><span class="stat-mini-label">Sudah Daftar Akun</span></div>
          </div>

          <h4 class="section-title">Rekapitulasi per Kelas</h4>
          <div class="table-card">
            <table class="data-table">
              <thead><tr><th>Kelas</th><th>Total</th><th>Laki-laki</th><th>Perempuan</th><th>Sudah Daftar</th></tr></thead>
              <tbody>
                <tr v-for="c in reportData.perClass" :key="c.className">
                  <td class="font-semibold">{{ c.className }}</td><td>{{ c.total }}</td><td>{{ c.male }}</td><td>{{ c.female }}</td><td>{{ c.registered }}</td>
                </tr>
                <tr v-if="!reportData.perClass.length"><td colspan="5" class="text-center py-6" style="color: var(--text-muted);">Belum ada data siswa</td></tr>
              </tbody>
            </table>
          </div>

          <h4 class="section-title">Detail Siswa</h4>
          <div class="table-card table-scroll">
            <table class="data-table">
              <thead><tr><th>NIS</th><th>Nama</th><th>Kelas</th><th>JK</th><th>Telepon</th><th>Status Akun</th></tr></thead>
              <tbody>
                <tr v-for="s in pagedStudents" :key="s.nis">
                  <td><span class="nis-code">{{ s.nis }}</span></td>
                  <td class="font-semibold">{{ s.name }}</td><td>{{ s.class }}</td><td>{{ s.gender }}</td>
                  <td style="color: var(--text-secondary);">{{ s.phone || '-' }}</td>
                  <td><span class="status-badge" :class="s.accountStatus === 'Sudah daftar' ? 'status-active' : 'status-pending'">{{ s.accountStatus }}</span></td>
                </tr>
                <tr v-if="!reportData.students.length"><td colspan="6" class="text-center py-6" style="color: var(--text-muted);">Belum ada data siswa</td></tr>
              </tbody>
            </table>
            <PaginationBar v-model:page="stuPage" :total="reportData.students.length" />
          </div>
        </template>

        <!-- ═══ Laporan Kehadiran Ekskul ═══ -->
        <template v-else-if="selectedId === 'attendance'">
          <div class="stats-row">
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal-dark);">{{ reportData.rate }}%</span><span class="stat-mini-label">Tingkat Kehadiran</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal);">{{ reportData.hadir }}</span><span class="stat-mini-label">Hadir</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--orange);">{{ reportData.izin }}</span><span class="stat-mini-label">Izin</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--red-orange);">{{ reportData.alpha }}</span><span class="stat-mini-label">Alpha</span></div>
          </div>

          <h4 class="section-title">Rekapitulasi per Ekskul</h4>
          <div class="table-card">
            <table class="data-table">
              <thead><tr><th>Ekskul</th><th>Hadir</th><th>Izin</th><th>Alpha</th><th>Total</th><th>Kehadiran</th></tr></thead>
              <tbody>
                <tr v-for="e in reportData.perEkskul" :key="e.ekskul" class="ekskul-summary-row" :class="{ active: detailFilters.ekskul === e.ekskul }" :title="'Tampilkan detail ' + e.ekskul" @click="pickEkskul(e.ekskul)">
                  <td class="font-semibold">{{ e.ekskul }}</td>
                  <td>{{ e.hadir }}</td><td>{{ e.izin }}</td><td>{{ e.alpha }}</td><td>{{ e.total }}</td>
                  <td><span class="status-badge status-active">{{ e.rate }}%</span></td>
                </tr>
                <tr v-if="!reportData.perEkskul.length"><td colspan="6" class="text-center py-6" style="color: var(--text-muted);">Belum ada data kehadiran</td></tr>
              </tbody>
            </table>
          </div>
          <p class="filter-hint"><Icon name="i-lucide-mouse-pointer-click" class="w-3.5 h-3.5" /> Klik baris ekskul di atas untuk memfilter detail kehadiran di bawah.</p>

          <h4 class="section-title">Detail Kehadiran</h4>

          <!-- Filter: ekskul + rentang tanggal -->
          <div class="detail-filter-bar">
            <div class="filter-field">
              <label>Ekskul</label>
              <select v-model="detailFilters.ekskul" class="form-input" @change="applyDetailFilter">
                <option value="">Semua Ekskul</option>
                <option v-for="e in reportData.perEkskul" :key="e.ekskul" :value="e.ekskul">{{ e.ekskul }}</option>
              </select>
            </div>
            <div class="filter-field">
              <label>Dari Tanggal</label>
              <input v-model="detailFilters.start" type="date" class="form-input" @change="applyDetailFilter" />
            </div>
            <div class="filter-field">
              <label>Sampai Tanggal</label>
              <input v-model="detailFilters.end" type="date" class="form-input" @change="applyDetailFilter" />
            </div>
            <button class="btn-outline filter-reset" @click="resetDetailFilter" title="Reset filter">
              <Icon name="i-lucide-rotate-ccw" class="w-4 h-4" /> Reset
            </button>
          </div>

          <!-- Tabel detail: scroll + paginasi agar tetap ringan -->
          <div class="table-card detail-scroll">
            <table class="data-table">
              <thead><tr><th>Tanggal</th><th>Ekskul</th><th>Siswa</th><th>Kelas</th><th>Status</th><th>Waktu</th><th>Keterangan</th></tr></thead>
              <tbody>
                <tr v-if="detailLoading"><td colspan="7"><div class="loading-shimmer" style="height: 22px; border-radius: 4px;"></div></td></tr>
                <template v-else>
                  <tr v-for="(r, i) in detail.records" :key="i">
                    <td>{{ fmtDate(r.date) }}</td>
                    <td class="font-semibold">{{ r.ekskul }}</td>
                    <td>{{ r.student }}</td><td>{{ r.class }}</td>
                    <td><span class="attendance-badge" :class="`badge-${r.status}`">{{ attLabels[r.status] || r.status }}</span></td>
                    <td style="font-variant-numeric: tabular-nums; letter-spacing: 0.02em; font-weight: var(--font-medium); font-size: var(--text-sm);">{{ r.time || '-' }}</td>
                    <td style="color: var(--text-secondary); font-size: var(--text-sm);">{{ r.notes || '-' }}</td>
                  </tr>
                  <tr v-if="!detail.records.length"><td colspan="7" class="text-center py-6" style="color: var(--text-muted);">Tidak ada data kehadiran untuk filter ini</td></tr>
                </template>
              </tbody>
            </table>
          </div>

          <!-- Paginasi -->
          <PaginationBar :page="detail.page" :total="detail.total" :page-size="detail.pageSize" @update:page="fetchDetail($event)" />
        </template>

        <!-- ═══ Laporan Prestasi ═══ -->
        <template v-else-if="selectedId === 'achievements'">
          <div class="stats-row">
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal-dark);">{{ reportData.total }}</span><span class="stat-mini-label">Total Prestasi</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal);">{{ reportData.byType.juara }}</span><span class="stat-mini-label">Juara</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--orange);">{{ reportData.byType.sertifikat }}</span><span class="stat-mini-label">Sertifikat</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--olive-primary);">{{ reportData.byType.partisipasi }}</span><span class="stat-mini-label">Partisipasi</span></div>
          </div>

          <h4 class="section-title">Prestasi per Tingkat</h4>
          <div class="table-card">
            <table class="data-table">
              <thead><tr><th>Tingkat</th><th>Jumlah</th></tr></thead>
              <tbody>
                <tr v-for="(count, level) in reportData.byLevel" :key="level">
                  <td class="font-semibold capitalize">{{ level }}</td><td>{{ count }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 class="section-title">Detail Prestasi</h4>
          <div class="table-card table-scroll">
            <table class="data-table">
              <thead><tr><th>Tanggal</th><th>Prestasi</th><th>Siswa</th><th>Kelas</th><th>Ekskul</th><th>Tipe</th><th>Tingkat</th></tr></thead>
              <tbody>
                <tr v-for="(a, i) in pagedAchievements" :key="i">
                  <td>{{ fmtDate(a.date) }}</td><td class="font-semibold">{{ a.title }}</td>
                  <td>{{ a.student }}</td><td>{{ a.class }}</td><td>{{ a.ekskul }}</td>
                  <td><span class="status-badge status-active">{{ a.type }}</span></td>
                  <td><span class="level-badge">{{ a.level }}</span></td>
                </tr>
                <tr v-if="!reportData.achievements.length"><td colspan="7" class="text-center py-6" style="color: var(--text-muted);">Belum ada data prestasi</td></tr>
              </tbody>
            </table>
            <PaginationBar v-model:page="achPage" :total="reportData.achievements.length" />
          </div>
        </template>

        <!-- ═══ Laporan Keuangan ═══ -->
        <template v-else-if="selectedId === 'finance'">
          <div class="notice-box">
            <Icon name="i-lucide-info" class="w-5 h-5 shrink-0" style="color: var(--orange);" />
            <div>
              <p class="font-semibold text-[14px]" style="color: var(--text-primary);">Modul keuangan belum tersedia</p>
              <p class="text-[13px]" style="color: var(--text-secondary);">Sistem belum mencatat data iuran &amp; anggaran kegiatan ekskul. Laporan ini akan otomatis terisi setelah modul keuangan dibangun.</p>
            </div>
          </div>

          <h4 class="section-title">Gambaran Data Terkait</h4>
          <div class="stats-row">
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal-dark);">{{ reportData.context.students }}</span><span class="stat-mini-label">Jumlah Siswa</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal);">{{ reportData.context.ekskuls }}</span><span class="stat-mini-label">Jumlah Ekskul</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--orange);">{{ reportData.context.members }}</span><span class="stat-mini-label">Anggota Aktif</span></div>
          </div>
        </template>

        <!-- ═══ Laporan Tahunan ═══ -->
        <template v-else-if="selectedId === 'annual'">
          <div class="annual-head">
            <h4 class="annual-title">{{ reportData.institutionName }}</h4>
            <p class="report-meta">Tahun Ajaran {{ reportData.year }} · Semester {{ reportData.semester }}</p>
          </div>

          <div class="stats-row">
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal-dark);">{{ reportData.students }}</span><span class="stat-mini-label">Siswa</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal);">{{ reportData.teachers }}</span><span class="stat-mini-label">Pembimbing</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--olive-primary);">{{ reportData.ekskuls }}</span><span class="stat-mini-label">Ekskul</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--orange);">{{ reportData.members }}</span><span class="stat-mini-label">Anggota Aktif</span></div>
          </div>

          <div class="stats-row">
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal-dark);">{{ reportData.attendanceRate }}%</span><span class="stat-mini-label">Kehadiran</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--orange);">{{ reportData.achievements }}</span><span class="stat-mini-label">Prestasi</span></div>
            <div class="stat-mini"><span class="stat-mini-value" style="color: var(--olive-primary);">{{ reportData.sessions }}</span><span class="stat-mini-label">Sesi Absensi</span></div>
          </div>

          <h4 class="section-title">Rekapitulasi Lengkap</h4>
          <div class="table-card">
            <table class="data-table">
              <tbody>
                <tr><td class="recap-label">Jumlah Siswa</td><td class="font-semibold">{{ reportData.students }}</td></tr>
                <tr><td class="recap-label">Jumlah Pembimbing Ekskul</td><td class="font-semibold">{{ reportData.teachers }}</td></tr>
                <tr><td class="recap-label">Jumlah Ekstrakurikuler</td><td class="font-semibold">{{ reportData.ekskuls }}</td></tr>
                <tr><td class="recap-label">Anggota Aktif</td><td class="font-semibold">{{ reportData.members }}</td></tr>
                <tr><td class="recap-label">Jadwal Latihan</td><td class="font-semibold">{{ reportData.schedules }}</td></tr>
                <tr><td class="recap-label">Sesi Absensi QR</td><td class="font-semibold">{{ reportData.sessions }}</td></tr>
                <tr><td class="recap-label">Catatan Kehadiran</td><td class="font-semibold">{{ reportData.attendanceRecords }} ({{ reportData.attendanceRate }}% hadir)</td></tr>
                <tr><td class="recap-label">Jumlah Prestasi</td><td class="font-semibold">{{ reportData.achievements }}</td></tr>
                <tr><td class="recap-label">Jumlah Voting</td><td class="font-semibold">{{ reportData.polls }}</td></tr>
                <tr><td class="recap-label">Jumlah Berita</td><td class="font-semibold">{{ reportData.news }}</td></tr>
                <tr><td class="recap-label">Jumlah Galeri</td><td class="font-semibold">{{ reportData.galleries }}</td></tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }

/* ===== Grid Laporan ===== */
.report-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 12px; }
.report-card {
  display: flex; align-items: center; gap: 16px;
  background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px;
  padding: 16px 20px; cursor: pointer; transition: all 0.2s;
}
.report-card:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-color: var(--olive-primary); }
.report-card.active { border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.report-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.report-title { font-size: var(--text-md); font-weight: var(--font-semibold); color: var(--text-primary); }
.report-desc { font-size: var(--text-sm); color: var(--text-secondary); margin-top: 2px; }

/* ===== Preview ===== */
.preview-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.preview-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border-light); gap: 12px; flex-wrap: wrap; }
.preview-header h3 { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.report-meta { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }
.preview-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: white; color: var(--text-primary); font-size: var(--text-sm); padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { background: var(--bg-hover); }
.btn-cancel-icon { background: none; border: none; cursor: pointer; font-size: 16px; color: var(--text-muted); padding: 4px 8px; }
.preview-body { padding: 20px; }

/* ===== Statistik ===== */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 20px; }
.stat-mini { background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px; text-align: center; }
.stat-mini-value { display: block; font-size: var(--text-xl); font-weight: var(--font-bold); }
.stat-mini-label { font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; }

/* ===== Tabel ===== */
.section-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin: 20px 0 10px; }
.table-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.table-scroll { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.data-table tr:first-child td { border-top: none; }
.nis-code { font-size: var(--text-xs); font-variant-numeric: tabular-nums; letter-spacing: 0.04em; font-weight: var(--font-medium); color: var(--text-secondary); }
.status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); white-space: nowrap; }
.status-active { background: rgba(74,158,158,0.15); color: var(--teal); }
.status-pending { background: rgba(212,192,137,0.2); color: var(--orange); }
.attendance-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); white-space: nowrap; }
.badge-hadir { background: rgba(74,158,158,0.15); color: var(--teal); }
.badge-izin { background: rgba(212,192,137,0.2); color: var(--orange); }
.badge-alpha { background: rgba(212,106,90,0.15); color: var(--red-orange); }
.level-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(74,158,158,0.12); color: var(--teal-dark); font-weight: var(--font-medium); }
.recap-label { color: var(--text-secondary); font-weight: var(--font-medium); width: 45%; }

/* ===== Detail Kehadiran: filter + paginasi ===== */
.detail-filter-bar {
  display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap;
  background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 8px;
  padding: 12px 16px; margin-bottom: 12px;
}
.filter-field { display: flex; flex-direction: column; gap: 4px; }
.filter-field label { font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--text-muted); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); background: var(--bg-card); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.filter-field .form-input { min-width: 180px; }
.filter-reset { height: 36px; background: var(--bg-card); }
.detail-scroll { max-height: 460px; overflow: auto; }
.detail-scroll thead th { position: sticky; top: 0; z-index: 1; }
.detail-pagination {
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  margin-top: 12px;
}
.pagination-info { font-size: var(--text-xs); color: var(--text-muted); }
.pagination-btns { display: flex; align-items: center; gap: 8px; }
.pagination-page { font-size: var(--text-xs); color: var(--text-secondary); font-weight: var(--font-medium); }
.btn-outline:disabled { opacity: 0.45; cursor: not-allowed; }

/* ===== Baris rekap ekskul bisa diklik ===== */
.ekskul-summary-row { cursor: pointer; transition: background 0.15s; }
.ekskul-summary-row:hover { background: var(--bg-hover); }
.ekskul-summary-row.active { background: rgba(74,158,158,0.08); }
.filter-hint { display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 8px; }

/* ===== Lainnya ===== */
.notice-box { display: flex; gap: 12px; align-items: flex-start; background: rgba(212,192,137,0.12); border: 1px solid rgba(212,192,137,0.35); border-radius: 10px; padding: 16px; }
.error-badge { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; font-size: var(--text-sm); color: #dc2626; }
.annual-head { margin-bottom: 16px; }
.annual-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.loading-shimmer { background: linear-gradient(90deg, var(--bg-hover) 25%, #e9ecef 37%, var(--bg-hover) 63%); background-size: 400% 100%; animation: shimmer 1.4s ease infinite; }
@keyframes shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
.capitalize { text-transform: capitalize; }

/* ===== Cetak ===== */
@media print {
  :global(.pagination-bar) { display: none !important; }
  :global(.top-bar), :global(.sidebar), :global(.app-footer), :global(.breadcrumb-bar) { display: none !important; }
  :global(.main-content) { margin: 0 !important; padding: 0 !important; }
  .report-grid { display: none !important; }
  .preview-actions { display: none !important; }
  .preview-card { border: none !important; box-shadow: none !important; }
  .page-title { display: none !important; }
}
</style>
