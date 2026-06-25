# Sistema de Controle de Salão de Beleza — Plano de Implementação

Sistema completo para gestão de salão de beleza com agenda, clientes, equipe, estoque e financeiro. Tema visual "Barbie" com paleta `#E6007E`, `#FFB7D5`, `#FDFBFD`, `#212121`.

---

## User Review Required

> [!IMPORTANT]
> ### React Router Dom v6 × Next.js — Conflito Arquitetural
> A pesquisa técnica confirmou que **usar `react-router-dom` dentro do Next.js App Router é fortemente desaconselhado** pela comunidade e pelos mantenedores do framework. Isso cria um "router dentro de router", desabilita SSR, Server Components e otimizações automáticas do Next.js.
>
> **Solução proposta:** Usar o **sistema de rotas nativo do Next.js** (file-based routing com App Router) para toda a navegação, incluindo o dashboard. O Next.js possui Layouts, Parallel Routes e Intercepting Routes que cobrem todos os casos de uso que o React Router oferece, sem conflito. O resultado final será idêntico (navegação SPA sem reload dentro do painel), mas aproveitando 100% do Next.js.
>
> **Se você fizer questão do React Router Dom**, a alternativa seria trocar Next.js por **Vite + React**, mas perderíamos SSR e SEO nas páginas institucionais.

> [!IMPORTANT]
> ### Credenciais de Serviços Externos
> O sistema depende de credenciais para:
> - **Neon.tech** — banco de dados PostgreSQL (connection string)
> - **Cloudinary** — armazenamento de mídia (cloud_name, api_key, api_secret)
> - **Better Auth / OAuth2** — credenciais Google/Apple para login social
>
> Você já possui contas nesses serviços? Caso contrário, posso criar o sistema preparado para receber as credenciais via `.env` e você configura depois.

> [!WARNING]
> ### Tailwind CSS v4 + Flowbite
> O Flowbite React é compatível com Tailwind CSS v4. Usarei `npx flowbite-react@latest init` para configurar automaticamente após criar o projeto Next.js.

---

## Open Questions

1. **Roteamento**: Posso prosseguir usando o **roteamento nativo do Next.js** (App Router) ao invés do React Router Dom v6? Isso evita conflitos e mantém todas as funcionalidades.
2. **ORM**: Planejo usar **Prisma** como ORM (recomendado para NestJS + Neon.tech com type safety). Está ok ou prefere TypeORM?
3. **Credenciais**: Devo configurar o sistema com valores placeholder no `.env.example` para você preencher depois?
4. **Escopo MVP**: O roadmap completo (7 passos) é extenso. Posso entregar tudo de forma incremental — deseja que eu priorize algum módulo específico?

---

## Estrutura do Monorepo

```
trabalho 3/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── auth/               # Better Auth + JWT + OAuth2
│   │   ├── clients/            # CRUD Clientes
│   │   ├── professionals/      # CRUD Profissionais
│   │   ├── services/           # CRUD Serviços
│   │   ├── appointments/       # Agendamentos + validação horários
│   │   ├── inventory/          # Estoque + alertas
│   │   ├── finance/            # Caixa, comissões, comandas
│   │   ├── upload/             # Multer + Streamifier + Cloudinary
│   │   ├── prisma/             # Prisma Service + schema
│   │   └── common/             # Guards, DTOs, utils
│   ├── prisma/
│   │   └── schema.prisma       # DER completo
│   └── .env.example
├── frontend/                   # Next.js + Tailwind v4 + Flowbite
│   ├── app/
│   │   ├── (auth)/             # Layout de autenticação
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/        # Layout do painel admin
│   │   │   ├── layout.tsx      # Sidebar + Navbar
│   │   │   ├── page.tsx        # Dashboard financeiro
│   │   │   ├── agenda/         # Controle de agenda
│   │   │   ├── clientes/       # Gestão de clientes
│   │   │   ├── equipe/         # Gestão de profissionais
│   │   │   ├── servicos/       # Gestão de serviços
│   │   │   ├── estoque/        # Controle de estoque
│   │   │   └── caixa/          # Fechamento de caixa
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page (institucional)
│   ├── components/             # Componentes reutilizáveis
│   ├── lib/                    # API client, utils, auth
│   └── .env.local.example
└── README.md
```

---

## Proposed Changes

### Componente 1: Backend — Infraestrutura e Banco de Dados (Passo 1)

#### [NEW] `backend/` — Projeto NestJS

Scaffold do projeto NestJS com TypeScript usando `@nestjs/cli`.

**Dependências principais:**
- `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`
- `prisma`, `@prisma/client`, `@prisma/adapter-neon`, `@neondatabase/serverless`
- `@nestjs/config` (variáveis de ambiente)

#### [NEW] [schema.prisma](file:///c:/Users/rrafa/OneDrive/Documentos/Senac/4-semestre-261/Programação%20Full-Stack/trabalho%203/backend/prisma/schema.prisma)

Modelagem completa do DER com as tabelas:

