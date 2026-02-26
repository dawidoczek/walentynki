"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
  isHeart: boolean
}

interface Firework {
  x: number
  y: number
  targetY: number
  vy: number
  exploded: boolean
  color: string
  particles: Particle[]
}

const COLORS = [
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#f472b6",
  "#fb7185",
  "#c084fc",
  "#e0f2fe",
  "#fda4af",
]

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let fireworks: Firework[] = []

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    function createFirework(): Firework {
      if (!canvas) {
        return {
          x: 400,
          y: 600,
          targetY: 200,
          vy: -12 - Math.random() * 4,
          exploded: false,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          particles: [],
        }
      }
      return {
        x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
        y: canvas.height,
        targetY: Math.random() * canvas.height * 0.4 + canvas.height * 0.1,
        vy: -12 - Math.random() * 4,
        exploded: false,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        particles: [],
      }
    }

    function explode(fw: Firework) {
      const count = 50 + Math.floor(Math.random() * 30)
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3
        const speed = 2 + Math.random() * 5
        const isHeart = Math.random() > 0.75
        fw.particles.push({
          x: fw.x,
          y: fw.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 70 + Math.random() * 50,
          maxLife: 120,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: isHeart ? 5 : 1.5 + Math.random() * 2,
          isHeart,
        })
      }
      fw.exploded = true
    }

    function drawHeart(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number
    ) {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.beginPath()
      const s = size
      ctx.moveTo(x, y + s / 4)
      ctx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s / 4)
      ctx.bezierCurveTo(x - s / 2, y + s / 2, x, y + s * 0.7, x, y + s)
      ctx.bezierCurveTo(x, y + s * 0.7, x + s / 2, y + s / 2, x + s / 2, y + s / 4)
      ctx.bezierCurveTo(x + s / 2, y, x, y, x, y + s / 4)
      ctx.fill()
      ctx.restore()
    }

    function animate() {
      if (!ctx || !canvas) return

      // Semi-transparent clear for trail effect
      ctx.fillStyle = "rgba(12, 22, 41, 0.12)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Spawn fireworks more frequently
      if (Math.random() < 0.08) {
        fireworks.push(createFirework())
      }

      fireworks = fireworks.filter((fw) => {
        if (!fw.exploded) {
          fw.y += fw.vy
          fw.vy += 0.15

          ctx.beginPath()
          ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2)
          ctx.fillStyle = fw.color
          ctx.fill()

          for (let i = 0; i < 3; i++) {
            ctx.beginPath()
            ctx.arc(
              fw.x + (Math.random() - 0.5) * 4,
              fw.y + Math.random() * 10,
              1,
              0,
              Math.PI * 2
            )
            ctx.fillStyle = fw.color
            ctx.globalAlpha = 0.5
            ctx.fill()
            ctx.globalAlpha = 1
          }

          if (fw.y <= fw.targetY) {
            explode(fw)
          }
          return true
        }

        fw.particles = fw.particles.filter((p) => {
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.03
          p.vx *= 0.99
          p.life--

          const alpha = Math.max(0, p.life / p.maxLife)

          if (p.isHeart) {
            drawHeart(ctx, p.x, p.y, p.size, p.color, alpha)
          } else {
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2)
            ctx.fillStyle = p.color
            ctx.globalAlpha = alpha
            ctx.fill()
            ctx.globalAlpha = 1
          }

          return p.life > 0
        })

        return fw.particles.length > 0
      })

      animationId = requestAnimationFrame(animate)
    }

    // Initial burst of fireworks
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        fireworks.push(createFirework())
      }, i * 150)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10"
      aria-hidden="true"
    />
  )
}
