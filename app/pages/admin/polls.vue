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
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">{{ ui.t('menu.polls') }}</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">{{ op.polls.length }} total voting</p>
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
            <span class="poll-status-badge" :class="poll.active ? 'badge-active' : 'badge-done'">{{ poll.active ? 'Berlangsung' : 'Selesai' }}</span>
          </div>
          <span class="poll-date">{{ poll.endDate }}</span>
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
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.filter-btn { padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border-light); background: white; font-size: var(--text-sm); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.filter-btn.active { background: var(--olive-primary); color: white; border-color: var(--olive-primary); }
.polls-list { display: flex; flex-direction: column; gap: 12px; }
.poll-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px 20px; }
.poll-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.poll-ekskul-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.ekskul-logo-chip { display: inline-flex; align-items: center; gap: 4px; }
.ekskul-logo-img { width: 16px; height: 16px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.poll-status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); }
.badge-active { background: rgba(74,158,158,0.15); color: var(--teal); }
.badge-done { background: rgba(212,106,90,0.15); color: var(--red-orange); }
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
</style>
