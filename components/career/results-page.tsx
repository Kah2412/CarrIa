"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, ChevronRight, User, Map, Lightbulb, TrendingUp, Briefcase, GraduationCap, Star, Users, Building, History, Mail, Phone, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { M60FloatingBalloon } from "./m60-floating-balloon"

interface ResultsPageProps {
  userData: {
    name?: string
    dreamCareer?: string
  } | null
  classification: {
    code: string
    title: string
    description: string
    traitScores: {
      strategic: number
      creative: number
      execution: number
      relational: number
    }
    levels?: {
      S: number
      C: number
      E: number
      R: number
    }
    primary?: string
    primaryLevel?: number
    secondary?: string
    secondaryLevel?: number
  }
  careerSuggestions: Array<{
    id: string
    title: string
    matchPercentage: number
    salaryRange: string
    growthRate: string
    timeToTransition: string
    description: string
    topSkills: string[]
    characterImage: string
    faculties?: Array<{
      name: string
      location: string
      course: string
    }>
  }>
  softSkillsData: {
    dreamCareer: string
    currentMatch: number
    potentialMatch: number
    skills: Array<{
      name: string
      currentLevel: number
      targetLevel: number
      importance: "critical" | "high" | "medium"
      tips: string[]
    }>
  }
}

type SectionId = "profile" | "career-mapping" | "soft-skills" | "evolution" | "careers" | "education"

interface Section {
  id: SectionId
  title: string
  icon: React.ReactNode
  questionCount: number
}

const sections: Section[] = [
  { id: "profile", title: "Visão Geral do Perfil", icon: <User className="w-5 h-5" />, questionCount: 4 },
  { id: "career-mapping", title: "Mapeamento de Carreira", icon: <Map className="w-5 h-5" />, questionCount: 6 },
  { id: "soft-skills", title: "Soft Skills Recomendadas", icon: <Lightbulb className="w-5 h-5" />, questionCount: 5 },
  { id: "evolution", title: "Sugestões de Evolução", icon: <TrendingUp className="w-5 h-5" />, questionCount: 4 },
  { id: "careers", title: "Carreiras Indicadas", icon: <Briefcase className="w-5 h-5" />, questionCount: 3 },
  { id: "education", title: "Educação e Caminhos", icon: <GraduationCap className="w-5 h-5" />, questionCount: 8 },
]

