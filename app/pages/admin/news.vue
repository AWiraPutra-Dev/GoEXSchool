<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">Pengumuman & Berita</h1>
    <p class="text-[13px]" style="color: var(--text-secondary);">{{ op.news.length }} total berita</p>

    <div class="news-list">
      <div v-for="n in op.news" :key="n.id" class="news-card">
        <div class="news-top">
          <div class="news-meta">
            <span class="news-ekskul">{{ n.ekskul }}</span>
            <span class="news-badge" :class="n.isPublic ? 'badge-public' : 'badge-internal'">{{ n.isPublic ? 'Publik' : 'Internal' }}</span>
          </div>
        </div>
        <h3 class="news-title">{{ n.title }}</h3>
        <p class="news-content">{{ n.content }}</p>
        <div class="news-footer"><span>{{ n.author }}</span><span>{{ n.date }}</span></div>
      </div>
      <div v-if="!op.news.length" class="empty-state">
        <p style="color: var(--text-muted); font-size: var(--text-sm);">Belum ada berita.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.news-list { display: flex; flex-direction: column; gap: 12px; }
.news-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px 20px; }
.news-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.news-meta { display: flex; align-items: center; gap: 8px; }
.news-ekskul { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.news-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); }
.badge-public { background: rgba(74,158,158,0.15); color: var(--teal); }
.badge-internal { background: rgba(212,192,137,0.2); color: var(--orange); }
.news-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.news-content { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); }
.news-footer { display: flex; justify-content: space-between; font-size: var(--text-xs); color: var(--text-muted); margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-light); }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
