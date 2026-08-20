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

// ---- Inspect ----
const showInspect = ref(false)
const inspectData = ref<any>(null)
const inspectLoading = ref(false)
const inspectError = ref('')
const inspectPoll = ref<any>(null)

async function openInspect(poll: any) {
  inspectPoll.value = poll
  inspectData.value = null
  inspectError.value = ''
  showInspect.value = true
  inspectLoading.value = true
  try {
    inspectData.value = await $fetch(`/api/operator/polls/${poll.id}/inspect`)
  } catch (e: any) {
    inspectError.value = e?.data?.message || 'Gagal memuat data inspect.'
  } finally {
    inspectLoading.value = false
  }
}
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
            <span class="status-dot" :class="poll.active ? 'active' : 'inactive'">{{ poll.active ? 'Berlangsung' : 'Selesai' }}</span>
          </div>
          <span class="poll-date">{{ poll.endDate }}</span>
        </div>
        <h3 class="poll-question"><TranslatedText :text="poll.question" /></h3>
        <div class="poll-stats">Total {{ poll.options.reduce((s, o) => s + o.votes, 0) }} suara · {{ poll.options.length }} opsi</div>
        <div class="poll-admin-actions">
          <button class="btn-inspect" @click="openInspect(poll)">
            <Icon name="i-lucide-users" class="w-3.5 h-3.5" /> Inspect
          </button>
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

    <!-- Modal Inspect -->
    <Teleport to="body">
      <div v-if="showInspect" class="modal-overlay" @click.self="showInspect = false">
        <div class="modal-content" style="width: 640px;">
          <div class="inspect-head">
            <div>
              <h3 class="modal-title">Inspect Voting</h3>
              <p class="modal-sub" v-if="inspectPoll">{{ inspectPoll.question }}</p>
            </div>
            <button class="modal-close" @click="showInspect = false"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
          </div>

          <div v-if="inspectLoading" class="inspect-loading">
            <div class="loading-shimmer" style="width:100%;height:120px;border-radius:8px;"></div>
          </div>
          <p v-else-if="inspectError" class="inspect-error">{{ inspectError }}</p>
          <template v-else-if="inspectData">
            <div class="inspect-summary">
              <div class="inspect-stat">
                <span class="inspect-stat-value">{{ inspectData.totalMembers }}</span>
                <span class="inspect-stat-label">Total Anggota</span>
              </div>
              <div class="inspect-stat voted">
                <span class="inspect-stat-value">{{ inspectData.totalVoted }}</span>
                <span class="inspect-stat-label">Sudah Vote</span>
              </div>
              <div class="inspect-stat not-voted">
                <span class="inspect-stat-value">{{ inspectData.totalNotVoted }}</span>
                <span class="inspect-stat-label">Belum Vote</span>
              </div>
            </div>

            <div class="inspect-classes">
              <div v-for="cls in inspectData.classes" :key="cls.className" class="inspect-class">
                <div class="inspect-class-header">
                  <span class="inspect-class-name">Kelas {{ cls.className }}</span>
                  <span class="inspect-class-count">
                    <span class="inspect-dot voted-dot"></span> {{ cls.voted }} vote
                    <span class="inspect-dot not-voted-dot"></span> {{ cls.notVoted }} belum
                  </span>
                </div>
                <div class="inspect-students">
                  <div v-for="s in cls.students" :key="s.studentId" class="inspect-student" :class="{ 'not-voted-student': !s.voted }">
                    <span class="inspect-student-dot" :class="s.voted ? 'dot-voted' : 'dot-pending'"></span>
                    <span class="inspect-student-name">{{ s.name }}</span>
                    <span class="inspect-student-nis">{{ s.nis }}</span>
                    <span v-if="s.voted" class="inspect-check"><Icon name="i-lucide-check" class="w-3.5 h-3.5" /></span>
                    <span v-else class="inspect-pending"><Icon name="i-lucide-minus" class="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </div>
              <div v-if="!inspectData.classes.length" class="inspect-empty">
                <Icon name="i-lucide-users" class="w-8 h-8" style="color: var(--text-muted);" />
                <p>Belum ada anggota ekskul ini.</p>
              </div>
            </div>
          </template>
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
.filter-btn.active { background: var(--olive-bg); color: var(--olive-primary); border-color: var(--olive-primary); }
.filter-btn:hover:not(.active) { background: var(--bg-hover); }
.polls-admin-list { display: flex; flex-direction: column; gap: 12px; }
.poll-admin-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px 20px; }
.poll-admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.poll-ekskul-badge { font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted); font-weight: var(--font-medium); }
.ekskul-logo-chip { display: inline-flex; align-items: center; gap: 4px; }
.ekskul-logo-img { width: 16px; height: 16px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.poll-date { font-size: var(--text-xs); color: var(--text-muted); }
.poll-question { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.poll-stats { font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 12px; }
.poll-admin-actions { display: flex; gap: 8px; }
.btn-toggle-status, .btn-delete { font-size: var(--text-sm); padding: 6px 14px; border-radius: 6px; border: 1px solid; cursor: pointer; font-family: var(--font-family); background: transparent; }
.btn-close { color: var(--red-orange); border-color: var(--red-orange); }
.btn-close:hover { background: rgba(212,106,90,0.08); }
.btn-open { color: var(--teal); border-color: var(--teal); }
.btn-open:hover { background: rgba(74,158,158,0.08); }
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
.scope-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: var(--olive-bg); color: var(--olive-primary); border: 1px solid var(--olive-light); border-radius: 4px; font-size: var(--text-sm); font-weight: var(--font-semibold); }
.scope-warning { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: #fef2f2; color: var(--red-orange); border: 1px solid #fecaca; border-radius: 4px; font-size: var(--text-sm); font-weight: var(--font-medium); }

/* Opsi dinamis */
.options-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.options-hint { font-size: 11px; color: var(--text-muted); font-weight: var(--font-normal); }
.btn-add-option { display: inline-flex; align-items: center; gap: 5px; font-size: var(--text-xs); font-weight: var(--font-semibold); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--olive-primary); background: transparent; color: var(--olive-primary); cursor: pointer; transition: all 0.2s; }
.btn-add-option:hover:not(:disabled) { background: var(--olive-bg); }
.btn-add-option:disabled { opacity: 0.5; cursor: not-allowed; }
.option-list { display: flex; flex-direction: column; gap: 6px; }
.option-row { display: flex; align-items: center; gap: 8px; }
.option-index { width: 22px; font-size: 11px; font-weight: var(--font-semibold); color: var(--text-muted); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-variant-numeric: tabular-nums; }
.option-remove-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border-light); background: white; color: var(--text-red); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
.option-remove-btn:hover:not(:disabled) { background: rgba(204,68,68,0.08); border-color: var(--red-orange); }
.option-remove-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 12px; }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }

