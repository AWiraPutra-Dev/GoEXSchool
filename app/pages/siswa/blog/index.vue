<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const siswa = useSiswaDataStore()
const ui = useUiStore()
const selectedCategory = ref('all')

onMounted(() => siswa.fetchArticles())

const categories = computed(() => {
  const cats = new Set(siswa.articles.map((a: any) => a.category))
  return ['all', ...Array.from(cats)]
})

const filteredArticles = computed(() => {
  if (selectedCategory.value === 'all') return siswa.articles
  return siswa.articles.filter((a: any) => a.category === selectedCategory.value)
})

const { page, paged, totalPages } = usePagination(() => filteredArticles.value)

const categoryLabels: Record<string, string> = {
  all: 'Semua',
  general: 'Umum',
  announcement: 'Pengumuman',
  achievement: 'Prestasi',
  event: 'Kegiatan',
  tip: 'Tips & Info'
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="page-title">{{ ui.t('menu.blog') }}</h1>
      <p class="text-[13px]" style="color: var(--text-secondary);">{{ ui.t('menu.blog') }}</p>
    </div>

    <!-- Category Filter -->
    <div class="filter-chips">
      <button v-for="cat in categories" :key="cat as string"
        class="chip" :class="{ active: selectedCategory === cat }"
        @click="selectedCategory = cat as string">
        {{ categoryLabels[cat as string] || cat }}
      </button>
    </div>

    <!-- Article Grid -->
    <div class="article-grid">
      <NuxtLink v-for="article in paged" :key="article.id" :to="`/siswa/blog/${article.slug}`" class="article-card">
        <div v-if="article.coverImage" class="article-cover" :style="{ backgroundImage: `url(${article.coverImage})` }"></div>
        <div v-else class="article-cover article-cover-placeholder">
          <Icon name="i-lucide-file-text" class="w-8 h-8 text-white/40" />
        </div>
        <div class="article-body">
          <div class="article-category">{{ categoryLabels[article.category] || article.category }}</div>
          <h3 class="article-title"><TranslatedText :text="article.title" /></h3>
          <p class="article-excerpt"><TranslatedText :text="article.excerpt || article.content?.slice(0, 120) + '...'" /></p>
          <div class="article-footer">
            <span v-if="article.ekskulLogo" class="ekskul-logo-chip">
              <img :src="article.ekskulLogo" class="ekskul-logo-img" alt="" />
              {{ article.ekskul }}
            </span>
            <span v-else-if="article.ekskul" class="article-author">{{ article.ekskul }}</span>
            <span class="article-author">{{ article.author }}</span>
            <span class="article-date">{{ article.createdAt }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <div v-if="!filteredArticles.length" class="empty-state">
      <Icon name="i-lucide-file-text" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
      <p style="color: var(--text-muted);">Belum ada artikel.</p>
    </div>

    <PaginationBar v-model:page="page" :total="filteredArticles.length" />
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-light); background: white; font-size: var(--text-sm); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.chip.active { background: var(--olive-primary); color: white; border-color: var(--olive-primary); }
.chip:not(.active):hover { background: var(--bg-hover); }

.article-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.article-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 10px; overflow: hidden; cursor: pointer; transition: all 0.2s; text-decoration: none; }
.article-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.article-cover { height: 160px; background-size: cover; background-position: center; }
.article-cover-placeholder { display: flex; align-items: center; justify-content: center; background: var(--olive-primary); }
.article-body { padding: 16px 20px; }
.article-category { font-size: 10px; padding: 2px 8px; border-radius: 6px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); display: inline-block; margin-bottom: 8px; }
.article-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; line-height: 1.4; }
.article-excerpt { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); margin-bottom: 12px; }
.article-footer { display: flex; align-items: center; gap: 12px; font-size: var(--text-xs); color: var(--text-muted); padding-top: 12px; border-top: 1px solid var(--border-light); }
.article-author { font-weight: var(--font-medium); color: var(--text-secondary); }
.ekskul-logo-chip { display: inline-flex; align-items: center; gap: 6px; font-weight: var(--font-medium); color: var(--text-secondary); }
.ekskul-logo-img { width: 20px; height: 20px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
