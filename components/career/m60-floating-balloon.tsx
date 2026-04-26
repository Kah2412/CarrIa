"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function M60FloatingBalloon() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Delay appearance for better UX
    const timer = setTimeout(() => {
      setHasLoaded(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleToggle = () => {
    setIsAnimating(true)
    setIsExpanded(!isExpanded)
    setTimeout(() => setIsAnimating(false), 300)
  }

  if (!hasLoaded) return null

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "animate-in slide-in-from-right-full fade-in duration-500"
      )}
    >
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4);
          }
          50% {
            box-shadow: 0 0 20px 5px rgba(249, 115, 22, 0.2);
          }
        }
      `}</style>

      {/* Expanded Balloon */}
      {isExpanded && (
        <div
          className={cn(
            "max-w-sm w-full transition-all duration-300",
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}
          style={{
            animation: "float 3s ease-in-out infinite"
          }}
        >
          <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30 rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800/50 p-5 overflow-hidden">
            {/* Hide button */}
            <button
              onClick={handleToggle}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
              aria-label="Ocultar"
            >
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-4">
              {/* Mascot */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center overflow-hidden">
                  <Image
                    src="/characters/m60-octopus.png"
                    alt="M60 Mascote"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 pr-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-base mb-0.5">
                  M60 - Universidade do Intercambio
                </h3>
                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-2">
                  Seu parceiro para desenvolvimento de carreira global
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
              O M60 pode te ajudar a alcancar sua carreira dos sonhos atraves de experiencias internacionais, cursos no exterior e networking global. Desenvolva suas soft skills vivenciando culturas diferentes!
            </p>

            {/* CTA Button */}
            <Button
              asChild
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-5 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <a href="https://m60.com.br" target="_blank" rel="noopener noreferrer">
                Conhecer o M60
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Collapsed - Only Mascot Icon */}
      {!isExpanded && (
        <button
          onClick={handleToggle}
          className={cn(
            "w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-xl border-2 border-orange-300 dark:border-orange-700 flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:scale-110 hover:shadow-2xl",
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}
          style={{
            animation: "float 3s ease-in-out infinite, pulse-glow 2s ease-in-out infinite"
          }}
          aria-label="Abrir M60"
        >
          <Image
            src="/characters/m60-octopus.png"
            alt="M60 Mascote"
            width={52}
            height={52}
            className="w-13 h-13 object-contain"
          />
        </button>
      )}
    </div>
  )
}
