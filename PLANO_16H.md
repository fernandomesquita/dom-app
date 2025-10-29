# 📋 PLANO DE TRABALHO - 16 HORAS
## Foco: Backend/Frontend de Metas + Funcionalidades Principais dos Alunos

---

## ⏰ FASE 1: BACKEND DE METAS (3-4 horas)

### 1.1 APIs tRPC para Metas (1.5h)
- [x] Estrutura básica já existe
- [ ] `metas.create` - Criar nova meta
- [ ] `metas.update` - Atualizar meta existente
- [ ] `metas.delete` - Excluir meta
- [ ] `metas.marcarConcluida` - Marcar meta como concluída
- [ ] `metas.ajustarTempo` - Ajustar duração da meta
- [ ] `metas.redistribuir` - Redistribuir metas quando tempo do dia muda
- [ ] `metas.adicionarAnotacao` - Adicionar/editar anotação da meta
- [ ] `metas.vincularAula` - Vincular aula à meta
- [ ] `metas.vincularQuestoes` - Vincular questões à meta

### 1.2 Lógica de Redistribuição Dinâmica (1h)
- [ ] Algoritmo para realocar metas quando tempo diário aumenta
- [ ] Algoritmo para prorrogar metas quando tempo diário diminui
- [ ] Respeitar ordem de prioridade e incidência
- [ ] Manter distribuição equilibrada entre disciplinas
- [ ] Atualizar banco de dados automaticamente

### 1.3 Sistema de Progresso e Tempo (1h)
- [ ] Salvar tempo dedicado a cada meta
- [ ] Calcular progresso real vs planejado
- [ ] Histórico de sessões de estudo por meta
- [ ] Estatísticas de tempo por disciplina
- [ ] Relatório de produtividade semanal

### 1.4 Integração com Revisão (0.5h)
- [ ] Criar revisão automaticamente ao concluir meta
- [ ] Agendar revisões baseadas na curva de esquecimento
- [ ] Vincular revisão à meta original

---

## ⏰ FASE 2: FRONTEND DE METAS INDIVIDUAIS (2-3 horas)

### 2.1 Modal de Meta - Melhorias (1h)
- [ ] Salvar edições no backend via tRPC
- [ ] Persistir anotações no banco
- [ ] Atualizar UI em tempo real após salvar
- [ ] Feedback visual de salvamento (loading, success)
- [ ] Validação de campos obrigatórios
- [ ] Mensagens de erro amigáveis

### 2.2 Cronômetro Funcional (1h)
- [ ] Persistir tempo no backend a cada pausa
- [ ] Recuperar tempo ao reabrir meta
- [ ] Sincronizar entre dispositivos
- [ ] Notificação ao término do tempo
- [ ] Histórico de sessões de estudo

### 2.3 Orientação de Estudos Avançada (1h)
- [ ] Editor rich text real (TipTap ou similar)
- [ ] Detecção automática de URLs de vídeo (YouTube, Vimeo)
- [ ] Embed automático de vídeos
- [ ] Gravação de áudio com MediaRecorder API
- [ ] Upload de áudio para S3
- [ ] Player de áudio inline

---

## ⏰ FASE 3: VISUALIZAÇÃO META A META (1-2 horas)

### 3.1 Lista Completa de Metas (1h)
- [ ] Carregar metas do backend
- [ ] Paginação ou scroll infinito
- [ ] Ordenação por múltiplos critérios
- [ ] Filtros persistentes (salvar preferências)
- [ ] Ações em lote (marcar várias como concluídas)

### 3.2 Cards de Meta Expandidos (0.5h)
- [ ] Mostrar mais informações sem abrir modal
- [ ] Preview de orientação de estudos
- [ ] Indicador de anotações
- [ ] Progresso visual inline
- [ ] Ações rápidas (concluir, editar, excluir)

### 3.3 Sincronização com Calendário (0.5h)
- [ ] Mudanças na lista refletem no calendário
- [ ] Mudanças no calendário refletem na lista
- [ ] Estado compartilhado entre visualizações
- [ ] Transições suaves

---

## ⏰ FASE 4: FUNCIONALIDADES PRINCIPAIS DOS ALUNOS (4-5 horas)

### 4.1 Sistema de Aulas Completo (1.5h)
- [ ] Backend: CRUD de progresso de aulas
- [ ] Marcar aula como assistida
- [ ] Salvar ponto de parada do vídeo
- [ ] Anotações por aula (com timestamps)
- [ ] Player de vídeo com controles
- [ ] Velocidade de reprodução
- [ ] Legendas (se disponível)
- [ ] Próxima aula automática

### 4.2 Sistema de Questões Completo (1.5h)
- [ ] Backend: Salvar respostas no banco
- [ ] Histórico completo de respostas
- [ ] Estatísticas por disciplina/assunto
- [ ] Questões favoritas (backend)
- [ ] Questões marcadas para revisão (backend)
- [ ] Modo simulado (cronômetro, sem gabarito imediato)
- [ ] Relatório de desempenho detalhado
- [ ] Gráficos de evolução

