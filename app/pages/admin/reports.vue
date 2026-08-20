<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const reportTypes = computed(() => [
  { id: 'students', label: ui.t('reports.studentReport'), icon: 'i-lucide-users', desc: ui.t('reports.studentReportDesc') },
  { id: 'attendance', label: ui.t('reports.attendanceReport'), icon: 'i-lucide-check-square', desc: ui.t('reports.attendanceReportDesc') },
  { id: 'achievements', label: ui.t('reports.achievementReport'), icon: 'i-lucide-award', desc: ui.t('reports.achievementReportDesc') },
  { id: 'finance', label: ui.t('reports.financeReport'), icon: 'i-lucide-dollar-sign', desc: ui.t('reports.financeReportDesc') },
  { id: 'annual', label: ui.t('reports.annualReport'), icon: 'i-lucide-file-text', desc: ui.t('reports.annualReportDesc') }
])

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
    const params = new URLSearchParams({ type: r.id })
    if (r.id === 'achievements') {
      if (achFilter.level) params.set('level', achFilter.level)
      if (achFilter.class) params.set('class', achFilter.class)
    }
    if (r.id === 'annual') {
      if (annualFilter.ekskul) params.set('ekskul', annualFilter.ekskul)
      if (annualFilter.class) params.set('class', annualFilter.class)
    }
    reportData.value = await $fetch(`/api/admin/reports?${params.toString()}`)
    generatedAt.value = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch (e: any) {
    errorMsg.value = e?.data?.message || ui.t('reports.loadFailed')
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
  const params = new URLSearchParams({ type: selectedId.value })
  if (selectedId.value === 'achievements') {
    if (achFilter.level) params.set('level', achFilter.level)
    if (achFilter.class) params.set('class', achFilter.class)
  }
  if (selectedId.value === 'annual') {
    if (annualFilter.ekskul) params.set('ekskul', annualFilter.ekskul)
    if (annualFilter.class) params.set('class', annualFilter.class)
  }
  window.open(`/api/admin/reports/export?${params.toString()}`, '_blank')
}

function printReport() {
  window.print()
}

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'
const attLabels = computed(() => ({ hadir: ui.t('attendance.hadir'), izin: ui.t('attendance.izin'), alpha: ui.t('attendance.alpha') }))

// ---- Detail kehadiran ----
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
function resetDetailFilter() { detailFilters.ekskul = ''; detailFilters.start = ''; detailFilters.end = ''; fetchDetail(1) }
function pickEkskul(name: string) { detailFilters.ekskul = detailFilters.ekskul === name ? '' : name; fetchDetail(1) }
watch(selectedId, (v) => { if (v === 'attendance') fetchDetail(1) })

const { page: stuPage, paged: pagedStudents } = usePagination<any>(() => reportData.value?.students ?? [])
const { page: achPage, paged: pagedAchievements } = usePagination<any>(() => reportData.value?.achievements ?? [])

// ---- Filter Prestasi ----
const achFilter = reactive({ level: '', class: '' })
function applyAchFilter() { showReport({ id: 'achievements' }) }
function resetAchFilter() { achFilter.level = ''; achFilter.class = ''; showReport({ id: 'achievements' }) }

