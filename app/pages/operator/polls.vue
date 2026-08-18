<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const ui = useUiStore()
const admin = useMasterDataStore()
const { myEkskul, isOperator, isScopedOperator } = useEkskulScope()
const { confirm } = useConfirm()
onMounted(() => { op.fetchAll(); admin.fetchReference() })
const showModal = ref(false)
const editMode = ref(false)
const form = reactive({ question: '', extracurricularId: '', endDate: '', options: ['', ''] })

const MIN_OPTIONS = 2
const MAX_OPTIONS = 10

function openAdd() {
  Object.assign(form, { question: '', extracurricularId: '', endDate: '', options: ['', ''] })
  // Operator ekskul: voting otomatis untuk ekskul miliknya
  if (isScopedOperator.value && myEkskul.value) form.extracurricularId = myEkskul.value.id
  showModal.value = true
}

function addOption() {
  if (form.options.length >= MAX_OPTIONS) return
  form.options.push('')
}

function removeOption(index: number) {
  if (form.options.length <= MIN_OPTIONS) return
  form.options.splice(index, 1)
}

function save() {
  const options = form.options.map(o => o.trim()).filter(Boolean)
  if (options.length < MIN_OPTIONS) {
    alert(`Minimal ${MIN_OPTIONS} opsi wajib diisi.`)
    return
  }
  op.addPoll({ question: form.question, options, extracurricularId: form.extracurricularId, endDate: form.endDate })
  showModal.value = false
}
async function removePoll(poll: any) {
  const ok = await confirm({
    title: `Hapus voting "${poll.question}"?`,
    message: 'Voting beserta semua suara di dalamnya akan dihapus permanen.',
    confirmText: 'Ya, Hapus',
    danger: true,
  })
  if (!ok) return
  op.deletePoll(poll.id)
}

