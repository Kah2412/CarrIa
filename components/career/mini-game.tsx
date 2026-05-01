"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2, Trophy, Star, Target, Zap, Heart, Brain, Compass, Lightbulb, Rocket, Search, Stethoscope, Code, HardHat, Palette, Scale, Briefcase, GraduationCap, Mic } from "lucide-react"

interface MiniGameProps {
  type: "memory" | "reaction" | "choice" | "sorting" | "crossword"
  onComplete: (score: number, trait: string) => void
  question: string
}

// Memory Game - revela preferencias de foco e atencao
function MemoryGame({ onComplete }: { onComplete: (score: number, trait: string) => void }) {
  const { t } = useTranslation()
  // Profession-related symbols
  const symbols = ["medico", "programador", "engenheiro", "artista", "advogado", "empresario", "professor", "comunicador"]
  const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matched, setMatched] = useState(0)
  const totalPairs = 8

  useEffect(() => {
    const shuffled = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, i) => ({ id: i, symbol, flipped: false, matched: false }))
    setCards(shuffled)
  }, [])

  const handleCardClick = (id: number) => {
    if (selected.length === 2 || cards[id].flipped || cards[id].matched) return

    const newCards = [...cards]
    newCards[id].flipped = true
    setCards(newCards)
    setSelected([...selected, id])

    if (selected.length === 1) {
      setMoves(moves + 1)
      const firstCard = cards[selected[0]]
      const secondCard = newCards[id]

      if (firstCard.symbol === secondCard.symbol) {
        setTimeout(() => {
          const matchedCards = [...newCards]
          matchedCards[selected[0]].matched = true
          matchedCards[id].matched = true
          setCards(matchedCards)
          setMatched(matched + 1)
          setSelected([])

          if (matched + 1 === totalPairs) {
            const score = Math.max(100 - moves * 4, 50)
            onComplete(score, moves <= 10 ? "foco-alto" : moves <= 16 ? "foco-medio" : "foco-desenvolvimento")
          }
        }, 500)
      } else {
        setTimeout(() => {
          const resetCards = [...newCards]
          resetCards[selected[0]].flipped = false
          resetCards[id].flipped = false
          setCards(resetCards)
          setSelected([])
        }, 1000)
      }
    }
  }

  const getIcon = (symbol: string) => {
    const icons: Record<string, React.ReactNode> = {
      medico: <Stethoscope className="w-6 h-6" />,
      programador: <Code className="w-6 h-6" />,
      engenheiro: <HardHat className="w-6 h-6" />,
      artista: <Palette className="w-6 h-6" />,
      advogado: <Scale className="w-6 h-6" />,
      empresario: <Briefcase className="w-6 h-6" />,
      professor: <GraduationCap className="w-6 h-6" />,
      comunicador: <Mic className="w-6 h-6" />,
    }
    return icons[symbol]
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">{t("quiz.games.memory.moves", { count: moves })}</span>
        <span className="text-primary font-medium">{t("quiz.games.memory.pairs", { matched, total: totalPairs })}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
              card.flipped || card.matched
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            } ${card.matched ? "opacity-50" : ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {(card.flipped || card.matched) && getIcon(card.symbol)}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// Reaction Game - mede velocidade de decisao
function ReactionGame({ onComplete }: { onComplete: (score: number, trait: string) => void }) {
  const { t } = useTranslation()
  const [state, setState] = useState<"waiting" | "ready" | "go" | "done">("waiting")
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState(0)
  const [attempts, setAttempts] = useState<number[]>([])

  const startGame = useCallback(() => {
    setState("ready")
    const delay = Math.random() * 3000 + 1000
    setTimeout(() => {
      setState("go")
      setStartTime(Date.now())
    }, delay)
  }, [])

  const handleClick = () => {
    if (state === "waiting") {
      startGame()
    } else if (state === "ready") {
      setState("waiting")
    } else if (state === "go") {
      const time = Date.now() - startTime
      setReactionTime(time)
      const newAttempts = [...attempts, time]
      setAttempts(newAttempts)

      if (newAttempts.length >= 3) {
        const avg = newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length
        const score = Math.max(100 - Math.floor(avg / 10), 30)
        const trait = avg < 300 ? "decisao-rapida" : avg < 500 ? "decisao-equilibrada" : "decisao-ponderada"
        setState("done")
        setTimeout(() => onComplete(score, trait), 1500)
      } else {
        setState("waiting")
      }
    }
  }

  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              attempts.length >= i ? "bg-primary" : "bg-secondary"
            }`}
          />
        ))}
      </div>

      <motion.button
        onClick={handleClick}
        className={`w-full h-40 rounded-2xl flex flex-col items-center justify-center text-lg font-medium transition-colors ${
          state === "waiting"
            ? "bg-secondary text-foreground hover:bg-secondary/80"
            : state === "ready"
            ? "bg-amber-500 text-white"
            : state === "go"
            ? "bg-green-500 text-white"
            : "bg-primary text-primary-foreground"
        }`}
        whileTap={{ scale: 0.98 }}
      >
        {state === "waiting" && (
          <>
            <Zap className="w-8 h-8 mb-2" />
            <span>{t("reactionTest.start")}</span>
          </>
        )}
        {state === "ready" && (
          <>
            <Target className="w-8 h-8 mb-2 animate-pulse" />
            <span>{t("reactionTest.wait")}</span>
          </>
        )}
        {state === "go" && (
          <>
            <Trophy className="w-8 h-8 mb-2" />
            <span>{t("reactionTest.clickNow")}</span>
          </>
        )}
        {state === "done" && (
          <>
            <Star className="w-8 h-8 mb-2" />
                <span>{t("reactionTest.averageTime", { time: Math.floor(attempts.reduce((a, b) => a + b, 0) / attempts.length) })}</span>
          </>
        )}
      </motion.button>

      {reactionTime > 0 && state !== "done" && (
        <p className="text-sm text-muted-foreground">{t("reactionTest.lastReaction", { time: reactionTime })}</p>
      )}
    </div>
  )
}

// Sorting Game - revela prioridades e valores (now with reordering)
function SortingGame({ onComplete, question }: { onComplete: (score: number, trait: string) => void, question: string }) {
  const { t } = useTranslation()
  const isSkillsGame = question.toLowerCase().includes("habilidades")
  
  const valuesOptions = isSkillsGame ? [
    { id: 1, label: t("sortingValues.items.communication"), icon: Target, trait: "relational" },
    { id: 2, label: t("sortingValues.items.leadership"), icon: Star, trait: "strategic" },
    { id: 3, label: t("sortingValues.items.creativity"), icon: Heart, trait: "creative" },
    { id: 4, label: t("sortingValues.items.organization"), icon: Zap, trait: "execution" },
  ] : [
    { id: 1, label: t("sortingValues.items.stability"), icon: Target, trait: "execution" },
    { id: 2, label: t("sortingValues.items.creativity"), icon: Star, trait: "creative" },
    { id: 3, label: t("sortingValues.items.socialImpact"), icon: Heart, trait: "relational" },
    { id: 4, label: t("sortingValues.items.growth"), icon: Zap, trait: "strategic" },
  ]

  const [ranking, setRanking] = useState<number[]>([])
  const [confirmed, setConfirmed] = useState(false)

  const handleSelect = (id: number) => {
    if (confirmed) return
    
    if (ranking.includes(id)) {
      // Allow removal/reordering by clicking again
      setRanking(ranking.filter(r => r !== id))
    } else {
      setRanking([...ranking, id])
    }
  }

  const handleConfirm = () => {
    if (ranking.length === 4) {
      setConfirmed(true)
      const topValue = valuesOptions.find((v) => v.id === ranking[0])
      setTimeout(() => onComplete(85, topValue?.trait || "strategic"), 1000)
    }
  }

  const handleReset = () => {
    setRanking([])
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center mb-2">
        {t("sortingValues.instructions.order")}
      </p>
      <p className="text-xs text-muted-foreground text-center mb-4">
        {t("sortingValues.instructions.reorder")}
      </p>

      <div className="space-y-2">
        {valuesOptions.map((value) => {
          const position = ranking.indexOf(value.id)
          const isSelected = position !== -1
          const Icon = value.icon

          return (
            <motion.button
              key={value.id}
              onClick={() => handleSelect(value.id)}
              disabled={confirmed}
              className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
                isSelected
                  ? "bg-primary/20 border-2 border-primary"
                  : "bg-secondary hover:bg-secondary/80 border-2 border-transparent"
              } ${confirmed ? "opacity-75" : ""}`}
              whileHover={!confirmed ? { scale: 1.02 } : {}}
              whileTap={!confirmed ? { scale: 0.98 } : {}}
            >
              {isSelected && (
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {position + 1}
                </span>
              )}
              <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              <span className={isSelected ? "text-primary font-medium" : "text-foreground"}>
                {value.label}
              </span>
            </motion.button>
          )
        })}
      </div>

      {ranking.length > 0 && !confirmed && (
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            {t("sortingValues.actions.reset")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={ranking.length !== 4}
            className="flex-1"
          >
            {t("sortingValues.actions.confirm")}
          </Button>
        </div>
      )}
    </div>
  )
}

