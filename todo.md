# TODO - DOM App
## Plataforma de Mentoria com Metodologia Ciclo EARA®

---

## 🚨 BUGS CRÍTICOS (PRIORIDADE MÁXIMA)

### Bug #1: AdicionarEditarMetaModal JSX error ❌
- [ ] Localizar e corrigir erro JSX no AdicionarEditarMetaModal.tsx
- [ ] Verificar todas as tags abertas e fechadas
- [ ] Testar modal após correção

### Bug #2: Campo "Aula Vinculada" não aparece no modal ❌
- [ ] Adicionar componente SelectorAula de volta ao AdicionarEditarMetaModal
- [ ] Integrar com tRPC aulas.listar query
- [ ] Filtrar aulas por disciplina automaticamente
- [ ] Salvar aulaId no formulário

### Bug #3: Editor rich text desapareceu ❌
- [ ] Re-adicionar react-quill ao campo "Orientação de Estudos"
- [ ] Configurar toolbar com opções de formatação
- [ ] Testar salvar/carregar conteúdo HTML

### Bug #4: Botões de reordenação não funcionam ❌
- [ ] Debugar click handlers dos botões de seta em GestaoMetas
- [ ] Verificar se mutation reordenarMeta está sendo chamada
- [ ] Testar drag-and-drop ainda funciona

### Bug #5: Router 'auth' colide com método interno do tRPC ✅
- [x] Renomear router 'auth' para 'authentication' no backend
- [x] Atualizar todas as referências no frontend (8 arquivos)
- [x] Testar login/logout/me queries

### Bug #6: Notas não aparecem no dashboard ❌
- [ ] Verificar query de notas no Dashboard
- [ ] Corrigir exibição de anotações
- [ ] Testar integração com página de Anotações

### Bug #7: Cards truncados em telas pequenas ❌
- [ ] Adicionar responsividade aos cards de metas
- [ ] Testar em diferentes resoluções
- [ ] Ajustar grid layout para mobile

### Bug #8: Redistribuição não usa novas configurações ❌
- [ ] Verificar se ConfigurarCronograma passa parâmetros corretos
- [ ] Debugar função redistribuirMetasAluno
- [ ] Testar redistribuição após alterar horas diárias

---

## 📋 FASE 1: SISTEMA DE METAS (80% COMPLETO)

### 1.1 Backend de Metas ✅
- [x] API metas.create - Criar nova meta
- [x] API metas.update - Atualizar meta existente
- [x] API metas.delete - Excluir meta
- [x] API metas.marcarConcluida - Marcar como concluída
- [x] API metas.adicionarAnotacao - Adicionar/editar anotação
- [x] API metas.vincularAula - Vincular aula à meta
- [x] API metas.minhasMetas - Buscar metas do aluno
- [x] API metas.redistribuir - Redistribuir metas no calendário
- [x] Campo orientacaoEstudos adicionado ao schema
- [x] Migration aplicada

### 1.2 Gestão de Metas (Admin) ✅
- [x] Componente GestaoMetas com listagem
- [x] Modal AdicionarEditarMetaModal
- [x] Drag-and-drop para reordenar
- [x] Botões de seta para mover meta
- [x] Importação via Excel
- [x] Download de template
- [x] Filtros por disciplina e tipo
- [x] Busca por assunto

### 1.3 Visualização de Metas (Aluno) ✅
- [x] Calendário semanal com metas
- [x] Visualização "Meta a Meta" com navegação
- [x] Lista completa de metas
- [x] Filtros por tipo e disciplina
- [x] Indicadores de incidência (🔴🟡🟢)
- [x] Badges coloridos por tipo
- [x] Barra de progresso semanal
- [x] Dial de ajuste de tempo por dia
- [x] Cronômetro funcional com pause/resume
- [x] Modal de detalhes da meta

