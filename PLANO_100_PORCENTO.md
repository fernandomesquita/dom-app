# 🎯 PLANO DE AÇÃO: CHEGAR A 100%

## Estratégia: Estabilidade + Metas & Planos

**Foco principal:** Garantir que os módulos de Metas e Planos (núcleo da plataforma) estejam 100% estáveis e funcionais antes de adicionar novos recursos.

---

## 🔴 PRIORIDADE CRÍTICA (Estabilidade do Sistema)
**Tempo estimado: 4-6 horas**

### 1. Corrigir Bugs Críticos de Metas e Planos (2h)
**Por quê:** Bugs impedem uso correto dos recursos principais

- [ ] **Bug #7: Cards de metas quebram layout no mobile** (45min)
  - Testar visualização em diferentes resoluções
  - Ajustar grid responsivo (1-2-3-4-5-6-7 colunas)
  - Garantir que texto não transborde
  - Testar em dispositivos reais (Chrome DevTools)

- [ ] **Bug: Redistribuição de metas não persiste configurações** (30min)
  - Salvar horasDiarias e diasSemana no banco (tabela matriculas)
  - Carregar configurações salvas ao abrir página Plano
  - Aplicar configurações na redistribuição automática

- [ ] **Bug: Dials de tempo não atualizam visualmente após redistribuir** (15min)
  - Forçar refetch após mutation redistribuir
  - Sincronizar estado local com backend

- [ ] **Bug: Filtros de tipo/disciplina afetam progresso da semana** (30min)
  - Já corrigido, mas validar em produção
  - Adicionar testes para garantir consistência

### 2. Validações e Tratamento de Erros (1.5h)
**Por quê:** Prevenir estados inconsistentes e melhorar experiência

- [ ] **Validação de formulários de metas** (30min)
  - Impedir criar meta sem plano selecionado
  - Validar duração mínima (15min) e máxima (4h)
  - Validar campos obrigatórios (disciplina, assunto)
  - Mensagens de erro claras e específicas

- [ ] **Validação de formulários de planos** (20min)
  - Impedir criar plano sem nome/órgão/cargo
  - Validar duração mínima (7 dias) e máxima (365 dias)
  - Validar horas diárias (1h-12h)

- [ ] **Tratamento de erros em mutations** (40min)
  - Adicionar try/catch em todas as mutations críticas
  - Mostrar toast de erro com mensagem descritiva
  - Rollback de estado em caso de falha
  - Log de erros no console para debug

### 3. Testes de Integração Metas ↔ Planos (1h)
**Por quê:** Garantir que o fluxo completo funciona sem falhas

- [ ] **Teste: Criar plano → Criar metas → Atribuir a aluno** (20min)
  - Validar que metas aparecem corretamente
  - Verificar distribuição automática
  - Confirmar datas agendadas corretas

- [ ] **Teste: Editar meta → Redistribuir → Verificar consistência** (20min)
  - Alterar duração de meta
  - Verificar se redistribuição recalcula corretamente
  - Confirmar que não há metas órfãs

- [ ] **Teste: Importar planilha → Verificar metas criadas** (20min)
  - Testar com planilha de exemplo
  - Validar que todas as metas foram importadas
  - Verificar ordem e agendamento

### 4. Performance e Otimização (1.5h)
**Por quê:** Sistema lento = usuários frustrados

- [ ] **Otimizar query getMetasAluno** (30min)
  - Adicionar índices no banco (userId, planoId, dataAgendada)
  - Limitar resultados (paginação ou lazy loading)
  - Cache de metas da semana atual

- [ ] **Otimizar query getDadosAluno (painel individual)** (30min)
  - Reduzir número de joins
  - Cache de estatísticas (atualizar a cada 5min)

- [ ] **Lazy loading de componentes pesados** (30min)
  - ReactQuill (editor rich text)
  - Recharts (gráficos)
  - Modal de gestão de metas

---

## 🟠 PRIORIDADE ALTA (Completar Recursos Principais)
**Tempo estimado: 6-8 horas**

### 5. Finalizar Sistema de Aulas (3h)
**Por quê:** Aulas vinculadas às metas precisam funcionar 100%

