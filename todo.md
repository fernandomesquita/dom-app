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


## 🎯 EDIÇÃO DE META E SISTEMA DE ANOTAÇÕES

### Edição Completa de Meta
- [x] Tornar todos os campos da meta editáveis no modo de edição
- [x] Campo editável: Disciplina
- [x] Campo editável: Assunto
- [x] Campo editável: Tipo (estudo/revisão/questões)
- [x] Campo editável: Duração
- [x] Campo editável: Incidência (baixa/média/alta)
- [x] Campo editável: Dica de estudo
- [ ] Campo editável: Aula vinculada
- [x] Campo editável: Orientação de estudos
- [ ] Implementar salvamento no backend de todas as alterações

### Sistema de Anotações de Meta
- [x] Adicionar campo "Anotações" em cada meta individual
- [x] Permitir que aluno adicione anotações pessoais na meta
- [x] Criar menu "Anotações de Meta" no dashboard do aluno
- [x] Exibir lista de todas as metas com anotações
- [x] Mostrar anotação completa no card da lista
- [x] Implementar link/botão para navegar da anotação para a meta original
- [ ] Salvar anotações no banco de dados vinculadas ao usuário e meta (backend)
- [x] Implementar edição de anotações existentes
- [ ] Implementar exclusão de anotações

---


## 🔐 AJUSTE DE PERFIS E PERMISSÕES

### Perfil Master
- [ ] Implementar gerenciamento completo de usuários (criar, editar, excluir)
- [ ] Implementar definição de permissões por perfil
- [ ] Implementar geração e invalidação de tokens de cadastro
- [ ] Implementar visualização de logs de acesso (IPs, horários, ações)
- [ ] Implementar importação de planos via Excel/CSV
- [ ] Implementar criação automática de planos a partir de editais
- [ ] Implementar configuração de cores dos boxes de metas (global e por plano)
- [ ] Implementar publicação/habilitação/desabilitação de metas
- [ ] Implementar definição de cores padrão e temas visuais
- [ ] Implementar gerenciamento de configurações DMR
- [ ] Implementar validação automática de CPF
- [ ] Implementar controle de segurança, logs e auditorias
- [ ] Implementar ajuste de parâmetros gerais do sistema
- [ ] Implementar avisos globais ou por plano
- [ ] Implementar notificações em massa
- [ ] Implementar monitoramento de métricas de engajamento
- [ ] Implementar exportação de relatórios (CSV, PDF)
- [ ] Implementar modo "ver como aluno"

### Perfil Mentor
- [ ] Implementar cadastro de alunos (manual e via planilha)
- [ ] Implementar acompanhamento de progresso individual e global
- [ ] Implementar ajuste de carga horária e dias de estudo
- [ ] Implementar alteração de plano ativo do aluno
- [ ] Implementar envio de avisos individuais
- [ ] Implementar definição de duração de acesso
- [ ] Implementar criação de planos próprios
- [ ] Implementar configuração de ciclo de estudos
- [ ] Implementar edição e reordenação de metas (drag & drop)
- [ ] Implementar adição de metas fixas/recorrentes
- [ ] Implementar sinalização de incidência de conteúdo
- [ ] Implementar importação de editais para geração automática
- [ ] Implementar inserção, edição e remoção de metas
- [ ] Implementar habilitação/desabilitação de metas específicas
- [ ] Implementar modo "ver como aluno" para metas
- [ ] Implementar reordenação e duplicação de metas
- [ ] Implementar revisão de metas concluídas (feedback)
- [ ] Implementar publicação de avisos em planos específicos
- [ ] Implementar avisos em massa para grupos
- [ ] Implementar interação via fórum (responder e moderar)
- [ ] Implementar gráficos e estatísticas por aluno/turma
- [ ] Implementar exportação de dados em planilhas

### Perfil Administrativo
- [ ] Implementar cadastro e edição de perfis
- [ ] Implementar geração de tokens de acesso
- [ ] Implementar validação de CPFs e monitoramento de logs
- [ ] Implementar inclusão de alunos em lote (CSV/Excel)
- [ ] Implementar definição/alteração de senhas iniciais
- [ ] Implementar gerenciamento de duração de acesso
- [ ] Implementar consulta de logs de login e atividades
- [ ] Implementar importação e distribuição de planos prontos
- [ ] Implementar carregamento de planilhas com metas
- [ ] Implementar ajustes pontuais em planos ativos
- [ ] Implementar gerenciamento de status de metas
- [ ] Implementar workflow de aprovação de metas (se houver)
- [ ] Implementar upload de vídeos, PDFs e materiais
- [ ] Implementar associação de conteúdos ao repositório
- [ ] Implementar publicação/desativação de conteúdos
- [ ] Implementar mensagens técnicas e informativos
- [ ] Implementar gerenciamento de avisos de suporte técnico
- [ ] Implementar atendimento de recuperação de acesso
- [ ] Implementar aplicação de regras DMR em PDFs
- [ ] Implementar monitoramento de logs de ações críticas
- [ ] Implementar controle de expiração de tokens

