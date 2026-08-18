<script setup lang="ts">
const ui = useUiStore()
interface IzinItem {
  id: string
  studentId: string
  student: string
  nis: string
  class: string
  ekskulId: string
  ekskul: string
  date: string
  dateISO: string
  reason: string
  proofUrl?: string | null
}

const auth = useAuthStore()
const master = useMasterDataStore()
const list = ref<IzinItem[]>([])
const loading = ref(false)
const submitting = ref(false)
const errorMsg = ref('')
const saved = ref(false)
const search = ref('')

// Dialog custom tanggal sebelum unduh surat
const showDownloadModal = ref(false)
const downloading = ref(false)
const dlTarget = ref<IzinItem | null>(null)
const dlDates = reactive({ tglSurat: '', tglIzin: '' })
const dlError = ref('')

function toISODate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function openDownload(item: IzinItem) {
  dlTarget.value = item
  // Default: tanggal surat = hari ini, tanggal kegiatan = tanggal izin pada data
  dlDates.tglSurat = toISODate(new Date())
  dlDates.tglIzin = item.dateISO ? item.dateISO.slice(0, 10) : toISODate(new Date())
  dlError.value = ''
  showDownloadModal.value = true
}

async function confirmDownload() {
  if (!dlTarget.value) return
  if (!dlDates.tglSurat || !dlDates.tglIzin) {
    dlError.value = 'Tanggal surat dan tanggal kegiatan wajib diisi.'
    return
  }
  downloading.value = true
  try {
    const q = new URLSearchParams({ tglSurat: dlDates.tglSurat, tglIzin: dlDates.tglIzin })
    window.open(`/api/siswa/izin/${dlTarget.value.id}/surat?${q.toString()}`, '_blank')
    showDownloadModal.value = false
  } finally {
    downloading.value = false
  }
}

const role = computed(() => auth.user?.role ?? 'student')
const isStudent = computed(() => role.value === 'student')

const form = reactive({ ekskulId: '', date: '', reason: '', proofUrl: '' })
const uploading = ref(false)

// Unduh template surat izin (kosong, siap diisi) — semua role
function downloadTemplate() {
  window.open('/api/siswa/izin/template', '_blank')
}

async function handleSuratUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>('/api/shared/upload', { method: 'POST', body: fd })
    form.proofUrl = res.url
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Gagal upload surat.'
  } finally {
    uploading.value = false
    input.value = ''
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await $fetch<IzinItem[]>('/api/siswa/izin')
    list.value = res
  } catch {
    errorMsg.value = 'Gagal memuat data izin.'
  }
  loading.value = false
  if (isStudent.value) master.fetchReference()
})

const filtered = computed(() => {
  if (!search.value) return list.value
  const q = search.value.toLowerCase()
  return list.value.filter(i =>
    i.student.toLowerCase().includes(q) ||
    i.nis.toLowerCase().includes(q) ||
    i.class.toLowerCase().includes(q) ||
    i.ekskul.toLowerCase().includes(q) ||
    i.reason.toLowerCase().includes(q)
  )
})

const { page, paged, totalPages } = usePagination(() => filtered.value)

async function submitIzin() {
  if (!form.ekskulId || !form.date || !form.reason.trim()) {
    errorMsg.value = 'Ekskul, tanggal, dan alasan izin wajib diisi.'
    return
  }
  submitting.value = true
  errorMsg.value = ''
  try {
    const created = await $fetch<IzinItem>('/api/siswa/izin', { method: 'POST', body: { ...form } })
    list.value.unshift(created)
    saved.value = true
    form.ekskulId = ''; form.date = ''; form.reason = ''; form.proofUrl = ''
    setTimeout(() => (saved.value = false), 1500)
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Gagal mengajukan izin.'
  } finally {
    submitting.value = false
  }
}

function downloadSurat(item: IzinItem) {
  openDownload(item)
}

