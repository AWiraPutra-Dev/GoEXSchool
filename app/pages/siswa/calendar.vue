<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const siswa = useSiswaDataStore()
const { confirm } = useConfirm()

const now = new Date()
const viewYear = ref(now.getFullYear())
const viewMonth = ref(now.getMonth()) // 0-11
const events = ref<any[]>([])
const colors = ref({ mandatory: '#2D6A6A', optional: '#D4C089', manual: '#4A9E9E' })
const loading = ref(false)
const MAX_VISIBLE_EVENTS = 3
const selectedDay = ref<string | null>(null)
const showDayModal = ref(false)
const showModal = ref(false)
const editAgenda = ref<any>(null)
const saving = ref(false)
const form = reactive({ title: '', description: '', date: '', timeStart: '', timeEnd: '', color: '#4A9E9E' })

// ---- Modal Kumpulan Surat Izin (dari agenda pertemuan) ----
const showIzinsModal = ref(false)
const izinsList = ref<any[]>([])
const izinsTarget = ref<any>(null)
const izinsLoading = ref(false)
const izinsError = ref('')
const previewSurat = ref<string | null>(null)

async function openIzins(e: any) {
  izinsTarget.value = e
  izinsList.value = []
  izinsError.value = ''
  showIzinsModal.value = true
  izinsLoading.value = true
  try {
    izinsList.value = await $fetch<any[]>('/api/siswa/izin', {
      query: { date: e.date, ekskulId: e.ekskulId },
    })
  } catch (err: any) {
    izinsError.value = err?.data?.message || 'Gagal memuat surat izin.'
  } finally {
    izinsLoading.value = false
  }
}

// ---- Modal Ajukan Izin (dari agenda pertemuan) ----
const showIzinModal = ref(false)
const izinTarget = ref<any>(null)
const izinForm = reactive({ reason: '', proofUrl: '', scheduleId: '' })
const izinSaving = ref(false)
const izinSaved = ref(false)
const izinError = ref('')
const izinUploading = ref(false)

function openIzin(e: any) {
  izinTarget.value = e
  izinForm.reason = ''
  izinForm.proofUrl = ''
  izinForm.scheduleId = e.scheduleId || ''
  izinError.value = ''
  izinSaved.value = false
  showIzinModal.value = true
}

async function izinUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  izinUploading.value = true
  izinError.value = ''
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>('/api/shared/upload', { method: 'POST', body: fd })
    izinForm.proofUrl = res.url
  } catch (e: any) {
    izinError.value = e?.data?.message || 'Gagal upload surat.'
  } finally {
    izinUploading.value = false
    input.value = ''
  }
}

async function submitIzin() {
  if (!izinTarget.value || !izinForm.reason.trim()) {
    izinError.value = 'Alasan izin wajib diisi.'
    return
  }
  izinSaving.value = true
  izinError.value = ''
  try {
    await $fetch('/api/siswa/izin', {
      method: 'POST',
      body: {
        extracurricularId: izinTarget.value.ekskulId,
        date: izinTarget.value.date,
        reason: izinForm.reason,
        scheduleId: izinForm.scheduleId || undefined,
        proofUrl: izinForm.proofUrl || undefined,
      },
    })
    izinSaved.value = true
    setTimeout(() => {
      showIzinModal.value = false
      load()
    }, 900)
  } catch (e: any) {
    izinError.value = e?.data?.message || 'Gagal mengajukan izin.'
  } finally {
    izinSaving.value = false
  }
}

function downloadTemplate() {
  window.open('/api/siswa/izin/template', '_blank')
}

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const monthLabel = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
)

const dayTitle = computed(() =>
  selectedDay.value ? selectedDay.value.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''
)
const dayEvents = computed(() => (selectedDay.value ? eventsFor(selectedDay.value) : []))

// Struktur grid kalender: array minggu, tiap minggu 7 sel
const weeks = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const startDay = first.getDay() // 0 = Minggu
  const cells: (Date | null)[] = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear.value, viewMonth.value, d))
  while (cells.length % 7 !== 0) cells.push(null)
  const result: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7))
  return result
})

function dateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function eventsFor(d: Date) {
  const ds = dateStr(d)
  return events.value.filter(e => e.date === ds).sort((a, b) => a.timeStart.localeCompare(b.timeStart))
}

function visibleEvents(d: Date) {
  return eventsFor(d).slice(0, MAX_VISIBLE_EVENTS)
}

function hiddenCount(d: Date) {
  return Math.max(0, eventsFor(d).length - MAX_VISIBLE_EVENTS)
}

function openDay(d: Date) {
  selectedDay.value = d
  showDayModal.value = true
}

function isToday(d: Date) {
  const t = new Date()
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()
}

async function load() {
  loading.value = true
  try {
    const res = await siswa.fetchCalendar(`${viewYear.value}-${String(viewMonth.value + 1).padStart(2, '0')}`)
    events.value = res.events || []
    colors.value = res.colors || colors.value
  } catch {} finally {
    loading.value = false
  }
}

function changeMonth(delta: number) {
  let m = viewMonth.value + delta
  let y = viewYear.value
  if (m < 0) { m = 11; y-- } else if (m > 11) { m = 0; y++ }
  viewMonth.value = m
  viewYear.value = y
  load()
}

function openAdd(d?: Date) {
  editAgenda.value = null
  form.title = ''
  form.description = ''
  form.date = d ? dateStr(d) : dateStr(new Date())
  form.timeStart = '15:00'
  form.timeEnd = '17:00'
  form.color = '#4A9E9E'
  showModal.value = true
}

function openEdit(e: any) {
  if (e.source !== 'manual') return // agenda otomatis tidak bisa diedit
  editAgenda.value = e
  form.title = e.title
  form.description = e.description || ''
  form.date = e.date
  form.timeStart = e.timeStart
  form.timeEnd = e.timeEnd
  form.color = e.color || '#4A9E9E'
  showModal.value = true
}

// Klik event: agenda manual → edit; pertemuan ekskul → ajukan izin
function onEventClick(e: any) {
  if (e.source === 'manual') { openEdit(e); return }
  if (e.source === 'schedule') { openIzin(e); return }
}

async function save() {
  if (!form.title || !form.date || !form.timeStart) return
  saving.value = true
  try {
    if (editAgenda.value) {
      await siswa.updateAgenda(editAgenda.value.id, { ...form })
    } else {
      await siswa.addAgenda({ ...form })
    }
    showModal.value = false
    load()
  } catch {} finally {
    saving.value = false
  }
}