/* Inspect */
.btn-inspect { display: inline-flex; align-items: center; gap: 5px; font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--accent); background: var(--accent-soft, rgba(79,70,229,0.1)); border: 1px solid var(--accent-border, rgba(79,70,229,0.25)); border-radius: 6px; padding: 5px 10px; cursor: pointer; transition: all 0.2s; }
.btn-inspect:hover { background: var(--accent); color: white; }
.inspect-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.modal-sub { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }
.modal-close { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px; border-radius: 6px; }
.modal-close:hover { background: var(--bg-hover); color: var(--text-primary); }
.inspect-loading { padding: 8px 0; }
.inspect-error { color: var(--red-orange); font-size: var(--text-sm); }
.inspect-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px; }
.inspect-stat { text-align: center; padding: 12px; background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 8px; }
.inspect-stat-value { display: block; font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--text-primary); }
.inspect-stat-label { display: block; font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }

.inspect-classes { display: flex; flex-direction: column; gap: 14px; }
.inspect-class { border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; }
.inspect-class-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-main); border-bottom: 1px solid var(--border-light); }
.inspect-class-name { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.inspect-class-count { display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: var(--text-secondary); }
.inspect-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
.voted-dot { background: var(--text-primary); }
.not-voted-dot { background: var(--text-muted); }
.inspect-students { display: flex; flex-direction: column; }
.inspect-student { display: flex; align-items: center; gap: 8px; padding: 8px 14px; font-size: var(--text-sm); border-bottom: 1px solid var(--border-light); }
.inspect-student:last-child { border-bottom: none; }

.inspect-student-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.dot-voted { background: var(--text-primary); }
.dot-pending { background: var(--text-muted); }
.inspect-student-name { font-weight: var(--font-medium); color: var(--text-primary); flex: 1; min-width: 0; }
.inspect-student-nis { font-size: var(--text-xs); color: var(--text-muted); }
.inspect-check { color: var(--text-primary); display: flex; }
.inspect-pending { color: var(--text-muted); display: flex; }
.inspect-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px; color: var(--text-muted); font-size: var(--text-sm); }
</style>