```prisma
// Enums
enum ComissaoTipo { FIXO PORCENTAGEM }
enum AgendamentoStatus { CONFIRMADO PENDENTE EM_ATENDIMENTO CONCLUIDO CANCELADO }
enum EstoqueTipo { USO_INTERNO VENDA }

model Cliente {
  id                      String   @id @default(uuid())
  nome                    String
  telefone                String
  aniversario             DateTime?
  historicoProcedimentos  Json?
  fichaAnamnese           String?
  fotoUrl                 String?
  criadoEm                DateTime @default(now())
  agendamentos            Agendamento[]
}

model Profissional {
  id                  String        @id @default(uuid())
  nome                String
  especialidades      String[]
  regraComissaoTipo   ComissaoTipo
  regraComissaoValor  Decimal
  criadoEm            DateTime      @default(now())
  agendamentos        Agendamento[]
}

model Servico {
  id             String        @id @default(uuid())
  nome           String
  preco          Decimal
  duracaoMinutos Int
  criadoEm       DateTime      @default(now())
  agendamentos   Agendamento[]
}

model Agendamento {
  id              String             @id @default(uuid())
  dataHora        DateTime
  status          AgendamentoStatus  @default(PENDENTE)
  notas           String?
  clienteId       String
  profissionalId  String
  servicoId       String
  cliente         Cliente            @relation(fields: [clienteId], references: [id])
  profissional    Profissional       @relation(fields: [profissionalId], references: [id])
  servico         Servico            @relation(fields: [servicoId], references: [id])
  criadoEm        DateTime           @default(now())
}

model Estoque {
  id              String      @id @default(uuid())
  nomeProduto     String
  tipo            EstoqueTipo
  quantidade      Int
  estoqueMinimo   Int
  precoVenda      Decimal?
  fotoProdutoUrl  String?
  criadoEm        DateTime    @default(now())
}
```

#### [NEW] [prisma.service.ts](file:///c:/Users/rrafa/OneDrive/Documentos/Senac/4-semestre-261/Programação%20Full-Stack/trabalho%203/backend/src/prisma/prisma.service.ts)

Service singleton do Prisma com adapter Neon para conexão serverless.

#### [NEW] `.env.example`

```env
DATABASE_URL="postgresql://user:pass@endpoint-pooler.region.aws.neon.tech/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@endpoint.region.aws.neon.tech/db?sslmode=require"
JWT_SECRET="generated-with-openssl"
CORS_ORIGIN="http://localhost:3000"
```

---

### Componente 2: Backend — Autenticação e Segurança (Passo 2)

#### [NEW] `backend/src/auth/`

- **auth.module.ts** — Módulo com Better Auth integrado
- **auth.service.ts** — Service com lógica de autenticação, emissão/validação JWT
- **auth.controller.ts** — Endpoints: `POST /auth/login`, `POST /auth/register`, `GET /auth/me`
- **auth.guard.ts** — Guard global para rotas protegidas
- **roles.decorator.ts** — Decorator `@Roles('admin', 'profissional')` para RBAC
- **roles.guard.ts** — Guard de verificação de nível de acesso

**Dependências:** `@thallesp/nestjs-better-auth`, `jsonwebtoken`, `bcryptjs`

---

### Componente 3: Backend — Core API / Regras de Negócio (Passo 3)

#### [NEW] `backend/src/clients/` — CRUD Clientes
- Controller com endpoints REST: `GET`, `POST`, `PUT`, `DELETE`
- Service com busca por nome/telefone, histórico de procedimentos
- DTOs com validação usando `class-validator`

#### [NEW] `backend/src/professionals/` — CRUD Profissionais
- Controller REST completo
- Service com gestão de especialidades e regras de comissão

#### [NEW] `backend/src/services/` — CRUD Serviços
- Controller REST completo
- Service com cálculo de duração e preço

#### [NEW] `backend/src/appointments/` — Agendamentos
- **Validação de choque de horários**: Antes de criar/atualizar, verificar se o profissional já tem agendamento no intervalo `[dataHora, dataHora + duracaoMinutos]`
- **Bloqueio de agenda**: Endpoint para criar bloqueios (almoço, folga) como agendamentos especiais sem cliente
- **Fluxo de status**: Pendente → Confirmado → Em Atendimento → Concluído/Cancelado
- Service com queries otimizadas por profissional/data

---

### Componente 4: Backend — Upload de Mídia e Estoque (Passo 4)

#### [NEW] `backend/src/upload/`
- **cloudinary.provider.ts** — Provider com configuração do SDK
- **cloudinary.service.ts** — Service usando `streamifier` para converter buffer em stream
- **upload.controller.ts** — Endpoint `POST /upload` com `@UseInterceptors(FileInterceptor)`

**Dependências:** `cloudinary`, `multer`, `streamifier`, `@types/multer`

#### [NEW] `backend/src/inventory/` — Estoque
- CRUD completo de produtos
- **Alerta de estoque mínimo**: Query que retorna produtos com `quantidade < estoqueMinimo`
- **Abatimento automático**: Ao concluir agendamento, descontar produtos de uso interno

---

### Componente 5: Backend — Finanças (Passo 7 — parte backend)

