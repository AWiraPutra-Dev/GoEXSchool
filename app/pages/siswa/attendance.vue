<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const siswa = useSiswaDataStore()
const ui = useUiStore()
onMounted(() => { siswa.fetchAll(); loadMeetings() })
const selectedMonth = ref('Juli 2026')
const showQrScanner = ref(false)

const { page, paged, totalPages } = usePagination(() => siswa.attendance)

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
const attMapRef = ref<any>(null)
const myLocation = ref<{ latitude: number; longitude: number; distance: number; inside: boolean } | null>(null)
const scanBlocked = ref(false)

async function scanQr() {
  if (!qrToken.value.trim()) { alert('Masukkan token QR dari operator.'); return }
  // Minta lokasi terbaru dari komponen peta (GPS) sebelum scan
  attMapRef.value?.locate()
  await new Promise(r => setTimeout(r, 600))
  if (!myLocation.value) {
    alert('Lokasi kamu belum terdeteksi. Aktifkan GPS dan tunggu hingga status lokasi muncul, lalu coba lagi.')
    return
  }
  if (!myLocation.value.inside) {
    alert(`Kamu berada di luar area sekolah (jarak ${myLocation.value.distance} m). Absensi hanya bisa dilakukan di sekitar area sekolah.`)
    return
  }
  showQrScanner.value = true
  try {
    const res = await $fetch('/api/siswa/attendance/scan', {
      method: 'POST',
      body: { token: qrToken.value.trim(), latitude: myLocation.value.latitude, longitude: myLocation.value.longitude },
    })
    siswa.attendance.unshift({ ...(res as any), notes: (res as any).notes || '' })
    qrToken.value = ''
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal scan QR.')
  }
  showQrScanner.value = false
}

function onMapLocation(v: { latitude: number; longitude: number; distance: number; inside: boolean } | null) {
  myLocation.value = v
  scanBlocked.value = !v || !v.inside
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
          <span v-if="selectedMeeting">Area Absensi — {{ selectedMeeting.ekskul }}</span>
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
          <input v-model="qrToken" type="text" :placeholder="selectedMeeting ? `Token QR ${selectedMeeting.ekskul}` : 'Token QR'" class="search-input" @keyup.enter="scanQr">
          <button class="btn-primary" :disabled="showQrScanner || scanBlocked" :title="scanBlocked ? 'Lokasi kamu di luar area absensi' : ''" @click="scanQr">
            <Icon name="i-lucide-qr-code" class="w-4 h-4" />
            {{ showQrScanner ? 'Memproses...' : 'Absen' }}
          </button>
        </div>
        <p class="scan-hint" style="margin-top:8px;">
          <Icon name="i-lucide-info" class="w-3.5 h-3.5" />
          <span v-if="selectedMeeting?.open">Pilih pertemuan di kiri sesuai yang kamu hadiri, lalu masukkan token QR dari pembimbing.</span>
          <span v-else-if="todayMeetings.length">Absen baru bisa diproses saat waktu pertemuan berlangsung.</span>
          <span v-else>Tidak ada jadwal hari ini — token QR tidak akan diterima.</span>
        </p>
      </section>
    </div>

    <div v-if="showQrScanner" class="qr-scanner-card">
      <div class="scanner-animation">
        <Icon name="i-lucide-qr-code" class="w-12 h-12" style="color: var(--olive-primary);" />
      </div>
      <p class="text-[13px] font-medium mt-3">Memproses...</p>
    </div>

    <div class="stats-row">
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal-dark);">{{ stats.rate }}%</span><span class="stat-mini-label">{{ ui.t('stat.kehadiranRate') }}</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal);">{{ stats.hadir }}</span><span class="stat-mini-label">{{ ui.t('attendance.hadir') }}</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--orange);">{{ stats.izin }}</span><span class="stat-mini-label">{{ ui.t('attendance.izin') }}</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--red-orange);">{{ stats.alpha }}</span><span class="stat-mini-label">{{ ui.t('attendance.alpha') }}</span></div>
    </div>

    <div class="table-card">
      <div class="table-toolbar">
        <select v-model="selectedMonth" class="filter-select">
          <option>Juli 2026</option><option>Juni 2026</option><option>Mei 2026</option>
        </select>
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
        </tbody>
      </table>
      <PaginationBar v-model:page="page" :total="siswa.attendance.length" />
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-refresh { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border-light); background: var(--bg-card); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.btn-refresh:hover { color: var(--olive-primary); border-color: var(--olive-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.6; }
.qr-scanner-card { background: var(--bg-card); border: 2px dashed var(--olive-primary); border-radius: 12px; padding: 32px; text-align: center; }
.scanner-animation { position: relative; width: 120px; height: 120px; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
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
.meeting-badge { font-size: 10px; padding: 3px 10px; border-radius: 10px; font-weight: var(--font-semibold); white-space: nowrap; }
.badge-open { background: rgba(16,185,129,0.15); color: #047857; }
.badge-soon { background: rgba(245,158,11,0.15); color: #b45309; }
.badge-ended { background: var(--bg-hover); color: var(--text-muted); }
.meeting-open { background: rgba(16,185,129,0.06); }
.panel-list-item { cursor: pointer; }
.panel-list-item.meeting-selected { outline: 2px solid var(--olive-primary); outline-offset: -2px; background: rgba(139,148,103,0.08); }
.meeting-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.meeting-select-hint { display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: var(--font-semibold); color: var(--olive-primary); }
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
.scan-hint { display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 8px; }

.table-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.table-toolbar { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.filter-select { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); color: var(--text-primary); background: white; }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.attendance-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); }
.badge-hadir { background: rgba(74,158,158,0.15); color: var(--teal); }
.badge-izin { background: rgba(212,192,137,0.2); color: var(--orange); }
.badge-alpha { background: rgba(212,106,90,0.15); color: var(--red-orange); }
</style>
