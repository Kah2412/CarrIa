"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { Target, Zap, ArrowRight, Brain, Globe, Gamepad2, Users, TrendingUp, GraduationCap, Calendar, User, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { AccessibilityToolbar } from "@/components/accessibility-toolbar"
import { LanguageSwitcher } from "@/components/language-switcher"

export interface UserData {
  name: string
  age: string
  dreamCareer: string
  conditions?: string[]
}

interface WelcomeScreenProps {
  onStart: (userData: UserData) => void
}

const characters = [
  { src: "/characters/medica.jpg", name: "Cuidadora", code: "CUI-A1" },
  { src: "/characters/engenheira.jpg", name: "Construtora", code: "CON-B2" },
  { src: "/characters/designer-f.jpg", name: "Criativa", code: "CRI-C1" },
  { src: "/characters/programadora.jpg", name: "Analista", code: "ANA-A2" },
  { src: "/characters/advogada.jpg", name: "Estrategista", code: "EST-B1" },
]

const conditionOptions = [
  { id: "adhd", translationKey: "welcome.conditions.adhd" },
  { id: "autism", translationKey: "welcome.conditions.autism" },
  { id: "dyslexia", translationKey: "welcome.conditions.dyslexia" },
  { id: "other", translationKey: "welcome.conditions.other" },
] as const