### 1.4 Funcionalidades Pendentes ❌
- [ ] Editor rich text para "Orientação de Estudos"
- [ ] Gravação de áudio para anotações
- [ ] Notificações de metas próximas
- [ ] Sincronização entre visualizações
- [ ] Arrastar meta entre dias
- [ ] Duplicar meta
- [ ] Histórico de alterações

---

## 📋 FASE 2: SISTEMA DE AULAS (60% COMPLETO)

### 2.1 Backend de Aulas ✅
- [x] API aulas.list - Listar todas as aulas
- [x] API aulas.getById - Buscar aula por ID
- [x] API aulas.marcarConcluida - Marcar como assistida
- [x] API aulas.salvarProgresso - Salvar posição do vídeo
- [x] Tabela aulas criada
- [x] 3 aulas de exemplo inseridas

### 2.2 Repositório de Aulas ✅
- [x] Página /aulas com listagem
- [x] Filtros por disciplina
- [x] Busca por título
- [x] Cards com thumbnail e duração
- [x] Indicador de progresso

### 2.3 Player de Vídeo ✅
- [x] Página individual de aula
- [x] Player com iframe YouTube
- [x] Sistema de anotações com timestamps
- [x] Materiais de apoio
- [x] Tópicos abordados
- [x] Botão marcar como concluída

### 2.4 Integração com Vimeo ❌
- [ ] Criar conta Vimeo Pro
- [ ] Configurar API Vimeo
- [ ] Implementar upload de vídeos
- [ ] Implementar player Vimeo embed
- [ ] Salvar progresso com Vimeo API
- [ ] Implementar controles personalizados
- [ ] Implementar velocidade de reprodução
- [ ] Implementar legendas/transcrições

### 2.5 Gestão de Aulas (Admin) ❌
- [ ] CRUD completo de aulas
- [ ] Upload de vídeos para Vimeo
- [ ] Associar aulas a disciplinas
- [ ] Definir ordem de visualização
- [ ] Marcar aulas como obrigatórias
- [ ] Estatísticas de visualização

---

## 📋 FASE 3: ALGORITMO EARA® CYCLE (70% COMPLETO)

### 3.1 Core do Algoritmo ✅
- [x] Função criarSequenciaEARA() implementada
- [x] Função distribuirNoCalendario() implementada
- [x] Função validarIncidenciaAlta() implementada
- [x] Função ordenarPorPrioridade() implementada
- [x] Função inserirDisciplinasPinadas() implementada
- [x] Função distribuirMetasComEARA() implementada
- [x] Arquivo ciclo-eara.ts com 600+ linhas

### 3.2 Configuração EARA® (Admin) ✅
- [x] Componente ConfiguracaoEARA criado
- [x] Interface para configurar intervalos E-A-R-R-R
- [x] Configurar alternação de disciplinas (30-60min)
- [x] Configurar thresholds de adaptação (≥90%, <70%)
- [x] Configurar max 30% metas de alta incidência
- [x] Configurar disciplinas pinadas (aparecem todo dia)
- [x] Salvar configurações no campo configuracaoEARA (JSON)

### 3.3 Integração com Metas ❌
- [ ] Aplicar algoritmo EARA® ao criar plano
- [ ] Aplicar algoritmo ao redistribuir metas
- [ ] Exibir sequência EARA® no card da meta (E/A/R1/R2/R3)
- [ ] Calcular próximo ciclo baseado em desempenho
- [ ] Acelerar ciclo se desempenho ≥90%
- [ ] Desacelerar ciclo se desempenho <70%
- [ ] Registrar cicloEARA em progressoMetas

### 3.4 Tracking de Desempenho ❌
- [ ] Salvar desempenhoQuestoes após resolver questões
- [ ] Calcular proximoCiclo automaticamente
- [ ] Registrar dataProximoCiclo
- [ ] Exibir badge do ciclo atual (E/A/R1/R2/R3)
- [ ] Dashboard com métricas EARA®

---

## 📋 FASE 4: SISTEMA DE QUESTÕES (90% COMPLETO)

