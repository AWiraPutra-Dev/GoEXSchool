<script setup lang="ts">
// Penampil artikel (modal) untuk daftar blog admin & operator —
// klik kartu artikel → lihat isi lengkapnya tanpa pindah halaman.
const props = defineProps<{ article: any }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const categoryLabels: Record<string, string> = {
  general: 'Umum',
  announcement: 'Pengumuman',
  achievement: 'Prestasi',
  event: 'Kegiatan',
  tip: 'Tips & Info',
}
</script>

<template>
  <Teleport to="body">
    <div class="av-overlay" @click.self="emit('close')">
      <div class="av-modal">
        <div class="av-head">
          <h3 class="av-head-title">Lihat Artikel</h3>
          <button class="av-close" title="Tutup" @click="emit('close')">
            <Icon name="i-lucide-x" class="w-5 h-5" />
          </button>
        </div>

        <div class="av-scroll">
          <img v-if="article.coverImage" :src="article.coverImage" :alt="article.title" class="av-cover" />

          <div class="av-meta">
            <span class="av-category">{{ categoryLabels[article.category] || article.category }}</span>
            <span v-if="article.ekskul" class="av-ekskul">
              <img v-if="article.ekskulLogo" :src="article.ekskulLogo" class="ekskul-logo-img" alt="" />
              <Icon v-else name="i-lucide-shield" class="w-3 h-3" />
              {{ article.ekskul }}
            </span>
            <span class="av-author">Oleh: {{ article.author }}</span>
            <span class="av-date">{{ article.createdAt }}</span>
            <span v-if="article.viewCount !== undefined" class="av-views">
              <Icon name="i-lucide-eye" class="w-4 h-4" /> {{ article.viewCount }} dibaca
            </span>
          </div>

          <h1 class="av-title"><TranslatedText :text="article.title" /></h1>

          <div class="av-content" v-html="article.content"></div>
        </div>

        <div class="av-actions">
          <button type="button" class="av-btn" @click="emit('close')">Tutup</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.av-overlay {
  position: fixed; inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1100; padding: 20px;
}
.av-modal {
  background: var(--bg-card);
  border-radius: 12px;
  width: 760px; max-width: 95vw; max-height: 92vh;
  display: flex; flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
}
.av-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; border-bottom: 1px solid var(--border-light);
}
.av-head-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.av-close {
  width: 30px; height: 30px; border-radius: 6px; border: none;
  background: var(--bg-hover); color: var(--text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.15s;
}
.av-close:hover { background: rgba(212, 106, 90, 0.12); color: var(--red-orange); }
.av-scroll { overflow-y: auto; padding: 24px 32px; }
.av-cover { width: 100%; max-height: 320px; object-fit: cover; border-radius: 10px; margin-bottom: 20px; }
.av-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.av-category { font-size: 11px; padding: 3px 10px; border-radius: 6px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.av-ekskul { display: inline-flex; align-items: center; gap: 5px; font-size: var(--text-sm); color: var(--text-secondary); font-weight: var(--font-medium); }
.ekskul-logo-img { width: 20px; height: 20px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.av-author, .av-date { font-size: var(--text-sm); color: var(--text-muted); }
.av-views { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-sm); color: var(--olive-primary); font-weight: var(--font-medium); }
.av-title { font-size: 26px; font-weight: 800; color: var(--text-primary); line-height: 1.3; margin-bottom: 20px; }
.av-content { font-size: var(--text-md); color: var(--text-primary); line-height: 1.8; }
.av-content :deep(p) { margin-bottom: 16px; }
.av-content :deep(h2) { font-size: 20px; font-weight: 700; margin: 24px 0 12px; }
.av-content :deep(h3) { font-size: 16px; font-weight: 700; margin: 20px 0 8px; }
.av-content :deep(ul), .av-content :deep(ol) { margin-bottom: 16px; padding-left: 24px; }
.av-content :deep(li) { margin-bottom: 6px; }
.av-content :deep(blockquote) { border-left: 3px solid var(--olive-primary); padding: 12px 20px; margin: 16px 0; background: var(--olive-bg); border-radius: 0 8px 8px 0; font-style: italic; }
.av-content :deep(img) { max-width: 100%; border-radius: 8px; margin: 16px 0; }
.av-actions { display: flex; justify-content: flex-end; padding: 14px 20px; border-top: 1px solid var(--border-light); }
.av-btn {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--olive-primary); color: white;
  font-size: var(--text-sm); font-weight: var(--font-semibold);
  padding: 8px 20px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s;
}
.av-btn:hover { background: var(--olive-dark); }
@media (max-width: 640px) { .av-scroll { padding: 16px; } .av-title { font-size: 20px; } }
</style>
