<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const siswa = useSiswaDataStore()

const typeIcons: Record<string, string> = {
  announcement: 'i-lucide-megaphone', achievement: 'i-lucide-award', gallery: 'i-lucide-image', poll: 'i-lucide-vote', schedule: 'i-lucide-calendar'
}
const typeColors: Record<string, string> = {
  announcement: 'var(--teal)', achievement: 'var(--yellow-cream)', gallery: 'var(--green-soft)', poll: 'var(--orange)', schedule: 'var(--olive-primary)'
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">Feed Komunitas</h1>
    <p class="text-[13px]" style="color: var(--text-secondary);">Pantau aktivitas dan interaksi komunitas ekskul</p>

    <div class="feed-list">
      <div v-for="post in siswa.feed" :key="post.id" class="feed-card">
        <div class="feed-header">
          <div class="feed-author-info">
            <div class="feed-avatar" :style="{ background: typeColors[post.type] }">{{ post.avatar }}</div>
            <div><div class="feed-author">{{ post.author }}</div><div class="feed-meta">{{ post.ekskul }} · {{ post.date }}</div></div>
          </div>
          <div class="feed-type-badge" :style="{ background: typeColors[post.type] + '20', color: typeColors[post.type] }">
            <Icon :name="typeIcons[post.type]" class="w-3.5 h-3.5" />
            <span>{{ post.type === 'announcement' ? 'Pengumuman' : post.type === 'achievement' ? 'Prestasi' : post.type === 'gallery' ? 'Galeri' : post.type === 'poll' ? 'Voting' : 'Jadwal' }}</span>
          </div>
        </div>
        <h3 class="feed-title">{{ post.title }}</h3>
        <p class="feed-content">{{ post.content }}</p>
        <div class="feed-stats">
          <span>❤️ {{ post.likes }} suka</span>
          <span>💬 {{ post.comments.length }} komentar</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.feed-list { display: flex; flex-direction: column; gap: 16px; max-width: 700px; }
.feed-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; padding: 20px 24px; transition: all 0.2s; }
.feed-card:hover { border-color: var(--olive-light); }
.feed-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
.feed-author-info { display: flex; align-items: center; gap: 12px; }
.feed-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: var(--font-bold); flex-shrink: 0; }
.feed-author { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.feed-meta { font-size: var(--text-xs); color: var(--text-muted); margin-top: 1px; }
.feed-type-badge { display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 6px; font-size: var(--text-xs); font-weight: var(--font-medium); }
.feed-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.feed-content { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); margin-bottom: 12px; }
.feed-stats { display: flex; gap: 16px; font-size: var(--text-sm); color: var(--text-muted); padding-top: 12px; border-top: 1px solid var(--border-light); }
</style>