export function ResultsPage({ userData, classification, careerSuggestions, softSkillsData }: ResultsPageProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("profile")
  // Initialize with all profile items expanded by default
  const [openItems, setOpenItems] = useState<string[]>(["classification", "profile-title", "trait-scores", "dream-career"])

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-4">
            {/* Classification Code */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("classification")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">Qual é minha classificação completa?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("classification") && "rotate-180")} />
              </button>
              {openItems.includes("classification") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4">
                    <p className="text-muted-foreground mb-4">Sua classificação completa é:</p>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">S{classification.levels?.S || 1}</span>
                        <p className="text-xs text-muted-foreground mt-1">Estratégico</p>
                      </div>
                      <div className="px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">C{classification.levels?.C || 1}</span>
                        <p className="text-xs text-muted-foreground mt-1">Criativo</p>
                      </div>
                      <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">E{classification.levels?.E || 1}</span>
                        <p className="text-xs text-muted-foreground mt-1">Execução</p>
                      </div>
                      <div className="px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
                        <span className="text-xl font-bold text-orange-600 dark:text-orange-400">R{classification.levels?.R || 1}</span>
                        <p className="text-xs text-muted-foreground mt-1">Relacional</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 border border-border">
                        <span className="text-sm text-muted-foreground">Código técnico:</span>
                        <span className="text-lg font-bold text-foreground font-mono">{classification.code}</span>
                      </div>
                      <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/30">
                        <span className="text-sm text-muted-foreground">Seu perfil:</span>
                        <span className="text-lg font-bold text-primary">{classification.title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Title */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("profile-title")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">O que significa o meu perfil?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("profile-title") && "rotate-180")} />
              </button>
              {openItems.includes("profile-title") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4 space-y-4">
                    <div>
                      <h4 className="text-2xl font-bold text-primary mb-2">{classification.title}</h4>
                      <p className="text-muted-foreground">{classification.description}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">Como seu nome foi gerado:</p>
                      <p className="text-sm text-foreground">
                        O nome <span className="font-semibold text-primary">{classification.title}</span> foi criado 
                        automaticamente com base nos seus <span className="font-medium">2 eixos mais dominantes</span>:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-foreground">
                            <span className="font-medium">Eixo principal:</span> {classification.primary === "strategic" ? "Estratégico" : classification.primary === "creative" ? "Criativo" : classification.primary === "execution" ? "Execução" : "Relacional"} (nível {classification.primaryLevel})
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                          <span className="text-foreground">
                            <span className="font-medium">Eixo secundário:</span> {classification.secondary === "strategic" ? "Estratégico" : classification.secondary === "creative" ? "Criativo" : classification.secondary === "execution" ? "Execução" : "Relacional"} (nível {classification.secondaryLevel})
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Trait Scores */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("trait-scores")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">Quais sao minhas pontuacoes em cada traco?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("trait-scores") && "rotate-180")} />
              </button>
              {openItems.includes("trait-scores") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4 space-y-4">
                    {Object.entries(classification.traitScores).map(([trait, score]) => (
                      <div key={trait}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-foreground">{trait === "strategic" ? "Estratégico" : trait === "creative" ? "Criativo" : trait === "execution" ? "Execução" : "Relacional"}</span>
                          <span className="text-muted-foreground">{score}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all",
                              trait === "strategic" ? "bg-blue-500" :
                              trait === "creative" ? "bg-purple-500" :
                              trait === "execution" ? "bg-green-500" : "bg-orange-500"
                            )}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dream Career Match */}
            {userData?.dreamCareer && (
              <div className="border border-border rounded-lg bg-card overflow-hidden">
                <button
                  onClick={() => toggleItem("dream-career")}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
                >
                  <span className="font-medium text-foreground">Qual a compatibilidade com minha carreira dos sonhos?</span>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("dream-career") && "rotate-180")} />
                </button>
                {openItems.includes("dream-career") && (
                  <div className="px-5 pb-5 border-t border-border">
                    <div className="pt-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-3xl font-bold text-primary">{Math.floor(Math.random() * 25 + 65)}%</div>
                        <div>
                          <p className="text-sm text-muted-foreground">de compatibilidade com</p>
                          <p className="font-semibold text-foreground">{userData.dreamCareer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case "career-mapping":
        return (
          <div className="space-y-4">
            {careerSuggestions.map((career, index) => (
              <div key={career.id} className="border border-border rounded-lg bg-card overflow-hidden">
                <button
                  onClick={() => toggleItem(`career-${career.id}`)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground">{career.title} - {career.matchPercentage}% compativel</span>
                  </div>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes(`career-${career.id}`) && "rotate-180")} />
                </button>
                {openItems.includes(`career-${career.id}`) && (
                  <div className="px-5 pb-5 border-t border-border">
                    <div className="pt-4 space-y-4">
                      <p className="text-muted-foreground">{career.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Faixa Salarial</p>
                          <p className="font-semibold text-foreground">{career.salaryRange}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Crescimento</p>
                          <p className="font-semibold text-green-600">{career.growthRate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tempo de Transição</p>
                          <p className="font-semibold text-foreground">{career.timeToTransition}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Habilidades Principais:</p>
                        <div className="flex flex-wrap gap-2">
                          {career.topSkills.map(skill => (
                            <span key={skill} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Time to First Job */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("time-job")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">Quanto tempo para conseguir meu primeiro emprego na area?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("time-job") && "rotate-180")} />
              </button>
              {openItems.includes("time-job") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4">
                    <p className="text-muted-foreground">
                      O tempo médio de transição varia de acordo com a carreira escolhida e seu nível atual de habilidades. 
                      Em media, com dedicacao e o plano de desenvolvimento correto, voce pode conseguir sua primeira oportunidade 
                      em 6-12 meses.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Market Trends */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("market-trends")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">Quais as tendencias de mercado para essas carreiras?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("market-trends") && "rotate-180")} />
              </button>
              {openItems.includes("market-trends") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4">
                    <p className="text-muted-foreground">
                      As carreiras recomendadas apresentam crescimento acima da media do mercado. 
                      Com a transformacao digital acelerada, profissionais com habilidades em tecnologia, 
                      produto e design estao em alta demanda globalmente.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "soft-skills":
        return (
          <div className="space-y-4">
            {softSkillsData.skills.map((skill, index) => (
              <div key={skill.name} className="border border-border rounded-lg bg-card overflow-hidden">
                <button
                  onClick={() => toggleItem(`skill-${index}`)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-3 h-3 rounded-full",
                      skill.importance === "critical" ? "bg-red-500" :
                      skill.importance === "high" ? "bg-orange-500" : "bg-yellow-500"
                    )} />
                    <span className="font-medium text-foreground">{skill.name}</span>
                  </div>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes(`skill-${index}`) && "rotate-180")} />
                </button>
                {openItems.includes(`skill-${index}`) && (
                  <div className="px-5 pb-5 border-t border-border">
                    <div className="pt-4 space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Nivel Atual: {skill.currentLevel}%</span>
                          <span className="text-muted-foreground">Meta: {skill.targetLevel}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${skill.currentLevel}%` }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Dicas para desenvolver:</p>
                        <ul className="space-y-1">
                          {skill.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* General Soft Skills */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("general-skills")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">Como desenvolver soft skills de forma eficaz?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("general-skills") && "rotate-180")} />
              </button>
              {openItems.includes("general-skills") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4">
                    <p className="text-muted-foreground">
                      Soft skills são desenvolvidas através de prática consciente e feedback constante. 
                      Recomendamos participar de projetos em equipe, buscar mentorias, fazer cursos de desenvolvimento 
                      pessoal e praticar autoavaliacao regularmente.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Match Potential */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("match-potential")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">Qual meu potencial de compatibilidade apos desenvolver as skills?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("match-potential") && "rotate-180")} />
              </button>
              {openItems.includes("match-potential") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Atual</p>
                        <p className="text-2xl font-bold text-foreground">{softSkillsData.currentMatch}%</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Potencial</p>
                        <p className="text-2xl font-bold text-primary">{softSkillsData.potentialMatch}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "evolution":
        return (
          <div className="space-y-4">
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("roadmap")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">Qual o meu roadmap de desenvolvimento?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("roadmap") && "rotate-180")} />
              </button>
              {openItems.includes("roadmap") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">1</div>
                        <div>
                          <p className="font-medium text-foreground">Fundamentos de Produto</p>
                          <p className="text-sm text-muted-foreground">4 semanas - Concluido</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm">2</div>
                        <div>
                          <p className="font-medium text-foreground">Experiencia Internacional</p>
                          <p className="text-sm text-muted-foreground">8 semanas - Em andamento</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary border border-border">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">3</div>
                        <div>
                          <p className="font-medium text-foreground">Certificações</p>
                          <p className="text-sm text-muted-foreground">3 semanas - Pendente</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary border border-border">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">4</div>
                        <div>
                          <p className="font-medium text-foreground">Primeiro Emprego</p>
                          <p className="text-sm text-muted-foreground">Continuo - Pendente</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("international-exp")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">Como funciona a experiencia internacional?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("international-exp") && "rotate-180")} />
              </button>
              {openItems.includes("international-exp") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4">
                    <p className="text-muted-foreground">
                      Experiencias internacionais incluem intercambios, cursos no exterior e networking global 
                      para acelerar seu desenvolvimento de carreira através de vivências culturais únicas.
                      Voce pode explorar programas em diversos paises e areas de atuacao.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("certifications")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">Quais certificações são recomendadas?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("certifications") && "rotate-180")} />
              </button>
              {openItems.includes("certifications") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">CSPO</span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">Google PM</span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">Análise de Dados</span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">Scrum Master</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("networking")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">Como fazer networking internacional?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("networking") && "rotate-180")} />
              </button>
              {openItems.includes("networking") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4">
                    <p className="text-muted-foreground">
                      Conecte-se com profissionais do mundo todo através de eventos, comunidades online, 
                      programas de mentoria e experiencias internacionais. Construa uma rede global 
                      de contatos relevantes para sua carreira.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "careers":
        return (
          <div className="space-y-4">
            {careerSuggestions.map((career) => (
              <div key={career.id} className="border border-border rounded-lg bg-card overflow-hidden">
                <button
                  onClick={() => toggleItem(`career-detail-${career.id}`)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image src={career.characterImage} alt={career.title} width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-foreground">{career.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{career.matchPercentage}%</span>
                  </div>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes(`career-detail-${career.id}`) && "rotate-180")} />
                </button>
                {openItems.includes(`career-detail-${career.id}`) && (
                  <div className="px-5 pb-5 border-t border-border">
                    <div className="pt-4 space-y-4">
                      <p className="text-muted-foreground">{career.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <p className="text-muted-foreground">Faixa Salarial</p>
                          <p className="font-semibold text-foreground">{career.salaryRange}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <p className="text-muted-foreground">Crescimento</p>
                          <p className="font-semibold text-green-600">{career.growthRate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )

      case "education":
        return (
          <div className="space-y-4">
            {careerSuggestions.map((career) => (
              career.faculties && (
                <div key={`edu-${career.id}`} className="border border-border rounded-lg bg-card overflow-hidden">
                  <button
                    onClick={() => toggleItem(`edu-${career.id}`)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
                  >
                    <span className="font-medium text-foreground">Onde estudar para {career.title}?</span>
                    <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes(`edu-${career.id}`) && "rotate-180")} />
                  </button>
                  {openItems.includes(`edu-${career.id}`) && (
                    <div className="px-5 pb-5 border-t border-border">
                      <div className="pt-4 space-y-3">
                        {career.faculties.map((faculty, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium text-foreground">{faculty.name}</p>
                              <p className="text-sm text-muted-foreground">{faculty.location} - {faculty.course}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            ))}

            {/* Countries */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("countries")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">Quais paises sao recomendados para estudar?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("countries") && "rotate-180")} />
              </button>
              {openItems.includes("countries") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-sm">Estados Unidos</span>
                      <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-sm">Reino Unido</span>
                      <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-sm">Alemanha</span>
                      <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-sm">Canada</span>
                      <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-sm">Australia</span>
                      <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-sm">Franca</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Scholarships */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("scholarships")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">Existem bolsas de estudo disponiveis?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("scholarships") && "rotate-180")} />
              </button>
              {openItems.includes("scholarships") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4">
                    <p className="text-muted-foreground">
                      Sim! Existem diversas opções de bolsas de estudo para programas internacionais. 
                      Pesquise programas governamentais, bolsas de universidades e fundacoes privadas 
                      para encontrar as melhores oportunidades ao redor do mundo.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Online Courses */}
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => toggleItem("online-courses")}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground">Quais cursos online sao recomendados?</span>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openItems.includes("online-courses") && "rotate-180")} />
              </button>
              {openItems.includes("online-courses") && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">Plataformas recomendadas:</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">Coursera</span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">Udemy</span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">LinkedIn Learning</span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">edX</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Introduction first, then Profile Code */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 text-center">
          {/* Introduction Text */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Análise Completa
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {userData?.name ? `${userData.name}, ` : ""}Seu Perfil Carr<span className="text-primary">IA</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Você é um <span className="text-primary font-semibold">{classification.title}</span>!
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            {classification.description}
          </p>

          {/* Profile Code - Right after introduction */}
          <div className="mb-4">
            <p className="text-lg font-mono font-bold text-primary mb-4">{classification.code}</p>
            <div className="inline-flex flex-wrap items-center justify-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-lg">
              <div className="px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">S{classification.levels?.S || 1}</span>
                <p className="text-xs text-muted-foreground mt-1">Estratégico</p>
              </div>
              <div className="px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">C{classification.levels?.C || 1}</span>
                <p className="text-xs text-muted-foreground mt-1">Criativo</p>
              </div>
              <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">E{classification.levels?.E || 1}</span>
                <p className="text-xs text-muted-foreground mt-1">Execução</p>
              </div>
              <div className="px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">R{classification.levels?.R || 1}</span>
                <p className="text-xs text-muted-foreground mt-1">Relacional</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-[280px_1fr] gap-8 lg:gap-12">
            {/* Sidebar */}
            <aside className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full text-left px-4 py-4 rounded-lg border transition-all",
                    activeSection === section.id
                      ? "bg-primary/10 border-primary/30 text-foreground"
                      : "bg-card border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(activeSection === section.id ? "text-primary" : "text-muted-foreground")}>
                      {section.icon}
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground">{section.title}</h3>
                      <p className="text-sm mt-0.5">{section.questionCount.toString().padStart(2, "0")} itens</p>
                    </div>
                  </div>
                </button>
              ))}
            </aside>

            {/* Content */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {sections.find(s => s.id === activeSection)?.title}
                </h2>
              </div>
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Sobre Nos */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Sobre Nos
              </h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Quem Somos</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Missao e Valores</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Carreiras</Link></li>
              </ul>
            </div>

            {/* Nossa Equipe */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Nossa Equipe
              </h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Fundadores</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Time de Produto</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Mentores</Link></li>
              </ul>
            </div>

            {/* Nossos Parceiros */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Nossos Parceiros
              </h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Intercambios</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Universidades</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Empresas</Link></li>
              </ul>
            </div>

            {/* Nossa Historia */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <History className="w-4 h-4" />
                Nossa Historia
              </h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Timeline</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Conquistas</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Depoimentos</Link></li>
              </ul>
            </div>

            {/* Contate-nos */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contate-nos
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  contato@carria.com.br
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  (11) 99999-9999
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  São Paulo, SP
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="CarrIA" width={32} height={32} className="w-8 h-8 object-contain" />
              <span className="font-semibold text-foreground">Carr<span className="text-primary">IA</span></span>
            </div>
            <p className="text-sm text-muted-foreground">
              2024 CarrIA. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacidade</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Termos</Link>
              <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
      {/* M60 Floating Balloon */}
      <M60FloatingBalloon />
    </div>
  )
}
