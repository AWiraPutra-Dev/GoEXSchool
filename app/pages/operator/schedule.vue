<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const activeDay = ref('Senin')
const showModal = ref(false)
const form = reactive({ day: 'Senin', timeStart: '', timeEnd: '', ekskul: '', coach: '', location: '', ekskulId: '' })

const filteredSchedule = computed(() => op.schedule.filter(s => s.day === activeDay.value))

function addSchedule() {
  op.addScheduleEntry({ day: form.day, timeStart: form.timeStart, timeEnd: form.timeEnd || undefined, coach: form.coach, location: form.location, extracurricularId: form.ekskulId })
  showModal.value = false; form.timeStart = ''; form.timeEnd = ''; form.ekskul = ''; form.ekskulId = ''; form.coach = ''; form.location = ''
}
function removeSchedule(id: string) { if (confirm('Hapus jadwal ini?')) op.removeScheduleEntry(id) }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">Jadwal Ekskul</h1>
      <button class="btn-primary" @click="showModal = true"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tambah Jadwal</button>
    </div>

    <div class="day-tabs">
      <button v-for="d in dayNames" :key="d" class="day-tab" :class="{ active: activeDay === d }" @click="activeDay = d">{{ d }}</button>
    </div>

    <div class="schedule-list">
      <div v-for="s in filteredSchedule" :key="s.id" class="schedule-item">
        <div class="schedule-time">{{ s.time }}</div>
        <div class="schedule-info">
          <h4 class="font-semibold text-[13px]">{{ s.ekskul }}</h4>
          <p class="text-[12px]" style="color: var(--text-secondary);">{{ s.coach }} · {{ s.location }}</p>
        </div>
        <button class="delete-btn" @click="removeSchedule(s.id)" title="Hapus">🗑️</button>
      </div>
      <div v-if="!filteredSchedule.length" class="empty-state">Belum ada jadwal untuk hari {{ activeDay }}.</div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h3 class="modal-title">Tambah Jadwal Baru</h3>
          <form @submit.prevent="addSchedule" class="space-y-3">
            <div class="form-row">
              <div class="form-group"><label>Hari</label><select v-model="form.day" class="form-input"><option v-for="d in dayNames" :key="d">{{ d }}</option></select></div>
              <div class="form-group"><label>Ekskul</label><select v-model="form.ekskulId" class="form-input" required><option disabled value="">Pilih Ekskul</option></select></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Mulai</label><input v-model="form.timeStart" class="form-input" required placeholder="14:00"></div>
              <div class="form-group"><label>Selesai</label><input v-model="form.timeEnd" class="form-input" placeholder="15:30"></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Pembina</label><input v-model="form.coach" class="form-input" required></div>
              <div class="form-group"><label>Lokasi</label><input v-model="form.location" class="form-input" required></div>
            </div>
            <div class="modal-actions"><button type="button" class="btn-cancel" @click="showModal = false">Batal</button><button type="submit" class="btn-primary">Tambah</button></div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.day-tabs { display: flex; gap: 4px; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); padding: 4px; }
.day-tab { flex: 1; padding: 8px; text-align: center; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-secondary); background: none; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
.day-tab.active { background: var(--olive-primary); color: white; }
.day-tab:not(.active):hover { background: var(--bg-hover); }
.schedule-list { display: flex; flex-direction: column; gap: 8px; }
.schedule-item { display: flex; align-items: center; gap: 16px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 14px 20px; transition: all 0.2s; }
.schedule-item:hover { border-color: var(--olive-primary); }
.schedule-time { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--olive-primary); font-family: 'Courier New', monospace; background: var(--olive-bg); padding: 4px 10px; border-radius: 4px; white-space: nowrap; }
.schedule-info { flex: 1; }
.delete-btn { background: none; border: none; cursor: pointer; font-size: 14px; padding: 4px; opacity: 0.5; transition: opacity 0.2s; }
.delete-btn:hover { opacity: 1; }
.empty-state { text-align: center; padding: 40px; color: var(--text-muted); font-size: var(--text-sm); background: var(--bg-card); border-radius: 8px; border: 1px dashed var(--border-light); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
</style>