---


## 🎯 MELHORIAS NO PAINEL DE METAS

### Somatório de Tempo Diário
- [x] Exibir tempo total em horas abaixo de cada dia (ex: 1h45)
- [x] Calcular somatório automático das durações das metas do dia
- [x] Implementar dial/controle deslizante para ajustar tempo do dia
- [ ] Implementar realocação dinâmica de metas ao ajustar tempo (backend)
- [ ] Alocar novas metas quando tempo aumenta (backend)
- [ ] Prorrogar metas para próximos dias quando tempo diminui (backend)
- [x] Atualizar calendário automaticamente após ajuste
- [x] Mostrar feedback visual durante ajuste de tempo

### Visualização Meta a Meta
- [x] Criar aba alternativa de visualização (Calendário / Lista)
- [x] Implementar visualização em lista/cards de metas
- [x] Exibir todas as metas em ordem cronológica
- [x] Mostrar informações completas de cada meta na lista
- [x] Implementar filtros na visualização de lista
- [x] Permitir ordenação (data, disciplina, tipo, status)
- [x] Manter funcionalidades de edição e conclusão na lista
- [x] Sincronizar estado entre visualização calendário e lista

---


## 💬 FÓRUM INTERATIVO - EM DESENVOLVIMENTO

### Sistema de Tópicos
- [x] Implementar criação de novos tópicos
- [x] Implementar seleção de categoria (Dúvidas, Discussão, Questões, Avisos)
- [x] Implementar seleção de disciplina
- [x] Implementar editor de conteúdo com formatação básica
- [x] Implementar visualização detalhada de tópico
- [ ] Implementar edição de tópicos próprios (backend)
- [ ] Implementar exclusão de tópicos próprios (backend)
- [ ] Implementar moderação de tópicos (mentores/master) (backend)

### Sistema de Respostas
- [x] Implementar criação de respostas
- [ ] Implementar respostas aninhadas (threading) (futuro)
- [ ] Implementar edição de respostas próprias (backend)
- [ ] Implementar exclusão de respostas próprias (backend)
- [x] Implementar marcação de melhor resposta (autor do tópico ou mentor)
- [x] Implementar destaque visual para melhor resposta
- [x] Implementar contador de respostas por tópico

### Sistema de Votação
- [x] Implementar curtidas em tópicos
- [x] Implementar curtidas em respostas
- [ ] Implementar descurtir (backend)
- [x] Implementar contador de curtidas
- [x] Implementar ordenação por popularidade

### Filtros e Busca
- [x] Implementar filtro por categoria
- [x] Implementar filtro por disciplina
- [x] Implementar busca por texto (título e conteúdo)
- [x] Implementar ordenação (recentes, populares, mais respondidos)
- [ ] Implementar filtro "Meus tópicos" (futuro)
- [ ] Implementar filtro "Tópicos sem resposta" (futuro)

### Notificações
- [ ] Notificar autor quando tópico recebe resposta
- [ ] Notificar participantes quando há nova resposta
- [ ] Implementar badge de notificações não lidas
- [ ] Marcar tópicos com novas respostas desde última visualização

### Interface
- [x] Criar modal de novo tópico
- [x] Criar página de visualização de tópico com respostas
- [ ] Implementar paginação de tópicos (futuro)
- [ ] Implementar paginação de respostas (futuro)
- [x] Implementar avatares de usuários
- [x] Implementar badges de perfil (Mentor, Master, etc.)

---


## 📝 SISTEMA DE QUESTÕES - EM DESENVOLVIMENTO

### Banco de Questões
- [x] Criar interface de listagem de questões
- [x] Implementar filtros por disciplina
- [ ] Implementar filtros por assunto (futuro)
- [x] Implementar filtros por banca
- [ ] Implementar filtros por ano (futuro)
- [x] Implementar filtros por dificuldade
- [x] Implementar busca por texto
- [ ] Implementar ordenação (recentes, dificuldade, taxa de acerto) (futuro)

