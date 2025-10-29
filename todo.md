# TODO - Aplicativo DOM
## Plataforma de Mentoria com Metodologia Ciclo EARA

---

## 📋 FASE 1: PLANEJAMENTO E SETUP INICIAL

### 1.1 Infraestrutura e Ambiente
- [x] Configurar repositório Git
- [x] Definir stack tecnológica final (Node.js/TypeScript backend, React frontend)
- [x] Configurar ambiente de desenvolvimento local
- [ ] Configurar Docker/containers
- [ ] Configurar CI/CD pipeline
- [ ] Configurar ambientes (dev, staging, production)
- [x] Configurar banco de dados MySQL/TiDB
- [ ] Configurar Redis para cache e sessões
- [x] Configurar AWS S3 para storage de arquivos
- [ ] Configurar CloudFront CDN para streaming

### 1.2 Design e Prototipação
- [ ] Criar wireframes das principais telas
- [ ] Criar mockups de alta fidelidade
- [ ] Definir paleta de cores e identidade visual
- [ ] Criar design system e biblioteca de componentes
- [ ] Prototipar fluxos de usuário principais
- [ ] Validar UX com stakeholders

---

## 📋 FASE 2: AUTENTICAÇÃO E GESTÃO DE USUÁRIOS

### 2.1 Sistema de Autenticação
- [x] Implementar registro de usuários
- [x] Implementar login com JWT
- [x] Implementar refresh tokens
- [ ] Implementar recuperação de senha
- [ ] Implementar validação de CPF
- [ ] Implementar validação de e-mail único
- [ ] Implementar validação de senha forte
- [x] Implementar logout
- [ ] Implementar sessão única por dispositivo (opcional)
- [ ] Implementar logout automático por inatividade

### 2.2 Perfis de Usuário
- [x] Criar modelo de dados para usuários
- [x] Implementar perfil Master (Administrador Geral)
- [x] Implementar perfil Mentor
- [x] Implementar perfil Administrativo
- [x] Implementar perfil Professor
- [x] Implementar perfil Aluno
- [ ] Implementar sistema de permissões granulares
- [ ] Implementar hierarquia de acessos
- [ ] Criar interface para gestão de funções/perfis

### 2.3 Cadastro de Alunos
- [ ] Implementar cadastro individual de alunos
- [ ] Implementar cadastro em batch (upload de planilha)
- [ ] Implementar validação de dados em batch
- [ ] Implementar relatório de erros/sucessos pós-importação
- [ ] Implementar sistema de geração de tokens únicos
- [ ] Implementar tela de auto-cadastro com token
- [ ] Implementar associação automática ao plano via token
- [ ] Implementar prompt de troca de senha no primeiro acesso

### 2.4 Gestão de Acesso
- [ ] Implementar configuração de duração de acesso por aluno
- [ ] Implementar mensagem customizável para encerramento de período
- [ ] Implementar log detalhado de acessos (data, hora, IP)
- [ ] Implementar sistema de renovação de acesso

---

## 📋 FASE 3: DASHBOARD ADMINISTRATIVO

### 3.1 Painel Master
- [ ] Criar dashboard principal para Master
- [ ] Implementar painel de criação de usuários
- [ ] Implementar atribuição de permissões
- [ ] Implementar logs de ações administrativas
- [ ] Implementar visualização de métricas gerais

### 3.2 Personalização Visual
- [ ] Implementar editor de cores para boxes de metas
- [ ] Implementar color picker
- [ ] Implementar preview em tempo real
- [ ] Criar templates de cores pré-definidos
- [ ] Implementar salvamento de configurações visuais

### 3.3 Sistema de Avisos
- [ ] Implementar criação de avisos normais (verde)
- [ ] Implementar criação de avisos urgentes (vermelho)
- [ ] Implementar criação de avisos individuais (amarelo)
- [ ] Implementar publicação por plano de estudos
- [ ] Implementar envio simultâneo para múltiplos planos
- [ ] Implementar replicação automática em todas as telas do aluno
- [ ] Implementar sistema de dispensa permanente
- [ ] Implementar agendamento de publicação
- [ ] Implementar histórico de avisos enviados
- [ ] Implementar suporte a embed de mídias
- [ ] Implementar botões "Dispensar", "Próximo", "Anterior"

### 3.4 Gerenciamento de Alunos
- [ ] Criar listagem de alunos por produtos/planos
- [ ] Implementar exibição de dados cadastrais
- [ ] Implementar histórico de acessos por IP
- [ ] Implementar cálculo de progressão no plano
- [ ] Criar painel individual do aluno
- [ ] Implementar visualização de logs de login
- [ ] Implementar visualização de aulas acessadas
- [ ] Implementar histórico de metas concluídas
- [ ] Implementar tempo total de estudo
- [ ] Implementar interações no fórum
- [ ] Implementar alteração de plano de estudos
- [ ] Implementar configuração de horas diárias
- [ ] Implementar configuração de dias da semana
- [ ] Implementar pausa/retomada de cronograma
- [ ] Implementar envio de aviso individual

---

## 📋 FASE 4: PLANOS DE ESTUDO

### 4.1 Criação de Planos
- [x] Criar modelo de dados para planos
- [ ] Implementar formulário de criação de plano
- [ ] Implementar configuração de parâmetros globais
- [ ] Implementar configuração de parâmetros pedagógicos
- [ ] Implementar alternância de disciplinas
- [ ] Implementar configuração de tempo limite por meta
- [ ] Implementar sequência de disciplinas
- [ ] Implementar frequência de revisões
- [ ] Implementar distribuição de questões

