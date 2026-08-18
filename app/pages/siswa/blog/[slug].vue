<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const route = useRoute()
const ui = useUiStore()
const article = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    article.value = await $fetch(`/api/siswa/articles/${route.params.slug}`)
  } catch { article.value = null }
  loading.value = false
})
</script>

<template>
  <div class="article-page" v-if="!loading && article">
    <NuxtLink to="/siswa/blog" class="back-link">
      <Icon name="i-lucide-arrow-left" class="w-4 h-4" /> Kembali ke Blog
    </NuxtLink>

    <div class="article-header" v-if="article.coverImage">
      <img :src="article.coverImage" :alt="article.title" class="article-cover-img" />
    </div>

    <div class="article-container">
      <div class="article-meta-bar">
        <span class="article-category">{{ article.category }}</span>
        <span v-if="article.ekskulLogo" class="ekskul-logo-chip">
          <img :src="article.ekskulLogo" class="ekskul-logo-img" alt="" />
          {{ article.ekskul }}
        </span>
        <span class="article-date">{{ article.createdAt }}</span>
        <span class="article-author">Oleh: {{ article.author }}</span>
        <span v-if="article.viewCount !== undefined" class="article-views">
          <Icon name="i-lucide-eye" class="w-4 h-4" /> {{ article.viewCount }} dibaca
        </span>
      </div>

      <h1 class="article-title"><TranslatedText :text="article.title" /></h1>

      <div class="article-content" v-html="article.content"></div>
    </div>
  </div>

  <div v-if="loading" class="loading-state">
    <div class="loading-shimmer" style="height:200px;border-radius:8px;"></div>
  </div>

  <div v-if="!loading && !article" class="empty-state">
    <Icon name="i-lucide-file-x" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
    <p>Artikel tidak ditemukan.</p>
    <NuxtLink to="/siswa/blog" class="back-link" style="margin-top:12px;">Kembali ke Blog</NuxtLink>
  </div>
</template>

<style scoped>
.article-page { max-width: 800px; margin: 0 auto; }
.back-link { display: inline-flex; align-items: center; gap: 6px; font-size: var(--text-sm); color: var(--olive-primary); text-decoration: none; margin-bottom: 20px; font-weight: var(--font-medium); }
.back-link:hover { text-decoration: underline; }
.article-header { margin-bottom: 24px; }
.article-cover-img { width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; }
.article-container { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; padding: 32px 40px; }
.article-meta-bar { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.article-category { font-size: 11px; padding: 4px 12px; border-radius: 6px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.article-date, .article-author { font-size: var(--text-sm); color: var(--text-muted); }
.ekskul-logo-chip { display: inline-flex; align-items: center; gap: 6px; font-size: var(--text-sm); color: var(--text-secondary); font-weight: var(--font-medium); }
.ekskul-logo-img { width: 22px; height: 22px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.article-views { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-sm); color: var(--olive-primary); font-weight: var(--font-medium); }
.article-title { font-size: 28px; font-weight: 800; color: var(--text-primary); line-height: 1.3; margin-bottom: 24px; }
.article-content { font-size: var(--text-md); color: var(--text-primary); line-height: 1.8; }
.article-content :deep(p) { margin-bottom: 16px; }
.article-content :deep(h2) { font-size: 20px; font-weight: 700; margin: 24px 0 12px; }
.article-content :deep(h3) { font-size: 16px; font-weight: 700; margin: 20px 0 8px; }
.article-content :deep(ul), .article-content :deep(ol) { margin-bottom: 16px; padding-left: 24px; }
.article-content :deep(li) { margin-bottom: 6px; }
.article-content :deep(blockquote) { border-left: 3px solid var(--olive-primary); padding: 12px 20px; margin: 16px 0; background: var(--olive-bg); border-radius: 0 8px 8px 0; font-style: italic; }
.article-content :deep(img) { max-width: 100%; border-radius: 8px; margin: 16px 0; }
.loading-state { padding: 20px; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; color: var(--text-muted); }
@media (max-width: 768px) { .article-container { padding: 20px; } .article-title { font-size: 22px; } }
</style>
