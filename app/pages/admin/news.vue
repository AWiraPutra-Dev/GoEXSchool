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
    title: `Setujui \"${n.title}\" tampil?`,
    message: 'Berita ini akan tampil berjalan (Event Board) di dashboard semua siswa.',
    confirmText: 'Ya, Setujui',
  })
  if (!ok) return
  await op.setNewsDisplay(n.id, 'approved')
}

async function reject(n: NewsItem) {
  const ok = await confirm({
    title: `Tolak \"${n.title}\"?`,
    message: 'Berita tidak akan tampil di Event Board siswa. Operator ekskul dapat melihat status ini.',
    confirmText: 'Ya, Tolak',
    danger: true,
  })
  if (!ok) return
  await op.setNewsDisplay(n.id, 'rejected')
}

async function revoke(n: NewsItem) {
  const ok = await confirm({
    title: `Hentikan tampil \"${n.title}\"?`,
    message: 'Berita akan segera berhenti tampil di Event Board siswa.',
    confirmText: 'Ya, Hentikan',
    danger: true,
  })
  if (!ok) return
  await op.setNewsDisplay(n.id, 'none')
}

const displayLabels: Record<string, string> = {
  none: 'Tidak tampil',
  pending: 'Menunggu persetujuan',
  approved: 'Sedang tampil',
  rejected: 'Ditolak',
}
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
        Kelola berita yang tampil berjalan di dashboard siswa. Setujui atau tolak pengajuan dari operator ekskul.
      </p>
    </div>

    <!-- Tab Status -->
    <div class="tab-bar">
      <button v-for="tab in [['all', 'Semua'], ['pending', 'Perlu Disetujui'], ['approved', 'Sedang Tampil'], ['rejected', 'Ditolak']]" :key="tab[0]"
        class="tab-btn" :class="{ active: activeTab === tab[0] }" @click="activeTab = tab[0] as any; page = 1">
        {{ tab[1] }}
        <span class="tab-count" :class="tab[0] === 'pending' && counts.pending > 0 ? 'tab-count-alert' : ''">{{ counts[tab[0] as keyof typeof counts] }}</span>
      </button>
    </div>

    <!-- Info banner pengajuan baru -->
    <div v-if="counts.pending > 0 && activeTab === 'pending'" class="pending-banner">
      <Icon name="i-lucide-bell-ring" class="w-4 h-4" />
      <span>{{ counts.pending }} berita menunggu persetujuan Anda untuk tampil di Event Board siswa.</span>
    </div>

    <div class="news-list">
      <div v-for="n in paged" :key="n.id" class="news-card" :class="{ 'news-card-pending': n.displayStatus === 'pending' }">
        <div class="news-top">
          <div class="news-meta">
            <span class="news-ekskul">
              <img v-if="n.ekskulLogo" :src="n.ekskulLogo" class="ekskul-logo-img" alt="" />
              {{ n.ekskul }}
            </span>
            <span class="news-badge" :class="n.isPublic ? 'badge-public' : 'badge-internal'">{{ n.isPublic ? 'Publik' : 'Internal' }}</span>
            <span class="news-badge" :class="displayClass[n.displayStatus || 'none']">
              <Icon v-if="n.displayStatus === 'pending'" name="i-lucide-clock" class="w-3 h-3" />
              <Icon v-else-if="n.displayStatus === 'approved'" name="i-lucide-check-circle" class="w-3 h-3" />
              <Icon v-else-if="n.displayStatus === 'rejected'" name="i-lucide-x-circle" class="w-3 h-3" />
              {{ displayLabels[n.displayStatus || 'none'] }}
            </span>
          </div>
        </div>
        <h3 class="news-title"><TranslatedText :text="n.title" /></h3>
        <p class="news-content"><TranslatedText :text="n.content" /></p>
        <div class="news-footer">
          <span>{{ n.author }} · {{ n.date }}</span>
          <div class="news-actions">
            <!-- Tombol keputusan admin -->
            <template v-if="n.displayStatus === 'pending'">
              <button class="btn-approve" @click="approve(n)">
                <Icon name="i-lucide-check" class="w-3.5 h-3.5" /> Setujui Tampil
              </button>
              <button class="btn-reject" @click="reject(n)">
                <Icon name="i-lucide-x" class="w-3.5 h-3.5" /> Tolak
              </button>
            </template>
            <template v-else-if="n.displayStatus === 'approved'">
              <button class="btn-revoke" @click="revoke(n)">
                <Icon name="i-lucide-pause" class="w-3.5 h-3.5" /> Hentikan Tampil
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
          {{ activeTab === 'pending' ? 'Tidak ada pengajuan berita yang menunggu persetujuan.' : 'Tidak ada berita pada kategori ini.' }}
        </p>
      </div>
      <div v-if="loading" class="empty-state"><div class="loading-shimmer" style="width:100%;height:100px;"></div></div>
    </div>
    <PaginationBar v-model:page="page" :total="filteredNews.length" />
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.tab-bar { display: flex; gap: 4px; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); padding: 4px; flex-wrap: wrap; }
.tab-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-secondary); background: none; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-family: var(--font-family); }
.tab-btn.active { background: var(--olive-primary); color: white; }
.tab-btn:not(.active):hover { background: var(--bg-hover); }
.tab-count { font-size: 10px; background: rgba(0,0,0,0.1); padding: 1px 6px; border-radius: 8px; }
.tab-btn.active .tab-count { background: rgba(255,255,255,0.2); }
.tab-count-alert { background: var(--red-orange) !important; color: white; }
.tab-btn.active .tab-count-alert { background: rgba(255,255,255,0.35) !important; }