- [ ] **Componente Player de Vídeo Completo** (1.5h)
  - Integrar iframe Vimeo/YouTube
  - Controles: play, pause, volume, fullscreen
  - Barra de progresso clicável
  - Salvamento automático a cada 10s
  - Retomar do ponto onde parou

- [ ] **Painel de Anotações Lateral** (1h)
  - Lista de anotações ordenadas por timestamp
  - Botão "+" para adicionar anotação no tempo atual
  - Click na anotação → pula para timestamp
  - Editar/deletar anotações inline

- [ ] **Integração Metas ↔ Aulas** (30min)
  - Botão "Assistir Aula" no MetaModal
  - Redirecionar para player com aula vinculada
  - Marcar meta como concluída ao terminar aula (opcional)

### 6. Painel Administrativo de Questões (2h)
**Por quê:** Professores precisam gerenciar banco de questões

- [ ] **Componente GestaoQuestoes** (1h)
  - Listagem em tabela com paginação
  - Filtros: disciplina, banca, dificuldade, ano
  - Busca por texto (enunciado/assunto)
  - Botões: Criar, Editar, Deletar, Ver Lixeira

- [ ] **Modal de Criar/Editar Questão** (1h)
  - Formulário completo: enunciado, alternativas, gabarito
  - Campos: disciplina, banca, ano, dificuldade, assunto
  - Editor rich text para enunciado e explicação
  - Upload de imagem (opcional)
  - Validações: mínimo 2 alternativas, gabarito obrigatório

### 7. Página de Estatísticas de Questões (1.5h)
**Por quê:** Alunos precisam acompanhar evolução

- [ ] **Componente EstatisticasQuestoes** (1h)
  - Cards: total respondidas, taxa de acerto geral, streak atual
  - Gráfico de barras: desempenho por disciplina (Recharts)
  - Gráfico de linhas: evolução temporal (últimos 30 dias)
  - Tabela: questões mais erradas (para revisar)

- [ ] **Integração com Dashboard** (30min)
  - Card "Ver Estatísticas Completas" no dashboard
  - Link direto para /questoes/estatisticas

### 8. Sistema de Conquistas Visível (1.5h)
**Por quê:** Gamificação só funciona se usuário vê progresso

- [ ] **Componente ModalConquistas** (45min)
  - Grid de todas as 13 conquistas
  - Desbloqueadas: coloridas + ícone + descrição
  - Bloqueadas: cinza + "???" + critério para desbloquear
  - Barra de progresso para próxima conquista

- [ ] **Página /conquistas** (45min)
  - Listagem completa com filtros (desbloqueadas/bloqueadas)
  - Seção "Próximas a Desbloquear" com dicas
  - Histórico de conquistas (data de desbloqueio)
  - Botão compartilhar conquista (futuro)

---

## 🟡 PRIORIDADE MÉDIA (Melhorar Experiência)
**Tempo estimado: 4-5 horas**

### 9. Responsividade Mobile Completa (2h)
**Por quê:** Muitos alunos estudam pelo celular

- [ ] **Página Plano (mobile)** (45min)
  - Tabs empilhadas verticalmente
  - Cards de metas em 1 coluna
  - Dials de tempo maiores e mais clicáveis
  - Modal de detalhes em fullscreen

- [ ] **Dashboard (mobile)** (30min)
  - Cards empilhados (1 coluna)
  - Gráfico responsivo (altura ajustável)
  - Menu lateral colapsável por padrão

- [ ] **Fórum (mobile)** (30min)
  - Lista de tópicos em 1 coluna
  - Botões de ação menores
  - Editor de resposta em fullscreen

- [ ] **Painel Admin (mobile)** (15min)
  - Já tem dropdown, mas testar todas as tabs
  - Garantir que tabelas têm scroll horizontal

### 10. Preferências de Notificações (1h)
**Por quê:** Usuários precisam controlar o que recebem

- [ ] **Página /configuracoes/notificacoes** (45min)
  - Lista de tipos de notificação com toggle on/off
  - Escolher canal: in-app, email (futuro: push)
  - Horário de silêncio (não enviar das 22h às 7h)
  - Botão "Salvar Preferências"

- [ ] **Backend: salvar e aplicar preferências** (15min)
  - Verificar preferências antes de criar notificação
  - Respeitar horário de silêncio

### 11. Relatório de Progresso Individual (PDF) (2h)
**Por quê:** Alunos e mentores precisam de relatórios formais

