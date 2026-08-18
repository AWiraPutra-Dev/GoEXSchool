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
    :style="{ borderLeftColor: color }"
  >
    <div>
      <p class="stat-value">{{ value }}</p>
      <p class="stat-label">{{ label }}</p>
    </div>
    <div
      class="stat-icon-wrap"
      :style="{ background: `color-mix(in srgb, ${color} 12%, #FFFFFF)`, color }"
    >
      <Icon :name="icon" class="stat-icon" />
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-left: 4px solid var(--teal);
  border-radius: 10px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 140px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.stat-value {
  font-size: 22px;
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: var(--text-xs);
  margin-top: 3px;
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.stat-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
</style>