const filter = ref('all')
const filteredPolls = computed(() => {
  if (filter.value === 'all') return op.polls
  if (filter.value === 'active') return op.polls.filter(p => p.active)
  return op.polls.filter(p => !p.active)
})
const { page, paged, totalPages } = usePagination(() => filteredPolls.value)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">{{ ui.t('menu.polls') }}</h1>
      <div class="flex gap-2">
        <button class="filter-btn" :class="{ active: filter === 'all' }" @click="filter = 'all'">Semua</button>
        <button class="filter-btn" :class="{ active: filter === 'active' }" @click="filter = 'active'">Aktif</button>
        <button class="filter-btn" :class="{ active: filter === 'done' }" @click="filter = 'done'">Selesai</button>
        <button class="btn-primary" @click="openAdd"><Icon name="i-lucide-plus" class="w-4 h-4" /> Buat Voting</button>
      </div>
    </div>

    <div class="polls-admin-list">
      <div v-for="poll in paged" :key="poll.id" class="poll-admin-card">
        <div class="poll-admin-header">
          <div class="flex items-center gap-2">
            <span v-if="poll.ekskulLogo" class="poll-ekskul-badge ekskul-logo-chip">
              <img :src="poll.ekskulLogo" class="ekskul-logo-img" alt="" />
              {{ poll.ekskul }}
            </span>
            <span v-else class="poll-ekskul-badge">{{ poll.ekskul }}</span>
            <span class="poll-status-badge" :class="poll.active ? 'badge-active' : 'badge-done'">{{ poll.active ? 'Berlangsung' : 'Selesai' }}</span>
          </div>
          <span class="poll-date">{{ poll.endDate }}</span>
        </div>
        <h3 class="poll-question"><TranslatedText :text="poll.question" /></h3>
        <div class="poll-stats">Total {{ poll.options.reduce((s, o) => s + o.votes, 0) }} suara · {{ poll.options.length }} opsi</div>
        <div class="poll-admin-actions">
          <button class="btn-toggle-status" :class="poll.active ? 'btn-close' : 'btn-open'" @click="op.updatePoll(poll.id)">
            {{ poll.active ? 'Tutup Voting' : 'Buka Voting' }}
          </button>
          <button class="btn-delete" @click="removePoll(poll)">Hapus</button>
        </div>
      </div>
      <div v-if="!filteredPolls.length" class="empty-state">
        <Icon name="i-lucide-vote" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
        <p style="color: var(--text-muted); font-size: var(--text-sm);">Belum ada voting. Buat voting untuk ekskul Anda.</p>
      </div>
    </div>
    <PaginationBar v-model:page="page" :total="filteredPolls.length" />

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content" style="width:520px;">
          <h3 class="modal-title">Buat Voting Baru</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div class="form-group"><label>Pertanyaan</label><input v-model="form.question" class="form-input" required placeholder="Contoh: Pilih ketua ekskul..."></div>
            <div class="form-row">
              <div class="form-group">
                <label>Ekskul</label>
                <select v-if="!isOperator" v-model="form.extracurricularId" class="form-input" required><option disabled value="">Pilih Ekskul</option><option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option></select>
                <div v-else-if="myEkskul" class="scope-badge"><Icon name="i-lucide-shield" class="w-4 h-4" /> {{ myEkskul.name }}</div>
                <div v-else class="scope-warning"><Icon name="i-lucide-alert-circle" class="w-4 h-4" /> Akun belum diikat ke ekskul. Hubungi admin.</div>
              </div>
              <div class="form-group"><label>Berakhir</label><input v-model="form.endDate" type="date" class="form-input" required></div>
            </div>

            <div class="form-group">
              <div class="options-header">
                <label>Opsi Pilihan <span class="options-hint">min. {{ MIN_OPTIONS }} · maks. {{ MAX_OPTIONS }}</span></label>
                <button type="button" class="btn-add-option" :disabled="form.options.length >= MAX_OPTIONS" @click="addOption">
                  <Icon name="i-lucide-plus" class="w-3.5 h-3.5" /> Tambah Opsi
                </button>
              </div>
              <div class="option-list">
                <div v-for="(opt, i) in form.options" :key="i" class="option-row">
                  <span class="option-index">{{ i + 1 }}</span>
                  <input v-model="form.options[i]" class="form-input" :required="i < MIN_OPTIONS" :placeholder="`Opsi ${i + 1}`">
                  <button type="button" class="option-remove-btn" :disabled="form.options.length <= MIN_OPTIONS" title="Hapus opsi" @click="removeOption(i)">
                    <Icon name="i-lucide-x" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

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
.filter-btn { padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border-light); background: white; font-size: var(--text-sm); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.filter-btn.active { background: var(--olive-primary); color: white; border-color: var(--olive-primary); }
.filter-btn:hover:not(.active) { background: var(--bg-hover); }
.polls-admin-list { display: flex; flex-direction: column; gap: 12px; }
.poll-admin-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px 20px; }
.poll-admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.poll-ekskul-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.ekskul-logo-chip { display: inline-flex; align-items: center; gap: 4px; }
.ekskul-logo-img { width: 16px; height: 16px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
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
.modal-content { background: white; border-radius: 12px; padding: 24px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-group { margin-bottom: 8px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.scope-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: var(--olive-bg); color: var(--olive-primary); border: 1px solid var(--olive-light); border-radius: 6px; font-size: var(--text-sm); font-weight: var(--font-semibold); }
.scope-warning { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: #fef2f2; color: var(--red-orange); border: 1px solid #fecaca; border-radius: 6px; font-size: var(--text-sm); font-weight: var(--font-medium); }

/* Opsi dinamis */
.options-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.options-hint { font-size: 11px; color: var(--text-muted); font-weight: var(--font-normal); }
.btn-add-option { display: inline-flex; align-items: center; gap: 5px; font-size: var(--text-xs); font-weight: var(--font-semibold); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--olive-primary); background: var(--olive-bg); color: var(--olive-primary); cursor: pointer; transition: all 0.2s; }
.btn-add-option:hover:not(:disabled) { background: var(--olive-primary); color: white; }
.btn-add-option:disabled { opacity: 0.5; cursor: not-allowed; }
.option-list { display: flex; flex-direction: column; gap: 6px; }
.option-row { display: flex; align-items: center; gap: 8px; }
.option-index { width: 22px; height: 22px; border-radius: 50%; background: var(--olive-primary); color: white; font-size: 11px; font-weight: var(--font-bold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.option-remove-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border-light); background: white; color: var(--text-red); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
.option-remove-btn:hover:not(:disabled) { background: rgba(204,68,68,0.08); border-color: var(--red-orange); }
.option-remove-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 12px; }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