### Resolução de Questões
- [x] Criar interface de resolução individual
- [x] Implementar seleção de alternativa
- [x] Implementar botão "Responder"
- [x] Mostrar gabarito após resposta
- [x] Mostrar comentário/explicação da questão
- [x] Implementar navegação entre questões (anterior/próxima)
- [x] Implementar marcação de questões para revisão (UI)
- [x] Implementar sistema de favoritos (UI)

### Simulados
- [ ] Criar interface de configuração de simulado
- [ ] Permitir seleção de disciplinas
- [ ] Permitir seleção de quantidade de questões
- [ ] Permitir seleção de tempo limite
- [ ] Implementar cronômetro de simulado
- [ ] Implementar pausa de simulado
- [ ] Mostrar resultado final com estatísticas
- [ ] Gerar relatório de desempenho

### Estatísticas
- [x] Mostrar total de questões respondidas
- [x] Mostrar taxa de acerto geral
- [ ] Mostrar taxa de acerto por disciplina (futuro)
- [ ] Mostrar taxa de acerto por assunto (futuro)
- [ ] Mostrar evolução ao longo do tempo (gráfico) (futuro)
- [ ] Mostrar questões mais erradas (futuro)
- [x] Mostrar tempo médio por questão

### Comentários e Discussões
- [ ] Permitir comentários em questões
- [ ] Implementar sistema de curtidas em comentários
- [ ] Permitir reportar erro na questão
- [ ] Implementar moderação de comentários

---


## 🔄 SISTEMA DE REVISÃO - EM DESENVOLVIMENTO

### Curva de Esquecimento
- [x] Implementar algoritmo de espaçamento (1, 7, 30, 90 dias)
- [x] Calcular próxima data de revisão automaticamente
- [x] Agendar revisões baseadas na curva de esquecimento
- [ ] Permitir ajuste manual do intervalo de revisão (futuro)

### Interface de Revisão
- [x] Criar calendário de revisões programadas
- [x] Mostrar revisões pendentes do dia
- [x] Implementar interface de revisão de metas
- [x] Implementar interface de revisão de aulas
- [x] Implementar interface de revisão de questões
- [x] Permitir marcar revisão como concluída
- [x] Permitir adiar revisão

### Estatísticas de Revisão
- [x] Mostrar total de revisões realizadas
- [x] Mostrar taxa de cumprimento de revisões
- [x] Mostrar próximas revisões agendadas
- [ ] Gráfico de evolução de revisões (futuro)

---


---

## 🚀 PLANO DE 16 HORAS - BACKEND/FRONTEND METAS + FUNCIONALIDADES ALUNOS

### FASE 1: Backend de Metas (3-4h)
- [x] API `metas.create` - Criar nova meta
- [x] API `metas.update` - Atualizar meta existente
- [x] API `metas.delete` - Excluir meta
- [x] API `metas.marcarConcluida` - Marcar meta como concluída
- [ ] API `metas.ajustarTempo` - Ajustar duração da meta
- [ ] API `metas.redistribuir` - Redistribuir metas quando tempo do dia muda
- [x] API `metas.adicionarAnotacao` - Adicionar/editar anotação da meta
- [x] API `metas.vincularAula` - Vincular aula à meta
- [ ] API `metas.vincularQuestoes` - Vincular questões à meta
- [ ] Algoritmo de realocação de metas (aumento de tempo)
- [ ] Algoritmo de prorrogação de metas (diminuição de tempo)
- [ ] Sistema de progresso e tempo dedicado
- [ ] Histórico de sessões de estudo
- [ ] Criação automática de revisões ao concluir meta

### FASE 2: Frontend de Metas Individuais (2-3h)
- [ ] Salvar edições de meta no backend
- [ ] Persistir anotações no banco
- [ ] Atualizar UI em tempo real
- [ ] Cronômetro com persistência no backend
- [ ] Recuperar tempo ao reabrir meta
- [ ] Editor rich text real (TipTap)
- [ ] Detecção e embed automático de vídeos
- [ ] Gravação de áudio com MediaRecorder
- [ ] Upload de áudio para S3
- [ ] Player de áudio inline

### FASE 3: Visualização Meta a Meta (1-2h)
- [ ] Carregar metas do backend com paginação
- [ ] Ordenação por múltiplos critérios
- [ ] Filtros persistentes
- [ ] Ações em lote
- [ ] Cards expandidos com preview
- [ ] Sincronização calendário ↔ lista

