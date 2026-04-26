"use client"

import { useState, useCallback, useMemo } from "react"
import { Header } from "@/components/career/header"
import { WelcomeScreen, type UserData } from "@/components/career/welcome-screen"
import { QuizCard } from "@/components/career/quiz-card"
import { ProfileCard } from "@/components/career/profile-card"
import { Achievements } from "@/components/career/achievements"
import { CareerRoadmap } from "@/components/career/career-roadmap"
import { CareerSuggestions } from "@/components/career/career-suggestions"
import { CareerSimulation } from "@/components/career/career-simulation"
import { NetworkingSection } from "@/components/career/networking-section"
import { SoftSkillsPlan } from "@/components/career/softskills-plan"
import { StatsCards } from "@/components/career/stats-cards"
import { FeedbackCard } from "@/components/career/feedback-card"
import { ResultsPage } from "@/components/career/results-page"
import { Star, Zap, Target, Rocket, Brain, Users, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

// Perguntas organizadas em 4 blocos (S, C, E, R) com 4 perguntas cada
// Intercaladas com 4 mini-games - Usando sistema de slider (1-5)
const questions = [
  // GAME 1 - Memoria (icones de profissoes)
  {
    id: "g1",
    questionType: "game" as const,
    gameType: "memory" as const,
    question: "Vamos testar sua capacidade de foco e concentracao!",
    options: [],
    xpReward: 50,
    aiMessage: "Olá! Eu sou o Nexo, seu guia nessa jornada de autoconhecimento. Vamos começar com um joguinho para eu entender como você funciona!",
    aiEmotion: "excited" as const,
    blockType: "game" as const,
  },
  // BLOCO ESTRATEGICO (S) - 4 perguntas com slider
  {
    id: "s1",
    questionType: "slider" as const,
    question: "Quando voce precisa resolver algo importante, voce costuma agir mais por impulso ou pensar antes de decidir?",
    options: [],
    xpReward: 30,
    aiMessage: "Vamos entender como você toma decisões importantes. Isso revela muito sobre seu perfil estratégico!",
    aiEmotion: "thinking" as const,
    blockType: "strategic" as const,
    sliderConfig: {
      leftLabel: "Impulsivo",
      rightLabel: "Planejado",
      observationPlaceholder: "Conte como voce costuma decidir quando algo realmente importa."
    }
  },
  {
    id: "s2",
    questionType: "slider" as const,
    question: "Quando voce comeca algo novo, voce prefere ja sair fazendo ou entender melhor antes de comecar?",
    options: [],
    xpReward: 25,
    aiMessage: "Sua forma de iniciar projetos é uma característica fundamental do seu perfil profissional.",
    aiEmotion: "encouraging" as const,
    blockType: "strategic" as const,
    sliderConfig: {
      leftLabel: "Comecar rapido",
      rightLabel: "Entender primeiro",
      observationPlaceholder: "Como voce reage quando esta comecando algo totalmente novo?"
    }
  },
  {
    id: "s3",
    questionType: "slider" as const,
    question: "Se algo da errado no meio do caminho, voce tende a ajustar na hora ou parar para reorganizar tudo?",
    options: [],
    xpReward: 30,
    aiMessage: "Flexibilidade e planejamento caminham juntos no mundo profissional moderno.",
    aiEmotion: "happy" as const,
    blockType: "strategic" as const,
    sliderConfig: {
      leftLabel: "Resolver na hora",
      rightLabel: "Replanejar",
      observationPlaceholder: "Lembra de alguma vez em que algo saiu diferente do esperado? O que voce fez?"
    }
  },
  {
    id: "s4",
    questionType: "slider" as const,
    question: "Voce se sente mais confortavel quando sabe exatamente o que vai acontecer ou quando pode ir descobrindo aos poucos?",
    options: [],
    xpReward: 25,
    aiMessage: "Conhecer suas preferências é o primeiro passo para potencializá-las!",
    aiEmotion: "excited" as const,
    blockType: "strategic" as const,
    sliderConfig: {
      leftLabel: "Descobrir",
      rightLabel: "Prever",
      observationPlaceholder: "Voce prefere ter controle da situacao ou lidar com o que aparece no caminho?"
    }
  },
  // GAME 2 - Velocidade de Reacao
  {
    id: "g2",
    questionType: "game" as const,
    gameType: "reaction" as const,
    question: "Agora vamos ver sua velocidade de decisao!",
    options: [],
    xpReward: 50,
    aiMessage: "Excelente! Agora quero testar sua velocidade de reação. Isso me ajuda a entender seu estilo de tomada de decisão sob pressão.",
    aiEmotion: "excited" as const,
    blockType: "game" as const,
  },
  // BLOCO CRIATIVO (C) - 4 perguntas com slider
  {
    id: "c1",
    questionType: "slider" as const,
    question: "Quando algo nao funciona como esperado, voce costuma repetir o que ja conhece ou tentar algo diferente?",
    options: [],
    xpReward: 25,
    aiMessage: "Hora de explorar sua criatividade! Como você aborda problemas e desafios?",
    aiEmotion: "thinking" as const,
    blockType: "creative" as const,
    sliderConfig: {
      leftLabel: "Repetir",
      rightLabel: "Criar algo novo",
      observationPlaceholder: "Ja teve alguma situacao em que voce resolveu algo de um jeito diferente?"
    }
  },
  {
    id: "c2",
    questionType: "slider" as const,
    question: "Voce gosta mais de seguir ideias ja prontas ou inventar suas proprias formas de fazer as coisas?",
    options: [],
    xpReward: 30,
    aiMessage: "Resolução de problemas é uma habilidade muito valorizada no mercado!",
    aiEmotion: "encouraging" as const,
    blockType: "creative" as const,
    sliderConfig: {
      leftLabel: "Seguir",
      rightLabel: "Criar",
      observationPlaceholder: "Voce costuma seguir exemplos ou prefere fazer do seu proprio jeito?"
    }
  },
  {
    id: "c3",
    questionType: "slider" as const,
    question: "Quando alguem te da uma tarefa, voce prefere fazer do jeito que pediram ou dar seu proprio toque?",
    options: [],
    xpReward: 25,
    aiMessage: "Sua forma de executar tarefas diz muito sobre que tipo de carreira vai fazer você feliz!",
    aiEmotion: "happy" as const,
    blockType: "creative" as const,
    sliderConfig: {
      leftLabel: "Seguir instrucoes",
      rightLabel: "Personalizar",
      observationPlaceholder: "Quando alguem te orienta, voce adapta ou segue exatamente como foi explicado?"
    }
  },
  {
    id: "c4",
    questionType: "slider" as const,
    question: "Voce se sente mais motivado quando tudo ja esta definido ou quando pode explorar possibilidades?",
    options: [],
    xpReward: 30,
    aiMessage: "Sua motivação e criatividade são habilidades essenciais!",
    aiEmotion: "thinking" as const,
    blockType: "creative" as const,
    sliderConfig: {
      leftLabel: "Tudo definido",
      rightLabel: "Explorar",
      observationPlaceholder: "O que te anima mais: algo ja estruturado ou liberdade para explorar ideias?"
    }
  },
  // GAME 3 - Ordenacao de Prioridades
  {
    id: "g3",
    questionType: "game" as const,
    gameType: "sorting" as const,
    question: "Organize seus valores de carreira por prioridade",
    options: [],
    xpReward: 40,
    aiMessage: "Essa é super importante! Seus valores guiam todas as suas decisões de carreira. Me mostra o que realmente importa pra você.",
    aiEmotion: "thinking" as const,
    blockType: "game" as const,
  },
  // BLOCO EXECUCAO (E) - 4 perguntas com slider
  {
    id: "e1",
    questionType: "slider" as const,
    question: "Quando voce tem varias coisas para fazer, voce costuma organizar tudo antes ou ir resolvendo conforme aparece?",
    options: [],
    xpReward: 25,
    aiMessage: "Agora vamos ver como você executa e entrega resultados!",
    aiEmotion: "excited" as const,
    blockType: "execution" as const,
    sliderConfig: {
      leftLabel: "Ir fazendo",
      rightLabel: "Organizar primeiro",
      observationPlaceholder: "Como voce se organiza quando tem varias tarefas ao mesmo tempo?"
    }
  },
  {
    id: "e2",
    questionType: "slider" as const,
    question: "Voce prefere terminar uma coisa por vez ou lidar com varias ao mesmo tempo?",
    options: [],
    xpReward: 30,
    aiMessage: "Equilibrar foco e multitarefa é um desafio constante no trabalho!",
    aiEmotion: "thinking" as const,
    blockType: "execution" as const,
    sliderConfig: {
      leftLabel: "Uma por vez",
      rightLabel: "Varias ao mesmo tempo",
      observationPlaceholder: "Voce gosta de focar em uma coisa ou dividir sua atencao em varias?"
    }
  },
  {
    id: "e3",
    questionType: "slider" as const,
    question: "Quando comeca algo, voce costuma ir ate o final mesmo com dificuldades ou perde o interesse no meio?",
    options: [],
    xpReward: 25,
    aiMessage: "Sua persistência define muito do seu estilo profissional!",
    aiEmotion: "encouraging" as const,
    blockType: "execution" as const,
    sliderConfig: {
      leftLabel: "Perde interesse",
      rightLabel: "Vai ate o fim",
      observationPlaceholder: "Pensa em algo que voce comecou - o que te fez continuar ou parar?"
    }
  },
  {
    id: "e4",
    questionType: "slider" as const,
    question: "Voce se sente mais confortavel seguindo um ritmo definido ou criando seu proprio ritmo?",
    options: [],
    xpReward: 30,
    aiMessage: "Como você lida com ritmo de trabalho diz muito sobre sua maturidade profissional!",
    aiEmotion: "happy" as const,
    blockType: "execution" as const,
    sliderConfig: {
      leftLabel: "Seguir ritmo",
      rightLabel: "Criar ritmo",
      observationPlaceholder: "Voce prefere rotina ou liberdade para fazer no seu tempo?"
    }
  },
  // GAME 4 - Palavras Cruzadas
  {
    id: "g4",
    questionType: "game" as const,
    gameType: "crossword" as const,
    question: "Resolva as palavras cruzadas sobre carreiras e soft skills",
    options: [],
    xpReward: 50,
    aiMessage: "Último mini-game! Resolva as palavras cruzadas com termos do mundo profissional!",
    aiEmotion: "excited" as const,
    blockType: "game" as const,
  },
  // BLOCO RELACIONAL (R) - 4 perguntas com slider
  {
    id: "r1",
    questionType: "slider" as const,
    question: "Quando voce precisa resolver algo dificil, voce prefere fazer sozinho ou trocar ideias com outras pessoas?",
    options: [],
    xpReward: 25,
    aiMessage: "Última seção! Vamos entender como você se relaciona com outras pessoas no trabalho.",
    aiEmotion: "happy" as const,
    blockType: "relational" as const,
    sliderConfig: {
      leftLabel: "Sozinho",
      rightLabel: "Com pessoas",
      observationPlaceholder: "Quando surge um problema, voce costuma pedir opiniao ou resolver por conta propria?"
    }
  },
  {
    id: "r2",
    questionType: "slider" as const,
    question: "Voce costuma falar o que pensa na hora ou prefere observar antes de se posicionar?",
    options: [],
    xpReward: 30,
    aiMessage: "Inteligência emocional é essencial para qualquer carreira de sucesso!",
    aiEmotion: "thinking" as const,
    blockType: "relational" as const,
    sliderConfig: {
      leftLabel: "Falar na hora",
      rightLabel: "Observar",
      observationPlaceholder: "Em conversas, voce tende a falar rapido ou observar mais antes de opinar?"
    }
  },
  {
    id: "r3",
    questionType: "slider" as const,
    question: "Em uma situacao onde ninguem decide nada, voce tende a assumir a frente ou esperar alguem tomar iniciativa?",
    options: [],
    xpReward: 25,
    aiMessage: "O que você faz quando ninguém lidera reflete o líder que você pode se tornar!",
    aiEmotion: "encouraging" as const,
    blockType: "relational" as const,
    sliderConfig: {
      leftLabel: "Esperar",
      rightLabel: "Liderar",
      observationPlaceholder: "Quando ninguem toma decisao, voce costuma agir ou aguardar alguem comecar?"
    }
  },
  {
    id: "r4",
    questionType: "slider" as const,
    question: "Voce se sente mais confortavel sendo o centro das interacoes ou participando de forma mais discreta?",
    options: [],
    xpReward: 30,
    aiMessage: "Última pergunta! Seu estilo de participação é fundamental para sua carreira!",
    aiEmotion: "excited" as const,
    blockType: "relational" as const,
    sliderConfig: {
      leftLabel: "Discreto",
      rightLabel: "Protagonista",
      observationPlaceholder: "Em grupo, voce costuma se destacar ou prefere participar de forma mais tranquila?"
    }
  },
]

// Feedback messages based on performance - More dynamic and varied
const feedbackMessages = {
  game: {
    good: [
      "Excelente desempenho! Voce mostrou grande capacidade de foco e concentracao!",
      "Muito bem! Sua agilidade mental e impressionante! Continue assim!",
      "Otimo trabalho! Voce e rapido e preciso nas decisoes. Isso fara diferenca na sua carreira!",
      "Incrivel! Voce tem um raciocinio agil que vai te ajudar muito!",
      "Sensacional! Poucos conseguem esse nivel de performance!",
    ],
    average: [
      "Bom trabalho! Voce esta no caminho certo para o sucesso!",
      "Voce completou bem! Cada passo conta na sua jornada!",
      "Boa performance! Voce tem potencial para ir ainda mais longe!",
      "Muito bom! Continue praticando e vera resultados ainda melhores!",
      "Parabens! Voce mostrou determinacao e isso e fundamental!",
    ],
    needsWork: [
      "Voce tem um estilo mais reflexivo, e isso pode ser uma grande forca!",
      "Cada pessoa tem seu proprio ritmo. O importante e a consistencia!",
      "Não desanime! Os melhores profissionais aprendem com cada experiência!",
      "Seu estilo pensativo pode ser uma vantagem em decisoes complexas!",
    ],
  },
  question: {
    strategic: [
      "Sua resposta mostra um pensamento estrategico refinado!",
      "Voce tem visao de longo prazo, isso e uma grande forca!",
      "Excelente! Voce pensa como um estrategista nato!",
      "Sua capacidade de planejar vai te levar longe!",
      "Adorei! Voce analisa situacoes com profundidade!",
    ],
    creative: [
      "Adorei sua abordagem criativa e inovadora!",
      "Voce pensa fora da caixa, isso e muito valioso!",
      "Sua criatividade e um diferencial no mercado!",
      "Incrivel! Voce encontra solucoes que outros nao veem!",
      "Sua mente criativa vai abrir muitas portas!",
    ],
    execution: [
      "Voce e focado em resultados, isso e excelente!",
      "Sua orientacao para execucao e admiravel!",
      "Voce faz acontecer! Empresas adoram profissionais assim!",
      "Parabens! Voce transforma planos em realidade!",
      "Sua capacidade de entrega e impressionante!",
    ],
    relational: [
      "Voce valoriza as pessoas, isso e fundamental!",
      "Sua inteligencia emocional e um grande trunfo!",
      "Excelente! Relacionamentos sao a base de carreiras de sucesso!",
      "Voce sabe trabalhar em equipe, isso e raro e valioso!",
      "Sua empatia vai te destacar em qualquer profissao!",
    ],
    left: [
      "Interessante! Voce tem um estilo mais intuitivo e espontaneo.",
      "Sua abordagem mais direta pode ser muito eficiente!",
      "Voce prefere agir primeiro e ajustar depois, isso tem suas vantagens!",
    ],
    right: [
      "Voce prefere uma abordagem mais estruturada e planejada!",
      "Sua tendencia a analisar antes de agir e muito valiosa!",
      "Voce gosta de ter clareza antes de comecar, isso e estrategico!",
    ],
    balanced: [
      "Voce tem um equilibrio interessante em sua abordagem!",
      "Sua flexibilidade para se adaptar e uma grande forca!",
      "Voce sabe dosar entre acao e reflexao conforme a situacao!",
    ],
  },
}

const careerSuggestions = [
  {
    id: "1",
    title: "Product Manager",
    matchPercentage: 94,
    salaryRange: "R$ 12k - R$ 28k",
    growthRate: "+32%",
    timeToTransition: "6-12 meses",
    description: "Lidere produtos digitais conectando negócios, tecnologia e experiência do usuário. Ideal para quem gosta de estratégia e impacto.",
    topSkills: ["Estratégia", "Análise", "Liderança", "UX"],
    characterImage: "/characters/advogada.jpg",
    selected: true,
    faculties: [
      { name: "Stanford University", location: "EUA", course: "MBA" },
      { name: "INSEAD", location: "Franca/Singapura", course: "MBA" },
      { name: "USP", location: "Brasil", course: "Administracao" },
    ],
  },
  {
    id: "2",
    title: "UX Designer",
    matchPercentage: 89,
    salaryRange: "R$ 8k - R$ 22k",
    growthRate: "+28%",
    timeToTransition: "4-8 meses",
    description: "Crie experiências digitais que encantam usuários. Combina criatividade, empatia e pensamento analítico.",
    topSkills: ["Design", "Pesquisa", "Prototipagem", "Empatia"],
    characterImage: "/characters/designer-f.jpg",
    faculties: [
      { name: "Parsons School of Design", location: "EUA", course: "Design" },
      { name: "Royal College of Art", location: "Reino Unido", course: "Design" },
      { name: "IED", location: "Italia/Espanha", course: "Design" },
    ],
  },
  {
    id: "3",
    title: "Data Analyst",
    matchPercentage: 85,
    salaryRange: "R$ 7k - R$ 18k",
    growthRate: "+35%",
    timeToTransition: "6-10 meses",
    description: "Transforme dados em insights estrategicos para decisoes de negocio. Ideal para mentes analiticas.",
    topSkills: ["SQL", "Python", "Visualizacao", "Estatistica"],
    characterImage: "/characters/programadora.jpg",
    faculties: [
      { name: "MIT", location: "EUA", course: "Data Science" },
      { name: "ETH Zurich", location: "Suica", course: "Computer Science" },
      { name: "Unicamp", location: "Brasil", course: "Estatistica" },
    ],
  },
]

const roadmapSteps = [
  {
    id: "1",
    title: "Fundamentos de Produto",
    description: "Aprenda os conceitos essenciais de gestão de produtos digitais e metodologias ágeis.",
    duration: "4 semanas",
    skills: ["Product Discovery", "Scrum", "Métricas"],
    status: "completed" as const,
    icon: "learn" as const,
  },
  {
    id: "2",
    title: "Experiencia Internacional",
    description: "Participe de programas de intercâmbio para desenvolver habilidades práticas com mentoria especializada.",
    duration: "8 semanas",
    skills: ["Hands-on", "Mentoria", "Networking"],
    status: "current" as const,
    icon: "work" as const,
  },
  {
    id: "3",
    title: "Certificações",
    description: "Obtenha certificações reconhecidas pelo mercado para validar suas competências.",
    duration: "3 semanas",
    skills: ["CSPO", "Google PM", "Análise de Dados"],
    status: "upcoming" as const,
    icon: "certify" as const,
  },
  {
    id: "4",
    title: "Primeiro Emprego",
    description: "Com o perfil CarrIA, conecte-se com empresas que buscam exatamente seu perfil.",
    duration: "Contínuo",
    skills: ["Entrevistas", "Portfolio", "Networking"],
    status: "upcoming" as const,
    icon: "achieve" as const,
  },
]

const dayInLife = [
  { time: "09:00", activity: "Daily standup com o time de desenvolvimento", type: "meeting" as const },
  { time: "10:00", activity: "Análise de métricas e feedback de usuários", type: "work" as const },
  { time: "12:00", activity: "Almoço e networking com colegas", type: "break" as const },
  { time: "14:00", activity: "Workshop de produto com stakeholders", type: "meeting" as const },
  { time: "16:00", activity: "Priorização de backlog e planejamento", type: "work" as const },
  { time: "17:30", activity: "Estudo: curso de Product Analytics", type: "learning" as const },
]

const challenges = [
  { title: "Priorização constante", description: "Equilibrar demandas de diferentes stakeholders", difficulty: "hard" as const },
  { title: "Comunicação clara", description: "Traduzir necessidades técnicas para negócio e vice-versa", difficulty: "medium" as const },
  { title: "Decisões com incerteza", description: "Tomar decisões mesmo sem todos os dados", difficulty: "medium" as const },
]

const opportunities = [
  "Transição para Head de Produto em 3-5 anos",
  "Especialização em Product-Led Growth",
  "Empreendedorismo e criação de startups",
  "Consultoria internacional em produto",
]

const networkConnections = [
  { id: "1", name: "Ana Silva", role: "Senior PM", company: "Nubank", location: "São Paulo", country: "Brasil", relevance: 95, isRecommended: true },
  { id: "2", name: "Carlos Chen", role: "Product Lead", company: "Stripe", location: "San Francisco", country: "EUA", relevance: 88 },
  { id: "3", name: "Maria García", role: "Head of Product", company: "Mercado Libre", location: "Buenos Aires", country: "Argentina", relevance: 82 },
  { id: "4", name: "John Smith", role: "PM", company: "Spotify", location: "Stockholm", country: "Suécia", relevance: 79 },
  { id: "5", name: "Priya Patel", role: "Product Manager", company: "Razorpay", location: "Bangalore", country: "Índia", relevance: 75 },
  { id: "6", name: "Lucas Weber", role: "Senior PM", company: "N26", location: "Berlin", country: "Alemanha", relevance: 72 },
]

const softSkillsData = {
  dreamCareer: "Product Manager",
  currentMatch: 72,
  potentialMatch: 94,
  skills: [
    {
      name: "Comunicação Executiva",
      currentLevel: 65,
      targetLevel: 90,
      importance: "critical" as const,
      tips: ["Pratique apresentações semanais", "Faça curso de storytelling", "Peça feedback após reuniões"],
    },
    {
      name: "Pensamento Analítico",
      currentLevel: 78,
      targetLevel: 85,
      importance: "high" as const,
      tips: ["Estude SQL e análise de dados", "Pratique frameworks de priorização"],
    },
    {
      name: "Liderança sem Autoridade",
      currentLevel: 55,
      targetLevel: 80,
      importance: "critical" as const,
      tips: ["Lidere projetos voluntários", "Desenvolva empatia ativa", "Aprenda técnicas de influência"],
    },
  ],
}

const initialAchievements = [
  { id: "firstStep", title: "Primeiro Passo", description: "Complete o quiz inicial", icon: <Star className="w-5 h-5" />, unlocked: false },
  { id: "quickLearner", title: "Aprendiz Veloz", description: "Responda 5 perguntas seguidas", icon: <Zap className="w-5 h-5" />, unlocked: false, progress: 0, maxProgress: 5 },
  { id: "goalSetter", title: "Definidor de Metas", description: "Selecione uma carreira", icon: <Target className="w-5 h-5" />, unlocked: false },
  { id: "explorer", title: "Explorador Global", description: "Visualize conexões internacionais", icon: <Globe className="w-5 h-5" />, unlocked: false },
  { id: "strategic", title: "Estrategista", description: "Complete o plano de evolução", icon: <Brain className="w-5 h-5" />, unlocked: false },
  { id: "networker", title: "Networker", description: "Conecte-se com 3 profissionais", icon: <Users className="w-5 h-5" />, unlocked: false },
]

export default function CarrIAPage() {
  const [gameState, setGameState] = useState<"welcome" | "quiz" | "results">("welcome")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(1)
  const [traits, setTraits] = useState<Record<string, number>>({
    strategic: 0,
    creative: 0,
    execution: 0,
    relational: 0,
  })
  const [selectedCareer, setSelectedCareer] = useState<string>("1")
  const [achievements, setAchievements] = useState(initialAchievements)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [lastFeedback, setLastFeedback] = useState<string | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)

// Tabela de nomenclatura base para geracao automatica de nomes
  const nameTable = {
    strategic: {
      1: "Operador",
      2: "Planejador",
      3: "Estrategista",
      4: "Visionario",
    },
    creative: {
      1: "Pratico",
      2: "Explorador",
      3: "Criador",
      4: "Disruptivo",
    },
    execution: {
      1: "Executor",
      2: "Organizador",
      3: "Realizador",
      4: "Construtor",
    },
    relational: {
      1: "Independente",
      2: "Colaborador",
      3: "Comunicador",
      4: "Lider",
    },
  }

  // Descricoes para cada combinacao de eixo dominante
  const traitDescriptions = {
    strategic: "Voce tem uma mente voltada para planejamento e visao de futuro.",
    creative: "Voce se destaca pela capacidade de criar solucoes inovadoras.",
    execution: "Voce e focado em resultados e entrega com excelencia.",
    relational: "Voce tem habilidade natural para conectar e influenciar pessoas.",
  }

  // Calculate profile based on traits with new classification system
  const classification = useMemo(() => {
    const total = Object.values(traits).reduce((a, b) => a + b, 0) || 1
    const traitScores = {
      strategic: Math.round((traits.strategic / total) * 100) || 25,
      creative: Math.round((traits.creative / total) * 100) || 25,
      execution: Math.round((traits.execution / total) * 100) || 25,
      relational: Math.round((traits.relational / total) * 100) || 25,
    }
  
    // Calculate level (1-4) for each trait based on score percentage
    const getLevel = (score: number): number => {
      if (score >= 35) return 4
      if (score >= 28) return 3
      if (score >= 20) return 2
      return 1
    }
    
    const levels = {
      S: getLevel(traitScores.strategic),
      C: getLevel(traitScores.creative),
      E: getLevel(traitScores.execution),
      R: getLevel(traitScores.relational),
    }
  
    // Identify the 2 dominant axes based on levels
    const axisScores = [
      { axis: "strategic" as const, level: levels.S, score: traitScores.strategic },
      { axis: "creative" as const, level: levels.C, score: traitScores.creative },
      { axis: "execution" as const, level: levels.E, score: traitScores.execution },
      { axis: "relational" as const, level: levels.R, score: traitScores.relational },
    ]
    
    // Sort by level first, then by score for tie-breaking
    const sortedAxes = axisScores.sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level
      return b.score - a.score
    })
    
    const primaryAxis = sortedAxes[0]
    const secondaryAxis = sortedAxes[1]
    
    // Generate dynamic name from the 2 dominant axes
    const primaryName = nameTable[primaryAxis.axis][primaryAxis.level as 1 | 2 | 3 | 4]
    const secondaryName = nameTable[secondaryAxis.axis][secondaryAxis.level as 1 | 2 | 3 | 4]
    const dynamicTitle = `${primaryName} ${secondaryName}`
    
    // Generate description based on primary axis
    const description = traitDescriptions[primaryAxis.axis]
  
    // Generate full classification code (e.g., S2-C3-E1-R4)
    const fullCode = `S${levels.S}-C${levels.C}-E${levels.E}-R${levels.R}`
  
    return {
      code: fullCode,
      title: dynamicTitle,
      description,
      traitScores,
      levels,
      primary: primaryAxis.axis,
      primaryLevel: primaryAxis.level,
      secondary: secondaryAxis.axis,
      secondaryLevel: secondaryAxis.level,
    }
  }, [traits])

  const profileTraits = [
    { name: "Estrategico", value: classification.traitScores.strategic, color: "bg-primary" },
    { name: "Criativo", value: classification.traitScores.creative, color: "bg-chart-2" },
    { name: "Execucao", value: classification.traitScores.execution, color: "bg-chart-1" },
    { name: "Relacional", value: classification.traitScores.relational, color: "bg-chart-3" },
  ]

  const completionPercentage = Math.round((currentQuestion / questions.length) * 100)

  const stats = [
    { label: "Perguntas", value: currentQuestion.toString(), change: `/${questions.length}`, changeType: "neutral" as const, icon: "target" as const },
    { label: "XP Total", value: xp.toString(), change: "+30", changeType: "positive" as const, icon: "trending" as const },
    { label: "Classificacao", value: classification.code, icon: "award" as const },
    { label: "Acertos", value: `${completionPercentage}%`, change: "completo", changeType: "positive" as const, icon: "clock" as const },
  ]

  const handleStart = (data: UserData) => {
    setUserData(data)
    setGameState("quiz")
  }

  // Generate feedback message