### 4.2 Sistema de Planilha Base
- [ ] Criar template de planilha Excel
- [ ] Implementar upload de planilha base
- [ ] Implementar parser de planilha Excel
- [ ] Implementar validação de dados da planilha
- [ ] Implementar importação de dados da planilha
- [ ] Gerar planilha template automaticamente com campos obrigatórios

### 4.3 Ciclo EARA - Distribuição Inteligente
- [ ] Implementar algoritmo de distribuição automática
- [ ] Considerar tempo disponível do aluno
- [ ] Implementar priorização por incidência
- [ ] Implementar espaçamento ideal para revisões
- [ ] Implementar alternância otimizada de disciplinas
- [ ] Implementar curva de esquecimento

### 4.4 Geração Inteligente por IA
- [ ] Implementar upload de edital (PDF)
- [ ] Implementar análise automática de edital por IA
- [ ] Implementar extração de disciplinas
- [ ] Implementar identificação de assuntos
- [ ] Implementar sugestão de distribuição temporal
- [ ] Implementar estimativa de horas por tópico
- [ ] Implementar geração de planilha pré-preenchida
- [ ] Implementar interface de fine-tuning manual

### 4.5 Disciplinas Recorrentes
- [ ] Implementar adição de disciplinas recorrentes diárias
- [ ] Implementar configuração de durações (15, 30, 45, 60 min)
- [ ] Implementar configuração por disciplina

### 4.6 Produtos e Estrutura Comercial
- [ ] Criar modelo de dados hierárquico (Produto > Concurso > Plano)
- [ ] Implementar criação de produtos
- [ ] Implementar criação de concursos/editais
- [ ] Criar página de apresentação do concurso
- [ ] Implementar informações sobre remuneração e benefícios
- [ ] Implementar galeria de materiais e aulas prévias
- [ ] Implementar botão de aquisição do plano

### 4.7 Sistema de Checkout
- [ ] Integrar Mercado Pago API
- [ ] Integrar PagSeguro (opcional)
- [ ] Implementar fluxo de pagamento
- [ ] Implementar webhook de confirmação
- [ ] Implementar ativação automática do acesso
- [ ] Implementar envio de e-mail de boas-vindas

### 4.8 Planos Gratuitos
- [ ] Implementar configuração de duração limitada
- [ ] Criar tela customizável de expiração
- [ ] Implementar redirecionamento para landing page
- [ ] Implementar tela interna com oferta de upgrade
- [ ] Implementar mensagem padrão configurável
- [ ] Implementar call-to-action configurável

---

## 📋 FASE 5: ÁREA DO ALUNO - PAINEL DE METAS

### 5.1 Visualização em Calendário
- [x] Criar layout de calendário semanal (seg-dom)
- [x] Implementar exibição de data (DD/MM)
- [x] Implementar navegação "Semana Anterior" / "Próxima Semana"
- [x] Implementar visualização de até 4 semanas à frente
- [x] Implementar indicador da semana atual
- [x] Implementar exibição de horas previstas da semana
- [ ] Implementar barra de progresso semanal
- [ ] Implementar filtros rápidos por disciplina/tipo

### 5.2 Boxes de Metas
- [ ] Criar componente visual de box de meta
- [ ] Implementar exibição de disciplina (negrito, fonte maior)
- [ ] Implementar exibição de assunto (fonte menor)
- [ ] Implementar badge colorido de tipo de meta
- [ ] Implementar exibição de duração
- [ ] Implementar indicador visual de conclusão
- [ ] Implementar cores pastel personalizáveis
- [ ] Implementar hover com dica de estudo
- [ ] Implementar clique para expandir detalhes

### 5.3 Modal de Detalhes da Meta
- [ ] Criar modal de detalhes
- [ ] Implementar exibição de informações completas
- [ ] Implementar dica de estudo expandida
- [ ] Implementar botões de ação (iniciar, concluir, adiar)
- [ ] Implementar link para aula vinculada
- [ ] Implementar link para questões relacionadas
- [ ] Implementar ajuste de tempo
- [ ] Implementar marcação como concluída
- [ ] Implementar feedback de conclusão

### 5.4 Personalização do Cronograma
- [ ] Implementar configuração de horas diárias
- [ ] Implementar configuração de dias da semana
- [ ] Implementar ajuste de ritmo de aprendizagem
- [ ] Implementar pausa/retomada de cronograma
- [ ] Implementar recalculo automático de distribuição
- [ ] Implementar visualização de impacto das mudanças

### 5.5 Funcionalidades Adicionais
- [ ] Implementar sistema de arrastar e soltar metas
- [ ] Implementar troca de ordem de metas
- [ ] Implementar adição manual de metas
- [ ] Implementar remoção de metas
- [ ] Implementar sincronização em tempo real

---

## 📋 FASE 6: ESTATÍSTICAS E GAMIFICAÇÃO

### 6.1 Dashboard de Estatísticas
- [ ] Criar dashboard principal de estatísticas
- [ ] Implementar total de horas estudadas
- [ ] Implementar metas concluídas vs. planejadas
- [ ] Implementar sequência de dias consecutivos
- [ ] Implementar média diária de estudo
- [ ] Implementar progresso por disciplina
- [ ] Implementar gráficos de evolução temporal
- [ ] Implementar comparativo entre períodos

