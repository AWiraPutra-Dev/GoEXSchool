<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const siswa = useSiswaDataStore()
const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const dayMap: Record<string, string> = { Monday: 'Senin', Tuesday: 'Selasa', Wednesday: 'Rabu', Thursday: 'Kamis', Friday: 'Jumat', Saturday: 'Sabtu', Sunday: 'Minggu' }
const activeDay = ref('Senin')

onMounted(() => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  activeDay.value = dayMap[today] || 'Senin'
})

const scheduleCount = computed(() => Object.values(siswa.mySchedule).reduce((sum, arr) => sum + arr.length, 0))
const ekskulCount = computed(() => [...new Set(Object.values(siswa.mySchedule).flat().map(s => s.ekskul))].length)
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">Jadwal Saya</h1>

    <div class="day-tabs">
      <button v-for="d in dayNames" :key="d" class="day-tab" :class="{ active: activeDay === d }" @click="activeDay = d">{{ d }}</button>
    </div>

    <div class="schedule-list">
      <div v-for="(s, i) in siswa.mySchedule[activeDay] ?? []" :key="i" class="schedule-item">
        <div class="schedule-time">{{ s.time }}</div>
        <div class="schedule-info">
          <h4 class="font-semibold text-[13px]">{{ s.ekskul }}</h4>
          <p class="text-[12px]" style="color: var(--text-secondary);">{{ s.coach }} · {{ s.location }}</p>
        </div>
      </div>
      <div v-if="!(siswa.mySchedule[activeDay] ?? []).length" class="empty-state">
        <Icon name="i-lucide-calendar-off" class="w-8 h-8 mb-2" style="color: var(--text-muted);" />
        <p>Tidak ada jadwal ekskul di hari {{ activeDay }}.</p>
      </div>
    </div>

    <section class="panel-card">
      <div class="panel-header">Ringkasan Jadwal</div>
      <div class="summary-grid">
        <div class="summary-item"><span class="summary-value">{{ scheduleCount }}</span><span class="summary-label">Jadwal/Minggu</span></div>
        <div class="summary-item"><span class="summary-value">{{ ekskulCount }}</span><span class="summary-label">Ekskul Aktif</span></div>
        <div class="summary-item"><span class="summary-value">{{ scheduleCount * 1.5 }}</span><span class="summary-label">Jam/Minggu</span></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.day-tabs { display: flex; gap: 4px; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); padding: 4px; }
.day-tab { flex: 1; padding: 8px; text-align: center; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-secondary); background: none; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
.day-tab.active { background: var(--olive-primary); color: white; }
.day-tab:not(.active):hover { background: var(--bg-hover); }
.schedule-list { display: flex; flex-direction: column; gap: 8px; }
.schedule-item { display: flex; align-items: center; gap: 16px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 14px 20px; transition: all 0.2s; }
.schedule-item:hover { border-color: var(--olive-primary); }
.schedule-time { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--olive-primary); font-family: 'Courier New', monospace; background: var(--olive-bg); padding: 4px 10px; border-radius: 4px; white-space: nowrap; }
.schedule-info { flex: 1; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; color: var(--text-muted); font-size: var(--text-sm); background: var(--bg-card); border-radius: 8px; border: 1px dashed var(--border-light); }
.panel-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.panel-header { background: var(--olive-primary); color: white; font-weight: var(--font-semibold); text-transform: uppercase; font-size: 12px; padding: 10px 16px; }
.summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); padding: 20px; gap: 16px; }
.summary-item { text-align: center; }
.summary-value { display: block; font-size: var(--text-stat); font-weight: var(--font-bold); color: var(--olive-primary); }
.summary-label { font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; }
</style>
