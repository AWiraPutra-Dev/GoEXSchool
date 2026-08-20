<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const siswa = useSiswaDataStore()
const ui = useUiStore()
const route = useRoute()
onMounted(() => {
  siswa.fetchAll(); loadMeetings(); loadIzins()
  // Token dari QR (deep link) — terisi otomatis saat siswa scan QR kamera HP.
  const t = route.query.token
  if (typeof t === 'string' && t) {
    qrToken.value = t
    tokenFromQr.value = true
  }
})
const showCamScanner = ref(false)

// Navigasi bulan riwayat absensi — kalender di atas, pengguna bebas melihat
// bulan-bulan berikutnya (termasuk yang akan datang).
const now = new Date()
const viewYear = ref(now.getFullYear())
const viewMonth = ref(now.getMonth()) // 0-11
const monthKey = computed(() => `${viewYear.value}-${String(viewMonth.value + 1).padStart(2, '0')}`)
const monthLabel = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
)
const filteredAttendance = computed(() =>
  siswa.attendance.filter(a => !a.monthKey || a.monthKey === monthKey.value)
)
function changeMonth(delta: number) {
  let m = viewMonth.value + delta
  let y = viewYear.value
  if (m < 0) { m = 11; y-- } else if (m > 11) { m = 0; y++ }
  viewMonth.value = m
  viewYear.value = y
}
function goToday() {
  viewYear.value = new Date().getFullYear()
  viewMonth.value = new Date().getMonth()
}

const { page, paged, totalPages } = usePagination(() => filteredAttendance.value)

const stats = computed(() => {
  const total = siswa.attendance.length
  const hadir = siswa.attendance.filter(a => a.status === 'Hadir').length
  const izin = siswa.attendance.filter(a => a.status === 'Izin').length
  const alpha = siswa.attendance.filter(a => a.status === 'Alpha').length
  const rate = total ? Math.round((hadir / total) * 100) : 0
  return { total, hadir, izin, alpha, rate }
})

// ---- Jadwal pertemuan hari ini (panel kiri) ----
interface TodayMeeting {
  id: string; ekskul: string; ekskulLogo?: string | null; timeStart: string; timeEnd: string; time: string
  location: string; coach: string; mandatory: boolean; open: boolean; ended: boolean
  latitude?: number | null; longitude?: number | null; radius?: number | null
}
const todayMeetings = ref<TodayMeeting[]>([])
const selectedMeetingId = ref<string | null>(null)
const nowTime = ref('')
const meetingsLoading = ref(true)
const anyOpen = computed(() => todayMeetings.value.some(m => m.open))

// Pertemuan yang sedang dipilih (untuk map + scan). Default: pertemuan yang bisa absen pertama.
const selectedMeeting = computed(() => todayMeetings.value.find(m => m.id === selectedMeetingId.value) ?? null)

async function loadMeetings() {
  meetingsLoading.value = true
  try {
    const res = await $fetch<{ meetings: TodayMeeting[]; now: string }>('/api/siswa/attendance/meetings')
    todayMeetings.value = res.meetings
    nowTime.value = res.now
    // Pilih pertemuan pertama yang bisa absen; jika tidak ada, pertemuan pertama.
    const openFirst = res.meetings.find(m => m.open) ?? res.meetings[0] ?? null
    if (openFirst && selectedMeetingId.value !== openFirst.id) selectedMeetingId.value = openFirst.id
  } catch {} finally {
    meetingsLoading.value = false
  }
}

function selectMeeting(id: string) { selectedMeetingId.value = id }

const qrToken = ref('')
const tokenFromQr = ref(false)
const attMapRef = ref<any>(null)
const myLocation = ref<{ latitude: number; longitude: number; distance: number; inside: boolean } | null>(null)
const scanBlocked = ref(false)

// Status proses absensi — ditampilkan sebagai banner (seperti aplikasi absensi).
const scanState = ref<'idle' | 'locating' | 'scanning' | 'success' | 'error'>('idle')
const scanMsg = ref('')

