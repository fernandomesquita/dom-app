# Plano de Trabalho - Aulas, Fórum e Notificações
## DOM App - Plataforma de Mentoria

---

## 📋 VISÃO GERAL

Este plano detalha as tarefas necessárias para finalizar três módulos críticos da plataforma:
1. **Sistema de Aulas** (integração Vimeo + progresso)
2. **Fórum de Discussões** (moderação + notificações)
3. **Sistema de Notificações** (email + push + preferências)

---

## 🎥 MÓDULO 1: SISTEMA DE AULAS

### Estado Atual
✅ CRUD de aulas implementado
✅ Integração básica com Vimeo
✅ Player de vídeo funcional
✅ Upload de thumbnail
✅ Listagem por disciplina

### Tarefas Pendentes

#### 1.1 Progresso de Visualização
- [ ] Salvar timestamp atual durante reprodução (a cada 10s)
- [ ] Calcular % assistido baseado em duração total
- [ ] Exibir barra de progresso visual no card da aula
- [ ] Marcar aula como "concluída" quando atingir 90%
- [ ] Sincronizar progresso entre dispositivos
- [ ] Retomar aula do ponto onde parou

**Backend:**
```typescript
// Tabela: progresso_aulas
- userId, aulaId, tempoAssistido, percentualCompleto, concluida, ultimaVisualizacao
```

**Frontend:**
```typescript
// Hooks necessários
- useProgressoAula(aulaId) → retorna progresso atual
- useSalvarProgresso(aulaId, timestamp) → mutation para salvar
- useMarcarConcluida(aulaId) → mutation para marcar como concluída
```

#### 1.2 Anotações Durante Aula
- [ ] Botão "Adicionar Anotação" no player
- [ ] Modal para escrever anotação com timestamp
- [ ] Lista de anotações abaixo do player
- [ ] Clicar na anotação pula para o timestamp
- [ ] Editar/excluir anotações
- [ ] Exportar anotações em PDF/Markdown

**Backend:**
```typescript
// Tabela: anotacoes_aulas
- id, userId, aulaId, timestamp, conteudo, createdAt
```

