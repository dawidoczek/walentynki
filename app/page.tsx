"use client"

import { useState, useCallback } from "react"
import { IntroStage } from "@/components/valentine/intro-stage"
import { PuzzleStage } from "@/components/valentine/puzzle-stage"
import { FinaleStage } from "@/components/valentine/finale-stage"

type Stage = "intro" | "puzzle" | "finale"

export default function Page() {
  const [stage, setStage] = useState<Stage>("intro")
  const [transitioning, setTransitioning] = useState(false)

  const transitionTo = useCallback((next: Stage) => {
    setTransitioning(true)
    setTimeout(() => {
      setStage(next)
      setTransitioning(false)
    }, 600)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundColor: "hsl(217 50% 6%)",
          opacity: transitioning ? 1 : 0,
          transition: "opacity 0.6s ease-in-out",
        }}
      />

      {stage === "intro" && <IntroStage onStart={() => transitionTo("puzzle")} />}
      {stage === "puzzle" && <PuzzleStage onComplete={() => transitionTo("finale")} />}
      {stage === "finale" && <FinaleStage />}
    </main>
  )
}
