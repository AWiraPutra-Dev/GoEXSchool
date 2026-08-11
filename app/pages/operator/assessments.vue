<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const admin = useMasterDataStore()
const selectedEkskul = ref('Semua')
const search = ref('')
const showModal = ref(false)
const editMode = ref(false)
const editId = ref('')
const form = reactive({ studentId: '', extracurricularId: '', score: 75, notes: '' })

const ekskulList = computed(() => {
  const names = [...new Set(op.assessments.map(a => a.ekskul))]
  return ['Semua', ...names]
})

const filtered = computed(() => {
  let result = op.assessments
  if (selectedEkskul.value !== 'Semua') result = result.filter(a => a.ekskul === selectedEkskul.value)
  if (search.value) result = result.filter(a => a.student.toLowerCase().includes(search.value.toLowerCase()))
  return result
})

function openAdd() {
  editMode.value = false; editId.value = ''
  form.studentId = ''; form.extracurricularId = ''; form.score = 75; form.notes = ''
  showModal.value = true
}

function openEdit(a: any) {
  editMode.value = true; editId.value = a.id
  form.studentId = a.studentId; form.extracurricularId = a.ekskulId; form.score = a.score; form.notes = a.notes
  showModal.value = true
}

async function save() {
  try {
    if (editMode.value) {
      await op.updateAssessment(editId.value, { score: form.score, notes: form.notes })
    } else {
      await op.addAssessment({ studentId: form.studentId, extracurricularId: form.extracurricularId, score: form.score, notes: form.notes })
    }
    showModal.value = false
  } catch (e: any) {
    alert(e.data?.message || 'Gagal menyimpan')
  }
}

async function removeAssessment(id: string) {
  if (confirm('Hapus penilaian ini?')) await op.deleteAssessment(id)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">Penilaian</h1>
      <button class="btn-primary" @click="openAdd"><Icon name="i-lucide-plus" class="w-4 h-4" /> Input Nilai</button>
    </div>
    <div class="table-card">
      <div class="table-toolbar">
        <div class="flex gap-3 items-center">
          <select v-model="selectedEkskul" class="filter-select"><option v-for="e in ekskulList" :key="e">{{ e }}</option></select>
          <input v-model="search" type="text" placeholder="Cari siswa..." class="search-input">
        </div>
        <span class="text-[11px]" style="color: var(--text-muted);">{{ filtered.length }} data</span>
      </div>
      <table class="data-table">
        <thead><tr><th>Siswa</th><th>Ekskul</th><th>Nilai</th><th>Grade</th><th>Catatan</th><th>Tanggal</th><th class="text-right">Aksi</th></tr></thead>
        <tbody>
          <tr v-for="a in filtered" :key="a.id">
            <td class="font-semibold">{{ a.student }}</td>
            <td><span class="ekskul-tag">{{ a.ekskul }}</span></td>
            <td class="text-center font-bold text-[16px]" :style="{ color: a.score >= 85 ? 'var(--teal)' : a.score >= 70 ? 'var(--orange)' : 'var(--red-orange)' }">{{ a.score }}</td>
            <td><span class="grade-badge" :class="a.score >= 80 ? 'grade-high' : 'grade-mid'">{{ a.grade }}</span></td>
            <td style="color: var(--text-secondary); font-size: var(--text-sm);">{{ a.notes }}</td>
            <td style="color: var(--text-muted); font-size: var(--text-sm);">{{ a.date }}</td>
            <td class="text-right action-cell">
              <button class="action-btn" @click="openEdit(a)" title="Edit">✏️</button>
              <button class="action-btn" @click="removeAssessment(a.id)" title="Hapus" style="color: var(--text-red);">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h3 class="modal-title">{{ editMode ? 'Edit Nilai' : 'Input Nilai Baru' }}</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div v-if="!editMode" class="form-row">
              <div class="form-group"><label>Siswa</label><select v-model="form.studentId" class="form-input" required><option disabled value="">Pilih Siswa</option><option v-for="s in admin.students" :key="s.id" :value="s.id">{{ s.name }} ({{ s.nis }})</option></select></div>
              <div class="form-group"><label>Ekskul</label><select v-model="form.extracurricularId" class="form-input" required><option disabled value="">Pilih Ekskul</option><option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option></select></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Nilai (0-100)</label><input v-model.number="form.score" type="number" min="0" max="100" class="form-input" required></div>
              <div class="form-group"><label>Grade Otomatis</label><input :value="form.score >= 85 ? 'A' : form.score >= 80 ? 'A-' : form.score >= 75 ? 'B+' : form.score >= 70 ? 'B' : 'C'" disabled class="form-input" style="background: var(--bg-main);"></div>
            </div>
            <div class="form-group"><label>Catatan</label><textarea v-model="form.notes" class="form-input" rows="2"></textarea></div>
            <div class="modal-actions"><button type="button" class="btn-cancel" @click="showModal = false">Batal</button><button type="submit" class="btn-primary">{{ editMode ? 'Simpan' : 'Simpan' }}</button></div>
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