async function removeAgenda(e: any) {
  if (e.source !== 'manual') return
  const ok = await confirm({
    title: `Hapus agenda "${e.title}"?`,
    message: 'Agenda manual ini akan dihapus permanen dari kalender Anda.',
    confirmText: 'Ya, Hapus',
    danger: true,
  })
  if (!ok) return
  try {
    await siswa.deleteAgenda(e.id)
    load()
  } catch {}
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">{{ ui.t('menu.calendar') }}</h1>
      <button class="btn-primary" @click="openAdd()"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tambah Agenda</button>
    </div>

    <!-- Legenda warna -->
    <div class="legend-bar">
      <div class="legend-item"><span class="legend-dot" :style="{ background: colors.mandatory }"></span> Jadwal Wajib (operator)</div>
      <div class="legend-item"><span class="legend-dot" :style="{ background: colors.optional }"></span> Jadwal Tidak Wajib</div>
      <div class="legend-item"><span class="legend-dot" :style="{ background: colors.manual }"></span> Agenda Manual Saya</div>
    </div>

    <!-- Navigasi bulan -->
    <div class="cal-nav">
      <button class="cal-nav-btn" @click="changeMonth(-1)"><Icon name="i-lucide-chevron-left" class="w-4 h-4" /></button>
      <span class="cal-month-label">{{ monthLabel }}</span>
      <button class="cal-nav-btn" @click="changeMonth(1)"><Icon name="i-lucide-chevron-right" class="w-4 h-4" /></button>
      <button class="cal-today-btn" @click="() => { viewYear = new Date().getFullYear(); viewMonth = new Date().getMonth(); load() }">Hari Ini</button>
    </div>

    <!-- Grid kalender -->
    <div class="cal-grid">
      <div v-for="d in dayNames" :key="d" class="cal-day-head">{{ d }}</div>
      <template v-for="(week, wi) in weeks" :key="wi">
        <div v-for="(d, di) in week" :key="di" class="cal-cell" :class="{ 'cal-cell-today': d && isToday(d), 'cal-cell-empty': !d }">
          <template v-if="d">
            <div class="cal-cell-top">
              <span class="cal-date-num">{{ d.getDate() }}</span>
              <button class="cal-add-mini" title="Tambah agenda" @click="openAdd(d)"><Icon name="i-lucide-plus" class="w-3 h-3" /></button>
            </div>
            <div class="cal-events">
              <div
                v-for="e in visibleEvents(d)"
                :key="e.id"
                class="cal-event"
                :class="{ 'cal-event-manual': e.source === 'manual', 'cal-event-izin': e.izin, 'cal-event-schedule': e.source === 'schedule' }"
                :style="{ '--ev-color': e.color }"
                :title="`${e.timeStart}${e.timeEnd ? ' - ' + e.timeEnd : ''} · ${e.title}${e.description ? ': ' + e.description : ''}${e.izin ? ' · Sudah izin: ' + e.izin.reason : e.source === 'schedule' ? ' · Klik untuk ajukan izin' : ''}`"
                @click="onEventClick(e)"
              >
                <span v-if="e.izin" class="cal-event-izin-icon" title="Sudah izin"><Icon name="i-lucide-file-check-2" class="w-3 h-3" /></span>
                <span class="cal-event-time">{{ e.timeStart }}</span>
                <span class="cal-event-title">{{ e.title }}</span>
                <button
                  v-if="e.source === 'schedule'"
                  class="cal-event-surat"
                  title="Lihat kumpulan surat izin"
                  @click.stop="openIzins(e)"
                >
                  <Icon name="i-lucide-file-text" class="w-3 h-3" />
                </button>
              </div>
              <button v-if="hiddenCount(d) > 0" class="cal-more" title="Lihat semua agenda hari ini" @click="openDay(d)">
                +{{ hiddenCount(d) }} lainnya
              </button>
            </div>
          </template>
        </div>
      </template>
    </div>

    <!-- Modal detail agenda harian -->
    <Teleport to="body">
      <div v-if="showDayModal && selectedDay" class="modal-overlay" @click.self="showDayModal = false">
        <div class="modal-content day-modal">
          <div class="day-modal-head">
            <div class="day-modal-icon"><Icon name="i-lucide-calendar-days" class="w-5 h-5" /></div>
            <h3 class="day-modal-title">{{ dayTitle }}</h3>
            <button class="modal-close" @click="showDayModal = false"><Icon name="i-lucide-x" class="w-4 h-4" /></button>
          </div>
          <div class="day-events-list">
            <div
              v-for="e in dayEvents"
              :key="e.id"
              class="day-event-row"
              :class="{ 'cal-event-izin': e.izin }"
              :style="{ '--ev-color': e.color }"
              @click="onEventClick(e)"
            >
              <span class="day-event-dot" :style="{ background: e.izin ? '#D46A5A' : e.color }"></span>
              <div class="day-event-main">
                <p class="day-event-title">{{ e.title }}</p>
                <p class="day-event-meta">
                  <span><Icon name="i-lucide-clock" class="w-3 h-3" /> {{ e.timeStart }}{{ e.timeEnd ? ' – ' + e.timeEnd : '' }}</span>
                  <span v-if="e.description">{{ e.description }}</span>
                  <span v-if="e.izin" class="day-event-izin"><Icon name="i-lucide-file-check-2" class="w-3 h-3" /> Sudah izin: {{ e.izin.reason }}</span>
                </p>
              </div>
              <span v-if="e.source === 'manual'" class="day-event-tag">Manual</span>
              <span v-else class="day-event-tag">Jadwal</span>
            </div>
            <div v-if="!dayEvents.length" class="day-events-empty">
              <Icon name="i-lucide-calendar-x-2" class="w-8 h-8" />
              <p>Tidak ada agenda pada hari ini.</p>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showDayModal = false">Tutup</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal tambah/edit agenda -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h3 class="modal-title">{{ editAgenda ? 'Edit Agenda' : 'Tambah Agenda Manual' }}</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div class="form-group"><label>Judul</label><input v-model="form.title" class="form-input" required placeholder="Contoh: Rapat ekskul, latihan mandiri..."></div>
            <div class="form-group"><label>Deskripsi</label><input v-model="form.description" class="form-input" placeholder="Opsional"></div>
            <div class="form-row">
              <div class="form-group"><label>Tanggal</label><input v-model="form.date" type="date" class="form-input" required></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Jam Mulai</label><input v-model="form.timeStart" type="time" class="form-input" required></div>
              <div class="form-group"><label>Jam Selesai</label><input v-model="form.timeEnd" type="time" class="form-input"></div>
            </div>
            <div class="form-group">
              <label>Warna</label>
              <div class="color-picker">
                <button v-for="c in ['#4A9E9E', '#2D6A6A', '#8B9467', '#D4C089', '#D4956A', '#D46A5A', '#7BA87B', '#5B8DEF']" :key="c" type="button" class="color-swatch" :class="{ active: form.color === c }" :style="{ background: c }" @click="form.color = c"></button>
              </div>
            </div>
            <div v-if="editAgenda" class="modal-actions">
              <button type="button" class="btn-delete" @click="removeAgenda(editAgenda)">Hapus</button>
              <div style="flex:1"></div>
              <button type="button" class="btn-cancel" @click="showModal = false">Batal</button>
              <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
            </div>
            <div v-else class="modal-actions">
              <button type="button" class="btn-cancel" @click="showModal = false">Batal</button>
              <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Tambah' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Kumpulan Surat Izin (semua siswa + kelas + preview surat) -->
    <Teleport to="body">
      <div v-if="showIzinsModal && izinsTarget" class="modal-overlay" @click.self="showIzinsModal = false">
        <div class="modal-content izin-modal">
          <div class="izin-modal-header">
            <div class="izin-modal-icon"><Icon name="i-lucide-folder-open" class="w-5 h-5" /></div>
            <div>
              <h3 class="modal-title">Kumpulan Surat Izin</h3>
              <p class="izin-modal-sub">Siswa yang mengajukan izin pada pertemuan ini, klik surat untuk melihat tanpa unduh.</p>
            </div>
            <button class="modal-close" @click="showIzinsModal = false"><Icon name="i-lucide-x" class="w-4 h-4" /></button>
          </div>

          <div class="izin-meeting-info">
            <img v-if="izinsTarget.ekskulLogo" :src="izinsTarget.ekskulLogo" class="izin-ekskul-logo" alt="" />
            <div class="flex-1 min-w-0">
              <p class="izin-ekskul-name">{{ izinsTarget.title }}</p>
              <p class="izin-ekskul-meta">
                <span><Icon name="i-lucide-calendar" class="w-3.5 h-3.5" /> {{ izinsTarget.date }}</span>
                <span><Icon name="i-lucide-clock" class="w-3.5 h-3.5" /> {{ izinsTarget.timeStart }}{{ izinsTarget.timeEnd ? ' – ' + izinsTarget.timeEnd : '' }}</span>
              </p>
            </div>
            <span v-if="izinsTarget.mandatory" class="izin-mandatory-badge">Wajib Hadir</span>
          </div>

          <div v-if="izinsLoading" class="izins-loading"><div class="loading-shimmer" style="width:100%;height:80px;border-radius:6px;"></div></div>

          <p v-else-if="izinsError" class="error-badge"><Icon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" /><span>{{ izinsError }}</span></p>

          <div v-else-if="izinsList.length" class="izins-list">
            <div v-for="z in izinsList" :key="z.id" class="izins-row">
              <div class="izins-avatar">{{ (z.student || '?')[0] }}</div>
              <div class="izins-info">
                <div class="izins-name">{{ z.student }}</div>
                <div class="izins-meta"><span class="izins-class"><Icon name="i-lucide-school" class="w-3 h-3" /> {{ z.class }}</span><span class="izins-reason">{{ z.reason }}</span></div>
              </div>
              <button v-if="z.proofUrl" class="izins-view-btn" @click="previewSurat = z.proofUrl">
                <Icon name="i-lucide-eye" class="w-4 h-4" /> Lihat Surat
              </button>
              <span v-else class="izins-no-surat"><Icon name="i-lucide-alert-triangle" class="w-3.5 h-3.5" /> Tanpa Surat</span>
            </div>
          </div>

          <div v-else class="izins-empty">
            <Icon name="i-lucide-file-x-2" class="w-8 h-8" />
            <p>Belum ada siswa yang mengajukan izin pada pertemuan ini.</p>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Preview surat izin (tanpa unduh) -->
    <Teleport to="body">
      <div v-if="previewSurat" class="modal-overlay" @click.self="previewSurat = null">
        <div class="modal-content surat-preview-modal">
          <div class="surat-preview-head">
            <span class="surat-preview-title"><Icon name="i-lucide-file-check-2" class="w-4 h-4" /> Surat Izin</span>
            <button class="modal-close" @click="previewSurat = null"><Icon name="i-lucide-x" class="w-4 h-4" /></button>
          </div>
          <img :src="previewSurat" class="surat-preview-img" alt="Surat izin" />
        </div>
      </div>
    </Teleport>

    <!-- Modal Ajukan Izin dari agenda pertemuan -->
    <Teleport to="body">
      <div v-if="showIzinModal && izinTarget" class="modal-overlay" @click.self="showIzinModal = false">
        <div class="modal-content izin-modal">
          <div class="izin-modal-header">
            <div class="izin-modal-icon"><Icon name="i-lucide-file-text" class="w-5 h-5" /></div>
            <div>
              <h3 class="modal-title">Ajukan Izin Pertemuan</h3>
              <p class="izin-modal-sub">Surat izin ini otomatis terkirim ke pembimbing, semua anggota ekskul, dan admin.</p>
            </div>
            <button class="modal-close" @click="showIzinModal = false"><Icon name="i-lucide-x" class="w-4 h-4" /></button>
          </div>

          <div class="izin-meeting-info">
            <img v-if="izinTarget.ekskulLogo" :src="izinTarget.ekskulLogo" class="izin-ekskul-logo" alt="" />
            <div class="flex-1 min-w-0">
              <p class="izin-ekskul-name">{{ izinTarget.title }}</p>
              <p class="izin-ekskul-meta">
                <span><Icon name="i-lucide-calendar" class="w-3.5 h-3.5" /> {{ izinTarget.date }}</span>
                <span><Icon name="i-lucide-clock" class="w-3.5 h-3.5" /> {{ izinTarget.timeStart }}{{ izinTarget.timeEnd ? ' – ' + izinTarget.timeEnd : '' }}</span>
                <span><Icon name="i-lucide-map-pin" class="w-3.5 h-3.5" /> {{ izinTarget.location }}</span>
              </p>
              <p v-if="izinTarget.coach" class="izin-ekskul-meta"><span><Icon name="i-lucide-user-check" class="w-3.5 h-3.5" /> {{ izinTarget.coach }}</span></p>
            </div>
            <span v-if="izinTarget.mandatory" class="izin-mandatory-badge">Wajib Hadir</span>
          </div>

          <form @submit.prevent="submitIzin" class="space-y-3">
            <div class="form-group">
              <label>Alasan Izin</label>
              <textarea v-model="izinForm.reason" class="form-input" rows="3" placeholder="Contoh: Sakit, ada acara keluarga, mengikuti lomba..." required></textarea>
            </div>

            <div class="izin-surat-box">
              <p class="izin-surat-title">
                <Icon name="i-lucide-paperclip" class="w-4 h-4" /> Surat Izin (Digital)
              </p>
              <p class="izin-surat-hint">Tidak hadir wajib ada surat izin. Unduh template, isi &amp; tanda tangani orang tua, lalu unggah hasilnya di sini.</p>
              <div class="izin-surat-actions">
                <button type="button" class="btn-outline" @click="downloadTemplate">
                  <Icon name="i-lucide-file-down" class="w-4 h-4" /> Unduh Template .docx
                </button>
                <label class="btn-outline izin-upload-btn">
                  <Icon v-if="!izinUploading" name="i-lucide-upload" class="w-4 h-4" />
                  <Icon v-else name="i-lucide-loader-2" class="w-4 h-4 spin-icon" />
                  {{ izinUploading ? 'Mengupload...' : izinForm.proofUrl ? 'Ganti Surat' : 'Upload Surat' }}
                  <input type="file" accept="image/*" hidden @change="izinUpload">
                </label>
              </div>
              <div v-if="izinForm.proofUrl" class="izin-surat-ok">
                <Icon name="i-lucide-check-circle-2" class="w-4 h-4" /> Surat terlampir, tampil di daftar izin pembimbing.
              </div>
              <div v-else class="izin-surat-warn">
                <Icon name="i-lucide-alert-triangle" class="w-4 h-4" /> Belum ada surat, pembimbing akan melihat status ini sebagai peringatan.
              </div>
            </div>

            <p v-if="izinError" class="error-badge"><Icon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" /><span>{{ izinError }}</span></p>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showIzinModal = false">Batal</button>
              <button type="submit" class="btn-primary" :disabled="izinSaving">
                <Icon v-if="izinSaved" name="i-lucide-check" class="w-4 h-4" />
                <Icon v-else name="i-lucide-send" class="w-4 h-4" />
                {{ izinSaving ? 'Mengirim...' : izinSaved ? 'Izin Terkirim!' : 'Ajukan Izin' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.btn-delete { background: white; color: var(--red-orange); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--red-orange); cursor: pointer; }
.btn-delete:hover { background: var(--red-orange); color: white; }

.legend-bar { display: flex; flex-wrap: wrap; gap: 18px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 10px 16px; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: var(--text-xs); color: var(--text-secondary); }
.legend-dot { width: 12px; height: 12px; border-radius: 3px; }

.cal-nav { display: flex; align-items: center; gap: 8px; }
.cal-nav-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border-light); background: var(--bg-card); color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cal-nav-btn:hover { background: var(--olive-bg); color: var(--olive-primary); }
.cal-month-label { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); min-width: 180px; text-align: center; }
.cal-today-btn { border: 1px solid var(--border-light); background: var(--bg-card); color: var(--text-secondary); font-size: var(--text-xs); padding: 6px 14px; border-radius: 6px; cursor: pointer; margin-left: auto; }
.cal-today-btn:hover { background: var(--olive-bg); color: var(--olive-primary); }

