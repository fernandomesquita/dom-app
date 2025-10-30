# 📋 Levantamento Detalhado: Planos de Estudos e Metas

**Data:** 30/10/2025  
**Projeto:** DOM - Plataforma de Mentoria  
**Versão:** c1baf3a7

---

## 📊 ANÁLISE DO SISTEMA ATUAL

### ✅ O que já existe

**Banco de Dados:**
- ✅ Tabela `planos` (15 campos completos)
- ✅ Tabela `metas` (13 campos com ordem, dica, cores)
- ✅ Tabela `matriculas` (relacionamento aluno-plano)
- ✅ Tabela `progresso_metas` (tracking de conclusão)
- ✅ Tabela `aulas` (repositório de conteúdo)
- ✅ Tabela `progresso_aulas` (tracking de visualização)

**Backend (APIs tRPC):**
- ✅ `planos.list` - Listar todos os planos
- ✅ `planos.getById` - Buscar plano por ID
- ✅ `planos.create` - Criar novo plano
- ✅ `planos.importarPlanilha` - Importar metas via Excel
- ✅ `metas.list` - Listar metas de um plano
- ✅ `metas.create` - Criar meta individual
- ✅ `metas.update` - Atualizar meta
- ✅ `metas.delete` - Deletar meta
- ✅ `metas.concluir` - Marcar meta como concluída
- ✅ `metas.moverParaCima/Baixo` - Reordenar metas

**Frontend:**
- ✅ Página `/plano` - Visualização do cronograma semanal
- ✅ Componente `CriarPlano` - Modal de criação de plano
- ✅ Componente `MetaModal` - Visualização e conclusão de metas
- ✅ Calendário semanal com navegação
- ✅ Boxes de metas coloridos
- ✅ Sistema de cores personalizáveis

---

## 🚨 GAPS IDENTIFICADOS (O que falta)

### 1. CRIAÇÃO E GESTÃO DE PLANOS

#### 1.1 Interface Administrativa Completa
- [ ] Página `/admin/planos` - Listagem de todos os planos
- [ ] Filtros: ativo/inativo, tipo (pago/gratuito), órgão, cargo
- [ ] Busca por nome/descrição
- [ ] Cards com preview de informações
- [ ] Botões de ação: Editar, Duplicar, Ativar/Desativar, Excluir
- [ ] Contador de alunos matriculados por plano
- [ ] Indicador de metas cadastradas

#### 1.2 Edição de Planos
- [ ] Modal/Página de edição de plano existente
- [ ] Editar todos os campos (nome, descrição, duração, etc)
- [ ] Editar mensagem pós-plano (rich text editor)
- [ ] Editar link pós-plano
- [ ] Toggle para exibir/ocultar mensagem pós-plano
- [ ] Preview da mensagem pós-plano
- [ ] Histórico de alterações

#### 1.3 Duplicação de Planos
- [ ] Botão "Duplicar Plano"
- [ ] Copiar todas as metas com ordem preservada
- [ ] Permitir editar nome antes de duplicar
- [ ] Opção de incluir/excluir metas específicas

#### 1.4 Exclusão Segura
- [ ] Confirmação com contagem de alunos afetados
- [ ] Opção de transferir alunos para outro plano
- [ ] Soft delete (manter histórico)
- [ ] Impossibilitar exclusão se houver alunos ativos

---

### 2. GESTÃO DE METAS

#### 2.1 Interface de Gestão de Metas
- [ ] Página `/admin/planos/:id/metas` - Gestão de metas do plano
- [ ] Listagem em tabela com todas as informações
- [ ] Drag-and-drop para reordenação
- [ ] Edição inline de campos simples
- [ ] Filtros: disciplina, tipo, incidência
- [ ] Busca por assunto
- [ ] Visualização em árvore (disciplina > assunto)
- [ ] Estatísticas: total de horas, distribuição por tipo

#### 2.2 Criação Manual de Metas
- [ ] Modal "Adicionar Meta"
- [ ] Campos: disciplina, assunto, tipo, duração, incidência
- [ ] Campo de dica de estudo (textarea)
- [ ] Seletor de cor personalizada
- [ ] Preview da meta
- [ ] Validações de campos obrigatórios
- [ ] Sugestão de ordem automática

