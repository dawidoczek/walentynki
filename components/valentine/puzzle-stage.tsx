"use client"

import { useState, useCallback, useEffect } from "react"
import { AlertTriangle, Loader2, Shield, RefreshCw } from "lucide-react"

interface PuzzleStageProps {
  onComplete: () => void
}

const GRID_SIZE = 3
const TOTAL_TILES = GRID_SIZE * GRID_SIZE
function isSolvable(tiles: number[]): boolean {
  let inversions = 0
  const filtered = tiles.filter((t) => t !== 0) 
  for (let i = 0; i < filtered.length; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      if (filtered[i] > filtered[j]) inversions++
    }
  }
  return inversions % 2 === 0
}

function shuffleTiles(): number[] {

  let solvedState = Array.from({ length: TOTAL_TILES }, (_, i) => (i + 1) % 9)
  
  let tiles: number[]
  do {
    tiles = [...solvedState]
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]]
    }
  } while (!isSolvable(tiles) || isSolved(tiles))

  return tiles
}

function isSolved(tiles: number[]): boolean {
  return tiles.every((tile, index) => {
    if (index === TOTAL_TILES - 1) return tile === 0
    return tile === index + 1
  })
}

function getPos(index: number): [number, number] {
  return [index % GRID_SIZE, Math.floor(index / GRID_SIZE)]
}

type Phase = "loading" | "error" | "captcha"

