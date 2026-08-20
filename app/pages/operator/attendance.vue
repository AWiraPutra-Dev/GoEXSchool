<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const op = useOperatorDataStore()
const { confirm } = useConfirm()
onMounted(() => { op.fetchAll() })

// Efek buku tamu: polling ringan — siswa yang baru scan langsung terlihat
// di riwayat tanpa harus refresh halaman.
let pollTimer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  pollTimer = setInterval(() => op.refreshAttendance(), 10_000)
})
onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

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

// ---- Kumpulan surat izin per sesi (preview tanpa unduh) ----
const showIzinsModal = ref(false)
const izinsList = ref<any[]>([])
const izinsTarget = ref<any>(null)
const izinsLoading = ref(false)
const izinsError = ref('')
const previewSurat = ref<string | null>(null)

async function openIzins(h: any) {
  izinsTarget.value = h
  izinsList.value = []
  izinsError.value = ''
  showIzinsModal.value = true
  izinsLoading.value = true
  try {
    izinsList.value = await $fetch<any[]>('/api/siswa/izin', {
      query: { date: h.dateISO, ekskulId: h.ekskulId },
    })
  } catch (err: any) {
    izinsError.value = err?.data?.message || 'Gagal memuat surat izin.'
  } finally {
    izinsLoading.value = false
  }
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
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">{{ ui.t('menu.attendanceQr') }}</h1>

    <AttendanceQrGenerator @created="op.refreshAttendance()" />

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
                <button class="surat-btn" title="Lihat kumpulan surat izin" @click.stop="openIzins(h)">
                  <Icon name="i-lucide-file-text" class="w-4 h-4" /> Surat Izin
                </button>
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
                        <td><span class="status-badge" :style="{ color: statusColor[r.status] }">
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

    <!-- Modal Kumpulan Surat Izin (preview tanpa unduh) -->
    <Teleport to="body">
      <div v-if="showIzinsModal && izinsTarget" class="modal-overlay" @click.self="showIzinsModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-icon"><Icon name="i-lucide-folder-open" class="w-5 h-5" /></div>
            <div>
              <h3 class="modal-title">Kumpulan Surat Izin</h3>
              <p class="modal-sub">{{ izinsTarget.ekskul }} · {{ izinsTarget.date }}, klik surat untuk melihat tanpa unduh.</p>
            </div>
            <button class="modal-close" @click="showIzinsModal = false"><Icon name="i-lucide-x" class="w-4 h-4" /></button>
          </div>

          <div v-if="izinsLoading" class="izins-loading"><div class="loading-shimmer" style="width:100%;height:80px;border-radius:6px;"></div></div>
          <p v-else-if="izinsError" class="izins-error">{{ izinsError }}</p>
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
          <div v-else class="izins-empty"><Icon name="i-lucide-file-x-2" class="w-8 h-8" /><p>Belum ada surat izin pada sesi ini.</p></div>
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
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.table-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 240px; color: var(--text-primary); background: var(--bg-card); }
.search-input:focus { outline: none; border-color: var(--olive-primary); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; }
.data-table th.text-right, .data-table td.text-right { text-align: right; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.text-right { text-align: right; }
.history-row { cursor: pointer; transition: background 0.15s; }
.history-row:hover { background: var(--bg-hover); }
.row-open { background: rgba(139,148,103,0.05); }
.count-chip { display: inline-flex; align-items: center; justify-content: center; min-width: 26px; font-size: var(--text-xs); font-weight: var(--font-bold); color: var(--text-secondary); font-variant-numeric: tabular-nums; }
.count-hadir { color: var(--text-secondary); }
.count-izin { color: var(--text-secondary); }
.count-alpha { color: var(--text-secondary); }
.expand-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px; border-radius: 4px; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
.expand-btn:hover { color: var(--accent); background: var(--bg-hover); }
.expand-btn svg { transition: transform 0.2s; }
.expand-btn.expanded svg { transform: rotate(180deg); }
.surat-btn {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: var(--text-xs); font-weight: var(--font-semibold);
  color: var(--accent); background: var(--accent-soft, rgba(79,70,229,0.1));
  border: 1px solid var(--accent-border, rgba(79,70,229,0.25));
  border-radius: 6px; padding: 5px 10px; margin-right: 6px;
  cursor: pointer; transition: all 0.2s;
}
.surat-btn:hover { background: var(--accent); color: white; }

/* ===== Modal surat izin ===== */
.izins-loading { padding: 12px 20px; }
.izins-error { padding: 12px 20px; color: var(--red-orange); font-size: var(--text-sm); }
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
.surat-preview-modal { width: min(720px, 94vw); }
.surat-preview-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border-light); }
.surat-preview-title { display: inline-flex; align-items: center; gap: 8px; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.surat-preview-img { width: 100%; max-height: 78vh; object-fit: contain; display: block; }
.modal-header { display: flex; align-items: flex-start; gap: 12px; padding: 18px 20px; border-bottom: 1px solid var(--border-light); }
.modal-header-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--accent-soft, rgba(79,70,229,0.12)); color: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.modal-sub { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }
.modal-close { margin-left: auto; background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 6px; }
.modal-close:hover { background: var(--bg-hover); color: var(--text-primary); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(2px); }
.modal-content { background: var(--bg-card); border-radius: 14px; width: 540px; max-width: 92vw; max-height: 92vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.25); }
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
.status-badge { font-size: var(--text-xs); font-weight: var(--font-medium); display: inline-flex; align-items: center; gap: 5px; }
.status-live { color: var(--olive-primary); }
.status-done { color: var(--text-muted); }
</style>