### 6.2 Gráficos e Visualizações
- [ ] Implementar gráfico de horas por semana
- [ ] Implementar gráfico de distribuição por disciplina
- [ ] Implementar gráfico de evolução de metas
- [ ] Implementar heatmap de atividade
- [ ] Implementar gráfico de performance em questões
- [ ] Implementar gráfico de consistência

### 6.3 Exportação de Estatísticas
- [ ] Implementar exportação em PDF
- [ ] Implementar exportação em Excel
- [ ] Implementar exportação em CSV
- [ ] Implementar seleção de período
- [ ] Implementar filtros de dados

### 6.4 Sistema de Cards Exportáveis
- [ ] Criar design de cards "instagramáveis"
- [ ] Implementar logo da DOM em destaque
- [ ] Implementar primeiro nome do aluno
- [ ] Implementar estatística em evidência
- [ ] Implementar geração de frase motivacional por IA
- [ ] Implementar footer com disclaimer
- [ ] Criar tipos de cards (tempo total, sequência, meta alcançada, etc.)
- [ ] Implementar banco de frases motivacionais (20+ por categoria)
- [ ] Implementar exportação PNG 1080x1080 (Instagram Post)
- [ ] Implementar exportação PNG 1080x1920 (Instagram Stories)
- [ ] Implementar exportação PDF (compilação)
- [ ] Implementar compartilhamento direto (WhatsApp, Instagram, Facebook)

---

## 📋 FASE 7: REPOSITÓRIO DE AULAS

### 7.1 Estrutura e Organização
- [ ] Criar modelo de dados hierárquico (Concurso > Disciplina > Professor > Assunto)
- [ ] Implementar árvore hierárquica expansível/retrátil
- [ ] Implementar contadores de conteúdo em cada nível
- [ ] Implementar breadcrumb para navegação
- [ ] Implementar ícones diferenciados por tipo de nó

### 7.2 Metadados das Aulas
- [ ] Criar modelo de dados completo para aulas
- [ ] Implementar campos obrigatórios (ID, título, descrição, professor, etc.)
- [ ] Implementar tags para busca
- [ ] Implementar nível de dificuldade
- [ ] Implementar pré-requisitos
- [ ] Implementar data de publicação e atualização

### 7.3 Sistema de Filtros
- [ ] Implementar filtro por professor
- [ ] Implementar filtro por disciplina
- [ ] Implementar filtro por assunto (cascata)
- [ ] Implementar filtro por concurso/área
- [ ] Implementar filtro por tipo de conteúdo
- [ ] Implementar filtro por status do aluno
- [ ] Implementar filtro por duração
- [ ] Implementar filtro por data
- [ ] Implementar multi-seleção de filtros
- [ ] Implementar limpeza de filtros

### 7.4 Barra de Pesquisa Inteligente
- [ ] Implementar busca por palavras-chave
- [ ] Implementar autocomplete
- [ ] Implementar histórico de buscas
- [ ] Implementar busca fonética
- [ ] Implementar busca por sinônimos
- [ ] Implementar ordenação de resultados (relevância, recentes, etc.)
- [ ] Implementar destacamento de termos buscados
- [ ] Implementar preview no hover

### 7.5 Card da Aula (Listagem)
- [ ] Criar componente de card de aula
- [ ] Implementar thumbnail/capa
- [ ] Implementar exibição de título
- [ ] Implementar exibição de professor (nome e foto)
- [ ] Implementar exibição de disciplina e assunto
- [ ] Implementar exibição de duração
- [ ] Implementar barra de progresso
- [ ] Implementar ícone de favorito
- [ ] Implementar ícone de status
- [ ] Implementar rating médio
- [ ] Implementar número de visualizações

### 7.6 Página da Aula (Individual)
- [ ] Criar página completa da aula
- [ ] Implementar editor WYSIWYG para mentores/professores
- [ ] Implementar player de vídeo customizado
- [ ] Implementar controles avançados (velocidade, qualidade, PiP)
- [ ] Implementar marcadores de capítulos
- [ ] Implementar anotações temporais
- [ ] Implementar progresso automático salvo
- [ ] Implementar retomar de onde parou

### 7.7 Abas de Conteúdo
- [ ] Implementar aba "Resumo"
- [ ] Implementar aba "Materiais" com download de PDFs
- [ ] Implementar aba "Questões" integrada ao banco
- [ ] Implementar aba "Dúvidas" integrada ao fórum
- [ ] Implementar aba "Anotações" com editor Markdown
- [ ] Implementar exportação de anotações
- [ ] Implementar sincronização de anotações

### 7.8 Sidebar Direita
- [ ] Implementar exibição de progresso
- [ ] Implementar botão de favoritar
- [ ] Implementar botão de marcar como concluída
- [ ] Implementar botão de compartilhar
- [ ] Implementar botão de reportar problema
- [ ] Implementar aulas relacionadas
- [ ] Implementar próxima aula sugerida
- [ ] Implementar estatísticas pessoais

### 7.9 Avaliação e Comentários
- [ ] Implementar sistema de rating (1-5 estrelas)
- [ ] Implementar seção de comentários
- [ ] Implementar ordenação de comentários
- [ ] Implementar resposta de professores destacada
- [ ] Implementar moderação de comentários
- [ ] Implementar like/dislike em comentários

