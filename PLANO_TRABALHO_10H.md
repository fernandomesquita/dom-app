# Plano de Trabalho: Sistema de Planos, Dashboard e Metas (10 horas)

**Objetivo**: Tornar plenamente funcional a inclusão de planos, o dashboard dos alunos e o funcionamento completo das metas.

---

## 📋 Fase 1: Gestão de Planos (2h)

### 1.1 Interface de Criação de Planos (1h)
**Objetivo**: Permitir que Master/Administrativo criem planos completos via interface

**Tarefas**:
- [ ] Criar formulário completo de criação de planos no Admin
- [ ] Campos: nome, descrição, data início, data fim, público-alvo, nível
- [ ] Validação de datas (data fim > data início)
- [ ] Integrar com API `planos.create` existente
- [ ] Adicionar preview do plano antes de salvar
- [ ] Toast de sucesso/erro

**Entregável**: Modal funcional de criação de planos na tab "Planos" do Admin

---

### 1.2 Importação de Planos via Planilha (1h)
**Objetivo**: Permitir upload de planilha Excel/CSV com planos e metas

**Tarefas**:
- [ ] Criar componente de upload de arquivo (drag & drop)
- [ ] Parser de planilha Excel (.xlsx) usando biblioteca (xlsx ou papaparse)
- [ ] Validar estrutura da planilha (colunas obrigatórias)
- [ ] Mapear colunas: disciplina, assunto, tipo, duração, incidência, ordem
- [ ] Preview dos dados antes de importar
- [ ] Criar plano + metas em lote via API
- [ ] Relatório de importação (sucessos/erros)

**Formato da Planilha**:
```
| Disciplina | Assunto | Tipo | Duração (min) | Incidência | Ordem |
|------------|---------|------|---------------|------------|-------|
| Dir. Const.| Princ.  | estudo | 90          | alta       | 1     |
```

**Entregável**: Botão "Importar Planilha" funcional na tab Planos do Admin

---

## 📊 Fase 2: Dashboard dos Alunos (3h)

### 2.1 Estatísticas em Tempo Real (1h)
**Objetivo**: Exibir dados reais do progresso do aluno

**Tarefas**:
- [ ] Implementar query `dashboard.estatisticas` no backend
  - Horas estudadas (soma de `tempoGasto` das metas concluídas)
  - Metas concluídas (count de `progressoMetas` onde `concluida = 1`)
  - Aulas assistidas (count de `progressoAulas` onde `concluida = 1`)
  - Questões resolvidas (count de `respostasQuestoes`)
  - Taxa de acerto (média de acertos nas questões)
- [ ] Atualizar cards do Dashboard para consumir dados reais
- [ ] Adicionar animação de loading nos cards
- [ ] Formatar números (1.234 horas, 89% de acerto)

**Entregável**: Cards do Dashboard exibindo dados reais do usuário logado

---

### 2.2 Gráfico de Progresso Semanal (1h)
**Objetivo**: Visualizar progresso dos últimos 7 dias

**Tarefas**:
- [ ] Criar query para buscar progresso dos últimos 7 dias
  - Agrupar por data: horas estudadas, metas concluídas, questões resolvidas
- [ ] Implementar gráfico de linhas com Recharts ou Chart.js
- [ ] Adicionar legenda e tooltips
- [ ] Responsividade mobile
- [ ] Adicionar no card "Seu Progresso Esta Semana"

**Entregável**: Gráfico funcional mostrando evolução diária

---

### 2.3 Ranking e Conquistas (1h)
**Objetivo**: Implementar sistema de gamificação

**Tarefas**:
- [ ] Criar query `dashboard.ranking` (top 10 alunos por pontos)
- [ ] Sistema de pontos:
  - +10 pontos por meta concluída
  - +5 pontos por questão correta
  - +20 pontos por sequência de 7 dias
- [ ] Atualizar card "Ranking Geral" com dados reais
- [ ] Criar conquistas automáticas:
  - 🏆 "Primeira Meta" (1 meta concluída)
  - 🔥 "Sequência de 7 dias"
  - 📚 "100 horas estudadas"
  - ✅ "100 questões resolvidas"
- [ ] Exibir conquistas desbloqueadas no card "Minhas Conquistas"
- [ ] Notificação toast ao desbloquear conquista

**Entregável**: Ranking funcional e sistema de conquistas ativo

---

## 🎯 Fase 3: Funcionamento das Metas (3h)

### 3.1 Atribuição de Planos aos Alunos (1h)
**Objetivo**: Permitir que Admin atribua planos a alunos

**Tarefas**:
- [ ] Criar modal "Atribuir Plano" na tab Usuários do Admin
- [ ] Seletor de plano + seletor de aluno(s)
- [ ] Data de início personalizada
- [ ] Criar registros em `matriculas` (relacionamento aluno-plano)
- [ ] Criar registros em `progressoMetas` para todas as metas do plano
  - Calcular `dataAgendada` baseado na ordem e data início
  - Distribuir metas ao longo dos dias (ex: 2 metas/dia)
- [ ] Notificar aluno via toast/email sobre novo plano

**Entregável**: Alunos podem receber planos atribuídos pelo Admin

---

### 3.2 Visualização e Conclusão de Metas (1h)
**Objetivo**: Alunos podem ver e concluir metas no Dashboard e Plano

