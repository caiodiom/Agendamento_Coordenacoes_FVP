# 📖 Manual de Edição do Sistema

## Guia Completo para Modificações

Este manual foi criado para facilitar futuras edições no sistema de agendamentos da FVP.

---

## 1. Alterar Dias de Atendimento de uma Coordenação

### Arquivo: `src/lib/coordinations.ts`

Localize a coordenação desejada e altere o array `days`:

```typescript
// Legenda dos dias:
// 0 = Domingo
// 1 = Segunda
// 2 = Terça
// 3 = Quarta
// 4 = Quinta
// 5 = Sexta
// 6 = Sábado

// Exemplo: Mudar Direito para Terça e Quinta
{
  id: 'direito',
  name: 'Coordenação de Direito',
  shortName: 'Direito',
  icon: Scale,
  days: [2, 4], // Alterado de [1, 3] para [2, 4]
  credentials: { user: 'direito', password: 'direito123' }
}
```

---

## 2. Alterar Horários de Atendimento

### Arquivo: `src/lib/coordinations.ts`

Localize a função `generateTimeSlots` (linha ~100):

```typescript
export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  let hour = 18;      // ← HORA INICIAL (18:30)
  let minute = 30;    // ← MINUTO INICIAL

  for (let i = 0; i < 13; i++) {  // ← QUANTIDADE DE SLOTS
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    slots.push(timeString);
    
    minute += 15;  // ← INTERVALO EM MINUTOS
    if (minute >= 60) {
      minute = 0;
      hour++;
    }
  }

  return slots;
};
```

### Exemplos de Modificação:

**Para começar às 14:00:**
```typescript
let hour = 14;
let minute = 0;
```

**Para slots de 30 minutos:**
```typescript
minute += 30;
```

**Para 8 slots:**
```typescript
for (let i = 0; i < 8; i++)
```

---

## 3. Alterar Quantidade de Dias Futuros

### Arquivo: `src/components/AppointmentModal.tsx`

Localize a constante `DAYS_AHEAD` (linha ~28):

```typescript
// CONFIGURAÇÃO: Altere o valor abaixo para
// mudar quantos dias no futuro aparecem
const DAYS_AHEAD = 30;  // ← ALTERE AQUI
```

---

## 4. Adicionar Nova Coordenação

### Arquivo: `src/lib/coordinations.ts`

1. Importe o ícone desejado (do lucide-react):
```typescript
import { Scale, Brain, Calculator, /* NovoIcone */ } from 'lucide-react';
```

2. Adicione a nova coordenação no array `coordinations`:
```typescript
{
  id: 'nova-coord',           // ID único (sem espaços/acentos)
  name: 'Coordenação de Exemplo',  // Nome completo
  shortName: 'Exemplo',       // Nome curto
  icon: NovoIcone,            // Ícone importado
  days: [1, 3, 5],           // Dias de atendimento
  credentials: { 
    user: 'exemplo',          // Usuário para login
    password: 'exemplo123'    // Senha para login
  }
}
```

---

## 5. Alterar Credenciais de Acesso

### Arquivo: `src/lib/coordinations.ts`

Localize a coordenação e altere `credentials`:

```typescript
credentials: { 
  user: 'novo_usuario',      // Novo usuário
  password: 'nova_senha123'  // Nova senha
}
```

---

## 6. Alterar Cores do Sistema

### Arquivo: `src/index.css`

As cores estão definidas em variáveis CSS:

```css
:root {
  /* Azul Marinho Institucional */
  --primary: 225 60% 25%;      /* Cor principal */
  
  /* Verde Institucional */
  --secondary: 145 55% 30%;    /* Cor secundária */
  
  /* Amarelo/Dourado */
  --gold: 40 90% 55%;          /* Botões de destaque */
  
  /* Fundo */
  --background: 0 0% 98%;      /* Cor de fundo */
}
```

### Como Alterar:

Os valores estão em formato HSL (Matiz Saturação Luminosidade):
- **Matiz (H)**: 0-360 (cor)
- **Saturação (S)**: 0-100% (intensidade)
- **Luminosidade (L)**: 0-100% (claridade)

---

## 7. Alterar Logo

### Arquivo: `src/assets/logo-fvp.jpg`

1. Substitua o arquivo `logo-fvp.jpg` pela nova imagem
2. Mantenha o mesmo nome ou altere a referência em `src/components/Header.tsx`

---

## 8. Alterar Textos da Interface

### Página Inicial
**Arquivo:** `src/pages/Index.tsx`

```typescript
<h2 className="...">
  Escolha uma Coordenação  {/* ← Título */}
</h2>
<p className="...">
  Selecione a coordenação desejada...  {/* ← Subtítulo */}
</p>
```

### Modal de Agendamento
**Arquivo:** `src/components/AppointmentModal.tsx`

Procure pelos textos como:
- "Nome Completo"
- "Período"
- "Motivo do Agendamento"
- "Confirmar Agendamento"

---

## 9. Alterar Períodos Disponíveis

### Arquivo: `src/components/AppointmentModal.tsx`

Localize o array `PERIODS`:

```typescript
// Opções de período
const PERIODS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10'];
```

Para adicionar ou remover períodos, edite este array.

---

## 10. Configuração do Firebase

### Arquivo: `src/lib/firebase.ts`

Contém as credenciais do Firebase. Para alterar o projeto:

```typescript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

---

## ⚠️ Cuidados Importantes

1. **Sempre faça backup** antes de editar
2. **Teste localmente** antes de publicar
3. **Não altere arquivos** na pasta `node_modules`
4. **Mantenha a formatação** do código
5. **Use aspas simples** para strings em TypeScript

---

## 🔄 Como Publicar Alterações

### Via Lovable:
1. Faça as alterações no editor
2. Clique em "Publish" no canto superior direito
3. Confirme a publicação

### Via Git:
```bash
git add .
git commit -m "Descrição da alteração"
git push
```

---

## 📝 Checklist de Alterações

Antes de publicar, verifique:

- [ ] O sistema carrega sem erros?
- [ ] Os cards de coordenação aparecem corretamente?
- [ ] O modal de agendamento abre?
- [ ] Os campos do formulário funcionam?
- [ ] Os horários aparecem corretamente?
- [ ] O login de coordenadores funciona?
- [ ] O painel exibe os agendamentos?

---

*Manual atualizado em Janeiro/2026*