// ---- Filter Tahunan ----
const annualFilter = reactive({ ekskul: '', class: '' })
function applyAnnualFilter() { showReport({ id: 'annual' }) }
function resetAnnualFilter() { annualFilter.ekskul = ''; annualFilter.class = ''; showReport({ id: 'annual' }) }
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">{{ ui.t('menu.reports') }}</h1>

    <div class="report-grid">
      <div v-for="r in reportTypes" :key="r.id" class="report-card" :class="{ active: selectedId === r.id }" @click="showReport(r)">
        <div class="report-icon">
          <Icon :name="r.icon" class="w-5 h-5" />
        </div>
        <div>
          <h3 class="report-title">{{ r.label }}</h3>
          <p class="report-desc">{{ r.desc }}</p>
        </div>
        <Icon name="i-lucide-chevron-right" class="w-5 h-5" style="color: var(--text-muted); flex-shrink: 0;" />
      </div>
    </div>

    <div v-if="loading" class="preview-card">
      <div class="preview-body">
        <div class="loading-shimmer" style="height: 40px;"></div>
        <div class="loading-shimmer" style="height: 200px; margin-top: 16px;"></div>
      </div>
    </div>

    <div v-else-if="errorMsg" class="preview-card">
      <div class="error-badge" style="margin: 20px;">
        <Icon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
        <span>{{ errorMsg }}</span>
      </div>
    </div>

    <div v-else-if="selected && reportData" class="preview-card print-area">
      <div class="preview-header">
        <div>
          <h3>{{ selected.label }}</h3>
          <p class="report-meta">{{ selected.desc }} &middot; {{ ui.t('reports.generatedAt') }} {{ generatedAt }}</p>
        </div>
        <div class="preview-actions">
          <button class="btn-outline" @click="downloadExcel">
            <Icon name="i-lucide-file-spreadsheet" class="w-4 h-4" />
            {{ ui.t('reports.downloadExcel') }}
          </button>
          <button class="btn-outline" @click="printReport">
            <Icon name="i-lucide-printer" class="w-4 h-4" />
            {{ ui.t('reports.print') }}
          </button>
          <button class="btn-cancel-icon" @click="closeReport" :title="ui.t('action.close')"><Icon name="i-lucide-x" class="w-4 h-4" /></button>
        </div>
      </div>

      <div class="preview-body">
        <!-- Laporan Data Siswa -->
        <template v-if="selectedId === 'students'">
          <div class="stats-row">
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.total }}</span><span class="stat-mini-label">{{ ui.t('reports.totalStudents') }}</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.male }}</span><span class="stat-mini-label">{{ ui.t('reports.male') }}</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.female }}</span><span class="stat-mini-label">{{ ui.t('reports.female') }}</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.registered }}</span><span class="stat-mini-label">{{ ui.t('reports.registered') }}</span></div>
          </div>

          <h4 class="section-title">{{ ui.t('reports.recapPerClass') }}</h4>
          <table class="data-table">
            <thead><tr><th>{{ ui.t('reports.studentTable.class') }}</th><th>{{ ui.t('reports.studentTable.total') }}</th><th>{{ ui.t('reports.studentTable.male') }}</th><th>{{ ui.t('reports.studentTable.female') }}</th><th>{{ ui.t('reports.studentTable.registered') }}</th></tr></thead>
            <tbody>
              <tr v-for="c in reportData.perClass" :key="c.className">
                <td class="font-semibold">{{ c.className }}</td><td>{{ c.total }}</td><td>{{ c.male }}</td><td>{{ c.female }}</td><td>{{ c.registered }}</td>
              </tr>
              <tr v-if="!reportData.perClass.length"><td colspan="5" class="text-center py-6" style="color: var(--text-muted);">{{ ui.t('reports.studentTable.noData') }}</td></tr>
            </tbody>
          </table>

          <h4 class="section-title">{{ ui.t('reports.studentDetails') }}</h4>
          <div class="table-scroll">
            <table class="data-table">
              <thead><tr><th>{{ ui.t('reports.studentTable.nis') }}</th><th>{{ ui.t('reports.studentTable.name') }}</th><th>{{ ui.t('reports.studentTable.class') }}</th><th>{{ ui.t('reports.studentTable.gender') }}</th><th>{{ ui.t('reports.studentTable.phone') }}</th><th>{{ ui.t('reports.studentTable.accountStatus') }}</th></tr></thead>
              <tbody>
                <tr v-for="s in pagedStudents" :key="s.nis">
                  <td><span class="nis-code">{{ s.nis }}</span></td>
                  <td class="font-semibold">{{ s.name }}</td><td>{{ s.class }}</td><td>{{ s.gender }}</td>
                  <td style="color: var(--text-secondary);">{{ s.phone || '-' }}</td>
                  <td><span class="badge" :class="s.accountStatus === 'Sudah daftar' ? 'badge-active' : 'badge-pending'">{{ s.accountStatus }}</span></td>
                </tr>
                <tr v-if="!reportData.students.length"><td colspan="6" class="text-center py-6" style="color: var(--text-muted);">{{ ui.t('reports.studentTable.noData') }}</td></tr>
              </tbody>
            </table>
            <PaginationBar v-model:page="stuPage" :total="reportData.students.length" />
          </div>
        </template>

        <!-- Laporan Kehadiran Ekskul -->
        <template v-else-if="selectedId === 'attendance'">
          <div class="stats-row">
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.rate }}%</span><span class="stat-mini-label">{{ ui.t('reports.attendanceRate') }}</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.hadir }}</span><span class="stat-mini-label">{{ ui.t('attendance.hadir') }}</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.izin }}</span><span class="stat-mini-label">{{ ui.t('attendance.izin') }}</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.alpha }}</span><span class="stat-mini-label">{{ ui.t('attendance.alpha') }}</span></div>
          </div>

          <h4 class="section-title">{{ ui.t('reports.recapPerEkskul') }}</h4>
          <table class="data-table">
            <thead><tr><th>{{ ui.t('reports.attendanceTable.exskul') }}</th><th>{{ ui.t('reports.attendanceTable.present') }}</th><th>{{ ui.t('reports.attendanceTable.permitted') }}</th><th>{{ ui.t('reports.attendanceTable.absent') }}</th><th>{{ ui.t('reports.attendanceTable.total') }}</th><th>{{ ui.t('reports.attendanceTable.rate') }}</th></tr></thead>
            <tbody>
              <tr v-for="e in reportData.perEkskul" :key="e.ekskul" class="ekskul-summary-row" :class="{ active: detailFilters.ekskul === e.ekskul }" :title="'Tampilkan detail ' + e.ekskul" @click="pickEkskul(e.ekskul)">
                <td class="font-semibold">{{ e.ekskul }}</td>
                <td>{{ e.hadir }}</td><td>{{ e.izin }}</td><td>{{ e.alpha }}</td><td>{{ e.total }}</td>
                <td><span class="badge badge-active">{{ e.rate }}%</span></td>
              </tr>
              <tr v-if="!reportData.perEkskul.length"><td colspan="6" class="text-center py-6" style="color: var(--text-muted);">{{ ui.t('reports.attendanceTable.noData') }}</td></tr>
            </tbody>
          </table>
          <p class="filter-hint"><Icon name="i-lucide-mouse-pointer-click" class="w-3.5 h-3.5" /> {{ ui.t('reports.clickRowFilter') }}</p>

          <h4 class="section-title">{{ ui.t('reports.attendanceDetails') }}</h4>

          <div class="filter-bar">
            <div class="filter-field">
              <label>{{ ui.t('reports.filterExskul') }}</label>
              <select v-model="detailFilters.ekskul" class="form-input" @change="applyDetailFilter">
                <option value="">{{ ui.t('reports.allExskul') }}</option>
                <option v-for="e in reportData.perEkskul" :key="e.ekskul" :value="e.ekskul">{{ e.ekskul }}</option>
              </select>
            </div>
            <div class="filter-field">
              <label>{{ ui.t('reports.fromDate') }}</label>
              <input v-model="detailFilters.start" type="date" class="form-input" @change="applyDetailFilter" />
            </div>
            <div class="filter-field">
              <label>{{ ui.t('reports.toDate') }}</label>
              <input v-model="detailFilters.end" type="date" class="form-input" @change="applyDetailFilter" />
            </div>
            <button class="btn-outline filter-reset" @click="resetDetailFilter" :title="ui.t('action.reset')">
              <Icon name="i-lucide-rotate-ccw" class="w-4 h-4" /> {{ ui.t('action.reset') }}
            </button>
          </div>

          <div class="detail-scroll">
            <table class="data-table">
              <thead><tr><th>{{ ui.t('reports.detailTable.date') }}</th><th>{{ ui.t('reports.detailTable.exskul') }}</th><th>{{ ui.t('reports.detailTable.student') }}</th><th>{{ ui.t('reports.detailTable.class') }}</th><th>{{ ui.t('reports.detailTable.status') }}</th><th>{{ ui.t('reports.detailTable.time') }}</th><th>{{ ui.t('reports.detailTable.notes') }}</th></tr></thead>
              <tbody>
                <tr v-if="detailLoading"><td colspan="7"><div class="loading-shimmer" style="height: 22px;"></div></td></tr>
                <template v-else>
                  <tr v-for="(r, i) in detail.records" :key="i">
                    <td>{{ fmtDate(r.date) }}</td>
                    <td class="font-semibold">{{ r.ekskul }}</td>
                    <td>{{ r.student }}</td><td>{{ r.class }}</td>
                    <td><span class="badge" :class="`badge-${r.status}`">{{ attLabels[r.status] || r.status }}</span></td>
                    <td class="tabular">{{ r.time || '-' }}</td>
                    <td style="color: var(--text-secondary); font-size: var(--text-sm);">{{ r.notes || '-' }}</td>
                  </tr>
                  <tr v-if="!detail.records.length"><td colspan="7" class="text-center py-6" style="color: var(--text-muted);">{{ ui.t('reports.detailTable.noData') }}</td></tr>
                </template>
              </tbody>
            </table>
          </div>

          <PaginationBar :page="detail.page" :total="detail.total" :page-size="detail.pageSize" @update:page="fetchDetail($event)" />
        </template>

        <!-- Laporan Prestasi -->
        <template v-else-if="selectedId === 'achievements'">
          <div class="filter-bar">
            <div class="filter-field">
              <label>{{ ui.t('reports.level') }}</label>
              <select v-model="achFilter.level" class="form-input" @change="applyAchFilter">
                <option value="">{{ ui.t('reports.allLevels') }}</option>
                <option value="sekolah">Sekolah</option>
                <option value="kecamatan">Kecamatan</option>
                <option value="kota">Kota</option>
                <option value="provinsi">Provinsi</option>
                <option value="nasional">Nasional</option>
              </select>
            </div>
            <div class="filter-field">
              <label>{{ ui.t('reports.studentTable.class') }}</label>
              <select v-model="achFilter.class" class="form-input" @change="applyAchFilter">
                <option value="">{{ ui.t('reports.allClasses') }}</option>
                <option v-for="cls in (reportData as any)?.availableClasses || []" :key="cls" :value="cls">{{ cls }}</option>
              </select>
            </div>
            <button class="btn-outline filter-reset" @click="resetAchFilter">
              <Icon name="i-lucide-rotate-ccw" class="w-4 h-4" /> {{ ui.t('action.reset') }}
            </button>
          </div>

          <div class="stats-row">
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.total }}</span><span class="stat-mini-label">{{ ui.t('reports.totalAchievements') }}</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.byType.juara }}</span><span class="stat-mini-label">{{ ui.t('reports.champions') }}</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.byType.sertifikat }}</span><span class="stat-mini-label">{{ ui.t('reports.certificates') }}</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.byType.partisipasi }}</span><span class="stat-mini-label">{{ ui.t('reports.participation') }}</span></div>
          </div>

          <h4 class="section-title">{{ ui.t('reports.recapPerLevel') }}</h4>
          <table class="data-table">
            <thead><tr><th>{{ ui.t('reports.level') }}</th><th>{{ ui.t('reports.count') }}</th></tr></thead>
            <tbody>
              <tr v-for="(count, level) in reportData.byLevel" :key="level">
                <td class="capitalize">{{ level }}</td><td>{{ count }}</td>
              </tr>
            </tbody>
          </table>

          <h4 class="section-title">{{ ui.t('reports.achievementDetails') }}</h4>
          <div class="table-scroll">
            <table class="data-table">
              <thead><tr><th>{{ ui.t('reports.achievementTable.date') }}</th><th>{{ ui.t('reports.achievementTable.title') }}</th><th>{{ ui.t('reports.achievementTable.student') }}</th><th>{{ ui.t('reports.achievementTable.class') }}</th><th>{{ ui.t('reports.achievementTable.exskul') }}</th><th>{{ ui.t('reports.achievementTable.type') }}</th><th>{{ ui.t('reports.achievementTable.level') }}</th></tr></thead>
              <tbody>
                <tr v-for="(a, i) in pagedAchievements" :key="i">
                  <td>{{ fmtDate(a.date) }}</td><td class="font-semibold">{{ a.title }}</td>
                  <td>{{ a.student }}</td><td>{{ a.class }}</td><td>{{ a.ekskul }}</td>
                  <td><span class="badge badge-active">{{ a.type }}</span></td>
                  <td>{{ a.level }}</td>
                </tr>
                <tr v-if="!reportData.achievements.length"><td colspan="7" class="text-center py-6" style="color: var(--text-muted);">{{ ui.t('reports.achievementTable.noData') }}</td></tr>
              </tbody>
            </table>
            <PaginationBar v-model:page="achPage" :total="reportData.achievements.length" />
          </div>
        </template>

        <!-- Laporan Keuangan -->
        <template v-else-if="selectedId === 'finance'">
          <div class="notice-box">
            <Icon name="i-lucide-info" class="w-5 h-5 shrink-0" style="color: var(--orange);" />
            <div>
              <p class="font-semibold" style="font-size: 14px; color: var(--text-primary);">{{ ui.t('reports.financeNotAvailable') }}</p>
              <p style="font-size: 13px; color: var(--text-secondary);">{{ ui.t('reports.financeNotAvailableDesc') }}</p>
            </div>
          </div>

          <h4 class="section-title">{{ ui.t('reports.relatedData') }}</h4>
          <div class="stats-row">
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.context.students }}</span><span class="stat-mini-label">{{ ui.t('reports.totalStudents') }}</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.context.ekskuls }}</span><span class="stat-mini-label">{{ ui.t('reports.totalExskul') }}</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.context.members }}</span><span class="stat-mini-label">{{ ui.t('reports.activeMembers') }}</span></div>
          </div>
        </template>

        <!-- Laporan Tahunan -->
        <template v-else-if="selectedId === 'annual'">
          <div class="annual-head">
            <h4 class="annual-title">{{ reportData.institutionName }}</h4>
            <p class="report-meta">{{ ui.t('reports.schoolYearLabel') }} {{ reportData.year }} &middot; {{ ui.t('reports.semesterLabel') }} {{ reportData.semester }}</p>
          </div>

          <div class="filter-bar">
            <div class="filter-field">
              <label>{{ ui.t('reports.filterExskul') }}</label>
              <select v-model="annualFilter.ekskul" class="form-input" @change="applyAnnualFilter">
                <option value="">{{ ui.t('reports.allExskul') }}</option>
                <option v-for="e in (reportData as any)?.availableEkskuls || []" :key="e" :value="e">{{ e }}</option>
              </select>
            </div>
            <div class="filter-field">
              <label>{{ ui.t('reports.studentTable.class') }}</label>
              <select v-model="annualFilter.class" class="form-input" @change="applyAnnualFilter">
                <option value="">{{ ui.t('reports.allClasses') }}</option>
                <option v-for="cls in (reportData as any)?.availableClasses || []" :key="cls" :value="cls">{{ cls }}</option>
              </select>
            </div>
            <button class="btn-outline filter-reset" @click="resetAnnualFilter">
              <Icon name="i-lucide-rotate-ccw" class="w-4 h-4" /> Reset
            </button>
          </div>

          <div class="stats-row">
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.students }}</span><span class="stat-mini-label">Siswa</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.teachers }}</span><span class="stat-mini-label">Pembimbing</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.ekskuls }}</span><span class="stat-mini-label">Ekskul</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.members }}</span><span class="stat-mini-label">Anggota Aktif</span></div>
          </div>

          <div class="stats-row">
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.attendanceRate }}%</span><span class="stat-mini-label">Kehadiran</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.achievements }}</span><span class="stat-mini-label">Prestasi</span></div>
            <div class="stat-mini"><span class="stat-mini-value">{{ reportData.sessions }}</span><span class="stat-mini-label">Sesi Absensi</span></div>
          </div>

          <h4 class="section-title">{{ ui.t('reports.recapComplete') }}</h4>
          <table class="data-table">
            <tbody>
              <tr><td class="recap-label">{{ ui.t('reports.recap.students') }}</td><td class="font-semibold">{{ reportData.students }}</td></tr>
              <tr><td class="recap-label">{{ ui.t('reports.recap.teachers') }}</td><td class="font-semibold">{{ reportData.teachers }}</td></tr>
              <tr><td class="recap-label">{{ ui.t('reports.recap.exskul') }}</td><td class="font-semibold">{{ reportData.ekskuls }}</td></tr>
              <tr><td class="recap-label">{{ ui.t('reports.recap.members') }}</td><td class="font-semibold">{{ reportData.members }}</td></tr>
              <tr><td class="recap-label">{{ ui.t('reports.recap.schedules') }}</td><td class="font-semibold">{{ reportData.schedules }}</td></tr>
              <tr><td class="recap-label">{{ ui.t('reports.recap.sessions') }}</td><td class="font-semibold">{{ reportData.sessions }}</td></tr>
              <tr><td class="recap-label">{{ ui.t('reports.recap.attendanceRecords') }}</td><td class="font-semibold">{{ reportData.attendanceRecords }} ({{ reportData.attendanceRate }}%)</td></tr>
              <tr><td class="recap-label">{{ ui.t('reports.recap.achievements') }}</td><td class="font-semibold">{{ reportData.achievements }}</td></tr>
              <tr><td class="recap-label">{{ ui.t('reports.recap.polls') }}</td><td class="font-semibold">{{ reportData.polls }}</td></tr>
              <tr><td class="recap-label">{{ ui.t('reports.recap.news') }}</td><td class="font-semibold">{{ reportData.news }}</td></tr>
              <tr><td class="recap-label">{{ ui.t('reports.recap.galleries') }}</td><td class="font-semibold">{{ reportData.galleries }}</td></tr>
            </tbody>
          </table>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: 20px; font-weight: 700; color: var(--text-primary); }