- [ ] **Componente GerarRelatorioPDF** (1.5h)
  - Biblioteca: jsPDF ou react-pdf
  - Seções: dados do aluno, plano atual, metas concluídas
  - Gráfico de progresso semanal (imagem)
  - Estatísticas de questões
  - Conquistas desbloqueadas
  - Período customizável (última semana/mês/trimestre)

- [ ] **Botão no Dashboard e Painel Admin** (30min)
  - Dashboard: "Baixar Meu Relatório"
  - Admin: "Baixar Relatório do Aluno X"

---

## 🟢 PRIORIDADE BAIXA (Refinamentos)
**Tempo estimado: 3-4 horas**

### 12. Melhorias de UX/UI (2h)

- [ ] **Skeleton loaders** (30min)
  - Substituir spinners por skeletons
  - Aplicar em: listagem de metas, dashboard, questões

- [ ] **Animações suaves** (30min)
  - Transições de página (fade in/out)
  - Hover effects nos cards
  - Animação ao desbloquear conquista (confete)

- [ ] **Tooltips explicativos** (30min)
  - Adicionar tooltips em ícones e botões
  - Explicar funcionalidades complexas
  - Atalhos de teclado

- [ ] **Onboarding para novos usuários** (30min)
  - Tour guiado na primeira visita
  - Biblioteca: react-joyride ou intro.js
  - Destacar: criar meta, assistir aula, resolver questão

### 13. Testes Automatizados (1-2h)

- [ ] **Testes unitários (Vitest)** (1h)
  - Testar funções críticas do db.ts
  - Testar helpers (detectarLinks, detectarMencoes)
  - Testar cálculos (distribuirMetasPlano)

- [ ] **Testes E2E (Playwright - opcional)** (1h)
  - Fluxo: login → criar meta → concluir meta
  - Fluxo: importar planilha → verificar metas
  - Fluxo: responder questão → verificar conquista

---

## 📊 RESUMO QUANTITATIVO

| Prioridade | Tarefas | Tempo Estimado | Impacto |
|------------|---------|----------------|---------|
| 🔴 Crítica | 4 grupos (15 itens) | 4-6h | **Estabilidade do sistema** |
| 🟠 Alta | 4 grupos (12 itens) | 6-8h | **Completar recursos principais** |
| 🟡 Média | 3 grupos (8 itens) | 4-5h | **Melhorar experiência** |
| 🟢 Baixa | 2 grupos (6 itens) | 3-4h | **Refinamentos** |
| **TOTAL** | **13 grupos (41 itens)** | **17-23h** | **Sistema 100% completo** |

---

## 🎯 ESTRATÉGIA DE EXECUÇÃO

### Semana 1: Estabilidade (Prioridade Crítica)
**Objetivo:** Sistema estável e sem bugs críticos
- Dias 1-2: Corrigir bugs de metas e planos (4h)
- Dia 3: Validações e tratamento de erros (2h)
- Dia 4: Testes de integração (1h)
- Dia 5: Performance e otimização (2h)

### Semana 2: Completar Recursos (Prioridade Alta)
**Objetivo:** Todos os módulos principais 100% funcionais
- Dias 1-2: Sistema de aulas completo (3h)
- Dia 3: Painel admin de questões (2h)
- Dia 4: Estatísticas de questões (1.5h)
- Dia 5: Sistema de conquistas visível (1.5h)

### Semana 3: Experiência (Prioridade Média)
**Objetivo:** Plataforma polida e profissional
- Dias 1-2: Responsividade mobile (2h)
- Dia 3: Preferências de notificações (1h)
- Dias 4-5: Relatórios em PDF (2h)

### Semana 4: Refinamentos (Prioridade Baixa - Opcional)
**Objetivo:** Detalhes que encantam
- Dias 1-2: Melhorias de UX/UI (2h)
- Dias 3-4: Testes automatizados (2h)

---

## 🚀 PRÓXIMA AÇÃO RECOMENDADA

**Começar por:** 🔴 **Prioridade Crítica - Item 1**
- Corrigir Bug #7 (cards de metas no mobile)
- Tempo: 45 minutos
- Impacto: Alto (muitos usuários acessam por celular)

Quer que eu comece agora pela **Prioridade Crítica**?
