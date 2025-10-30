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
