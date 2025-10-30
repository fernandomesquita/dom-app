# 📋 LEVANTAMENTO: Cadastro de Alunos e Gestão de Acesso

**Data:** 30 de outubro de 2025  
**Projeto:** DOM - Plataforma de Mentoria

---

## 🔍 ANÁLISE DO SISTEMA ATUAL

### ✅ O QUE JÁ EXISTE

#### 1. **Autenticação OAuth (Manus)**
- ✅ Sistema OAuth integrado com Manus
- ✅ Hook `useAuth()` funcional
- ✅ Mutations: `auth.me`, `auth.logout`
- ✅ Campo `openId` único por usuário
- ✅ Redirecionamento automático para login
- ✅ Persistência de sessão via cookies
- ✅ Refresh automático de token

#### 2. **Tabela de Usuários (Schema)**
- ✅ Campo `id` (PK, auto-increment)
- ✅ Campo `openId` (OAuth, único)
- ✅ Campo `name`
- ✅ Campo `email`
- ✅ Campo `loginMethod`
- ✅ Campo `role` (enum: aluno, professor, administrativo, mentor, master)
- ✅ Campo `pontos` (gamificação)
- ✅ Campos pessoais: CPF, telefone, dataNascimento, endereco, foto, bio
- ✅ Campo `status` (enum: ativo, inativo, suspenso)
- ✅ Campo `observacoes` (admin)
- ✅ Timestamps: createdAt, updatedAt, lastSignedIn

#### 3. **Gestão Administrativa de Usuários**
- ✅ CRUD completo via painel admin
- ✅ FormularioUsuario.tsx (15+ campos)
- ✅ PerfilAlunoModal.tsx (visualização)
- ✅ GestaoUsuarios.tsx (listagem)
- ✅ Importação em lote (Excel/CSV)
- ✅ APIs tRPC:
  - `admin.usuarios.list`
  - `admin.usuarios.getById`
  - `admin.usuarios.create`
  - `admin.usuarios.update`
  - `admin.usuarios.delete`
  - `admin.usuarios.toggleStatus`
  - `admin.usuarios.importarCSV`

#### 4. **Controle de Acesso por Perfil**
- ✅ Middleware de autorização no backend
- ✅ Verificação de role em cada API
- ✅ Hierarquia de permissões:
  - **Master**: Acesso total
  - **Mentor**: Gestão pedagógica
  - **Administrativo**: Suporte operacional
  - **Professor**: Gestão de conteúdo
  - **Aluno**: Acesso básico
- ✅ Componentes protegidos no frontend
- ✅ Redirecionamento se sem permissão

---

## ❌ O QUE FALTA IMPLEMENTAR

### 🚨 CRÍTICO (Bloqueadores)

#### 1. **Auto-Cadastro de Alunos** (3-4h)
**Problema:** Atualmente apenas admins podem criar usuários. Alunos não conseguem se cadastrar sozinhos.

**Necessário:**
- [ ] Página pública de cadastro (`/cadastro`)
- [ ] Formulário de auto-cadastro:
  - Nome completo (obrigatório)
  - Email (obrigatório, único)
  - CPF (obrigatório, único, validação)
  - Telefone (obrigatório)
  - Data de nascimento (opcional)
  - Senha temporária ou link de ativação
  - Aceite de termos de uso
- [ ] API pública `auth.register`:
  - Validação de dados
  - Verificação de CPF/email únicos
  - Criação de usuário com role "aluno"
  - Geração de openId temporário
  - Envio de email de boas-vindas (opcional)
- [ ] Fluxo de ativação de conta:
  - Email com link de confirmação
  - Página de ativação
  - Primeiro login via OAuth
  - Vinculação de openId real
- [ ] Integração com OAuth:
  - Após cadastro, redirecionar para OAuth
  - Vincular openId ao usuário criado
  - Atualizar dados do perfil

**Arquivos a Criar:**
- `client/src/pages/Cadastro.tsx`
- `client/src/components/FormularioCadastro.tsx`
- `server/routers.ts` (adicionar `auth.register`)
- `server/db.ts` (adicionar `registerUser`)

