"use client"

import Image from "next/image"
import { TrendingUp, DollarSign, Clock, ChevronRight, Sparkles, GraduationCap, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Faculty {
  name: string
  location: string
  course: string
}

interface CareerSuggestion {
  id: string
  title: string
  matchPercentage: number
  salaryRange: string
  growthRate: string
  timeToTransition: string
  description: string
  topSkills: string[]
  characterImage: string
  selected?: boolean
  faculties?: Faculty[]
}

interface CareerSuggestionsProps {
  suggestions: CareerSuggestion[]
  onSelect: (careerId: string) => void
}

export function CareerSuggestions({ suggestions, onSelect }: CareerSuggestionsProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Carreiras Recomendadas</h3>
          <p className="text-sm text-muted-foreground">Baseado no seu perfil - com faculdades recomendadas</p>
        </div>
      </div>

      <div className="grid gap-4">
        {suggestions.map((career, index) => (
          <div
            key={career.id}
            className={cn(
              "relative p-5 rounded-2xl border-2 transition-all cursor-pointer group overflow-hidden",
              career.selected
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-background hover:border-primary/30 hover:shadow-md"
            )}
            onClick={() => onSelect(career.id)}
          >
            {index === 0 && (
              <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm">
                Melhor Match
              </div>
            )}

            <div className="flex items-start gap-5">
              {/* Character Image */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-secondary/50 border border-border shrink-0 shadow-sm">
                <Image
                  src={career.characterImage}
                  alt={career.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-foreground">{career.title}</h4>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-bold text-primary">{career.matchPercentage}%</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{career.description}</p>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <DollarSign className="w-4 h-4 text-accent" />
                    <span className="text-foreground font-medium">{career.salaryRange}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{career.growthRate} crescimento</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{career.timeToTransition}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {career.topSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs font-medium rounded-lg bg-secondary text-foreground border border-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Faculties Section */}
                {career.faculties && career.faculties.length > 0 && (
                  <div className="pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-semibold text-muted-foreground">Faculdades recomendadas:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {career.faculties.map((faculty) => (
                        <div
                          key={faculty.name}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20"
                        >
                          <span className="text-xs font-medium text-foreground">{faculty.name}</span>
                          <div className="flex items-center gap-0.5 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="text-xs">{faculty.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
