# 📋 PLANO DE TRABALHO: SISTEMA DE GESTÃO DE ALUNOS

**Duração Total Estimada:** 8-10 horas  
**Data de Início:** 30/10/2025  
**Prioridade:** Alta

---

## 🎯 OBJETIVOS

Implementar um sistema completo de gestão de alunos que permita:
- Cadastro individual e em lote de alunos
- Edição de dados pessoais e perfil
- Atribuição e gerenciamento de planos de estudo
- Acompanhamento de progresso e desempenho
- Comunicação e notificações
- Relatórios e analytics

---

## 📊 FASE 1: BACKEND - DADOS E PERFIL DO ALUNO (2h)

### 1.1 Schema do Banco de Dados (30min)
- [ ] Adicionar campos ao schema `users`:
  - `cpf` VARCHAR(14) UNIQUE (formato: 000.000.000-00)
  - `telefone` VARCHAR(20)
  - `dataNascimento` DATE
  - `endereco` TEXT (JSON: rua, numero, complemento, bairro, cidade, estado, cep)
  - `foto` VARCHAR(500) (URL S3)
  - `bio` TEXT
  - `status` ENUM('ativo', 'inativo', 'suspenso')
  - `observacoes` TEXT (notas internas do admin)
- [ ] Executar migration `pnpm db:push`

### 1.2 Funções no db.ts (45min)
- [ ] `updateUser(id, data)` - Atualizar dados do usuário
- [ ] `getUserById(id)` - Buscar usuário completo por ID
- [ ] `getUsersByCPF(cpf)` - Buscar por CPF (validação de duplicatas)
- [ ] `toggleUserStatus(id, status)` - Ativar/Inativar/Suspender usuário
- [ ] `getAlunosComProgresso()` - Lista alunos com estatísticas de progresso
- [ ] `importarAlunosCSV(dados)` - Importar múltiplos alunos de CSV/Excel

### 1.3 APIs tRPC (45min)
- [ ] `admin.usuarios.list` - Listar todos os usuários (com filtros)
- [ ] `admin.usuarios.getById` - Buscar usuário por ID
- [ ] `admin.usuarios.create` - Criar novo usuário
- [ ] `admin.usuarios.update` - Atualizar usuário existente
- [ ] `admin.usuarios.delete` - Excluir usuário (soft delete)
- [ ] `admin.usuarios.toggleStatus` - Ativar/Inativar/Suspender
- [ ] `admin.usuarios.importarCSV` - Importar planilha de alunos
- [ ] Validações com Zod para todos os campos

---

## 📊 FASE 2: FRONTEND - GESTÃO DE USUÁRIOS (2h30)

### 2.1 Integração com Backend Real (30min)
- [ ] Substituir dados mockados por `trpc.admin.usuarios.list.useQuery()`
- [ ] Implementar loading states e error handling
- [ ] Adicionar refetch automático após operações

### 2.2 Formulário de Cadastro/Edição Completo (1h)
- [ ] Criar componente `FormularioUsuario.tsx`
- [ ] Campos básicos: nome, email, CPF, telefone, data de nascimento
- [ ] Campo de endereço (rua, número, complemento, bairro, cidade, estado, CEP)
- [ ] Campo de perfil/role (select)
- [ ] Campo de observações internas (textarea)
- [ ] Upload de foto de perfil para S3
- [ ] Validação de CPF (formato e dígitos verificadores)
- [ ] Validação de email único
- [ ] Máscaras de input (CPF, telefone, CEP)
- [ ] Integração com mutations tRPC

### 2.3 Visualização Detalhada do Aluno (1h)
- [ ] Criar componente `PerfilAlunoModal.tsx`
- [ ] Seção de dados pessoais (foto, nome, email, CPF, telefone, endereço)
- [ ] Seção de plano atual (nome, progresso, metas concluídas)
- [ ] Seção de estatísticas (horas estudadas, questões resolvidas, taxa de acerto)
- [ ] Seção de histórico de atividades (últimas ações)
- [ ] Botões de ação: Editar, Atribuir Plano, Enviar Mensagem, Ver Fórum
- [ ] Integração com `trpc.admin.usuarios.getById`