**Estimativa:** 3-4 horas

---

#### 2. **Gestão de Senha (Opcional)** (2-3h)
**Problema:** Sistema usa apenas OAuth. Pode ser necessário login com senha para casos específicos.

**Necessário:**
- [ ] Campo `passwordHash` na tabela users (opcional)
- [ ] API `auth.setPassword` (primeiro acesso)
- [ ] API `auth.login` (email + senha)
- [ ] API `auth.forgotPassword` (recuperação)
- [ ] API `auth.resetPassword` (redefinição)
- [ ] Página de login com senha (`/login`)
- [ ] Página de recuperação de senha (`/recuperar-senha`)
- [ ] Página de redefinição de senha (`/redefinir-senha/:token`)
- [ ] Sistema de tokens de recuperação:
  - Tabela `password_reset_tokens`
  - Geração de token único
  - Expiração em 1 hora
  - Envio por email
- [ ] Hash de senhas (bcrypt ou argon2)
- [ ] Validação de força de senha

**Arquivos a Criar:**
- `client/src/pages/Login.tsx`
- `client/src/pages/RecuperarSenha.tsx`
- `client/src/pages/RedefinirSenha.tsx`
- `drizzle/schema.ts` (adicionar password_reset_tokens)
- `server/auth.ts` (funções de hash e validação)

**Estimativa:** 2-3 horas

**Nota:** Esta feature é **OPCIONAL** se o sistema usar apenas OAuth.

---

### ⚠️ IMPORTANTE (Melhorias de Segurança)

#### 3. **Verificação de Email** (1-2h)
**Problema:** Emails não são verificados. Usuários podem usar emails falsos.

**Necessário:**
- [ ] Campo `emailVerified` (boolean) na tabela users
- [ ] Tabela `email_verification_tokens`:
  - id, userId, token, expiresAt, createdAt
- [ ] API `auth.sendVerificationEmail`
- [ ] API `auth.verifyEmail`
- [ ] Página de verificação (`/verificar-email/:token`)
- [ ] Email automático após cadastro
- [ ] Badge "Email não verificado" no perfil
- [ ] Restrição de funcionalidades se não verificado

**Estimativa:** 1-2 horas

---

#### 4. **Controle de Acesso Granular** (2-3h)
**Problema:** Controle de acesso é apenas por role. Falta controle por funcionalidade.

**Necessário:**
- [ ] Tabela `permissions`:
  - id, name, description, module
- [ ] Tabela `role_permissions`:
  - roleId, permissionId
- [ ] Sistema de permissões:
  - `usuarios.criar`
  - `usuarios.editar`
  - `usuarios.excluir`
  - `planos.criar`
  - `planos.atribuir`
  - `metas.criar`
  - `aulas.criar`
  - `forum.moderar`
  - etc.
- [ ] Middleware `hasPermission(permission)`
- [ ] Hook `usePermissions()`
- [ ] Componente `<ProtectedRoute permissions={[...]} />`
- [ ] Interface de gestão de permissões (admin)

**Estimativa:** 2-3 horas

---

#### 5. **Auditoria de Ações** (1-2h)
**Problema:** Não há registro de quem fez o quê e quando.

**Necessário:**
- [ ] Tabela `audit_logs`:
  - id, userId, action, entity, entityId, oldData, newData, ip, userAgent, createdAt
- [ ] Middleware de auditoria automática
- [ ] Logs de ações críticas:
  - Criação/edição/exclusão de usuários
  - Atribuição de planos
  - Alteração de status
  - Mudança de permissões
- [ ] Interface de visualização de logs (admin)
- [ ] Filtros: usuário, ação, data, entidade
- [ ] Exportação de logs

**Estimativa:** 1-2 horas

---

### 📊 NICE TO HAVE (Melhorias de UX)

#### 6. **Perfil do Aluno (Auto-Edição)** (1-2h)
**Problema:** Alunos não conseguem editar seus próprios dados.

