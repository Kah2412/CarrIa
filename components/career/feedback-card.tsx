"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Sparkles, TrendingUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeedbackCardProps {
  message: string
  isVisible: boolean
  percentage?: number
  xpGained?: number
  onClose?: () => void
}

export function FeedbackCard({ message, isVisible, percentage, onClose }: FeedbackCardProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-card border border-primary/30 rounded-2xl p-6 shadow-xl max-w-md relative">
            {/* Close Button */}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-2 right-2 w-8 h-8 rounded-full hover:bg-secondary"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Fechar</span>
              </Button>
            )}
            
            <div className="flex items-start gap-4 pr-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-primary">Feedback</span>
                </div>
                <p className="text-foreground font-medium">{message}</p>
                
                {percentage !== undefined && (
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>{percentage}% completo</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
