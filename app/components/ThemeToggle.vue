<script setup lang="ts">
const ui = useUiStore()
</script>

<template>
  <button
    class="theme-toggle"
    :class="{ dark: ui.isDark }"
    :title="ui.isDark ? 'Mode terang' : 'Mode gelap'"
    role="switch"
    :aria-checked="ui.isDark"
    @click="ui.toggleTheme()"
  >
    <span class="toggle-track">
      <span class="toggle-thumb">
        <Icon name="i-lucide-sun" class="icon-sun" />
        <Icon name="i-lucide-moon" class="icon-moon" />
      </span>
    </span>
  </button>
</template>

<style scoped>
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: inline-flex;
  align-items: center;
}
.toggle-track {
  position: relative;
  width: 52px;
  height: 28px;
  border-radius: 14px;
  background: var(--border-medium);
  display: block;
  transition: background-color 0.25s ease;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
}
.dark .toggle-track {
  background: var(--accent);
}
.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.25);
}
.dark .toggle-thumb {
  transform: translateX(24px);
}
.icon-sun {
  width: 14px;
  height: 14px;
  color: #F59E0B;
  display: block;
}
.icon-moon {
  width: 14px;
  height: 14px;
  color: #818CF8;
  display: none;
}
.dark .icon-sun { display: none; }
.dark .icon-moon { display: block; }
</style>
