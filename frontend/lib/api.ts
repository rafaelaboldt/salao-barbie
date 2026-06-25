// ============================================
// API Client — Comunicação com Backend NestJS
// ============================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================
// AUTH
// ============================================

export const authApi = {
  login: (email: string, senha: string) =>
    request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: { email, senha },
    }),

  register: (email: string, senha: string, nome: string) =>
    request<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: { email, senha, nome },
    }),

  me: () => request<User>('/auth/me'),
};

// ============================================
// CLIENTS
// ============================================

export const clientsApi = {
  list: (search?: string) =>
    request<Cliente[]>(`/clients${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  get: (id: string) => request<Cliente>(`/clients/${id}`),
  create: (data: CreateClienteDto) =>
    request<Cliente>('/clients', { method: 'POST', body: data }),
  update: (id: string, data: Partial<CreateClienteDto>) =>
    request<Cliente>(`/clients/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => request(`/clients/${id}`, { method: 'DELETE' }),
};

// ============================================
// PROFESSIONALS
// ============================================

export const professionalsApi = {
  list: (search?: string) =>
    request<Profissional[]>(`/professionals${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  get: (id: string) => request<Profissional>(`/professionals/${id}`),
  create: (data: CreateProfissionalDto) =>
    request<Profissional>('/professionals', { method: 'POST', body: data }),
  update: (id: string, data: Partial<CreateProfissionalDto>) =>
    request<Profissional>(`/professionals/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => request(`/professionals/${id}`, { method: 'DELETE' }),
};

// ============================================
// SERVICES
// ============================================

export const servicesApi = {
  list: (search?: string) =>
    request<Servico[]>(`/services${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  get: (id: string) => request<Servico>(`/services/${id}`),
  create: (data: CreateServicoDto) =>
    request<Servico>('/services', { method: 'POST', body: data }),
  update: (id: string, data: Partial<CreateServicoDto>) =>
    request<Servico>(`/services/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => request(`/services/${id}`, { method: 'DELETE' }),
};

// ============================================
// APPOINTMENTS
// ============================================

export const appointmentsApi = {
  list: (params?: { dataInicio?: string; dataFim?: string; profissionalId?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.dataInicio) query.set('dataInicio', params.dataInicio);
    if (params?.dataFim) query.set('dataFim', params.dataFim);
    if (params?.profissionalId) query.set('profissionalId', params.profissionalId);
    if (params?.status) query.set('status', params.status);
    return request<Agendamento[]>(`/appointments?${query.toString()}`);
  },
  get: (id: string) => request<Agendamento>(`/appointments/${id}`),
  create: (data: CreateAgendamentoDto) =>
    request<Agendamento>('/appointments', { method: 'POST', body: data }),
  updateStatus: (id: string, status: string, notas?: string) =>
    request<Agendamento>(`/appointments/${id}/status`, {
      method: 'PUT',
      body: { status, notas },
    }),
  delete: (id: string) => request(`/appointments/${id}`, { method: 'DELETE' }),
  getAgendaDoDia: (profissionalId: string, data: string) =>
    request<Agendamento[]>(`/appointments/dia/${profissionalId}/${data}`),
};

// ============================================
// INVENTORY
// ============================================

export const inventoryApi = {
  list: (search?: string, tipo?: string) => {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (tipo) query.set('tipo', tipo);
    return request<Estoque[]>(`/inventory?${query.toString()}`);
  },
  get: (id: string) => request<Estoque>(`/inventory/${id}`),
  create: (data: CreateEstoqueDto) =>
    request<Estoque>('/inventory', { method: 'POST', body: data }),
  update: (id: string, data: Partial<CreateEstoqueDto>) =>
    request<Estoque>(`/inventory/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => request(`/inventory/${id}`, { method: 'DELETE' }),
  getAlertas: () => request<Estoque[]>('/inventory/alertas'),
};

// ============================================
// FINANCE
// ============================================

export const financeApi = {
  getResumoDoDia: (data?: string) =>
    request<ResumoDia>(`/finance/resumo-dia${data ? `?data=${data}` : ''}`),
  fecharCaixa: (data: string, observacoes?: string) =>
    request('/finance/fechar-caixa', { method: 'POST', body: { data, observacoes } }),
  getRelatorio: (dataInicio: string, dataFim: string) =>
    request<RelatorioPeriodo>(`/finance/relatorio?dataInicio=${dataInicio}&dataFim=${dataFim}`),
};

// ============================================
// UPLOAD
// ============================================

export const uploadApi = {
  upload: async (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const response = await fetch(`${API_BASE}/upload${folder ? `?folder=${folder}` : ''}`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro no upload' }));
      throw new Error(error.message);
    }

    return response.json() as Promise<{ url: string; publicId: string }>;
  },
};

// ============================================
// TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  nome: string;
  role: 'ADMIN' | 'PROFISSIONAL';
  avatarUrl: string | null;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  aniversario?: string;
  historicoProcedimentos?: unknown;
  fichaAnamnese?: string;
  fotoUrl?: string;
  criadoEm: string;
  agendamentos?: Agendamento[];
}

export interface CreateClienteDto {
  nome: string;
  telefone: string;
  email?: string;
  aniversario?: string;
  fichaAnamnese?: string;
  fotoUrl?: string;
}

export interface Profissional {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  especialidades: string[];
  regraComissaoTipo: 'FIXO' | 'PORCENTAGEM';
  regraComissaoValor: number;
  ativo: boolean;
  fotoUrl?: string;
  criadoEm: string;
  agendamentos?: Agendamento[];
}

export interface CreateProfissionalDto {
  nome: string;
  telefone?: string;
  email?: string;
  especialidades: string[];
  regraComissaoTipo: 'FIXO' | 'PORCENTAGEM';
  regraComissaoValor: number;
  fotoUrl?: string;
}

export interface Servico {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  duracaoMinutos: number;
  ativo: boolean;
  criadoEm: string;
}

export interface CreateServicoDto {
  nome: string;
  descricao?: string;
  preco: number;
  duracaoMinutos: number;
}

export interface Agendamento {
  id: string;
  dataHora: string;
  dataHoraFim: string;
  status: 'PENDENTE' | 'CONFIRMADO' | 'EM_ATENDIMENTO' | 'CONCLUIDO' | 'CANCELADO';
  notas?: string;
  isBloqueio: boolean;
  clienteId?: string;
  profissionalId: string;
  servicoId?: string;
  cliente?: { id: string; nome: string; telefone: string; fotoUrl?: string };
  profissional?: { id: string; nome: string; especialidades: string[] };
  servico?: { id: string; nome: string; preco: number; duracaoMinutos: number };
  criadoEm: string;
}

export interface CreateAgendamentoDto {
  dataHora: string;
  profissionalId: string;
  clienteId?: string;
  servicoId?: string;
  duracaoMinutos?: number;
  notas?: string;
  isBloqueio?: boolean;
}

export interface Estoque {
  id: string;
  nomeProduto: string;
  descricao?: string;
  tipo: 'USO_INTERNO' | 'VENDA';
  quantidade: number;
  estoqueMinimo: number;
  precoVenda?: number;
  precoCusto?: number;
  fotoProdutoUrl?: string;
  criadoEm: string;
}

export interface CreateEstoqueDto {
  nomeProduto: string;
  descricao?: string;
  tipo: 'USO_INTERNO' | 'VENDA';
  quantidade: number;
  estoqueMinimo: number;
  precoVenda?: number;
  precoCusto?: number;
  fotoProdutoUrl?: string;
}

export interface ResumoDia {
  data: string;
  totalAtendimentos: number;
  totalFaturamento: string;
  totalComissoes: string;
  totalLiquido: string;
  ticketMedio: string;
  comissoesPorProfissional: Array<{
    nome: string;
    totalServicos: string;
    comissao: string;
    atendimentos: number;
  }>;
  atendimentos: Array<{
    id: string;
    horario: string;
    cliente: string;
    servico: string;
    valor: string;
    profissional: string;
  }>;
}

export interface RelatorioPeriodo {
  periodo: { inicio: string; fim: string };
  totalAtendimentos: number;
  totalFaturamento: string;
  totalComissoes: string;
  totalLiquido: string;
  ticketMedio: string;
  faturamentoPorDia: Array<{ dia: string; valor: string }>;
}
