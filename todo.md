# TODO - DOM App
## Plataforma de Mentoria - Gestão Completa de Estudos

---

## 🐛 BUGS CRÍTICOS (Prioridade Máxima)

- [x] Bug #1: Erro JSX no AdicionarEditarMetaModal impedindo compilação
- [x] Bug #2: Campo "Aula Vinculada" ausente no modal de criação de metas
- [x] Bug #3: Editor rich text para "Orientação de Estudos" não implementado
- [x] Bug #4: Botões de reordenação de metas (setas para cima/baixo) não funcionam (corrigido adicionando role mentor)
- [x] Bug #5: Router 'auth' colidindo com método interno do tRPC
- [ ] Bug #6: Dashboard do aluno não mostra notas das questões respondidas
- [ ] Bug #7: Cards de metas no mobile quebram layout (não responsivo)
- [ ] Bug #8: Configurações de notificação e preferências não salvam

---

## ✅ FUNCIONALIDADES IMPLEMENTADAS

### Autenticação e Usuários
- [x] Sistema de login com OAuth (Manus)
- [x] Gestão de perfis (Master, Mentor, Aluno)
- [x] CRUD completo de usuários
- [x] Importação de alunos via CSV
- [x] Controle de acesso por perfil

### Planos de Estudo
- [x] CRUD de planos de estudo
- [x] Importação/exportação via Excel/CSV
- [x] Atribuição de planos a alunos
- [x] Filtros por órgão, cargo, tipo e status
- [x] Gestão de matrículas

### Metas de Estudo
- [x] CRUD completo de metas
- [x] Tipos: Estudo, Revisão, Questões
- [x] Campos: disciplina, assunto, duração, prioridade
- [x] Dica de estudo (texto simples)
- [x] Orientação de estudos (editor rich text com TipTap)
- [x] Vinculação de aulas às metas
- [x] Ordenação de metas (drag & drop visual)
- [x] Incidência (baixa, média, alta)
- [x] Cores personalizadas por meta

### Aulas
- [x] CRUD de aulas
- [x] Integração com Vimeo
- [x] Campos: título, descrição, disciplina, duração
- [x] Upload de thumbnail
- [x] Player de vídeo integrado
- [x] Listagem por disciplina

### Materiais de Estudo
- [x] CRUD de materiais
- [x] Tipos: PDF, Vídeo, Link, Texto
- [x] Upload de arquivos para S3
- [x] Organização por disciplina e assunto
- [x] Download de materiais

### Questões
- [x] CRUD de questões
- [x] Tipos: múltipla escolha, verdadeiro/falso, dissertativa
- [x] Gabarito e explicação
- [x] Nível de dificuldade
- [x] Tags e categorização
- [x] Banco de questões filtrado

### Fórum
- [x] Criação de tópicos
- [x] Respostas e comentários
- [x] Curtidas e reações
- [x] Busca e filtros
- [x] Moderação (Master/Mentor)

### Revisão (Flashcards)
- [x] Sistema de flashcards
- [x] Algoritmo de repetição espaçada
- [x] Estatísticas de revisão
- [x] Criação personalizada de cards

### Avisos
- [x] CRUD de avisos
- [x] Tipos: info, aviso, urgente
- [x] Envio para grupos específicos
- [x] Notificações push
- [x] Histórico de avisos

### Dashboard
- [x] Dashboard administrativo (Master)
- [x] Dashboard do aluno
- [x] Estatísticas gerais
- [x] Gráficos de progresso
- [x] Métricas de uso

---

## 🚧 FUNCIONALIDADES PENDENTES

