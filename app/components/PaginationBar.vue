<script setup lang="ts">
/**
 * Bar paginasi bernomor (1, 2, 3, 4, 5, …) dengan tombol maju/mundur.
 * Otomatis tersembunyi bila datanya tidak lebih dari satu halaman.
 */
const props = withDefaults(defineProps<{
  total: number
  page: number
  pageSize?: number
}>(), { pageSize: 10 })

const emit = defineEmits<{ (e: 'update:page', value: number): void }>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

// Daftar nomor halaman dengan elipsis (…) bila halamannya banyak.
const pageItems = computed<(number | '…')[]>(() => {
  const tp = totalPages.value
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
  const cur = props.page
  const items: (number | '…')[] = [1]
  const start = Math.max(2, cur - 2)
  const end = Math.min(tp - 1, cur + 2)
  if (start > 2) items.push('…')
  for (let p = start; p <= end; p++) items.push(p)
  if (end < tp - 1) items.push('…')
  items.push(tp)
  return items
})

const from = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1))
const to = computed(() => Math.min(props.page * props.pageSize, props.total))

function go(p: number) {
  if (p < 1 || p > totalPages.value || p === props.page) return
  emit('update:page', p)
}
</script>

<template>
  <div v-if="totalPages > 1" class="pagination-bar">
    <span class="pagination-info">Menampilkan {{ from }}–{{ to }} dari {{ total }} data</span>
    <div class="pagination-controls">
      <button class="page-btn page-arrow" :disabled="page <= 1" title="Sebelumnya" @click="go(page - 1)">
        <Icon name="i-lucide-chevron-left" class="w-4 h-4" />
      </button>
      <div class="page-numbers">
        <template v-for="(p, i) in pageItems" :key="i">
          <span v-if="p === '…'" class="page-ellipsis">…</span>
          <button v-else class="page-btn" :class="{ active: p === page }" @click="go(p as number)">{{ p }}</button>
        </template>
      </div>
      <button class="page-btn page-arrow" :disabled="page >= totalPages" title="Berikutnya" @click="go(page + 1)">
        <Icon name="i-lucide-chevron-right" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 16px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-card);
}
.pagination-info {
  font-size: var(--text-xs);
  color: var(--text-muted);
}
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}
.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 260px;
  overflow-x: auto;
  padding: 2px;
  scrollbar-width: thin;
}
.page-btn {
  min-width: 30px;
  height: 30px;
  padding: 0 6px;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.page-btn:hover:not(:disabled):not(.active) {
  border-color: var(--olive-primary);
  color: var(--olive-primary);
  background: var(--olive-bg);
}
.page-btn.active {
  background: var(--olive-primary);
  border-color: var(--olive-primary);
  color: white;
  font-weight: var(--font-semibold);
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-arrow {
  width: 30px;
}
.page-ellipsis {
  color: var(--text-muted);
  font-size: var(--text-sm);
  padding: 0 2px;
  user-select: none;
}
</style>
