<script setup lang="ts">
// Bendera SVG inline — ringan, tanpa asset eksternal.
const props = defineProps<{ code: string; size?: number }>()
const size = props.size ?? 18

const flags: Record<string, string> = {
  id: `<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect width="30" height="10" fill="#CE1126"/></svg>`,
  en: `<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#012169"/><path d="M0 0l15 10L30 0v2L17 11l13 8.5V20l-15-10L0 20v-2L13 11 0 2V0z" fill="#fff"/><path d="M0 0l15 10L30 0M0 20l15-10 15 10" fill="#fff"/><path d="M15 0v20M0 0l6 4M30 0l-6 4M0 20l6-4M30 20l-6-4" stroke="#C8102E" stroke-width="2.6"/></svg>`,
  zh: `<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#DE2910"/><path d="M7 4l1.2 2.7L11 7l-2.8 2.3 1.2 2.7-2.4-1.5-2.4 1.5 1.2-2.7L3 7l2.8-.3L7 4z" fill="#FFDE00"/><path d="M11 2l.6 1.3 1.4.2-1 .9.2 1.4-1.2-.7-1.2.7.2-1.4-1-.9 1.4-.2L11 2z" fill="#FFDE00"/><path d="M13 5l.6 1.3 1.4.2-1 .9.2 1.4-1.2-.7-1.2.7.2-1.4-1-.9 1.4-.2L13 5z" fill="#FFDE00"/><path d="M13 8l.6 1.3 1.4.2-1 .9.2 1.4-1.2-.7-1.2.7.2-1.4-1-.9 1.4-.2L13 8z" fill="#FFDE00"/><path d="M11 10l.6 1.3 1.4.2-1 .9.2 1.4-1.2-.7-1.2.7.2-1.4-1-.9 1.4-.2L11 10z" fill="#FFDE00"/></svg>`,
  hi: `<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect width="30" height="6.67" fill="#FF9933"/><rect y="13.33" width="30" height="6.67" fill="#138808"/><circle cx="15" cy="10" r="3" fill="none" stroke="#000080" stroke-width="1.2"/><path d="M15 7.4v5.2M12.7 10h4.6M13.2 8.2l3.6 3.6M16.8 8.2l-3.6 3.6" stroke="#000080" stroke-width="0.9"/></svg>`,
  es: `<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/></svg>`,
  ar: `<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#165d31"/><path d="M15 13l-2-3.2L15 5l2 4.8L15 13z" fill="#fff"/><path d="M15 5l1 1.5h-2L15 5z" fill="#fff"/><rect x="6" y="6" width="2" height="5" rx="1" fill="#fff"/></svg>`,
}
</script>

<template>
  <span class="flag-icon" :style="{ width: size + 'px', height: (size * 2 / 3) + 'px' }" v-html="flags[code] || flags.id"></span>
</template>

<style scoped>
.flag-icon {
  display: inline-block;
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.08);
}
.flag-icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
