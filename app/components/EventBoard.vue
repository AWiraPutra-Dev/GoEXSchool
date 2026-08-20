<script setup lang="ts">
/**
 * Event Board — deretan berita yang berjalan terus (ticker) di dashboard siswa.
 * Berisi berita yang sudah disetujui admin (displayStatus = approved).
 * Klik salah satu → langsung ke halaman berita.
 */
import type { SiswaNews } from '~/stores/siswa-data'

const props = defineProps<{
  items: SiswaNews[]
}>()

// Ganda-kan daftar agar marquee berjalan mulus tanpa jeda (loop tak terlihat).
const loopedItems = computed(() => [...props.items, ...props.items])
</script>

<template>
  <section v-if="items.length" class="event-board">
    <div class="board-label">
      <Icon name="i-lucide-megaphone" class="w-4 h-4" />
      <span>Event Board</span>
    </div>
    <div class="board-track-wrap">
      <div class="board-track">
        <NuxtLink
          v-for="(item, i) in loopedItems"
          :key="`${item.id}-${i}`"
          :to="`/siswa/news/${item.id}`"
          class="board-item"
          :class="{ 'board-item-copy': i >= items.length }"
        >
          <span class="board-item-icon">
            <img v-if="item.ekskulLogo" :src="item.ekskulLogo" class="board-logo" alt="" />
            <Icon v-else name="i-lucide-shield" class="w-3.5 h-3.5" />
          </span>
          <span class="board-item-text"><TranslatedText :text="item.title" /></span>
          <span class="board-item-ekskul">{{ item.ekskul }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.event-board {
  display: flex;
  align-items: stretch;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  overflow: hidden;
}
.board-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--text-primary);
  color: var(--bg-card);
  font-size: var(--text-sm);
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}
.board-track-wrap {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
}
/* Fade halus di sisi kanan agar item terlihat "masuk" */
.board-track-wrap::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(to left, var(--bg-card), transparent);
  pointer-events: none;
}
.board-track {
  display: flex;
  align-items: center;
  gap: 12px;
  width: max-content;
  padding: 0 12px;
  animation: board-scroll 40s linear infinite;
}
.board-track:hover {
  animation-play-state: paused;
}
@keyframes board-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.board-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 4px;
  background: var(--bg-hover);
  border: 1px solid var(--border-light);
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.15s ease;
  flex-shrink: 0;
}
.board-item:hover {
  border-color: var(--olive-primary);
  background: var(--olive-bg);
  transform: translateY(-1px);
}
.board-item-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--olive-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.board-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.board-item-text {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  max-width: 380px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.board-item-ekskul {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}
@media (max-width: 768px) {
  .board-label { padding: 10px 12px; font-size: var(--text-xs); }
  .board-item-text { max-width: 220px; }
}
</style>