### FASE 4: Funcionalidades Principais dos Alunos (4-5h)
- [x] Backend: CRUD de progresso de aulas
- [x] Marcar aula como assistida
- [x] Salvar ponto de parada do vídeo
- [ ] Anotações por aula com timestamps
- [ ] Player de vídeo com controles avançados
- [x] Backend: Salvar respostas de questões
- [x] Histórico completo de respostas
- [x] Estatísticas por disciplina/assunto
- [ ] Modo simulado de questões
- [ ] Relatório de desempenho detalhado
- [ ] Dashboard com dados reais do backend
- [ ] Gráficos de horas estudadas
- [ ] Gráficos de metas concluídas
- [ ] Perfil do aluno editável
- [ ] Upload de foto de perfil para S3
- [ ] Sistema de notificações

### FASE 5: Integração e Refinamentos (2-3h)
- [ ] Vincular metas → aulas (backend + frontend)
- [ ] Vincular metas → questões (backend + frontend)
- [ ] Lazy loading de componentes
- [ ] Otimização de queries
- [ ] Validação com Zod
- [ ] Seed do banco com dados completos
- [ ] Testes de fluxos principais

### FASE 6: Funcionalidades Avançadas (3-4h)
- [ ] Sistema de pontos e conquistas
- [ ] Níveis de progresso
- [ ] Sequência de dias (streak)
- [ ] Relatórios semanais e mensais
- [ ] Exportar relatórios em PDF
- [ ] Service Worker para modo offline
- [ ] Melhorias de acessibilidade
- [ ] Documentação completa


## 📊 ESTATÍSTICAS AVANÇADAS DE QUESTÕES

### Backend - APIs de Estatísticas
- [x] API `questoes.estatisticasPorDisciplina` - Taxa de acerto por disciplina
- [ ] API `questoes.estatisticasPorAssunto` - Taxa de acerto por assunto (futuro)
- [ ] API `questoes.estatisticasPorBanca` - Taxa de acerto por banca (futuro)
- [x] API `questoes.evolucaoTemporal` - Evolução de acertos ao longo do tempo
- [x] API `questoes.questoesMaisErradas` - Top 10 questões mais erradas
- [ ] API `questoes.tempoMedioPorDisciplina` - Tempo médio de resposta por disciplina (futuro)

### Frontend - Visualizações
- [x] Página de Estatísticas Avançadas criada
- [x] Cards - Estatísticas gerais (total, taxa de acerto, acertos, erros)
- [x] Barras de progresso - Desempenho por disciplina
- [x] Lista - Evolução temporal (últimos 30 dias)
- [x] Cards - Questões mais erradas com ranking
- [x] Botão de acesso na página de Questões
- [ ] Gráficos interativos (Chart.js ou Recharts) (futuro)
- [ ] Filtro de período (7 dias, 30 dias, 90 dias, tudo) (futuro)
- [ ] Exportar relatório em PDF (futuro)


## ✅ PROGRESSO DO PLANO DE 16H (7h/16h concluídas)

### Concluído
- [x] 18 APIs tRPC funcionais (metas, aulas, questões, estatísticas)
- [x] Sistema de Questões com backend integrado
- [x] Estatísticas avançadas de questões (3 APIs + página dedicada)
- [x] Página de visualização de aula com player de vídeo
- [x] Sistema de anotações em aulas
- [x] Salvamento automático de progresso de aulas
- [x] Fórum interativo completo
- [x] Sistema de Revisão com Curva de Esquecimento
- [x] Página de Materiais completa
- [x] Dashboard Administrativo com controle de acesso por perfil

### Em Andamento
- [ ] Gamificação (pontos, badges, ranking)
- [ ] Dashboard com dados reais do backend
- [ ] Sistema de perfil do aluno editável
- [ ] Upload de foto de perfil para S3
- [ ] Mais componentes administrativos
- [ ] Otimizações e refinamentos


## 🎮 SISTEMA DE GAMIFICAÇÃO

### Backend - Sistema de Pontos
- [x] Adicionar campo `pontos` à tabela users
- [x] Criar tabela `conquistas` (badges/achievements)
- [x] Criar tabela `userConquistas` (relação many-to-many)
- [x] API para calcular pontos por ação (meta concluída: 10pts, aula assistida: 15pts, questão correta: 5pts)
- [x] API para atribuir conquistas automaticamente
- [x] API para buscar ranking de usuários

