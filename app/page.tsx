 "use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckSquare, Users, FileText, BarChart3, Bell, Building2, Hexagon, Check, X } from "lucide-react"
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
             <a href="#sobre" className="hover:text-foreground transition">Sobre</a>
             <a href="#contato" className="hover:text-foreground transition">Contato</a>
           </nav>
           <div className="flex items-center gap-3">
             <Button variant="outline" asChild>
               <Link href="/login">Login</Link>
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
                 Gestão inteligente de obrigações fiscais
               </motion.h1>
               <motion.p
                 className="text-lg text-muted-foreground"
                 initial={{ opacity: 0, y: 8 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1, duration: 0.4 }}
               >
                 Automatize, organize e nunca mais perca prazos importantes. Centralize obrigações, clientes e faturas em um único painel.
               </motion.p>
               <motion.div
                 className="flex flex-wrap items-center gap-4"
                 initial={{ opacity: 0, y: 8 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2, duration: 0.4 }}
               >
                 <Button size="lg" asChild>
                   <Link href="/login">Começar agora</Link>
                 </Button>
                 <span className="text-sm text-muted-foreground">
                   Sem cartão de crédito. Ambiente pronto com dados de demonstração.
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
                   <p>Saiba exatamente quais clientes exigem atenção imediata.</p>
                 </CardContent>
               </Card>
               <div className="grid grid-cols-2 gap-4">
                 <Card>
                   <CardHeader className="pb-2">
                     <CardTitle className="text-sm font-medium">Prazos sob controle</CardTitle>
                   </CardHeader>
                   <CardContent className="text-xs text-muted-foreground">
                     Receba alertas antes de vencer, para nunca mais perder uma obrigação importante.
                   </CardContent>
                 </Card>
                 <Card>
                   <CardHeader className="pb-2">
                     <CardTitle className="text-sm font-medium">Multi-tenant</CardTitle>
                   </CardHeader>
                   <CardContent className="text-xs text-muted-foreground">
                     Gerencie múltiplas empresas, clientes e times em um ambiente seguro e isolado.
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
                     <CardTitle className="text-base">Faturas e pagamentos</CardTitle>
                   </div>
                 </CardHeader>
                 <CardContent className="text-sm text-muted-foreground">
                   Gere e acompanhe faturas com status, vencimentos e integrações futuras de pagamento.
                 </CardContent>
               </Card>
               <Card>
                 <CardHeader>
                   <div className="flex items-center gap-2">
                     <BarChart3 className="h-5 w-5 text-primary" />
                     <CardTitle className="text-base">Relatórios detalhados</CardTitle>
                   </div>
                 </CardHeader>
                 <CardContent className="text-sm text-muted-foreground">
                   Visualize tendências de obrigações, atrasos e volume por cliente ou período.
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
                   Escale para múltiplos clientes e empresas sem perder segurança nem isolamento de dados.
                 </CardContent>
               </Card>
             </div>
           </div>
         </section>

         <section id="planos" className="border-b">
           <div className="container mx-auto px-4 py-16 space-y-10">
             <div className="space-y-2 text-center max-w-2xl mx-auto">
               <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Escolha o Plano Ideal para Você</h2>
               <p className="text-sm text-muted-foreground">
                 Comece grátis e escale conforme cresce.
               </p>
             </div>

             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
               <Card className="flex flex-col">
                 <CardHeader className="space-y-2">
                   <div className="flex items-center justify-between">
                     <CardTitle className="text-lg">Free</CardTitle>
                     <Badge variant="outline" className="text-xs">
                       Grátis para sempre
                     </Badge>
                   </div>
                   <p className="text-2xl font-bold">R$ 0<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                 </CardHeader>
                 <CardContent className="flex flex-col gap-4 flex-1">
                   <ul className="space-y-2 text-sm">
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Até 3 clientes</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>10 obrigações/mês</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Dashboard básico</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Notificações Telegram</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <X className="h-4 w-4 text-rose-500" />
                       <span>Relatórios avançados</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <X className="h-4 w-4 text-rose-500" />
                       <span>Integrações</span>
                     </li>
                   </ul>
                   <Button asChild className="mt-4">
                     <Link href="/register">Começar Grátis</Link>
                   </Button>
                 </CardContent>
               </Card>

               <Card className="flex flex-col border-primary shadow-md shadow-primary/10 relative">
                 <CardHeader className="space-y-2">
                   <div className="flex items-center justify-between">
                     <CardTitle className="text-lg">Pro</CardTitle>
                     <Badge className="text-xs bg-primary text-primary-foreground">
                       Mais Popular
                     </Badge>
                   </div>
                   <p className="text-2xl font-bold">R$ 49<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                 </CardHeader>
                 <CardContent className="flex flex-col gap-4 flex-1">
                   <ul className="space-y-2 text-sm">
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Clientes ilimitados</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Obrigações ilimitadas</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Telegram + WhatsApp</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>IA preditiva</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Relatórios completos</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Compliance Score</span>
                     </li>
                   </ul>
                   <Button asChild className="mt-4">
                     <Link href="/register">Começar Teste Grátis</Link>
                   </Button>
                 </CardContent>
               </Card>

               <Card className="flex flex-col">
                 <CardHeader className="space-y-2">
                   <CardTitle className="text-lg">Business</CardTitle>
                   <p className="text-2xl font-bold">R$ 149<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                 </CardHeader>
                 <CardContent className="flex flex-col gap-4 flex-1">
                   <ul className="space-y-2 text-sm">
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Tudo do PRO</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Até 5 usuários</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>OCR de documentos</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Integrações ERP</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>API de acesso</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Suporte prioritário</span>
                     </li>
                   </ul>
                   <Button asChild variant="outline" className="mt-4">
                     <Link href="mailto:contato@obliga.com">Falar com Vendas</Link>
                   </Button>
                 </CardContent>
               </Card>

               <Card className="flex flex-col">
                 <CardHeader className="space-y-2">
                   <CardTitle className="text-lg">Enterprise</CardTitle>
                   <p className="text-2xl font-bold">Sob consulta</p>
                 </CardHeader>
                 <CardContent className="flex flex-col gap-4 flex-1">
                   <ul className="space-y-2 text-sm">
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Tudo do BUSINESS</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Self-hosted</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>White-label</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Usuários ilimitados</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>SLA garantido</span>
                     </li>
                     <li className="flex items-center gap-2">
                       <Check className="h-4 w-4 text-emerald-500" />
                       <span>Customizações</span>
                     </li>
                   </ul>
                   <Button asChild variant="outline" className="mt-4">
                     <Link href="#contato">Solicitar Proposta</Link>
                   </Button>
                 </CardContent>
               </Card>
             </div>

             <div className="space-y-6">
               <div className="space-y-2 text-center">
                 <h3 className="text-xl font-semibold">Expanda suas Funcionalidades</h3>
                 <p className="text-sm text-muted-foreground">
                   Adicione módulos extras conforme a maturidade fiscal da sua operação.
                 </p>
               </div>
               <div className="grid gap-4 md:grid-cols-3">
                 <Card>
                   <CardHeader className="pb-2">
                     <CardTitle className="text-sm font-medium">Assistente de Legislação IA</CardTitle>
                   </CardHeader>
                   <CardContent className="text-xs text-muted-foreground space-y-1">
                     <p>Resumos e alertas inteligentes de mudanças na legislação.</p>
                     <p className="font-semibold text-foreground">R$ 29/mês</p>
                   </CardContent>
                 </Card>
                 <Card>
                   <CardHeader className="pb-2">
                     <CardTitle className="text-sm font-medium">Simulador Fiscal</CardTitle>
                   </CardHeader>
                   <CardContent className="text-xs text-muted-foreground space-y-1">
                     <p>Simule cenários de tributos e impactos em fluxo de caixa.</p>
                     <p className="font-semibold text-foreground">R$ 39/mês</p>
                   </CardContent>
                 </Card>
                 <Card>
                   <CardHeader className="pb-2">
                     <CardTitle className="text-sm font-medium">Integrações ERP extras</CardTitle>
                   </CardHeader>
                   <CardContent className="text-xs text-muted-foreground space-y-1">
                     <p>Conecte ERPs adicionais à sua conta Obliga.</p>
                     <p className="font-semibold text-foreground">R$ 19/mês cada</p>
                   </CardContent>
                 </Card>
               </div>
             </div>

             <div className="grid gap-6 md:grid-cols-2">
               <Card>
                 <CardHeader>
                   <CardTitle className="text-base">FAQ Rápido</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4 text-sm text-muted-foreground">
                   <div>
                     <p className="font-medium text-foreground">Posso mudar de plano depois?</p>
                     <p>Sim, você pode mudar ou cancelar o plano a qualquer momento.</p>
                   </div>
                   <div>
                     <p className="font-medium text-foreground">Tem período de teste?</p>
                     <p>Sim, o plano PRO oferece 14 dias grátis para testes.</p>
                   </div>
                 </CardContent>
               </Card>
               <Card>
                 <CardHeader>
                   <CardTitle className="text-base">Mais dúvidas</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4 text-sm text-muted-foreground">
                   <div>
                     <p className="font-medium text-foreground">Como funciona o self-hosted?</p>
                     <p>Você hospeda o Obliga na sua própria infraestrutura ou VPS, com nosso suporte.</p>
                   </div>
                   <div>
                     <p className="font-medium text-foreground">Aceita quais formas de pagamento?</p>
                     <p>Cartão de crédito, boleto bancário e Pix, conforme o plano contratado.</p>
                   </div>
                 </CardContent>
               </Card>
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
               Acesse o ambiente de demonstração, explore o painel e veja como o Obliga pode organizar sua operação.
             </p>
             <Button size="lg" asChild>
               <Link href="/login">Começar agora</Link>
             </Button>
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