// Tunggu posisi lokasi siap (maks ~8 detik) dengan polling ringan.
function waitForLocation(timeoutMs = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    const start = Date.now()
    const check = () => {
      if (myLocation.value) { resolve(true); return }
      if (Date.now() - start > timeoutMs) { resolve(false); return }
      attMapRef.value?.locate()
      setTimeout(check, 500)
    }
    attMapRef.value?.locate()
    setTimeout(check, 400)
  })
}

async function scanQr() {
  if (!qrToken.value.trim()) { alert('Masukkan token QR dari operator.'); return }
  scanState.value = 'locating'
  scanMsg.value = 'Mendeteksi lokasi kamu...'
  const located = await waitForLocation()
  if (!located) {
    scanState.value = 'error'
    scanMsg.value = 'Lokasi belum terdeteksi. Aktifkan GPS / gunakan "Atur Lokasi Manual" di peta, lalu coba lagi.'
    return
  }
  if (!myLocation.value!.inside) {
    scanState.value = 'error'
    scanMsg.value = `Kamu berada di luar area absensi (jarak ${myLocation.value!.distance} m). Mendekatlah ke area lalu coba lagi.`
    return
  }
  scanState.value = 'scanning'
  scanMsg.value = 'Mencatat kehadiran...'
  try {
    const res = await $fetch('/api/siswa/attendance/scan', {
      method: 'POST',
      body: { token: qrToken.value.trim(), latitude: myLocation.value!.latitude, longitude: myLocation.value!.longitude },
    })
    siswa.attendance.unshift({ ...(res as any), notes: (res as any).notes || '' })
    qrToken.value = ''
    tokenFromQr.value = false
    scanState.value = 'success'
    scanMsg.value = `Kehadiran tercatat! ${(res as any).ekskul} · ${(res as any).time}`
    setTimeout(() => { scanState.value = 'idle'; scanMsg.value = '' }, 5000)
  } catch (e: any) {
    scanState.value = 'error'
    scanMsg.value = e?.data?.message || 'Gagal scan QR.'
  }
}

function onMapLocation(v: { latitude: number; longitude: number; distance: number; inside: boolean } | null) {
  myLocation.value = v
  scanBlocked.value = !v || !v.inside
}

// ---- Hasil scan kamera: token terisi lalu absen otomatis ----
async function onCameraScan(value: string) {
  showCamScanner.value = false
  qrToken.value = value.trim()
  tokenFromQr.value = true
  if (qrToken.value) await scanQr()
}

// ---- Kumpulan surat izin saya ----
interface IzinItem {
  id: string; studentId: string; student: string; nis: string; class: string
  ekskulId: string; ekskul: string; date: string; dateISO: string; reason: string; proofUrl?: string | null
}
const izins = ref<IzinItem[]>([])
const izinsLoading = ref(false)
const previewSurat = ref<string | null>(null)