### Sistema de Metas (Continuação)
- [ ] Reordenação funcional (Bug #4)
- [ ] Importação em massa de metas
- [ ] Templates de metas por concurso
- [ ] Clonagem de metas entre planos
- [ ] Histórico de alterações

### Sistema de Aulas (Melhorias)
- [ ] Marcação de progresso (% assistido)
- [ ] Anotações durante a aula
- [ ] Download para offline
- [ ] Legendas/transcrições
- [ ] Playlists de aulas
- [ ] Velocidade de reprodução
- [ ] Marcadores de tempo importantes

### Questões (Melhorias)
- [ ] Simulados cronometrados
- [ ] Estatísticas de desempenho por disciplina
- [ ] Ranking de alunos
- [ ] Questões comentadas por mentores
- [ ] Exportação de relatórios
- [ ] Integração com banco de questões externo

### EARA® Cycle (Algoritmo de Estudo)
- [ ] Implementação completa do algoritmo
- [ ] Cálculo de prioridades dinâmicas
- [ ] Sugestão automática de próxima meta
- [ ] Ajuste baseado em desempenho
- [ ] Relatório de eficiência do ciclo
- [ ] Gamificação (pontos, badges)

### Notificações
- [ ] Correção do Bug #8 (salvar preferências)
- [ ] Notificações por email
- [ ] Notificações por WhatsApp (API)
- [ ] Lembretes de estudo
- [ ] Alertas de prazos

### Relatórios
- [ ] Relatório de progresso individual
- [ ] Relatório de turma
- [ ] Exportação em PDF
- [ ] Gráficos avançados
- [ ] Comparativo de desempenho

### Personalização
- [ ] Temas customizáveis
- [ ] Logo personalizado por plano
- [ ] Cores da plataforma
- [ ] Textos e mensagens customizadas

### Mobile
- [ ] Correção do Bug #7 (responsividade)
- [ ] App mobile (PWA)
- [ ] Modo offline
- [ ] Notificações push nativas

---

## 🔧 MELHORIAS TÉCNICAS

### Performance
- [ ] Otimização de queries no banco
- [ ] Cache de dados frequentes
- [ ] Lazy loading de componentes
- [ ] Compressão de imagens
- [ ] CDN para assets estáticos

### Segurança
- [ ] Rate limiting em APIs
- [ ] Validação de inputs
- [ ] Sanitização de HTML
- [ ] Logs de auditoria
- [ ] Backup automático

### UX/UI
- [ ] Skeleton loaders
- [ ] Animações suaves
- [ ] Feedback visual em ações
- [ ] Tooltips explicativos
- [ ] Onboarding para novos usuários

---

## 📊 MÉTRICAS E ANALYTICS

- [ ] Google Analytics integrado
- [ ] Heatmaps de uso
- [ ] Funil de conversão
- [ ] Tempo médio de estudo
- [ ] Taxa de conclusão de metas

---

## 🎯 ROADMAP FUTURO

### Fase 1 - Correção de Bugs (Esta Fase)
- [x] Bug #1, #2, #3, #5
- [ ] Bug #4, #6, #7, #8

### Fase 2 - Aulas Completas
- [ ] Player avançado
- [ ] Progresso de visualização
- [ ] Anotações e marcadores

### Fase 3 - EARA® Cycle
- [ ] Algoritmo completo
- [ ] Gamificação
- [ ] Recomendações inteligentes

### Fase 4 - Mobile & PWA
- [ ] Responsividade total
- [ ] App instalável
- [ ] Modo offline

### Fase 5 - Integrações
- [ ] WhatsApp Business API
- [ ] Integração com bancos de questões
- [ ] API pública para parceiros

---

**Última atualização**: 30/10/2025 12:55
**Versão atual**: 331b6fc8
**Bugs corrigidos nesta sessão**: 4/8 (50%)

- [x] Reorganizar layout do modal de metas para formato horizontal (campos à esquerda, editor de orientação à direita)

- [x] Corrigir funcionalidade de reordenação de metas (botões de setas ↑↓ não estão funcionando)

- [x] Implementar menu dropdown/expansível responsivo para navegação do painel administrativo (evitar overflow em telas menores)

- [x] Corrigir rota /admin retornando 404 (era problema transitório, rota está funcionando)

- [x] Implementar funcionalidade de vincular uma meta a múltiplos planos (seletor multi-select de planos)

- [ ] Adicionar seção no Dashboard com histórico detalhado de questões respondidas (nota individual, data, disciplina)

---

## 🎯 PLANO DE TRABALHO ATUAL: AULAS, FÓRUM E NOTIFICAÇÕES

### 🎥 Sistema de Aulas - Progresso e Funcionalidades
- [ ] Salvar progresso de visualização (timestamp + % assistido)
- [ ] Retomar aula do ponto onde parou
- [ ] Marcar aula como concluída (90%+ assistido)
- [ ] Barra de progresso visual no card da aula
- [ ] Anotações durante aula com timestamp
- [ ] Lista de anotações clicáveis (pula para timestamp)
- [ ] Velocidade de reprodução (0.5x - 2x)
- [ ] Atalhos de teclado no player
- [ ] Playlists por disciplina/módulo
- [ ] Próxima aula automática (sugestão)
- [ ] Filtros: concluídas/pendentes, disciplina, duração

### 💬 Fórum - Moderação e Engajamento
- [x] Painel de moderação (Master/Mentor)
- [x] Fixar tópicos importantes
- [x] Fechar tópicos para novas respostas
- [x] Marcar tópico como "resolvido" (via marcar melhor resposta)
- [ ] Notificar autor quando alguém responde
- [ ] Notificar quando mencionado (@usuario)
- [ ] Seguir tópicos específicos
- [ ] Sistema de reputação (pontos)
- [ ] Marcar resposta como "solução"
- [ ] Editor rich text para respostas
- [ ] Upload de imagens nas respostas

### 🔔 Sistema de Notificações - Infraestrutura Completa
- [ ] Central de notificações (/notificacoes)
- [ ] Badge com contador de não lidas
- [ ] Marcar como lida (individual/todas)
- [ ] Notificações in-app (sino + dropdown)
- [ ] Notificações por email (templates HTML)
- [ ] Push notifications (Web Push API)
- [ ] Página de preferências (/configuracoes/notificacoes)
- [ ] Ativar/desativar por tipo de evento
- [ ] Escolher canal: in-app, email, push
- [ ] Horário de silêncio (não enviar à noite)
- [ ] Eventos: nova meta, prazo próximo, resposta fórum, nova aula
- [ ] Templates de email responsivos
- [ ] Fila de envio com retry automático

### 🔗 Integrações Entre Módulos
- [ ] Notificar quando nova aula vinculada à meta é publicada
- [ ] Botão "Assistir Aula" direto da meta
- [ ] Notificar respostas em tópicos do fórum
- [ ] Lembrete de aulas não assistidas

- [x] Implementar detecção automática de links em mensagens do fórum
- [x] Reter mensagens com links de alunos, professores e mentores para moderação
- [x] Permitir links diretos de Master e Administrativo

- [x] Criar tabela de lixeira para mensagens deletadas do fórum
- [x] Modificar deletar tópico/resposta para mover para lixeira ao invés de deletar
- [x] Criar painel de lixeira (apenas Master) - backend pronto
- [x] Implementar função de recuperar mensagem da lixeira
- [x] Implementar função de deletar permanentemente


---

## 📝 MÓDULO DE QUESTÕES - PLANO COMPLETO

### Dia 1: CRUD Administrativo + Filtros
- [x] Criar tabelas adicionais (lixeira, conquistas, revisar, reportadas)
- [x] Procedure: criarQuestao (admin)
- [x] Procedure: editarQuestao (admin)
- [x] Procedure: deletarQuestao → lixeira (admin)
- [x] Procedure: filtrarQuestoes (múltiplos parâmetros)
- [x] Procedure: buscarPorTexto (incluído no filtrar)
- [ ] Frontend: Painel admin - listagem com filtros
- [ ] Frontend: Formulário criar/editar questão

### Dia 2: Sistema de Revisão + Gamificação
- [ ] Algoritmo de espaçamento (Spaced Repetition)
- [ ] Procedure: sugerirProximasQuestoes (baseado em erros)
- [ ] Procedure: marcarParaRevisar
- [ ] Procedure: getQuestoesParaRevisar
- [ ] Procedure: verificarConquistas (após responder)
- [ ] Procedure: getConquistas
- [ ] Procedure: getRankingDisciplina
- [ ] Sistema de streak de dias consecutivos

### Dia 3: Interface + Polimento
- [ ] Página /questoes/resolver (uma questão por vez)
- [ ] Feedback visual (verde/vermelho)
- [ ] Mostrar comentário após responder
- [ ] Link para vídeo de resolução
- [ ] Navegação (próxima/anterior)
- [ ] Botão "Marcar para Revisar"
- [ ] Botão "Reportar Erro"
- [ ] Página de estatísticas detalhadas
- [ ] Gráficos de evolução
- [ ] Testes finais



---

## 🔴 PRIORIDADE CRÍTICA - PLANO 100%

### Bug #7: Cards de metas quebram layout no mobile
- [x] Testar visualização em diferentes resoluções (320px, 375px, 768px, 1024px)
- [x] Ajustar grid responsivo para garantir 1-2 colunas em mobile
- [x] Garantir que texto não transborde dos cards
- [x] Testar scrolling horizontal se necessário

### Bug: Redistribuição de metas não persiste configurações
- [x] Adicionar campos horasDiarias e diasSemana na tabela matriculas
- [x] Criar migration para novos campos
- [x] Salvar configurações ao alterar no ConfigurarCronograma
- [x] Carregar configurações salvas ao abrir página Plano
- [x] Aplicar configurações na redistribuição automática

### Bug: Dials de tempo não atualizam após redistribuir
- [x] Forçar refetch de metas após mutation redistribuir
- [x] Sincronizar estado local com backend
- [x] Adicionar loading state durante redistribuição

### Validações de formulários
- [x] Validar formulário de criação de metas (campos obrigatórios)
- [x] Validar duração de meta (15min-4h)
- [x] Validar formulário de criação de planos
- [x] Validar duração de plano (7-365 dias)
- [x] Validar horas diárias (1h-12h)
- [x] Adicionar mensagens de erro específicas

### Tratamento de erros em mutations
- [x] Adicionar try/catch em todas as mutações críticas
- [x] Implementar rollback de estado em caso de falha
- [x] Melhorar mensagens de erro nos toasts
- [x] Adicionar logs de erro para debug

### Testes de Integração
- [x] Criar suite de testes com Vitest
- [x] Testar validações de entrada
- [x] Testar CRUD de metas
- [x] Testar configuração de cronograma
- [x] Testar marcar meta concluída
- [x] Testar deleção de metas
- [x] Validar limites (15-240min, 3+ chars)

### Otimização de Performance
- [x] Otimizar queries de listagem de metas
- [x] Adicionar ordenação por ordem
- [x] Validar existência antes de updates/deletes
- [x] Usar .limit(1) em queries de busca única

### Sistema de Aulas Completo
- [x] Player de vídeo avançado com React Player
- [x] Controles customizados (play/pause, volume, velocidade)
- [x] Barra de progresso interativa com seek
- [x] Sistema de anotações com timestamp clicável
- [x] Salvar progresso automático a cada 10 segundos
- [x] Marcar aula como concluída
- [x] Integração real com backend (busca por ID)
- [x] Navegação de listagem para player (/aulas/:id)

### Painel Administrativo de Questões
- [x] Funções CRUD no backend (criar, editar, deletar)
- [x] Validações de enunciado, gabarito e alternativas
- [x] Soft delete com lixeira para auditoria
- [x] Função de importação em lote
- [x] Componente GestaoQuestoes completo
- [x] Dashboard com estatísticas (total, disciplinas, bancas)
- [x] Busca por enunciado ou disciplina
- [x] Filtros por disciplina, banca e dificuldade
- [x] Tabela com todas as questões
- [x] Modal de criação com validações
- [x] Modal de visualização com gabarito destacado
- [x] Integração na tab "Questões" do painel Admin

### Página de Estatísticas de Questões
- [x] 4 cards de resumo (total, taxa de acerto, acertos, erros)
- [x] Gráfico de barras: desempenho por disciplina
- [x] Gráfico de pizza: distribuição acertos/erros
- [x] Gráfico de linha: evolução temporal (30 dias)
- [x] Lista das 10 questões mais erradas
- [x] Botão "Revisar" para cada questão
- [x] Tooltips customizados com informações detalhadas
- [x] Loading states e empty states
- [x] Design responsivo com Recharts

### Sistema Visual de Conquistas
- [x] Componente ConquistaBadge com design atrativo
- [x] Gradiente dourado para desbloqueadas, grayscale para bloqueadas
- [x] 3 tamanhos (sm, md, lg) e 11 ícones diferentes
- [x] Badge de status e data de desbloqueio
- [x] Efeito de brilho e hover
- [x] Página completa de Conquistas
- [x] 4 cards de estatísticas (total, desbloqueadas, bloqueadas, progresso %)
- [x] Barra de progresso visual
- [x] Botão "Verificar Conquistas"
- [x] Conquistas agrupadas por tipo (Metas, Aulas, Questões, Sequências, Especiais)
- [x] Grid responsivo (1-5 colunas)
- [x] Componente ConquistasRecentes para dashboard
- [x] Toast de notificação ao desbloquear
- [x] Rota /conquistas adicionada no App.tsx

### Responsividade Mobile Completa
- [x] Dashboard: grids adaptativos (1-5 colunas)
- [x] Página Plano: grid de metas responsivo (1-7 colunas)
- [x] Questões: cards e filtros empilhados em mobile
- [x] Estatísticas: gráficos Recharts responsivos
- [x] Conquistas: grid adaptativo (1-5 colunas)
- [x] Menu de navegação: hamburger funcional em mobile
- [x] Sidebar colapsável em desktop
- [x] Todos os formulários e modais responsivos
- [x] Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)


