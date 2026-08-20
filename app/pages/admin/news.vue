<script setup lang="ts">
import type { NewsItem } from '~/stores/operator-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const ui = useUiStore()
const { confirm } = useConfirm()
const activeTab = ref<'all' | 'pending' | 'approved' | 'rejected'>('pending')
const loading = ref(false)

async function loadNews() {
  loading.value = true
  try {
    op.news = await $fetch<NewsItem[]>('/api/admin/news')
  } finally {
    loading.value = false
  }
}
onMounted(loadNews)

const filteredNews = computed(() => {
  if (activeTab.value === 'all') return op.news
  return op.news.filter((n: any) => n.displayStatus === activeTab.value)
})

const counts = computed(() => ({
  all: op.news.length,
  pending: op.news.filter((n: any) => n.displayStatus === 'pending').length,
  approved: op.news.filter((n: any) => n.displayStatus === 'approved').length,
  rejected: op.news.filter((n: any) => n.displayStatus === 'rejected').length,
}))

const { page, paged, totalPages } = usePagination(() => filteredNews.value)

async function approve(n: NewsItem) {
  const ok = await confirm({
    title: ui.t('news.approveConfirm', { title: n.title }),
    message: ui.t('news.approveMessage'),
    confirmText: ui.t('confirm.yesApprove'),
  })
  if (!ok) return
  await op.setNewsDisplay(n.id, 'approved')
}

async function reject(n: NewsItem) {
  const ok = await confirm({
    title: ui.t('news.rejectConfirm', { title: n.title }),
    message: ui.t('news.rejectMessage'),
    confirmText: ui.t('confirm.yesReject'),
    danger: true,
  })
  if (!ok) return
  await op.setNewsDisplay(n.id, 'rejected')
}

async function revoke(n: NewsItem) {
  const ok = await confirm({
    title: ui.t('news.revokeConfirm', { title: n.title }),
    message: ui.t('news.revokeMessage'),
    confirmText: ui.t('confirm.yesStop'),
    danger: true,
  })
  if (!ok) return
  await op.setNewsDisplay(n.id, 'none')
}

const displayLabels = computed(() => ({
  none: ui.t('news.noDisplay'),
  pending: ui.t('news.waitingApproval'),
  approved: ui.t('news.currentlyDisplaying'),
  rejected: ui.t('news.displayRejected'),
}))
const displayClass: Record<string, string> = {
  none: 'disp-none',
  pending: 'disp-pending',
  approved: 'disp-approved',
  rejected: 'disp-rejected',
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="page-title">{{ ui.t('menu.news') }} · Event Board</h1>
      <p class="text-[13px]" style="color: var(--text-secondary);">
        {{ ui.t('news.manageDesc') }}
      </p>
    </div>

    <!-- Tab Status -->
    <div class="tab-bar">
      <button v-for="tab in [['all', ui.t('news.all')], ['pending', ui.t('news.needsApproval')], ['approved', ui.t('news.displaying')], ['rejected', ui.t('news.rejected')]]" :key="tab[0]"
        class="tab-btn" :class="{ active: activeTab === tab[0] }" @click="activeTab = tab[0] as any; page = 1">
        {{ tab[1] }}
        <span class="tab-count" :class="tab[0] === 'pending' && counts.pending > 0 ? 'tab-count-alert' : ''">{{ counts[tab[0] as keyof typeof counts] }}</span>
      </button>
    </div>

    <!-- Info banner pengajuan baru -->
    <div v-if="counts.pending > 0 && activeTab === 'pending'" class="pending-banner">
      <Icon name="i-lucide-bell-ring" class="w-4 h-4" />
      <span>{{ ui.t('news.pendingBanner', { count: counts.pending }) }}</span>
    </div>

    <div class="news-list">
      <div v-for="n in paged" :key="n.id" class="news-card" :class="{ 'news-card-pending': n.displayStatus === 'pending' }">
        <div class="news-top">
          <div class="news-meta">
            <span class="news-ekskul">
              <img v-if="n.ekskulLogo" :src="n.ekskulLogo" class="ekskul-logo-img" alt="" />
              {{ n.ekskul }}
            </span>
            <span class="scope-dot" :class="n.isPublic ? 'public' : 'internal'">{{ n.isPublic ? ui.t('common.public') : ui.t('common.internal') }}</span>
            <span class="news-badge" :class="displayClass[n.displayStatus || 'none']">
              <Icon v-if="n.displayStatus === 'pending'" name="i-lucide-clock" class="w-3 h-3" />
              <Icon v-else-if="n.displayStatus === 'approved'" name="i-lucide-check-circle" class="w-3 h-3" />
              <Icon v-else-if="n.displayStatus === 'rejected'" name="i-lucide-x-circle" class="w-3 h-3" />
              {{ displayLabels[n.displayStatus || 'none'] }}
            </span>
          </div>
        </div>
        <div v-if="n.coverImage" class="news-cover-wrap">
          <img :src="n.coverImage" :alt="n.title" class="news-cover-img" loading="lazy" />
        </div>
        <h3 class="news-title"><TranslatedText :text="n.title" /></h3>
        <p class="news-content"><TranslatedText :text="n.content" strip-html /></p>
        <div class="news-footer">
          <span class="news-uploader"><Icon name="i-lucide-user" class="w-3 h-3" /> {{ n.author }} · {{ n.date }}</span>
          <div class="news-actions">
            <!-- Tombol keputusan admin -->
            <template v-if="n.displayStatus === 'pending'">
              <button class="btn-approve" @click="approve(n)">
                <Icon name="i-lucide-check" class="w-3.5 h-3.5" /> {{ ui.t('news.approveDisplay') }}
              </button>
              <button class="btn-reject" @click="reject(n)">
                <Icon name="i-lucide-x" class="w-3.5 h-3.5" /> {{ ui.t('news.rejectNews') }}
              </button>
            </template>
            <template v-else-if="n.displayStatus === 'approved'">
              <button class="btn-revoke" @click="revoke(n)">
                <Icon name="i-lucide-pause" class="w-3.5 h-3.5" /> {{ ui.t('news.stopDisplay') }}
              </button>
            </template>
            <template v-else-if="n.displayStatus === 'rejected'">
              <button class="btn-approve" @click="approve(n)">
                <Icon name="i-lucide-check" class="w-3.5 h-3.5" /> Setujui Tampil
              </button>
            </template>
          </div>
        </div>
      </div>
      <div v-if="!filteredNews.length && !loading" class="empty-state">
        <Icon name="i-lucide-megaphone-off" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
        <p style="color: var(--text-muted); font-size: var(--text-sm);">
          {{ activeTab === 'pending' ? ui.t('news.noPending') : ui.t('news.noCategory') }}
        </p>
      </div>
      <div v-if="loading" class="empty-state"><div class="loading-shimmer" style="width:100%;height:100px;"></div></div>
    </div>
    <PaginationBar v-model:page="page" :total="filteredNews.length" />
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.tab-bar { display: flex; gap: 0; border-bottom: 1px solid var(--border-light); flex-wrap: wrap; }
.tab-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-muted); background: none; border: none; cursor: pointer; transition: all 0.15s; font-family: var(--font-family); border-bottom: 2px solid transparent; }
.tab-btn.active { color: var(--text-primary); border-bottom-color: var(--text-primary); }
.tab-btn:not(.active):hover { color: var(--text-secondary); }
.tab-count { font-size: 11px; color: var(--text-muted); font-weight: var(--font-normal); }
.tab-count-alert { color: var(--red-orange); font-weight: var(--font-semibold); }

