"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Circle, ArrowRight, Lightbulb, Users, Clock, Target, Briefcase, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { AIGuide } from "./ai-guide"
import { MiniGame } from "./mini-game"
import { motion, AnimatePresence } from "framer-motion"

interface QuizOption {
  id: string
  text: string
  trait: string
  emoji?: string
}

interface SliderQuestion {
  leftLabel: string
  rightLabel: string
  observationPlaceholder: string
}

interface QuizCardProps {
  questionNumber: number
  totalQuestions: number
  question: string
  options: QuizOption[]
  onAnswer: (optionId: string, trait: string, sliderValue?: number, observation?: string) => void
  xpReward: number
  questionType?: "choice" | "scenario" | "ranking" | "situation" | "game" | "slider"
  scenario?: {
    title: string
    context: string
  }
  gameType?: "memory" | "reaction" | "sorting" | "crossword"
  aiMessage?: string
  aiEmotion?: "happy" | "thinking" | "excited" | "encouraging"
  blockType?: "strategic" | "creative" | "execution" | "relational"
  lastFeedback?: string | null
  sliderConfig?: SliderQuestion
}

const typeIcons = {
  choice: Target,
  scenario: Briefcase,
  ranking: Clock,
  situation: Users,
  game: Gamepad2,
  slider: Target,
}

const typeLabels = {
  choice: "Escolha",
  scenario: "Cenario",
  ranking: "Priorizacao",
  situation: "Situacao Real",
  game: "Mini-Game",
  slider: "Avaliacao",
}

export function QuizCard({ 
  questionNumber, 
  totalQuestions, 
  question, 
  options, 
  onAnswer,
  xpReward,
  questionType = "slider",
  scenario,
  gameType,
  aiMessage,
  aiEmotion = "happy",
  sliderConfig
}: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [sliderValue, setSliderValue] = useState<number>(3)
  const [observation, setObservation] = useState<string>("")

  const progress = (questionNumber / totalQuestions) * 100
  const TypeIcon = typeIcons[questionType]

  const handleSelect = (optionId: string) => {
    if (!isAnimating) {
      setSelectedOption(optionId)
    }
  }

  const handleConfirm = () => {
    if (questionType === "slider") {
      setIsAnimating(true)
      // Determine trait based on slider value
      const trait = sliderValue <= 2 ? "left" : sliderValue >= 4 ? "right" : "balanced"
      setTimeout(() => {
        onAnswer("slider", trait, sliderValue, observation)
        setSliderValue(3)
        setObservation("")
        setIsAnimating(false)
      }, 400)
    } else if (selectedOption) {
      setIsAnimating(true)
      const option = options.find(o => o.id === selectedOption)
      setTimeout(() => {
        onAnswer(selectedOption, option?.trait || "")
        setSelectedOption(null)
        setIsAnimating(false)
      }, 400)
    }
  }

  const handleGameComplete = (score: number, trait: string) => {
    setIsAnimating(true)
    setTimeout(() => {
      onAnswer("game", trait)
      setIsAnimating(false)
    }, 400)
  }

  const getSliderLabel = (value: number) => {
    const labels = ["1", "2", "3", "4", "5"]
    return labels[value - 1] || "3"
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 md:p-10 max-w-2xl w-full shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border">
            <TypeIcon className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">{typeLabels[questionType]}</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {questionNumber} de {totalQuestions}
          </span>
        </div>

      </div>

      <div className="w-full h-3 bg-secondary rounded-full mb-6 overflow-hidden border border-border">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* AI Guide */}
      {aiMessage && (
        <div className="mb-6">
          <AIGuide 
            message={aiMessage} 
            emotion={aiEmotion}
          />
        </div>
      )}

      {scenario && (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            <span className="text-sm font-bold text-foreground">{scenario.title}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{scenario.context}</p>
        </div>
      )}

      {/* Mini-Game ou Pergunta Normal */}
      {questionType === "game" && gameType ? (
        <div className="mb-8">
          <MiniGame
            type={gameType}
            question={question}
            onComplete={handleGameComplete}
          />
        </div>
      ) : questionType === "slider" && sliderConfig ? (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-balance leading-tight">
            {question}
          </h2>

          {/* Slider Section */}
          <div className="mb-8 space-y-6">
            {/* Slider Labels */}
            <div className="flex justify-between items-start text-sm">
              <span className="text-muted-foreground max-w-[140px] text-left font-medium">
                {sliderConfig.leftLabel}
              </span>
              <span className="text-muted-foreground max-w-[140px] text-right font-medium">
                {sliderConfig.rightLabel}
              </span>
            </div>

            {/* Slider */}
            <div className="px-2">
              <Slider
                value={[sliderValue]}
                onValueChange={(value) => setSliderValue(value[0])}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            {/* Slider Value Indicators */}
            <div className="flex justify-between px-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setSliderValue(num)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                    sliderValue === num
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Observation Field */}
            <div className="space-y-2 pt-4">
              <label className="text-sm font-medium text-foreground">
                Observacoes <span className="text-muted-foreground font-normal">(opcional)</span>
              </label>
              <Textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder={sliderConfig.observationPlaceholder}
                className="min-h-[100px] resize-none bg-background border-border focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Analisando: <span className="text-primary font-medium">Perfil</span> + <span className="text-accent font-medium">Objetivos</span> + <span className="text-chart-3 font-medium">Ritmos</span>
            </p>
            <Button 
              onClick={handleConfirm}
              disabled={isAnimating}
              className="h-14 px-8 text-base font-semibold gap-2 rounded-xl shadow-md"
            >
              Confirmar
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-balance leading-tight">
            {question}
          </h2>

          <div className="flex flex-col gap-3 mb-8">
            {options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={isAnimating}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left group",
                  selectedOption === option.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-background hover:border-primary/30 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl text-lg font-semibold transition-all",
                  selectedOption === option.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  {option.emoji || String.fromCharCode(65 + index)}
                </div>
                <span className="text-foreground flex-1 font-medium">{option.text}</span>
                {selectedOption === option.id ? (
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-border shrink-0 group-hover:text-primary/30" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Analisando: <span className="text-primary font-medium">Perfil</span> + <span className="text-accent font-medium">Objetivos</span> + <span className="text-chart-3 font-medium">Ritmos</span>
            </p>
            <Button 
              onClick={handleConfirm}
              disabled={!selectedOption || isAnimating}
              className="h-14 px-8 text-base font-semibold gap-2 rounded-xl shadow-md"
            >
              Confirmar
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
