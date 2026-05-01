"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { CheckCircle2, Circle, ArrowRight, Lightbulb, Users, Clock, Target, Briefcase, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { AIGuide } from "./ai-guide"
import { MiniGame } from "./mini-game"
import { motion, AnimatePresence } from "framer-motion"

interface QuizOption {
  id: string
  text: string
  trait: string
  emoji?: string
}

interface SliderQuestion {
  leftLabel: string
  rightLabel: string
  observationPlaceholder: string
}

interface QuizCardProps {
  questionNumber: number
  totalQuestions: number
  question: string
  options: QuizOption[]
  onAnswer: (optionId: string, trait: string, sliderValue?: number, observation?: string) => void
  xpReward: number
  questionType?: "choice" | "scenario" | "ranking" | "situation" | "game" | "slider"
  scenario?: {
    title: string
    context: string
  }
  gameType?: "memory" | "reaction" | "sorting" | "crossword"
  aiMessage?: string
  aiEmotion?: "happy" | "thinking" | "excited" | "encouraging"
  blockType?: "strategic" | "creative" | "execution" | "relational"
  lastFeedback?: string | null
  sliderConfig?: SliderQuestion
}

const typeIcons = {
  choice: Target,
  scenario: Briefcase,
  ranking: Clock,
  situation: Users,
  game: Gamepad2,
  slider: Target,
}

const typeLabels = {
  choice: "Escolha",
  scenario: "Cenario",
  ranking: "Priorizacao",
  situation: "Situacao Real",
  game: "Mini-Game",
  slider: "Avaliacao",
}

