<script setup lang="ts">
import type { ClassItem } from '~/stores/master-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const store = useMasterDataStore()
const search = ref('')
const saving = ref(false)

onMounted(() => store.fetchAll())

const filtered = computed(() => store.classes.filter(c =>
  c.name.toLowerCase().includes(search.value.toLowerCase()) ||
  (c.homeroom && c.homeroom.toLowerCase().includes(search.value.toLowerCase()))
))

const showModal = ref(false)
const editMode = ref(false)
const editId = ref('')
const form = reactive({ name: '', grade: '10', major: 'IPA', homeroom: '' })

function openAdd() { editMode.value = false; editId.value = ''; form.name = ''; form.grade = '10'; form.major = 'IPA'; form.homeroom = ''; showModal.value = true }

function openEdit(c: ClassItem) { editMode.value = true; editId.value = c.id; form.name = c.name; form.grade = c.grade; form.major = c.major; form.homeroom = c.homeroom || ''; showModal.value = true }

async function save() {
  saving.value = true
  try {
    if (editMode.value) {
      await store.updateClass(editId.value, { name: form.name, grade: form.grade, major: form.major, homeroom: form.homeroom })
    } else {
      await store.addClass({ name: form.name, grade: form.grade, major: form.major, homeroom: form.homeroom })
    }
    showModal.value = false
  } finally { saving.value = false }
}

async function removeClass(id: string) { if (confirm('Hapus kelas ini?')) await store.deleteClass(id) }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">Kelas / Rombel</h1>
      <button class="btn-primary" @click="openAdd"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tambah Kelas</button>
    </div>
    <div class="table-card">
      <div class="table-toolbar">
        <input v-model="search" type="text" placeholder="Cari kelas atau wali kelas..." class="search-input">
        <span class="text-[11px]" style="color: var(--text-muted);">{{ filtered.length }} kelas</span>
      </div>
      <table class="data-table">
        <thead><tr><th>Kelas</th><th>Tingkat</th><th>Jurusan</th><th>Jumlah Siswa</th><th>Wali Kelas</th><th class="text-right">Aksi</th></tr></thead>
        <tbody>
          <tr v-for="c in filtered" :key="c.id">
            <td class="font-bold">{{ c.name }}</td><td>Kelas {{ c.grade }}</td>
            <td><span class="major-badge">{{ c.major }}</span></td><td>{{ c.studentCount }} siswa</td>
            <td>{{ c.homeroom }}</td>
            <td class="text-right action-cell">
              <button class="action-btn" @click="openEdit(c)" title="Edit">✏️</button>
              <button class="action-btn" @click="removeClass(c.id)" title="Hapus" style="color: var(--text-red);">🗑️</button>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="6" class="text-center py-8" style="color: var(--text-muted);">Tidak ada data</td></tr>
        </tbody>
      </table>
    </div>
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h3 class="modal-title">{{ editMode ? 'Edit Kelas' : 'Tambah Kelas Baru' }}</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div class="form-row">
              <div class="form-group"><label>Nama Kelas</label><input v-model="form.name" class="form-input" required placeholder="Contoh: 10 IPA 3"></div>
              <div class="form-group"><label>Tingkat</label><select v-model="form.grade" class="form-input"><option>10</option><option>11</option><option>12</option></select></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Jurusan</label><select v-model="form.major" class="form-input"><option>IPA</option><option>IPS</option><option>Bahasa</option></select></div>
              <div class="form-group"><label>Wali Kelas</label><input v-model="form.homeroom" class="form-input" required placeholder="Nama wali kelas"></div>
            </div>
            <div class="modal-actions"><button type="button" class="btn-cancel" @click="showModal = false">Batal</button><button type="submit" class="btn-primary">{{ editMode ? 'Simpan' : 'Tambah' }}</button></div>
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
.table-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 280px; color: var(--text-primary); }
.search-input:focus { outline: none; border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.major-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(212,192,137,0.2); color: var(--orange); font-weight: var(--font-medium); }
.action-cell { display: flex; gap: 4px; justify-content: flex-end; }
.action-btn { background: none; border: none; cursor: pointer; padding: 4px 6px; border-radius: 4px; font-size: 14px; transition: background 0.2s; }
.action-btn:hover { background: var(--bg-hover); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.text-right { text-align: right; }
</style>
