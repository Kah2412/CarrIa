"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { AccessibilityToolbar } from "@/components/accessibility-toolbar"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ArrowLeft } from "lucide-react"

// FAQ Data organized by categories and subcategories
const faqData = {
  geral: {
    label: "Geral",
    subcategories: [
      {
        id: "sobre-plataforma",
        title: "Sobre a Plataforma",
        questionCount: 8,
        questions: [
          {
            question: "O que e a CarrIA?",
            answer: "A CarrIA e uma plataforma de mapeamento de carreira baseada em inteligencia artificial. Nos nao recomendamos carreiras populares, recomendamos carreiras compativeis com o seu funcionamento, analisando seu perfil atraves de quizzes, jogos e simulacoes."
          },
          {
            question: "Como funciona o sistema de quiz?",
            answer: "Nosso quiz e dividido em blocos tematicos (Estrategico, Criativo, Execucao e Relacional) intercalados com mini-games. Cada resposta ajuda a mapear seu perfil profissional de forma gamificada e envolvente."
          },
          {
            question: "A plataforma e gratuita?",
            answer: "Sim, a versao basica da CarrIA e totalmente gratuita. Voce pode fazer o mapeamento completo do seu perfil, receber sugestoes de carreira e acessar o roadmap de desenvolvimento sem nenhum custo."
          },
          {
            question: "Como a IA analisa meu perfil?",
            answer: "Nossa IA analisa suas respostas nos quizzes, seu desempenho nos mini-games, suas preferencias e valores para criar um perfil unico. Combinamos esses dados com informacoes do mercado de trabalho para sugerir carreiras compativeis."
          },
          {
            question: "Posso refazer o quiz?",
            answer: "Sim! Voce pode refazer o quiz quantas vezes quiser. Recomendamos refazer periodicamente, pois seus interesses e habilidades podem evoluir com o tempo."
          },
          {
            question: "A plataforma esta disponivel em outros idiomas?",
            answer: "Atualmente, a CarrIA esta disponivel apenas em portugues. Estamos trabalhando para disponibilizar a plataforma em outros idiomas em breve."
          },
          {
            question: "Preciso criar uma conta para usar?",
            answer: "Para a experiencia completa, recomendamos criar uma conta. Assim voce pode salvar seu progresso, acompanhar sua evolucao e acessar recursos exclusivos."
          },
          {
            question: "A CarrIA funciona em dispositivos moveis?",
            answer: "Sim! A plataforma e totalmente responsiva e funciona perfeitamente em smartphones, tablets e computadores."
          }
        ]
      },
      {
        id: "resultados",
        title: "Resultados e Sugestoes",
        questionCount: 6,
        questions: [
          {
            question: "Como sao calculadas as porcentagens de compatibilidade?",
            answer: "As porcentagens sao calculadas com base na correlacao entre seu perfil (tracos, habilidades, valores) e os requisitos de cada carreira. Quanto maior a compatibilidade, maior a porcentagem."
          },
          {
            question: "As sugestoes de carreira sao confiaveis?",
            answer: "Nossas sugestoes sao baseadas em dados do mercado de trabalho e analise do seu perfil. Elas servem como um guia, mas recomendamos sempre pesquisar mais sobre as carreiras sugeridas e conversar com profissionais da area."
          },
          {
            question: "Posso ver carreiras que nao apareceram nas sugestoes?",
            answer: "Sim! Alem das top 3 sugestoes, voce pode explorar outras carreiras e ver como seu perfil se encaixa em cada uma delas."
          },
          {
            question: "O que fazer se nao concordar com os resultados?",
            answer: "Os resultados sao baseados nas suas respostas. Se nao concordar, reflita se suas respostas representaram genuinamente suas preferencias. Voce tambem pode refazer o quiz respondendo de forma mais consciente."
          },
          {
            question: "As faixas salariais sao precisas?",
            answer: "As faixas salariais sao estimativas baseadas em dados de mercado e podem variar conforme regiao, experiencia, empresa e outros fatores. Use-as como referencia, nao como valores absolutos."
          },
          {
            question: "Como funciona o tempo de transicao estimado?",
            answer: "O tempo de transicao e uma estimativa baseada na diferenca entre suas habilidades atuais e os requisitos da carreira sugerida. Inclui tempo para estudo, pratica e busca de oportunidades."
          }
        ]
      },
      {
        id: "conta-perfil",
        title: "Conta e Perfil",
        questionCount: 5,
        questions: [
          {
            question: "Como altero minhas informacoes de perfil?",
            answer: "Acesse as configuracoes do seu perfil clicando no seu avatar ou nome de usuario. La voce pode atualizar nome, foto, informacoes de contato e preferencias."
          },
          {
            question: "Como excluo minha conta?",
            answer: "Para excluir sua conta, acesse Configuracoes > Privacidade > Excluir Conta. Note que essa acao e irreversivel e todos os seus dados serao permanentemente removidos."
          },
          {
            question: "Meus dados estao seguros?",
            answer: "Sim! Levamos a seguranca dos seus dados muito a serio. Utilizamos criptografia e seguimos as melhores praticas de seguranca da informacao, em conformidade com a LGPD."
          },
          {
            question: "Posso exportar meus resultados?",
            answer: "Sim! Voce pode exportar um relatorio completo do seu perfil em PDF, incluindo sugestoes de carreira, roadmap de desenvolvimento e recomendacoes personalizadas."
          },
          {
            question: "Como recupero minha senha?",
            answer: "Na tela de login, clique em 'Esqueci minha senha'. Voce recebera um email com instrucoes para criar uma nova senha."
          }
        ]
      }
    ]
  },
  recursos: {
    label: "Recursos da Plataforma",
    subcategories: [
      {
        id: "mini-games",
        title: "Mini-Games",
        questionCount: 5,
        questions: [
          {
            question: "Qual o objetivo dos mini-games?",
            answer: "Os mini-games avaliam habilidades cognitivas como memoria, velocidade de reacao, priorizacao e raciocinio. Eles complementam o quiz tradicional e tornam a avaliacao mais dinamica e precisa."
          },
          {
            question: "Quantos mini-games existem?",
            answer: "Atualmente temos 4 mini-games: Memoria Criativa, Velocidade de Reacao, Ordenacao de Prioridades e Palavras Cruzadas. Cada um avalia habilidades diferentes."
          },
          {
            question: "Posso pular os mini-games?",
            answer: "Recomendamos jogar todos os mini-games para uma avaliacao mais completa. Porem, voce pode pular caso prefira, mas isso pode afetar a precisao das sugestoes."
          },
          {
            question: "Os mini-games afetam meu resultado final?",
            answer: "Sim! O desempenho nos mini-games e considerado na analise do seu perfil, especialmente para avaliar habilidades como foco, agilidade e capacidade de priorizacao."
          },
          {
            question: "Posso jogar os mini-games novamente?",
            answer: "Sim! Ao refazer o quiz, voce jogara os mini-games novamente. Tambem estamos desenvolvendo um modo de pratica para jogar os games independentemente."
          }
        ]
      },
      {
        id: "roadmap",
        title: "Roadmap de Carreira",
        questionCount: 4,
        questions: [
          {
            question: "O que e o Roadmap de Carreira?",
            answer: "E um plano personalizado de desenvolvimento que mostra os passos necessarios para alcancar a carreira desejada, incluindo habilidades a desenvolver, cursos recomendados e marcos importantes."
          },
          {
            question: "O roadmap e personalizavel?",
            answer: "Sim! O roadmap inicial e gerado automaticamente, mas voce pode ajustar prazos, adicionar etapas e personalizar conforme suas necessidades e disponibilidade."
          },
          {
            question: "Como acompanho meu progresso no roadmap?",
            answer: "O roadmap tem um sistema de checkpoints que voce pode marcar conforme avanca. A plataforma mostra sua porcentagem de progresso e celebra suas conquistas."
          },
          {
            question: "O roadmap inclui cursos e recursos?",
            answer: "Sim! Cada etapa do roadmap inclui sugestoes de cursos, livros, podcasts e outros recursos para ajudar no seu desenvolvimento."
          }
        ]
      },
      {
        id: "simulacoes",
        title: "Simulacoes de Carreira",
        questionCount: 4,
        questions: [
          {
            question: "O que sao as simulacoes de carreira?",
            answer: "Sao experiencias interativas que permitem vivenciar um dia tipico em diferentes profissoes, ajudando voce a entender melhor o que cada carreira envolve na pratica."
          },
          {
            question: "Quantas simulacoes estao disponiveis?",
            answer: "Temos simulacoes para as principais carreiras sugeridas pela plataforma. Novas simulacoes sao adicionadas regularmente."
          },
          {
            question: "As simulacoes sao realistas?",
            answer: "As simulacoes foram desenvolvidas com base em pesquisas e entrevistas com profissionais de cada area, buscando representar desafios e situacoes reais do dia a dia."
          },
          {
            question: "Posso fazer simulacoes de carreiras que nao foram sugeridas?",
            answer: "Sim! Voce pode explorar simulacoes de qualquer carreira disponivel na plataforma, nao apenas as que foram sugeridas para voce."
          }
        ]
      },
      {
        id: "networking",
        title: "Networking Internacional",
        questionCount: 4,
        questions: [
          {
            question: "Como funciona o networking da plataforma?",
            answer: "Conectamos voce com profissionais e estudantes de todo o mundo que compartilham interesses de carreira similares. Voce pode trocar experiencias, tirar duvidas e expandir sua rede."
          },
          {
            question: "Preciso pagar para usar o networking?",
            answer: "O acesso basico ao networking e gratuito. Recursos premium, como mentorias individuais e grupos exclusivos, podem ter custo adicional."
          },
          {
            question: "Como encontro mentores na plataforma?",
            answer: "Na secao de Networking, voce pode filtrar por area de atuacao, experiencia e disponibilidade para encontrar mentores que se encaixem no que voce busca."
          },
          {
            question: "E seguro conversar com outros usuarios?",
            answer: "Temos moderacao ativa e ferramentas de denuncia para garantir um ambiente seguro. Sempre recomendamos cautela ao compartilhar informacoes pessoais."
          }
        ]
      }
    ]
  },
  tecnico: {
    label: "Suporte Tecnico",
    subcategories: [
      {
        id: "problemas-comuns",
        title: "Problemas Comuns",
        questionCount: 5,
        questions: [
          {
            question: "O quiz travou no meio. O que faco?",
            answer: "Seu progresso e salvo automaticamente. Atualize a pagina e continue de onde parou. Se o problema persistir, limpe o cache do navegador e tente novamente."
          },
          {
            question: "Nao estou recebendo emails da plataforma.",
            answer: "Verifique sua pasta de spam/lixo eletronico. Adicione nosso email a sua lista de contatos confiaveis. Se ainda assim nao receber, entre em contato com o suporte."
          },
          {
            question: "A pagina esta carregando lentamente.",
            answer: "Verifique sua conexao com a internet. Tente limpar o cache do navegador ou acessar de outro navegador. Nossa plataforma funciona melhor em navegadores atualizados."
          },
          {
            question: "Os mini-games nao estao funcionando.",
            answer: "Certifique-se de que JavaScript esta habilitado no seu navegador. Alguns bloqueadores de anuncios podem interferir. Tente desativar extensoes temporariamente."
          },
          {
            question: "Perdi meu progresso no quiz.",
            answer: "Se voce estava logado, seu progresso deve estar salvo. Faca login novamente e verifique. Caso contrario, infelizmente sera necessario recomecar."
          }
        ]
      },
      {
        id: "contato",
        title: "Contato e Suporte",
        questionCount: 3,
        questions: [
          {
            question: "Como entro em contato com o suporte?",
            answer: "Voce pode nos contatar pelo email suporte@carria.com.br, pelo chat dentro da plataforma ou pelas nossas redes sociais. Respondemos em ate 24 horas uteis."
          },
          {
            question: "Onde posso enviar sugestoes de melhorias?",
            answer: "Adoramos receber feedback! Use o formulario de sugestoes nas configuracoes da plataforma ou envie um email para sugestoes@carria.com.br."
          },
          {
            question: "A plataforma tem redes sociais?",
            answer: "Sim! Estamos no Instagram, LinkedIn, Twitter e YouTube. Siga-nos para dicas de carreira, novidades da plataforma e conteudo exclusivo."
          }
        ]
      }
    ]
  }
}

