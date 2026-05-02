"use client"

import { User, TrendingUp, Target, Sparkles, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Trait {
  name: string
  value: number
  color: string
}

interface ProfileCardProps {
  traits: Trait[]
  careerMatch: string
  matchPercentage: number
  classification?: {
    code: string
    title: string
    description: string
    traitScores?: Record<string, number>
  }
}

export function ProfileCard({ traits, careerMatch, matchPercentage, classification }: ProfileCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Seu Perfil CarrIA</h3>
          <p className="text-sm text-muted-foreground">Baseado em PERFIL + OBJETIVOS + RITMOS</p>
        </div>
      </div>

      {classification && (
        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Sua Classificação</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-primary">{classification.code}</span>
            <span className="text-lg font-semibold text-foreground">{classification.title}</span>
          </div>
          <p className="text-sm text-muted-foreground">{classification.description}</p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        {traits.map((trait) => (
          <div key={trait.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{trait.name}</span>
              <span className="text-sm font-medium text-muted-foreground">{trait.value}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-700", trait.color)}
                style={{ width: `${trait.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">Carreira Compatível</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-foreground">{careerMatch}</span>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20">
            <TrendingUp className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">{matchPercentage}% match</span>
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full gap-2" size="sm">
        <BookOpen className="w-4 h-4" />
        Ver Soft Skills para Desenvolver
      </Button>
    </div>
  )
}
