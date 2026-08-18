<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const auth = useAuthStore()
const op = useOperatorDataStore()
const admin = useMasterDataStore()
const { myEkskul, isOperator, isScopedOperator } = useEkskulScope()
const { confirm } = useConfirm()
onMounted(() => {
  op.fetchAll(); admin.fetchReference()
  // Operator ekskul: QR otomatis untuk ekskul miliknya
  if (isScopedOperator.value && myEkskul.value) selectedEkskulId.value = myEkskul.value.id
})
const generating = ref(false)
const activeSession = ref<{ id: string; token: string; expiresAt: string; locationName?: string | null } | null>(null)
const selectedEkskulId = ref('')

// Lokasi geofencing untuk sesi absensi ini (diatur saat membuat QR).
// Default: titik & radius lokasi sekolah (bisa digeser/diubah per sesi).
const qrLocation = ref<{ latitude: number | null; longitude: number | null; radius: number; locationName?: string | null }>({
  latitude: auth.institution?.latitude ?? null,
  longitude: auth.institution?.longitude ?? null,
  radius: auth.institution?.attendanceRadius ?? 200,
  locationName: auth.institution?.address ?? null,
})

async function generateQr() {
  if (!selectedEkskulId.value) return
  generating.value = true
  try {
    const res = await $fetch<{ id: string; token: string; expiresAt: string; locationName?: string | null }>('/api/operator/attendance/session', {
      method: 'POST', body: {
        extracurricularId: selectedEkskulId.value,
        latitude: qrLocation.value.latitude,
        longitude: qrLocation.value.longitude,
        radius: qrLocation.value.radius,
        locationName: qrLocation.value.locationName,
      }
    })
    activeSession.value = res
  } catch {}
  generating.value = false
}

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

// ---- Tandai alpha (tidak hadir tanpa izin) ----
const marking = ref<Record<string, boolean>>({})

// Anggota aktif ekskul sesi yang BELUM punya catatan absensi (belum scan & belum izin)
function missingMembers(h: any): any[] {
  const sudah = new Set((h.records ?? []).map((r: any) => r.studentId))
  return (op.members as any[])
    .filter(m => m.ekskulId === h.ekskulId && m.status === 'active' && !sudah.has(m.studentId))
    .map(m => ({ studentId: m.studentId, nis: m.nis, name: m.name, class: m.class }))
}

