<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const selectedEkskul = ref('Semua')
const search = ref('')

const filtered = computed(() => {
  let result = op.assessments
  if (selectedEkskul.value !== 'Semua') result = result.filter(a => a.ekskul === selectedEkskul.value)
  if (search.value) result = result.filter(a => a.student.toLowerCase().includes(search.value.toLowerCase()))
  return result
})

const ekskulList = ['Semua', 'Basket', 'Paduan Suara', 'Robotik', 'Pramuka', 'KIR', 'Seni Tari', 'Futsal', 'English Club']
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">Penilaian</h1>
    <p class="text-[13px]" style="color: var(--text-secondary);">Pantau nilai dan evaluasi kegiatan ekskul</p>

    <div class="table-card">
      <div class="table-toolbar">
        <div class="flex gap-3 items-center">
          <select v-model="selectedEkskul" class="filter-select">
            <option v-for="e in ekskulList" :key="e">{{ e }}</option>
          </select>
          <input v-model="search" type="text" placeholder="Cari siswa..." class="search-input">
        </div>
        <span class="text-[11px]" style="color: var(--text-muted);">{{ filtered.length }} data</span>
      </div>
      <table class="data-table">
        <thead><tr><th>Siswa</th><th>Ekskul</th><th>Nilai</th><th>Grade</th><th>Catatan</th><th>Tanggal</th></tr></thead>
        <tbody>
          <tr v-for="a in filtered" :key="a.id">
            <td class="font-semibold">{{ a.student }}</td>
            <td><span class="ekskul-tag">{{ a.ekskul }}</span></td>
            <td class="text-center font-bold text-[16px]" :style="{ color: a.score >= 85 ? 'var(--teal)' : a.score >= 70 ? 'var(--orange)' : 'var(--red-orange)' }">{{ a.score }}</td>
            <td><span class="grade-badge" :class="a.score >= 80 ? 'grade-high' : 'grade-mid'">{{ a.grade }}</span></td>
            <td style="color: var(--text-secondary); font-size: var(--text-sm);">{{ a.notes }}</td>
            <td style="color: var(--text-muted); font-size: var(--text-sm);">{{ a.date }}</td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="6" class="text-center py-8" style="color: var(--text-muted);">Tidak ada data penilaian</td></tr>
        </tbody>
      </table>
    </div>

    <div class="quick-actions-card">
      <div class="panel-header">Info</div>
      <div class="quick-links">
        <span class="info-text">Halaman ini menampilkan data penilaian. Input nilai dilakukan oleh Operator.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.table-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.filter-select { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); color: var(--text-primary); background: white; }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 200px; }
.search-input:focus, .filter-select:focus { outline: none; border-color: var(--olive-primary); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.ekskul-tag { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.grade-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 4px; font-weight: var(--font-bold); }
.grade-high { background: rgba(74,158,158,0.15); color: var(--teal); }
.grade-mid { background: rgba(212,149,106,0.15); color: var(--orange); }
.quick-actions-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; margin-top: 16px; }
.panel-header { background: var(--olive-primary); color: white; font-weight: var(--font-semibold); text-transform: uppercase; font-size: 12px; padding: 10px 16px; }
.quick-links { display: flex; gap: 12px; padding: 16px; flex-wrap: wrap; }
.quick-link { padding: 8px 16px; background: var(--olive-bg); border-radius: 6px; color: var(--text-primary); text-decoration: none; font-size: var(--text-sm); transition: all 0.2s; }
.quick-link:hover { background: var(--olive-primary); color: white; }
.info-text { font-size: var(--text-sm); color: var(--text-secondary); padding: 8px 0; }
</style>
