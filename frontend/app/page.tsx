import Link from "next/link";
import {
  Scissors,
  Calendar,
  Users,
  BarChart3,
  Package,
  Shield,
  Sparkles,
  ArrowRight,
  Star,
  Heart,
  Clock,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ============================================
          HEADER / NAVBAR
          ============================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-barbie-gradient rounded-xl flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-barbie-dark">
              Salão <span className="text-barbie-pink">Barbie</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-barbie-gray-600 hover:text-barbie-pink transition-colors">
              Recursos
            </a>
            <a href="#modules" className="text-sm font-medium text-barbie-gray-600 hover:text-barbie-pink transition-colors">
              Módulos
            </a>
            <a href="#contact" className="text-sm font-medium text-barbie-gray-600 hover:text-barbie-pink transition-colors">
              Contato
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="btn-ghost text-sm"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="btn-primary text-sm"
            >
              Começar grátis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-barbie-pink/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-barbie-light/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-barbie-pink/10 rounded-full blur-2xl animate-float" />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-barbie-pink-50 border border-barbie-pink-100 mb-8">
              <Sparkles className="w-4 h-4 text-barbie-pink" />
              <span className="text-sm font-semibold text-barbie-pink">
                Sistema completo de gestão
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-barbie-dark">
              Gerencie seu{" "}
              <span className="bg-barbie-gradient bg-clip-text text-transparent">
                salão
              </span>{" "}
              com{" "}
              <span className="bg-barbie-gradient bg-clip-text text-transparent">
                elegância
              </span>
            </h1>

            <p className="text-lg md:text-xl text-barbie-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Agenda inteligente, gestão de clientes, equipe, estoque e financeiro em uma
              plataforma única. Tudo o que seu salão precisa para brilhar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="btn-primary text-base px-8 py-3 animate-pulse-pink"
              >
                <Sparkles className="w-5 h-5" />
                Começar agora
              </Link>
              <Link
                href="/login"
                className="btn-secondary text-base px-8 py-3"
              >
                Já tenho conta
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Calendar, label: "Agendamentos", value: "Ilimitados" },
              { icon: Users, label: "Clientes", value: "Sem limites" },
              { icon: Shield, label: "Segurança", value: "100%" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`card p-6 text-center animate-fade-in-up stagger-${i + 1}`}
              >
                <stat.icon className="w-8 h-8 text-barbie-pink mx-auto mb-3" />
                <div className="text-2xl font-bold text-barbie-dark">{stat.value}</div>
                <div className="text-sm text-barbie-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURES SECTION
          ============================================ */}
      <section id="features" className="py-20 px-6 bg-barbie-gradient-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-barbie-dark mb-4">
              Tudo em um só lugar
            </h2>
            <p className="text-barbie-gray-500 max-w-xl mx-auto">
              Simplifique a gestão do seu salão com ferramentas pensadas para o dia a dia da beleza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: "Agenda Inteligente",
                desc: "Visualize por dia ou semana. Evite conflitos de horário automaticamente.",
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: Users,
                title: "Gestão de Clientes",
                desc: "Cadastro completo com histórico de procedimentos e ficha de anamnese.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Star,
                title: "Equipe",
                desc: "Gerencie profissionais, especialidades e regras de comissão.",
                color: "from-amber-500 to-orange-500",
              },
              {
                icon: Package,
                title: "Controle de Estoque",
                desc: "Alertas de estoque baixo e abatimento automático ao concluir serviços.",
                color: "from-emerald-500 to-teal-500",
              },
              {
                icon: BarChart3,
                title: "Financeiro",
                desc: "Fechamento de caixa, comissões automáticas e relatórios de faturamento.",
                color: "from-blue-500 to-indigo-500",
              },
              {
                icon: Clock,
                title: "Tempo Real",
                desc: "Acompanhe o status de cada atendimento em tempo real.",
                color: "from-violet-500 to-purple-500",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`card p-8 group cursor-default animate-fade-in-up stagger-${i + 1}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 
                    group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-barbie-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-barbie-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-barbie-gradient rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <Heart className="w-12 h-12 mx-auto mb-6 animate-float" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para transformar seu salão?
              </h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                Comece hoje mesmo e veja a diferença que um sistema profissional faz no seu dia a dia.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-barbie-pink rounded-2xl font-bold text-lg hover:bg-barbie-pink-50 transition-all hover:scale-105 shadow-lg"
              >
                Criar minha conta
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer id="contact" className="py-12 px-6 border-t border-barbie-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-barbie-gradient rounded-lg flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-barbie-dark">
              Salão <span className="text-barbie-pink">Barbie</span>
            </span>
          </div>

          <p className="text-sm text-barbie-gray-500">
            © {new Date().getFullYear()} Salão Barbie. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-barbie-gray-500 hover:text-barbie-pink transition-colors">
              Termos
            </a>
            <a href="#" className="text-sm text-barbie-gray-500 hover:text-barbie-pink transition-colors">
              Privacidade
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