const visibleTextTranslationKeys: Record<string, string> = {
  "Vamos testar sua capacidade de foco e concentracao!": "quiz.games.memory.question",
  "Olá! Eu sou o Nexo, seu guia nessa jornada de autoconhecimento. Vamos começar com um joguinho para eu entender como você funciona!": "quiz.games.memory.aiMessage",
  "Agora vamos ver sua velocidade de decisao!": "reactionTest.question",
  "Excelente! Agora quero testar sua velocidade de reação. Isso me ajuda a entender seu estilo de tomada de decisão sob pressão.": "nexo.reaction.intro",
  "Quando voce precisa resolver algo importante, voce costuma agir mais por impulso ou pensar antes de decidir?": "question.decision.title",
  "Impulsivo": "question.decision.impulsive",
  "Planejado": "question.decision.planned",
  "Conte como voce costuma decidir quando algo realmente importa.": "question.decision.placeholder",
  "Vamos entender como você toma decisões importantes. Isso revela muito sobre seu perfil estratégico!": "question.decision.nexo",
  "Vamos entender como vocÃª toma decisÃµes importantes. Isso revela muito sobre seu perfil estratÃ©gico!": "question.decision.nexo",
  "Sua forma de iniciar projetos é uma característica fundamental do seu perfil profissional.": "question.startProjects.nexo",
  "Quando voce comeca algo novo, voce prefere ja sair fazendo ou entender melhor antes de comecar?": "question.startProjects.title",
  "Comecar rapido": "question.startProjects.leftLabel",
  "Entender primeiro": "question.startProjects.rightLabel",
  "Como voce reage quando esta comecando algo totalmente novo?": "question.startProjects.placeholder",
  "Se algo da errado no meio do caminho, voce tende a ajustar na hora ou parar para reorganizar tudo?": "question.replan.title",
  "Resolver na hora": "question.replan.leftLabel",
  "Replanejar": "question.replan.rightLabel",
  "Lembra de alguma vez em que algo saiu diferente do esperado? O que voce fez?": "question.replan.placeholder",
  "Flexibilidade e planejamento caminham juntos no mundo profissional moderno.": "question.replan.nexo",
  "Conhecer suas preferências é o primeiro passo para potencializá-las!": "question.preferences.nexo",
  "Voce se sente mais confortavel quando sabe exatamente o que vai acontecer ou quando pode ir descobrindo aos poucos?": "question.preferences.title",
  "Descobrir": "question.preferences.leftLabel",
  "Prever": "question.preferences.rightLabel",
  "Voce prefere ter controle da situacao ou lidar com o que aparece no caminho?": "question.preferences.placeholder",
  "Hora de explorar sua criatividade! Como você aborda problemas e desafios?": "question.creativeProblemSolving.nexo",
  "Hora de explorar sua criatividade! Como vocÃª aborda problemas e desafios?": "question.creativeProblemSolving.nexo",
  "Quando algo nao funciona como esperado, voce costuma repetir o que ja conhece ou tentar algo diferente?": "question.creativeProblemSolving.title",
  "Repetir": "question.creativeProblemSolving.leftLabel",
  "Criar algo novo": "question.creativeProblemSolving.rightLabel",
  "Ja teve alguma situacao em que voce resolveu algo de um jeito diferente?": "question.creativeProblemSolving.placeholder",
  "Resolução de problemas é uma habilidade muito valorizada no mercado!": "question.followIdeas.nexo",
  "Voce gosta mais de seguir ideias ja prontas ou inventar suas proprias formas de fazer as coisas?": "question.followIdeas.title",
  "Seguir": "question.followIdeas.leftLabel",
  "Criar": "question.followIdeas.rightLabel",
  "Voce costuma seguir exemplos ou prefere fazer do seu proprio jeito?": "question.followIdeas.placeholder",
  "Sua forma de executar tarefas diz muito sobre que tipo de carreira vai fazer você feliz!": "question.taskStyle.nexo",
  "Quando alguem te da uma tarefa, voce prefere fazer do jeito que pediram ou dar seu proprio toque?": "question.taskStyle.title",
  "Seguir instrucoes": "question.taskStyle.leftLabel",
  "Personalizar": "question.taskStyle.rightLabel",
  "Quando alguem te orienta, voce adapta ou segue exatamente como foi explicado?": "question.taskStyle.placeholder",
  "Sua motivação e criatividade são habilidades essenciais!": "question.motivation.nexo",
  "Voce se sente mais motivado quando tudo ja esta definido ou quando pode explorar possibilidades?": "question.motivation.title",
  "Tudo definido": "question.motivation.leftLabel",
  "Explorar": "question.motivation.rightLabel",
  "O que te anima mais: algo ja estruturado ou liberdade para explorar ideias?": "question.motivation.placeholder",
  "Equilibrar foco e multitarefa é um desafio constante no trabalho!": "question.focusMultitask.nexo",
  "Voce prefere terminar uma coisa por vez ou lidar com varias ao mesmo tempo?": "question.focusMultitask.title",
  "Uma por vez": "question.focusMultitask.leftLabel",
  "Varias ao mesmo tempo": "question.focusMultitask.rightLabel",
  "Voce gosta de focar em uma coisa ou dividir sua atencao em varias?": "question.focusMultitask.placeholder",
  "Sua persistência define muito do seu estilo profissional!": "question.persistence.nexo",
  "Quando comeca algo, voce costuma ir ate o final mesmo com dificuldades ou perde o interesse no meio?": "question.persistence.title",
  "Perde interesse": "question.persistence.leftLabel",
  "Vai ate o fim": "question.persistence.rightLabel",
  "Pensa em algo que voce comecou - o que te fez continuar ou parar?": "question.persistence.placeholder",
  "Como você lida com ritmo de trabalho diz muito sobre sua maturidade profissional!": "question.workPace.nexo",
  "Voce se sente mais confortavel seguindo um ritmo definido ou criando seu proprio ritmo?": "question.workPace.title",
  "Seguir ritmo": "question.workPace.leftLabel",
  "Criar ritmo": "question.workPace.rightLabel",
  "Voce prefere rotina ou liberdade para fazer no seu tempo?": "question.workPace.placeholder",
  "Agora vamos ver como você executa e entrega resultados!": "question.executionStart.nexo",
  "Agora vamos ver como vocÃª executa e entrega resultados!": "question.executionStart.nexo",
  "Quando voce tem varias coisas para fazer, voce costuma organizar tudo antes ou ir resolvendo conforme aparece?": "question.executionStart.title",
  "Ir fazendo": "question.executionStart.leftLabel",
  "Organizar primeiro": "question.executionStart.rightLabel",
  "Como voce se organiza quando tem varias tarefas ao mesmo tempo?": "question.executionStart.placeholder",
  "Última seção! Vamos entender como você se relaciona com outras pessoas no trabalho.": "question.relationshipStart.nexo",
  "Ãšltima seÃ§Ã£o! Vamos entender como vocÃª se relaciona com outras pessoas no trabalho.": "question.relationshipStart.nexo",
  "Quando voce precisa resolver algo dificil, voce prefere fazer sozinho ou trocar ideias com outras pessoas?": "question.relationshipStart.title",
  "Sozinho": "question.relationshipStart.leftLabel",
  "Com pessoas": "question.relationshipStart.rightLabel",
  "Quando surge um problema, voce costuma pedir opiniao ou resolver por conta propria?": "question.relationshipStart.placeholder",
  "Inteligência emocional é essencial para qualquer carreira de sucesso!": "question.communicationStyle.nexo",
  "Voce costuma falar o que pensa na hora ou prefere observar antes de se posicionar?": "question.communicationStyle.title",
  "Falar na hora": "question.communicationStyle.leftLabel",
  "Observar": "question.communicationStyle.rightLabel",
  "Em conversas, voce tende a falar rapido ou observar mais antes de opinar?": "question.communicationStyle.placeholder",
  "O que você faz quando ninguém lidera reflete o líder que você pode se tornar!": "question.leadershipInitiative.nexo",
  "Em uma situacao onde ninguem decide nada, voce tende a assumir a frente ou esperar alguem tomar iniciativa?": "question.leadershipInitiative.title",
  "Esperar": "question.leadershipInitiative.leftLabel",
  "Liderar": "question.leadershipInitiative.rightLabel",
  "Quando ninguem toma decisao, voce costuma agir ou aguardar alguem comecar?": "question.leadershipInitiative.placeholder",
  "Última pergunta! Seu estilo de participação é fundamental para sua carreira!": "question.participationStyle.nexo",
  "Voce se sente mais confortavel sendo o centro das interacoes ou participando de forma mais discreta?": "question.participationStyle.title",
  "Discreto": "question.participationStyle.leftLabel",
  "Protagonista": "question.participationStyle.rightLabel",
  "Em grupo, voce costuma se destacar ou prefere participar de forma mais tranquila?": "question.participationStyle.placeholder",
  "Essa é super importante! Seus valores guiam todas as suas decisões de carreira. Me mostra o que realmente importa pra você.": "sortingValues.nexo",
  "Organize seus valores de carreira por prioridade": "sortingValues.question",
  "Último mini-game! Resolva as palavras cruzadas com termos do mundo profissional!": "crossword.nexo",
  "Resolva as palavras cruzadas sobre carreiras e soft skills": "crossword.description",
}