**Necessário:**
- [ ] Página `/perfil` (rota pública para alunos)
- [ ] Componente `EditarPerfil.tsx`:
  - Nome
  - Email (somente leitura)
  - CPF (somente leitura)
  - Telefone
  - Data de nascimento
  - Endereço
  - Foto de perfil
  - Bio
- [ ] API `auth.updateProfile`
- [ ] Validações:
  - Não permitir alterar email/CPF
  - Validar telefone
  - Limitar tamanho de foto (5MB)
- [ ] Preview de foto antes de salvar
- [ ] Crop de imagem (opcional)

**Estimativa:** 1-2 horas

---

#### 7. **Onboarding de Novos Alunos** (2-3h)
**Problema:** Alunos não sabem por onde começar após o cadastro.

**Necessário:**
- [ ] Wizard de boas-vindas (4 etapas):
  1. Completar perfil
  2. Tour pela plataforma
  3. Escolher áreas de interesse
  4. Ver planos disponíveis
- [ ] Campo `onboardingCompleted` (boolean)
- [ ] Componente `OnboardingWizard.tsx`
- [ ] Modal de boas-vindas (primeira vez)
- [ ] Checklist de primeiros passos:
  - [ ] Completar perfil
  - [ ] Assistir primeira aula
  - [ ] Responder primeira questão
  - [ ] Participar do fórum
- [ ] Gamificação: pontos por completar onboarding

**Estimativa:** 2-3 horas

---

#### 8. **Convites de Alunos** (2h)
**Problema:** Admins não conseguem convidar alunos diretamente.

**Necessário:**
- [ ] Tabela `invites`:
  - id, email, role, invitedBy, token, expiresAt, acceptedAt, createdAt
- [ ] API `admin.inviteUser`:
  - Email do convidado
  - Role (aluno, professor, etc)
  - Mensagem personalizada (opcional)
- [ ] Email de convite com link único
- [ ] Página de aceite de convite (`/convite/:token`)
- [ ] Pré-preenchimento de dados no cadastro
- [ ] Listagem de convites pendentes (admin)
- [ ] Reenvio de convite
- [ ] Cancelamento de convite

**Estimativa:** 2 horas

---

#### 9. **Login Social (Google, Facebook)** (3-4h)
**Problema:** Apenas OAuth Manus disponível.

**Necessário:**
- [ ] Integração com Google OAuth
- [ ] Integração com Facebook Login
- [ ] Botões "Entrar com Google" e "Entrar com Facebook"
- [ ] Vinculação de contas sociais a usuários existentes
- [ ] Página de seleção de método de login
- [ ] Migração de openId para múltiplos providers

**Estimativa:** 3-4 horas

**Nota:** Depende de configuração de apps no Google/Facebook.

---

#### 10. **Gestão de Sessões** (1-2h)
**Problema:** Usuários não veem onde estão logados.

**Necessário:**
- [ ] Tabela `sessions`:
  - id, userId, token, ip, userAgent, lastActivity, expiresAt, createdAt
- [ ] Página "Sessões Ativas" no perfil
- [ ] Listagem de dispositivos logados:
  - Dispositivo (desktop, mobile, tablet)
  - Navegador
  - Localização (IP)
  - Última atividade
  - Sessão atual (destaque)
- [ ] Botão "Encerrar esta sessão"
- [ ] Botão "Encerrar todas as outras sessões"
- [ ] Notificação de novo login

**Estimativa:** 1-2 horas

---

## 📊 RESUMO DE ESFORÇO

### Por Prioridade