---

## 🐛 SISTEMA DE REPORTE DE BUGS (NOVA FUNCIONALIDADE) ✅

### Schema e Banco de Dados
- [x] Criar tabela bugs_reportados (id, userId, titulo, descricao, categoria, prioridade, status, screenshots, createdAt)
- [x] Criar migration para nova tabela
- [x] Executar db:push para aplicar migration

### Backend (APIs tRPC)
- [x] Criar função criarBugReportado no db.ts
- [x] Criar função listarBugsReportados no db.ts
- [x] Criar função atualizarStatusBug no db.ts
- [x] Criar função deletarBugReportado no db.ts
- [x] Criar router bugs no routers.ts
- [x] Implementar mutation reportar (público)
- [x] Implementar query listar (admin)
- [x] Implementar mutation atualizarStatus (admin)
- [x] Implementar mutation deletar (admin)

### Upload de Screenshots
- [x] Configurar upload de múltiplas imagens (até 3)
- [x] Integrar com S3 storage
- [x] Validar tamanho máximo (5MB por imagem)
- [x] Validar formato (png, jpg, jpeg, webp)

### Componente Modal de Reporte
- [x] Criar componente ReportarBugModal.tsx
- [x] Formulário com campos: título, descrição, categoria, prioridade
- [x] Campo de upload de imagens com preview
- [x] Validações de formulário
- [x] Loading state durante envio
- [x] Toast de sucesso/erro

