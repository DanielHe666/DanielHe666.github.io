<template>
  <div class="vp-home-bg" aria-hidden="true">
    <video
      v-if="videoSrc"
      class="vp-home-bg__video"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      :src="videoSrc"
    />
    <canvas v-else ref="canvasEl" class="vp-home-bg__canvas" />
    <div class="vp-home-bg__overlay" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'

const HOME_BG_CLASS = 'vp-home-has-bg'

const { frontmatter } = useData()

// Optional: set in gateway/index.md frontmatter
// heroBackgroundVideo: /media/city.mp4  (or full https URL)
const videoSrc = computed(() => {
  const raw = (frontmatter.value as any)?.heroBackgroundVideo
  if (!raw) return ''
  const s = String(raw).trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) return s
  return withBase(s)
})

const canvasEl = ref<HTMLCanvasElement | null>(null)

let raf = 0
let onResize: (() => void) | null = null

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

onMounted(() => {
  document.documentElement.classList.add(HOME_BG_CLASS)

  if (videoSrc.value) return
  const canvas = canvasEl.value
  if (!canvas) return

  if (prefersReducedMotion()) {
    drawStatic(canvas)
    return
  }

  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return

  const particles = createParticles(120)

  const resize = () => {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const { innerWidth: w, innerHeight: h } = window
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  onResize = () => resize()
  window.addEventListener('resize', onResize, { passive: true })
  resize()

  const tick = () => {
    const w = window.innerWidth
    const h = window.innerHeight

    // Clear with transparent fill
    ctx.clearRect(0, 0, w, h)

    // Draw moving bokeh lights (city night vibe)
    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy

      // Wrap around edges
      if (p.x < -p.r) p.x = w + p.r
      if (p.x > w + p.r) p.x = -p.r
      if (p.y < -p.r) p.y = h + p.r
      if (p.y > h + p.r) p.y = -p.r

      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
      grd.addColorStop(0, `color-mix(in srgb, var(--vp-c-brand-1) ${Math.round(p.a * 100)}%, transparent)`)
      grd.addColorStop(1, 'transparent')

      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
    }

    raf = window.requestAnimationFrame(tick)
  }

  raf = window.requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove(HOME_BG_CLASS)
  if (raf) window.cancelAnimationFrame(raf)
  if (onResize) window.removeEventListener('resize', onResize)
})

function drawStatic(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  const w = window.innerWidth
  const h = window.innerHeight
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  ctx.clearRect(0, 0, w, h)
  const pts = createParticles(60)
  for (const p of pts) {
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
    grd.addColorStop(0, `color-mix(in srgb, var(--vp-c-brand-1) ${Math.round(p.a * 100)}%, transparent)`)
    grd.addColorStop(1, 'transparent')
    ctx.fillStyle = grd
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

type Particle = { x: number; y: number; r: number; a: number; vx: number; vy: number }

function createParticles(count: number): Particle[] {
  const w = window.innerWidth
  const h = window.innerHeight
  const out: Particle[] = []
  for (let i = 0; i < count; i++) {
    const r = rand(18, 80)
    out.push({
      x: rand(0, w),
      y: rand(0, h),
      r,
      a: rand(0.08, 0.22),
      vx: rand(-0.12, 0.12),
      vy: rand(-0.06, 0.06)
    })
  }
  return out
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}
</script>