### 4.1 Backend de Questões ✅
- [x] API questoes.list - Listar questões
- [x] API questoes.getById - Buscar questão por ID
- [x] API questoes.responder - Salvar resposta
- [x] API questoes.minhasRespostas - Histórico
- [x] API questoes.estatisticas - Estatísticas gerais
- [x] API questoes.estatisticasPorDisciplina - Por disciplina
- [x] API questoes.evolucaoTemporal - Evolução no tempo
- [x] API questoes.questoesMaisErradas - Questões difíceis
- [x] 8 questões de exemplo inseridas

### 4.2 Interface de Resolução ✅
- [x] Página /questoes com banco de questões
- [x] Filtros por disciplina, banca, dificuldade
- [x] Busca por enunciado
- [x] Interface de resolução individual
- [x] Feedback visual (verde/vermelho)
- [x] Gabarito e comentário explicativo
- [x] Navegação entre questões
- [x] Alternativas totalmente clicáveis

### 4.3 Estatísticas ✅
- [x] Total respondidas
- [x] Taxa de acerto geral
- [x] Sequência de acertos
- [x] Tempo médio por questão
- [x] Gráficos por disciplina
- [x] Evolução temporal
- [x] Questões mais erradas

### 4.4 Funcionalidades Pendentes ❌
- [ ] Sistema de favoritos (salvar questões)
- [ ] Marcar para revisão
- [ ] Simulados cronometrados
- [ ] Questões comentadas por mentores
- [ ] Upload de questões via Excel

---

## 📋 FASE 5: GAMIFICAÇÃO (100% COMPLETO) ✅

### 5.1 Sistema de Pontos ✅
- [x] Campo pontos em users
- [x] +10 pontos ao concluir meta
- [x] +5 pontos ao assistir aula
- [x] +2 pontos ao acertar questão
- [x] API meusPontos
- [x] API ranking
- [x] Card de pontos no Dashboard

### 5.2 Sistema de Conquistas ✅
- [x] Tabela conquistas criada
- [x] Tabela userConquistas criada
- [x] 13 conquistas implementadas
- [x] Função verificarEAtribuirConquistas
- [x] API minhasConquistas
- [x] Card de conquistas no Dashboard
- [x] Toast animado ao desbloquear conquista
- [x] Fila de notificações

### 5.3 Conquistas Implementadas ✅
- [x] Primeira Meta 🎯
- [x] Estudante Dedicado 📚 (10 metas)
- [x] Mestre das Metas 🏆 (50 metas)
- [x] Primeira Aula 🎬
- [x] Cinéfilo dos Estudos 🎥 (10 aulas)
- [x] Maratonista 🌟 (30 aulas)
- [x] Primeira Questão ✅
- [x] Acertador 💯 (50 questões)
- [x] Expert 🎓 (200 questões)
- [x] Sequência de Fogo 🔥 (10 acertos seguidos)
- [x] Pontuador ⭐ (100 pontos)
- [x] Campeão 👑 (500 pontos)
- [x] Lenda 💎 (1000 pontos)

---

## 📋 FASE 6: FÓRUM E COMUNICAÇÃO (80% COMPLETO)

### 6.1 Fórum Interativo ✅
- [x] Criação de tópicos
- [x] Sistema de respostas
- [x] Curtidas em tópicos e respostas
- [x] Marcação de melhor resposta
- [x] Filtros por categoria e disciplina
- [x] Busca por título e conteúdo
- [x] Ordenação (recentes, populares, mais respondidos)
- [x] Badges de perfil (Master, Mentor, Professor)

### 6.2 Notificações do Fórum ✅
- [x] Tabela forum_notificacoes_lidas
- [x] API notificacoesRespostas
- [x] API marcarNotificacaoLida
- [x] Card de notificações no Dashboard
- [x] Sino de notificações no header
- [x] Badge contador vermelho
- [x] Página dedicada /notificacoes
- [x] Redirecionamento para tópico