#### 1.3 Controles Avançados do Player
- [ ] Velocidade de reprodução (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
- [ ] Atalhos de teclado (espaço=play/pause, ←→=10s, ↑↓=volume)
- [ ] Modo teatro / tela cheia
- [ ] Qualidade de vídeo (se Vimeo suportar)
- [ ] Legendas/CC (se disponível no Vimeo)

#### 1.4 Organização e Navegação
- [ ] Playlists de aulas por disciplina/módulo
- [ ] Próxima aula automática (sugestão)
- [ ] Busca de aulas por título/descrição
- [ ] Filtros: disciplina, duração, concluídas/pendentes
- [ ] Ordenação: mais recentes, alfabética, duração

#### 1.5 Recursos Adicionais
- [ ] Materiais complementares anexados à aula
- [ ] Links relacionados
- [ ] Transcrição automática (via Vimeo API se disponível)
- [ ] Download para offline (se permitido)

**Prioridade:** Alta (3-4 dias)

---

## 💬 MÓDULO 2: FÓRUM DE DISCUSSÕES

### Estado Atual
✅ Criação de tópicos
✅ Respostas e comentários
✅ Curtidas e reações
✅ Busca e filtros básicos

### Tarefas Pendentes

#### 2.1 Moderação Avançada
- [ ] Painel de moderação para Master/Mentor
- [ ] Aprovar/rejeitar tópicos antes de publicar
- [ ] Marcar tópicos como "resolvido"
- [ ] Fixar tópicos importantes no topo
- [ ] Fechar tópicos para novas respostas
- [ ] Banir usuários temporariamente
- [ ] Log de ações de moderação

**Backend:**
```typescript
// Tabelas necessárias
- forum_topicos: adicionar campos (fixado, fechado, aprovado, moderadoPor)
- forum_moderacao_log: userId, acao, topicoId, motivo, timestamp
- users: adicionar campo (banidoAte)
```

#### 2.2 Notificações do Fórum
- [ ] Notificar autor quando alguém responde seu tópico
- [ ] Notificar quando mencionado (@usuario)
- [ ] Notificar quando tópico seguido tem nova resposta
- [ ] Preferências: ativar/desativar notificações por tipo
- [ ] Marcar notificações como lidas
- [ ] Badge com contador de não lidas

**Integração:** Usar sistema de notificações do Módulo 3

#### 2.3 Gamificação e Engajamento
- [ ] Sistema de reputação (pontos por resposta útil)
- [ ] Badges: "Melhor Resposta", "Colaborador", "Expert"
- [ ] Ranking de usuários mais ativos
- [ ] Marcar resposta como "solução" (autor do tópico)
- [ ] Votos positivos/negativos em respostas

#### 2.4 Recursos Adicionais
- [ ] Upload de imagens nas respostas
- [ ] Editor rich text (Markdown ou TipTap)
- [ ] Categorias/tags para organizar tópicos
- [ ] Tópicos relacionados (sugestão automática)
- [ ] Seguir tópicos específicos
- [ ] Relatório de conteúdo inadequado

**Prioridade:** Média (2-3 dias)

---

## 🔔 MÓDULO 3: SISTEMA DE NOTIFICAÇÕES

### Estado Atual
✅ Avisos básicos (CRUD)
✅ Envio para grupos específicos
✅ Notificações push (parcial)

### Tarefas Pendentes

#### 3.1 Tipos de Notificações
- [ ] **In-app**: Badge no sino + lista dropdown
- [ ] **Email**: Templates HTML responsivos
- [ ] **Push**: Notificações do navegador (Web Push API)
- [ ] **WhatsApp**: Integração com API (opcional)

#### 3.2 Eventos que Geram Notificações
- [ ] Nova meta adicionada ao plano do aluno
- [ ] Prazo de meta se aproximando (1 dia antes)
- [ ] Meta atrasada (não concluída no prazo)
- [ ] Nova aula disponível
- [ ] Resposta no fórum (tópico próprio ou seguido)
- [ ] Menção no fórum (@usuario)
- [ ] Novo aviso publicado
- [ ] Conquista desbloqueada
- [ ] Lembrete de estudo diário

#### 3.3 Central de Notificações
- [ ] Página `/notificacoes` com lista completa
- [ ] Filtros: tipo, lidas/não lidas, data
- [ ] Marcar como lida (individual ou todas)
- [ ] Excluir notificações antigas
- [ ] Agrupar notificações similares
- [ ] Link direto para o contexto (aula, tópico, meta)

#### 3.4 Preferências de Notificação
- [ ] Página de configurações `/configuracoes/notificacoes`
- [ ] Ativar/desativar por tipo de evento
- [ ] Escolher canal: in-app, email, push
- [ ] Horário de silêncio (não enviar à noite)
- [ ] Frequência: imediato, resumo diário, semanal
- [ ] Salvar preferências no banco

**Backend:**
```typescript
// Tabelas necessárias
- notificacoes: id, userId, tipo, titulo, mensagem, lida, link, createdAt
- preferencias_notificacoes: userId, tipoEvento, inApp, email, push, frequencia
```

**Frontend:**
```typescript
// Componentes necessários
- <NotificationBell /> → sino com badge
- <NotificationList /> → dropdown com últimas notificações
- <NotificationCenter /> → página completa
- <NotificationSettings /> → preferências
```

#### 3.5 Templates de Email
- [ ] Template base responsivo (HTML + CSS inline)
- [ ] Email de boas-vindas
- [ ] Email de nova meta
- [ ] Email de prazo próximo
- [ ] Email de resumo semanal
- [ ] Email de nova resposta no fórum
- [ ] Botão de cancelar inscrição (unsubscribe)

#### 3.6 Infraestrutura
- [ ] Configurar serviço de email (SMTP ou SendGrid/Mailgun)
- [ ] Fila de envio (evitar sobrecarga)
- [ ] Retry automático em caso de falha
- [ ] Log de notificações enviadas
- [ ] Métricas: taxa de abertura, cliques

**Prioridade:** Alta (4-5 dias)

---

## 🔗 INTEGRAÇÃO ENTRE MÓDULOS

### Aulas ↔ Notificações
- [ ] Notificar quando nova aula vinculada à meta é publicada
- [ ] Lembrete de aulas não assistidas

### Fórum ↔ Notificações
- [ ] Notificar respostas em tópicos próprios
- [ ] Notificar menções (@usuario)
- [ ] Notificar quando tópico seguido tem atualização

### Aulas ↔ Metas
- [ ] Exibir aula vinculada no card da meta
- [ ] Botão "Assistir Aula" direto da meta
- [ ] Marcar meta como concluída após assistir aula

---

## 📊 CRONOGRAMA ESTIMADO

| Fase | Módulo | Duração | Prioridade |
|------|--------|---------|------------|
| 1 | Análise e Planejamento | 0.5 dia | ✅ Concluído |
| 2 | Aulas - Progresso e Anotações | 2 dias | 🔴 Alta |
| 3 | Aulas - Controles e Navegação | 1.5 dias | 🟡 Média |
| 4 | Fórum - Moderação | 1.5 dias | 🟡 Média |
| 5 | Fórum - Notificações | 1 dia | 🔴 Alta |
| 6 | Notificações - Infraestrutura | 2 dias | 🔴 Alta |
| 7 | Notificações - Templates e Preferências | 2 dias | 🟡 Média |
| 8 | Integração e Testes | 1.5 dia | 🔴 Alta |
| **TOTAL** | | **12 dias** | |

---

## 🎯 ENTREGÁVEIS FINAIS

### Sistema de Aulas
- ✅ Player com controles completos
- ✅ Progresso salvo automaticamente
- ✅ Anotações com timestamps
- ✅ Playlists organizadas
- ✅ Busca e filtros funcionais

### Fórum
- ✅ Moderação completa
- ✅ Notificações em tempo real
- ✅ Gamificação básica
- ✅ Editor rich text

### Notificações
- ✅ Central de notificações
- ✅ Preferências personalizáveis
- ✅ Emails HTML responsivos
- ✅ Push notifications
- ✅ Integração com todos os módulos

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Revisar e aprovar este plano
2. ⏳ Começar pela Fase 2 (Aulas - Progresso)
3. ⏳ Implementar em ordem de prioridade
4. ⏳ Testar cada módulo isoladamente
5. ⏳ Integração final e testes E2E
6. ⏳ Deploy e monitoramento

---

**Última atualização:** 30/10/2025
**Responsável:** Fernando Mesquita
**Status:** 📋 Planejamento Concluído
