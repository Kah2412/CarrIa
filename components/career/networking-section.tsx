"use client"

import { Globe, Linkedin, Users, MapPin, Building, ExternalLink, Star, Award, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FamousPersonality {
  id: string
  name: string
  role: string
  field: string
  country: string
  achievement: string
  avatar?: string
  relevance: number
  isRecommended?: boolean
}

interface NetworkingSectionProps {
  connections: Array<{
    id: string
    name: string
    role: string
    company: string
    location: string
    country: string
    relevance: number
    avatar?: string
    isRecommended?: boolean
  }>
  careerTitle: string
}

// Famous personalities database based on career profiles
const getFamousPersonalities = (careerTitle: string): FamousPersonality[] => {
  const personalitiesByField: Record<string, FamousPersonality[]> = {
    "Product Manager": [
      { id: "1", name: "Sundar Pichai", role: "CEO Google", field: "Tecnologia", country: "Estados Unidos", achievement: "Liderou o desenvolvimento do Chrome e Android", relevance: 95, isRecommended: true },
      { id: "2", name: "Marissa Mayer", role: "Ex-CEO Yahoo", field: "Tecnologia", country: "Estados Unidos", achievement: "Pioneira em UX no Google", relevance: 88 },
      { id: "3", name: "Satya Nadella", role: "CEO Microsoft", field: "Tecnologia", country: "Estados Unidos", achievement: "Transformou a cultura da Microsoft", relevance: 92 },
    ],
    "Designer UX/UI": [
      { id: "1", name: "Jony Ive", role: "Ex-Designer Apple", field: "Design", country: "Reino Unido", achievement: "Design do iPhone e iMac", relevance: 98, isRecommended: true },
      { id: "2", name: "Susan Kare", role: "Designer de Icones", field: "Design", country: "Estados Unidos", achievement: "Criou os icones do Macintosh", relevance: 90 },
      { id: "3", name: "Don Norman", role: "Autor e Designer", field: "UX", country: "Estados Unidos", achievement: "Criou o termo User Experience", relevance: 88 },
    ],
    "Cientista de Dados": [
      { id: "1", name: "Andrew Ng", role: "Fundador Coursera", field: "IA", country: "Estados Unidos", achievement: "Pioneiro em educacao de IA", relevance: 96, isRecommended: true },
      { id: "2", name: "Fei-Fei Li", role: "Professora Stanford", field: "IA", country: "Estados Unidos", achievement: "Criou o ImageNet", relevance: 94 },
      { id: "3", name: "Geoffrey Hinton", role: "Pesquisador IA", field: "Deep Learning", country: "Canada", achievement: "Pai do Deep Learning moderno", relevance: 98 },
    ],
    "Empreendedor": [
      { id: "1", name: "Elon Musk", role: "CEO Tesla/SpaceX", field: "Inovacao", country: "Estados Unidos", achievement: "Revolucionou carros eletricos e espaciais", relevance: 97, isRecommended: true },
      { id: "2", name: "Luiza Trajano", role: "Presidente Magazine Luiza", field: "Varejo", country: "Brasil", achievement: "Transformacao digital do varejo brasileiro", relevance: 92 },
      { id: "3", name: "Jorge Paulo Lemann", role: "Empresario", field: "Investimentos", country: "Brasil", achievement: "Um dos maiores investidores do mundo", relevance: 90 },
    ],
    "Desenvolvedor": [
      { id: "1", name: "Linus Torvalds", role: "Criador Linux", field: "Software", country: "Finlandia", achievement: "Criou o Linux e Git", relevance: 99, isRecommended: true },
      { id: "2", name: "Guido van Rossum", role: "Criador Python", field: "Programacao", country: "Holanda", achievement: "Criou a linguagem Python", relevance: 95 },
      { id: "3", name: "Brendan Eich", role: "Criador JavaScript", field: "Web", country: "Estados Unidos", achievement: "Criou JavaScript em 10 dias", relevance: 93 },
    ],
    default: [
      { id: "1", name: "Steve Jobs", role: "Co-fundador Apple", field: "Tecnologia", country: "Estados Unidos", achievement: "Revolucionou a computacao pessoal", relevance: 98, isRecommended: true },
      { id: "2", name: "Oprah Winfrey", role: "Apresentadora e Empresaria", field: "Comunicacao", country: "Estados Unidos", achievement: "Icone global de comunicacao", relevance: 92 },
      { id: "3", name: "Malala Yousafzai", role: "Ativista Nobel", field: "Educacao", country: "Paquistao", achievement: "Premio Nobel da Paz pela educacao", relevance: 90 },
    ],
  }

  return personalitiesByField[careerTitle] || personalitiesByField.default
}

export function NetworkingSection({ connections, careerTitle }: NetworkingSectionProps) {
  const famousPersonalities = getFamousPersonalities(careerTitle)

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-chart-5/20">
            <Sparkles className="w-5 h-5 text-chart-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Personalidades Inspiradoras</h3>
            <p className="text-sm text-muted-foreground">Pessoas de sucesso com perfis similares ao seu</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {famousPersonalities.map((person) => (
          <div 
            key={person.id}
            className={cn(
              "relative p-4 rounded-xl border transition-all hover:border-primary/50",
              person.isRecommended 
                ? "bg-primary/5 border-primary/30" 
                : "bg-secondary/30 border-border"
            )}
          >
            {person.isRecommended && (
              <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                <Star className="w-3 h-3" />
                Inspiracao
              </div>
            )}
            
            <div className="flex items-start gap-3 mb-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-lg font-semibold text-primary">
                {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">{person.name}</h4>
                <p className="text-sm text-muted-foreground truncate">{person.role}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="w-3.5 h-3.5 shrink-0 text-primary" />
                <span className="truncate">{person.field}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{person.country}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground line-clamp-2">{person.achievement}</p>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">{person.relevance}% similar ao seu perfil</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-chart-5/20 shrink-0">
            <Globe className="w-4 h-4 text-chart-5" />
          </div>
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Por que essas personalidades?
            </p>
            <p className="text-xs text-muted-foreground">
              Nossa IA identificou pessoas de sucesso que compartilham caracteristicas similares ao seu perfil CarrIA. 
              Estudar suas trajetorias pode ajudar voce a entender caminhos possiveis para sua carreira.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