### Frontend - Visualizações
- [x] Card de pontos no dashboard
- [x] Seção de conquistas/badges no dashboard
- [x] Card de ranking geral no dashboard
- [ ] Animações ao ganhar pontos (futuro)
- [ ] Notificações ao desbloquear conquistas (futuro)
- [ ] Barra de progresso para próxima conquista (futuro)

### Conquistas Planejadas
- [ ] "Primeiro Passo" - Concluir primeira meta
- [ ] "Estudioso" - Concluir 10 metas
- [ ] "Dedicado" - Estudar 7 dias consecutivos
- [ ] "Mestre" - Acertar 100 questões
- [ ] "Perfeito" - 100% de acerto em 10 questões seguidas


## ✅ ATUALIZAÇÃO - INTEGRAÇÃO AUTOMÁTICA DE PONTOS (Concluída)

### Backend - Atribuição Automática de Pontos
- [x] Integrar `adicionarPontos()` em `marcarMetaConcluida` (+10 pontos)
- [x] Integrar `adicionarPontos()` em `marcarAulaConcluida` (+5 pontos)
- [x] Integrar `adicionarPontos()` em `salvarRespostaQuestao` (+2 pontos para respostas corretas)
- [x] Chamar `verificarEAtribuirConquistas()` após cada ação pontuada
- [x] Implementar função completa `verificarEAtribuirConquistas()` com todas as conquistas
- [x] Modificar funções para retornar conquistas desbloqueadas nos responses
- [x] Incluir detalhes completos das conquistas (id, nome, descrição, ícone)

### Conquistas Criadas no Banco
- [x] Primeira Meta (🎯) - Complete sua primeira meta de estudos
- [x] Estudante Dedicado (📚) - Complete 10 metas de estudos
- [x] Mestre das Metas (🏆) - Complete 50 metas de estudos
- [x] Primeira Aula (🎬) - Assista sua primeira aula completa
- [x] Cinéfilo dos Estudos (🎥) - Assista 20 aulas completas
- [x] Maratonista (🌟) - Assista 100 aulas completas
- [x] Primeira Questão (✅) - Responda sua primeira questão corretamente
- [x] Acertador (💯) - Acerte 50 questões
- [x] Expert (🎓) - Acerte 200 questões
- [x] Sequência de Fogo (🔥) - Acerte 10 questões seguidas
- [x] Pontuador (⭐) - Alcance 100 pontos
- [x] Campeão (👑) - Alcance 500 pontos
- [x] Lenda (💎) - Alcance 1000 pontos

### Lógica Implementada
- [x] Verificação de conquistas por metas concluídas (1, 10, 50)
- [x] Verificação de conquistas por aulas assistidas (1, 20, 100)
- [x] Verificação de conquistas por questões corretas (1, 50, 200)
- [x] Verificação de sequência de 10 acertos consecutivos
- [x] Verificação de conquistas por pontos totais (100, 500, 1000)
- [x] Prevenção de conquistas duplicadas
- [x] Retorno de IDs de conquistas desbloqueadas

### Dashboard Integrado com Backend
- [x] Criar API `dashboard.estatisticas` para buscar dados reais
- [x] Implementar função `getEstatisticasDashboard` no backend
- [x] Substituir mockData por dados reais do tRPC no Dashboard
- [x] Adicionar verificações de segurança para stats nulos/undefined
- [x] Calcular horas estudadas, metas concluídas, aulas assistidas, questões resolvidas
- [x] Calcular taxa de acerto e sequência de dias

### Status: ✅ COMPLETO
Sistema de gamificação totalmente funcional com atribuição automática de pontos e conquistas em tempo real. Dashboard integrado com dados reais do backend.


## 🔔 NOTIFICAÇÕES DE CONQUISTAS

### Frontend - Sistema de Notificações
- [x] Criar componente ConquistaToast para notificações de conquistas
- [x] Adicionar animação de entrada/saída para toasts (translate-x + opacity)
- [x] Exibir ícone, nome e descrição da conquista desbloqueada
- [x] Implementar fila de notificações (múltiplas conquistas com indicadores)
- [x] Auto-fechar após 5 segundos
- [x] Botão de fechar manual
- [x] Design com gradiente amarelo/dourado e animação bounce