**Tarefas**:
- [ ] Página `/plano` exibir metas do plano ativo do aluno
  - Buscar plano ativo via `matriculas` do usuário logado
  - Exibir metas ordenadas por `ordem`
  - Cores por tipo (estudo/revisão/questões)
  - Status visual (pendente, em andamento, concluída)
- [ ] Botão "Concluir Meta" funcional
  - Atualizar `progressoMetas`: `concluida = 1`, `dataConclusao = now()`
  - Registrar `tempoGasto` (input ou timer)
  - Atualizar estatísticas do Dashboard
  - Desbloquear próxima meta
- [ ] Modal de detalhes da meta (dica de estudo, orientações)
- [ ] Integração com visualização "Meta a Meta"

**Entregável**: Alunos podem visualizar e concluir metas do plano

---

### 3.3 Agendamento e Notificações de Metas (1h)
**Objetivo**: Lembrar alunos sobre metas agendadas

**Tarefas**:
- [ ] Criar query `metas.metasDoDia` (metas agendadas para hoje)
- [ ] Exibir "Metas do Dia" no Dashboard (card dedicado)
- [ ] Badge de contador no menu "Plano" (metas pendentes hoje)
- [ ] Notificação no Dashboard quando há metas atrasadas
- [ ] Card "Metas Atrasadas" (opcional, se houver)
- [ ] Sistema de lembretes:
  - Notificação ao abrir Dashboard
  - Badge vermelho no sino (se houver metas atrasadas)

**Entregável**: Alunos são notificados sobre metas do dia e atrasadas

---

## 🔗 Fase 4: Integração e Testes (2h)

### 4.1 Fluxo Completo End-to-End (1h)
**Objetivo**: Testar fluxo completo desde criação até conclusão

**Tarefas**:
- [ ] **Teste 1: Criar Plano Manual**
  - Admin cria plano "Preparação OAB"
  - Adiciona 5 metas manualmente
  - Atribui a 1 aluno
  - Aluno visualiza no Dashboard e Plano
  - Aluno conclui 2 metas
  - Verificar atualização de estatísticas
- [ ] **Teste 2: Importar Plano via Planilha**
  - Criar planilha de exemplo com 10 metas
  - Importar via Admin
  - Verificar criação correta no banco
  - Atribuir a aluno
  - Testar visualização
- [ ] **Teste 3: Reordenar Metas**
  - Mover meta #5 para #2
  - Verificar se ordem é respeitada no frontend
  - Verificar agendamento correto
- [ ] **Teste 4: Gamificação**
  - Concluir metas e verificar pontos
  - Desbloquear conquista
  - Verificar ranking

**Entregável**: Documentação de testes e bugs encontrados

---

### 4.2 Correções e Ajustes Finais (1h)
**Objetivo**: Corrigir bugs encontrados e polir UX

**Tarefas**:
- [ ] Corrigir bugs encontrados nos testes
- [ ] Adicionar estados de loading em todas as queries
- [ ] Adicionar estados vazios (empty states)
  - "Nenhum plano ativo" no Dashboard
  - "Nenhuma meta para hoje"
- [ ] Melhorar mensagens de erro
- [ ] Adicionar tooltips explicativos
- [ ] Validar responsividade mobile
- [ ] Testar performance com 100+ metas
- [ ] Adicionar logs de auditoria (quem criou/editou planos)

**Entregável**: Sistema estável e pronto para uso

---

## 📦 Entregáveis Finais

Ao final das 10 horas, o sistema terá:

✅ **Admin pode**:
- Criar planos manualmente ou via planilha
- Adicionar/editar/reordenar metas
- Atribuir planos a alunos
- Visualizar progresso dos alunos

✅ **Alunos podem**:
- Ver plano ativo no Dashboard
- Visualizar metas do dia e da semana
- Concluir metas e registrar tempo
- Ver progresso em gráficos
- Competir no ranking
- Desbloquear conquistas

✅ **Sistema**:
- Notifica sobre metas do dia
- Calcula estatísticas em tempo real
- Respeita ordem personalizada de metas
- Gamificação ativa (pontos e conquistas)

---

## 🛠️ Tecnologias Utilizadas

- **Backend**: tRPC, Drizzle ORM, MySQL
- **Frontend**: React, TypeScript, Tailwind CSS
- **Gráficos**: Recharts ou Chart.js
- **Upload**: react-dropzone
- **Parser**: xlsx ou papaparse
- **Notificações**: sonner (toast)

---

## 📝 Notas Importantes

1. **Prioridade**: Focar primeiro no fluxo básico (criar plano → atribuir → concluir meta)
2. **Dados de Teste**: Criar seed script com planos e metas de exemplo
3. **Documentação**: Atualizar `userGuide.md` com instruções para alunos e admin
4. **Performance**: Indexar campos `userId`, `planoId`, `dataAgendada` no banco
5. **Backup**: Fazer backup do banco antes de testes massivos

---

## ⏱️ Distribuição de Tempo

| Fase | Tempo | Prioridade |
|------|-------|------------|
| Gestão de Planos | 2h | Alta |
| Dashboard dos Alunos | 3h | Alta |
| Funcionamento das Metas | 3h | Crítica |
| Integração e Testes | 2h | Alta |
| **TOTAL** | **10h** | |

---

**Data de Criação**: 29/10/2025  
**Responsável**: Manus AI + Fernando Mesquita  
**Status**: Aguardando aprovação