const generateFeedback = useCallback((trait: string, isGame: boolean = false) => {
    if (isGame) {
      const messages = feedbackMessages.game.good
      return messages[Math.floor(Math.random() * messages.length)]
    }
    const traitMessages = feedbackMessages.question[trait as keyof typeof feedbackMessages.question]
    if (Array.isArray(traitMessages)) {
      return traitMessages[Math.floor(Math.random() * traitMessages.length)]
    }
    return "Otima resposta! Voce esta no caminho certo!"
  }, [])

  const handleAnswer = useCallback((optionId: string, trait: string, sliderValue?: number, observation?: string) => {
    const currentQ = questions[currentQuestion]
    setXp(prev => prev + currentQ.xpReward)

    // For slider questions, determine trait based on blockType and slider value
    let effectiveTrait = trait
    if (currentQ.questionType === "slider" && sliderValue !== undefined) {
      // Map slider value to trait intensity based on the block type
      const blockType = currentQ.blockType as string
      if (blockType && ["strategic", "creative", "execution", "relational"].includes(blockType)) {
        // Higher slider values (4-5) indicate stronger alignment with the block trait
        // Lower values (1-2) indicate less alignment
        // Middle values (3) are balanced
        const intensity = sliderValue >= 4 ? 1.5 : sliderValue <= 2 ? 0.5 : 1
        effectiveTrait = blockType
        setTraits(prev => ({
          ...prev,
          [effectiveTrait]: (prev[effectiveTrait] || 0) + intensity
        }))
      }
    } else if (trait && ["strategic", "creative", "execution", "relational"].includes(trait)) {
      // Track trait for non-slider questions
      setTraits(prev => ({
        ...prev,
        [trait]: (prev[trait] || 0) + 1
      }))
    }

    // Only show feedback after mini-games, not after regular questions
    const isGame = currentQ.questionType === "game"
    setCorrectAnswers(prev => prev + 1)

    // Update achievements
    setAchievements(prev => prev.map(a => {
      if (a.id === "quickLearner" && a.progress !== undefined) {
        const newProgress = Math.min(a.progress + 1, a.maxProgress || 5)
        return { ...a, progress: newProgress, unlocked: newProgress >= (a.maxProgress || 5) }
      }
      return a
    }))

    if (isGame) {
      // Show feedback only after mini-games
      const feedback = generateFeedback(trait, isGame)
      setLastFeedback(feedback)
      setShowFeedback(true)
      
      // Hide feedback after 3 seconds and move to next question
      setTimeout(() => {
        setShowFeedback(false)
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1)
        } else {
          setAchievements(prev => prev.map(a =>
            a.id === "firstStep" ? { ...a, unlocked: true } : a
          ))
          setXp(prev => prev + 150)
          setLevel(2)
          setGameState("results")
        }
      }, 3000) // 3 seconds
    } else {
      // For regular questions, move to next immediately without feedback
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        setAchievements(prev => prev.map(a =>
          a.id === "firstStep" ? { ...a, unlocked: true } : a
        ))
        setXp(prev => prev + 150)
        setLevel(2)
        setGameState("results")
      }
    }
  }, [currentQuestion, generateFeedback])

  // Handler to close feedback early
  const handleCloseFeedback = useCallback(() => {
    setShowFeedback(false)
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setAchievements(prev => prev.map(a =>
        a.id === "firstStep" ? { ...a, unlocked: true } : a
      ))
      setXp(prev => prev + 150)
      setLevel(2)
      setGameState("results")
    }
  }, [currentQuestion])

  const handleCareerSelect = (careerId: string) => {
    setSelectedCareer(careerId)
    setAchievements(prev => prev.map(a =>
      a.id === "goalSetter" ? { ...a, unlocked: true } : a
    ))
  }

  if (gameState === "welcome") {
    return <WelcomeScreen onStart={handleStart} />
  }

  // Guard against out-of-bounds access - use last question as fallback for results screen
  const currentQ = questions[Math.min(currentQuestion, questions.length - 1)]

  // Render results page separately (has its own full layout with footer)
  if (gameState === "results") {
    return (
      <div className="min-h-screen bg-background">
        <Header xp={xp} level={level} streak={streak} />
        <ResultsPage
          userData={userData}
          classification={classification}
          careerSuggestions={careerSuggestions}
          softSkillsData={{
            ...softSkillsData,
            dreamCareer: userData?.dreamCareer || softSkillsData.dreamCareer
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header xp={xp} level={level} streak={streak} />

      <main className="container mx-auto px-4 py-8">
        {gameState === "quiz" && currentQ && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            {/* Progress indicator */}
            <div className="w-full max-w-2xl mb-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Progresso: {currentQuestion + 1} de {questions.length}</span>
                <span>{completionPercentage}% completo</span>
              </div>
            </div>
            
            <QuizCard
              questionNumber={currentQuestion + 1}
              totalQuestions={questions.length}
              question={currentQ.question}
              options={currentQ.options}
              onAnswer={handleAnswer}
              xpReward={currentQ.xpReward}
              questionType={currentQ.questionType}
              scenario={currentQ.scenario}
              gameType={currentQ.gameType}
              aiMessage={currentQ.aiMessage}
              aiEmotion={currentQ.aiEmotion}
              sliderConfig={currentQ.sliderConfig}
            />
            
            {/* Feedback Card */}
            <FeedbackCard
              message={lastFeedback || ""}
              isVisible={showFeedback}
              percentage={completionPercentage}
              xpGained={currentQ.xpReward}
              onClose={handleCloseFeedback}
            />
            
            {/* Temporary Skip Button for Development */}
            <button
              onClick={() => {
                if (currentQuestion < questions.length - 1) {
                  setCurrentQuestion(prev => prev + 1)
                  setXp(prev => prev + currentQ.xpReward)
                } else {
                  setAchievements(prev => prev.map(a =>
                    a.id === "firstStep" ? { ...a, unlocked: true } : a
                  ))
                  setXp(prev => prev + 150)
                  setLevel(2)
                  setGameState("results")
                }
              }}
              className="fixed bottom-4 right-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-lg z-50 transition-colors"
            >
              SKIP (Dev)
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