### Backend - Retorno de Conquistas
- [x] Modificar APIs para retornar conquistas desbloqueadas
- [x] Incluir detalhes completos da conquista (nome, descrição, ícone)
- [x] Retornar array de conquistas em cada resposta de ação pontuada

### Hook Customizado
- [x] Criar useConquistaNotification hook
- [x] Gerenciar estado de conquistas
- [x] Funções mostrarConquistas e limparConquistas

### Integração Frontend-Backend
- [x] Integrar ConquistaToast na página Plano
- [x] Modificar handleConcluirMeta para usar API tRPC real
- [x] Capturar conquistas desbloqueadas nas respostas das APIs
- [x] Exibir toast automaticamente ao receber conquista
- [ ] Integrar em página de Aulas
- [ ] Integrar em página de Questões
- [ ] Atualizar componente ConquistasCard após desbloquear
- [ ] Invalidar cache de conquistas após nova conquista

### Dados de Teste Criados
- [x] 5 metas de diferentes disciplinas inseridas
- [x] 5 aulas com vídeos e descrições inseridas
- [x] 5 questões de múltipla escolha com gabaritos inseridas
- [x] Dados prontos para testar sistema completo de gamificação

### Status: ✅ EM PROGRESSO
Sistema de notificações implementado na página Plano. Dados de teste criados. Próximo: integrar em Aulas e Questões.


## 📋 CRIAÇÃO DE PLANOS - PAINEL ADMINISTRATIVO

### Botão de Expandir/Colapsar Menu Lateral
- [x] Adicionar botão de toggle no header/sidebar
- [x] Implementar estado de collapsed/expanded
- [x] Persistir estado no localStorage
- [x] Adicionar animação de transição suave (duration-300)
- [x] Ajustar layout do conteúdo principal quando menu colapsa
- [x] Funciona em todas as páginas (implementado no DOMLayout)
- [x] Botão circular com ícone de chevron
- [x] Ocultar textos quando colapsado, manter apenas ícones

### Página de Administração de Planos
- [x] Criar componente GestaoPlanos
- [x] Listar todos os planos existentes
- [x] Botões de ação: criar, editar, excluir, ativar/desativar
- [x] Visualização em cards com estatísticas
- [x] Toggle de ativo/inativo visual
- [x] Integrado na tab de planos do Admin

### Criação Manual de Planos
- [x] Modal de criação/edição de plano
- [x] Formulário: nome, tipo, duração, concurso/área
- [x] Configurações: horas diárias padrão
- [x] Validações de formulário
- [x] Modo criação e edição no mesmo modal
- [ ] Adicionar metas ao plano (próxima fase)
- [ ] Interface drag-and-drop para ordenar metas (próxima fase)

### Importação via Planilha
- [x] Botão "Importar via Planilha"
- [x] Modal de importação
- [x] Upload de arquivo Excel/CSV
- [x] Botão para baixar template
- [x] Instruções de formato da planilha
- [x] Função backend de importação
- [x] Importação em lote de planos e metas
- [ ] Preview dos dados importados (próxima fase)
- [ ] Validação avançada de dados (próxima fase)

### Backend - APIs de Planos
- [x] API para criar plano (planos.admin.create)
- [x] API para atualizar plano (planos.admin.update)
- [x] API para deletar plano (planos.admin.delete)
- [x] API para listar todos os planos (planos.admin.listAll)
- [x] API para toggle ativo/inativo (planos.admin.toggleAtivo)
- [x] API para buscar plano com estatísticas (planos.admin.getComEstatisticas)
- [x] API para importar planilha (planos.admin.importarPlanilha)
- [x] Validações com Zod
- [x] Funções no db.ts: getAllPlanos, updatePlano, deletePlano, togglePlanoAtivo, getPlanoComEstatisticas, importarPlanosDeExcel

### Permissões e Segurança
- [x] Verificar role de usuário (master, mentor, administrativo)
- [x] Proteger rotas administrativas com protectedProcedure
- [x] Permissões diferenciadas: delete apenas para master/mentor
- [x] Confirmação antes de deletar planos (confirm dialog)
- [x] Verificação de matrículas ativas antes de deletar
- [ ] Logs de ações administrativas (próxima fase)

### Status: ✅ FUNCIONALIDADES PRINCIPAIS COMPLETAS
- Botão de expandir/colapsar menu lateral funcionando
- Sistema de gestão de planos completo com CRUD
- Integração frontend-backend via tRPC
- Importação via planilha implementada
- Permissões e segurança configuradas
