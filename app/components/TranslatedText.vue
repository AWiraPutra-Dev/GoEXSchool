<script setup lang="ts">
// Terjemahkan teks dinamis (postingan admin/operator, artikel, dll).
// Menampilkan teks asli dulu, lalu otomatis ganti ke terjemahan saat siap —
// tanpa memblokir UI. Hasil di-cache di localStorage supaya tidak
// diterjemahkan ulang. Komentar & template surat sengaja TIDAK dipakai di sini.
const props = defineProps<{ text?: string | null }>()

const ui = useUiStore()
const translated = ref<string | null>(null)
const isId = computed(() => ui.locale === 'id')

watch(
  () => [props.text, ui.locale] as const,
  async ([text]) => {
    translated.value = null
    if (!text?.trim() || isId.value) return
    translated.value = await ui.translateText(text)
  },
  { immediate: true }
)

const shown = computed(() => translated.value ?? props.text ?? '')
</script>

<template>
  <span class="translated-text">{{ shown }}</span>
</template>