### 7.10 Acompanhamento e Progresso
- [ ] Implementar indicadores de progresso por aula
- [ ] Implementar marca automática de conclusão (>90%)
- [ ] Implementar opção de marcar manualmente
- [ ] Implementar progresso por curso/disciplina
- [ ] Implementar progresso por professor
- [ ] Implementar histórico de visualização

---

## 📋 FASE 8: FÓRUM DE DÚVIDAS

### 8.1 Estrutura do Fórum
- [ ] Criar modelo de dados para tópicos e respostas
- [ ] Implementar categorias de discussão
- [ ] Implementar subcategorias
- [ ] Implementar tags
- [ ] Implementar hierarquia de posts (tópico > resposta > sub-resposta)

### 8.2 Criação de Tópicos
- [ ] Implementar formulário de novo tópico
- [ ] Implementar editor de texto rico (Markdown)
- [ ] Implementar upload de imagens
- [ ] Implementar anexo de arquivos
- [ ] Implementar seleção de categoria
- [ ] Implementar adição de tags
- [ ] Implementar vinculação a aulas
- [ ] Implementar vinculação a metas

### 8.3 Respostas e Interações
- [ ] Implementar sistema de respostas
- [ ] Implementar sub-respostas (threading)
- [ ] Implementar marcação de solução
- [ ] Implementar destaque de resposta do mentor/professor
- [ ] Implementar menção de usuários (@)
- [ ] Implementar citação de posts
- [ ] Implementar edição de posts
- [ ] Implementar exclusão de posts

### 8.4 Notificações
- [ ] Implementar notificações de novas respostas
- [ ] Implementar notificações de menções
- [ ] Implementar notificações de solução marcada
- [ ] Implementar notificações de novos tópicos (seguidos)
- [ ] Implementar preferências de notificação
- [ ] Implementar notificações por e-mail
- [ ] Implementar notificações push (mobile)
- [ ] Implementar contador de notificações não lidas

### 8.5 Moderação e Qualidade
- [ ] Implementar ferramentas de moderação
- [ ] Implementar edição de posts por moderadores
- [ ] Implementar exclusão de posts
- [ ] Implementar movimentação de tópicos
- [ ] Implementar destaque de tópicos (pin)
- [ ] Implementar fechamento/abertura de tópicos
- [ ] Implementar banimento/suspensão de usuários
- [ ] Implementar logs de moderação

### 8.6 Sistema de Votação
- [ ] Implementar upvotes/downvotes
- [ ] Implementar ranking de respostas por votos
- [ ] Implementar destaque para resposta mais votada
- [ ] Implementar sistema de curtidas
- [ ] Implementar contador de curtidas

### 8.7 Reputação (Opcional)
- [ ] Implementar sistema de pontos
- [ ] Implementar cálculo de pontos por atividade
- [ ] Implementar badges de reputação
- [ ] Implementar ranking de usuários

### 8.8 Integração com Aulas
- [ ] Implementar aba "Dúvidas" em cada aula
- [ ] Implementar filtro automático por aula
- [ ] Implementar botão "Fazer pergunta sobre esta aula"
- [ ] Implementar contexto automaticamente preenchido
- [ ] Implementar inserção de aulas no fórum (professor/mentor)
- [ ] Implementar preview de aula inserida
- [ ] Implementar link clicável para aula

---

## 📋 FASE 9: MÓDULO DE QUESTÕES

### 9.1 Banco de Questões
- [ ] Criar modelo de dados para questões
- [ ] Implementar integração com árvore hierárquica de assuntos
- [ ] Implementar metadados completos (ID, enunciado, alternativas, gabarito, etc.)
- [ ] Implementar banca organizadora
- [ ] Implementar concurso e ano
- [ ] Implementar nível de dificuldade
- [ ] Implementar taxa de acerto geral
- [ ] Implementar comentário/resolução
- [ ] Implementar vídeo de resolução (opcional)

### 9.2 Modos de Estudo
- [ ] Implementar Modo Livre
- [ ] Implementar Modo Simulado (com configurações)
- [ ] Implementar Modo por Assunto
- [ ] Implementar Modo Inteligente (IA)
- [ ] Implementar cronômetro regressivo (simulado)
- [ ] Implementar navegação sequencial/aleatória
- [ ] Implementar correção imediata ou ao final

### 9.3 Interface de Resolução
- [ ] Criar layout de questão
- [ ] Implementar enunciado destacado
- [ ] Implementar alternativas espaçadas
- [ ] Implementar botões de navegação
- [ ] Implementar marcador de questões (favoritar/revisar)
- [ ] Implementar timer
- [ ] Implementar contador de questões
- [ ] Implementar ferramentas (eliminar alternativas, anotações, zoom)
- [ ] Implementar calculadora (quando permitido)

### 9.4 Correção e Feedback
- [ ] Implementar destaque de resposta correta (verde)
- [ ] Implementar destaque de resposta incorreta (vermelho)
- [ ] Implementar comentário/resolução expansível
- [ ] Implementar player de vídeo de resolução
- [ ] Implementar estatísticas da questão
- [ ] Implementar link para aula relacionada
- [ ] Implementar botão "Enviar dúvida" (vai para fórum)

