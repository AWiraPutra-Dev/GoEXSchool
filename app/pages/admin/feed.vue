<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const siswa = useSiswaDataStore()
const route = useRoute()
const ui = useUiStore()
const { confirm } = useConfirm()
const shareTarget = ref<any>(null)
const newComments = ref<Record<string, string>>({})
const showComments = ref<Record<string, boolean>>({})
const deleting = ref<Record<string, boolean>>({})

const search = ref('')
const filteredFeed = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return siswa.feed
  return siswa.feed.filter((p: any) =>
    (p.title || '').toLowerCase().includes(q) ||
    (p.content || '').toLowerCase().includes(q) ||
    (p.author || '').toLowerCase().includes(q)
  )
})
const { page, paged, totalPages } = usePagination(() => filteredFeed.value)

onMounted(async () => {
  await siswa.fetchFeed()
  if (route.query.post) {
    nextTick(() => {
      document.getElementById(`post-${route.query.post}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
})

function toggleLike(postId: string) { siswa.toggleLike(postId) }
function toggleComments(postId: string) { showComments.value[postId] = !showComments.value[postId] }
function addComment(postId: string) {
  if (!newComments.value[postId]?.trim()) return
  siswa.addComment(postId, newComments.value[postId])
  newComments.value[postId] = ''
}
async function removePost(post: any) {
  const ok = await confirm({
    title: `Hapus postingan "${post.title}"?`,
    message: 'Postingan, komentar, dan suka di dalamnya akan dihapus permanen.',
    confirmText: 'Ya, Hapus',
    danger: true,
  })
  if (!ok) return
  deleting.value[post.id] = true
  try {
    await siswa.deleteFeedPost(post.id)
  } finally {
    deleting.value[post.id] = false
  }
}

const typeColors: Record<string, string> = {
  announcement: 'var(--teal)', achievement: 'var(--yellow-cream)', gallery: 'var(--green-soft)', poll: 'var(--orange)', schedule: 'var(--olive-primary)'
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">{{ ui.t('menu.feed') }}</h1>
    <p class="text-[13px]" style="color: var(--text-secondary); margin-top: -12px;">Feed komunitas tempat semua pengguna berinteraksi. Admin dapat menghapus postingan yang tidak pantas.</p>

    <div class="table-toolbar">
      <input v-model="search" type="text" placeholder="Cari judul, isi, atau penulis..." class="search-input">
    </div>

    <div class="feed-list">
      <div v-for="post in paged" :key="post.id" :id="`post-${post.id}`" class="feed-card" :class="{ 'post-highlight': route.query.post === post.id }">
        <div class="feed-header">
          <div class="feed-author-info">
            <div class="feed-avatar" :style="{ background: typeColors[post.type] }">{{ post.avatar }}</div>
            <div><div class="feed-author">{{ post.author }}</div><div class="feed-meta">{{ post.ekskul }} · {{ post.date }}</div></div>
          </div>
          <div class="feed-header-right">
            <div class="feed-type-badge">
              <span class="feed-type-dot" :style="{ background: typeColors[post.type] }"></span>
              <span>{{ post.type === 'announcement' ? 'Pengumuman' : post.type === 'achievement' ? 'Prestasi' : post.type === 'gallery' ? 'Galeri' : post.type === 'poll' ? 'Voting' : 'Jadwal' }}</span>
            </div>
            <button class="feed-delete-btn" :disabled="deleting[post.id]" title="Hapus postingan" @click="removePost(post)">
              <Icon v-if="!deleting[post.id]" name="i-lucide-trash-2" class="w-3.5 h-3.5" />
              <span v-else class="spin-icon"><Icon name="i-lucide-loader-2" class="w-3.5 h-3.5" /></span>
            </button>
          </div>
        </div>
        <h3 class="feed-title"><TranslatedText :text="post.title" /></h3>
        <p class="feed-content"><TranslatedText :text="post.content" strip-html /></p>

        <div v-if="post.type === 'gallery'" class="feed-gallery-preview">
          <div v-for="i in 3" :key="i" class="gallery-thumb" :style="{ background: typeColors[post.type] + '30' }">
            <Icon name="i-lucide-image" class="w-6 h-6" :style="{ color: typeColors[post.type] }" />
          </div>
        </div>

        <div class="feed-actions">
          <button class="feed-action-btn" :class="{ liked: post.liked }" @click="toggleLike(post.id)">
            <Icon name="i-lucide-heart" class="w-4 h-4" :style="{ color: post.liked ? 'var(--red-orange)' : undefined }" />
            <span>{{ post.likes }} Suka</span>
          </button>
          <button class="feed-action-btn" @click="toggleComments(post.id)">
            <Icon name="i-lucide-message-circle" class="w-4 h-4" /><span>{{ post.comments.length }} Komentar</span>
          </button>
          <button class="feed-action-btn" @click="shareTarget = post">
            <Icon name="i-lucide-share-2" class="w-4 h-4" /><span>Bagikan</span>
          </button>
        </div>

        <div v-if="showComments[post.id]" class="feed-comments">
          <div v-for="c in post.comments" :key="c.id" class="comment-item">
            <div class="comment-avatar">{{ c.avatar }}</div>
            <div class="comment-body">
              <div class="comment-header"><span class="comment-user">{{ c.user }}</span><span class="comment-time">{{ c.time }}</span></div>
              <p class="comment-text">{{ c.text }}</p>
            </div>
          </div>
          <form class="comment-form" @submit.prevent="addComment(post.id)">
            <input v-model="newComments[post.id]" type="text" class="comment-input" placeholder="Tulis komentar..." required>
            <button type="submit" class="comment-send-btn" :disabled="!newComments[post.id]?.trim()"><Icon name="i-lucide-send" class="w-4 h-4" /></button>
          </form>
        </div>
      </div>

      <div v-if="!filteredFeed.length" class="empty-state">
        <Icon name="i-lucide-newspaper" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
        <p style="color: var(--text-muted); font-size: var(--text-sm);">Belum ada postingan yang cocok.</p>
      </div>
    </div>

    <PaginationBar v-model:page="page" :total="filteredFeed.length" />

    <FeedShareSheet :open="!!shareTarget" :post="shareTarget" @close="shareTarget = null" />
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 280px; color: var(--text-primary); background: var(--bg-card); }
.search-input:focus { outline: none; border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.feed-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.feed-card { display: flex; flex-direction: column; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; padding: 18px 20px; transition: all 0.2s; }
.feed-card:hover { border-color: var(--border-medium); }
.post-highlight { border-color: var(--olive-primary); box-shadow: 0 0 0 3px rgba(139,148,103,0.18); animation: highlight-pulse 1.5s ease; }
@keyframes highlight-pulse { 0% { background: rgba(139,148,103,0.15); } 100% { background: var(--bg-card); } }
.feed-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
.feed-header-right { display: flex; align-items: center; gap: 8px; }
.feed-author-info { display: flex; align-items: center; gap: 12px; }
.feed-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: var(--font-bold); flex-shrink: 0; }
.feed-author { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.feed-meta { font-size: var(--text-xs); color: var(--text-muted); margin-top: 1px; }
.feed-type-badge { display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); font-weight: var(--font-medium); color: var(--text-secondary); }
.feed-type-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.feed-delete-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; border: none; background: rgba(212,106,90,0.12); color: var(--red-orange); cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
.feed-delete-btn:hover:not(:disabled) { background: var(--red-orange); color: white; }
.feed-delete-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.spin-icon { display: inline-flex; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.feed-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.feed-content { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); margin-bottom: 12px; flex: 1; }
.feed-gallery-preview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
.gallery-thumb { aspect-ratio: 16/9; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.feed-actions { display: flex; gap: 16px; padding-top: 12px; border-top: 1px solid var(--border-light); }
.feed-action-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 6px; font-size: var(--text-sm); color: var(--text-secondary); transition: all 0.2s; }
.feed-action-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
.feed-action-btn.liked { color: var(--red-orange); }
.feed-comments { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-light); }
.comment-item { display: flex; gap: 10px; margin-bottom: 12px; }
.comment-avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--olive-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: var(--font-bold); flex-shrink: 0; }
.comment-body { flex: 1; }
.comment-header { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
.comment-user { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.comment-time { font-size: var(--text-xs); color: var(--text-muted); }
.comment-text { font-size: var(--text-sm); color: var(--text-secondary); }
.comment-form { display: flex; gap: 8px; margin-top: 12px; }
.comment-input { flex: 1; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 8px; font-size: var(--text-sm); outline: none; transition: all 0.2s; }
.comment-input:focus { border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.12); }
.comment-send-btn { width: 36px; height: 36px; border-radius: 8px; border: none; background: var(--olive-primary); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.comment-send-btn:hover:not(:disabled) { background: var(--olive-dark); }
.comment-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; grid-column: 1 / -1; }
</style>
