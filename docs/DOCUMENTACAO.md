# 📚 Documentação do Sistema de Agendamentos - FVP

## Visão Geral

Sistema de agendamento de atendimentos online para a **Faculdade Vale do Pajeú (FVP)**. Permite que alunos agendem atendimentos com as coordenações de curso de forma simples e organizada.

---

## 🏗️ Arquitetura do Sistema

### Tecnologias Utilizadas

| Tecnologia | Função |
|------------|--------|
| **React 18** | Framework frontend |
| **TypeScript** | Tipagem estática |
| **Vite** | Build tool e dev server |
| **Tailwind CSS** | Estilização |
| **Firebase Realtime Database** | Banco de dados |
| **React Router** | Navegação |
| **Shadcn/ui** | Componentes UI |

### Estrutura de Pastas

```
src/
├── components/         # Componentes reutilizáveis
│   ├── ui/            # Componentes UI base (shadcn)
│   ├── Header.tsx     # Cabeçalho com logo
│   ├── CoordinationCard.tsx  # Card de coordenação
│   └── AppointmentModal.tsx  # Modal de agendamento
├── contexts/          # Contextos React
│   └── AuthContext.tsx  # Autenticação
├── hooks/             # Hooks customizados
│   └── useAppointments.ts  # Lógica de agendamentos
├── lib/               # Utilitários e configurações
│   ├── firebase.ts    # Configuração Firebase
│   ├── coordinations.ts  # Dados das coordenações
│   └── utils.ts       # Funções utilitárias
├── pages/             # Páginas da aplicação
│   ├── Index.tsx      # Página inicial (alunos)
│   ├── Login.tsx      # Login coordenadores
│   ├── PainelCoordenador.tsx  # Painel administrativo
│   └── CoordenacaoGeral.tsx   # Painel geral
└── assets/            # Imagens e recursos
    └── logo-fvp.jpg   # Logo da instituição
```

---

## 📋 Funcionalidades

### Para Alunos

1. **Visualizar Coordenações** - Cards com todas as coordenações disponíveis
2. **Selecionar Coordenação** - Clique para abrir modal de agendamento
3. **Preencher Dados**:
   - Nome completo
   - Período (P1 a P10)
   - Motivo do agendamento
4. **Escolher Data** - Datas disponíveis nos próximos 30 dias
5. **Escolher Horário** - Slots de 15 minutos (18:30 às 21:30)
6. **Confirmar Agendamento** - Recebe confirmação visual

### Para Coordenadores

1. **Login** - Acesso com usuário e senha
2. **Visualizar Agendamentos** - Lista de todos os agendamentos
3. **Marcar Atendimento** - Checkbox para marcar como atendido
4. **Adicionar Observações** - Campo de notas sobre o atendimento
5. **Filtrar por Data** - Visualizar agendamentos por período

---

## 🔐 Credenciais de Acesso

### Coordenações

| Coordenação | Usuário | Senha | Dias de Atendimento |
|-------------|---------|-------|---------------------|
| Geral | geral | geral123 | Seg a Sex |
| Direito | direito | direito123 | Seg, Qua |
| Psicologia | psicologia | psicologia123 | Ter, Qui |
| Contábeis | contabeis | contabeis123 | Seg, Ter |
| Administração | administracao | administracao123 | Qua, Qui |
| Pedagogia | pedagogia | pedagogia123 | Ter, Sex |
| Enfermagem | enfermagem | enfermagem123 | Seg, Qua, Sex |
| Veterinária | veterinaria | veterinaria123 | Qui, Sex |
| Odontologia | odontologia | odontologia123 | Qua, Sex |

---

## ⏰ Horários de Atendimento

- **Horário de funcionamento**: 18:30 às 21:30
- **Intervalo entre slots**: 15 minutos
- **Total de slots por dia**: 13 horários

### Lista de Horários

```
18:30 | 18:45 | 19:00 | 19:15 | 19:30 | 19:45 | 20:00
20:15 | 20:30 | 20:45 | 21:00 | 21:15 | 21:30
```

---

## 🗄️ Estrutura do Banco de Dados (Firebase)

### Coleção: `appointments`

```typescript
{
  id: string;              // ID único (gerado automaticamente)
  coordinationId: string;  // ID da coordenação
  studentName: string;     // Nome do aluno
  period: string;          // Período (P1-P10)
  reason: string;          // Motivo do agendamento
  date: string;            // Data (YYYY-MM-DD)
  time: string;            // Horário (HH:mm)
  attended: boolean;       // Se foi atendido
  notes: string;           // Observações do coordenador
  createdAt: number;       // Timestamp de criação
}
```

---

## 🎨 Design System

### Cores Principais

| Nome | HSL | Uso |
|------|-----|-----|
| Primary | 225 60% 25% | Azul marinho institucional |
| Secondary | 145 55% 30% | Verde institucional |
| Accent | 145 45% 40% | Verde claro |
| Gold | 40 90% 55% | Dourado/amarelo |

### Responsividade

- **Mobile**: 2 colunas de cards
- **Tablet**: 3 colunas de cards
- **Desktop**: 3-4 colunas de cards

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou bun

### Instalação

```bash
# Clonar repositório
git clone <url-do-repositorio>

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

---

## 📱 Layout Responsivo

O sistema foi projetado com layout "No-Scroll", ou seja:

- Todo conteúdo visível sem rolagem
- Cards compactos e responsivos
- Modal de agendamento otimizado
- Funciona em todos os tamanhos de tela

---

## 🔧 Manutenção

### Adicionar Nova Coordenação

Edite o arquivo `src/lib/coordinations.ts`:

```typescript
{
  id: 'nova-coordenacao',
  name: 'Coordenação de Exemplo',
  shortName: 'Exemplo',
  icon: IconeDesejado,
  days: [1, 3, 5], // Dias da semana
  credentials: { user: 'exemplo', password: 'exemplo123' }
}
```

### Alterar Horários

Edite a função `generateTimeSlots` em `src/lib/coordinations.ts`.

### Alterar Dias Futuros

Edite a constante `DAYS_AHEAD` em `src/components/AppointmentModal.tsx`.

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o setor de TI da Faculdade Vale do Pajeú.

---

*Documentação atualizada em Janeiro/2026*