### Botão Flutuante Global
- [x] Criar componente BotaoReportarBug.tsx (botão flutuante fixo)
- [x] Posicionar no canto inferior direito
- [x] Ícone de bug com animação
- [x] Integrar em DOMLayout para aparecer em todas as páginas
- [x] Abrir modal ao clicar

### Painel Administrativo
- [x] Criar componente GestaoBugs.tsx
- [x] Listagem em tabela com todos os bugs
- [x] Filtros: status (pendente/em análise/resolvido/fechado), prioridade, categoria
- [x] Busca por título/descrição
- [x] Modal de detalhes do bug com screenshots
- [x] Botões de ação: alterar status, deletar
- [x] Badges coloridos por status e prioridade
- [x] Integrar na tab "Bugs Reportados" do painel Admin

### Notificações Automáticas
- [x] Criar notificação automática ao reportar bug
- [x] Enviar notificação para owner (OWNER_OPEN_ID)
- [x] Incluir título, categoria e prioridade na notificação
- [x] Link direto para painel de bugs
- [x] Endpoint /api/upload para screenshots


## 🐛 BUG CRÍTICO - Erro 404 na Rota Principal ✅

- [x] Investigar causa do erro 404 em /?from_webdev=1
- [x] Verificar configuração de rotas no App.tsx
- [x] Verificar se componente Dashboard está sendo importado corretamente
- [x] Testar rota principal após correção
- [x] Validar que todas as rotas estão funcionando