.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.cal-day-head { font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--text-secondary); text-align: center; text-transform: uppercase; padding: 6px 0; }
.cal-cell { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; min-height: 110px; padding: 6px; transition: border-color 0.2s; display: flex; flex-direction: column; overflow: hidden; }
.cal-cell-empty { background: transparent; border-color: transparent; }
.cal-cell-today { border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.cal-cell-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.cal-date-num { font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text-primary); }
.cal-cell-today .cal-date-num { color: var(--olive-primary); }
.cal-add-mini { width: 20px; height: 20px; border-radius: 4px; border: none; background: var(--bg-hover); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; opacity: 0; transition: all 0.2s; }
.cal-cell:hover .cal-add-mini { opacity: 1; }
.cal-add-mini:hover { background: var(--olive-primary); color: white; }
.cal-events { display: flex; flex-direction: column; gap: 3px; flex: 1; overflow: hidden; min-height: 0; }
.cal-more { display: inline-flex; align-items: center; justify-content: center; width: 100%; font-size: 12px; font-weight: var(--font-semibold); color: var(--text-secondary); background: var(--bg-hover); border: 1px solid var(--border-light); border-radius: 4px; padding: 2px 6px; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
.cal-more:hover { color: var(--olive-primary); border-color: var(--olive-primary); background: var(--olive-bg); }
.cal-event {
  display: flex; align-items: center; gap: 4px;
  background: color-mix(in srgb, var(--ev-color) 18%, white);
  color: var(--ev-color);
  border-left: 3px solid var(--ev-color);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 11px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.15s;
}
.cal-event:hover { background: color-mix(in srgb, var(--ev-color) 30%, white); }
.cal-event-manual { font-weight: var(--font-semibold); }
.cal-event-schedule { cursor: pointer; }
.cal-event-schedule:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
.cal-event-izin { background: color-mix(in srgb, #D46A5A 16%, white) !important; color: #B3503F !important; border-left-color: #D46A5A !important; }
.cal-event-izin-icon { display: inline-flex; flex-shrink: 0; color: #B3503F; }
.cal-event-edit-hint { width: 12px; height: 12px; margin-left: auto; flex-shrink: 0; opacity: 0; transition: opacity 0.15s; color: var(--text-muted); }
.cal-event:hover .cal-event-edit-hint { opacity: 0.8; }
.cal-event-surat {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; margin-left: auto; flex-shrink: 0;
  border: none; border-radius: 4px; cursor: pointer;
  background: transparent; color: var(--text-muted);
  opacity: 0; transition: all 0.15s;
}
.cal-event:hover .cal-event-surat { opacity: 0.9; }
.cal-event-surat:hover { background: var(--accent); color: white; opacity: 1; }
.cal-event-izin .cal-event-surat { opacity: 0.9; color: #B3503F; }

/* ===== Modal Kumpulan Surat Izin ===== */
.izins-loading { padding: 12px 20px; }
.izins-list { display: flex; flex-direction: column; padding: 8px 20px 16px; gap: 8px; max-height: 320px; overflow-y: auto; }
.izins-row { display: flex; align-items: center; gap: 12px; background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 10px; padding: 10px 12px; }
.izins-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--accent-soft, rgba(79,70,229,0.12)); color: var(--accent); font-weight: var(--font-bold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.izins-info { flex: 1; min-width: 0; }
.izins-name { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.izins-meta { display: flex; align-items: center; gap: 10px; margin-top: 3px; flex-wrap: wrap; }
.izins-class { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-secondary); }
.izins-reason { font-size: 11px; color: var(--text-muted); }
.izins-view-btn { display: inline-flex; align-items: center; gap: 5px; font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--accent); background: var(--accent-soft, rgba(79,70,229,0.1)); border: 1px solid var(--accent-border, rgba(79,70,229,0.25)); border-radius: 6px; padding: 6px 12px; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
.izins-view-btn:hover { background: var(--accent); color: white; }
.izins-no-surat { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-xs); font-weight: var(--font-medium); color: #b45309; flex-shrink: 0; }
.izins-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px; color: var(--text-muted); font-size: var(--text-sm); }

/* ===== Preview surat ===== */
.surat-preview-modal { width: min(720px, 94vw); }
.surat-preview-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border-light); }
.surat-preview-title { display: inline-flex; align-items: center; gap: 8px; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.surat-preview-img { width: 100%; max-height: 78vh; object-fit: contain; display: block; }
.cal-event-time { font-variant-numeric: tabular-nums; font-size: 11px; font-weight: var(--font-medium); color: var(--text-secondary); flex-shrink: 0; }
.cal-event-title { overflow: hidden; text-overflow: ellipsis; }

/* ===== Modal Ajukan Izin ===== */
.izin-modal { width: 560px; }
.izin-modal-header { display: flex; align-items: flex-start; gap: 12px; padding: 18px 20px; border-bottom: 1px solid var(--border-light); }
.izin-modal-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--accent-soft, rgba(79,70,229,0.12)); color: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.izin-modal-sub { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }
.izin-meeting-info { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: var(--bg-main); border-bottom: 1px solid var(--border-light); }
.izin-ekskul-logo { width: 42px; height: 42px; border-radius: 10px; object-fit: contain; background: white; border: 1px solid var(--border-light); padding: 4px; flex-shrink: 0; }
.izin-ekskul-name { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); }
.izin-ekskul-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; color: var(--text-secondary); margin-top: 3px; }
.izin-ekskul-meta span { display: inline-flex; align-items: center; gap: 4px; }
.izin-mandatory-badge { font-size: 12px; padding: 3px 10px; border-radius: 4px; background: rgba(45,106,106,0.15); color: #2D6A6A; font-weight: var(--font-semibold); white-space: nowrap; flex-shrink: 0; }
.izin-surat-box { border: 1px dashed var(--border-medium); border-radius: 10px; padding: 14px; background: var(--bg-main); }
.izin-surat-title { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.izin-surat-hint { font-size: 11px; color: var(--text-muted); margin: 4px 0 10px; line-height: 1.5; }
.izin-surat-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: white; color: var(--text-primary); font-size: var(--text-xs); font-weight: var(--font-semibold); padding: 8px 14px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { background: var(--bg-hover); border-color: var(--accent); }
.izin-upload-btn { cursor: pointer; }
.izin-surat-ok { display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: #047857; font-weight: var(--font-medium); margin-top: 10px; }
.izin-surat-warn { display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: #b45309; font-weight: var(--font-medium); margin-top: 10px; }
.error-badge { display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; font-size: var(--text-xs); color: #dc2626; }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.modal-close { margin-left: auto; background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 6px; }
.modal-close:hover { background: var(--bg-hover); color: var(--text-primary); }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(2px); }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 480px; max-width: 90vw; max-height: 92vh; overflow-y: auto; }
.izin-modal .form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.izin-modal .form-input:focus { outline: none; border-color: var(--accent); }
.izin-modal .form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.izin-modal .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.color-picker { display: flex; gap: 8px; flex-wrap: wrap; }
.color-swatch { width: 28px; height: 28px; border-radius: 6px; border: 2px solid transparent; cursor: pointer; transition: all 0.15s; }
.color-swatch.active { border-color: var(--text-primary); transform: scale(1.1); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }

/* ===== Modal detail agenda harian ===== */
.day-modal { width: 520px; }
.day-modal-head { display: flex; align-items: center; gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border-light); }
.day-modal-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--olive-bg); color: var(--olive-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.day-modal-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin: 0; }
.day-events-list { display: flex; flex-direction: column; gap: 8px; padding: 14px 20px; max-height: 60vh; overflow-y: auto; }
.day-event-row { display: flex; align-items: center; gap: 12px; background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 10px; padding: 10px 12px; cursor: pointer; transition: all 0.15s; }
.day-event-row:hover { border-color: var(--olive-primary); background: var(--olive-bg); }
.day-event-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.day-event-main { flex: 1; min-width: 0; }
.day-event-title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.day-event-meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: 11px; color: var(--text-secondary); margin-top: 3px; }
.day-event-meta span { display: inline-flex; align-items: center; gap: 4px; }
.day-event-izin { color: #B3503F; }
.day-event-tag { font-size: 12px; font-weight: var(--font-semibold); color: var(--text-muted); background: var(--bg-hover); border: 1px solid var(--border-light); border-radius: 4px; padding: 2px 8px; white-space: nowrap; flex-shrink: 0; }
.day-events-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 28px; color: var(--text-muted); font-size: var(--text-sm); }
</style>