const careerOptions = [
  { id: "graphic_designer", translationKey: "welcome.careers.graphicDesigner" },
  { id: "software_engineer", translationKey: "welcome.careers.softwareEngineer" },
  { id: "data_scientist", translationKey: "welcome.careers.dataScientist" },
  { id: "doctor", translationKey: "welcome.careers.doctor" },
  { id: "psychologist", translationKey: "welcome.careers.psychologist" },
  { id: "innovation_consultant", translationKey: "welcome.careers.innovationConsultant" },
  { id: "architect", translationKey: "welcome.careers.architect" },
  { id: "entrepreneur", translationKey: "welcome.careers.entrepreneur" },
  { id: "teacher", translationKey: "welcome.careers.teacher" },
  { id: "game_developer", translationKey: "welcome.careers.gameDeveloper" },
  { id: "advertising_professional", translationKey: "welcome.careers.advertisingProfessional" },
  { id: "product_manager", translationKey: "welcome.careers.productManager" },
  { id: "data_analyst", translationKey: "welcome.careers.dataAnalyst" },
  { id: "lawyer", translationKey: "welcome.careers.lawyer" },
  { id: "civil_engineer", translationKey: "welcome.careers.civilEngineer" },
  { id: "mechanical_engineer", translationKey: "welcome.careers.mechanicalEngineer" },
  { id: "interior_designer", translationKey: "welcome.careers.interiorDesigner" },
  { id: "ux_ui_designer", translationKey: "welcome.careers.uxUiDesigner" },
  { id: "scientist", translationKey: "welcome.careers.scientist" },
  { id: "researcher", translationKey: "welcome.careers.researcher" },
  { id: "digital_marketing", translationKey: "welcome.careers.digitalMarketing" },
  { id: "journalist", translationKey: "welcome.careers.journalist" },
  { id: "digital_influencer", translationKey: "welcome.careers.digitalInfluencer" },
  { id: "nurse", translationKey: "welcome.careers.nurse" },
  { id: "physiotherapist", translationKey: "welcome.careers.physiotherapist" },
  { id: "nutritionist", translationKey: "welcome.careers.nutritionist" },
  { id: "veterinarian", translationKey: "welcome.careers.veterinarian" },
  { id: "economist", translationKey: "welcome.careers.economist" },
  { id: "accountant", translationKey: "welcome.careers.accountant" },
  { id: "administrator", translationKey: "welcome.careers.administrator" },
  { id: "human_resources", translationKey: "welcome.careers.humanResources" },
  { id: "other", translationKey: "welcome.careers.other" },
] as const
export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<"intro" | "form">("intro")
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [dreamCareer, setDreamCareer] = useState("")
  const [conditions, setConditions] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 2 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 2)
    setAge(value)
  }

  const toggleCondition = (conditionId: string) => {
    setConditions((prev) =>
      prev.includes(conditionId)
        ? prev.filter((c) => c !== conditionId)
        : [...prev, conditionId]
    )
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!name.trim()) {
      newErrors.name = t("welcome.errors.name")
    }
    
    if (!age) {
      newErrors.age = t("welcome.errors.ageRequired")
    } else if (parseInt(age) < 10 || parseInt(age) > 99) {
      newErrors.age = t("welcome.errors.ageInvalid")
    }
    
    if (!dreamCareer) {
      newErrors.dreamCareer = t("welcome.errors.dreamCareer")
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onStart({ name, age, dreamCareer, conditions })
    }
  }
  const features = [
    {
      icon: Brain,
      title: t("welcome.features.aiTitle"),
      description: t("welcome.features.aiDescription")
    },
    {
      icon: Gamepad2,
      title: t("welcome.features.gameTitle"),
      description: t("welcome.features.gameDescription")
    },
    {
      icon: Globe,
      title: t("welcome.features.networkTitle"),
      description: t("welcome.features.networkDescription")
    },
    {
      icon: TrendingUp,
      title: t("welcome.features.simulationTitle"),
      description: t("welcome.features.simulationDescription")
    }
  ]

  const pillars = [
    { label: t("welcome.pillars.profile"), description: t("welcome.pillars.profileDescription") },
    { label: t("welcome.pillars.goals"), description: t("welcome.pillars.goalsDescription") },
    { label: t("welcome.pillars.rhythms"), description: t("welcome.pillars.rhythmsDescription") },
  ]

  // Form step - Data Collection
  if (step === "form") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background via-background to-secondary/30">
        {/* Accessibility Toolbar */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
          <LanguageSwitcher />
          <AccessibilityToolbar />
        </div>

        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/logo.png"
              alt={t("brand.logoAlt")}
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-2 text-center">
            {t("welcome.startTitle")}
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            {t("welcome.startDescription")}
          </p>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">{t("welcome.firstName")}</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("welcome.firstNamePlaceholder")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="age">{t("welcome.age")}</FieldLabel>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="age"
                    type="text"
                    inputMode="numeric"
                    placeholder={t("welcome.agePlaceholder")}
                    value={age}
                    onChange={handleAgeChange}
                    maxLength={2}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
                {errors.age && (
                  <p className="text-sm text-destructive mt-1">{errors.age}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="dreamCareer">{t("welcome.dreamCareer")}</FieldLabel>
                <Select value={dreamCareer} onValueChange={setDreamCareer}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder={t("welcome.dreamCareerPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {careerOptions.map((career) => (
                      <SelectItem key={career.id} value={career.id}>
                        {t(career.translationKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.dreamCareer && (
                  <p className="text-sm text-destructive mt-1">{errors.dreamCareer}</p>
                )}
              </Field>

              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  {t("welcome.conditionsQuestion")}
                </FieldLabel>
                <p className="text-xs text-muted-foreground mb-3">
                  {t("welcome.conditionsHint")}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {conditionOptions.map((condition) => (
                    <label
                      key={condition.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-secondary/50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        id={condition.id}
                        checked={conditions.includes(condition.id)}
                        onCheckedChange={() => toggleCondition(condition.id)}
                      />
                      <span className="text-sm text-foreground">{t(condition.translationKey)}</span>
                    </label>
                  ))}
                </div>
              </Field>
            </FieldGroup>

            <Button 
              onClick={handleSubmit} 
              size="lg" 
              className="w-full h-14 text-lg font-semibold gap-2 rounded-xl mt-6 shadow-md"
            >
              {t("welcome.startTest")}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            {t("welcome.dataUsage")}
          </p>
        </div>
      </div>
    )
  }

  // Intro step
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background via-background to-secondary/30">
      {/* Accessibility Toolbar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <LanguageSwitcher />
        <AccessibilityToolbar />
      </div>

      <div className="max-w-5xl w-full text-center">
        
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Image
            src="/logo.png"
            alt={t("brand.logoAlt")}
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Titulo */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">
          Carr<span className="text-primary">IA</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-primary font-medium mb-4">
          {t("brand.tagline")}
        </p>
        
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          {t("welcome.heroTextStart")}{" "}
          <span className="text-foreground font-semibold">{t("welcome.heroTextHighlight")}</span>.{" "}
          {t("welcome.heroTextEnd")} <span className="text-primary font-semibold">{t("welcome.heroTextPotential")}</span>.
        </p>

        {/* Personagens */}
        <div className="mb-12">
          <p className="text-sm text-muted-foreground mb-6">{t("welcome.profileExamples")}</p>
          <div className="flex flex-wrap items-end justify-center gap-6">
            {characters.map((char, index) => (
              <div key={char.name} className="flex flex-col items-center group">
                <div 
                  className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-secondary/50 border-2 border-border group-hover:border-primary/50 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:-translate-y-2 group-hover:scale-105"
                  style={{
                    animation: `float 3s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <Image
                    src={char.src}
                    alt={char.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{char.name}</p>
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded group-hover:bg-primary/20 transition-colors">{char.code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pilares */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {pillars.map((pillar, index) => (
            <div key={pillar.label} className="flex items-center gap-3">
              <div className="flex flex-col items-center px-8 py-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-bold text-primary">{pillar.label}</span>
                <span className="text-xs text-muted-foreground">{pillar.description}</span>
              </div>
              {index < pillars.length - 1 && (
                <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              )}
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground text-center">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <Button onClick={() => setStep("form")} size="lg" className="h-16 px-12 text-lg font-semibold gap-3 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            {t("welcome.discoverProfile")}
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-accent" />
            <span>{t("welcome.exclusiveClassification")} <strong className="text-accent">{t("welcome.exclusive")}</strong></span>
          </div>
        </div>

        {/* Exemplo de Classificacao */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-12 shadow-sm">
          <p className="text-sm text-muted-foreground mb-5">{t("welcome.classificationExample")}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">S3</span>
              <span className="text-xs text-muted-foreground ml-2">Estratégico</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">C2</span>
              <span className="text-xs text-muted-foreground ml-2">Criativo</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30">
              <span className="text-lg font-bold text-green-600 dark:text-green-400">E4</span>
              <span className="text-xs text-muted-foreground ml-2">Execução</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">R1</span>
              <span className="text-xs text-muted-foreground ml-2">Relacional</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t("welcome.fullCode")} <span className="font-mono font-bold text-primary">S3-C2-E4-R1</span></p>
        </div>

        {/* B2B */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-left mb-12">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
            <GraduationCap className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-foreground mb-2">{t("welcome.audiences.schools")}</h4>
            <p className="text-sm text-muted-foreground">{t("welcome.audiences.schoolsDescription")}</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
            <Users className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-foreground mb-2">{t("welcome.audiences.companies")}</h4>
            <p className="text-sm text-muted-foreground">{t("welcome.audiences.companiesDescription")}</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
            <Target className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-foreground mb-2">{t("welcome.audiences.youth")}</h4>
            <p className="text-sm text-muted-foreground">{t("welcome.audiences.youthDescription")}</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
            <Brain className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-foreground mb-2">{t("welcome.audiences.students")}</h4>
            <p className="text-sm text-muted-foreground">{t("welcome.audiences.studentsDescription")}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-10 text-muted-foreground mb-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">50k+</p>
            <p className="text-sm">{t("welcome.mappedYouth")}</p>
          </div>
          <div className="w-px h-14 bg-border" />
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">200+</p>
            <p className="text-sm">{t("welcome.globalCareers")}</p>
          </div>
          <div className="w-px h-14 bg-border" />
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">95%</p>
            <p className="text-sm">{t("welcome.satisfaction")}</p>
          </div>
        </div>



        {/* Footer Sections */}
        <div className="border-t border-border pt-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-left mb-12">
            <div>
              <h5 className="font-semibold text-foreground mb-4">{t("welcome.footer.about")}</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.who")}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.mission")}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.careers")}</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">{t("welcome.footer.team")}</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.leadership")}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.specialists")}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.workWithUs")}</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">{t("welcome.footer.partners")}</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.exchanges")}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.universities")}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.companies")}</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">{t("welcome.footer.history")}</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.timeline")}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.achievements")}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.testimonials")}</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">{t("welcome.footer.contact")}</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.support")}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.partnerships")}</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("welcome.footer.press")}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {t("welcome.footer.rights")}
          </p>
          </div>
        </div>
      </div>
    </div>
  )
}
