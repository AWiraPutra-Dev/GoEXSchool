<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const admin = useMasterDataStore()
const showModal = ref(false)
const editMode = ref(false)
const form = reactive({ question: '', extracurricularId: '', endDate: '', option1: '', option2: '', option3: '' })

function openAdd() { Object.assign(form, { question: '', extracurricularId: '', endDate: '', option1: '', option2: '', option3: '' }); showModal.value = true }
function save() {
  const options = [form.option1]
  if (form.option2) options.push(form.option2)
  if (form.option3) options.push(form.option3)
  op.addPoll({ question: form.question, options, extracurricularId: form.extracurricularId, endDate: form.endDate })
  showModal.value = false
}
function removePoll(id: string) { if (confirm('Hapus voting ini?')) op.deletePoll(id) }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">Voting</h1>
      <button class="btn-primary" @click="openAdd"><Icon name="i-lucide-plus" class="w-4 h-4" /> Buat Voting</button>
    </div>

    <div class="polls-admin-list">
      <div v-for="poll in op.polls" :key="poll.id" class="poll-admin-card">
        <div class="poll-admin-header">
          <div class="flex items-center gap-2">
            <span class="poll-ekskul-badge">{{ poll.ekskul }}</span>
            <span class="poll-status-badge" :class="poll.active ? 'badge-active' : 'badge-done'">{{ poll.active ? 'Berlangsung' : 'Selesai' }}</span>
          </div>
          <span class="poll-date">{{ poll.endDate }}</span>
        </div>
        <h3 class="poll-question">{{ poll.question }}</h3>
        <div class="poll-stats">Total {{ poll.options.reduce((s, o) => s + o.votes, 0) }} suara · {{ poll.options.length }} opsi</div>
        <div class="poll-admin-actions">
          <button class="btn-toggle-status" :class="poll.active ? 'btn-close' : 'btn-open'" @click="op.updatePoll(poll.id)">
            {{ poll.active ? 'Tutup Voting' : 'Buka Voting' }}
          </button>
          <button class="btn-delete" @click="removePoll(poll.id)">Hapus</button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content" style="width:500px;">
          <h3 class="modal-title">Buat Voting Baru</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div class="form-group"><label>Pertanyaan</label><input v-model="form.question" class="form-input" required placeholder="Contoh: Pilih ketua ekskul..."></div>
            <div class="form-row">
              <div class="form-group"><label>Ekskul</label><select v-model="form.extracurricularId" class="form-input" required><option disabled value="">Pilih Ekskul</option><option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option></select></div>
              <div class="form-group"><label>Berakhir</label><input v-model="form.endDate" type="date" class="form-input" required></div>
            </div>
            <div class="form-group"><label>Opsi 1</label><input v-model="form.option1" class="form-input" required placeholder="Opsi pertama"></div>
            <div class="form-group"><label>Opsi 2</label><input v-model="form.option2" class="form-input" placeholder="Opsi kedua (opsional)"></div>
            <div class="form-group"><label>Opsi 3</label><input v-model="form.option3" class="form-input" placeholder="Opsi ketiga (opsional)"></div>
            <div class="modal-actions"><button type="button" class="btn-cancel" @click="showModal = false">Batal</button><button type="submit" class="btn-primary">Buat Voting</button></div>
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
.polls-admin-list { display: flex; flex-direction: column; gap: 12px; }
.poll-admin-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px 20px; }
.poll-admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.poll-ekskul-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.poll-status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); }
.badge-active { background: rgba(74,158,158,0.15); color: var(--teal); }
.badge-done { background: rgba(212,106,90,0.15); color: var(--red-orange); }
.poll-date { font-size: var(--text-xs); color: var(--text-muted); }
.poll-question { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.poll-stats { font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 12px; }
.poll-admin-actions { display: flex; gap: 8px; }
.btn-toggle-status, .btn-delete { font-size: var(--text-sm); padding: 6px 14px; border-radius: 6px; border: 1px solid; cursor: pointer; font-family: var(--font-family); }
.btn-close { background: rgba(212,106,90,0.1); color: var(--red-orange); border-color: var(--red-orange); }
.btn-close:hover { background: rgba(212,106,90,0.2); }
.btn-open { background: rgba(74,158,158,0.1); color: var(--teal); border-color: var(--teal); }
.btn-open:hover { background: rgba(74,158,158,0.2); }
.btn-delete { background: white; color: var(--text-red); border-color: var(--border-light); }
.btn-delete:hover { background: rgba(204,68,68,0.05); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-group { margin-bottom: 8px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 12px; }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
</style>
