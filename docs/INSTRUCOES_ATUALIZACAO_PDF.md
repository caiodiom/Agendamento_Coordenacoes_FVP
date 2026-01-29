# 📄 Documentação - Exportação de Relatório em PDF

## Visão Geral

Este documento descreve as alterações realizadas para implementar a exportação de relatórios em PDF no sistema de Coordenação Geral da Faculdade Vale do Pajeú.

---

## 📦 Dependências Adicionadas

```bash
# Bibliotecas instaladas
jspdf          # Gerador de PDFs
jspdf-autotable # Plugin para criação de tabelas no PDF
```

---

## 🔧 Alterações Realizadas

### 1. Imports Adicionados

```typescript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoFVP from '@/assets/logo-fvp.jpg';
```

### 2. Função `exportToPDF` Substituiu `exportToCSV`

A função `exportToCSV` foi removida e substituída pela função `exportToPDF` que gera um PDF profissional com:

- **Cabeçalho institucional** com logo e nome da instituição
- **Linha separadora** visual
- **Informações do relatório** (data de geração, filtros aplicados)
- **Tabela formatada** com todos os agendamentos
- **Rodapé** com paginação e copyright

### 3. Botão Atualizado

O botão "Exportar CSV" foi alterado para "Exportar PDF":

```tsx
<button
  onClick={exportToPDF}
  className="btn-gold py-2 px-4 flex items-center gap-2 text-sm"
>
  <FileSpreadsheet className="w-4 h-4" />
  Exportar PDF
</button>
```

---

## 📋 Instruções para Atualizações Futuras

### Alterar a Logo da Instituição

1. Substitua o arquivo em `src/assets/logo-fvp.jpg`
2. Ou altere o import no topo do arquivo:

```typescript
// De:
import logoFVP from '@/assets/logo-fvp.jpg';

// Para:
import logoFVP from '@/assets/nova-logo.png';
```

**Nota:** Formatos suportados: JPEG, PNG

### Alterar Nome da Instituição

Modifique as constantes dentro da função `exportToPDF`:

```typescript
const INSTITUTION_NAME = 'Novo Nome da Instituição';
const INSTITUTION_SUBTITLE = 'Nova Cidade - UF';
const REPORT_TITLE = 'Novo Título do Relatório';
```

### Adicionar Novas Colunas na Tabela

1. Adicione o nome da coluna no array `head`:

```typescript
head: [[
  'Aluno',
  'Período',
  'Coordenação',
  'Data',
  'Horário',
  'Motivo',
  'Compareceu',
  'Resolvido',
  'Anotações',
  'Nova Coluna' // Adicione aqui
]],
```

2. Adicione o valor correspondente no array `body`:

```typescript
const tableData = filteredAppointments.map(apt => {
  return [
    apt.studentName,
    apt.period || '-',
    // ... outras colunas
    apt.novoCampo || '-' // Adicione aqui
  ];
});
```

3. Configure a largura da coluna em `columnStyles`:

```typescript
columnStyles: {
  // ... outras colunas
  9: { cellWidth: 30, halign: 'center' }, // Nova coluna (índice 9)
}
```

### Alterar Cores da Tabela

Modifique os estilos em `autoTable`:

```typescript
// Cabeçalho da tabela
headStyles: {
  fillColor: [59, 130, 246], // RGB - Azul atual
  textColor: [255, 255, 255], // Branco
  fontStyle: 'bold',
  fontSize: 9,
  halign: 'center'
},

// Linhas alternadas
alternateRowStyles: {
  fillColor: [248, 249, 250] // Cinza claro
},
```

**Cores sugeridas:**
- Azul corporativo: `[59, 130, 246]`
- Verde: `[34, 197, 94]`
- Vermelho: `[239, 68, 68]`
- Roxo: `[139, 92, 246]`

### Alterar Orientação da Página

```typescript
const doc = new jsPDF({
  orientation: 'portrait', // ou 'landscape'
  unit: 'mm',
  format: 'a4'
});
```

### Alterar Tamanho da Página

```typescript
format: 'a4'     // Padrão
format: 'letter' // Carta (US)
format: 'legal'  // Ofício
format: [width, height] // Personalizado em mm
```

### Adicionar Mais Informações ao Cabeçalho

Após a linha separadora, você pode adicionar mais informações:

```typescript
// Adicionar telefone/email
doc.setFontSize(10);
doc.text('Tel: (87) 3831-0000 | email@fvp.edu.br', margin, 35);
```

### Alterar Posição da Logo

```typescript
const logoWidth = 25;  // Largura em mm
const logoHeight = 25; // Altura em mm
const logoX = margin;  // Posição X (horizontal)
const logoY = 10;      // Posição Y (vertical)

doc.addImage(logoFVP, 'JPEG', logoX, logoY, logoWidth, logoHeight);
```

---

## 🎨 Estrutura do PDF Gerado

```
┌─────────────────────────────────────────────────────────────┐
│  [LOGO]  Faculdade Vale do Pajeú                            │
│          São José do Egito - PE                             │
├─────────────────────────────────────────────────────────────┤
│  Relatório de Agendamentos          Gerado em: DD/MM/AAAA   │
│  Filtros aplicados: ...                                     │
│  Total de registros: XX                                     │
├─────────────────────────────────────────────────────────────┤
│  Aluno | Período | Coordenação | Data | ... | Anotações     │
│  ─────────────────────────────────────────────────────────  │
│  Dados da tabela...                                         │
│  ...                                                        │
├─────────────────────────────────────────────────────────────┤
│  © 2025 Faculdade Vale do Pajeú    Página X de Y            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🐛 Solução de Problemas

### Logo não aparece no PDF

1. Verifique se o arquivo existe em `src/assets/logo-fvp.jpg`
2. Verifique se o formato é JPEG ou PNG
3. Tente usar um caminho absoluto ou base64

### Tabela cortada

1. Mude a orientação para `landscape`
2. Reduza o tamanho da fonte em `bodyStyles`
3. Ajuste as larguras das colunas em `columnStyles`

### Caracteres especiais não aparecem

O jsPDF suporta UTF-8 nativamente, mas alguns caracteres podem precisar de fontes customizadas.

---

## 📁 Arquivos Modificados

| Arquivo | Descrição |
|---------|-----------|
| `src/pages/CoordenacaoGeral.tsx` | Componente principal com a lógica de exportação |
| `package.json` | Dependências jspdf e jspdf-autotable adicionadas |

---

## 📝 Exemplo de Uso

```typescript
// O PDF é gerado automaticamente ao clicar no botão
// Os filtros ativos são aplicados aos dados exportados

// Para exportar programaticamente:
exportToPDF();
```

---

## 🔗 Referências

- [jsPDF Documentação](https://github.com/parallax/jsPDF)
- [jspdf-autotable Documentação](https://github.com/simonbengtsson/jsPDF-AutoTable)

---

*Última atualização: Janeiro 2026*
*Desenvolvido por Caio Braga*
