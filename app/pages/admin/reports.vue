<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const reportTypes = [
  { label: 'Laporan Data Siswa', icon: 'i-lucide-users', desc: 'Rekapitulasi data siswa per kelas', color: 'var(--teal-dark)' },
  { label: 'Laporan Kehadiran Ekskul', icon: 'i-lucide-check-square', desc: 'Rekap kehadiran siswa per ekskul', color: 'var(--teal-mid)' },
  { label: 'Laporan Penilaian', icon: 'i-lucide-clipboard-check', desc: 'Nilai dan evaluasi kegiatan ekskul', color: 'var(--teal)' },
  { label: 'Laporan Prestasi', icon: 'i-lucide-award', desc: 'Pencapaian dan sertifikat siswa', color: 'var(--green-soft)' },
  { label: 'Laporan Keuangan', icon: 'i-lucide-dollar-sign', desc: 'Iuran dan anggaran kegiatan ekskul', color: 'var(--yellow-cream)' },
  { label: 'Laporan Tahunan', icon: 'i-lucide-file-text', desc: 'Rekapitulasi tahun ajaran', color: 'var(--orange)' }
]

const selectedReport = ref('')
const previewVisible = ref(false)

function showPreview(label: string) {
  selectedReport.value = label
  previewVisible.value = true
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">Laporan</h1>

    <div class="report-grid">
      <div v-for="r in reportTypes" :key="r.label" class="report-card" @click="showPreview(r.label)">
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

    <div v-if="previewVisible" class="preview-card">
      <div class="preview-header">
        <h3>{{ selectedReport }}</h3>
        <div class="preview-actions">
          <button class="btn-outline"><Icon name="i-lucide-download" class="w-4 h-4" /> Download PDF</button>
          <button class="btn-outline"><Icon name="i-lucide-printer" class="w-4 h-4" /> Cetak</button>
          <button class="btn-cancel-icon" @click="previewVisible = false">✕</button>
        </div>
      </div>
      <div class="preview-body">
        <div class="loading-shimmer" style="height: 200px; border-radius: 8px;"></div>
        <p class="text-center text-[13px]" style="color: var(--text-muted); margin-top: 12px;">
          Preview laporan akan muncul di sini. (Fitur cetak/laporan terintegrasi dengan database)
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.report-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 12px; }
.report-card {
  display: flex; align-items: center; gap: 16px;
  background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px;
  padding: 16px 20px; cursor: pointer; transition: all 0.2s;
}
.report-card:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-color: var(--olive-primary); }
.report-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.report-title { font-size: var(--text-md); font-weight: var(--font-semibold); color: var(--text-primary); }
.report-desc { font-size: var(--text-sm); color: var(--text-secondary); margin-top: 2px; }

.preview-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.preview-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border-light); }
.preview-header h3 { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.preview-actions { display: flex; gap: 8px; align-items: center; }
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: white; color: var(--text-primary); font-size: var(--text-sm); padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { background: var(--bg-hover); }
.btn-cancel-icon { background: none; border: none; cursor: pointer; font-size: 16px; color: var(--text-muted); padding: 4px 8px; }
.preview-body { padding: 20px; }
</style>
