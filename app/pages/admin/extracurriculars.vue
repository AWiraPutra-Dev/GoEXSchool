<script setup lang="ts">
import type { Ekskul } from '~/stores/master-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const store = useMasterDataStore()
const showModal = ref(false)
const editMode = ref(false)
const saving = ref(false)
const form = reactive({ id: '', name: '', quota: 20, scheduleInfo: '', description: '' })

onMounted(() => store.fetchAll())

function openAdd() { editMode.value = false; Object.assign(form, { id: '', name: '', quota: 20, scheduleInfo: '', description: '' }); showModal.value = true }
function openEdit(e: Ekskul) { editMode.value = true; form.id = e.id; form.name = e.name; form.quota = e.quota; form.scheduleInfo = e.scheduleInfo || ''; form.description = e.description || ''; showModal.value = true }
async function save() {
  saving.value = true
  try {
    if (editMode.value) await store.updateEkskul(form.id, { name: form.name, quota: form.quota, scheduleInfo: form.scheduleInfo, description: form.description })
    else await store.addEkskul({ name: form.name, quota: form.quota, scheduleInfo: form.scheduleInfo, description: form.description })
    showModal.value = false
  } finally { saving.value = false }
}
async function removeEkskul(id: string) { if (confirm('Hapus ekskul ini?')) await store.deleteEkskul(id) }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">Data Ekstrakurikuler</h1>
      <button class="btn-primary" @click="openAdd"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tambah Ekskul</button>
    </div>
    <div class="ekskul-grid">
      <div v-for="e in store.extracurriculars" :key="e.id" class="ekskul-card">
        <div class="ekskul-card-header">
          <div>
            <h3 class="ekskul-name">{{ e.name }}</h3>
            <p class="ekskul-coach">{{ e.coach }}</p>
          </div>
          <div class="ekskul-actions">
            <button @click="openEdit(e)" title="Edit" style="background:none;border:none;cursor:pointer;padding:2px 6px;">✏️</button>
            <button @click="removeEkskul(e.id)" title="Hapus" style="background:none;border:none;cursor:pointer;padding:2px 6px;color:var(--text-red);">🗑️</button>
          </div>
        </div>
        <p class="ekskul-desc">{{ e.description }}</p>
        <p class="ekskul-schedule"><Icon name="i-lucide-clock" class="w-3.5 h-3.5" /> {{ e.scheduleInfo || e.schedule }}</p>
        <div class="progress-bar"><div class="progress-fill" :style="{ width: `${(e.members / e.quota) * 100}%` }"></div></div>
        <p class="ekskul-count">{{ e.members }}/{{ e.quota }} anggota</p>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h3 class="modal-title">{{ editMode ? 'Edit Ekskul' : 'Tambah Ekskul Baru' }}</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div class="form-row">
              <div class="form-group"><label>Nama Ekskul</label><input v-model="form.name" class="form-input" required></div>
              <div class="form-group"><label>Kuota</label><input v-model.number="form.quota" type="number" min="1" class="form-input" required></div>
            </div>
            <div class="form-group"><label>Jadwal</label><input v-model="form.scheduleInfo" class="form-input" placeholder="Contoh: Senin & Rabu 14.00-15.30"></div>
            <div class="form-group"><label>Deskripsi</label><textarea v-model="form.description" class="form-input" rows="2"></textarea></div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showModal = false">Batal</button>
              <button type="submit" class="btn-primary">{{ editMode ? 'Simpan' : 'Tambah' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.ekskul-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.ekskul-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); padding: 20px; transition: transform 0.2s, box-shadow 0.2s; }
.ekskul-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.ekskul-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; }
.ekskul-name { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.ekskul-coach { font-size: var(--text-sm); color: var(--text-secondary); margin-top: 2px; }
.ekskul-desc { font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 8px; }
.ekskul-schedule { font-size: var(--text-sm); color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
.progress-bar { width: 100%; height: 6px; border-radius: 3px; background: var(--bg-main); overflow: hidden; margin-bottom: 4px; }
.progress-fill { height: 100%; border-radius: 3px; background: var(--olive-primary); transition: width 0.3s ease; }
.ekskul-count { font-size: var(--text-xs); color: var(--text-muted); }
.ekskul-actions { display: flex; gap: 2px; font-size: 14px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
</style>