async function loadIzins() {
  izinsLoading.value = true
  try {
    izins.value = await $fetch<IzinItem[]>('/api/siswa/izin?mine=1')
  } catch {
    izins.value = []
  } finally {
    izinsLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">{{ ui.t('menu.myAttendance') }}</h1>
      <button class="btn-refresh" title="Perbarui jadwal hari ini" @click="loadMeetings">
        <Icon name="i-lucide-refresh-cw" class="w-4 h-4" />
      </button>
    </div>

    <div class="attendance-layout">
      <!-- Kiri: jadwal pertemuan hari ini -->
      <section class="panel-card">
        <div class="panel-header">
          <Icon name="i-lucide-calendar-days" class="w-4 h-4" style="color: var(--olive-primary);" />
          <span>Jadwal Pertemuan Hari Ini</span>
          <span v-if="nowTime" class="panel-time">{{ nowTime }}</span>
        </div>
        <div v-if="meetingsLoading" class="panel-empty"><div class="loading-shimmer" style="width:100%;height:80px;border-radius:6px;"></div></div>
        <ul v-else class="panel-list">
          <li v-for="m in todayMeetings" :key="m.id" class="panel-list-item" :class="{ 'meeting-open': m.open, 'meeting-ended': m.ended && !m.open, 'meeting-selected': selectedMeetingId === m.id }" @click="selectMeeting(m.id)">
            <div class="meeting-icon">
              <img v-if="m.ekskulLogo" :src="m.ekskulLogo" class="meeting-logo" alt="" />
              <Icon v-else name="i-lucide-shield" class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="meeting-name">{{ m.ekskul }}</div>
              <div class="meeting-meta">
                <span><Icon name="i-lucide-clock" class="w-3 h-3" /> {{ m.time }}</span>
                <span><Icon name="i-lucide-map-pin" class="w-3 h-3" /> {{ m.location }}</span>
              </div>
            </div>
            <div class="meeting-right">
              <span class="meeting-badge" :class="{ 'badge-open': m.open, 'badge-soon': !m.open && !m.ended, 'badge-ended': m.ended }">
                {{ m.open ? 'Bisa Absen' : m.ended ? 'Selesai' : 'Belum Mulai' }}
              </span>
              <span class="meeting-select-hint" v-if="selectedMeetingId === m.id"><Icon name="i-lucide-crosshair" class="w-3 h-3" /> Terpilih</span>
            </div>
          </li>
          <li v-if="!todayMeetings.length" class="panel-empty">
            <Icon name="i-lucide-calendar-off" class="w-6 h-6" style="color: var(--text-muted);" />
            <p>Tidak ada jadwal pertemuan hari ini.</p>
            <p class="panel-empty-sub">Absensi hanya bisa dilakukan saat ada jadwal pertemuan yang dibuat operator/admin.</p>
          </li>
        </ul>
      </section>

      <!-- Kanan: map kecil + token QR (mengikuti pertemuan terpilih) -->
      <section class="map-card">
        <div class="map-card-header">
          <Icon name="i-lucide-crosshair" class="w-4 h-4" style="color: var(--olive-primary);" />
          <span v-if="selectedMeeting">Area Absensi, {{ selectedMeeting.ekskul }}</span>
          <span v-else>Area Absensi</span>
        </div>
        <div v-if="selectedMeeting" class="map-meeting-bar">
          <div class="flex-1 min-w-0">
            <p class="map-meeting-name">{{ selectedMeeting.ekskul }} · {{ selectedMeeting.time }}</p>
            <p class="map-meeting-loc"><Icon name="i-lucide-map-pin" class="w-3 h-3" /> {{ selectedMeeting.location }}<template v-if="selectedMeeting.coach"> · {{ selectedMeeting.coach }}</template></p>
          </div>
        </div>
        <AttendanceMap
          ref="attMapRef"
          :zone="selectedMeeting ? { latitude: selectedMeeting.latitude ?? null, longitude: selectedMeeting.longitude ?? null, radius: selectedMeeting.radius ?? 200, locationName: selectedMeeting.location } : null"
          :logo="selectedMeeting?.ekskulLogo ?? null"
          @location="onMapLocation"
        />

        <div class="scan-row">
          <input v-model="qrToken" type="text" :placeholder="selectedMeeting ? `Token QR ${selectedMeeting.ekskul}` : 'Token QR'" class="search-input" :class="{ 'token-from-qr': tokenFromQr }" @keyup.enter="scanQr">
          <button class="btn-scan" title="Scan QR dengan kamera" @click="showCamScanner = true">
            <Icon name="i-lucide-camera" class="w-4 h-4" /> Scan
          </button>
          <button class="btn-primary" :disabled="scanState === 'locating' || scanState === 'scanning' || scanBlocked" :title="scanBlocked ? 'Lokasi kamu di luar area absensi' : ''" @click="scanQr">
            <Icon name="i-lucide-qr-code" class="w-4 h-4" />
            {{ scanState === 'locating' || scanState === 'scanning' ? 'Memproses...' : 'Absen' }}
          </button>
        </div>

        <!-- Banner status absensi (mendeteksi lokasi → mencatat → sukses/error) -->
        <div v-if="scanState === 'success'" class="scan-status scan-ok">
          <Icon name="i-lucide-check-circle-2" class="w-5 h-5" />
          <span><strong>Absen berhasil!</strong> {{ scanMsg }}</span>
        </div>
        <div v-else-if="scanState === 'error'" class="scan-status scan-err">
          <Icon name="i-lucide-alert-circle" class="w-5 h-5" />
          <span>{{ scanMsg }}</span>
        </div>
        <div v-else-if="scanState === 'locating' || scanState === 'scanning'" class="scan-status scan-info">
          <Icon name="i-lucide-loader-2" class="w-4 h-4 spin-icon" />
          <span>{{ scanMsg }}</span>
        </div>

        <p v-if="tokenFromQr && scanState === 'idle'" class="qr-ready-badge">
          <Icon name="i-lucide-check-circle-2" class="w-4 h-4" />
          Token QR terisi dari hasil scan, klik <strong>Absen</strong> untuk mencatat kehadiran.
        </p>
        <p class="scan-hint" style="margin-top:8px;">
          <Icon name="i-lucide-info" class="w-3.5 h-3.5" />
          <span v-if="selectedMeeting?.open">Scan QR dari pembimbing dengan tombol <strong>Scan</strong> (kamera), atau masukkan token manual.</span>
          <span v-else-if="todayMeetings.length">Absen baru bisa diproses saat waktu pertemuan berlangsung.</span>
          <span v-else>Tidak ada jadwal hari ini, token QR tidak akan diterima.</span>
        </p>
      </section>
    </div>

    <!-- Scanner QR kamera -->
    <QrCameraScanner v-if="showCamScanner" @scan="onCameraScan" @close="showCamScanner = false" />

    <div class="stats-row">
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal-dark);">{{ stats.rate }}%</span><span class="stat-mini-label">{{ ui.t('stat.kehadiranRate') }}</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal);">{{ stats.hadir }}</span><span class="stat-mini-label">{{ ui.t('attendance.hadir') }}</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--orange);">{{ stats.izin }}</span><span class="stat-mini-label">{{ ui.t('attendance.izin') }}</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--red-orange);">{{ stats.alpha }}</span><span class="stat-mini-label">{{ ui.t('attendance.alpha') }}</span></div>
    </div>

    <div class="table-card">
      <div class="table-toolbar">
        <h3 class="font-semibold text-[14px] flex items-center gap-2">
          <Icon name="i-lucide-calendar-days" class="w-4 h-4" style="color: var(--olive-primary);" /> Riwayat Absensi
        </h3>
        <div class="month-nav">
          <button class="month-nav-btn" title="Bulan sebelumnya" @click="changeMonth(-1)"><Icon name="i-lucide-chevron-left" class="w-4 h-4" /></button>
          <span class="month-nav-label">{{ monthLabel }}</span>
          <button class="month-nav-btn" title="Bulan berikutnya" @click="changeMonth(1)"><Icon name="i-lucide-chevron-right" class="w-4 h-4" /></button>
          <button class="month-today-btn" @click="goToday">Hari Ini</button>
        </div>
      </div>
      <table class="data-table">
        <thead><tr><th>Tanggal</th><th>Ekskul</th><th>Status</th><th>Waktu</th><th>Keterangan</th></tr></thead>
        <tbody>
          <tr v-for="a in paged" :key="a.date + a.ekskul">
            <td>{{ a.date }}</td><td class="font-semibold">{{ a.ekskul }}</td>
            <td><span class="attendance-badge" :class="{ 'badge-hadir': a.status === 'Hadir', 'badge-izin': a.status === 'Izin', 'badge-alpha': a.status === 'Alpha' }">{{ a.status }}</span></td>
            <td style="font-variant-numeric:tabular-nums;letter-spacing:0.02em;font-weight:var(--font-medium);font-size:var(--text-sm);">{{ a.time }}</td>
            <td style="color: var(--text-secondary); font-size: var(--text-sm);">{{ a.notes }}</td>
          </tr>
          <tr v-if="!filteredAttendance.length"><td colspan="5" class="text-center py-8" style="color: var(--text-muted);">Belum ada catatan absensi di bulan {{ monthLabel }}.</td></tr>
        </tbody>
      </table>
      <PaginationBar v-model:page="page" :total="filteredAttendance.length" />
    </div>

    <!-- Kumpulan Surat Izin Saya -->
    <div class="table-card">
      <div class="table-toolbar">
        <h3 class="font-semibold text-[14px] flex items-center gap-2">
          <Icon name="i-lucide-file-text" class="w-4 h-4" style="color: var(--orange);" /> Kumpulan Surat Izin Saya
        </h3>
        <span class="text-[11px]" style="color: var(--text-muted);">{{ izins.length }} surat izin</span>
      </div>
      <div v-if="izinsLoading" class="loading-shimmer" style="height: 60px;"></div>
      <table v-else class="data-table">
        <thead><tr><th>Tanggal</th><th>Ekskul</th><th>Alasan</th><th>Surat</th><th class="text-right">Aksi</th></tr></thead>
        <tbody>
          <tr v-for="z in izins" :key="z.id">
            <td>{{ z.date }}</td>
            <td class="font-semibold">{{ z.ekskul }}</td>
            <td style="color: var(--text-secondary); font-size: var(--text-sm);">{{ z.reason }}</td>
            <td>
              <span v-if="z.proofUrl" class="surat-badge surat-ok"><Icon name="i-lucide-check-circle-2" class="w-3.5 h-3.5" /> Surat Terlampir</span>
              <span v-else class="surat-badge surat-warn"><Icon name="i-lucide-alert-triangle" class="w-3.5 h-3.5" /> Tanpa Surat</span>
            </td>
            <td class="text-right">
              <button v-if="z.proofUrl" class="view-surat-btn" @click="previewSurat = z.proofUrl">
                <Icon name="i-lucide-eye" class="w-4 h-4" /> Lihat Surat
              </button>
            </td>
          </tr>
          <tr v-if="!izins.length">
            <td colspan="5" class="text-center py-8" style="color: var(--text-muted);">Belum ada surat izin yang diajukan.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Preview surat izin -->
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
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-refresh { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border-light); background: var(--bg-card); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.btn-refresh:hover { color: var(--olive-primary); border-color: var(--olive-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.6; }
.btn-scan { display: inline-flex; align-items: center; gap: 6px; background: var(--bg-card); color: var(--olive-primary); font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 14px; border-radius: 6px; border: 1px solid var(--olive-primary); cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.btn-scan:hover { background: var(--olive-bg); }
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-mini { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px; text-align: center; }
.stat-mini-value { display: block; font-size: var(--text-xl); font-weight: var(--font-bold); }
.stat-mini-label { font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; }

/* Layout 2 kolom: jadwal kiri (lebih lebar), map kanan (kompak) */
.attendance-layout { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 16px; align-items: stretch; }
@media (max-width: 900px) { .attendance-layout { grid-template-columns: 1fr; } }
.panel-card, .map-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 10px; overflow: hidden; }
.panel-header { display: flex; align-items: center; gap: 8px; padding: 12px 16px; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); border-bottom: 1px solid var(--border-light); }
.panel-time { margin-left: auto; font-size: var(--text-xs); color: var(--text-muted); font-variant-numeric: tabular-nums; }
.panel-list { list-style: none; margin: 0; padding: 8px; }
.panel-list-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; transition: background 0.15s; }
.panel-list-item:hover { background: var(--bg-hover); }
.meeting-icon { width: 38px; height: 38px; border-radius: 10px; background: var(--olive-bg); color: var(--olive-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.meeting-logo { width: 100%; height: 100%; object-fit: cover; }
.meeting-name { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.meeting-meta { display: flex; gap: 10px; font-size: 11px; color: var(--text-muted); margin-top: 3px; flex-wrap: wrap; }
.meeting-meta span { display: inline-flex; align-items: center; gap: 4px; }
.meeting-badge { font-size: 12px; padding: 3px 10px; border-radius: 4px; font-weight: var(--font-semibold); white-space: nowrap; }
.badge-open { background: rgba(16,185,129,0.15); color: #047857; }
.badge-soon { background: rgba(245,158,11,0.15); color: #b45309; }
.badge-ended { background: var(--bg-hover); color: var(--text-muted); }
.meeting-open { background: rgba(16,185,129,0.06); }
.panel-list-item { cursor: pointer; }
.panel-list-item.meeting-selected { outline: 2px solid var(--olive-primary); outline-offset: -2px; background: rgba(139,148,103,0.08); }
.meeting-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.meeting-select-hint { display: inline-flex; align-items: center; gap: 3px; font-size: 12px; font-weight: var(--font-semibold); color: var(--olive-primary); }
.map-meeting-bar { display: flex; align-items: center; gap: 8px; background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 8px; padding: 8px 12px; margin-bottom: 10px; }
.map-meeting-name { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.map-meeting-loc { display: flex; align-items: center; gap: 4px; font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px; }
.panel-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px; color: var(--text-muted); font-size: var(--text-sm); text-align: center; }
.panel-empty-sub { font-size: var(--text-xs); color: var(--text-muted); opacity: 0.8; }

.map-card { padding: 12px; }
.map-card-header { display: flex; align-items: center; gap: 8px; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); margin-bottom: 10px; }
.scan-row { display: flex; gap: 8px; margin-top: 10px; }
.search-input { flex: 1; border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); color: var(--text-primary); background: var(--bg-card); }
.search-input:focus { outline: none; border-color: var(--olive-primary); }
.scan-status { display: flex; align-items: flex-start; gap: 8px; margin-top: 10px; padding: 10px 12px; border-radius: 4px; font-size: var(--text-xs); }
.scan-ok { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.35); color: #0f9d6e; }
.scan-err { background: rgba(212,106,90,0.08); border: 1px solid rgba(212,106,90,0.3); color: var(--red-orange); }
.scan-info { background: var(--olive-bg); border: 1px solid var(--olive-light); color: var(--olive-primary); align-items: center; }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.token-from-qr { border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.qr-ready-badge { display: flex; align-items: center; gap: 8px; margin-top: 10px; padding: 10px 12px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.35); border-radius: 4px; font-size: var(--text-xs); color: #0f9d6e; }
.scan-hint { display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 8px; }

.table-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.table-toolbar { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border-light); gap: 8px; flex-wrap: wrap; }
.month-nav { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.month-nav-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--border-light); background: var(--bg-card); color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.month-nav-btn:hover { background: var(--olive-bg); color: var(--olive-primary); border-color: var(--olive-primary); }
.month-nav-label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); min-width: 130px; text-align: center; }
.month-today-btn { border: 1px solid var(--border-light); background: var(--bg-card); color: var(--text-secondary); font-size: var(--text-xs); padding: 5px 12px; border-radius: 6px; cursor: pointer; transition: all 0.15s; }
.month-today-btn:hover { background: var(--olive-bg); color: var(--olive-primary); border-color: var(--olive-primary); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; }
.data-table th.text-right, .data-table td.text-right { text-align: right; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.attendance-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 4px; font-weight: var(--font-medium); color: var(--text-secondary); }
.badge-hadir { color: var(--teal); }
.badge-izin { color: var(--orange); }
.badge-alpha { color: var(--red-orange); }

/* ---- Surat izin saya ---- */
.surat-badge { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-xs); padding: 2px 10px; border-radius: 4px; font-weight: var(--font-medium); white-space: nowrap; }
.surat-ok { background: rgba(16,185,129,0.12); color: #047857; }
.surat-warn { background: rgba(245,158,11,0.15); color: #b45309; }
.view-surat-btn { display: inline-flex; align-items: center; gap: 5px; font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--accent); background: var(--accent-soft, rgba(79,70,229,0.1)); border: 1px solid var(--accent-border, rgba(79,70,229,0.25)); border-radius: 6px; padding: 5px 10px; cursor: pointer; transition: all 0.2s; }
.view-surat-btn:hover { background: var(--accent); color: white; }
.surat-preview-modal { width: min(720px, 94vw); }
.surat-preview-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border-light); }
.surat-preview-title { display: inline-flex; align-items: center; gap: 8px; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.surat-preview-img { width: 100%; max-height: 78vh; object-fit: contain; display: block; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1100; backdrop-filter: blur(2px); padding: 20px; }
.modal-content { background: var(--bg-card); border-radius: 14px; max-width: 92vw; max-height: 92vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.25); }
.modal-close { margin-left: auto; background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 6px; }
.modal-close:hover { background: var(--bg-hover); color: var(--text-primary); }
</style>