### 9.5 Estatísticas e Análise
- [ ] Criar dashboard de questões
- [ ] Implementar total de questões resolvidas
- [ ] Implementar taxa de acerto geral
- [ ] Implementar taxa por disciplina
- [ ] Implementar taxa por assunto
- [ ] Implementar taxa por banca
- [ ] Implementar gráfico de evolução temporal
- [ ] Implementar análise de desempenho
- [ ] Implementar assuntos dominados/a revisar
- [ ] Implementar relatórios exportáveis

### 9.6 Integração com Outros Módulos
- [ ] Integrar com plano de estudos (metas tipo "Questões")
- [ ] Integrar com repositório de aulas (questões nas aulas)
- [ ] Integrar com fórum (botão "Dúvida sobre esta questão")

---

## 📋 FASE 10: SEÇÃO DE REVISÃO

### 10.1 Modos de Visualização
- [ ] Implementar Modo Plano (Calendário)
- [ ] Implementar fundo diferenciado (roxo pastel)
- [ ] Implementar filtro para apenas metas de revisão
- [ ] Implementar Modo Hierárquico (Edital Verticalizado)
- [ ] Implementar estrutura de árvore por disciplina
- [ ] Implementar ordenação por incidência
- [ ] Implementar indicador visual de incidência
- [ ] Implementar checkbox por assunto
- [ ] Implementar progresso de revisão

### 10.2 Algoritmo de Distribuição
- [ ] Implementar priorização por incidência
- [ ] Implementar priorização por desempenho em questões
- [ ] Implementar priorização por tempo desde último estudo
- [ ] Implementar distribuição temporal (spaced repetition)
- [ ] Implementar ciclos de revisão (1ª, 2ª, etc.)

### 10.3 Funcionalidades
- [ ] Implementar vídeo explicativo colapsável
- [ ] Implementar adição manual de assuntos
- [ ] Implementar remoção de assuntos dominados
- [ ] Implementar ajuste de frequência de revisão
- [ ] Implementar marcação de assuntos críticos
- [ ] Implementar integração com metas (vinculação a aulas)

---

## 📋 FASE 11: NAVEGAÇÃO E INTERFACE

### 11.1 Menu Lateral (Web)
- [ ] Criar menu lateral com abas verticais
- [ ] Implementar ícones para cada seção
- [ ] Implementar indicadores de notificação
- [ ] Implementar animação de notificações
- [ ] Implementar destaque de item ativo

### 11.2 Responsividade (Mobile)
- [ ] Implementar menu hamburguer
- [ ] Implementar drawer lateral deslizante
- [ ] Implementar overlay escuro
- [ ] Implementar fechamento ao clicar fora
- [ ] Implementar bottom navigation (alternativa)

### 11.3 Navegação Contextual
- [ ] Implementar breadcrumbs em páginas internas
- [ ] Implementar botão "Voltar" sempre visível
- [ ] Implementar atalhos de teclado (desktop)
- [ ] Implementar busca global (Ctrl+K ou Cmd+K)

---

## 📋 FASE 12: PROTEÇÃO DE CONTEÚDO (DRM)

### 12.1 DRM em PDFs
- [ ] Implementar marca d'água digital em PDFs
- [ ] Implementar inserção de nome, CPF, telefone, e-mail
- [ ] Implementar data e hora do download
- [ ] Implementar posicionamento no rodapé
- [ ] Implementar transparência e cor
- [ ] Implementar geração em tempo real
- [ ] Implementar cache por aluno
- [ ] Implementar limite de downloads por período

### 12.2 Segurança de Vídeos
- [ ] Implementar streaming apenas (sem download)
- [ ] Implementar marca d'água dinâmica (nome do aluno)
- [ ] Implementar proteção contra screen recording
- [ ] Implementar hotlink protection
- [ ] Implementar tokenização de URLs
- [ ] Implementar verificação de login ativa
- [ ] Implementar sessão única por dispositivo
- [ ] Implementar log de dispositivos ativos

---

## 📋 FASE 13: INTEGRAÇÕES E INFRAESTRUTURA

### 13.1 Gateways de Pagamento
- [ ] Integrar Mercado Pago
- [ ] Integrar Stripe (opcional)
- [ ] Integrar PagSeguro (opcional)
- [ ] Implementar webhooks de confirmação

### 13.2 E-mail e SMS
- [ ] Integrar SendGrid para e-mails transacionais
- [ ] Integrar Twilio para SMS (opcional)
- [ ] Implementar templates de e-mail
- [ ] Implementar envio de e-mail de boas-vindas
- [ ] Implementar envio de e-mail de recuperação de senha
- [ ] Implementar envio de notificações por e-mail

### 13.3 Vídeo
- [ ] Integrar Vimeo API ou YouTube Data API
- [ ] Implementar upload de vídeos
- [ ] Implementar transcodificação (AWS Elemental)
- [ ] Implementar streaming adaptativo

### 13.4 IA/ML
- [ ] Integrar OpenAI API para geração de frases motivacionais
- [ ] Integrar OpenAI API para análise de editais
- [ ] Implementar sistema de recomendações personalizadas
- [ ] Implementar modo inteligente de questões

---

## 📋 FASE 14: SEGURANÇA E PERFORMANCE