export function PuzzleStage({ onComplete }: PuzzleStageProps) {
  const [phase, setPhase] = useState<Phase>("loading")
  const [loadingText, setLoadingText] = useState("Ładowanie twojej niespodzianki...")
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  // Inicjalizacja kafelków
  const [tiles, setTiles] = useState<number[]>(() => shuffleTiles())
  
  const [solved, setSolved] = useState(false)
  const [tileSize, setTileSize] = useState(90)
  const [showCaptcha, setShowCaptcha] = useState(false)

  // Fake loading sequence
  useEffect(() => {
    const texts = [
      "Ładowanie niespodzianki...",
      "Łączenie z serwerem...",
      "Wytwarzanie uczuć...",
      "Prawie gotowe...",
    ]
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step < texts.length) {
        setLoadingText(texts[step])
        setLoadingProgress(step * 25)
      }
      if (step >= texts.length) {
        setLoadingProgress(78)
        clearInterval(interval)
        setTimeout(() => {
          setPhase("error")
        }, 600)
      }
    }, 900)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function updateSize() {
      const w = window.innerWidth
      if (w < 380) setTileSize(70)
      else if (w < 500) setTileSize(80)
      else setTileSize(90)
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const handleTileClick = useCallback(
    (clickedIndex: number) => {
      if (solved) return
      
      const emptyIndex = tiles.indexOf(0)
      const [cx, cy] = getPos(clickedIndex)
      const [ex, ey] = getPos(emptyIndex)

      const isAdjacent =
        (Math.abs(cx - ex) === 1 && cy === ey) ||
        (Math.abs(cy - ey) === 1 && cx === ex)

      if (!isAdjacent) return

      const newTiles = [...tiles];
      [newTiles[clickedIndex], newTiles[emptyIndex]] = [
        newTiles[emptyIndex],
        newTiles[clickedIndex],
      ]
      setTiles(newTiles)

      if (isSolved(newTiles)) {
        setSolved(true)
        setTimeout(() => onComplete(), 1200)
      }
    },
    [tiles, solved, onComplete]
  )

  const handleShuffle = useCallback(() => {
    setTiles(shuffleTiles())
    setSolved(false)
  }, [])

  const handleShowCaptcha = useCallback(() => {
    setPhase("captcha")
    setTimeout(() => setShowCaptcha(true), 50)
  }, [])

  const gridPx = tileSize * GRID_SIZE + 8

  const bgStyle = {
    background:
      "radial-gradient(ellipse at 50% 30%, hsl(217 50% 12%) 0%, hsl(217 50% 6%) 70%)",
  }

  if (phase === "loading") {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-6 px-4"
        style={bgStyle}
      >
        <Loader2
          className="h-12 w-12 text-primary animate-spin"
        />
        <div className="flex flex-col items-center gap-3" style={{ animation: "fade-in-up 0.4s ease-out" }}>
          <p className="text-lg font-medium text-foreground">{loadingText}</p>
          <div className="h-2 w-64 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{loadingProgress}%</p>
        </div>
      </div>
    )
  }

  if (phase === "error") {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-6 px-4"
        style={bgStyle}
      >
        <div
          className="flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-destructive/30 bg-card p-8"
          style={{ animation: "fade-in-up 0.5s ease-out" }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h2 className="text-xl font-bold text-foreground">
              Wykryto podejrzaną aktywność
            </h2>
            <p className="text-sm text-muted-foreground">
              Error 403: bot activity detected
            </p>
            <p className="text-sm text-muted-foreground">
              Proszę zweryfikować, że jesteś człowiekiem, aby kontynuować.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-lg border border-border bg-secondary/30 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>Wymagana weryfikacja człowieczeństwa</span>
            </div>
            <div className="h-1 w-full rounded-full bg-destructive/20">
              <div className="h-full w-[78%] rounded-full bg-destructive/60" />
            </div>
            <p className="text-xs text-muted-foreground">
              Proszę wypełnić captcha, aby udowodnić że jesteś człowiekiem i odblokować swoją niespodziankę!
            </p>
          </div>
          <button
            onClick={handleShowCaptcha}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          >
            <Shield className="h-4 w-4" />
            Zweryfikuj
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-5 px-4"
      style={bgStyle}
    >
      <div
        className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6"
        style={{
          animation: showCaptcha ? "fade-in-up 0.5s ease-out" : "none",
          opacity: showCaptcha ? 1 : 0,
        }}
      >
        <div className="flex w-full items-center gap-3 rounded-lg bg-primary/10 px-4 py-2.5">
          <Shield className="h-5 w-5 shrink-0 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              Weryfikacja bezpieczeństwa
            </span>
            <span className="text-xs text-muted-foreground">
              Rozwiąż zagadkę, aby zweryfikować że jesteś człowiekiem
            </span>
          </div>
        </div>

        <div className="flex w-full items-center gap-3">
          <div className="overflow-hidden rounded-lg border border-border">
            <img
              src="/dawid2.jpeg"
              alt="Target arrangement"
              className="h-16 w-16 object-cover"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-medium text-foreground">
              Ułóż kafelki, aby dopasować obrazek
            </p>
            <p className="text-xs text-muted-foreground">
              Kliknij kafelki obok pustego pola, aby je przesunąć
            </p>
          </div>
        </div>

        <div
          className="relative rounded-xl border border-border bg-secondary/40 p-1"
          style={{
            width: gridPx,
            height: gridPx,
          }}
        >
          {tiles.map((tile, index) => {
            if (tile === 0) return null
            
            const [x, y] = getPos(index)     
            const srcCol = (tile - 1) % GRID_SIZE
            const srcRow = Math.floor((tile - 1) / GRID_SIZE)

            return (
              <button
                key={tile}
                onClick={() => handleTileClick(index)}
                className="absolute cursor-pointer overflow-hidden rounded-md border border-primary/10 shadow-sm transition-all duration-200 ease-out hover:z-10 hover:brightness-110 hover:shadow-md hover:shadow-primary/10"
                style={{
                  width: tileSize - 3,
                  height: tileSize - 3,
                  left: x * tileSize + 4,
                  top: y * tileSize + 4,
                  backgroundImage: "url(/dawid2.jpeg)",
                  backgroundSize: `${tileSize * GRID_SIZE - 8}px ${tileSize * GRID_SIZE - 8}px`,
                  backgroundPosition: `-${srcCol * (tileSize - 3)}px -${srcRow * (tileSize - 3)}px`,
                }}
                aria-label={`Tile ${tile}`}
              >
                <span className="absolute bottom-1 right-1 text-[10px] font-bold text-white drop-shadow-md">
                   {tile}
                </span>
              </button>
            )
          })}

          {solved && (
            <div
              className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-card/80 backdrop-blur-sm"
              style={{ animation: "fade-in-up 0.4s ease-out" }}
            >
              <Shield className="mb-1 h-8 w-8 text-green-400" />
              <p className="text-sm font-bold text-green-400">
                Verified
              </p>
            </div>
          )}
        </div>

        <div className="flex w-full items-center justify-between">
          <button
            onClick={handleShuffle}
            disabled={solved}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
          >
            <RefreshCw className="h-3 w-3" />
            Reset
          </button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className={`h-1.5 w-1.5 rounded-full ${solved ? "bg-green-400" : "bg-amber-400 animate-pulse"}`} />
            {solved ? "Weryfikacja zakończona" : "Czekam na rozwiązanie..."}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground/40">
        Protected by LoveSecurity v2.14
      </p>
    </div>
  )
}