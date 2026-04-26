"use client"

import { Play, Clock, TrendingUp, AlertTriangle, CheckCircle, ChevronRight, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DayInLife {
  time: string
  activity: string
  type: "meeting" | "work" | "break" | "learning"
}

interface CareerChallenge {
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
}

interface CareerSimulationProps {
  careerTitle: string
  dayInLife: DayInLife[]
  challenges: CareerChallenge[]
  opportunities: string[]
  averageSalaryGrowth: string
}

const typeColors = {
  meeting: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  work: "bg-primary/20 text-primary border-primary/30",
  break: "bg-accent/20 text-accent border-accent/30",
  learning: "bg-chart-4/20 text-chart-4 border-chart-4/30",
}

const difficultyColors = {
  easy: "text-primary",
  medium: "text-accent",
  hard: "text-destructive",
}

export function CareerSimulation({ 
  careerTitle, 
  dayInLife, 
  challenges, 
  opportunities,
  averageSalaryGrowth 
}: CareerSimulationProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-chart-3/20">
            <Play className="w-5 h-5 text-chart-3" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Simulação de Carreira</h3>
            <p className="text-sm text-muted-foreground">Como é ser {careerTitle}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Play className="w-4 h-4" />
          Simulação 3D
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Um dia típico
          </h4>
          <div className="space-y-2">
            {dayInLife.map((item, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  typeColors[item.type]
                )}
              >
                <span className="text-xs font-mono font-medium w-12">{item.time}</span>
                <span className="text-sm flex-1">{item.activity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Desafios comuns
            </h4>
            <div className="space-y-3">
              {challenges.map((challenge, index) => (
                <div key={index} className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{challenge.title}</span>
                    <span className={cn("text-xs font-medium", difficultyColors[challenge.difficulty])}>
                      {challenge.difficulty === "easy" ? "Fácil" : challenge.difficulty === "medium" ? "Médio" : "Difícil"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{challenge.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Oportunidades de crescimento
            </h4>
            <div className="space-y-2">
              {opportunities.map((opp, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-foreground">{opp}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Crescimento salarial médio:</span>
                <span className="text-sm font-bold text-primary">{averageSalaryGrowth}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