---

## 📊 FASE 3: IMPORTAÇÃO EM LOTE (1h30)

### 3.1 Template de Planilha (30min)
- [ ] Criar função `gerarTemplateAlunos()` em `/utils`
- [ ] Colunas: Nome, Email, CPF, Telefone, Data Nascimento, Endereço, Perfil
- [ ] Aba "Instruções" com guia de preenchimento
- [ ] Aba "Exemplo" com 3 linhas de dados de exemplo
- [ ] Botão "Baixar Template" na página de gestão

### 3.2 Componente de Importação (1h)
- [ ] Criar componente `ImportarAlunos.tsx`
- [ ] Upload drag-and-drop de arquivo Excel/CSV
- [ ] Parser de planilha (biblioteca `xlsx`)
- [ ] Validação de estrutura (colunas obrigatórias)
- [ ] Preview de dados em tabela antes de importar
- [ ] Validação de CPF duplicado
- [ ] Validação de email duplicado
- [ ] Relatório de erros (linhas com problemas)
- [ ] Importação em lote via `trpc.admin.usuarios.importarCSV`
- [ ] Feedback de progresso (X de Y importados)

---

## 📊 FASE 4: ATRIBUIÇÃO E GESTÃO DE PLANOS (2h)

### 4.1 Melhorias no Componente AtribuirPlano (1h)
- [ ] Adicionar filtros na listagem de alunos (nome, email, plano atual)
- [ ] Exibir alunos SEM plano atribuído em destaque
- [ ] Permitir atribuir múltiplos alunos ao mesmo plano (seleção em massa)
- [ ] Configurar data de início personalizada por aluno
- [ ] Configurar horas diárias personalizadas por aluno
- [ ] Configurar dias de estudo personalizados por aluno
- [ ] Botão "Renovar Plano" para alunos com plano expirado

### 4.2 Gestão de Matrículas (1h)
- [ ] Criar componente `GestaoMatriculas.tsx`
- [ ] Listagem de todas as matrículas ativas
- [ ] Filtros: aluno, plano, status (ativo/expirado/cancelado)
- [ ] Ações: Editar, Cancelar, Renovar, Pausar
- [ ] Modal de edição de matrícula (alterar datas, horas, dias)
- [ ] Função de pausar matrícula (congela progresso)
- [ ] Função de renovar matrícula (estende data de término)
- [ ] Histórico de alterações de matrícula

---

## 📊 FASE 5: ACOMPANHAMENTO E RELATÓRIOS (2h)

### 5.1 Dashboard Individual do Aluno (Admin) (1h)
- [ ] Criar componente `DashboardAlunoAdmin.tsx`
- [ ] Gráfico de progresso semanal (horas estudadas, metas concluídas)
- [ ] Gráfico de desempenho em questões por disciplina
- [ ] Lista de metas atrasadas
- [ ] Lista de metas próximas (próximos 7 dias)
- [ ] Histórico de login e atividades
- [ ] Tempo médio de estudo por dia
- [ ] Dias consecutivos de estudo (streak)
- [ ] Integração com APIs existentes de dashboard

### 5.2 Relatórios Comparativos (1h)
- [ ] Criar componente `RelatoriosAlunos.tsx`
- [ ] Relatório de engajamento (alunos ativos vs inativos)
- [ ] Relatório de conclusão de planos (taxa de conclusão por plano)
- [ ] Ranking de alunos por desempenho (pontos, horas, metas)
- [ ] Relatório de abandono (alunos que pararam de estudar)
- [ ] Exportar relatórios para Excel/PDF
- [ ] Filtros por período, plano, perfil

---

## 📊 FASE 6: COMUNICAÇÃO E NOTIFICAÇÕES (30min)

### 6.1 Sistema de Mensagens Internas (30min)
- [ ] Criar tabela `mensagens_admin` no banco
- [ ] API `admin.enviarMensagem(userId, assunto, conteudo)`
- [ ] API `aluno.minhasMensagens()` - Listar mensagens recebidas
- [ ] Componente `MensagensAdmin.tsx` no painel do aluno
- [ ] Notificação visual de novas mensagens (badge)
- [ ] Marcar mensagem como lida

