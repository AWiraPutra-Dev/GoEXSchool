<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const siswa = useSiswaDataStore()
const ui = useUiStore()

onMounted(() => siswa.fetchNews(true))

const { page, paged, totalPages } = usePagination(() => siswa.news)
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="page-title">{{ ui.t('menu.news') }}</h1>
      <p class="text-[13px]" style="color: var(--text-secondary);">Pengumuman & berita dari sekolah dan ekskul</p>
    </div>

    <div v-if="siswa.news.length" class="news-list">
      <NuxtLink v-for="n in paged" :key="n.id" :to="`/siswa/news/${n.id}`" class="news-card">
        <div class="news-top">
          <div class="news-meta">
            <span class="news-ekskul">
              <img v-if="n.ekskulLogo" :src="n.ekskulLogo" class="ekskul-logo-img" alt="" />
              <Icon v-else name="i-lucide-shield" class="w-3.5 h-3.5" />
              {{ n.ekskul }}
            </span>
          </div>
          <span class="news-arrow"><Icon name="i-lucide-arrow-right" class="w-4 h-4" /></span>
        </div>
        <h3 class="news-title"><TranslatedText :text="n.title" /></h3>
        <p class="news-content"><TranslatedText :text="n.content" /></p>
        <div class="news-footer"><span>{{ n.author }}</span><span>{{ n.date }}</span></div>
      </NuxtLink>
    </div>

    <div v-else class="empty-state">
      <Icon name="i-lucide-megaphone-off" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
      <p style="color: var(--text-muted);">Belum ada berita.</p>
    </div>

    <PaginationBar v-model:page="page" :total="siswa.news.length" />
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.news-list { display: flex; flex-direction: column; gap: 12px; }
.news-card { display: block; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 10px; padding: 18px 22px; text-decoration: none; transition: all 0.2s; }
.news-card:hover { border-color: var(--olive-primary); box-shadow: 0 4px 12px rgba(0,0,0,0.06); transform: translateY(-1px); }
.news-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.news-meta { display: flex; align-items: center; gap: 8px; }
.news-ekskul { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.ekskul-logo-img { width: 16px; height: 16px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.news-arrow { color: var(--text-muted); transition: all 0.2s; }
.news-card:hover .news-arrow { color: var(--olive-primary); transform: translateX(3px); }
.news-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.news-card:hover .news-title { color: var(--olive-primary); }
.news-content { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.news-footer { display: flex; justify-content: space-between; font-size: var(--text-xs); color: var(--text-muted); margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-light); }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