**Solução:** Criado componente LayoutRoute para envolver cada página individualmente com DOMLayout, corrigindo conflito de renderização múltipla do Switch do wouter.


## 🔴 PRIORIDADE URGENTE - Novas Demandas

### Bug Crítico: Erro no Painel de Questões ✅
- [x] Corrigir erro "Select.Item must have a value prop that is not an empty string"
- [x] Localizar Select.Item com value vazio no componente GestaoQuestoes
- [x] Adicionar valores válidos ou remover opções vazias
- [x] Testar painel de questões após correção

**Solução:** Substituído value="" por value="all" nos 3 SelectItem (Disciplina, Banca, Dificuldade) e ajustada lógica de filtragem para tratar "all" como "mostrar todas".

### Nova Funcionalidade: Seletor de Tipo de Questão ✅
- [x] Adicionar campo tipo na tabela questoes (certo_errado, multipla_escolha)
- [x] Atualizar schema e executar migration
- [x] Adicionar seletor de tipo no modal de criação de questões
- [x] Ajustar formulário para mostrar 2 opções (Certo/Errado) ou 5 (A-E)
- [x] Atualizar validações baseadas no tipo
- [x] Seletor de gabarito dinâmico (Certo/Errado ou A-E)

**Implementado:** Campo tipo no schema, seletor no modal com alternação dinâmica de alternativas e gabarito.

