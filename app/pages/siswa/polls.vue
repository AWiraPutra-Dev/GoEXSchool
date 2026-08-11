<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const siswa = useSiswaDataStore()

const selectedVote = ref<Record<string, string>>({})
const showResult = ref<Record<string, boolean>>({})
const filter = ref('all')

async function vote(pollId: string) {
  const poll = siswa.polls.find(p => p.id === pollId)
  if (!poll || poll.myVote || !selectedVote.value[pollId]) return
  await siswa.votePoll(pollId, selectedVote.value[pollId])
  poll.myVote = selectedVote.value[pollId]
  const opt = poll.options.find(o => o.id === selectedVote.value[pollId])
  if (opt) opt.votes++
  showResult.value[pollId] = true
}

function toggleResult(pollId: string) { showResult.value[pollId] = !showResult.value[pollId] }
function totalVotes(poll: any) { return poll.options.reduce((sum: number, o: any) => sum + o.votes, 0) }
function getPercentage(poll: any, votes: number) { const t = totalVotes(poll); return t ? ((votes / t) * 100) : 0 }

const filteredPolls = computed(() => {
  if (filter.value === 'all') return siswa.polls
  if (filter.value === 'active') return siswa.polls.filter(p => p.active)
  return siswa.polls.filter(p => !p.active)
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">Voting</h1>
      <div class="flex gap-2">
        <button class="filter-btn" :class="{ active: filter === 'all' }" @click="filter = 'all'">Semua</button>
        <button class="filter-btn" :class="{ active: filter === 'active' }" @click="filter = 'active'">Aktif</button>
        <button class="filter-btn" :class="{ active: filter === 'done' }" @click="filter = 'done'">Selesai</button>
      </div>
    </div>

    <div class="polls-list">
      <div v-for="poll in filteredPolls" :key="poll.id" class="poll-card" :class="{ 'poll-voted': poll.myVote }">
        <div class="poll-header">
          <div class="flex items-center gap-2">
            <span class="poll-ekskul-badge">{{ poll.ekskul }}</span>
            <span class="poll-status-badge" :class="poll.active ? 'badge-active' : 'badge-done'">{{ poll.active ? 'Berlangsung' : 'Selesai' }}</span>
          </div>
          <span class="poll-date">Berakhir {{ poll.endDate }}</span>
        </div>
        <h3 class="poll-question">{{ poll.question }}</h3>

        <div class="poll-options" v-if="poll.active && !poll.myVote">
          <label v-for="opt in poll.options" :key="opt.id" class="poll-option" :class="{ selected: selectedVote[poll.id] === opt.id }">
            <input type="radio" :name="'poll-' + poll.id" :value="opt.id" v-model="selectedVote[poll.id]" class="poll-radio">
            <span class="poll-option-label">{{ opt.label }}</span>
          </label>
        </div>

        <div v-if="(!poll.active || poll.myVote) && showResult[poll.id] !== false" class="poll-results">
          <div v-for="opt in poll.options" :key="opt.id" class="poll-result-item">
            <div class="result-label-row">
              <span class="result-label">{{ opt.label }}</span>
              <span class="result-stats">{{ opt.votes }} suara ({{ Math.round(getPercentage(poll, opt.votes)) }}%)</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" :style="{ width: getPercentage(poll, opt.votes) + '%', background: poll.myVote === opt.id ? 'var(--olive-primary)' : 'var(--teal)' }"></div></div>
          </div>
          <p class="poll-total">Total {{ totalVotes(poll) }} suara</p>
        </div>

        <div class="poll-actions">
          <template v-if="poll.active && !poll.myVote">
            <button class="btn-primary" :disabled="!selectedVote[poll.id]" @click="vote(poll.id)"><Icon name="i-lucide-check" class="w-4 h-4" /> Kirim Suara</button>
          </template>
          <template v-else-if="poll.myVote">
            <div class="voted-badge"><Icon name="i-lucide-check-circle" class="w-4 h-4" /> Kamu memilih: <strong>{{ poll.options.find(o => o.id === poll.myVote)?.label }}</strong></div>
            <button class="btn-outline" @click="toggleResult(poll.id)"><Icon :name="showResult[poll.id] ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-4 h-4" /> {{ showResult[poll.id] ? 'Sembunyikan' : 'Lihat' }} Hasil</button>
          </template>
          <template v-else>
            <span class="closed-badge">Voting ditutup</span>
            <button v-if="!showResult[poll.id]" class="btn-outline" @click="showResult[poll.id] = true"><Icon name="i-lucide-bar-chart" class="w-4 h-4" /> Lihat Hasil</button>
          </template>
        </div>
      </div>
    </div>

    <div v-if="!filteredPolls.length" class="empty-state">
      <Icon name="i-lucide-vote" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
      <p style="color: var(--text-muted); font-size: var(--text-sm);">Belum ada voting.</p>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.filter-btn { padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border-light); background: white; font-size: var(--text-sm); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.filter-btn.active { background: var(--olive-primary); color: white; border-color: var(--olive-primary); }
.filter-btn:hover:not(.active) { background: var(--bg-hover); }
.polls-list { display: flex; flex-direction: column; gap: 16px; }
.poll-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; padding: 20px 24px; transition: all 0.2s; }
.poll-card:hover { border-color: var(--olive-light); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.poll-voted { border-left: 3px solid var(--olive-primary); }
.poll-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
.poll-ekskul-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.poll-status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); }
.badge-active { background: rgba(74,158,158,0.15); color: var(--teal); }
.badge-done { background: rgba(212,106,90,0.15); color: var(--red-orange); }
.poll-date { font-size: var(--text-xs); color: var(--text-muted); }
.poll-question { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 16px; }
.poll-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.poll-option { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border: 1.5px solid var(--border-light); border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.poll-option:hover { border-color: var(--olive-light); background: var(--olive-bg); }
.poll-option.selected { border-color: var(--olive-primary); background: rgba(139,148,103,0.06); box-shadow: 0 0 0 3px rgba(139,148,103,0.12); }
.poll-radio { accent-color: var(--olive-primary); width: 18px; height: 18px; flex-shrink: 0; }
.poll-option-label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--text-primary); }
.poll-results { margin-bottom: 16px; }
.poll-result-item { margin-bottom: 12px; }
.result-label-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
.result-label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--text-primary); }
.result-stats { font-size: var(--text-sm); color: var(--text-muted); }
.progress-bar { width: 100%; height: 10px; border-radius: 5px; background: var(--bg-main); overflow: hidden; }
.progress-fill { height: 100%; border-radius: 5px; transition: width 0.8s ease; }
.poll-total { text-align: center; font-size: var(--text-xs); color: var(--text-muted); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-light); }
.poll-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 20px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover:not(:disabled) { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: white; color: var(--text-primary); font-size: var(--text-sm); padding: 8px 14px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { background: var(--bg-hover); }
.voted-badge { display: inline-flex; align-items: center; gap: 6px; font-size: var(--text-sm); color: var(--text-secondary); padding: 6px 12px; background: var(--olive-bg); border-radius: 6px; }
.voted-badge strong { color: var(--olive-primary); }
.closed-badge { font-size: var(--text-sm); color: var(--text-muted); }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
