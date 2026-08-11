<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const siswa = useSiswaDataStore()
const selectedMonth = ref('Juli 2026')
const showQrScanner = ref(false)

const stats = computed(() => {
  const total = siswa.attendance.length
  const hadir = siswa.attendance.filter(a => a.status === 'Hadir').length
  const izin = siswa.attendance.filter(a => a.status === 'Izin').length
  const alpha = siswa.attendance.filter(a => a.status === 'Alpha').length
  const rate = total ? Math.round((hadir / total) * 100) : 0
  return { total, hadir, izin, alpha, rate }
})

const qrToken = ref('')

async function scanQr() {
  if (!qrToken.value.trim()) { alert('Masukkan token QR dari operator.'); return }
  showQrScanner.value = true
  try {
    const res = await $fetch('/api/siswa/attendance/scan', { method: 'POST', body: { token: qrToken.value.trim() } })
    siswa.attendance.unshift(res)
    qrToken.value = ''
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal scan QR.')
  }
  showQrScanner.value = false
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">Kehadiran</h1>
      <div class="flex gap-2 items-center">
        <input v-model="qrToken" type="text" placeholder="Token QR" class="search-input" style="width:140px;">
        <button class="btn-primary" :disabled="showQrScanner" @click="scanQr">
          <Icon name="i-lucide-qr-code" class="w-4 h-4" />
          {{ showQrScanner ? 'Memproses...' : 'Absen' }}
        </button>
      </div>
    </div>

    <div v-if="showQrScanner" class="qr-scanner-card">
      <div class="scanner-animation">
        <Icon name="i-lucide-qr-code" class="w-12 h-12" style="color: var(--olive-primary);" />
      </div>
      <p class="text-[13px] font-medium mt-3">Memproses...</p>
    </div>

    <div class="stats-row">
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal-dark);">{{ stats.rate }}%</span><span class="stat-mini-label">Kehadiran</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal);">{{ stats.hadir }}</span><span class="stat-mini-label">Hadir</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--orange);">{{ stats.izin }}</span><span class="stat-mini-label">Izin</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--red-orange);">{{ stats.alpha }}</span><span class="stat-mini-label">Alpha</span></div>
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
          <tr v-for="a in siswa.attendance" :key="a.date + a.ekskul">
            <td>{{ a.date }}</td><td class="font-semibold">{{ a.ekskul }}</td>
            <td><span class="attendance-badge" :class="{ 'badge-hadir': a.status === 'Hadir', 'badge-izin': a.status === 'Izin', 'badge-alpha': a.status === 'Alpha' }">{{ a.status }}</span></td>
            <td style="font-family:'Courier New',monospace;font-size:var(--text-sm);">{{ a.time }}</td>
            <td style="color: var(--text-secondary); font-size: var(--text-sm);">{{ a.notes }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.6; }
.qr-scanner-card { background: var(--bg-card); border: 2px dashed var(--olive-primary); border-radius: 12px; padding: 32px; text-align: center; }
.scanner-animation { position: relative; width: 120px; height: 120px; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
.scanner-line { position: absolute; top: 0; left: 10%; right: 10%; height: 2px; background: var(--olive-primary); animation: scan 2s ease-in-out infinite; }
@keyframes scan { 0%, 100% { top: 0; } 50% { top: 100%; } }
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-mini { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px; text-align: center; }
.stat-mini-value { display: block; font-size: var(--text-xl); font-weight: var(--font-bold); }
.stat-mini-label { font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; }
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
