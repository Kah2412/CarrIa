"use client"

import { useState, useEffect, useCallback } from "react"
import { Sun, Moon, ZoomIn, ZoomOut, Volume2, VolumeX } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function AccessibilityToolbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isNarratorActive, setIsNarratorActive] = useState(false)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis)
    }
  }, [])

  // Apply zoom level to document
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.fontSize = `${zoomLevel}%`
    }
  }, [zoomLevel])

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 80))
  }

  const toggleNarrator = useCallback(() => {
    if (!speechSynthesis) return

    if (isNarratorActive) {
      speechSynthesis.cancel()
      setIsNarratorActive(false)
    } else {
      setIsNarratorActive(true)
      // Announce that narrator is active
      const utterance = new SpeechSynthesisUtterance(
        "Narrador ativado. Clique em qualquer texto para ouvi-lo."
      )
      utterance.lang = "pt-BR"
      speechSynthesis.speak(utterance)
    }
  }, [isNarratorActive, speechSynthesis])

  // Handle text narration when narrator is active
  useEffect(() => {
    if (!isNarratorActive || !speechSynthesis) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const text = target.textContent || target.innerText
      
      if (text && text.trim()) {
        speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text.trim())
        utterance.lang = "pt-BR"
        utterance.rate = 0.9
        speechSynthesis.speak(utterance)
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [isNarratorActive, speechSynthesis])

  if (!mounted) {
    return (
      <div className="flex items-center gap-1">
        <div className="w-9 h-9" />
        <div className="w-9 h-9" />
        <div className="w-9 h-9" />
        <div className="w-9 h-9" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {/* Dark Mode Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-lg hover:bg-primary/10"
              aria-label={resolvedTheme === "dark" ? "Modo claro" : "Modo escuro"}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{resolvedTheme === "dark" ? "Modo claro" : "Modo escuro"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Zoom Out */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 80}
              className="rounded-lg hover:bg-primary/10"
              aria-label="Diminuir zoom"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Diminuir texto ({zoomLevel}%)</p>
          </TooltipContent>
        </Tooltip>

        {/* Zoom In */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 150}
              className="rounded-lg hover:bg-primary/10"
              aria-label="Aumentar zoom"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Aumentar texto ({zoomLevel}%)</p>
          </TooltipContent>
        </Tooltip>

        {/* Narrator Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isNarratorActive ? "default" : "ghost"}
              size="icon"
              onClick={toggleNarrator}
              className={`rounded-lg ${isNarratorActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"}`}
              aria-label={isNarratorActive ? "Desativar narrador" : "Ativar narrador"}
            >
              {isNarratorActive ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isNarratorActive ? "Desativar narrador" : "Ativar narrador"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
