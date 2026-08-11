<template>
  <div class="chart-card">
    <h3 class="chart-title">{{ title }}</h3>
    <div class="chart-body">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  DoughnutController,
  PieController,
  RadarController
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  DoughnutController,
  PieController,
  RadarController
)

const props = defineProps<{
  title: string
  type: 'line' | 'bar' | 'doughnut' | 'pie' | 'radar'
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    fill?: boolean
  }[]
  options?: Record<string, any>
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function createChart() {
  if (!canvasRef.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const defaultColors = ['#4A9E9E', '#8B9467', '#D4956A', '#D46A5A', '#7BA87B', '#D4C089', '#2D6A6A', '#9CA37A']

  chartInstance = new Chart(canvasRef.value, {
    type: props.type === 'doughnut' ? 'doughnut' : props.type,
    data: {
      labels: props.labels,
      datasets: props.datasets.map((ds, i) => ({
        ...ds,
        backgroundColor: ds.backgroundColor || defaultColors,
        borderColor: ds.borderColor || '#ffffff',
        borderWidth: props.type === 'doughnut' || props.type === 'pie' ? 2 : 1
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 11, family: "'Segoe UI', sans-serif" },
            padding: 12,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: '#2C3E50',
          titleFont: { size: 12 },
          bodyFont: { size: 11 },
          padding: 10,
          cornerRadius: 8
        }
      },
      ...props.options
    }
  } as any)
}

onMounted(createChart)
watch(() => [props.labels, props.datasets], createChart, { deep: true })
onUnmounted(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<style scoped>
.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.chart-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.chart-title {
  background: var(--olive-primary);
  color: white;
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  font-size: 12px;
  padding: 10px 16px;
  letter-spacing: 0.02em;
}
.chart-body {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}
.chart-body canvas {
  max-height: 260px;
  max-width: 100%;
}
</style>
