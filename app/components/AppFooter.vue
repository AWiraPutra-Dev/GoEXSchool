<script setup lang="ts">
const ui = useUiStore()
</script>

<template>
  <footer class="app-footer">
    <span>&copy; {{ new Date().getFullYear() }} StudentBase · {{ ui.t('footer.rights') }}</span>
    <span class="footer-version">v1.0.0</span>
  </footer>
</template>

<style scoped>
.app-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: var(--bg-header);
  border-top: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-size: var(--text-xs);
  color: var(--text-muted);
  z-index: 100;
}

.footer-version {
  color: var(--text-muted);
}
</style>
