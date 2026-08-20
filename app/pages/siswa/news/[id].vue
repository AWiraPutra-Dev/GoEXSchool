<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const route = useRoute()
const ui = useUiStore()
const news = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    news.value = await $fetch(`/api/siswa/news/${route.params.id}`)
  } catch { news.value = null }
  loading.value = false
})
</script>

<template>
  <div class="news-page">
    <NuxtLink to="/siswa/news" class="back-link">
      <Icon name="i-lucide-arrow-left" class="w-4 h-4" /> Kembali ke Berita
    </NuxtLink>

    <div v-if="!loading && news" class="news-container">
      <div class="news-meta-bar">
        <span class="news-ekskul">
          <img v-if="news.ekskulLogo" :src="news.ekskulLogo" class="ekskul-logo-img" alt="" />
          <Icon v-else name="i-lucide-shield" class="w-3.5 h-3.5" />
          {{ news.ekskul }}
        </span>
        <span class="news-date">{{ news.date }}</span>
        <span class="news-author">Oleh: {{ news.author }}</span>
      </div>

      <img v-if="news.coverImage" :src="news.coverImage" :alt="news.title" class="news-cover" />

      <h1 class="news-title"><TranslatedText :text="news.title" /></h1>

      <div class="news-content" v-html="news.content"></div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-shimmer" style="height:200px;border-radius:8px;"></div>
    </div>

    <div v-if="!loading && !news" class="empty-state">
      <Icon name="i-lucide-file-x" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
      <p>Berita tidak ditemukan.</p>
      <NuxtLink to="/siswa/news" class="back-link" style="margin-top:12px;">Kembali ke Berita</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.news-page { max-width: 760px; margin: 0 auto; }
.back-link { display: inline-flex; align-items: center; gap: 6px; font-size: var(--text-sm); color: var(--olive-primary); text-decoration: none; margin-bottom: 20px; font-weight: var(--font-medium); }
.back-link:hover { text-decoration: underline; }
.news-container { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; padding: 32px 40px; }
.news-meta-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.news-ekskul { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; padding: 4px 12px; border-radius: 4px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-semibold); }
.ekskul-logo-img { width: 18px; height: 18px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.news-cover { width: 100%; max-height: 380px; object-fit: cover; border-radius: 10px; margin-bottom: 20px; }
.news-date, .news-author { font-size: var(--text-sm); color: var(--text-muted); }
.news-title { font-size: 26px; font-weight: 800; color: var(--text-primary); line-height: 1.3; margin-bottom: 24px; }
.news-content { font-size: var(--text-md); color: var(--text-primary); line-height: 1.8; }
.news-content :deep(p) { margin-bottom: 16px; }
.news-content :deep(h2) { font-size: 20px; font-weight: 700; margin: 24px 0 12px; }
.news-content :deep(h3) { font-size: 16px; font-weight: 700; margin: 20px 0 8px; }
.news-content :deep(ul), .news-content :deep(ol) { margin-bottom: 16px; padding-left: 24px; }
.news-content :deep(li) { margin-bottom: 6px; }
.news-content :deep(blockquote) { border-left: 3px solid var(--olive-primary); padding: 12px 20px; margin: 16px 0; background: var(--olive-bg); border-radius: 0 8px 8px 0; font-style: italic; }
.news-content :deep(img) { max-width: 100%; border-radius: 8px; margin: 16px 0; }
.loading-state { padding: 20px; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; color: var(--text-muted); }
@media (max-width: 768px) { .news-container { padding: 20px; } .news-title { font-size: 22px; } }
</style>