.pending-banner { display: flex; align-items: center; gap: 8px; padding: 10px 14px; font-size: var(--text-sm); color: var(--text-secondary); }

.news-list { display: flex; flex-direction: column; gap: 12px; }
.news-card { background: var(--bg-card); border: 1px solid var(--border-light); padding: 14px 16px; }

.news-cover-wrap { width: 100%; max-height: 140px; overflow: hidden; margin-bottom: 10px; background: var(--bg-main); }
.news-cover-img { width: 100%; height: 140px; object-fit: cover; display: block; }
.news-uploader { display: inline-flex; align-items: center; gap: 5px; }

.news-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.news-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.news-ekskul { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-sm); color: var(--text-secondary); }
.ekskul-logo-img { width: 16px; height: 16px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.news-badge { font-size: var(--text-sm); font-weight: var(--font-medium); display: inline-flex; align-items: center; gap: 4px; color: var(--text-secondary); }
.news-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.disp-none { color: var(--text-muted); }
.disp-pending { color: var(--orange); }
.disp-pending::before { background: var(--orange); }
.disp-approved { color: var(--teal); }
.disp-approved::before { background: var(--teal); }
.disp-rejected { color: var(--red-orange); }
.disp-rejected::before { background: var(--red-orange); }
.news-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.news-content { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); }
.news-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-light); flex-wrap: wrap; }
.news-actions { display: flex; gap: 8px; }
.btn-approve { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; padding: 4px 10px; border: none; background: none; color: var(--teal); font-weight: var(--font-semibold); cursor: pointer; font-family: var(--font-family); }
.btn-approve:hover { text-decoration: underline; }
.btn-reject { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; padding: 4px 10px; border: none; background: none; color: var(--red-orange); font-weight: var(--font-semibold); cursor: pointer; font-family: var(--font-family); }
.btn-reject:hover { text-decoration: underline; }
.btn-revoke { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; padding: 4px 10px; border: none; background: none; color: var(--text-muted); font-weight: var(--font-medium); cursor: pointer; font-family: var(--font-family); }
.btn-revoke:hover { color: var(--text-primary); text-decoration: underline; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