#### 2.3 Edição de Metas
- [ ] Modal "Editar Meta"
- [ ] Todos os campos editáveis
- [ ] Histórico de alterações
- [ ] Preview antes de salvar
- [ ] Indicador de impacto (quantos alunos afetados)

#### 2.4 Importação via Planilha
- [ ] Template Excel profissional com instruções
- [ ] Aba "Instruções" detalhada
- [ ] Aba "Exemplo" com 10+ metas de exemplo
- [ ] Aba "Dados" para preenchimento
- [ ] Parser robusto (xlsx)
- [ ] Validação de estrutura
- [ ] Validação de dados (duração > 0, tipo válido, etc)
- [ ] Preview antes de importar
- [ ] Relatório de erros por linha
- [ ] Opção de substituir ou adicionar metas existentes
- [ ] Preservar ordem da planilha

#### 2.5 Exclusão de Metas
- [ ] Confirmação com contagem de alunos afetados
- [ ] Indicar se há progresso registrado
- [ ] Soft delete (manter histórico)
- [ ] Recalcular ordem das metas restantes

---

### 3. DISTRIBUIÇÃO INTELIGENTE (CICLO EARA)

#### 3.1 Algoritmo de Distribuição
- [ ] Criar função `distribuirMetasInteligente()`
- [ ] Considerar horas diárias do aluno
- [ ] Considerar dias de estudo da semana
- [ ] Respeitar duração total do plano
- [ ] Priorizar por incidência (alta > média > baixa)
- [ ] Alternar disciplinas para evitar fadiga
- [ ] Espaçar revisões (curva de esquecimento)
- [ ] Distribuir questões uniformemente
- [ ] Evitar sobrecarga diária (max 8h)

#### 3.2 Parâmetros Configuráveis
- [ ] Percentual de tempo para estudo vs revisão vs questões
- [ ] Intervalo mínimo entre revisões (dias)
- [ ] Máximo de horas por disciplina por dia
- [ ] Prioridade de disciplinas (peso)
- [ ] Dias de descanso obrigatório
- [ ] Flexibilidade de ajuste (+/- X%)

#### 3.3 Recalculo Automático
- [ ] Recalcular ao alterar horas diárias
- [ ] Recalcular ao alterar dias de estudo
- [ ] Recalcular ao adicionar/remover metas
- [ ] Recalcular ao pausar/retomar cronograma
- [ ] Manter metas já concluídas fixas
- [ ] Notificar aluno sobre mudanças

---

### 4. CRONOGRAMA DO ALUNO

#### 4.1 Visualização Aprimorada
- [ ] Calendário mensal (além do semanal)
- [ ] Visualização em lista (todas as metas)
- [ ] Visualização em timeline
- [ ] Filtros: disciplina, tipo, status
- [ ] Busca por assunto
- [ ] Legenda de cores
- [ ] Indicador de progresso geral (%)
- [ ] Indicador de progresso por disciplina

#### 4.2 Interação com Metas
- [ ] Clicar para expandir detalhes
- [ ] Botão "Iniciar Estudo" (timer)
- [ ] Botão "Concluir" com confirmação
- [ ] Botão "Adiar" (mover para outro dia)
- [ ] Botão "Pular" (não fazer)
- [ ] Adicionar anotações pessoais
- [ ] Avaliar dificuldade (1-5 estrelas)
- [ ] Link direto para aula relacionada
- [ ] Link direto para questões relacionadas

#### 4.3 Timer de Estudo
- [ ] Cronômetro integrado na meta
- [ ] Pausar/retomar
- [ ] Registrar tempo real gasto
- [ ] Notificação ao atingir duração prevista
- [ ] Opção de estender tempo
- [ ] Histórico de sessões de estudo

#### 4.4 Personalização do Cronograma
- [ ] Modal "Configurar Cronograma"
- [ ] Slider de horas diárias (1-12h)
- [ ] Checkboxes de dias da semana
- [ ] Botão "Pausar Cronograma"
- [ ] Botão "Retomar Cronograma"
- [ ] Botão "Reiniciar do Zero"
- [ ] Preview do impacto das mudanças
- [ ] Confirmação antes de aplicar