.pending-banner { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.35); border-radius: 8px; font-size: var(--text-sm); color: #b45309; font-weight: var(--font-medium); }

.news-list { display: flex; flex-direction: column; gap: 12px; }
.news-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px 20px; }
.news-card-pending { border-color: rgba(245,158,11,0.5); box-shadow: 0 0 0 3px rgba(245,158,11,0.08); }
.news-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.news-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.news-ekskul { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.ekskul-logo-img { width: 16px; height: 16px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.news-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); display: inline-flex; align-items: center; gap: 4px; }
.badge-public { background: rgba(74,158,158,0.15); color: var(--teal); }
.badge-internal { background: rgba(212,192,137,0.2); color: var(--orange); }
.disp-none { background: var(--bg-hover); color: var(--text-muted); }
.disp-pending { background: rgba(245,158,11,0.15); color: #b45309; }
.disp-approved { background: rgba(16,185,129,0.15); color: #047857; }
.disp-rejected { background: rgba(239,68,68,0.12); color: var(--red-orange); }
.news-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.news-content { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); }
.news-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-light); flex-wrap: wrap; }
.news-actions { display: flex; gap: 8px; }
.btn-approve { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; padding: 6px 14px; border-radius: 6px; border: 1px solid #10b981; background: rgba(16,185,129,0.1); color: #047857; font-weight: var(--font-semibold); cursor: pointer; transition: all 0.2s; font-family: var(--font-family); }
.btn-approve:hover { background: #10b981; color: white; }
.btn-reject { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; padding: 6px 14px; border-radius: 6px; border: 1px solid var(--red-orange); background: rgba(239,68,68,0.08); color: var(--red-orange); font-weight: var(--font-semibold); cursor: pointer; transition: all 0.2s; font-family: var(--font-family); }
.btn-reject:hover { background: var(--red-orange); color: white; }
.btn-revoke { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border-medium); background: var(--bg-card); color: var(--text-secondary); font-weight: var(--font-medium); cursor: pointer; transition: all 0.2s; font-family: var(--font-family); }
.btn-revoke:hover { background: var(--bg-hover); color: var(--text-primary); }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
