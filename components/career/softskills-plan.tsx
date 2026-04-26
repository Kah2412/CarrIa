"use client"

import { Sparkles, CheckCircle, Circle, ArrowRight, Heart, Target, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SoftSkill {
  name: string
  currentLevel: number
  targetLevel: number
  importance: "critical" | "high" | "medium"
  tips: string[]
}

interface SoftSkillsPlanProps {
  dreamCareer: string
  currentMatch: number
  potentialMatch: number
  skills: SoftSkill[]
}

const importanceColors = {
  critical: "text-destructive",
  high: "text-accent",
  medium: "text-primary",
}

const importanceLabels = {
  critical: "Essencial",
  high: "Importante",
  medium: "Desejável",
}

export function SoftSkillsPlan({ dreamCareer, currentMatch, potentialMatch, skills }: SoftSkillsPlanProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/20">
          <Heart className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Plano de Desenvolvimento</h3>
          <p className="text-sm text-muted-foreground">Soft skills para alcançar seu sonho</p>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/30">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-foreground">Carreira dos Sonhos: {dreamCareer}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Compatibilidade Atual</span>
              <span className="text-xs font-medium text-muted-foreground">{currentMatch}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-muted-foreground/50 rounded-full" style={{ width: `${currentMatch}%` }} />
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-accent shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Potencial com Desenvolvimento</span>
              <span className="text-xs font-medium text-accent">{potentialMatch}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${potentialMatch}%` }} />
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3 inline mr-1 text-accent" />
          Nós não limitamos sonhos, nós construímos caminhos até eles.
        </p>
      </div>

      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name} className="p-4 rounded-xl bg-secondary/30 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{skill.name}</span>
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full bg-secondary", importanceColors[skill.importance])}>
                  {importanceLabels[skill.importance]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{skill.currentLevel}%</span>
                <ArrowRight className="w-3 h-3 text-primary" />
                <span className="text-primary font-medium">{skill.targetLevel}%</span>
              </div>
            </div>
            
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-3">
              <div className="h-full bg-muted-foreground/30 rounded-full relative" style={{ width: `${skill.targetLevel}%` }}>
                <div 
                  className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all" 
                  style={{ width: `${(skill.currentLevel / skill.targetLevel) * 100}%` }} 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              {skill.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Tempo estimado: <strong className="text-foreground">3-6 meses</strong></span>
        </div>
        <Button className="gap-2">
          Iniciar Plano
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