/* Grid Laporan */
.report-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 10px; }
.report-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--bg-card); border: 1px solid var(--border-light);
  padding: 14px 18px; cursor: pointer; transition: all 0.15s;
}
.report-card:hover { border-color: var(--olive-primary); }
.report-card.active { border-color: var(--olive-primary); background: var(--olive-bg); }
.report-icon { width: 36px; height: 36px; background: var(--bg-hover); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--text-primary); }
.report-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.report-desc { font-size: 12px; color: var(--text-secondary); margin-top: 1px; }

/* Preview */
.preview-card { background: var(--bg-card); border: 1px solid var(--border-light); }
.preview-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border-light); gap: 12px; flex-wrap: wrap; }
.preview-header h3 { font-size: 16px; font-weight: 700; color: var(--text-primary); }
.report-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.preview-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: white; color: var(--text-primary); font-size: 12px; padding: 6px 12px; border: 1px solid var(--border-light); cursor: pointer; }
.btn-outline:hover { background: var(--bg-hover); }
.btn-cancel-icon { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px 8px; }
.preview-body { padding: 18px; }

/* Statistik */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 18px; }
.stat-mini { padding: 14px; text-align: center; }
.stat-mini-value { display: block; font-size: 18px; font-weight: 700; color: var(--text-primary); }
.stat-mini-label { font-size: 11px; color: var(--text-muted); margin-top: 3px; }

