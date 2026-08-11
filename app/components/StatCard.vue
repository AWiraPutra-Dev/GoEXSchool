<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon: string
  color: string
}>()
</script>

<template>
  <div
    class="stat-card"
    :style="{ background: color }"
  >
    <div>
      <p class="stat-value">{{ value }}</p>
      <p class="stat-label">{{ label }}</p>
    </div>
    <Icon :name="icon" class="stat-icon" />
  </div>
</template>

<style scoped>
.stat-card {
  border-radius: 12px;
  padding: 18px 20px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 150px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.stat-value {
  font-size: var(--text-stat);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

.stat-label {
  font-size: var(--text-sm);
  margin-top: 4px;
  opacity: 0.9;
  font-weight: var(--font-medium);
}

.stat-icon {
  width: 28px;
  height: 28px;
  opacity: 0.8;
  flex-shrink: 0;
}
</style>