#### [NEW] `backend/src/finance/`
- **Fechamento de caixa**: Endpoint que totaliza agendamentos concluídos do dia
- **Cálculo de comissões**: Para cada profissional, aplicar regra (fixo ou porcentagem) sobre serviços concluídos
- **Relatórios**: Faturamento por período, ticket médio, ranking de profissionais

---

### Componente 6: Frontend — Projeto Next.js (Passo 5)

#### [NEW] `frontend/` — Projeto Next.js + Tailwind v4 + Flowbite

Scaffold com `npx create-next-app@latest` + `npx flowbite-react@latest init`.

**Paleta de Cores (Design System Barbie):**
```css
@theme {
  --color-barbie-pink: #E6007E;
  --color-barbie-light: #FFB7D5;
  --color-barbie-white: #FDFBFD;
  --color-barbie-dark: #212121;
}
```

#### [NEW] `frontend/app/(auth)/` — Telas de Autenticação
- **Login** — Formulário com email/senha + botões OAuth (Google/Apple)
- **Registro** — Formulário de cadastro com validação

Design: Cards centralizados com glassmorphism, gradiente rosa, micro-animações de entrada.

#### [NEW] `frontend/app/(dashboard)/layout.tsx` — Shell do Dashboard
- **Sidebar** — Menu lateral com ícones, links para cada módulo, logo do salão
- **Navbar** — Barra superior com busca, notificações, avatar do usuário
- Navegação via Next.js `<Link>` (substitui React Router) — mesmo comportamento SPA

---

### Componente 7: Frontend — Telas Operacionais (Passo 6)

#### [NEW] `frontend/app/(dashboard)/page.tsx` — Dashboard Financeiro
- Cards com KPIs: faturamento do dia, agendamentos, ticket médio
- Gráficos de faturamento (usando Chart.js ou Recharts)
- Tabela de comissões do período

#### [NEW] `frontend/app/(dashboard)/agenda/` — Controle de Agenda
- Visualização por dia e semana (grid de horários)
- Drag & drop para reagendar
- Modal de criação rápida de agendamento
- Filtro por profissional, status
- Indicadores visuais por status (cores)

#### [NEW] `frontend/app/(dashboard)/clientes/` — Gestão de Clientes
- Tabela com busca, filtros e paginação
- Formulário de cadastro/edição com foto (upload)
- Aba de prontuário/anamnese
- Histórico de procedimentos

#### [NEW] `frontend/app/(dashboard)/equipe/` — Gestão de Profissionais
- Tabela de profissionais com especialidades
- Configuração de regras de comissão
- Visualização de agenda individual

#### [NEW] `frontend/app/(dashboard)/servicos/` — Gestão de Serviços
- Tabela com preço, duração
- Formulário de criação/edição

#### [NEW] `frontend/app/(dashboard)/estoque/` — Controle de Estoque
- Tabela com alertas visuais (vermelho para estoque baixo)
- Filtro por tipo (Uso Interno / Venda)
- Formulário com upload de foto do produto

#### [NEW] `frontend/app/(dashboard)/caixa/` — Fechamento de Caixa
- Resumo do dia: total entrada, saídas, comissões
- Lista de atendimentos concluídos
- Botão "Fechar Caixa" com confirmação

---

## Verification Plan

### Automated Tests
```bash
# Backend — Testes unitários e e2e
cd backend && npm run test
cd backend && npm run test:e2e

# Frontend — Build para verificar erros de TypeScript
cd frontend && npm run build

# Prisma — Validar schema
cd backend && npx prisma validate
```

### Manual Verification
- **Fluxo E2E completo**: Agendar serviço → Confirmar → Atender → Concluir → Verificar comissão gerada → Verificar abatimento no estoque
- **Validação de conflito**: Tentar agendar dois serviços no mesmo horário para o mesmo profissional
- **Alerta de estoque**: Criar produto com estoque mínimo de 5, reduzir quantidade para 3, verificar alerta
- **Responsividade**: Testar dashboard em desktop e tablet
- **Autenticação**: Testar login/logout, verificar que rotas protegidas redirecionam para login

---

## Ordem de Execução

| Fase | Descrição | Estimativa |
|------|-----------|------------|
| 1 | Backend: Scaffold + Prisma + DB Schema | ⬜ |
| 2 | Backend: Autenticação (Better Auth + JWT) | ⬜ |
| 3 | Backend: CRUDs (Clientes, Profissionais, Serviços) | ⬜ |
| 4 | Backend: Agendamentos + Validação de horários | ⬜ |
| 5 | Backend: Upload (Cloudinary) + Estoque | ⬜ |
| 6 | Backend: Finanças (Caixa, Comissões) | ⬜ |
| 7 | Frontend: Scaffold + Design System + Auth pages | ⬜ |
| 8 | Frontend: Dashboard Shell (Sidebar + Navbar) | ⬜ |
| 9 | Frontend: Telas operacionais (Agenda, Clientes, etc.) | ⬜ |
| 10 | Frontend: Dashboard financeiro + gráficos | ⬜ |
| 11 | Integração Frontend ↔ Backend | ⬜ |
| 12 | Testes e validação final | ⬜ |
