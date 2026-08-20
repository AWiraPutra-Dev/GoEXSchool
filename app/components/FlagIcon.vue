<script setup lang="ts">
// Bendera negara dari flagcdn.com — resolusi tinggi, warna & proporsi akurat.
const props = defineProps<{ code: string; size?: number }>()
const size = props.size ?? 22

// Mapping kode bahasa → kode bendera ISO 3166-1 alpha-2
const flagMap: Record<string, string> = {
  id: 'id',  // Indonesia
  en: 'gb',  // United Kingdom (Bahasa Inggris)
  zh: 'cn',  // China (Mandarin)
  hi: 'in',  // India (Hindi)
  es: 'es',  // Spain (Spanyol)
  ar: 'sa',  // Saudi Arabia (Arab)
}

const countryName: Record<string, string> = {
  id: 'Indonesia',
  en: 'United Kingdom',
  zh: 'China',
  hi: 'India',
  es: 'Spain',
  ar: 'Saudi Arabia',
}

// SVG fallback inline untuk setiap negara — ditampilkan jika CDN gagal dimuat.
const fallbackSvg: Record<string, string> = {
  id: `<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#fff"/><rect width="60" height="20" fill="#CE1126"/></svg>`,
  en: `<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#012169"/><path d="M0 0l30 20L60 0v4L33 22l27 17v-4L30 18 0 38v-4L27 18 0 4V0z" fill="#fff"/><path d="M0 0l30 20L60 0M0 40l30-20 30 20" stroke="#fff" stroke-width="3"/><path d="M30 0v40M0 0l10 7M60 0l-10 7M0 40l10-7M60 40l-10-7" stroke="#C8102E" stroke-width="5"/></svg>`,
  zh: `<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#DE2910"/><path d="M14 8l2.4 5.4L22 15l-5.6 4.5 2.4 5.4-4.8-3-4.8 3 2.4-5.4L6 15l5.6-.6L14 8z" fill="#FFDE00"/><path d="M22 4l1.2 2.5 2.8.4-2 1.8.4 2.8-2.4-1.4-2.4 1.4.4-2.8-2-1.8 2.8-.4L22 4z" fill="#FFDE00"/><path d="M26 10l1.2 2.5 2.8.4-2 1.8.4 2.8-2.4-1.4-2.4 1.4.4-2.8-2-1.8 2.8-.4L26 10z" fill="#FFDE00"/><path d="M26 16l1.2 2.5 2.8.4-2 1.8.4 2.8-2.4-1.4-2.4 1.4.4-2.8-2-1.8 2.8-.4L26 16z" fill="#FFDE00"/><path d="M22 20l1.2 2.5 2.8.4-2 1.8.4 2.8-2.4-1.4-2.4 1.4.4-2.8-2-1.8 2.8-.4L22 20z" fill="#FFDE00"/></svg>`,
  hi: `<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#fff"/><rect width="60" height="13.33" fill="#FF9933"/><rect y="26.67" width="60" height="13.33" fill="#138808"/><circle cx="30" cy="20" r="5" fill="none" stroke="#000080" stroke-width="1.6"/><path d="M30 15v10M26.2 20h7.6M27 17.6l6 4.8M33 17.6l-6 4.8" stroke="#000080" stroke-width="1.2"/></svg>`,
  es: `<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/></svg>`,
  ar: `<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#006C35"/><path d="M30 26l-4-6.4L30 10l4 9.6L30 26z" fill="#fff"/><path d="M30 10l2 3h-4L30 10z" fill="#fff"/><rect x="12" y="12" width="4" height="10" rx="2" fill="#fff"/></svg>`,
}

const flagCode = computed(() => flagMap[props.code] || 'id')
const flagUrl = computed(() => `https://flagcdn.com/w80/${flagCode.value}.png`)
const showFallback = ref(false)

function onImgError() {
  showFallback.value = true
}
</script>

<template>
  <span
    class="flag-icon"
    :style="{ width: size + 'px', height: Math.round(size * 2 / 3) + 'px' }"
  >
    <img
      v-if="!showFallback"
      :src="flagUrl"
      :alt="countryName[props.code] || 'Country'"
      class="flag-img"
      width="80"
      height="53"
      loading="lazy"
      @error="onImgError"
    />
    <span
      v-else
      class="flag-fallback"
      v-html="fallbackSvg[flagCode] || fallbackSvg.id"
    />
  </span>
</template>

<style scoped>
.flag-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
  background: #f0f0f0;
}
.flag-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
.flag-fallback {
  width: 100%;
  height: 100%;
  display: flex;
}
.flag-fallback :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
