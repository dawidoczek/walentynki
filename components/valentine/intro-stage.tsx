"use client"

import { useCallback, useMemo } from "react"
import { Heart } from "lucide-react"

interface IntroStageProps {
  onStart: () => void
}

export function IntroStage({ onStart }: IntroStageProps) {
  const questionMarks = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100, 
        size: 20 + Math.random() * 40, 
        delay: -(Math.random() * 20), 
        duration: 10 + Math.random() * 15,
        opacity: 0.1 + Math.random() * 0.3,
      })),
    []
  )

  const handleStart = useCallback(() => {
    onStart()
  }, [onStart])

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 15%, #f093fb 30%, #f5576c 45%, #fda085 55%, #f6d365 70%, #43e97b 85%, #667eea 100%)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 8s ease infinite",
        }}
      />
      <div className="absolute inset-0 bg-[#0c1629]/40" />
      {questionMarks.map((qm) => (
        <span
          key={qm.id}
          className="pointer-events-none absolute select-none font-serif font-bold text-foreground"
          style={{
            left: `${qm.left}%`,
            bottom: "-50px", 
            fontSize: `${qm.size}px`,
            opacity: qm.opacity,
            animation: `flyUp ${qm.duration}s linear ${qm.delay}s infinite`,
          }}
        >
          ?
        </span>
      ))}
      <div
        className="relative z-10 flex flex-col items-center gap-8"
        style={{ animation: "fade-in-up 1s ease-out" }}
      >
        <div className="flex items-center gap-3">
          <Heart
            className="h-10 w-10 text-accent"
            style={{ animation: "heartbeat 1.5s ease-in-out infinite" }}
            fill="currentColor"
          />
          
          <h1
            className="text-5xl font-bold text-blue-300 md:text-7xl"
            style={{
              fontFamily: "var(--font-dancing), cursive",
              animation: "blueHeartbeat 2s ease-in-out infinite",
              textShadow: "0 0 10px rgba(147, 197, 253, 0.5)"
            }}  
          >
            {"Witaj Janek"}
          </h1>
  
          <Heart
            className="h-10 w-10 text-accent"
            style={{ animation: "heartbeat 1.5s ease-in-out 0.3s infinite" }}
            fill="currentColor"
          />
        </div>

        <p className="text-lg text-foreground/70 md:text-xl">
          {"Co to może być..."}
        </p>

        <button
          onClick={handleStart}
          className="group relative mt-4 rounded-full bg-primary px-12 py-4 text-lg font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Heart className="h-5 w-5" fill="currentColor" />
            Rozpocznij
            <Heart className="h-5 w-5" fill="currentColor" />
          </span>
        </button>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes flyUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1; /* Szybko się pojawiają */
          }
          90% {
            opacity: 1;
          }
          100% {
            /* Lecą do góry poza ekran (120vh) i lekko się kręcą */
            transform: translateY(-120vh) rotate(20deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}