---

## 🎨 MELHORIAS DE UX (Opcional - 1h)

- [ ] Filtros avançados na listagem (status, plano, data de cadastro)
- [ ] Ordenação por colunas (nome, email, data, progresso)
- [ ] Paginação da listagem (50 alunos por página)
- [ ] Busca avançada (CPF, telefone, endereço)
- [ ] Ações em lote (ativar/inativar múltiplos alunos)
- [ ] Exportar lista de alunos para Excel
- [ ] Gráficos e visualizações de dados
- [ ] Histórico de alterações (audit log)

---

## 📦 ENTREGÁVEIS

### Backend
- ✅ Schema atualizado com campos de perfil completo
- ✅ 8 funções no db.ts para gestão de usuários
- ✅ 7 APIs tRPC com validações
- ✅ Sistema de importação CSV/Excel

### Frontend
- ✅ Componente GestaoUsuarios integrado com backend real
- ✅ Formulário completo de cadastro/edição
- ✅ Modal de perfil detalhado do aluno
- ✅ Sistema de importação em lote
- ✅ Melhorias no AtribuirPlano
- ✅ Dashboard individual do aluno (visão admin)
- ✅ Relatórios comparativos

### Funcionalidades
- ✅ CRUD completo de alunos
- ✅ Importação em lote via planilha
- ✅ Atribuição de planos com configurações personalizadas
- ✅ Acompanhamento de progresso individual
- ✅ Relatórios e analytics
- ✅ Sistema de mensagens internas

---

## 🔧 TECNOLOGIAS UTILIZADAS

- **Backend:** tRPC, Drizzle ORM, Zod
- **Frontend:** React, TypeScript, shadcn/ui
- **Upload:** AWS S3 (fotos de perfil)
- **Planilhas:** biblioteca `xlsx`
- **Validações:** CPF validator, email validator
- **Máscaras:** react-input-mask ou similar

---

## 📅 CRONOGRAMA DETALHADO

| Fase | Descrição | Duração | Acumulado |
|------|-----------|---------|-----------|
| 1 | Backend - Dados e Perfil | 2h | 2h |
| 2 | Frontend - Gestão de Usuários | 2h30 | 4h30 |
| 3 | Importação em Lote | 1h30 | 6h |
| 4 | Atribuição e Gestão de Planos | 2h | 8h |
| 5 | Acompanhamento e Relatórios | 2h | 10h |
| 6 | Comunicação e Notificações | 30min | 10h30 |

**Total:** 10h30 (com buffer de 30min para imprevistos)

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

- [ ] Administrador pode cadastrar aluno com todos os dados pessoais
- [ ] Administrador pode importar 100+ alunos via planilha Excel
- [ ] Administrador pode editar qualquer campo do perfil do aluno
- [ ] Administrador pode ativar/inativar/suspender alunos
- [ ] Administrador pode atribuir planos com configurações personalizadas
- [ ] Administrador pode visualizar progresso individual de cada aluno
- [ ] Administrador pode gerar relatórios comparativos
- [ ] Sistema valida CPF e email únicos
- [ ] Sistema faz upload de foto de perfil para S3
- [ ] Sistema envia mensagens internas para alunos
- [ ] Todas as operações têm feedback visual (toast)
- [ ] Todas as operações têm loading states
- [ ] Sistema trata erros adequadamente

---

## 🚀 PRÓXIMOS PASSOS APÓS CONCLUSÃO

1. Sistema de notificações por email
2. Sistema de SMS para lembretes
3. Integração com WhatsApp Business
4. Sistema de vouchers/cupons de desconto
5. Sistema de pagamentos (planos pagos)
6. Sistema de certificados de conclusão
7. Gamificação avançada (conquistas por progresso)
8. Sistema de mentoria 1-on-1 (agendamento de sessões)

---

**Observações:**
- Todas as funcionalidades serão implementadas com controle de acesso (apenas Master, Mentor e Administrativo)
- Dados sensíveis (CPF, telefone) serão exibidos apenas para perfis autorizados
- Sistema de auditoria registrará todas as alterações em dados de alunos
- Backup automático antes de importações em lote