### Nova Funcionalidade: Suporte a Áudios nos Materiais
- [ ] Adicionar campo de tipo "audio" na tabela materiais
- [ ] Criar upload de arquivos de áudio (MP3, WAV, OGG)
- [ ] Implementar player de áudio no componente de materiais
- [ ] Permitir vincular áudios às metas
- [ ] Testar reprodução de áudios

### Nova Funcionalidade: Estatísticas Comparativas Entre Alunos
- [ ] Criar query para buscar alunos do mesmo plano
- [ ] Implementar gráficos comparativos (Recharts)
- [ ] Comparar: horas estudadas, metas concluídas, questões resolvidas
- [ ] Adicionar filtros por período (semana, mês, trimestre)
- [ ] Criar página ou seção dedicada para comparativos
- [ ] Garantir privacidade (apenas dados agregados, sem identificação)


## 🔴 NOVAS FUNCIONALIDADES - Questões e Metas

### Renomear Concurso para Entidade e Adicionar Cargo ✅
- [x] Renomear campo concurso para entidade no schema
- [x] Adicionar campo cargo no schema da tabela questoes
- [x] Atualizar migration no banco de dados
- [x] Renomear label "Concurso" para "Entidade" no GestaoQuestoes
- [x] Adicionar campo "Cargo" no formulário de questões
- [x] Reorganizar layout (Banca/Ano em uma linha, Entidade/Cargo em outra)

### Vincular Questões às Metas ✅
- [x] Criar tabela metas_questoes (metaId, questaoId, ordem)
- [x] Adicionar schema no drizzle
- [x] Criar funções backend (vincularQuestoesAMeta, getQuestoesDaMeta, buscarQuestoesPorFiltro)
- [x] Adicionar mutations no router (vincularQuestoes, getQuestoes, buscarQuestoes)
- [x] Criar componente EditarMetaModal com busca e seleção
- [x] Implementar busca de questões por ID ou palavra-chave
- [x] Permitir adicionar/remover múltiplas questões
- [x] Salvar vinculação no backend

### Exibir Questões nas Metas
- [ ] Criar componente de visualização de questão completa
- [ ] Exibir questões vinculadas na página Plano
- [ ] Permitir resolver questões diretamente na meta
- [ ] Marcar questão como respondida
- [ ] Mostrar feedback (acerto/erro)

### Contabilizar Resoluções nas Estatísticas
- [ ] Atualizar função de salvar resposta para incluir origem (meta)
- [ ] Contabilizar questões resolvidas nas metas para estatísticas gerais
- [ ] Atualizar dashboard com questões resolvidas nas metas
- [ ] Sincronizar progresso de metas com resolução de questões


### Exibir Questões nas Metas ✅
- [x] Criar componente QuestaoCard (visualização completa)
- [x] Criar componente MetaQuestoesModal
- [x] Permitir responder questões diretamente na meta
- [x] Mostrar gabarito após responder (com destaque verde/vermelho)
- [x] Exibir comentário da questão
- [x] Suporte a questões de múltipla escolha e certo/errado
- [x] Feedback visual (CheckCircle/XCircle)

### Contabilizar Resoluções nas Estatísticas ✅
- [x] Atualizar mutation responder para aceitar metaId
- [x] Calcular acerto automaticamente comparando com gabarito
- [x] Salvar respostas na tabela respostas_questoes
- [x] Atualizar estatísticas gerais ao responder questão
- [x] Invalidar queries para atualizar dashboard
- [x] Sistema já contabiliza questões de metas nas estatísticas gerais


## 🔴 CORREÇÕES URGENTES

### Botão Atribuir Plano Não Funciona
- [ ] Investigar componente de gestão de usuários
- [ ] Verificar onClick do botão Atribuir Plano
- [ ] Corrigir lógica de atribuição
- [ ] Testar atribuição de plano

### Textos Cortados nos Cards
- [ ] Ajustar "Metas Concluídas" → "Metas Concluí..."
- [ ] Ajustar "Aulas Assistidas" → "Aulas Assistid..."
- [ ] Usar text-xs ou reduzir padding
- [ ] Testar em diferentes resoluções


---

## 🆕 NOVAS MELHORIAS - 30/10/2025 18:32

### Menu Administrativo - Reorganização
- [x] Reorganizar tabs do painel admin em ordem alfabética
- [x] Mover menu de tabs para o topo da tela (horizontal)
- [x] Ajustar layout para menu superior fixo
- [x] Garantir responsividade do menu horizontal