#### 4.5 Arrastar e Soltar
- [ ] Drag-and-drop de metas entre dias
- [ ] Reordenar metas dentro do mesmo dia
- [ ] Validação de limite de horas por dia
- [ ] Atualizar automaticamente no backend
- [ ] Feedback visual durante drag
- [ ] Desfazer última ação

---

### 5. PROGRESSO E ESTATÍSTICAS

#### 5.1 Dashboard de Progresso
- [ ] Card "Progresso Geral" (%)
- [ ] Card "Horas Estudadas" (total e semanal)
- [ ] Card "Metas Concluídas" (X/Y)
- [ ] Card "Sequência de Dias"
- [ ] Card "Média Diária"
- [ ] Gráfico de evolução semanal
- [ ] Gráfico de distribuição por disciplina
- [ ] Gráfico de tipos de atividade (estudo/revisão/questões)

#### 5.2 Progresso por Disciplina
- [ ] Tabela com todas as disciplinas
- [ ] Barra de progresso por disciplina
- [ ] Horas estudadas vs previstas
- [ ] Metas concluídas vs totais
- [ ] Indicador de atraso (vermelho/amarelo/verde)
- [ ] Botão "Focar nesta disciplina"

#### 5.3 Relatórios Exportáveis
- [ ] Relatório semanal (PDF)
- [ ] Relatório mensal (PDF)
- [ ] Relatório completo do plano (PDF)
- [ ] Exportar dados em Excel
- [ ] Exportar dados em CSV
- [ ] Gráficos incluídos no PDF
- [ ] Comparativo entre períodos

#### 5.4 Metas Atrasadas
- [ ] Listagem de metas não concluídas no prazo
- [ ] Indicador de dias de atraso
- [ ] Botão "Reagendar"
- [ ] Botão "Marcar como Concluída"
- [ ] Botão "Pular"
- [ ] Sugestão de redistribuição

---

### 6. VINCULAÇÃO COM CONTEÚDO

#### 6.1 Vincular Aulas às Metas
- [ ] Campo "Aulas Relacionadas" na meta
- [ ] Busca de aulas por disciplina/assunto
- [ ] Multi-seleção de aulas
- [ ] Ordenar aulas por relevância
- [ ] Exibir aulas na modal da meta
- [ ] Botão "Assistir Aula" direto da meta
- [ ] Marcar meta como concluída ao assistir aula

#### 6.2 Vincular Questões às Metas
- [ ] Campo "Questões Relacionadas" na meta
- [ ] Busca de questões por disciplina/assunto
- [ ] Quantidade sugerida de questões
- [ ] Exibir questões na modal da meta
- [ ] Botão "Resolver Questões" direto da meta
- [ ] Marcar meta como concluída ao atingir X% de acerto

#### 6.3 Materiais de Apoio
- [ ] Campo "Materiais" na meta
- [ ] Upload de PDFs
- [ ] Links externos
- [ ] Exibir materiais na modal da meta
- [ ] Download direto
- [ ] Contador de downloads

---

### 7. MENSAGEM PÓS-PLANO

#### 7.1 Configuração
- [ ] Rich text editor para mensagem
- [ ] Suporte a HTML/Markdown
- [ ] Upload de imagens
- [ ] Preview em tempo real
- [ ] Campo de link (URL)
- [ ] Texto do botão do link
- [ ] Toggle "Exibir mensagem"
- [ ] Templates pré-definidos

#### 7.2 Exibição para o Aluno
- [ ] Modal automático ao concluir última meta
- [ ] Design celebratório (confetes, animação)
- [ ] Mensagem personalizada
- [ ] Botão de ação (link)
- [ ] Opção de compartilhar conquista
- [ ] Certificado de conclusão (PDF)

---

### 8. DISCIPLINAS RECORRENTES

#### 8.1 Configuração
- [ ] Página "Disciplinas Recorrentes"
- [ ] Adicionar disciplina recorrente
- [ ] Configurar duração (15, 30, 45, 60 min)
- [ ] Configurar frequência (diária, dias específicos)
- [ ] Configurar horário preferencial
- [ ] Ativar/desativar por aluno
- [ ] Preview de impacto no cronograma

#### 8.2 Distribuição Automática
- [ ] Inserir automaticamente no cronograma
- [ ] Respeitar dias de estudo do aluno
- [ ] Evitar conflito com outras metas
- [ ] Priorizar horário preferencial
- [ ] Permitir mover manualmente