type CategoryKey = keyof typeof faqData

export default function FAQPage() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("geral")
  const [activeSubcategory, setActiveSubcategory] = useState("sobre-plataforma")
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const currentCategory = faqData[activeCategory]
  const currentSubcategory = currentCategory.subcategories.find(
    (sub) => sub.id === activeSubcategory
  )

  // Filter questions based on search
  const filteredQuestions = searchQuery
    ? currentCategory.subcategories.flatMap((sub) =>
        sub.questions.filter(
          (q) =>
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : currentSubcategory?.questions || []

  const toggleQuestion = (question: string) => {
    setOpenQuestion(openQuestion === question ? null : question)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={t("brand.logoAlt")}
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Carr<span className="text-primary">IA</span>
              </h1>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("faq.navHome")}
              </Link>
              <Link
                href="/faq"
                className="text-sm font-medium text-foreground"
              >
                {t("faq.navFaq")}
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("faq.navBlog")}
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <AccessibilityToolbar />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            FAQ
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("faq.subtitle")}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("faq.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-base rounded-xl border-border bg-card"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-2 py-4 overflow-x-auto">
            {Object.entries(faqData).map(([key, category]) => (
              <Button
                key={key}
                variant={activeCategory === key ? "default" : "outline"}
                onClick={() => {
                  setActiveCategory(key as CategoryKey)
                  setActiveSubcategory(category.subcategories[0].id)
                  setSearchQuery("")
                }}
                className={cn(
                  "rounded-full px-6 whitespace-nowrap",
                  activeCategory === key
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                )}
              >
                {t(
                  key === "geral"
                    ? "faq.categories.general"
                    : key === "recursos"
                      ? "faq.categories.features"
                      : "faq.categories.technical"
                )}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-[280px_1fr] gap-8 lg:gap-12">
            {/* Sidebar */}
            <aside className="space-y-2">
              {currentCategory.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => {
                    setActiveSubcategory(subcategory.id)
                    setSearchQuery("")
                  }}
                  className={cn(
                    "w-full text-left px-4 py-4 rounded-lg border transition-all",
                    activeSubcategory === subcategory.id && !searchQuery
                      ? "bg-primary/10 border-primary/30 text-foreground"
                      : "bg-card border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <h3 className="font-semibold text-foreground">
                    {subcategory.title}
                  </h3>
                  <p className="text-sm mt-1">
                    {subcategory.questionCount.toString().padStart(2, "0")} {t("faq.questions")}
                  </p>
                </button>
              ))}
            </aside>

            {/* FAQ Content */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  {searchQuery
                    ? t("faq.resultsFor", { query: searchQuery })
                    : currentSubcategory?.title}
                </h2>
              </div>

              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {t("faq.noResults")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((item, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg bg-card overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(item.question)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
                      >
                        <span className="font-medium text-foreground pr-4">
                          {item.question}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200",
                            openQuestion === item.question && "rotate-180"
                          )}
                        />
                      </button>
                      {openQuestion === item.question && (
                        <div className="px-5 pb-5 pt-0">
                          <div className="border-t border-border pt-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <Button asChild variant="outline" className="rounded-xl gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              {t("faq.backHome")}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