async function markMissingAlpha(h: any, m: any) {
  const ok = await confirm({
    title: `Tandai alpha: ${m.name}?`,
    message: `${m.name} (${m.nis}) tercatat TIDAK hadir tanpa surat izin pada ${h.ekskul} (${h.date}). Siswa akan menerima notif peringatan, dan catatan langsung masuk ke grafik kehadiran.`,
    confirmText: 'Ya, Tandai Alpha',
    danger: true,
  })
  if (!ok) return
  marking.value[m.studentId] = true
  try {
    await $fetch('/api/operator/attendance/mark', {
      method: 'POST',
      body: { sessionId: h.id, studentId: m.studentId, status: 'alpha', notes: 'Tidak hadir tanpa surat izin' },
    })
    // Masukkan ke daftar records sesi ini (status alpha)
    h.records = h.records || []
    h.records.push({ id: `alpha-${m.studentId}-${Date.now()}`, studentId: m.studentId, nis: m.nis, student: m.name, class: m.class, status: 'alpha', time: null, notes: 'Tidak hadir tanpa surat izin' })
    h.total = (h.total || 0) + 1
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal menandai alpha.')
  } finally {
    marking.value[m.studentId] = false
  }
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

const schoolZone = computed(() => getSchoolZone(auth.institution))
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">{{ ui.t('menu.attendanceQr') }}</h1>

    <div class="qr-generator-card">
      <div class="form-row" style="max-width: 400px;">
        <div class="form-group">
          <label>Ekskul</label>
          <select v-if="!isOperator" v-model="selectedEkskulId" class="form-input" required>
            <option disabled value="">Pilih Ekskul</option>
            <option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option>
          </select>
          <div v-else-if="myEkskul" class="scope-badge"><Icon name="i-lucide-shield" class="w-4 h-4" /> {{ myEkskul.name }}</div>
          <div v-else class="scope-warning"><Icon name="i-lucide-alert-circle" class="w-4 h-4" /> Akun belum diikat ke ekskul. Hubungi admin.</div>
        </div>
      </div>
      <div class="qr-location-box">
        <div class="form-group">
          <label>Titik Lokasi Absensi (siswa harus berada di area ini saat scan)</label>
          <SchoolLocationPicker v-model="qrLocation" :show-radius="true" />
        </div>
        <p class="loc-note">
          <Icon name="i-lucide-info" class="w-3.5 h-3.5" />
          Default mengikuti lokasi sekolah. Geser marker atau ketik alamat untuk menyesuaikan titik absensi sesi ini.
        </p>
      </div>
      <button class="btn-primary" :disabled="generating" @click="generateQr">
        <Icon name="i-lucide-qr-code" class="w-4 h-4" />
        {{ generating ? 'Membuat QR...' : 'Buat QR Absensi' }}
      </button>
      <div v-if="activeSession" class="qr-result">
        <div class="qr-placeholder">
          <div class="qr-grid"><div v-for="i in 121" :key="i" class="qr-cell" :class="{ 'qr-dark': Math.random() > 0.6 }"></div></div>
        </div>
        <div class="qr-info">
          <p class="qr-token">Token: <strong>{{ activeSession.token }}</strong></p>
          <p class="qr-expires">Berlaku sampai: {{ activeSession.expiresAt }} {{ schoolZone }}</p>
          <p v-if="activeSession.locationName" class="qr-location-name"><Icon name="i-lucide-map-pin" class="w-3.5 h-3.5" /> {{ activeSession.locationName }}</p>
          <p class="qr-hint" style="color: var(--text-muted); font-size: var(--text-sm);">Tampilkan QR ini di layar, siswa scan lewat dashboard mereka.</p>
        </div>
      </div>
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

                  <!-- Anggota yang belum scan / belum hadir — tandai alpha (tidak hadir tanpa surat izin) -->
                  <div v-if="missingMembers(h).length" class="missing-box">
                    <p class="missing-title"><Icon name="i-lucide-user-x" class="w-4 h-4" /> Belum Hadir / Belum Scan ({{ missingMembers(h).length }} anggota)</p>
                    <p class="missing-hint">Anggota ini tidak scan QR dan tidak mengajukan izin. Tandai alpha → siswa dapat notif peringatan & langsung masuk grafik kehadiran.</p>
                    <div class="missing-list">
                      <div v-for="m in missingMembers(h)" :key="m.studentId" class="missing-row">
                        <div class="missing-info">
                          <span class="font-semibold text-[13px]">{{ m.name }}</span>
                          <span class="text-[11px]" style="color: var(--text-muted);">{{ m.nis }} · {{ m.class }}</span>
                        </div>
                        <button class="mark-alpha-btn" :disabled="marking[m.studentId]" @click="markMissingAlpha(h, m)">
                          <Icon v-if="!marking[m.studentId]" name="i-lucide-x-circle" class="w-3.5 h-3.5" />
                          <Icon v-else name="i-lucide-loader-2" class="w-3.5 h-3.5 spin-icon" />
                          {{ marking[m.studentId] ? '...' : 'Tandai Alpha' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
          <tr v-if="!filteredHistory.length"><td colspan="8" class="text-center py-8" style="color: var(--text-muted);">Belum ada data absensi</td></tr>
        </tbody>
      </table>
      <PaginationBar v-model:page="page" :total="filteredHistory.length" />
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.form-row { margin-bottom: 16px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.scope-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: var(--olive-bg); color: var(--olive-primary); border: 1px solid var(--olive-light); border-radius: 6px; font-size: var(--text-sm); font-weight: var(--font-semibold); }
.scope-warning { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: #fef2f2; color: var(--red-orange); border: 1px solid #fecaca; border-radius: 6px; font-size: var(--text-sm); font-weight: var(--font-medium); }
.qr-generator-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 24px; }
.qr-location-box { margin: 4px 0 16px; padding: 16px; background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 8px; }
.loc-note { display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 10px; }
.qr-location-name { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 4px; }
.qr-result { display: flex; gap: 24px; margin-top: 24px; align-items: center; flex-wrap: wrap; }
.qr-placeholder { width: 180px; height: 180px; border: 2px solid var(--border-light); border-radius: 12px; overflow: hidden; padding: 12px; }
.qr-grid { display: grid; grid-template-columns: repeat(11, 1fr); gap: 2px; width: 100%; height: 100%; }
.qr-cell { background: white; border-radius: 1px; }
.qr-dark { background: var(--text-primary); }
.qr-token { font-size: var(--text-md); margin-bottom: 4px; }
.qr-expires { font-size: var(--text-sm); color: var(--text-secondary); }
.table-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
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
.missing-box { margin-top: 12px; border: 1px solid rgba(229,114,94,0.35); background: rgba(229,114,94,0.04); border-radius: 8px; padding: 12px 14px; }
.missing-title { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--red-orange); }
.missing-hint { font-size: var(--text-xs); color: var(--text-secondary); margin: 4px 0 10px; }
.missing-list { display: flex; flex-direction: column; gap: 6px; }
.missing-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; }
.missing-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.mark-alpha-btn { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--red-orange); background: rgba(229,114,94,0.1); border: 1px solid rgba(229,114,94,0.3); border-radius: 6px; padding: 4px 10px; cursor: pointer; transition: all 0.2s; }
.mark-alpha-btn:hover:not(:disabled) { background: var(--red-orange); color: white; }
.mark-alpha-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.alpha-marked { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--text-muted); }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.status-badge { font-size: var(--text-xs); padding: 3px 10px; border-radius: 10px; font-weight: var(--font-medium); display: inline-flex; align-items: center; gap: 5px; }
.status-done { background: rgba(74,158,158,0.15); color: var(--teal); }
.status-live { background: rgba(139,148,103,0.15); color: var(--olive-primary); }
</style>
