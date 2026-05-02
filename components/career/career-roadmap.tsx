"use client"

import { CheckCircle2, Circle, Clock, ArrowRight, BookOpen, Briefcase, GraduationCap, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface RoadmapStep {
  id: string
  title: string
  description: string
  duration: string
  skills: string[]
  status: "completed" | "current" | "upcoming"
  icon: "learn" | "work" | "certify" | "achieve"
}

interface CareerRoadmapProps {
  careerTitle: string
  steps: RoadmapStep[]
  onStepClick?: (stepId: string) => void
}

const iconMap = {
  learn: BookOpen,
  work: Briefcase,
  certify: GraduationCap,
  achieve: Award,
}

export function CareerRoadmap({ careerTitle, steps, onStepClick }: CareerRoadmapProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-1">Plano de Evolução</h3>
          <p className="text-sm text-muted-foreground">
            Seu caminho para se tornar <span className="text-primary font-medium">{careerTitle}</span>
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <span>Ver detalhes</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = iconMap[step.icon]
            return (
              <div
                key={step.id}
                className={cn(
                  "relative pl-16 cursor-pointer group",
                  step.status === "upcoming" && "opacity-60"
                )}
                onClick={() => onStepClick?.(step.id)}
              >
                <div
                  className={cn(
                    "absolute left-0 flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all",
                    step.status === "completed" && "bg-primary border-primary",
                    step.status === "current" && "bg-primary/20 border-primary animate-pulse",
                    step.status === "upcoming" && "bg-secondary border-border"
                  )}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Icon className={cn(
                      "w-5 h-5",
                      step.status === "current" ? "text-primary" : "text-muted-foreground"
                    )} />
                  )}
                </div>

                <div
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    step.status === "current" 
                      ? "bg-primary/10 border-primary/30" 
                      : "bg-secondary/50 border-border group-hover:border-muted-foreground/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{step.title}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{step.duration}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs font-medium rounded-md bg-secondary text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
