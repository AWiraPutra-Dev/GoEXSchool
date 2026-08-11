<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const admin = useMasterDataStore()
const generating = ref(false)
const activeSession = ref<{ id: string; token: string; expiresAt: string } | null>(null)
const selectedEkskulId = ref('')

async function generateQr() {
  if (!selectedEkskulId.value) return
  generating.value = true
  try {
    const res = await $fetch<{ id: string; token: string; expiresAt: string }>('/api/operator/attendance/session', {
      method: 'POST', body: { extracurricularId: selectedEkskulId.value }
    })
    activeSession.value = res
  } catch {}
  generating.value = false
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">Absensi QR</h1>

    <div class="qr-generator-card">
      <div class="form-row" style="max-width: 400px;">
        <div class="form-group">
          <label>Pilih Ekskul</label>
          <select v-model="selectedEkskulId" class="form-input" required>
            <option disabled value="">Pilih Ekskul</option>
            <option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option>
          </select>
        </div>
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
          <p class="qr-expires">Berlaku sampai: {{ activeSession.expiresAt }} WIB</p>
          <p class="qr-hint" style="color: var(--text-muted); font-size: var(--text-sm);">Tampilkan QR ini di layar, siswa scan lewat dashboard mereka.</p>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-toolbar"><h3 class="font-semibold text-[14px]">Riwayat Absensi</h3></div>
      <table class="data-table">
        <thead><tr><th>Tanggal</th><th>Ekskul</th><th>Hadir</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          <tr v-for="h in op.attendanceHistory" :key="h.date + h.ekskul">
            <td>{{ h.date }}</td><td class="font-semibold">{{ h.ekskul }}</td>
            <td>{{ h.hadir }}</td><td>{{ h.total }}</td>
            <td><span class="status-badge status-done">{{ h.status }}</span></td>
          </tr>
        </tbody>
      </table>
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
.qr-generator-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 24px; }
.qr-result { display: flex; gap: 24px; margin-top: 24px; align-items: center; flex-wrap: wrap; }
.qr-placeholder { width: 180px; height: 180px; border: 2px solid var(--border-light); border-radius: 12px; overflow: hidden; padding: 12px; }
.qr-grid { display: grid; grid-template-columns: repeat(11, 1fr); gap: 2px; width: 100%; height: 100%; }
.qr-cell { background: white; border-radius: 1px; }
.qr-dark { background: var(--text-primary); }
.qr-token { font-size: var(--text-md); margin-bottom: 4px; }
.qr-expires { font-size: var(--text-sm); color: var(--text-secondary); }
.table-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.table-toolbar { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); }
.status-done { background: rgba(74,158,158,0.15); color: var(--teal); }
</style>
