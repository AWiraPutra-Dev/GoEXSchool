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
    :style="{ '--accent-color': color }"
  >
    <div class="stat-top-border" :style="{ background: color }"></div>
    <div class="stat-body">
      <div class="stat-icon-wrap">
        <Icon :name="icon" class="stat-icon" :style="{ color }" />
      </div>
      <div class="stat-text">
        <p class="stat-value">{{ value }}</p>
        <p class="stat-label">{{ label }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.stat-top-border {
  height: 3px;
  flex-shrink: 0;
}

.stat-body {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
}

.stat-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 9px;
  background: var(--bg-hover);
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

.stat-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
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
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
