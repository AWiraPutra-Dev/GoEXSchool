<template>
  <div class="chart-card">
    <h3 class="chart-title">{{ title }}</h3>
    <div class="chart-body">
      <div class="chart-canvas-wrap">
        <canvas ref="canvasRef"></canvas>
      </div>
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

  const defaultColors = ['#6366F1', '#8B5CF6', '#0EA5E9', '#10B981', '#F59E0B', '#F43F5E', '#14B8A6', '#64748B']

  // Font konsisten dengan aplikasi
  const uiFont = "'Segoe UI', 'Roboto', 'Open Sans', sans-serif"

  chartInstance = new Chart(canvasRef.value, {
    type: props.type === 'doughnut' ? 'doughnut' : props.type,
    data: {
      labels: props.labels,
      datasets: props.datasets.map((ds) => ({
        ...ds,
        backgroundColor: ds.backgroundColor || defaultColors,
        borderColor: ds.borderColor || '#ffffff',
        borderWidth: props.type === 'doughnut' || props.type === 'pie' ? 2 : 1
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      // Supersampling 2x: canvas dirender di resolusi ganda lalu di-downscale,
      // sehingga teks & garis selalu tajam/HD di layar mana pun (termasuk saat
      // halaman memakai zoom < 1). ResizeObserver akan menyesuaikan ukuran.
      devicePixelRatio: (window.devicePixelRatio || 1) * 2,
      animation: false,
      layout: {
        padding: { top: 4, right: 4, bottom: 4, left: 4 }
      },
      scales: props.type === 'line' || props.type === 'bar' || props.type === 'radar'
        ? {
            x: {
              ticks: { font: { size: 11, family: uiFont, weight: 500 }, color: '#64748B', maxRotation: 0 },
              grid: { color: 'rgba(100, 116, 139, 0.12)' },
              border: { display: false }
            },
            y: {
              beginAtZero: true,
              ticks: { font: { size: 11, family: uiFont, weight: 500 }, color: '#64748B', precision: 0 },
              grid: { color: 'rgba(100, 116, 139, 0.12)' },
              border: { display: false }
            }
          }
        : undefined,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 12, family: uiFont, weight: 500 },
            color: '#64748B',
            padding: 14,
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 8,
            boxHeight: 8
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleFont: { size: 12, weight: 600, family: uiFont },
          bodyFont: { size: 12, family: uiFont },
          padding: 10,
          cornerRadius: 8,
          displayColors: true,
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true
        }
      },
      ...props.options
    }
  } as any)
}

// Redraw saat ukuran kartu berubah (layout/lebar layar) agar selalu sinkron
// dengan container — mencegah canvas discale → blur.
let resizeObserver: ResizeObserver | null = null
function observeResize() {
  if (!canvasRef.value || typeof ResizeObserver === 'undefined') return
  resizeObserver = new ResizeObserver(() => {
    if (chartInstance) chartInstance.resize()
  })
  resizeObserver.observe(canvasRef.value)
}

onMounted(() => {
  createChart()
  observeResize()
  // Re-render sekali setelah frame pertama agar ukuran benar-benar final
  requestAnimationFrame(() => chartInstance?.resize())
})
watch(() => [props.labels, props.datasets], createChart, { deep: true })
onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
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
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  font-size: 12px;
  padding: 12px 16px;
  letter-spacing: 0.02em;
  border-bottom: 1px solid var(--border-light);
}
.chart-title::before {
  content: '';
  width: 4px;
  height: 14px;
  border-radius: 2px;
  background: var(--accent);
  flex-shrink: 0;
}
.chart-body {
  padding: 16px;
}
/* Wrapper dengan tinggi tetap: Chart.js mengukur container ini dan merender
   canvas tepat seukuran container — tidak ada scaling ekstra dari CSS. */
.chart-canvas-wrap {
  position: relative;
  height: 240px;
}
.chart-canvas-wrap canvas {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
}
</style>
