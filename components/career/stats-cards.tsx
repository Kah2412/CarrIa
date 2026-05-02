"use client"

import { TrendingUp, Target, Clock, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stat {
  label: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: "trending" | "target" | "clock" | "award"
}

interface StatsCardsProps {
  stats: Stat[]
}

const iconMap = {
  trending: TrendingUp,
  target: Target,
  clock: Clock,
  award: Award,
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon]
        return (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              {stat.change && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    stat.changeType === "positive" && "bg-primary/20 text-primary",
                    stat.changeType === "negative" && "bg-destructive/20 text-destructive",
                    stat.changeType === "neutral" && "bg-secondary text-muted-foreground"
                  )}
                >
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
