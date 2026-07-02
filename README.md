# Salão Barbie

Este repositório contém um sistema completo de gestão para salão de beleza, com backend em NestJS e frontend em Next.js. O projeto contempla autenticação, clientes, profissionais, serviços, agenda, estoque, financeiro e upload de mídia.

## O que inclui

- Backend NestJS com Prisma e PostgreSQL
- API REST para gestão de clientes, profissionais, serviços, agendamentos, estoque e finanças
- Frontend Next.js com interface inicial institucional e painel para gestão
- Variáveis de ambiente organizadas para desenvolvimento local

## Estrutura do projeto

- backend/ — API e modelos do banco de dados
- frontend/ — aplicação web
- implementation_plan.md — plano de implementação do projeto

## Requisitos

- Node.js 20+
- npm ou pnpm
- PostgreSQL local ou conexão com banco remoto

## Configuração rápida

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd salao-barbie
```

### 2. Configure o backend

```bash
cd backend
npm install
```

Edite o arquivo [backend/.env](backend/.env) com suas credenciais locais, se necessário.

Gere o client do Prisma:

```bash
npx prisma generate
```

Execute as migrações:

```bash
npx prisma migrate dev
```

Inicie a API:

```bash
npm run start:dev
```

A API estará disponível em:

```text
http://localhost:3001/api
```

### 3. Configure o frontend

```bash
cd ../frontend
npm install
```

O arquivo [frontend/.env.local](frontend/.env.local) já contém a URL padrão da API local.

Inicie o frontend:

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## Scripts úteis

### Backend

```bash
cd backend
npm run build
npm run test
```

### Frontend

```bash
cd frontend
npm run build
npm run lint
```

## Próximos passos

- Conectar o banco de dados PostgreSQL
- Popular dados iniciais com usuários, clientes e serviços
- Expandir as telas do painel administrativo
- Integrar upload para imagens e armazenamento em Cloudinary