| Prioridade | Feature | Estimativa | Status |
|------------|---------|------------|--------|
| 🚨 **CRÍTICO** | Auto-Cadastro de Alunos | 3-4h | ❌ Não iniciado |
| 🚨 **CRÍTICO** | Gestão de Senha (opcional) | 2-3h | ❌ Não iniciado |
| ⚠️ **IMPORTANTE** | Verificação de Email | 1-2h | ❌ Não iniciado |
| ⚠️ **IMPORTANTE** | Controle de Acesso Granular | 2-3h | ❌ Não iniciado |
| ⚠️ **IMPORTANTE** | Auditoria de Ações | 1-2h | ❌ Não iniciado |
| 📊 **NICE TO HAVE** | Perfil do Aluno (Auto-Edição) | 1-2h | ❌ Não iniciado |
| 📊 **NICE TO HAVE** | Onboarding de Novos Alunos | 2-3h | ❌ Não iniciado |
| 📊 **NICE TO HAVE** | Convites de Alunos | 2h | ❌ Não iniciado |
| 📊 **NICE TO HAVE** | Login Social | 3-4h | ❌ Não iniciado |
| 📊 **NICE TO HAVE** | Gestão de Sessões | 1-2h | ❌ Não iniciado |

### Totais por Categoria

- **🚨 CRÍTICO:** 5-7 horas
- **⚠️ IMPORTANTE:** 4-7 horas
- **📊 NICE TO HAVE:** 12-18 horas

**TOTAL GERAL:** 21-32 horas

---

## 🎯 PLANO DE IMPLEMENTAÇÃO RECOMENDADO

### FASE 1: MVP de Cadastro (5-7h) - PRIORITÁRIO
**Objetivo:** Permitir que alunos se cadastrem sozinhos

1. ✅ Auto-Cadastro de Alunos (3-4h)
2. ✅ Verificação de Email (1-2h)
3. ✅ Perfil do Aluno (1-2h)

**Entregável:** Alunos podem se cadastrar, verificar email e editar perfil.

---

### FASE 2: Segurança e Controle (6-10h) - IMPORTANTE
**Objetivo:** Melhorar segurança e rastreabilidade

1. ✅ Gestão de Senha (2-3h) - se necessário
2. ✅ Controle de Acesso Granular (2-3h)
3. ✅ Auditoria de Ações (1-2h)
4. ✅ Gestão de Sessões (1-2h)

**Entregável:** Sistema seguro com logs de auditoria e controle fino de permissões.

---

### FASE 3: Experiência do Usuário (7-11h) - OPCIONAL
**Objetivo:** Melhorar onboarding e engajamento

1. ✅ Onboarding de Novos Alunos (2-3h)
2. ✅ Convites de Alunos (2h)
3. ✅ Login Social (3-4h)

**Entregável:** Experiência de cadastro e onboarding profissional.

---

## 🚀 RECOMENDAÇÃO FINAL

### Cenário 1: Lançamento Rápido (5-7h)
**Implementar apenas FASE 1:**
- Auto-cadastro
- Verificação de email
- Perfil editável

**Resultado:** Sistema funcional para alunos se cadastrarem e usarem a plataforma.

---

### Cenário 2: Lançamento Seguro (11-17h)
**Implementar FASE 1 + FASE 2:**
- Tudo da FASE 1
- Gestão de senha (se necessário)
- Controle de acesso granular
- Auditoria
- Gestão de sessões

**Resultado:** Sistema pronto para produção com segurança adequada.

---

### Cenário 3: Lançamento Premium (18-28h)
**Implementar FASE 1 + FASE 2 + FASE 3:**
- Tudo das fases anteriores
- Onboarding completo
- Convites
- Login social

**Resultado:** Experiência de usuário premium e profissional.

---

## ✅ PRÓXIMOS PASSOS

1. **Definir escopo:** Qual cenário implementar?
2. **Priorizar features:** Quais são essenciais vs opcionais?
3. **Validar fluxos:** Desenhar jornadas de usuário
4. **Implementar FASE 1:** Começar pelo auto-cadastro
5. **Testar:** Validar fluxo completo
6. **Iterar:** Adicionar features conforme necessidade

---

**Conclusão:** O sistema já possui uma base sólida de autenticação OAuth e gestão administrativa. O trabalho principal é implementar o **auto-cadastro de alunos** (3-4h) para que a plataforma seja acessível ao público. As demais features são melhorias de segurança e UX que podem ser implementadas gradualmente.

**Recomendação:** Começar pela **FASE 1** (5-7h) para ter um MVP funcional rapidamente.
