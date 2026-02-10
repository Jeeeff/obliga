"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckSquare, Users, FileText, BarChart3, Bell, Building2, Hexagon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store-context"

export default function Home() {
  const { user, loading } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard")
    }
  }, [loading, user, router])

  if (loading || user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Hexagon className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Obliga</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#inicio" className="hover:text-foreground transition">Início</a>
            <a href="#funcionalidades" className="hover:text-foreground transition">Funcionalidades</a>
            <a href="#planos" className="hover:text-foreground transition">Planos</a>
            <a href="#addons" className="hover:text-foreground transition">Addons</a>
            <a href="#sobre" className="hover:text-foreground transition">Sobre</a>
            <a href="#contato" className="hover:text-foreground transition">Contato</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Criar conta gratuita</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section id="inicio" className="border-b">
          <div className="container mx-auto px-4 py-16 md:py-24 grid gap-10 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <motion.h1
                className="text-4xl md:text-5xl font-bold tracking-tight"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                Gestão inteligente de obrigações fiscais para escritórios modernos
              </motion.h1>
              <motion.p
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                Organize obrigações, clientes e documentos em um único lugar. Automatize lembretes e comunique-se
                com seus clientes pelo painel web e pelo bot do Telegram.
              </motion.p>
              <motion.div
                className="flex flex-wrap items-center gap-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Button size="lg" asChild>
                  <Link href="/register">Criar conta gratuita</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Já tenho conta</Link>
                </Button>
                <span className="text-sm text-muted-foreground">
                  Plano Básico gratuito para começar. Sem cartão de crédito.
                </span>
              </motion.div>
            </div>
            <motion.div
              className="grid gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <Card className="border-primary/10 shadow-sm">
                <CardHeader>
                  <CardTitle>Visão geral em tempo real</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Visualize obrigações pendentes, em risco e concluídas em um único painel.</p>
                  <p>Acompanhe rapidamente quais clientes exigem atenção imediata.</p>
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Prazos sob controle</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Receba alertas antes de vencer para nunca mais perder uma obrigação importante.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Bot conectado</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Consulte obrigações diretamente pelo bot do Telegram. WhatsApp em breve.
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="funcionalidades" className="border-b bg-muted/40">
          <div className="container mx-auto px-4 py-16 space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Funcionalidades principais</h2>
              <p className="text-sm text-muted-foreground">
                Tudo o que você precisa para organizar obrigações fiscais em um único lugar.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Gestão de obrigações</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Cadastre, acompanhe e mude o status de cada obrigação com histórico de atividades.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Controle de clientes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Centralize dados de clientes, contatos e obrigações associadas em uma única visão.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Gestão de documentos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Organize documentos fiscais por cliente e obrigação. Versões avançadas como addon.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Relatórios básicos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Acompanhe volume de obrigações, atrasos e carga de trabalho por período.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Notificações automáticas</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Configure alertas para prazos críticos e mantenha o time sempre informado.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Multi-tenant</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Gerencie múltiplas empresas e times em um ambiente seguro e isolado.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="planos" className="border-b">
          <div className="container mx-auto px-4 py-16 space-y-10">
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Planos de assinatura</h2>
              <p className="text-sm text-muted-foreground">
                Comece no plano Básico gratuito e evolua conforme a maturidade do seu escritório.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="flex flex-col">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Básico</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Freemium
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">
                    R$ 0<span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Até 5 usuários</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Até 20 obrigações ativas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Acesso básico ao frontend (visualização de obrigações)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Integração básica com bot (login e listagem)</span>
                    </li>
                  </ul>
                  <Button asChild className="mt-4">
                    <Link href="/register">Criar Conta Gratuita</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="flex flex-col border-primary shadow-md shadow-primary/10 relative">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Essencial</CardTitle>
                    <Badge className="text-xs bg-primary text-primary-foreground">
                      Mais usado
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">
                    R$ 99<span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Até 15 usuários</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Obrigações ilimitadas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Acesso completo ao frontend (detalhes, filtros, relatórios básicos)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Módulo básico de gestão de documentos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Notificações proativas via bot</span>
                    </li>
                  </ul>
                  <Button asChild className="mt-4">
                    <Link href="mailto:contato@obliga.com?subject=Interesse%20no%20Plano%20Essencial%20Obliga">
                      Falar com vendas
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="flex flex-col">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg">Profissional</CardTitle>
                  <p className="text-2xl font-bold">
                    R$ 299<span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Até 50 usuários</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Módulo avançado de documentos (versionamento e permissões)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Dashboard de insights e indicadores</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Gestão de processos e automação de entregas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Integração com APIs externas</span>
                    </li>
                  </ul>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="mailto:contato@obliga.com?subject=Interesse%20no%20Plano%20Profissional%20Obliga">
                      Falar com vendas
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="flex flex-col">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg">Corporativo</CardTitle>
                  <p className="text-2xl font-bold">Sob consulta</p>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Usuários ilimitados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Personalização de marca (white-label)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Integração com sistemas legados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Consultoria e desenvolvimento sob demanda</span>
                    </li>
                  </ul>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="mailto:contato@obliga.com?subject=Plano%20Corporativo%20Obliga">
                      Falar com time comercial
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div id="addons" className="space-y-6">
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-semibold">Addons e módulos adicionais</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione funcionalidades extras para aprofundar a gestão fiscal e documental da sua operação.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Módulo de Assinatura Eletrônica</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1">
                    <p>Integração com serviços de assinatura digital para documentos com validade jurídica.</p>
                    <p className="font-semibold text-foreground">R$ 59/mês</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Relatórios Avançados Personalizáveis</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1">
                    <p>Crie relatórios customizados a partir dos dados do sistema e exporte para múltiplos formatos.</p>
                    <p className="font-semibold text-foreground">R$ 79/mês</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Integração com Sistemas Contábeis</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1">
                    <p>Conecte-se aos principais softwares contábeis do mercado para evitar retrabalho.</p>
                    <p className="font-semibold text-foreground">R$ 99/mês</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Armazenamento Extra de Documentos</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1">
                    <p>Aumente a capacidade de armazenamento do módulo de documentos conforme a necessidade.</p>
                    <p className="font-semibold text-foreground">A partir de R$ 29/mês</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Suporte Premium 24/7</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1">
                    <p>Atendimento prioritário e monitoramento proativo para operações críticas.</p>
                    <p className="font-semibold text-foreground">R$ 199/mês</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre" className="border-b">
          <div className="container mx-auto px-4 py-16 grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Sobre o Obliga</h2>
              <p className="text-sm text-muted-foreground">
                Obliga é um sistema SaaS de gestão financeira e fiscal, criado para empresas e escritórios que
                precisam organizar obrigações recorrentes, clientes e faturamento em um único lugar.
              </p>
              <p className="text-sm text-muted-foreground">
                Construído com tecnologias modernas, multi-tenant por padrão e focado em segurança, performance e
                experiência de uso.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Benefícios</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Nunca perca prazos importantes de obrigações.</li>
                <li>• Centralize clientes, documentos e faturas.</li>
                <li>• Automatize fluxos de aprovação e notificações.</li>
                <li>• Acesse de qualquer lugar, com múltiplos usuários e empresas.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="contato" className="bg-muted/40">
          <div className="container mx-auto px-4 py-16 text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Pronto para testar o Obliga?</h2>
            <p className="text-sm text-muted-foreground">
              Acesse o ambiente, explore o painel e veja como o Obliga pode organizar sua operação.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Criar conta gratuita</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <span>Obliga · Gestão inteligente de obrigações fiscais</span>
          <span>Feito com tecnologias modernas de nuvem e segurança.</span>
        </div>
      </footer>
    </div>
  )
}
