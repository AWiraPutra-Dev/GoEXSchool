<script setup lang="ts">
import { LOCALES } from '~/i18n'

const ui = useUiStore()
const open = ref(false)

function select(code: any) {
  ui.setLocale(code)
  open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
function onDocClick() { open.value = false }
</script>

<template>
  <div class="lang-wrap" @click.stop>
    <button class="lang-btn" :class="{ open }" title="Bahasa / Language" @click="open = !open">
      <FlagIcon :code="ui.locale" :size="14" />
      <span class="lang-code">{{ ui.locale.toUpperCase() }}</span>
      <Icon name="i-lucide-chevron-down" class="w-3 h-3" />
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
          <FlagIcon :code="l.code" :size="16" />
          <span class="lang-item-label">{{ l.label }}</span>
          <span class="lang-item-native">{{ l.native }}</span>
          <Icon v-if="ui.locale === l.code" name="i-lucide-check" class="w-3.5 h-3.5 lang-check" />
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
  gap: 4px;
  height: 28px;
  padding: 0 8px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.2s;
}
.lang-btn:hover { background: rgba(0,0,0,0.04); }
.lang-btn.open { background: rgba(0,0,0,0.06); }
.lang-code { letter-spacing: 0.5px; }
.lang-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: -4px;
  width: 200px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  padding: 4px;
  z-index: 300;
}
.lang-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  font-size: 12px;
  transition: background 0.15s;
}
.lang-item:hover { background: var(--bg-hover); }
.lang-item.active { background: var(--olive-bg); }
.lang-item-label { font-weight: 600; color: var(--text-primary); }
.lang-item-native { font-size: 11px; color: var(--text-muted); margin-right: auto; }
.lang-check { color: var(--olive-primary); flex-shrink: 0; }
.lang-pop-enter-active, .lang-pop-leave-active { transition: opacity 0.12s, transform 0.12s; }
.lang-pop-enter-from, .lang-pop-leave-to { opacity: 0; transform: translateY(-4px); }
</style>