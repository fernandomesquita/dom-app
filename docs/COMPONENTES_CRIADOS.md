# 🧩 Componentes Criados - DOM-APP

**Documentação Completa de Páginas e Componentes**  
**Versão:** 1.0.0  
**Data:** 31 de outubro de 2025

---

## 📋 **Índice**

1. [Páginas (23)](#páginas)
2. [Componentes Reutilizáveis (28)](#componentes-reutilizáveis)
3. [Layouts](#layouts)
4. [Hooks Personalizados](#hooks-personalizados)
5. [Utilitários](#utilitários)
6. [Dependências entre Componentes](#dependências-entre-componentes)

---

## 📄 **Páginas**

### **1. Home.tsx**
**Rota:** `/`  
**Descrição:** Página inicial do sistema  
**Acesso:** Público  
**Componentes usados:** Button, Card, Streamdown  
**Funcionalidades:**
- Apresentação do sistema
- Botões de login/cadastro
- Informações sobre a plataforma

---

### **2. Login.tsx**
**Rota:** `/login`  
**Descrição:** Página de login  
**Acesso:** Público  
**Componentes usados:** Input, Button, Card  
**Funcionalidades:**
- Login com OAuth (Manus)
- Login com email/senha
- Link para recuperação de senha
- Link para cadastro

**APIs usadas:**
- `authentication.loginWithPassword`

---

### **3. Cadastro.tsx**
**Rota:** `/cadastro`  
**Descrição:** Página de registro de novos usuários  
**Acesso:** Público  
**Componentes usados:** Input, Button, Checkbox, Card  
**Funcionalidades:**
- Formulário completo de cadastro
- Validação de campos (nome, email, CPF, telefone)
- Aceite de termos de uso
- Criação de senha

**APIs usadas:**
- `authentication.register`

---

### **4. VerificarEmail.tsx**
**Rota:** `/verificar-email/:token`  
**Descrição:** Verificação de email após cadastro  
**Acesso:** Público  
**Funcionalidades:**
- Verificação automática via token
- Feedback de sucesso/erro
- Redirecionamento para login

**APIs usadas:**
- `authentication.verifyEmail`

---

### **5. RecuperarSenha.tsx**
**Rota:** `/recuperar-senha`  
**Descrição:** Solicitação de reset de senha  
**Acesso:** Público  
**Componentes usados:** Input, Button, Card  
**Funcionalidades:**
- Formulário de email
- Envio de token de reset

**APIs usadas:**
- `authentication.forgotPassword`

---

### **6. RedefinirSenha.tsx**
**Rota:** `/redefinir-senha/:token`  
**Descrição:** Redefinição de senha com token  
**Acesso:** Público  
**Componentes usados:** Input, Button, Card  
**Funcionalidades:**
- Formulário de nova senha
- Validação de senha forte
- Confirmação de senha

**APIs usadas:**
- `authentication.resetPassword`

---

### **7. Dashboard.tsx**
**Rota:** `/dashboard`  
**Descrição:** Dashboard principal do aluno  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:**
- GraficoProgressoSemanal
- GamificacaoCard
- NotificacoesForumCard
- ConquistasRecentes
- Card, Progress, Badge

**Funcionalidades:**
- Estatísticas em tempo real
- Gráfico de progresso semanal
- Card de progresso no plano
- Ranking geral
- Conquistas recentes
- Acesso rápido aos módulos
- Sistema "Visualizar como" (admin)

**APIs usadas:**
- `dashboard.estatisticas`
- `dashboard.progressoSemanal`
- `gamificacao.ranking`
- `gamificacao.minhasConquistas`

---

### **8. Plano.tsx**
**Rota:** `/plano`  
**Descrição:** Página de visualização e gestão de metas  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:**
- MetaModal
- ConfigurarCronogramaModal
- MetaAMeta
- ConquistaToast
- Slider, Tabs, Badge, Progress

**Funcionalidades:**
- 3 visualizações: Calendário, Meta a Meta, Lista
- Cronômetro integrado
- Dials de ajuste de tempo
- Filtros por disciplina e tipo
- Barra de progresso semanal
- Configuração de cronograma
- Sistema de anotações
- Marcação de metas concluídas
- Notificações de conquistas

**APIs usadas:**
- `metas.minhasMetas`
- `metas.concluir`
- `metas.salvarAnotacao`
- `metas.redistribuir`
- `metas.atualizarConfiguracoes`

---

### **9. AnotacoesMeta.tsx**
**Rota:** `/anotacoes`  
**Descrição:** Página de anotações de metas  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:** Card, Input, Button, Badge  
**Funcionalidades:**
- Listagem de metas com anotações
- Busca por texto
- Filtro por disciplina
- Navegação para meta específica
- Exibição de data/horário da anotação

**APIs usadas:**
- `metas.minhasAnotacoes`

---

### **10. Aulas.tsx**
**Rota:** `/aulas`  
**Descrição:** Repositório de videoaulas  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:** Card, Input, Select, Badge, Progress  
**Funcionalidades:**
- Listagem de aulas
- Filtros por disciplina e módulo
- Busca por título
- Exibição de progresso
- Navegação para player

**APIs usadas:**
- `aulas.list`
- `aulas.meusProgressos`

---

### **11. AulaView.tsx**
**Rota:** `/aulas/:id`  
**Descrição:** Player de vídeo com anotações  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:**
- ReactPlayer
- Card, Input, Button, Badge

**Funcionalidades:**
- Player de vídeo (Vimeo/YouTube)
- Anotações com timestamp
- Salvamento automático de progresso
- Marcação como concluída
- Materiais de apoio
- Tópicos abordados

**APIs usadas:**
- `aulas.getById`
- `aulas.salvarProgresso`
- `aulas.marcarConcluida`
- `aulas.criarAnotacao`
- `aulas.listarAnotacoes`

---

### **12. Materiais.tsx**
**Rota:** `/materiais`  
**Descrição:** Repositório de PDFs e documentos  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:** Card, Input, Select, Badge, Button  
**Funcionalidades:**
- Listagem de materiais
- Upload de PDFs (professor/mentor/admin)
- Filtros por tipo e disciplina
- Busca por título
- Sistema de favoritos
- Visualização e download

**APIs usadas:**
- `materiais.list`
- `materiais.create`
- `materiais.delete`

---

### **13. Questoes.tsx**
**Rota:** `/questoes`  
**Descrição:** Banco de questões (listagem)  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:** Card, Input, Select, Badge  
**Funcionalidades:**
- Listagem de questões
- Filtros avançados (disciplina, banca, dificuldade, ano)
- Busca por enunciado
- Navegação para resolução
- Estatísticas gerais

**APIs usadas:**
- `questoes.list`
- `questoes.estatisticas`

---

### **14. ResolverQuestoes.tsx**
**Rota:** `/questoes/resolver`  
**Descrição:** Resolução de questões  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:**
- ConquistaToast
- Card, Button, Badge, Progress

**Funcionalidades:**
- Resolução individual de questões
- Feedback imediato (verde/vermelho)
- Gabarito e comentário
- Navegação entre questões
- Timer de resolução
- Notificações de conquistas

**APIs usadas:**
- `questoes.list`
- `questoes.responder`

---

### **15. EstatisticasQuestoes.tsx**
**Rota:** `/questoes/estatisticas`  
**Descrição:** Estatísticas detalhadas de questões  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:**
- Recharts (BarChart, PieChart, LineChart)
- Card, Badge

**Funcionalidades:**
- Gráficos de desempenho
- Estatísticas por disciplina
- Evolução temporal
- Questões mais erradas
- Taxa de acerto geral

**APIs usadas:**
- `questoes.estatisticas`
- `questoes.estatisticasPorDisciplina`
- `questoes.evolucaoTemporal`
- `questoes.questoesMaisErradas`

---

### **16. Forum.tsx**
**Rota:** `/forum`  
**Descrição:** Fórum de dúvidas  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:** Card, Input, Select, Badge, Button, Textarea  
**Funcionalidades:**
- Listagem de tópicos
- Criação de tópicos
- Filtros por categoria e disciplina
- Busca por título
- Ordenação (recentes, populares, respondidos)
- Curtidas
- Marcação de melhor resposta
- Moderação (fixar, fechar)

**APIs usadas:**
- `forum.listTopicos`
- `forum.criarTopico`
- `forum.criarResposta`
- `forum.curtir`
- `forum.marcarMelhorResposta`
- `forum.fixarTopico`
- `forum.fecharTopico`

---

### **17. Revisao.tsx**
**Rota:** `/revisao`  
**Descrição:** Sistema de revisão inteligente  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:** Card, Badge, Calendar, Button  
**Funcionalidades:**
- Calendário de revisões
- Revisões de hoje (destaque)
- Próximas revisões
- Algoritmo de Spaced Repetition
- Marcação de revisão concluída
- Opção de adiar
- Estatísticas de cumprimento

**APIs usadas:**
- `questoes.getQuestoesParaRevisar`
- `questoes.marcarRevisada`

---

### **18. Conquistas.tsx**
**Rota:** `/conquistas`  
**Descrição:** Página de conquistas e badges  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:** ConquistaBadge, Card, Progress  
**Funcionalidades:**
- Listagem de todas as conquistas
- Conquistas desbloqueadas (destaque)
- Conquistas bloqueadas (opacidade)
- Progresso para próximas conquistas
- Badges visuais com ícones

**APIs usadas:**
- `gamificacao.minhasConquistas`

---

### **19. Notificacoes.tsx**
**Rota:** `/notificacoes`  
**Descrição:** Central de notificações  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:** Card, Badge, Button  
**Funcionalidades:**
- Listagem de notificações
- Badges coloridos por tipo
- Badges de role (Master, Mentor, etc)
- Botão dispensar
- Marcação como lida
- Navegação para origem

**APIs usadas:**
- `notificacoes.minhas`
- `notificacoes.marcarLida`

---

### **20. Perfil.tsx**
**Rota:** `/perfil`  
**Descrição:** Perfil do usuário  
**Acesso:** Protegido (aluno)  
**Layout:** DOMLayout  
**Componentes usados:** Input, Textarea, Button, Card  
**Funcionalidades:**
- Edição de dados pessoais
- Upload de foto
- Alteração de senha
- Preferências de notificação

**APIs usadas:**
- `authentication.updateProfile`

---

### **21. Admin.tsx**
**Rota:** `/admin`  
**Descrição:** Painel administrativo completo  
**Acesso:** Protegido (master/mentor/administrativo/professor)  
**Layout:** DOMLayout  
**Componentes usados:**
- GestaoUsuarios
- GestaoPlanos
- GestaoMetas
- GestaoQuestoes
- GestaoBugs
- Tabs, Card, Table, Dialog

**Funcionalidades:**
- 9 tabs de gestão:
  1. Usuários
  2. Planos
  3. Metas
  4. Aulas
  5. Questões
  6. Avisos
  7. Relatórios
  8. Configurações
  9. Bugs
- Navegação responsiva (dropdown em mobile)
- Permissões diferenciadas por role

**APIs usadas:** (múltiplas - ver seção de APIs)

---

### **22. ComponentShowcase.tsx**
**Rota:** `/showcase`  
**Descrição:** Showcase de componentes UI  
**Acesso:** Desenvolvimento  
**Componentes usados:** Todos os componentes shadcn/ui  
**Funcionalidades:**
- Demonstração de componentes
- Exemplos de uso
- Testes visuais

---

### **23. NotFound.tsx**
**Rota:** `*` (fallback)  
**Descrição:** Página 404  
**Acesso:** Público  
**Componentes usados:** Button, Card  
**Funcionalidades:**
- Mensagem de erro
- Botão para voltar ao dashboard

---

## 🧩 **Componentes Reutilizáveis**

### **1. DOMLayout.tsx**
**Descrição:** Layout principal da aplicação  
**Props:**
```typescript
{
  children: ReactNode;
}
```
**Funcionalidades:**
- Sidebar colapsável
- Header com notificações
- Footer com versionamento
- Breadcrumb automático
- Menu lateral dinâmico
- Controle de funcionalidades (Questões, Fórum, Materiais)

**Usado em:** Todas as páginas protegidas

---

### **2. DashboardLayout.tsx**
**Descrição:** Layout para painéis administrativos  
**Props:**
```typescript
{
  children: ReactNode;
  title?: string;
}
```
**Funcionalidades:**
- Sidebar fixa
- Header com título
- Navegação administrativa

**Usado em:** Admin.tsx

---

### **3. MetaModal.tsx**
**Descrição:** Modal de detalhes da meta  
**Props:**
```typescript
{
  meta: Meta;
  onClose: () => void;
  onConcluir: (tempoDedicado: number) => void;
}
```
**Funcionalidades:**
- Exibição completa da meta
- Cronômetro integrado (TimerEstudo)
- Ajuste rápido de tempo (+/-5 min, +15 min)
- Navegação para aulas/questões/materiais
- Dica de estudo
- Orientações (HTML rich text)
- Anotações do aluno
- Botão de conclusão

**Usado em:** Plano.tsx

---

### **4. EditarMetaModal.tsx**
**Descrição:** Modal de edição de meta (admin)  
**Props:**
```typescript
{
  meta: Meta;
  planoId: number;
  onClose: () => void;
  onSave: (meta: Meta) => void;
}
```
**Funcionalidades:**
- Formulário completo de edição
- Editor rich text (TipTap)
- Seletor de aula vinculada
- Vinculação de questões
- Validação de campos

**Usado em:** Admin.tsx (GestaoMetas)

---

### **5. ConfigurarCronogramaModal.tsx**
**Descrição:** Modal de configuração de cronograma  
**Props:**
```typescript
{
  onClose: () => void;
  onSave: (config: ConfigCronograma) => void;
}
```
**Funcionalidades:**
- Seleção de horas diárias (1-12h)
- Seleção de dias da semana (7 switches)
- Data de início (calendar)
- Sistema de pausas/férias
- Cálculo de total semanal
- Validações
- Botão restaurar padrão

**Usado em:** Plano.tsx

---

### **6. MetaAMeta.tsx**
**Descrição:** Visualização meta a meta  
**Props:**
```typescript
{
  metas: Array<Meta>;
  onMetaClick: (meta: Meta) => void;
}
```
**Funcionalidades:**
- Cards numerados
- Linha de progressão
- Prévias de metas adjacentes (fade)
- Barra de progresso geral
- Contadores de metas do dia/semana
- Navegação por botões e teclado
- Persistência de posição

**Usado em:** Plano.tsx

---

### **7. TimerEstudo.tsx**
**Descrição:** Cronômetro de estudo  
**Props:**
```typescript
{
  duracao: number; // em minutos
  onComplete: () => void;
}
```
**Funcionalidades:**
- Contagem regressiva
- Play/Pause/Reset
- Barra de progresso
- Modal de conclusão
- Notificação sonora (opcional)

**Usado em:** MetaModal.tsx

---

### **8. ConquistaToast.tsx**
**Descrição:** Toast de conquista desbloqueada  
**Props:**
```typescript
{
  conquistas: Array<Conquista>;
  onClose: () => void;
}
```
**Funcionalidades:**
- Toast animado com gradiente
- Animação bounce no ícone
- Auto-fechar após 5s
- Fila de notificações
- Indicadores de progresso

**Usado em:** Plano.tsx, ResolverQuestoes.tsx, AulaView.tsx

---

### **9. ConquistaBadge.tsx**
**Descrição:** Badge de conquista  
**Props:**
```typescript
{
  conquista: Conquista;
  desbloqueada: boolean;
}
```
**Funcionalidades:**
- Ícone grande
- Nome e descrição
- Opacidade se bloqueada
- Animação hover

**Usado em:** Conquistas.tsx, Dashboard.tsx

---

### **10. ConquistasRecentes.tsx**
**Descrição:** Card de conquistas recentes  
**Props:**
```typescript
{
  conquistas: Array<Conquista>;
}
```
**Funcionalidades:**
- Listagem de últimas 3 conquistas
- Badges visuais
- Link para página completa

**Usado em:** Dashboard.tsx

---

### **11. GamificacaoCard.tsx**
**Descrição:** Card de pontos e ranking  
**Props:**
```typescript
{
  pontos: number;
  ranking: Array<User>;
}
```
**Funcionalidades:**
- Exibição de pontos
- Ranking top 5
- Posição do usuário

**Usado em:** Dashboard.tsx

---

### **12. GraficoProgressoSemanal.tsx**
**Descrição:** Gráfico de progresso dos últimos 7 dias  
**Props:**
```typescript
{
  dados: Array<{
    dia: string;
    horasEstudadas: number;
    metasConcluidas: number;
  }>;
}
```
**Funcionalidades:**
- Gráfico de linhas dual-axis (Recharts)
- Resumo de média diária
- Mensagens motivacionais
- Tooltip customizado

**Usado em:** Dashboard.tsx

---

### **13. CentralNotificacoes.tsx**
**Descrição:** Dropdown de notificações  
**Props:** Nenhuma (usa hooks internos)  
**Funcionalidades:**
- Badge com contador
- Dropdown elegante
- Formatação de datas relativas
- Ícones por tipo
- Navegação ao clicar
- Botão "marcar todas como lidas"

**Usado em:** DOMLayout.tsx

---

### **14. NotificacoesForumCard.tsx**
**Descrição:** Card de notificações do fórum  
**Props:**
```typescript
{
  notificacoes: Array<NotificacaoForum>;
}
```
**Funcionalidades:**
- Badge com contador
- Preview da primeira notificação
- Nome e role de quem respondeu
- Botão "X" para dispensar
- Indicador "+ N outras"

**Usado em:** Dashboard.tsx

---

### **15. RichTextEditor.tsx**
**Descrição:** Editor rich text com TipTap  
**Props:**
```typescript
{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```
**Funcionalidades:**
- Toolbar completo
- Negrito, itálico, sublinhado
- Listas ordenadas e não ordenadas
- Headings (H1-H3)
- Links
- Código
- Blockquotes
- Output HTML

**Usado em:** EditarMetaModal.tsx, Admin.tsx

---

### **16. CronogramaAprimorado.tsx**
**Descrição:** Visualização de calendário semanal  
**Props:**
```typescript
{
  metas: Array<Meta>;
  onMetaClick: (meta: Meta) => void;
}
```
**Funcionalidades:**
- Grid de 7 dias
- Cards de metas por dia
- Dials de ajuste de tempo
- Barra de progresso semanal
- Indicadores de incidência
- Checkbox de conclusão

**Usado em:** Plano.tsx

---

### **17. BotaoReportarBug.tsx**
**Descrição:** Botão flutuante de reporte de bugs  
**Props:** Nenhuma  
**Funcionalidades:**
- Botão fixo no canto inferior direito
- Abre modal de reporte
- Ícone de bug

**Usado em:** DOMLayout.tsx

---

### **18. ReportarBugModal.tsx**
**Descrição:** Modal de reporte de bugs  
**Props:**
```typescript
{
  onClose: () => void;
}
```
**Funcionalidades:**
- Formulário de reporte
- Upload de screenshot
- Detecção automática de página
- Validação de campos

**Usado em:** BotaoReportarBug.tsx

---

### **19. MensagemPosPlanoModal.tsx**
**Descrição:** Modal de mensagem pós-conclusão  
**Props:**
```typescript
{
  plano: Plano;
  onClose: () => void;
}
```
**Funcionalidades:**
- Design atraente com gradiente
- Renderização de HTML rich text
- Botão "Acessar Link" (se configurado)
- Exibição automática após última meta

**Usado em:** Plano.tsx

---

### **20. GestaoUsuarios.tsx**
**Descrição:** Componente de gestão de usuários  
**Props:** Nenhuma (admin)  
**Funcionalidades:**
- Listagem em tabela
- Busca por nome/email
- Criação de usuários
- Seleção de perfil
- Badges coloridos por perfil
- Botões de edição e exclusão

**Usado em:** Admin.tsx

---

### **21. GestaoPlanos.tsx**
**Descrição:** Componente de gestão de planos  
**Props:** Nenhuma (admin)  
**Funcionalidades:**
- Listagem em cards
- Filtros (órgão, cargo, tipo, status, data)
- Criação manual
- Importação via planilha
- Download de template
- Botões de ação (Editar, Metas, Excluir)
- Toggle ativo/inativo
- Estatísticas (alunos, metas)

**Usado em:** Admin.tsx

---

### **22. GestaoMetas.tsx**
**Descrição:** Componente de gestão de metas  
**Props:**
```typescript
{
  planoId: number;
}
```
**Funcionalidades:**
- Listagem em cards
- Indicador de ordem (#1, #2, #3...)
- Badges coloridos por tipo
- Botões de reordenação (↑↓)
- Criação/edição de metas
- Editor rich text para orientações
- Seletor de aula vinculada
- Vinculação de questões

**Usado em:** Admin.tsx (via GestaoPlanos)

---

### **23. GestaoQuestoes.tsx**
**Descrição:** Componente de gestão de questões  
**Props:** Nenhuma (admin)  
**Funcionalidades:**
- Listagem em tabela
- Filtros avançados
- Criação manual
- Importação em lote
- Seletor de tipo (múltipla escolha vs certo/errado)
- Alternativas dinâmicas
- Lixeira

**Usado em:** Admin.tsx

---

### **24. GestaoBugs.tsx**
**Descrição:** Componente de gestão de bugs  
**Props:** Nenhuma (admin)  
**Funcionalidades:**
- Listagem de bugs reportados
- Filtros por status
- Visualização de screenshots
- Marcação como resolvido

**Usado em:** Admin.tsx

---

### **25. UserBadge.tsx**
**Descrição:** Badge de perfil do usuário  
**Props:**
```typescript
{
  role: "aluno" | "professor" | "administrativo" | "mentor" | "master";
}
```
**Funcionalidades:**
- Badge colorido por role
- Ícone específico
- Texto do role

**Usado em:** Forum.tsx, Notificacoes.tsx

---

### **26. Breadcrumb.tsx**
**Descrição:** Breadcrumb de navegação  
**Props:**
```typescript
{
  items: Array<{ label: string, href?: string }>;
}
```
**Funcionalidades:**
- Navegação hierárquica
- Links clicáveis
- Separadores automáticos

**Usado em:** DOMLayout.tsx

---

### **27. Footer.tsx**
**Descrição:** Footer do sistema  
**Props:** Nenhuma  
**Funcionalidades:**
- "Desenvolvido por Fernando Mesquita"
- Versionamento (1.0.0)
- Link para Ciclo EARA®

**Usado em:** DOMLayout.tsx

---

### **28. ErrorBoundary.tsx**
**Descrição:** Boundary de erros React  
**Props:**
```typescript
{
  children: ReactNode;
}
```
**Funcionalidades:**
- Captura de erros
- Exibição de mensagem amigável
- Botão de reload

**Usado em:** App.tsx

---

## 🎨 **Layouts**

### **DOMLayout**
**Usado por:** 19 páginas (Dashboard, Plano, Aulas, etc)  
**Estrutura:**
- Sidebar colapsável (esquerda)
- Header com notificações (topo)
- Breadcrumb (abaixo do header)
- Conteúdo principal (centro)
- Footer (rodapé)

### **DashboardLayout**
**Usado por:** Admin.tsx  
**Estrutura:**
- Sidebar fixa (esquerda)
- Header com título (topo)
- Tabs de navegação
- Conteúdo principal (centro)

---

## 🪝 **Hooks Personalizados**

### **useAuth()**
**Arquivo:** `client/src/_core/hooks/useAuth.ts`  
**Retorno:**
```typescript
{
  user: User | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  logout: () => void;
}
```
**Usado em:** Todas as páginas protegidas

---

### **useConquistaNotification()**
**Arquivo:** `client/src/hooks/useConquistaNotification.ts`  
**Retorno:**
```typescript
{
  conquistas: Array<Conquista>;
  mostrarConquistas: (conquistas: Array<Conquista>) => void;
  limparConquistas: () => void;
}
```
**Usado em:** Plano.tsx, ResolverQuestoes.tsx

---

### **useTheme()**
**Arquivo:** `client/src/contexts/ThemeContext.tsx`  
**Retorno:**
```typescript
{
  theme: "light" | "dark";
  toggleTheme: () => void;
}
```
**Usado em:** Componentes que precisam do tema

---

## 🛠️ **Utilitários**

### **getErrorMessage()**
**Arquivo:** `client/src/lib/utils.ts`  
**Descrição:** Extrai mensagem de erro de forma type-safe  
**Uso:**
```typescript
try {
  // ...
} catch (error: unknown) {
  const message = getErrorMessage(error);
  toast.error(message);
}
```

---

### **formatDate()**
**Arquivo:** `client/src/lib/utils.ts`  
**Descrição:** Formata data com date-fns  
**Uso:**
```typescript
formatDate(new Date(), "dd/MM/yyyy");
```

---

### **cn()**
**Arquivo:** `client/src/lib/utils.ts`  
**Descrição:** Merge de classes Tailwind (clsx + tailwind-merge)  
**Uso:**
```typescript
<div className={cn("base-class", condition && "conditional-class")} />
```

---

### **gerarTemplatePlanilha()**
**Arquivo:** `client/src/utils/gerarTemplatePlanilha.ts`  
**Descrição:** Gera template Excel para importação de planos  
**Uso:**
```typescript
gerarTemplatePlanilha(); // Download automático
```

---

## 🔗 **Dependências entre Componentes**

### **Hierarquia de Layouts**
```
App.tsx
├── DOMLayout
│   ├── Dashboard.tsx
│   │   ├── GraficoProgressoSemanal
│   │   ├── GamificacaoCard
│   │   ├── NotificacoesForumCard
│   │   └── ConquistasRecentes
│   ├── Plano.tsx
│   │   ├── MetaModal
│   │   │   └── TimerEstudo
│   │   ├── ConfigurarCronogramaModal
│   │   ├── MetaAMeta
│   │   ├── CronogramaAprimorado
│   │   └── ConquistaToast
│   ├── Aulas.tsx
│   ├── AulaView.tsx
│   │   └── ReactPlayer
│   ├── Materiais.tsx
│   ├── Questoes.tsx
│   ├── ResolverQuestoes.tsx
│   │   └── ConquistaToast
│   ├── EstatisticasQuestoes.tsx
│   │   └── Recharts
│   ├── Forum.tsx
│   │   └── UserBadge
│   ├── Revisao.tsx
│   ├── Conquistas.tsx
│   │   └── ConquistaBadge
│   ├── Notificacoes.tsx
│   │   └── UserBadge
│   ├── Perfil.tsx
│   └── Admin.tsx (DashboardLayout)
│       ├── GestaoUsuarios
│       ├── GestaoPlanos
│       │   └── GestaoMetas
│       │       ├── EditarMetaModal
│       │       └── RichTextEditor
│       ├── GestaoQuestoes
│       └── GestaoBugs
└── Páginas Públicas
    ├── Home.tsx
    ├── Login.tsx
    ├── Cadastro.tsx
    ├── RecuperarSenha.tsx
    ├── RedefinirSenha.tsx
    └── VerificarEmail.tsx
```

---

### **Componentes Globais**
```
DOMLayout
├── Sidebar (colapsável)
├── Header
│   ├── CentralNotificacoes
│   └── BotaoReportarBug
│       └── ReportarBugModal
├── Breadcrumb
├── {children}
└── Footer
```

---

### **Fluxo de Dados**
```
tRPC API
    ↓
useQuery / useMutation
    ↓
Página (state)
    ↓
Componente (props)
    ↓
UI shadcn/ui
```

---

## 📦 **Componentes shadcn/ui Usados**

1. Button
2. Card
3. Input
4. Textarea
5. Select
6. Checkbox
7. Radio
8. Switch
9. Slider
10. Dialog
11. Dropdown
12. Tabs
13. Table
14. Badge
15. Progress
16. Calendar
17. Tooltip
18. Popover
19. Alert
20. Toast (Sonner)
21. ScrollArea
22. Separator
23. Label
24. Avatar

---

## 📊 **Estatísticas**

- **Total de páginas:** 23
- **Total de componentes reutilizáveis:** 28
- **Total de hooks personalizados:** 3
- **Total de utilitários:** 4
- **Total de layouts:** 2
- **Componentes shadcn/ui:** 24
- **Bibliotecas de gráficos:** Recharts
- **Player de vídeo:** React Player
- **Editor rich text:** TipTap
- **Notificações:** Sonner

---

## 🔗 **Links Úteis**

- **shadcn/ui:** https://ui.shadcn.com/
- **Recharts:** https://recharts.org/
- **React Player:** https://github.com/cookpete/react-player
- **TipTap:** https://tiptap.dev/
- **Sonner:** https://sonner.emilkowal.ski/

---

**Documento gerado em:** 31/10/2025  
**Próxima atualização:** Conforme evolução do projeto