const steps = computed(() =>
  isStudent.value
    ? [
        { n: 1, t: 'Ajukan izin', d: 'Isi form di samping: pilih ekskul, tanggal, dan alasan izin.' },
        { n: 2, t: 'Unduh surat izin', d: 'Klik tombol "Unduh Surat" pada data izin yang sudah diajukan.' },
        { n: 3, t: 'Cetak surat', d: 'Cetak file .docx yang diunduh (Ctrl+P / Print).' },
        { n: 4, t: 'Tanda tangani', d: 'Minta tanda tangan orang tua/wali pada surat izin.' },
        { n: 5, t: 'Serahkan / lampirkan', d: 'Berikan surat kepada Pembina atau Operator Ekskul sebelum kegiatan dimulai.' },
      ]
    : [
        { n: 1, t: 'Lihat data izin', d: 'Daftar siswa yang mengajukan izin tampil di bawah ini.' },
        { n: 2, t: 'Unduh / cetak', d: 'Klik "Unduh Surat" lalu cetak file .docx untuk lampiran.' },
        { n: 3, t: 'Verifikasi alasan', d: 'Pastikan alasan izin tercatat untuk rekap kehadiran ekskul.' },
        { n: 4, t: 'Arsipkan', d: 'Simpan surat sebagai lampiran administrasi ekskul.' },
      ]
)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="page-title">{{ ui.t('menu.izin') }}</h1>
      <p class="text-[13px]" style="color: var(--text-secondary);">
        {{ isStudent ? 'Ajukan izin tidak mengikuti ekskul dan unduh surat izin untuk diserahkan.' : 'Daftar siswa yang mengajukan izin tidak mengikuti ekskul.' }}
      </p>
    </div>

    <!-- Langkah-langkah -->
    <div class="steps-card">
      <div class="steps-header"><Icon name="i-lucide-list-checks" class="w-4 h-4" /> Cara Penggunaan Surat Izin</div>
      <div class="steps-grid">
        <div v-for="s in steps" :key="s.n" class="step-item">
          <div class="step-num">{{ s.n }}</div>
          <div class="step-text"><span class="step-title">{{ s.t }}</span><span class="step-desc">{{ s.d }}</span></div>
        </div>
      </div>
    </div>

    <!-- Form ajukan izin (siswa) -->
    <div v-if="isStudent" class="form-card">
      <div class="form-card-title"><Icon name="i-lucide-file-plus-2" class="w-4 h-4" style="color: var(--accent);" /> Ajukan Izin</div>
      <form @submit.prevent="submitIzin" class="space-y-3">
        <div class="form-row">
          <div class="form-group">
            <label>Ekskul</label>
            <select v-model="form.ekskulId" class="form-input" required>
              <option disabled value="">Pilih Ekskul</option>
              <option v-for="e in master.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Tanggal Kegiatan</label>
            <input v-model="form.date" type="date" class="form-input" required>
          </div>
        </div>
        <div class="form-group">
          <label>Alasan Izin</label>
          <textarea v-model="form.reason" class="form-input" rows="2" placeholder="Contoh: Sakit, ada acara keluarga, mengikuti lomba..." required></textarea>
        </div>
        <div v-if="errorMsg" class="error-badge">
          <Icon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
          <span>{{ errorMsg }}</span>
        </div>
        <div class="form-group">
          <label>Surat Izin (Digital) <span class="form-optional">— tidak hadir wajib ada surat</span></label>
          <div class="surat-actions">
            <button type="button" class="btn-outline" @click="downloadTemplate">
              <Icon name="i-lucide-file-down" class="w-4 h-4" /> Unduh Template
            </button>
            <label class="btn-outline">
              <Icon v-if="!uploading" name="i-lucide-upload" class="w-4 h-4" />
              <Icon v-else name="i-lucide-loader-2" class="w-4 h-4 spin-icon" />
              {{ uploading ? 'Mengupload...' : form.proofUrl ? 'Ganti Surat' : 'Upload Surat' }}
              <input type="file" accept="image/*" hidden @change="handleSuratUpload">
            </label>
          </div>
          <div v-if="form.proofUrl" class="surat-ok"><Icon name="i-lucide-check-circle-2" class="w-4 h-4" /> Surat terlampir — pembimbing & admin bisa melihatnya.</div>
          <div v-else class="surat-warn"><Icon name="i-lucide-alert-triangle" class="w-4 h-4" /> Belum ada surat — pembimbing akan melihat peringatan pada data ini.</div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="submitting">
            <Icon v-if="saved" name="i-lucide-check" class="w-4 h-4" />
            <Icon v-else name="i-lucide-send" class="w-4 h-4" />
            {{ submitting ? 'Mengirim...' : saved ? 'Izin Terkirim!' : 'Ajukan Izin' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Daftar izin -->
    <div class="table-card">
      <div class="table-toolbar">
        <input v-model="search" type="text" placeholder="Cari nama, NIS, kelas, ekskul, atau alasan..." class="search-input">
        <span class="text-[11px]" style="color: var(--text-muted);">{{ filtered.length }} dari {{ list.length }} surat izin</span>
      </div>
      <div v-if="loading" class="loading-shimmer" style="height: 60px;"></div>
      <table v-else class="data-table">
        <thead><tr><th>Nama</th><th>NIS</th><th>Kelas</th><th>Ekskul</th><th>Tanggal</th><th>Alasan</th><th>Surat</th><th class="text-right">Aksi</th></tr></thead>
        <tbody>
          <tr v-for="i in paged" :key="i.id">
            <td class="font-semibold">{{ i.student }}</td>
            <td><span class="nis-code">{{ i.nis }}</span></td>
            <td>{{ i.class }}</td>
            <td><span class="ekskul-tag">{{ i.ekskul }}</span></td>
            <td>{{ i.date }}</td>
            <td style="color: var(--text-secondary); font-size: var(--text-sm);">{{ i.reason }}</td>
            <td>
              <span v-if="i.proofUrl" class="surat-badge surat-badge-ok" title="Surat digital terlampir"><Icon name="i-lucide-check-circle-2" class="w-3.5 h-3.5" /> Surat</span>
              <span v-else class="surat-badge surat-badge-warn" title="Belum ada surat — wajib dilengkapi"><Icon name="i-lucide-alert-triangle" class="w-3.5 h-3.5" /> Tanpa Surat</span>
            </td>
            <td class="text-right">
              <button class="btn-download" @click="downloadSurat(i)">
                <Icon name="i-lucide-file-down" class="w-4 h-4" /> Unduh Surat
              </button>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="8" class="text-center py-8" style="color: var(--text-muted);">
              {{ isStudent ? 'Belum ada izin yang diajukan. Ajukan izin lewat form di atas.' : 'Belum ada siswa yang mengajukan izin.' }}
            </td>
          </tr>
        </tbody>
      </table>
      <PaginationBar v-model:page="page" :total="filtered.length" />
    </div>

    <!-- Dialog custom tanggal sebelum unduh -->
    <Teleport to="body">
      <div v-if="showDownloadModal" class="modal-overlay" @click.self="showDownloadModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-icon"><Icon name="i-lucide-calendar-clock" class="w-5 h-5" /></div>
            <div>
              <h3 class="modal-title">Atur Tanggal Surat</h3>
              <p class="modal-sub">Sesuaikan tanggal sebelum mengunduh. Default sudah menyesuaikan otomatis.</p>
            </div>
            <button class="modal-close" @click="showDownloadModal = false"><Icon name="i-lucide-x" class="w-4 h-4" /></button>
          </div>
          <div class="modal-body">
            <div v-if="dlTarget" class="dl-summary">
              <div class="dl-summary-item"><span class="dl-label">Siswa</span><span class="dl-value">{{ dlTarget.student }} · {{ dlTarget.class }}</span></div>
              <div class="dl-summary-item"><span class="dl-label">Ekskul</span><span class="dl-value">{{ dlTarget.ekskul }}</span></div>
              <div class="dl-summary-item"><span class="dl-label">Alasan</span><span class="dl-value">{{ dlTarget.reason }}</span></div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Tanggal Surat</label>
                <input v-model="dlDates.tglSurat" type="date" class="form-input" required>
                <span class="dl-hint">Tanggal pembuatan / penandatanganan surat</span>
              </div>
              <div class="form-group">
                <label>Tanggal Kegiatan</label>
                <input v-model="dlDates.tglIzin" type="date" class="form-input" required>
                <span class="dl-hint">Tanggal siswa tidak mengikuti kegiatan ekskul</span>
              </div>
            </div>
            <p v-if="dlError" class="error-text">{{ dlError }}</p>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showDownloadModal = false">Batal</button>
            <button type="button" class="btn-primary" :disabled="downloading" @click="confirmDownload">
              <Icon name="i-lucide-file-down" class="w-4 h-4" />
              {{ downloading ? 'Menyiapkan...' : 'Unduh Surat' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.steps-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.steps-header { display: flex; align-items: center; gap: 8px; background: var(--bg-card); color: var(--text-primary); font-weight: var(--font-semibold); font-size: 13px; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; padding: 16px; }
.step-item { display: flex; gap: 10px; align-items: flex-start; }
.step-num { width: 26px; height: 26px; border-radius: 50%; background: var(--accent-soft, rgba(79,70,229,0.12)); color: var(--accent); font-weight: var(--font-bold); font-size: var(--text-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.step-text { display: flex; flex-direction: column; gap: 2px; }
.step-title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.step-desc { font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.5; }
.form-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 20px; }
.form-card-title { display: flex; align-items: center; gap: 8px; font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); background: white; }
.form-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-border, rgba(79,70,229,0.15)); }
.form-actions { display: flex; justify-content: flex-end; padding-top: 4px; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.error-badge { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; font-size: var(--text-sm); color: #dc2626; }
.table-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-light); gap: 8px; flex-wrap: wrap; }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 280px; color: var(--text-primary); }
.search-input:focus { outline: none; border-color: var(--accent); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.3px; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); vertical-align: middle; }
.nis-code { font-size: var(--text-xs); font-variant-numeric: tabular-nums; letter-spacing: 0.04em; font-weight: var(--font-medium); color: var(--text-secondary); }
.ekskul-tag { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: var(--accent-soft, rgba(79,70,229,0.1)); color: var(--accent); font-weight: var(--font-medium); white-space: nowrap; }
.btn-download { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-soft, rgba(79,70,229,0.1)); color: var(--accent); font-size: var(--text-xs); font-weight: var(--font-semibold); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--accent-border, rgba(79,70,229,0.25)); cursor: pointer; transition: all 0.2s; }
.btn-download:hover { background: var(--accent); color: white; }
.surat-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: white; color: var(--text-primary); font-size: var(--text-xs); font-weight: var(--font-semibold); padding: 8px 14px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { background: var(--bg-hover); border-color: var(--accent); }
.surat-ok { display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: #047857; font-weight: var(--font-medium); margin-top: 8px; }
.surat-warn { display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: #b45309; font-weight: var(--font-medium); margin-top: 8px; }
.surat-badge { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); white-space: nowrap; }
.surat-badge-ok { background: rgba(16,185,129,0.12); color: #047857; }
.surat-badge-warn { background: rgba(245,158,11,0.15); color: #b45309; }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.btn-cancel:hover { background: var(--bg-hover); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(2px); }
.modal-content { background: var(--bg-card); border-radius: 14px; width: 520px; max-width: 92vw; box-shadow: 0 20px 50px rgba(0,0,0,0.25); overflow: hidden; }
.modal-header { display: flex; align-items: flex-start; gap: 12px; padding: 18px 20px; border-bottom: 1px solid var(--border-light); }
.modal-header-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--accent-soft, rgba(79,70,229,0.12)); color: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.modal-sub { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }
.modal-close { margin-left: auto; background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 6px; }
.modal-close:hover { background: var(--bg-hover); color: var(--text-primary); }
.modal-body { padding: 18px 20px; }
.dl-summary { background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px; }
.dl-summary-item { display: flex; gap: 8px; font-size: var(--text-sm); }
.dl-label { color: var(--text-muted); font-weight: var(--font-medium); min-width: 56px; flex-shrink: 0; }
.dl-value { color: var(--text-primary); font-weight: var(--font-semibold); }
.dl-hint { font-size: 11px; color: var(--text-muted); margin-top: 2px; display: block; }
.error-text { font-size: var(--text-sm); color: #dc2626; margin-top: 10px; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; padding: 14px 20px; border-top: 1px solid var(--border-light); }
@media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
</style>
