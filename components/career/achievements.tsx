"use client"

import { Trophy, Lock, Star, Zap, Target, Rocket, Brain, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

interface AchievementsProps {
  achievements: Achievement[]
}

const achievementIcons: Record<string, React.ReactNode> = {
  firstStep: <Star className="w-5 h-5" />,
  quickLearner: <Zap className="w-5 h-5" />,
  goalSetter: <Target className="w-5 h-5" />,
  explorer: <Rocket className="w-5 h-5" />,
  strategic: <Brain className="w-5 h-5" />,
  networker: <Users className="w-5 h-5" />,
}

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/20">
          <Trophy className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Conquistas</h3>
          <p className="text-sm text-muted-foreground">
            {achievements.filter(a => a.unlocked).length} de {achievements.length} desbloqueadas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={cn(
              "relative flex flex-col items-center p-4 rounded-xl border-2 transition-all",
              achievement.unlocked
                ? "border-accent/50 bg-accent/10"
                : "border-border bg-secondary/30"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl mb-3",
                achievement.unlocked
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {achievement.unlocked ? achievement.icon : <Lock className="w-5 h-5" />}
            </div>
            <span
              className={cn(
                "text-sm font-medium text-center",
                achievement.unlocked ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {achievement.title}
            </span>
            {achievement.progress !== undefined && achievement.maxProgress && !achievement.unlocked && (
              <div className="w-full mt-2">
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-muted-foreground/50 rounded-full"
                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