export function QuizCard({ 
  questionNumber, 
  totalQuestions, 
  question, 
  options, 
  onAnswer,
  xpReward,
  questionType = "slider",
  scenario,
  gameType,
  aiMessage,
  aiEmotion = "happy",
  sliderConfig
}: QuizCardProps) {
  const { t } = useTranslation()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [sliderValue, setSliderValue] = useState<number>(3)
  const [observation, setObservation] = useState<string>("")

  const progress = (questionNumber / totalQuestions) * 100
  const TypeIcon = typeIcons[questionType]
  const isPreferencesQuestion =
    question === "Voce se sente mais confortavel quando sabe exatamente o que vai acontecer ou quando pode ir descobrindo aos poucos?"
  const isStartProjectsQuestion =
    question === "Quando voce comeca algo novo, voce prefere ja sair fazendo ou entender melhor antes de comecar?"
  const isReplanQuestion =
    question === "Se algo da errado no meio do caminho, voce tende a ajustar na hora ou parar para reorganizar tudo?"
  const isCreativeProblemSolvingQuestion =
    question === "Quando algo nao funciona como esperado, voce costuma repetir o que ja conhece ou tentar algo diferente?"
  const isFollowIdeasQuestion =
    question === "Voce gosta mais de seguir ideias ja prontas ou inventar suas proprias formas de fazer as coisas?"
  const isTaskStyleQuestion =
    question === "Quando alguem te da uma tarefa, voce prefere fazer do jeito que pediram ou dar seu proprio toque?"
  const isMotivationQuestion =
    question === "Voce se sente mais motivado quando tudo ja esta definido ou quando pode explorar possibilidades?"
  const isFocusMultitaskQuestion =
    question === "Voce prefere terminar uma coisa por vez ou lidar com varias ao mesmo tempo?"
  const isPersistenceQuestion =
    question === "Quando comeca algo, voce costuma ir ate o final mesmo com dificuldades ou perde o interesse no meio?"
  const isWorkPaceQuestion =
    question === "Voce se sente mais confortavel seguindo um ritmo definido ou criando seu proprio ritmo?"
  const isExecutionStartQuestion =
    question === "Quando voce tem varias coisas para fazer, voce costuma organizar tudo antes ou ir resolvendo conforme aparece?"
  const isRelationshipStartQuestion =
    question === "Quando voce precisa resolver algo dificil, voce prefere fazer sozinho ou trocar ideias com outras pessoas?"
  const isCommunicationStyleQuestion =
    question === "Voce costuma falar o que pensa na hora ou prefere observar antes de se posicionar?"
  const isLeadershipInitiativeQuestion =
    question === "Em uma situacao onde ninguem decide nada, voce tende a assumir a frente ou esperar alguem tomar iniciativa?"
  const isParticipationStyleQuestion =
    question === "Voce se sente mais confortavel sendo o centro das interacoes ou participando de forma mais discreta?"
  const questionUiKey = isPreferencesQuestion
    ? "question.preferences"
    : isStartProjectsQuestion
      ? "question.startProjects"
      : isReplanQuestion
        ? "question.replan"
        : isCreativeProblemSolvingQuestion
          ? "question.creativeProblemSolving"
          : isFollowIdeasQuestion
            ? "question.followIdeas"
            : isTaskStyleQuestion
              ? "question.taskStyle"
              : isMotivationQuestion
                ? "question.motivation"
                : isExecutionStartQuestion
                  ? "question.executionStart"
                  : isFocusMultitaskQuestion
                    ? "question.focusMultitask"
                    : isPersistenceQuestion
                      ? "question.persistence"
                      : isWorkPaceQuestion
                        ? "question.workPace"
                        : isRelationshipStartQuestion
                          ? "question.relationshipStart"
                          : isCommunicationStyleQuestion
                            ? "question.communicationStyle"
                            : isLeadershipInitiativeQuestion
                              ? "question.leadershipInitiative"
                              : isParticipationStyleQuestion
                                ? "question.participationStyle"
                                : "question.decision"
  const translateVisibleText = (value: string) => {
    const translationKey = visibleTextTranslationKeys[value]
    return translationKey ? t(translationKey, { defaultValue: value }) : value
  }

  const handleSelect = (optionId: string) => {
    if (!isAnimating) {
      setSelectedOption(optionId)
    }
  }

  const handleConfirm = () => {
    if (questionType === "slider") {
      setIsAnimating(true)
      // Determine trait based on slider value
      const trait = sliderValue <= 2 ? "left" : sliderValue >= 4 ? "right" : "balanced"
      setTimeout(() => {
        onAnswer("slider", trait, sliderValue, observation)
        setSliderValue(3)
        setObservation("")
        setIsAnimating(false)
      }, 400)
    } else if (selectedOption) {
      setIsAnimating(true)
      const option = options.find(o => o.id === selectedOption)
      setTimeout(() => {
        onAnswer(selectedOption, option?.trait || "")
        setSelectedOption(null)
        setIsAnimating(false)
      }, 400)
    }
  }

  const handleGameComplete = (score: number, trait: string) => {
    setIsAnimating(true)
    setTimeout(() => {
      onAnswer("game", trait)
      setIsAnimating(false)
    }, 400)
  }

  const getSliderLabel = (value: number) => {
    const labels = ["1", "2", "3", "4", "5"]
    return labels[value - 1] || "3"
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 md:p-10 max-w-2xl w-full shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border">
            <TypeIcon className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">{t(`quiz.typeLabels.${questionType}`, { defaultValue: typeLabels[questionType] })}</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {t("quiz.questionCounter", { current: questionNumber, total: totalQuestions })}
          </span>
        </div>

      </div>

      <div className="w-full h-3 bg-secondary rounded-full mb-6 overflow-hidden border border-border">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* AI Guide */}
      {aiMessage && (
        <div className="mb-6">
          <AIGuide 
            message={translateVisibleText(aiMessage)} 
            emotion={aiEmotion}
          />
        </div>
      )}

      {scenario && (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            <span className="text-sm font-bold text-foreground">{scenario.title}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{scenario.context}</p>
        </div>
      )}

      {/* Mini-Game ou Pergunta Normal */}
      {questionType === "game" && gameType ? (
        <div className="mb-8">
          <MiniGame
            type={gameType}
            question={translateVisibleText(question)}
            onComplete={handleGameComplete}
          />
        </div>
      ) : questionType === "slider" && sliderConfig ? (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-balance leading-tight">
            {translateVisibleText(question)}
          </h2>

          {/* Slider Section */}
          <div className="mb-8 space-y-6">
            {/* Slider Labels */}
            <div className="flex justify-between items-start text-sm">
              <span className="text-muted-foreground max-w-[140px] text-left font-medium">
                {translateVisibleText(sliderConfig.leftLabel)}
              </span>
              <span className="text-muted-foreground max-w-[140px] text-right font-medium">
                {translateVisibleText(sliderConfig.rightLabel)}
              </span>
            </div>

            {/* Slider */}
            <div className="px-2">
              <Slider
                value={[sliderValue]}
                onValueChange={(value) => setSliderValue(value[0])}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            {/* Slider Value Indicators */}
            <div className="flex justify-between px-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setSliderValue(num)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                    sliderValue === num
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Observation Field */}
            <div className="space-y-2 pt-4">
              <label className="text-sm font-medium text-foreground">
                {t(`${questionUiKey}.notesLabel`)}
              </label>
              <Textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder={translateVisibleText(sliderConfig.observationPlaceholder)}
                className="min-h-[100px] resize-none bg-background border-border focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {t(`${questionUiKey}.analysis`)} <span className="text-primary font-medium">{t(`${questionUiKey}.profile`)}</span> + <span className="text-accent font-medium">{t(`${questionUiKey}.goals`)}</span> + <span className="text-chart-3 font-medium">{t(`${questionUiKey}.rhythms`)}</span>
            </p>
            <Button 
              onClick={handleConfirm}
              disabled={isAnimating}
              className="h-14 px-8 text-base font-semibold gap-2 rounded-xl shadow-md"
            >
              {t(`${questionUiKey}.confirm`)}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-balance leading-tight">
            {translateVisibleText(question)}
          </h2>

          <div className="flex flex-col gap-3 mb-8">
            {options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={isAnimating}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left group",
                  selectedOption === option.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-background hover:border-primary/30 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl text-lg font-semibold transition-all",
                  selectedOption === option.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  {option.emoji || String.fromCharCode(65 + index)}
                </div>
                <span className="text-foreground flex-1 font-medium">{option.text}</span>
                {selectedOption === option.id ? (
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-border shrink-0 group-hover:text-primary/30" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {t("question.decision.analysis")} <span className="text-primary font-medium">{t("question.decision.profile")}</span> + <span className="text-accent font-medium">{t("question.decision.goals")}</span> + <span className="text-chart-3 font-medium">{t("question.decision.rhythms")}</span>
            </p>
            <Button 
              onClick={handleConfirm}
              disabled={!selectedOption || isAnimating}
              className="h-14 px-8 text-base font-semibold gap-2 rounded-xl shadow-md"
            >
              {t("question.decision.confirm")}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
