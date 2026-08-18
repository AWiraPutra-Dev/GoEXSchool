<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const op = useOperatorDataStore()
onMounted(() => op.fetchAll())
const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const activeDay = ref('Senin')
const daySchedule = computed(() => op.schedule.filter(s => s.day === activeDay.value))
const { page, paged, totalPages } = usePagination(() => daySchedule.value)
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">{{ ui.t('menu.schedule') }}</h1>
    <p class="text-[13px]" style="color: var(--text-secondary);">Seluruh jadwal kegiatan ekstrakurikuler</p>

    <div class="day-tabs">
      <button v-for="d in dayNames" :key="d" class="day-tab" :class="{ active: activeDay === d }" @click="activeDay = d">{{ d }}</button>
    </div>

    <div class="schedule-list">
      <div v-for="(s, i) in paged" :key="i" class="schedule-item">
        <div v-if="s.date" class="schedule-date"><Icon name="i-lucide-calendar" class="w-3.5 h-3.5" /> {{ s.date }}</div>
        <div class="schedule-time">{{ s.time }}</div>
        <div class="schedule-info">
          <h4 class="font-semibold text-[13px]">{{ s.ekskul }}</h4>
          <p class="text-[12px]" style="color: var(--text-secondary);">{{ s.coach }} · {{ s.location }}</p>
          <p v-if="s.latitude != null && s.longitude != null" class="text-[11px] coord-text">
            <Icon name="i-lucide-crosshair" class="w-3 h-3" /> Titik absen: {{ s.latitude.toFixed(5) }}, {{ s.longitude.toFixed(5) }} · Radius {{ s.radius ?? 200 }} m
          </p>
        </div>
      </div>
      <div v-if="!daySchedule.length" class="empty-state">
        <Icon name="i-lucide-calendar-off" class="w-8 h-8 mb-2" style="color: var(--text-muted);" />
        <p>Tidak ada jadwal di hari {{ activeDay }}.</p>
      </div>
    </div>
    <PaginationBar v-model:page="page" :total="daySchedule.length" />

    <div class="quick-actions-card">
      <div class="panel-header">Info</div>
      <div class="quick-links">
        <span class="info-text">Halaman ini menampilkan jadwal ekskul. Pengelolaan jadwal dilakukan oleh Operator.</span>
        <NuxtLink to="/admin/extracurriculars" class="quick-link">Data Ekstrakurikuler</NuxtLink>
      </div>
    </div>
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
.schedule-date { display: inline-flex; align-items: center; gap: 5px; font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--text-secondary); background: var(--bg-hover); border: 1px solid var(--border-light); padding: 4px 10px; border-radius: 6px; white-space: nowrap; }
.schedule-time { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--olive-primary); font-variant-numeric: tabular-nums; letter-spacing: 0.02em; background: var(--olive-bg); border: 1px solid var(--border-light); padding: 4px 10px; border-radius: 6px; white-space: nowrap; }
.schedule-info { flex: 1; }
.coord-text { display: inline-flex; align-items: center; gap: 4px; color: var(--text-muted); margin-top: 3px; font-variant-numeric: tabular-nums; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 40px; color: var(--text-muted); font-size: var(--text-sm); background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 8px; }
.quick-actions-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; margin-top: 16px; }
.panel-header { display: flex; align-items: center; gap: 10px; background: var(--bg-card); color: var(--text-primary); font-weight: var(--font-semibold); text-transform: uppercase; font-size: 12px; padding: 12px 16px; letter-spacing: 0.02em; border-bottom: 1px solid var(--border-light); }
.panel-header::before { content: ''; width: 4px; height: 14px; border-radius: 2px; background: var(--accent); flex-shrink: 0; }
.quick-links { display: flex; gap: 12px; padding: 16px; flex-wrap: wrap; }
.quick-link { padding: 8px 16px; background: var(--olive-bg); border-radius: 6px; color: var(--text-primary); text-decoration: none; font-size: var(--text-sm); transition: all 0.2s; }
.quick-link:hover { background: var(--olive-primary); color: white; }
.info-text { font-size: var(--text-sm); color: var(--text-secondary); padding: 8px 0; }
</style>