### 4.3 Painel do Aluno - Dashboard Personalizado (1h)
- [ ] Carregar dados reais do backend
- [ ] Gráfico de horas estudadas (últimos 7/30 dias)
- [ ] Gráfico de metas concluídas
- [ ] Gráfico de questões acertadas
- [ ] Ranking de disciplinas mais estudadas
- [ ] Próximas revisões
- [ ] Metas atrasadas (alertas)
- [ ] Sequência de dias estudando

### 4.4 Perfil do Aluno (0.5h)
- [ ] Editar informações pessoais
- [ ] Foto de perfil (upload para S3)
- [ ] Preferências de estudo
- [ ] Configurações de notificações
- [ ] Histórico de atividades

### 4.5 Sistema de Notificações (0.5h)
- [ ] Notificações de metas do dia
- [ ] Notificações de revisões pendentes
- [ ] Notificações de avisos do mentor
- [ ] Notificações de respostas no fórum
- [ ] Central de notificações
- [ ] Marcar como lida

---

## ⏰ FASE 5: INTEGRAÇÃO E REFINAMENTOS (2-3 horas)

### 5.1 Integração entre Módulos (1h)
- [ ] Vincular metas → aulas (backend + frontend)
- [ ] Vincular metas → questões (backend + frontend)
- [ ] Vincular aulas → questões relacionadas
- [ ] Navegação fluida entre módulos
- [ ] Breadcrumbs contextuais

### 5.2 Performance e Otimização (0.5h)
- [ ] Lazy loading de componentes pesados
- [ ] Otimização de queries no banco
- [ ] Cache de dados frequentes
- [ ] Debounce em buscas e filtros
- [ ] Skeleton loaders

### 5.3 Validações e Tratamento de Erros (0.5h)
- [ ] Validação de formulários (Zod)
- [ ] Mensagens de erro amigáveis
- [ ] Fallbacks para erros de rede
- [ ] Retry automático em falhas
- [ ] Logs de erro para debug

### 5.4 Dados de Teste Realistas (0.5h)
- [ ] Seed do banco com dados completos
- [ ] 50+ metas distribuídas
- [ ] 20+ aulas de diferentes disciplinas
- [ ] 50+ questões variadas
- [ ] 10+ tópicos no fórum
- [ ] Histórico de progresso

### 5.5 Testes e Correções (0.5h)
- [ ] Testar fluxos principais
- [ ] Corrigir bugs encontrados
- [ ] Verificar responsividade
- [ ] Testar em diferentes navegadores
- [ ] Validar acessibilidade básica

---

## ⏰ FASE 6: FUNCIONALIDADES AVANÇADAS (3-4 horas)

### 6.1 Gamificação (1h)
- [ ] Sistema de pontos por meta concluída
- [ ] Conquistas/badges
- [ ] Níveis de progresso
- [ ] Ranking entre alunos (opcional)
- [ ] Sequência de dias (streak)
- [ ] Desafios semanais

### 6.2 Relatórios Avançados (1h)
- [ ] Relatório semanal de estudos
- [ ] Relatório mensal de progresso
- [ ] Comparativo de desempenho
- [ ] Gráficos de evolução temporal
- [ ] Exportar relatórios (PDF)
- [ ] Compartilhar com mentor

### 6.3 Modo Offline (0.5h)
- [ ] Service Worker básico
- [ ] Cache de dados essenciais
- [ ] Sincronização ao voltar online
- [ ] Indicador de status de conexão

### 6.4 Acessibilidade (0.5h)
- [ ] Navegação por teclado
- [ ] ARIA labels
- [ ] Contraste de cores adequado
- [ ] Suporte a leitores de tela
- [ ] Textos alternativos em imagens

### 6.5 Documentação (1h)
- [ ] README completo do projeto
- [ ] Documentação de APIs
- [ ] Guia de uso para alunos
- [ ] Guia de uso para mentores
- [ ] Guia de administração

---

## 📊 RESUMO DE ENTREGAS

**Backend:**
- 15+ endpoints tRPC funcionais
- Lógica de redistribuição de metas
- Sistema de progresso e tempo
- Integração com revisão automática
- Seed de dados completo

**Frontend:**
- Modal de meta totalmente funcional
- Cronômetro persistente
- Editor rich text com vídeos e áudio
- Lista de metas completa
- Dashboard do aluno com dados reais
- Sistema de aulas funcional
- Sistema de questões funcional
- Perfil do aluno
- Notificações

**Extras:**
- Gamificação
- Relatórios avançados
- Performance otimizada
- Documentação completa

---

## 🎯 PRIORIDADES

1. **Crítico** (Horas 1-8): Backend de metas + Frontend de metas individuais
2. **Importante** (Horas 9-12): Visualização meta a meta + Aulas e Questões
3. **Desejável** (Horas 13-16): Dashboard do aluno + Gamificação + Refinamentos

---

**Início:** Agora  
**Duração estimada:** 16 horas  
**Checkpoints:** A cada 4 horas de trabalho