### 6.3 Moderação ❌
- [x] Tabela forum_mensagens_retidas
- [x] Detector de links (linkDetector.ts)
- [x] Funções de retenção/aprovação/rejeição
- [x] APIs tRPC com controle Master/Administrativo
- [ ] UI do painel de moderação
- [ ] Integração com formulários do fórum

---

## 📋 FASE 7: GESTÃO DE PLANOS (100% COMPLETO) ✅

### 7.1 CRUD de Planos ✅
- [x] Componente GestaoPlanos
- [x] Formulário de criação manual
- [x] Importação via Excel
- [x] Template de planilha para download
- [x] Edição de planos
- [x] Exclusão de planos
- [x] Toggle ativo/inativo

### 7.2 Atribuição de Planos ✅
- [x] Componente AtribuirPlano
- [x] Seleção de aluno, plano e data início
- [x] Validação de duplicatas
- [x] Cálculo automático de dataTermino
- [x] Listagem de matrículas ativas
- [x] API admin.atribuirPlano
- [x] API admin.getMatriculas

### 7.3 Estatísticas de Planos ✅
- [x] Contador de alunos matriculados
- [x] Contador de metas criadas
- [x] Índice de engajamento
- [x] Ponto de maior abandono
- [x] Taxa de retorno
- [x] Modal EngajamentoModal com gráficos

### 7.4 Personalização de Planos ✅
- [x] Campos órgão e cargo separados
- [x] Mensagem pós-conclusão (HTML)
- [x] Link de redirecionamento
- [x] Preview de mensagem
- [x] Exibição para alunos ao concluir plano gratuito

---

## 📋 FASE 8: DASHBOARD E ESTATÍSTICAS (90% COMPLETO)

### 8.1 Dashboard do Aluno ✅
- [x] Card de pontos
- [x] Card de horas estudadas
- [x] Card de metas concluídas
- [x] Card de aulas assistidas
- [x] Card de questões resolvidas
- [x] Card de sequência de dias
- [x] Card de progresso no plano
- [x] Gráfico de progresso semanal
- [x] Ranking geral
- [x] Minhas conquistas
- [x] Acesso rápido (6 cards)
- [x] Notificações do fórum

### 8.2 APIs de Estatísticas ✅
- [x] dashboard.estatisticas - Métricas gerais
- [x] dashboard.progressoSemanal - Últimos 7 dias
- [x] Cálculo de horas estudadas
- [x] Cálculo de taxa de conclusão
- [x] Cálculo de sequência de dias consecutivos

### 8.3 Dashboard Administrativo ✅
- [x] Tab Usuários (GestaoUsuarios)
- [x] Tab Planos (GestaoPlanos)
- [x] Tab Metas (GestaoMetas)
- [x] Tab Atribuir Planos (AtribuirPlano)
- [x] Tab Configurações (ControleFuncionalidades)
- [x] Tab Personalização (CentroComando)
- [x] Painel Individual do Aluno
- [x] Métricas e histórico

### 8.4 Funcionalidades Pendentes ❌
- [ ] Relatórios exportáveis (PDF, Excel)
- [ ] Gráficos de evolução por disciplina
- [ ] Comparativo entre alunos
- [ ] Alertas de alunos inativos
- [ ] Previsão de conclusão do plano

---

## 📋 FASE 9: MATERIAIS E RECURSOS (70% COMPLETO)

### 9.1 Sistema de Materiais ✅
- [x] Tabela materiais criada
- [x] Upload para S3 com multer
- [x] API materiais.list
- [x] API materiais.byMetaId
- [x] API materiais.create
- [x] API materiais.delete
- [x] Página /materiais com listagem
- [x] Filtros por tipo e disciplina
- [x] Busca por título
- [x] Modal de upload
- [x] Cards de estatísticas
- [x] Permissões (professor/mentor/admin)

