<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const ui = useUiStore()
onMounted(() => op.fetchAll())
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
    inspectData.value = await $fetch(`/api/admin/polls/${poll.id}/inspect`)
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
      <div>
        <h1 class="page-title">{{ ui.t('menu.polls') }}</h1>
        <p class="text-[12px]" style="color: var(--text-secondary);">{{ op.polls.length }} total voting</p>
      </div>
      <div class="flex gap-2">
        <button class="filter-btn" :class="{ active: filter === 'all' }" @click="filter = 'all'">Semua</button>
        <button class="filter-btn" :class="{ active: filter === 'active' }" @click="filter = 'active'">Aktif</button>
        <button class="filter-btn" :class="{ active: filter === 'done' }" @click="filter = 'done'">Selesai</button>
      </div>
    </div>

    <div class="polls-list">
      <div v-for="poll in paged" :key="poll.id" class="poll-card">
        <div class="poll-header">
          <div class="flex items-center gap-2">
            <span v-if="poll.ekskulLogo" class="poll-ekskul-badge ekskul-logo-chip">
              <img :src="poll.ekskulLogo" class="ekskul-logo-img" alt="" />
              {{ poll.ekskul }}
            </span>
            <span v-else class="poll-ekskul-badge">{{ poll.ekskul }}</span>
            <span class="status-dot" :class="poll.active ? 'active' : 'inactive'">{{ poll.active ? 'Berlangsung' : 'Selesai' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="poll-date">{{ poll.endDate }}</span>
            <button class="btn-inspect" @click="openInspect(poll)">
              <Icon name="i-lucide-users" class="w-3.5 h-3.5" /> Inspect
            </button>
          </div>
        </div>
        <h3 class="poll-question"><TranslatedText :text="poll.question" /></h3>
        <div class="poll-results">
          <div v-for="opt in poll.options" :key="opt.label" class="poll-result-item">
            <div class="result-label-row">
              <span class="result-label">{{ opt.label }}</span>
              <span class="result-stats">{{ opt.votes }} suara</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" :style="{ width: (poll.options.reduce((s, o) => s + o.votes, 0) ? (opt.votes / poll.options.reduce((s, o) => s + o.votes, 0)) * 100 : 0) + '%' }"></div></div>
          </div>
          <p class="poll-total">Total {{ poll.options.reduce((s, o) => s + o.votes, 0) }} suara</p>
        </div>
      </div>
      <div v-if="!filteredPolls.length" class="empty-state">
        <Icon name="i-lucide-vote" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
        <p style="color: var(--text-muted); font-size: var(--text-sm);">Belum ada voting.</p>
      </div>
    </div>
    <PaginationBar v-model:page="page" :total="filteredPolls.length" />

    <!-- Modal Inspect -->
    <Teleport to="body">
      <div v-if="showInspect" class="modal-overlay" @click.self="showInspect = false">
        <div class="modal-content" style="width: 640px;">
          <div class="modal-head">
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
            <!-- Ringkasan -->
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

            <!-- Per kelas -->
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
                  <div v-for="s in cls.students" :key="s.studentId" class="inspect-student" :class="{ 'is-voted': s.voted, 'not-voted': !s.voted }">
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
.filter-btn { padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border-light); background: white; font-size: var(--text-sm); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.filter-btn.active { background: var(--olive-primary); color: white; border-color: var(--olive-primary); }
.polls-list { display: flex; flex-direction: column; gap: 12px; }
.poll-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px 20px; }
.poll-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.poll-ekskul-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 4px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.ekskul-logo-chip { display: inline-flex; align-items: center; gap: 4px; }
.ekskul-logo-img { width: 16px; height: 16px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.poll-date { font-size: var(--text-xs); color: var(--text-muted); }
.poll-question { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 12px; }
.poll-results { margin-bottom: 8px; }
.poll-result-item { margin-bottom: 8px; }
.result-label-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
.result-label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--text-primary); }
.result-stats { font-size: var(--text-sm); color: var(--text-muted); }
.progress-bar { width: 100%; height: 8px; border-radius: 4px; background: var(--bg-main); overflow: hidden; }
.progress-fill { height: 100%; border-radius: 4px; background: var(--olive-primary); transition: width 0.5s ease; }
.poll-total { font-size: var(--text-xs); color: var(--text-muted); text-align: center; margin-top: 8px; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }

/* Inspect button */
.btn-inspect { display: inline-flex; align-items: center; gap: 5px; font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--accent); background: var(--accent-soft, rgba(79,70,229,0.1)); border: 1px solid var(--accent-border, rgba(79,70,229,0.25)); border-radius: 6px; padding: 5px 10px; cursor: pointer; transition: all 0.2s; }
.btn-inspect:hover { background: var(--accent); color: white; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { background: var(--bg-card); border-radius: 14px; padding: 24px; max-width: 95vw; max-height: 92vh; overflow-y: auto; }
.modal-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.modal-sub { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }
.modal-close { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px; border-radius: 6px; }
.modal-close:hover { background: var(--bg-hover); color: var(--text-primary); }
.inspect-loading { padding: 8px 0; }
.inspect-error { color: var(--red-orange); font-size: var(--text-sm); }

/* Ringkasan */
.inspect-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px; }
.inspect-stat { text-align: center; padding: 12px; background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 8px; }
.inspect-stat-value { display: block; font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--text-primary); }
.inspect-stat-label { display: block; font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }


/* Kelas */
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