---

### 9. GERAÇÃO INTELIGENTE POR IA (FUTURO)

#### 9.1 Análise de Edital
- [ ] Upload de PDF do edital
- [ ] Extração de texto (OCR se necessário)
- [ ] Identificação de disciplinas
- [ ] Identificação de assuntos
- [ ] Identificação de pesos/pontos
- [ ] Classificação de incidência

#### 9.2 Geração de Plano
- [ ] Sugerir duração total
- [ ] Sugerir distribuição de horas
- [ ] Gerar lista de metas
- [ ] Preencher dicas de estudo (IA)
- [ ] Sugerir ordem de estudo
- [ ] Gerar planilha pré-preenchida

#### 9.3 Fine-tuning Manual
- [ ] Interface de revisão
- [ ] Editar metas sugeridas
- [ ] Adicionar/remover metas
- [ ] Ajustar durações
- [ ] Ajustar ordem
- [ ] Aprovar e importar

---

## 📊 ESTIMATIVA DE TRABALHO

### 🚨 CRÍTICO (Essencial para MVP)

**1. Interface de Gestão de Planos (6-8h)**
- Listagem de planos
- Edição de planos
- Duplicação de planos
- Exclusão segura

**2. Interface de Gestão de Metas (8-10h)**
- Listagem/tabela de metas
- Criação manual de metas
- Edição de metas
- Reordenação (drag-and-drop)
- Exclusão de metas

**3. Importação de Metas via Planilha (4-6h)**
- Template Excel profissional
- Parser robusto
- Validações
- Preview e relatório de erros

**4. Cronograma do Aluno Aprimorado (10-12h)**
- Visualização mensal
- Interação com metas (iniciar, concluir, adiar)
- Timer de estudo
- Personalização (horas, dias)
- Arrastar e soltar

**5. Progresso e Estatísticas (6-8h)**
- Dashboard de progresso
- Progresso por disciplina
- Metas atrasadas
- Gráficos básicos

**TOTAL CRÍTICO: 34-44 horas**

---

### ⚠️ IMPORTANTE (Melhora significativa)

**6. Distribuição Inteligente (EARA) (12-16h)**
- Algoritmo de distribuição
- Parâmetros configuráveis
- Recalculo automático

**7. Vinculação com Conteúdo (8-10h)**
- Vincular aulas às metas
- Vincular questões às metas
- Materiais de apoio

**8. Mensagem Pós-Plano (4-6h)**
- Rich text editor
- Exibição celebratória
- Certificado de conclusão

**9. Disciplinas Recorrentes (6-8h)**
- Configuração
- Distribuição automática

**TOTAL IMPORTANTE: 30-40 horas**

---

### 📊 NICE TO HAVE (Diferencial)

**10. Relatórios Exportáveis (6-8h)**
- PDFs profissionais
- Excel/CSV
- Comparativos

**11. Geração por IA (20-30h)**
- Análise de edital
- Geração automática
- Fine-tuning

**TOTAL NICE TO HAVE: 26-38 horas**

---

## 🎯 PLANOS DE IMPLEMENTAÇÃO

### CENÁRIO 1: MVP Rápido (34-44h)
Implementar apenas o CRÍTICO. Sistema funcional para criar planos, gerenciar metas e acompanhar progresso.

### CENÁRIO 2: Lançamento Completo (64-84h)
CRÍTICO + IMPORTANTE. Sistema robusto com distribuição inteligente, vinculação de conteúdo e gamificação.

### CENÁRIO 3: Premium (90-122h)
Tudo. Sistema profissional completo com IA e relatórios avançados.

---

## 💡 RECOMENDAÇÃO

**Começar pelo CENÁRIO 1 (34-44h)** para ter um sistema funcional rapidamente, depois evoluir para o CENÁRIO 2.

**Prioridade máxima:**
1. Interface de Gestão de Metas (mais urgente)
2. Importação via Planilha (facilita cadastro em massa)
3. Cronograma do Aluno Aprimorado (UX crítica)
4. Interface de Gestão de Planos
5. Progresso e Estatísticas

---

**Posso começar pela feature mais crítica?**