// Normalize text for comparison - removes accents and converts to uppercase
function normalizeText(text: string): string {
  return text
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .replace(/Ç/g, "C") // Handle cedilla
}

// Crossword Game - resolver palavras cruzadas relacionadas a carreiras e soft skills
function CrosswordGame({ onComplete }: { onComplete: (score: number, trait: string) => void }) {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage || i18n.language
  const isEnglish = currentLanguage.startsWith("en")
  const isSpanish = currentLanguage.startsWith("es")

  // Crossword puzzles with 4 words that properly intersect
  // Each puzzle has words that share letters at intersection points
  const puzzleSets = [
    {
      // Positions adapt by language so intersections remain valid for translated answers.
      words: [
        { answer: t("crossword.words.ethic.answer"), clue: t("crossword.words.ethic.clue"), direction: "vertical" as const, row: 0, col: 4 },
        { answer: t("crossword.words.success.answer"), clue: t("crossword.words.success.clue"), direction: "horizontal" as const, row: isEnglish ? 0 : isSpanish ? 2 : 3, col: isEnglish ? 0 : 2 },
        { answer: t("crossword.words.core.answer"), clue: t("crossword.words.core.clue"), direction: "horizontal" as const, row: isEnglish ? 4 : isSpanish ? 3 : 0, col: isEnglish ? 4 : isSpanish ? 2 : 0 },
        { answer: t("crossword.words.action.answer"), clue: t("crossword.words.action.clue"), direction: "horizontal" as const, row: isEnglish ? 1 : 4, col: isEnglish ? 2 : 4 },
      ]
    },
  ]
  
  const [puzzleIndex, setPuzzleIndex] = useState(0)

  useEffect(() => {
    setPuzzleIndex(Math.floor(Math.random() * puzzleSets.length))
  }, [puzzleSets.length])

  const selectedPuzzle = puzzleSets[puzzleIndex] || puzzleSets[0]
  if (!selectedPuzzle || !selectedPuzzle.words) {
    return <div>{t("crossword.labels.loading")}</div>
  }
  
  // Build crossword data with proper positioning
  const crosswordData = selectedPuzzle?.words?.map((word, index) => ({
    number: index + 1,
    direction: word.direction,
    row: word.row,
    col: word.col,
    answer: word.answer,
    clue: word.clue,
  }))

  const gridCols = Math.max(...crosswordData.map(c => 
    c.direction === "horizontal" ? c.col + c.answer.length : c.col + 1
  ))
  const gridRows = Math.max(...crosswordData.map(c => 
    c.direction === "vertical" ? c.row + c.answer.length : c.row + 1
  ))
  
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [selectedClue, setSelectedClue] = useState<number | null>(null)
  const [solvedClues, setSolvedClues] = useState<number[]>([])
  const [hintsUsed, setHintsUsed] = useState(0)

  useEffect(() => {
    setUserAnswers({})
    setSelectedClue(null)
    setSolvedClues([])
    setHintsUsed(0)
  }, [currentLanguage])

  const getCellClues = (row: number, col: number) => {
    return crosswordData
      .map((clue) => {
        if (clue.direction === "horizontal" && row === clue.row && col >= clue.col && col < clue.col + clue.answer.length) {
          return { clue, letterIndex: col - clue.col }
        }
        if (clue.direction === "vertical" && col === clue.col && row >= clue.row && row < clue.row + clue.answer.length) {
          return { clue, letterIndex: row - clue.row }
        }
        return null
      })
      .filter((cellClue): cellClue is { clue: typeof crosswordData[number], letterIndex: number } => cellClue !== null)
  }

  const getSolvedClueNumbers = (answers: Record<number, string>) => {
    return crosswordData
      .filter((clue) => normalizeText(answers[clue.number] || "") === normalizeText(clue.answer))
      .map((clue) => clue.number)
  }

  // Build the grid - check all clues for each cell
  const getGridCell = (row: number, col: number): { letter: string, clueNumber: number | null } | null => {
    const cellClues = getCellClues(row, col)
    if (cellClues.length === 0) return null

    const letters = cellClues.map(({ clue, letterIndex }) => normalizeText(clue.answer[letterIndex]))
    if (!letters.every((letter) => letter === letters[0])) {
      return null
    }

    const clueNumber = cellClues.find(({ clue }) => clue.row === row && clue.col === col)?.clue.number || null
    return { letter: cellClues[0].clue.answer[cellClues[0].letterIndex], clueNumber }
  }

  const handleInputChange = (clueNumber: number, value: string) => {
    // Allow all Portuguese characters including accents and cedilla
    const sanitizedValue = value.toUpperCase().replace(/[^\p{L}]/gu, "")
    const newAnswers = { ...userAnswers, [clueNumber]: sanitizedValue }
    setUserAnswers(newAnswers)
    
    const newSolved = getSolvedClueNumbers(newAnswers)
    setSolvedClues(newSolved)
    
    if (newSolved.length === crosswordData.length) {
      const baseScore = 95
      const hintPenalty = Math.floor(hintsUsed * 3)
      const finalScore = Math.max(baseScore - hintPenalty, 30)
      setTimeout(() => onComplete(finalScore, "strategic"), 1500)
    }
  }

  const handleUseHint = (clueNumber: number) => {
    const clue = crosswordData.find(c => c.number === clueNumber)
    if (!clue || solvedClues.includes(clueNumber)) return
    
    const currentAnswer = userAnswers[clueNumber] || ""
    
    let hintPosition = -1
    for (let i = 0; i < clue.answer.length; i++) {
      // Use normalized comparison for finding hint position
      const currentChar = currentAnswer[i] ? normalizeText(currentAnswer[i]) : ""
      const answerChar = normalizeText(clue.answer[i])
      if (!currentAnswer[i] || currentChar !== answerChar) {
        hintPosition = i
        break
      }
    }
    
    if (hintPosition === -1) return
    
    const newAnswer = currentAnswer.substring(0, hintPosition) + 
                      clue.answer[hintPosition] + 
                      currentAnswer.substring(hintPosition + 1)
    
    const newAnswers = { ...userAnswers, [clueNumber]: newAnswer }
    setUserAnswers(newAnswers)
    setHintsUsed(prev => prev + 1)
    
    // Use normalized comparison for hint completion
    const newSolved = getSolvedClueNumbers(newAnswers)
    setSolvedClues(newSolved)
    
    if (newSolved.length === crosswordData.length) {
      const baseScore = 95
      const hintPenalty = Math.floor((hintsUsed + 1) * 3)
      const finalScore = Math.max(baseScore - hintPenalty, 30)
      setTimeout(() => onComplete(finalScore, "strategic"), 1500)
    }
  }

  const getCellUserLetter = (row: number, col: number): string => {
    const typedLetters = getCellClues(row, col)
      .map(({ clue, letterIndex }) => (userAnswers[clue.number] || "")[letterIndex] || "")
      .filter(Boolean)

    const firstLetter = typedLetters[0] || ""
    return typedLetters.every((letter) => normalizeText(letter) === normalizeText(firstLetter)) ? firstLetter : ""
  }

  const isCellSolved = (row: number, col: number): boolean => {
    const cellClues = getCellClues(row, col)
    return cellClues.length > 0 && cellClues.every(({ clue }) => solvedClues.includes(clue.number))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">{t("crossword.labels.solvedWords")}:</span>
        <span className="text-primary font-medium">{solvedClues.length}/{crosswordData.length}</span>
      </div>
      
      {hintsUsed > 0 && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/20 border border-amber-500/50">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-xs text-amber-600 dark:text-amber-400">
            {t("crossword.labels.hintsUsed", { count: hintsUsed })}
          </span>
        </div>
      )}

      {/* Crossword Grid - Simplified layout */}
      <div className="flex justify-center">
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${gridCols}, 2rem)` }}>
          {Array.from({ length: gridRows }).map((_, rowIndex) =>
            Array.from({ length: gridCols }).map((_, colIndex) => {
              const cell = getGridCell(rowIndex, colIndex)
              if (!cell) {
                return <div key={`${rowIndex}-${colIndex}`} className="w-8 h-8" />
              }
              const userLetter = getCellUserLetter(rowIndex, colIndex)
              const isSolved = isCellSolved(rowIndex, colIndex)
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-8 h-8 border-2 text-sm font-bold flex items-center justify-center relative rounded ${
                    isSolved 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  {cell.clueNumber && (
                    <span className="absolute -top-0.5 -left-0.5 text-[8px] bg-primary text-primary-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      {cell.clueNumber}
                    </span>
                  )}
                  {isSolved ? cell.letter : userLetter}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Clues */}
      <div className="space-y-3 max-h-52 overflow-y-auto">
        {crosswordData.map((clue) => (
          <div 
            key={clue.number}
            className={`p-3 rounded-xl transition-all ${
              solvedClues.includes(clue.number)
                ? "bg-primary/20 border border-primary"
                : selectedClue === clue.number
                ? "bg-accent/20 border border-accent"
                : "bg-secondary hover:bg-secondary/80 border border-transparent"
            }`}
            onClick={() => !solvedClues.includes(clue.number) && setSelectedClue(clue.number)}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                {clue.number}
              </span>
              <span className="text-xs text-muted-foreground">
                {clue.direction === "horizontal" ? t("crossword.labels.horizontal") : t("crossword.labels.vertical")}
              </span>
              {solvedClues.includes(clue.number) && (
                <Trophy className="w-4 h-4 text-primary ml-auto" />
              )}
            </div>
            <p className="text-sm text-foreground mb-2">{clue.clue}</p>
            {!solvedClues.includes(clue.number) && (
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={clue.answer.length}
                  value={userAnswers[clue.number] || ""}
                  onChange={(e) => handleInputChange(clue.number, e.target.value)}
                  placeholder={t("crossword.labels.lettersCount", { count: clue.answer.length })}
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-background border border-border focus:border-primary focus:outline-none uppercase tracking-widest font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUseHint(clue.number)
                  }}
                  className="shrink-0 text-amber-600 border-amber-500/50 hover:bg-amber-500/20"
                  title={t("crossword.labels.revealLetter")}
                >
                  <Lightbulb className="w-4 h-4" />
                </Button>
              </div>
            )}
            {solvedClues.includes(clue.number) && (
              <p className="text-sm font-mono font-bold tracking-widest text-primary">
                {clue.answer}
              </p>
            )}
          </div>
        ))}
      </div>
      
      {/* Hint info */}
      <p className="text-xs text-muted-foreground text-center">
        {t("crossword.labels.hintInfo")}
      </p>
    </div>
  )
}

export function MiniGame({ type, onComplete, question }: MiniGameProps) {
  const { t } = useTranslation()
  const [showIntro, setShowIntro] = useState(true)

const gameInfo = {
    memory: {
      title: t("quiz.games.memory.title"),
      description: t("quiz.games.memory.description"),
      icon: Gamepad2,
    },
    reaction: {
      title: t("reactionTest.title"),
      description: t("reactionTest.instruction"),
      icon: Zap,
    },
    choice: {
      title: t("quiz.games.choice.title"),
      description: t("quiz.games.choice.description"),
      icon: Target,
    },
    sorting: {
      title: t("sortingValues.title"),
      description: t("sortingValues.description"),
      icon: Trophy,
    },
    crossword: {
      title: t("crossword.title"),
      description: t("crossword.description"),
      icon: Search,
    },
  }

  const info = gameInfo[type]
  const Icon = info.icon

  return (
    <Card className="p-6 bg-card/80 backdrop-blur border-primary/20">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">{info.title}</h3>
            <p className="text-muted-foreground">{info.description}</p>
            <p className="text-sm text-foreground/80 italic">{question}</p>
            <Button onClick={() => setShowIntro(false)} className="mt-4">
              {type === "sorting" ? t("sortingValues.actions.play") : t("quiz.games.play")}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
{type === "memory" && <MemoryGame onComplete={onComplete} />}
            {type === "reaction" && <ReactionGame onComplete={onComplete} />}
            {type === "sorting" && <SortingGame onComplete={onComplete} question={question} />}
            {type === "crossword" && <CrosswordGame onComplete={onComplete} />}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
