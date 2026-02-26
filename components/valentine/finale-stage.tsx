"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Heart, Sparkles } from "lucide-react"
import { Fireworks } from "./fireworks"

export function FinaleStage() {
  const [loading, setLoading] = useState(true)
  const [showQuestion, setShowQuestion] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null)
  
  const [isSafe, setIsSafe] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const noBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setTimeout(() => setShowQuestion(true), 100)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showQuestion && noBtnRef.current) {
      if (noBtnRef.current.matches(':hover')) {
        setIsSafe(true)
      }
    }
  }, [showQuestion])

  const evadeNo = useCallback(() => {
    if (isSafe) return
    if (!containerRef.current || !noBtnRef.current) return
    const container = containerRef.current.getBoundingClientRect()
    const btn = noBtnRef.current.getBoundingClientRect()
    const maxX = container.width - btn.width - 20
    const maxY = container.height - btn.height - 20
    const newX = Math.max(20, Math.random() * maxX)
    const newY = Math.max(20, Math.random() * maxY)
    setNoPos({ x: newX, y: newY })
  }, [isSafe]) 

  const handleMouseLeave = useCallback(() => {
    if (isSafe) {
      setIsSafe(false)
    }
  }, [isSafe])

  const handleYes = useCallback(() => {
    setAnswered(true)
  }, [])

  const bgStyle = {
    background:
      "radial-gradient(ellipse at 50% 40%, hsl(217 50% 14%) 0%, hsl(217 50% 6%) 70%)",
  }

  if (loading) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-6"
        style={bgStyle}
      >
        <div className="relative">
          <Heart
            className="h-20 w-20 text-accent"
            fill="currentColor"
            style={{ animation: "heartbeat 1s ease-in-out infinite" }}
          />
          <Sparkles
            className="absolute -right-3 -top-3 h-8 w-8 text-primary"
            style={{ animation: "float 2s ease-in-out infinite" }}
          />
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                animation: "loadingBar 5s ease-in-out forwards",
              }}
            />
          </div>
          <p
            className="text-sm text-muted-foreground"
            style={{ animation: "fade-in-up 0.5s ease-out" }}
          >
            {"Przygotowywanie czegoś specjalnego..."}
          </p>
        </div>
        <style jsx>{`
          @keyframes loadingBar {
            0% {
              width: 0%;
            }
            30% {
              width: 30%;
            }
            60% {
              width: 50%;
            }
            100% {
              width: 100%;
            }
          }
        `}</style>
      </div>
    )
  }

  if (answered) {
    return (
      <div
        className="relative flex min-h-screen flex-col items-center justify-center"
        style={bgStyle}
      >
        <Fireworks />
        <FloatingHearts />
        <div
          className="relative z-30 flex flex-col items-center gap-6 px-4"
          style={{ animation: "fade-in-up 0.8s ease-out" }}
        >
          <Heart
            className="h-20 w-20 text-accent md:h-28 md:w-28"
            fill="currentColor"
            style={{ animation: "heartbeat 1.2s ease-in-out infinite" }}
          />
<h2
  className="bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 bg-clip-text text-transparent text-balance text-center text-5xl font-bold leading-tight md:text-7xl lg:text-8xl"
  style={{ 
    fontFamily: "var(--font-dancing), cursive",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" 
  }}
>
            Yupi Kocham cię Jasiu :33
          </h2>
          <p className="max-w-md text-balance text-center text-xl text-primary/80 md:text-2xl">
            {"Szczęśliwych Walentynek!"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden px-4"
      style={bgStyle}
    >
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full bg-primary/30"
          style={{
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 5}s ease-in-out ${Math.random() * 5}s infinite`,
          }}
        />
      ))}

      {showQuestion && (
        <div
          className="relative z-10 flex flex-col items-center gap-10"
          style={{ animation: "fade-in-up 1s ease-out" }}
        >
          <Heart
            className="h-16 w-16 text-accent md:h-20 md:w-20"
            fill="currentColor"
            style={{ animation: "heartbeat 1.5s ease-in-out infinite" }}
          />

<h1
className="bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 bg-clip-text text-transparent text-balance text-center text-5xl font-bold leading-normal pb-4 md:text-7xl lg:text-8xl"  style={{ 
    fontFamily: "var(--font-dancing), cursive",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" 
  }}
>
            {"Janek, czy zostaniesz moją Walentynką?"}
          </h1>

          <div className="flex items-center gap-6">
            <button
              onClick={handleYes}
              className="group relative overflow-hidden rounded-full bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/50 active:scale-95 md:px-14 md:py-5 md:text-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Heart
                  className="h-5 w-5 transition-transform group-hover:scale-125"
                  fill="currentColor"
                />
                Tak
                <Heart
                  className="h-5 w-5 transition-transform group-hover:scale-125"
                  fill="currentColor"
                />
              </span>
              <div
                className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                }}
              />
            </button>

            <button
              ref={noBtnRef}
              onMouseEnter={evadeNo}
              onTouchStart={evadeNo}
              onMouseLeave={handleMouseLeave}
              className="rounded-full bg-secondary px-10 py-4 text-lg font-bold text-secondary-foreground transition-all duration-100 hover:bg-secondary md:px-14 md:py-5 md:text-xl"
              style={
                noPos
                  ? {
                      position: "fixed",
                      left: noPos.x,
                      top: noPos.y,
                      zIndex: 40,
                      transition: "none",
                    }
                  : {}
              }
            >
              Nie 
            </button>
          </div>

          <p className="text-sm italic text-muted-foreground/60">
            {"(Wybierz mądrze...)"}
          </p>
        </div>
      )}
    </div>
  )
}

function FloatingHearts() {
  const [hearts, setHearts] = useState<
    { id: number; x: number; size: number; delay: number; duration: number; color: string }[]
  >([])
  const nextId = useRef(0)

  useEffect(() => {
    const colors = [
      "hsl(330 80% 65%)",
      "hsl(217 91% 60%)",
      "hsl(330 80% 75%)",
      "hsl(217 91% 70%)",
      "hsl(280 60% 65%)",
    ]

    function spawnHeart() {
      const id = nextId.current++
      setHearts((prev) => [
        ...prev.slice(-40),
        {
          id,
          x: Math.random() * 100,
          size: 14 + Math.random() * 24,
          delay: 0,
          duration: 3 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ])
    }

    for (let i = 0; i < 8; i++) {
      setTimeout(spawnHeart, i * 100)
    }

    const interval = setInterval(spawnHeart, 300)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const cleanup = setInterval(() => {
      setHearts((prev) => prev.slice(-30))
    }, 5000)
    return () => clearInterval(cleanup)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.x}%`,
            bottom: "-40px",
            animation: `floatUp ${h.duration}s ease-out forwards`,
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill={h.color}
            style={{
              opacity: 0.7,
              animation: `heartSway 2s ease-in-out ${Math.random() * 2}s infinite alternate`,
            }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      ))}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
            transform: translateY(-10vh) scale(1);
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) scale(0.8);
            opacity: 0;
          }
        }
        @keyframes heartSway {
          0% {
            transform: translateX(-12px) rotate(-8deg);
          }
          100% {
            transform: translateX(12px) rotate(8deg);
          }
        }
      `}</style>
    </div>
  )
}