/* Tabel */
.section-title { font-size: 14px; font-weight: 700; color: var(--text-primary); margin: 18px 0 8px; }
.table-scroll { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.data-table th { text-align: left; padding: 8px 12px; font-weight: 600; color: var(--text-secondary); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; border-bottom: 1px solid var(--border-light); }
.data-table td { padding: 8px 12px; border-bottom: 1px solid var(--border-light); }
.data-table tr:last-child td { border-bottom: none; }
.nis-code { font-size: 11px; font-variant-numeric: tabular-nums; letter-spacing: 0.04em; font-weight: 500; color: var(--text-secondary); }
.tabular { font-variant-numeric: tabular-nums; letter-spacing: 0.02em; font-weight: 500; }

/* Badge sederhana — hanya warna teks, tanpa background-radius */
.badge { font-size: 11px; padding: 2px 8px; font-weight: 500; white-space: nowrap; }
.badge-active { color: var(--teal); }
.badge-pending { color: var(--orange); }
.badge-hadir { color: var(--teal); }
.badge-izin { color: var(--orange); }
.badge-alpha { color: var(--red-orange); }
.recap-label { color: var(--text-secondary); font-weight: 500; width: 45%; }

/* Filter bar */
.filter-bar {
  display: flex; align-items: flex-end; gap: 10px; flex-wrap: wrap;
  padding: 10px 14px; margin-bottom: 14px;
}
.filter-field { display: flex; flex-direction: column; gap: 3px; }
.filter-field label { font-size: 11px; font-weight: 600; color: var(--text-muted); }
.form-input { padding: 6px 10px; border: 1px solid var(--border-light); font-size: 12px; color: var(--text-primary); background: var(--bg-card); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.filter-field .form-input { min-width: 160px; }
.filter-reset { height: 32px; background: var(--bg-card); }
.detail-scroll { max-height: 440px; overflow: auto; }
.detail-scroll thead th { position: sticky; top: 0; z-index: 1; border-bottom: 1px solid var(--border-light); }

/* Ekskul row clickable */
.ekskul-summary-row { cursor: pointer; }
.ekskul-summary-row:hover { background: var(--bg-hover); }
.ekskul-summary-row.active { background: rgba(74,158,158,0.06); }
.filter-hint { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted); margin-top: 6px; }

/* Lainnya */
.notice-box { display: flex; gap: 12px; align-items: flex-start; padding: 14px; }
.error-badge { display: flex; align-items: center; gap: 10px; padding: 10px 12px; font-size: 12px; color: #dc2626; }
.annual-head { margin-bottom: 14px; }
.annual-title { font-size: 16px; font-weight: 700; color: var(--text-primary); }
.loading-shimmer { background: linear-gradient(90deg, var(--bg-hover) 25%, #e9ecef 37%, var(--bg-hover) 63%); background-size: 400% 100%; animation: shimmer 1.4s ease infinite; height: 20px; }
@keyframes shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
.capitalize { text-transform: capitalize; }

@media print {
  :global(.pagination-bar) { display: none !important; }
  :global(.top-bar), :global(.sidebar), :global(.app-footer), :global(.breadcrumb-bar) { display: none !important; }
  :global(.main-content) { margin: 0 !important; padding: 0 !important; }
  .report-grid { display: none !important; }
  .preview-actions { display: none !important; }
  .preview-card { border: none !important; }
  .page-title { display: none !important; }
}
</style>