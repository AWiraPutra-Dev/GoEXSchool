<script setup lang="ts">
import { LOCALES } from '~/i18n'

const ui = useUiStore()
const open = ref(false)

function select(code: any) {
  ui.setLocale(code)
  open.value = false
}

// Tutup dropdown saat klik di luar.
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
function onDocClick() { open.value = false }
</script>

<template>
  <div class="lang-wrap" @click.stop>
    <button class="lang-btn" :class="{ open }" title="Bahasa / Language" @click="open = !open">
      <FlagIcon :code="ui.locale" />
      <span class="lang-code">{{ ui.locale.toUpperCase() }}</span>
      <Icon name="i-lucide-chevron-down" class="w-3.5 h-3.5" />
    </button>
    <transition name="lang-pop">
      <div v-if="open" class="lang-dropdown">
        <button
          v-for="l in LOCALES"
          :key="l.code"
          class="lang-item"
          :class="{ active: ui.locale === l.code }"
          @click="select(l.code)"
        >
          <FlagIcon :code="l.code" :size="20" />
          <span class="lang-item-label">{{ l.label }}</span>
          <span class="lang-item-native">{{ l.native }}</span>
          <Icon v-if="ui.locale === l.code" name="i-lucide-check" class="w-4 h-4 lang-check" />
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.lang-wrap { position: relative; }
.lang-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  transition: all 0.2s;
}
.lang-btn:hover, .lang-btn.open { background: var(--olive-bg); color: var(--olive-primary); border-color: var(--olive-light); }
.lang-code { letter-spacing: 0.5px; }
.lang-dropdown {
  position: absolute;
  top: 44px;
  right: 0;
  width: 240px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.18);
  padding: 6px;
  z-index: 300;
}
.lang-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}
.lang-item:hover { background: var(--bg-hover); }
.lang-item.active { background: var(--olive-bg); }
.lang-item-label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.lang-item-native { font-size: var(--text-xs); color: var(--text-muted); margin-right: auto; }
.lang-check { color: var(--olive-primary); flex-shrink: 0; }
.lang-pop-enter-active, .lang-pop-leave-active { transition: opacity 0.15s, transform 0.15s; }
.lang-pop-enter-from, .lang-pop-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