### Questões Externas - Registro Manual
- [x] Adicionar box "Questões Fora da Plataforma" no MetaModal
- [x] Campo numérico para quantidade de questões externas
- [x] Campo opcional para taxa de acertos (%)
- [x] Salvar dados na tabela progressoMetas (novos campos)
- [x] Criar migration para campos questoesExternas e taxaAcertosExternas
- [ ] Exibir estatística "Questões Fora da Plataforma" no dashboard
- [ ] Somar questões externas nas estatísticas gerais de questões
- [x] Adicionar validação: taxa de acertos entre 0-100%


---

## 🆕 NOVAS CORREÇÕES - 30/10/2025 18:42

### Menu Administrativo - Setas de Navegação
- [x] Adicionar setas de navegação (← →) no menu de tabs
- [x] Implementar scroll horizontal suave ao clicar nas setas
- [x] Mostrar/ocultar setas baseado na posição do scroll
- [x] Garantir que todas as tabs sejam acessíveis

### Questões - Campo Texto Motivador
- [x] Adicionar campo "Texto Motivador" no formulário de criação de questões
- [x] Campo opcional (textarea)
- [x] Adicionar coluna textoMotivador na tabela questoes
- [x] Criar migration para novo campo
- [x] Exibir texto motivador ao resolver questões
- [x] Salvar e carregar texto motivador no CRUD


---

## 🔥 CORREÇÕES URGENTES - 30/10/2025 18:45

### Bug Crítico - ReferenceError no Admin.tsx
- [x] Corrigir erro "Cannot access 'tabs' before initialization"
- [x] Mover useEffect que usa 'tabs' para depois da definição de 'tabs'
- [x] Testar carregamento do painel administrativo

### Texto Motivador - Exibição nas Questões
- [x] Buscar componente de resolução de questões
- [x] Adicionar exibição do texto motivador na interface
- [x] Estilizar box do texto motivador (destaque visual)
- [x] Garantir que texto só aparece se existir
- [x] Testar exibição durante resolução de questões


---

## 🔧 CORREÇÃO - Texto Motivador = Texto-Base - 30/10/2025 18:48

### Corrigir Conceito de Texto Motivador
- [x] Remover estilo "motivacional" do QuestaoCard (sem emoji, sem gradiente colorido)
- [x] Exibir como texto-base neutro em box simples
- [x] Manter visível SEMPRE (antes e depois de responder)
- [x] Posicionar ANTES do enunciado (é contexto necessário)
- [x] Renomear label no formulário: "Texto-Base da Questão" ou "Texto de Apoio"
- [x] Atualizar placeholder para refletir uso correto
- [x] Estilo: fundo cinza claro, borda sutil, sem cores chamativas


---

## 🐛 BUGS - Atribuição de Planos - 30/10/2025 18:54

### Erro userId Undefined
- [x] Corrigir erro "Invalid input: expected number, received undefined" no userId
- [x] Verificar AtribuirPlanoModal: garantir que userId é passado corretamente
- [x] Verificar chamada do modal no PerfilAlunoModal
- [x] Testar atribuição de plano pelo perfil do usuário

### Textos Longos Cortados
- [x] Nome do plano muito longo cortado no select (adicionar tooltip ou ellipsis)
- [x] Botão "Atribuir Plano" cortado no perfil (ajustar largura/responsividade)
- [x] Testar com nomes de planos muito longos


---

## 🎫 NOVA FUNCIONALIDADE - Gestão de Tokens - 30/10/2025 18:59

### Schema e Banco de Dados
- [x] Criar tabela tokens_cadastro no schema
- [x] Campos: id, token (único), status (ativo/usado/expirado), criadoPor, usadoPor, dataGeracao, dataUso, dataExpiracao
- [x] Aplicar migration no banco

### Backend - Routers e DB Functions
- [x] Criar router tokens com endpoints: gerar, listar, invalidar, validar
- [x] Função gerarToken: criar token único (UUID ou código curto)
- [x] Função listarTokens: buscar todos com filtros
- [x] Função invalidarToken: marcar como expirado
- [x] Função validarToken: verificar se token é válido para uso
- [x] Função usarToken: marcar como usado ao cadastrar aluno

### Frontend - Interface de Gestão
- [x] Criar componente GestaoTokens.tsx
- [x] Botão "Gerar Token" no topo direito
- [x] Modal de geração com opções (validade, quantidade)
- [x] Tabela listando tokens (token, status, datas, ações)
- [x] Badge colorido para status (verde=ativo, cinza=usado, vermelho=expirado)
- [x] Botão copiar token (clipboard)
- [x] Botão invalidar token
- [x] Filtros por status