### 14.1 Segurança
- [ ] Implementar HTTPS obrigatório (SSL/TLS)
- [ ] Configurar firewall e WAF
- [ ] Implementar rate limiting nas APIs
- [ ] Implementar validação de inputs (sanitização)
- [ ] Implementar proteção contra SQL Injection
- [ ] Implementar proteção contra XSS
- [ ] Implementar proteção contra CSRF
- [ ] Implementar criptografia de dados sensíveis
- [ ] Implementar anonimização de logs
- [ ] Implementar direito ao esquecimento (LGPD)
- [ ] Implementar consentimento explícito
- [ ] Criar política de privacidade

### 14.2 Performance
- [ ] Implementar cache agressivo (Redis, CDN)
- [ ] Implementar lazy loading de conteúdos
- [ ] Implementar compressão de assets
- [ ] Otimizar queries do banco de dados
- [ ] Implementar indexação adequada
- [ ] Implementar load balancing
- [ ] Implementar auto-scaling
- [ ] Implementar containerização (Docker/Kubernetes)

### 14.3 Monitoramento
- [ ] Configurar Sentry para tracking de erros
- [ ] Configurar New Relic ou DataDog para monitoramento
- [ ] Configurar Google Analytics ou Mixpanel
- [ ] Implementar dashboards de métricas
- [ ] Implementar alertas de downtime

---

## 📋 FASE 15: TESTES E QUALIDADE

### 15.1 Testes Unitários
- [ ] Escrever testes para autenticação
- [ ] Escrever testes para gestão de usuários
- [ ] Escrever testes para planos de estudo
- [ ] Escrever testes para metas
- [ ] Escrever testes para aulas
- [ ] Escrever testes para fórum
- [ ] Escrever testes para questões
- [ ] Escrever testes para revisão

### 15.2 Testes de Integração
- [ ] Testar fluxo completo de cadastro
- [ ] Testar fluxo completo de login
- [ ] Testar fluxo completo de criação de plano
- [ ] Testar fluxo completo de estudo (meta → aula → questões)
- [ ] Testar integração com gateways de pagamento
- [ ] Testar integração com APIs externas

### 15.3 Testes E2E
- [ ] Testar jornada completa do aluno
- [ ] Testar jornada completa do mentor
- [ ] Testar jornada completa do administrador
- [ ] Testar responsividade em diferentes dispositivos
- [ ] Testar compatibilidade com navegadores

### 15.4 Testes de Performance
- [ ] Testar tempo de carregamento inicial
- [ ] Testar streaming de vídeo
- [ ] Testar resposta de APIs
- [ ] Testar carga com 10.000 usuários simultâneos
- [ ] Testar escalabilidade

---

## 📋 FASE 16: DOCUMENTAÇÃO

### 16.1 Documentação Técnica
- [ ] Documentar arquitetura do sistema
- [ ] Documentar APIs (endpoints, parâmetros, respostas)
- [ ] Documentar modelos de dados
- [ ] Documentar fluxos de autenticação
- [ ] Documentar integrações externas
- [ ] Documentar processo de deploy

### 16.2 Documentação de Usuário
- [ ] Criar manual do aluno
- [ ] Criar manual do mentor
- [ ] Criar manual do administrador
- [ ] Criar manual do professor
- [ ] Criar FAQs
- [ ] Criar vídeos tutoriais

### 16.3 Documentação de Código
- [ ] Documentar principais funções e classes
- [ ] Criar comentários explicativos
- [ ] Criar README do projeto
- [ ] Criar guia de contribuição

---

## 📋 FASE 17: DEPLOY E LANÇAMENTO

### 17.1 Preparação para Produção
- [ ] Configurar ambiente de produção
- [ ] Configurar domínio e DNS
- [ ] Configurar certificado SSL
- [ ] Configurar backups automáticos
- [ ] Configurar disaster recovery plan
- [ ] Realizar testes finais em staging

### 17.2 Lançamento
- [ ] Migrar dados (se aplicável)
- [ ] Fazer deploy em produção
- [ ] Monitorar logs e métricas
- [ ] Resolver bugs críticos
- [ ] Coletar feedback inicial

### 17.3 Pós-Lançamento
- [ ] Monitorar uptime e performance
- [ ] Analisar métricas de uso
- [ ] Coletar feedback de usuários
- [ ] Priorizar melhorias e correções
- [ ] Planejar próximas funcionalidades

---

## 📋 FASE 18: FUNCIONALIDADES FUTURAS (ROADMAP)

### 18.1 Fase 2 (Futuro)
- [ ] Implementar gamificação (badges, níveis, rankings)
- [ ] Implementar competições entre alunos
- [ ] Implementar grupos de estudo
- [ ] Implementar lives e webinars integrados
- [ ] Implementar mentoria 1-on-1 (agendamento)

### 18.2 Fase 3 (Futuro)
- [ ] Implementar aplicativo offline
- [ ] Integrar com calendários externos (Google, Outlook)
- [ ] Implementar assistente virtual (chatbot IA)
- [ ] Implementar reconhecimento de voz para anotações
- [ ] Implementar realidade aumentada (mapas mentais 3D)

### 18.3 Fase 4 (Futuro)
- [ ] Implementar marketplace de materiais
- [ ] Implementar sistema de afiliados
- [ ] Implementar white-label

---

## 📊 MÉTRICAS E KPIs A MONITORAR

### Engajamento
- [ ] DAU/MAU (usuários ativos diários/mensais)
- [ ] Tempo médio na plataforma
- [ ] Taxa de conclusão de metas
- [ ] Taxa de visualização de aulas
- [ ] Participação no fórum

