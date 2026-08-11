<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const siswa = useSiswaDataStore()

const avgScore = computed(() => {
  if (!siswa.grades.length) return 0
  return Math.round(siswa.grades.reduce((sum, g) => sum + g.score, 0) / siswa.grades.length)
})
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">Penilaian Saya</h1>

    <div class="stats-row">
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal-dark);">{{ avgScore }}</span><span class="stat-mini-label">Rata-rata Nilai</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--teal);">{{ siswa.grades.length }}</span><span class="stat-mini-label">Total Penilaian</span></div>
      <div class="stat-mini"><span class="stat-mini-value" style="color: var(--green-soft);">{{ siswa.grades.filter(g => g.grade === 'A' || g.grade === 'A-').length }}</span><span class="stat-mini-label">Nilai A</span></div>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead><tr><th>Ekskul</th><th>Semester</th><th>Nilai</th><th>Grade</th><th>Catatan</th><th>Tanggal</th></tr></thead>
        <tbody>
          <tr v-for="(g, i) in siswa.grades" :key="i">
            <td class="font-semibold">{{ g.ekskul }}</td>
            <td style="font-size: var(--text-sm); color: var(--text-secondary);">{{ g.semester }}</td>
            <td class="text-center font-bold text-[16px]" :style="{ color: g.score >= 85 ? 'var(--teal)' : g.score >= 75 ? 'var(--orange)' : 'var(--red-orange)' }">{{ g.score }}</td>
            <td><span class="grade-badge" :class="g.grade === 'A' || g.grade === 'A-' ? 'grade-high' : 'grade-mid'">{{ g.grade }}</span></td>
            <td style="color: var(--text-secondary); font-size: var(--text-sm);">{{ g.notes }}</td>
            <td style="color: var(--text-muted); font-size: var(--text-sm);">{{ g.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.stat-mini { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px; text-align: center; }
.stat-mini-value { display: block; font-size: var(--text-xl); font-weight: var(--font-bold); }
.stat-mini-label { font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; }
.table-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.grade-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 4px; font-weight: var(--font-bold); }
.grade-high { background: rgba(74,158,158,0.15); color: var(--teal); }
.grade-mid { background: rgba(212,149,106,0.15); color: var(--orange); }
</style>