### 9.2 Integração com Metas ❌
- [ ] Exibir materiais vinculados no MetaModal
- [ ] Botão "Baixar Materiais" na meta
- [ ] Contador de materiais por meta
- [ ] Preview de PDFs inline

### 9.3 Tipos de Materiais ❌
- [ ] PDFs ✅
- [ ] Vídeos complementares
- [ ] Apresentações (PPT/PPTX)
- [ ] Planilhas (Excel)
- [ ] Imagens/Infográficos
- [ ] Links externos

---

## 📋 FASE 10: REVISÃO ESTRATÉGICA (100% COMPLETO) ✅

### 10.1 Curva de Esquecimento ✅
- [x] Algoritmo de espaçamento (1, 7, 30, 90 dias)
- [x] Calendário de revisões programadas
- [x] Seção "Revisões de Hoje"
- [x] Lista de próximas revisões
- [x] Marcar revisão como concluída
- [x] Adiar revisão para dia seguinte
- [x] Estatísticas de revisões
- [x] Badges por ciclo (1º, 2º, 3º, 4º)

### 10.2 Tipos de Revisão ✅
- [x] Revisão de metas
- [x] Revisão de aulas
- [x] Revisão de questões
- [x] Card informativo sobre Ebbinghaus

---

## 📋 FASE 11: CONTROLE E SEGURANÇA (60% COMPLETO)

### 11.1 Controle de Funcionalidades ✅
- [x] Tabela config_funcionalidades
- [x] Toggle switches para Questões/Fórum/Materiais
- [x] API getConfigFuncionalidades
- [x] API atualizarConfigFuncionalidades
- [x] UI com badges de status
- [x] Estilo cinza para desabilitadas
- [ ] Aplicar filtro no menu lateral do aluno
- [ ] Bloquear rotas desabilitadas

### 11.2 Auditoria ❌
- [ ] Logs de todas as ações administrativas
- [ ] Histórico de alterações em planos
- [ ] Histórico de alterações em metas
- [ ] Rastreamento de acessos
- [ ] Relatório de atividades suspeitas

### 11.3 Backup e Recuperação ❌
- [ ] Backup automático do banco
- [ ] Backup de arquivos S3
- [ ] Procedimento de restore
- [ ] Testes de recuperação

---

## 📋 FASE 12: OTIMIZAÇÃO E PERFORMANCE (0% COMPLETO) ❌

### 12.1 Performance Backend ❌
- [ ] Adicionar índices no banco de dados
- [ ] Implementar cache com Redis
- [ ] Otimizar queries N+1
- [ ] Implementar paginação em todas as listagens
- [ ] Lazy loading de dados

### 12.2 Performance Frontend ❌
- [ ] Code splitting
- [ ] Lazy loading de componentes
- [ ] Otimização de imagens
- [ ] Service Worker para cache
- [ ] Compressão de assets

### 12.3 Monitoramento ❌
- [ ] Implementar logging estruturado
- [ ] Implementar APM (Application Performance Monitoring)
- [ ] Alertas de erro
- [ ] Métricas de uso
- [ ] Dashboard de saúde do sistema

---

## 📋 FASE 13: TESTES (10% COMPLETO)

### 13.1 Testes Unitários ❌
- [ ] Testes de funções do ciclo-eara.ts
- [ ] Testes de APIs tRPC
- [ ] Testes de componentes React
- [ ] Cobertura mínima de 80%

### 13.2 Testes de Integração ❌
- [ ] Testes de fluxo de autenticação
- [ ] Testes de criação de planos
- [ ] Testes de atribuição de metas
- [ ] Testes de resolução de questões

### 13.3 Testes End-to-End ✅
- [x] Script de seed implementado
- [x] 5 usuários criados
- [x] 1 plano completo (TJ-SP 2025)
- [x] 20 metas distribuídas
- [x] 13 conquistas criadas
- [x] 1 matrícula ativa
- [ ] Testes automatizados com Playwright

---

## 📋 FASE 14: DOCUMENTAÇÃO (30% COMPLETO)