### Performance Acadêmica
- [ ] Taxa de acerto em questões
- [ ] Evolução temporal (curva de aprendizagem)
- [ ] Horas de estudo (por aluno/disciplina)
- [ ] Metas concluídas vs. planejadas

### Negócio
- [ ] Taxa de conversão (gratuito → pago)
- [ ] Churn rate (cancelamentos)
- [ ] LTV (Lifetime Value)
- [ ] CAC (Custo de Aquisição de Cliente)
- [ ] NPS (Net Promoter Score)

---

## 🎯 REQUISITOS NÃO FUNCIONAIS

### Performance
- [ ] Tempo de carregamento inicial < 3s
- [ ] Streaming de vídeo sem buffering (>95% do tempo)
- [ ] Resposta de API < 200ms (p95)
- [ ] Suporte a 10.000 usuários simultâneos

### Disponibilidade
- [ ] Uptime > 99.5%
- [ ] Backup diário automático
- [ ] Disaster recovery plan
- [ ] Manutenções programadas (fora de horário de pico)

### Usabilidade
- [ ] Interface intuitiva (onboarding < 5 min)
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Suporte a navegação por teclado
- [ ] Modo escuro (dark mode)
- [ ] Fonte ajustável (acessibilidade)

### Compatibilidade
- [ ] Navegadores: Chrome, Firefox, Safari, Edge (últimas 2 versões)
- [ ] Mobile: iOS 13+, Android 8+
- [ ] Tablets: suporte completo
- [ ] Resolução mínima: 320px (mobile)

---

## 📝 OBSERVAÇÕES FINAIS

Este documento TODO foi gerado com base nos requisitos completos do aplicativo DOM. Cada item representa uma tarefa ou funcionalidade a ser desenvolvida. Recomenda-se:

1. **Priorizar as fases** de acordo com o MVP (Minimum Viable Product)
2. **Revisar e ajustar** as tarefas conforme o progresso do projeto
3. **Atribuir responsáveis** para cada tarefa ou grupo de tarefas
4. **Definir prazos** realistas para cada fase
5. **Manter o documento atualizado** conforme o desenvolvimento avança
6. **Usar ferramentas de gestão** (Jira, Trello, GitHub Projects) para tracking

**Data de criação:** Outubro de 2025  
**Versão:** 1.0  
**Baseado em:** Requisitos do Sistema - Aplicativo DOM


---

## 🔧 DASHBOARD ADMINISTRATIVO - TAREFAS ADICIONAIS

### Interface Administrativa
- [ ] Criar página de dashboard administrativo (/admin)
- [ ] Implementar verificação de role (master, mentor, administrativo) para acesso
- [ ] Criar layout específico para área administrativa
- [ ] Implementar navegação entre seções administrativas (usuários, planos, conteúdos, relatórios)
- [ ] Criar sidebar administrativa com menu contextual

### Gestão de Usuários (Admin)
- [ ] Criar página de listagem de todos os usuários
- [ ] Implementar filtros por role (aluno, professor, mentor, etc.)
- [ ] Implementar busca de usuários por nome, email, CPF
- [ ] Criar formulário de criação de usuário (admin)
- [ ] Criar formulário de edição de usuário (admin)
- [ ] Implementar alteração de role de usuários
- [ ] Implementar ativação/desativação de usuários
- [ ] Implementar visualização de logs de acesso por usuário

### Gestão de Planos (Admin)
- [ ] Criar página de listagem de planos
- [ ] Criar formulário de criação de plano (admin)
- [ ] Criar formulário de edição de plano (admin)
- [ ] Implementar ativação/desativação de planos
- [ ] Implementar visualização de alunos matriculados por plano
- [ ] Implementar duplicação de planos
- [ ] Implementar exportação de dados do plano

### Gestão de Conteúdos (Admin)
- [ ] Criar página de gestão de aulas (admin)
- [ ] Implementar formulário de criação de aula
- [ ] Implementar formulário de edição de aula
- [ ] Implementar upload de vídeos para aulas
- [ ] Implementar upload de materiais complementares (PDFs)
- [ ] Criar página de gestão de questões (admin)
- [ ] Implementar formulário de criação de questão
- [ ] Implementar importação em lote de questões (planilha)

### Gestão de Matrículas (Admin)
- [ ] Criar página de gestão de matrículas
- [ ] Implementar criação de matrícula (vincular aluno a plano)
- [ ] Implementar edição de matrícula (alterar datas, horas)
- [ ] Implementar cancelamento de matrícula
- [ ] Implementar renovação de matrícula
- [ ] Implementar transferência de aluno entre planos

### Sistema de Avisos (Admin)
- [ ] Criar página de gestão de avisos
- [ ] Implementar criação de aviso normal (verde)
- [ ] Implementar criação de aviso urgente (vermelho)
- [ ] Implementar criação de aviso individual (amarelo)
- [ ] Implementar seleção de destinatários (por plano, todos, individual)
- [ ] Implementar agendamento de avisos
- [ ] Implementar visualização de avisos enviados
- [ ] Implementar estatísticas de visualização de avisos

