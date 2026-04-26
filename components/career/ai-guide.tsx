"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface AIGuideProps {
  message: string
  emotion?: "happy" | "thinking" | "excited" | "encouraging"
  isTyping?: boolean
}

export function AIGuide({ message, emotion = "happy", isTyping = false }: AIGuideProps) {
  const emotionAnimations = {
    happy: { rotate: [0, -5, 5, 0], transition: { duration: 2, repeat: Infinity } },
    thinking: { y: [0, -5, 0], transition: { duration: 1.5, repeat: Infinity } },
    excited: { scale: [1, 1.05, 1], rotate: [0, -3, 3, 0], transition: { duration: 0.8, repeat: Infinity } },
    encouraging: { y: [0, -3, 0], transition: { duration: 1, repeat: Infinity } },
  }

  return (
    <div className="flex items-start gap-4">
      <motion.div
        className="relative flex-shrink-0"
        animate={emotionAnimations[emotion]}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/10 p-1 shadow-lg">
          <div className="w-full h-full rounded-full overflow-hidden bg-card flex items-center justify-center">
            <Image
              src="/characters/nexo.png"
              alt="Nexo"
              width={80}
              height={80}
              className="w-full h-full object-contain p-1"
            />
          </div>
        </div>
      </motion.div>

      <div className="flex-1">
        <div className="bg-card rounded-2xl rounded-tl-none p-4 shadow-md border border-border/50 relative">
          <div className="absolute -left-2 top-0 w-4 h-4 bg-card border-l border-t border-border/50 transform -rotate-45" />
          
          <p className="text-sm font-medium text-primary mb-1">Nexo</p>
          
          <AnimatePresence mode="wait">
            {isTyping ? (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-1 py-2"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary/60 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.p
                key="message"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-foreground leading-relaxed"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