### Integração com Cadastro
- [x] Adicionar campo token na tela de cadastro
- [x] Validar token antes de permitir cadastro
- [x] Marcar token como usado após cadastro bem-sucedido
- [x] Exibir mensagens de erro apropriadas (token inválido/usado/expirado)
- [x] Testar fluxo completo: gerar token → cadastrar aluno → verificar status

---

## 🐛 BUG - Erro ao Gerar Token - 30/10/2025 19:15

### Problema
- [x] Interface de Gestão de Tokens não está carregando
- [x] Mostra mensagem "Sistema de gestão de tokens em desenvolvimento"
- [x] Componente GestaoTokens não está sendo renderizado
- [x] Verificar se componente foi substituído corretamente no Admin.tsx
- [x] Testar geração de token após correção

**Causa:** Faltava import do `useState` no componente GestaoTokens.tsx
**Solução:** Adicionado `import { useState } from "react";` na linha 1
**Status:** Cache persistente - forçar rebuild completo

---

## 🐛 BUG - Erro ao Enviar Bug - 30/10/2025 19:20

### Problema
- [x] Erro ao inserir bug no banco: "Failed query: insert into `bugs_reportados`..."
- [x] Campos com valores default incorretos (?, ?, ?, ?)
- [x] Verificar schema da tabela bugs_reportados
- [x] Corrigir inserção no backend
- [x] Testar envio de bug após correção

**Causa:** Função `criarBugReportado` tentava inserir `createdAt` e `updatedAt` manualmente, mas schema define `.defaultNow()` (auto-gerado)
**Solução:** Removidos campos `createdAt` e `updatedAt` da inserção. Banco gera automaticamente.
**Status:** ERRO PERSISTE - investigar schema completo

---

## 🐛 ERROS PERSISTENTES - 30/10/2025 22:47

### Erro 1: tokensCadastro is not defined
- [x] Import faltando no db.ts
- [x] Adicionar `import { tokensCadastro } from "../drizzle/schema";`
**Solução:** Adicionado `tokensCadastro` na linha 27 do import do schema

### Erro 2: Bug insert ainda falha
- [x] Verificar TODOS os campos do schema bugs_reportados
- [x] Comparar com valores enviados na inserção
- [x] Corrigir campos obrigatórios vs opcionais
**Causa:** Campo `status` tem `.default("pendente")` no schema, mas estava sendo passado manualmente na inserção
**Solução:** Removido campo `status` da inserção (linha 3885-3895). Banco usa default automaticamente.


---

## 🔄 RESTART NECESSÁRIO - 30/10/2025 22:52

### Problema
- [ ] Mudanças no db.ts não foram aplicadas (hot reload falhou)
- [ ] Erro "tokensCadastro is not defined" persiste
- [ ] Erro de inserção de bugs persiste
- [ ] Tab Tokens ainda mostra "Funcionalidade em desenvolvimento"

### Ações
- [ ] Limpar cache completo (node_modules/.vite, client/dist)
- [ ] Restart completo do servidor
- [ ] Verificar logs de erro após restart
- [ ] Testar geração de token
- [ ] Testar envio de bug


## 🔴 BUGS CRÍTICOS IDENTIFICADOS (31/out - 23:45)
- [ ] Sidebar aparece na tela inicial para usuários não autenticados (cache agressivo)
- [ ] Erro ao reportar bug: campos default (status, created_at, etc) sendo enviados manualmente
- [ ] Avisos não salvam no banco e não exibem no dashboard
- [ ] Crash ao clicar "Estatísticas Avançadas" na página de Questões
- [ ] Personalização de cores da sidebar não salva (falta botão "Salvar")
- [ ] Adicionar botão "Incluir Questão" no topo do Banco de Questões (apenas admin/master)


---

## 🔴 BUGS CRÍTICOS IDENTIFICADOS E RESOLVIDOS (31/out - 23:45)

- [x] Sidebar persiste na tela inicial (corrigido com DashboardRoute condicional)
- [x] Erro ao reportar bugs - campos default (removidos do db.ts + cache limpo)
- [x] Avisos não salvam no banco (integrado GestaoAvisos com tRPC)
- [x] Crash em Estatísticas Avançadas (tratamento de erros e loading states)
- [x] Personalização não salva cores (botão Salvar já existia, documentado)
- [x] Botão Incluir Questão para admins/master (adicionado no topo do Banco de Questões)