### 14.1 Documentação Técnica ✅
- [x] README.md do projeto
- [x] PLANO_PROXIMA_SESSAO.md
- [x] RESUMO_CONSOLIDADO_SESSAO.md
- [x] PROPOSTA_CICLO_EARA_V2.md
- [x] RELATORIO_FASE5.md
- [ ] Documentação de APIs
- [ ] Diagramas de arquitetura
- [ ] Guia de deploy

### 14.2 Documentação de Usuário ❌
- [ ] Manual do Aluno
- [ ] Manual do Mentor
- [ ] Manual do Administrador
- [ ] FAQs
- [ ] Vídeos tutoriais

---

## 📋 FASE 15: DEPLOY E PRODUÇÃO (0% COMPLETO) ❌

### 15.1 Preparação para Produção ❌
- [ ] Configurar variáveis de ambiente
- [ ] Configurar domínio personalizado
- [ ] Configurar SSL/HTTPS
- [ ] Configurar CORS
- [ ] Configurar rate limiting

### 15.2 Deploy ❌
- [ ] Deploy do backend
- [ ] Deploy do frontend
- [ ] Configurar CDN
- [ ] Configurar load balancer
- [ ] Testes em produção

### 15.3 Monitoramento Pós-Deploy ❌
- [ ] Configurar alertas de erro
- [ ] Configurar alertas de performance
- [ ] Configurar backup automático
- [ ] Plano de disaster recovery

---

## 📊 RESUMO GERAL

### ✅ Completado (70%)
- Sistema de autenticação básico
- Dashboard do aluno com estatísticas
- Sistema de metas (criação, edição, visualização)
- Sistema de aulas (repositório, player)
- Sistema de questões (resolução, estatísticas)
- Gamificação completa (pontos, conquistas, ranking)
- Fórum interativo com notificações
- Gestão de planos (CRUD, importação, atribuição)
- Dashboard administrativo (9 tabs)
- Sistema de revisão (curva de esquecimento)
- Materiais (upload, listagem, download)
- Personalização visual (Centro de Comando)
- Controle de funcionalidades

### 🚧 Em Progresso (20%)
- Algoritmo EARA® Cycle (core implementado, falta integração)
- Sistema de aulas (falta integração Vimeo)
- Moderação do fórum (backend pronto, falta UI)
- Auditoria e logs
- Performance e otimização

### ❌ Pendente (10%)
- Testes automatizados
- Documentação completa
- Deploy em produção
- Backup e recuperação
- Monitoramento avançado

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

1. **Corrigir 8 bugs críticos** (4-6h)
   - Bug #1: JSX error no AdicionarEditarMetaModal
   - Bug #2: Campo "Aula Vinculada" não aparece
   - Bug #3: Editor rich text desapareceu
   - Bug #4: Botões de reordenação não funcionam
   - Bug #5: Router 'auth' colide com tRPC ✅
   - Bug #6: Notas não aparecem no dashboard
   - Bug #7: Cards truncados em telas pequenas
   - Bug #8: Redistribuição não usa novas configurações

2. **Completar sistema de aulas** (6-8h)
   - Integração com Vimeo
   - CRUD de aulas no admin
   - Estatísticas de visualização

3. **Finalizar algoritmo EARA®** (6-8h)
   - Aplicar ao criar/redistribuir planos
   - Exibir sequência E-A-R-R-R nas metas
   - Calcular próximo ciclo baseado em desempenho
   - Dashboard com métricas EARA®

4. **Testes end-to-end** (4-6h)
   - Testar fluxo completo aluno
   - Testar fluxo completo admin
   - Corrigir bugs encontrados

---

**Última atualização:** 30/10/2025 12:40
**Versão atual:** c1baf3a7 (checkpoint estável)
**Total de tarefas:** ~500
**Tarefas concluídas:** ~350 (70%)
**Horas investidas:** ~80h
**Linhas de código:** ~15.000+