### Relatórios e Analytics (Admin)
- [ ] Criar dashboard de métricas gerais
- [ ] Implementar relatório de usuários ativos (DAU/MAU)
- [ ] Implementar relatório de progresso dos alunos
- [ ] Implementar relatório de uso de aulas (mais assistidas)
- [ ] Implementar relatório de questões (taxa de acerto por disciplina)
- [ ] Implementar relatório de atividade no fórum
- [ ] Implementar exportação de relatórios (PDF, Excel)
- [ ] Implementar gráficos de evolução temporal

### Moderação de Fórum (Admin/Mentor)
- [ ] Criar painel de moderação do fórum
- [ ] Implementar listagem de tópicos pendentes de moderação
- [ ] Implementar edição de tópicos e respostas
- [ ] Implementar exclusão de tópicos e respostas
- [ ] Implementar fixação/destaque de tópicos
- [ ] Implementar fechamento de tópicos
- [ ] Implementar banimento temporário de usuários
- [ ] Implementar logs de ações de moderação

### Configurações do Sistema (Master)
- [ ] Criar página de configurações gerais
- [ ] Implementar personalização de cores (boxes de metas)
- [ ] Implementar upload de logo do sistema
- [ ] Implementar configuração de nome da plataforma
- [ ] Implementar configuração de emails transacionais
- [ ] Implementar configuração de integrações (pagamento, storage)
- [ ] Implementar backup e restauração de dados

### Permissões e Segurança (Master)
- [ ] Implementar sistema de permissões granulares
- [ ] Criar interface de gestão de roles e permissões
- [ ] Implementar auditoria de ações administrativas
- [ ] Implementar logs de segurança (tentativas de acesso)
- [ ] Implementar autenticação de dois fatores (2FA) para admins
- [ ] Implementar sessões administrativas com timeout reduzido

---


---

## 🎯 MELHORIAS SOLICITADAS - PRIORIDADE ALTA

### Interface Geral
- [x] Adicionar breadcrumb em todas as páginas
- [x] Adicionar botão de voltar em todas as páginas
- [ ] Alterar título do app para "DOM / EARA" (requer configuração manual)
- [x] Criar componente de Footer com "Desenvolvido por Fernando Mesquita" e versionamento
- [x] Adicionar Footer em todas as páginas

### Dados de Teste (Frontend)
- [x] Criar dados de teste para planos de estudo
- [x] Criar dados de teste para metas (estudo, revisão, questões)
- [x] Criar dados de teste para aulas (diversas disciplinas)
- [ ] Criar dados de teste para questões
- [x] Criar dados de teste para tópicos do fórum
- [x] Criar dados de teste para matrículas
- [x] Preencher dashboard com estatísticas de teste
- [x] Preencher página de aulas com cards de exemplo
- [x] Preencher página de fórum com tópicos de exemplo
- [x] Preencher página de plano com metas distribuídas na semana

### Painéis de Metas - FOCO PRINCIPAL
- [x] Implementar painel geral de metas (calendário semanal completo)
- [x] Implementar boxes de metas com cores personalizáveis (pastel)
- [x] Implementar indicadores de incidência (🔥 alta, ⚡ média, 💧 baixa)
- [x] Implementar badges de tipo de meta (estudo, revisão, questões)
- [x] Implementar hover com dica de estudo
- [x] Implementar modal de detalhes da meta ao clicar
- [x] Implementar marcação de meta como concluída
- [x] Implementar progresso visual (barra de progresso semanal)
- [x] Implementar filtros por disciplina e tipo de atividade
- [x] Implementar painel específico de meta individual (modal)
- [x] Implementar vinculação de meta com aula
- [x] Implementar vinculação de meta com questões
- [ ] Implementar ajuste de tempo da meta
- [ ] Implementar sistema de arrastar e soltar metas (opcional)
- [ ] Implementar visualização de histórico de metas concluídas

---


---

## 🎯 NOVAS FUNCIONALIDADES - PAINEL DE METAS AVANÇADO

### Melhorias Visuais
- [x] Meta concluída deve ficar acinzentada com opacidade 50%
- [x] Painel de filtros deve ser colapsável
- [x] Exibir nome do plano no topo da página "Meu plano de estudos"

### Cronômetro e Controle de Tempo
- [x] Implementar cronômetro regressivo dentro da meta específica
- [x] Implementar barra de progresso proporcional ao tempo dedicado
- [x] Implementar modal "Você finalizou os estudos?" ao término do tempo
- [x] Implementar opções "Estudo finalizado" ou "Preciso de mais tempo"
- [ ] Redistribuir meta automaticamente quando usuário precisar de mais tempo (backend)

### Dashboard Administrativo
- [x] Implementar opção "Visualizar como" para usuários administrativos
- [x] Permitir trocar visualização entre perfis (aluno, professor, mentor, etc.)
- [x] Implementar dropdown de seleção de perfil de visualização

### Edição de Metas (Master)
- [x] Adicionar botão "Editar meta" dentro do modal de meta (apenas para master)
- [x] Criar painel de edição de meta pré-preenchido
- [ ] Implementar salvamento de alterações na meta (backend)

### Campo de Orientação de Estudos
- [x] Criar campo "Orientação de estudos" com editor rich text HTML
- [ ] Implementar detecção automática de links de vídeo (YouTube/Vimeo)
- [ ] Implementar embed automático de vídeos
- [x] Implementar funcionalidade de gravação de áudio (UI)
- [ ] Implementar player de áudio para reprodução
- [ ] Salvar áudios gravados no storage S3

---
