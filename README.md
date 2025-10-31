# 🎓 DOM-APP - Plataforma de Mentoria Educacional

Plataforma completa de mentoria e estudos com sistema inteligente de gestão de metas, acompanhamento de progresso e gamificação.

---

## 🚀 Tecnologias

- **Frontend:** React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- **Backend:** Node.js + tRPC 11 + Drizzle ORM
- **Banco de Dados:** MySQL/TiDB (45 tabelas)
- **Storage:** AWS S3
- **Autenticação:** OAuth Manus
- **Versionamento:** Git + GitHub

---

## ⚡ Quick Start

```bash
# Clone o repositório
git clone https://github.com/fernandomesquita/dom-app.git
cd dom-app

# Instale dependências
pnpm install

# Configure banco de dados
pnpm db:push

# Inicie servidor de desenvolvimento
pnpm dev
```

**Servidor:** http://localhost:3000  
**Preview:** https://3000-[seu-sandbox].manusvm.computer

---

## 🔄 SINCRONIZAÇÃO AUTOMÁTICA COM GITHUB

### ⚠️ IMPORTANTE: Leia isto primeiro!

Este projeto está configurado para **sincronizar automaticamente com GitHub** a cada checkpoint.

### 📋 Como Funciona:

#### **1. Após cada checkpoint bem-sucedido:**

Quando a IA disser:
> ✅ Checkpoint salvo com sucesso!

**Você responde:**
> Sincronize com GitHub

#### **2. A IA executa automaticamente:**

```bash
cd /home/ubuntu/dom-app
./sync-github.sh "chore: sync checkpoint [descrição]"
```

#### **3. Resultado:**

- ✅ Commit criado localmente
- ✅ Push para GitHub
- ✅ Backup automático
- ✅ Histórico preservado

### 🎯 Comandos Disponíveis:

#### **Sincronização Automática (Recomendado):**
```bash
./sync-github.sh "feat: descrição da mudança"
```

#### **Via NPM:**
```bash
pnpm git:sync              # Commit + Push automático
pnpm git:commit "mensagem" # Apenas commit
pnpm git:push              # Apenas push
```

#### **Git Manual:**
```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### 📝 Formato de Mensagens de Commit:

Use **Conventional Commits**:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação (sem mudança de código)
- `refactor:` - Refatoração de código
- `test:` - Adicionar testes
- `chore:` - Tarefas de manutenção

**Exemplos:**
```bash
./sync-github.sh "feat: adiciona sistema de notificações"
./sync-github.sh "fix: corrige erro no login"
./sync-github.sh "docs: atualiza README"
```

### 🔧 Configuração do Token GitHub:

O projeto usa token GitHub armazenado no remote URL.

**Para reconfigurar:**
```bash
# 1. Crie novo token em: https://github.com/settings/tokens
# 2. Configure no projeto:
git remote set-url origin https://fernandomesquita:SEU_TOKEN@github.com/fernandomesquita/dom-app.git
```

**Ou use GitHub CLI (mais seguro):**
```bash
gh auth login
git remote set-url origin https://github.com/fernandomesquita/dom-app.git
```

### 🎯 Fluxo de Trabalho Ideal:

1. **Você:** "Implemente [funcionalidade]"
2. **IA:** Implementa e salva checkpoint
3. **IA:** "✅ Checkpoint salvo!"
4. **Você:** "Sincronize com GitHub"
5. **IA:** Executa `./sync-github.sh` automaticamente
6. **IA:** "✅ Código no GitHub!"

### 📄 Arquivos Relacionados:

- `sync-github.sh` - Script de sincronização automática
- `SYNC_INSTRUCTIONS.md` - Instruções detalhadas
- `package.json` - Scripts NPM configurados

---

## ✨ Funcionalidades

### Para Alunos
- 📊 **Dashboard** - Estatísticas em tempo real
- 🎯 **Sistema de Metas** - Redistribuição inteligente
- 📚 **Aulas** - Player integrado com anotações
- ❓ **Questões** - Banco com revisão espaçada
- 💬 **Fórum** - Discussões moderadas
- 🏆 **Gamificação** - Conquistas + ranking
- 🔔 **Notificações** - Central unificada

### Para Administradores
- 👥 **Gestão de Usuários** - Permissões e roles
- 📋 **Planos de Estudo** - Criação e gestão
- 📊 **Analytics** - Relatórios avançados
- 🎬 **Upload de Conteúdo** - Aulas e materiais
- ⚙️ **Configurações** - Funcionalidades do sistema
- 🐛 **Reporte de Bugs** - Sistema integrado

---

## 🗄️ Estrutura do Banco de Dados

**45 tabelas organizadas em módulos:**

### Core
- `users` - Usuários do sistema
- `planos` - Planos de estudo
- `metas` - Metas dos planos
- `matriculas` - Matrículas de alunos
- `progressoMetas` - Progresso das metas

### Aulas
- `aulas` - Repositório de aulas
- `progressoAulas` - Progresso de visualização
- `anotacoesAulas` - Anotações com timestamps

### Questões
- `questoes` - Banco de questões
- `respostasQuestoes` - Histórico de respostas
- `questoesRevisar` - Sistema de revisão espaçada
- `questoesReportadas` - Questões com problemas
- `metasQuestoes` - Vinculação de questões às metas

### Fórum
- `forumTopicos` - Tópicos de discussão
- `forumRespostas` - Respostas aos tópicos
- `forumCurtidas` - Sistema de likes
- `forumNotificacoesLidas` - Controle de notificações
- `forumMensagensRetidas` - Moderação
- `forumLixeira` - Conteúdo deletado

### Gamificação
- `conquistas` - Conquistas disponíveis
- `userConquistas` - Conquistas dos usuários

### Notificações
- `notificacoes` - Notificações do sistema
- `preferenciasNotificacoes` - Preferências dos usuários

### Materiais
- `materiais` - Materiais de estudo

### Admin
- `avisos` - Avisos do sistema
- `bugsReportados` - Bugs reportados
- `configFuncionalidades` - Configurações do sistema

---

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento
pnpm build        # Build para produção
pnpm start        # Inicia servidor de produção

# Qualidade de Código
pnpm check        # Valida TypeScript (tsc --noEmit)
pnpm format       # Formata código com Prettier
pnpm test         # Executa testes com Vitest

# Banco de Dados
pnpm db:push      # Aplica migrations (generate + migrate)

# Git & GitHub
pnpm git:commit   # Cria commit: pnpm git:commit "mensagem"
pnpm git:push     # Faz push para GitHub
pnpm git:sync     # Commit + Push automático
```

---

## 📁 Estrutura do Projeto

```
dom-app/
├── client/                 # Frontend React
│   ├── public/            # Assets estáticos
│   └── src/
│       ├── pages/         # Páginas da aplicação (20+)
│       ├── components/    # Componentes reutilizáveis (40+)
│       ├── hooks/         # Custom hooks
│       ├── lib/           # Bibliotecas e utilitários
│       └── contexts/      # Contextos React
├── server/                # Backend tRPC
│   ├── _core/            # Core do framework
│   ├── routers.ts        # Routers tRPC
│   ├── db.ts             # Funções de banco
│   ├── helpers/          # Funções auxiliares
│   └── jobs/             # Jobs agendados
├── drizzle/              # Schema e migrations
│   └── schema.ts         # 45 tabelas
├── shared/               # Código compartilhado
├── storage/              # Helpers S3
├── sync-github.sh        # Script de sincronização
└── package.json          # Dependências e scripts
```

---

## 🔧 Desenvolvimento

### Adicionar Nova Funcionalidade:

1. **Atualize o schema** (se necessário):
   ```bash
   # Edite drizzle/schema.ts
   pnpm db:push
   ```

2. **Crie funções de banco** em `server/db.ts`

3. **Adicione procedures tRPC** em `server/routers.ts`

4. **Implemente UI** em `client/src/pages/` ou `client/src/components/`

5. **Teste localmente:**
   ```bash
   pnpm check  # Valida TypeScript
   pnpm dev    # Testa no navegador
   ```

6. **Salve checkpoint** (via IA ou manualmente)

7. **Sincronize com GitHub:**
   ```bash
   ./sync-github.sh "feat: descrição da funcionalidade"
   ```

---

## 🐛 Problemas Conhecidos

### Erros TypeScript (122 erros):

1. **Router 'auth' conflita com método interno do tRPC**
   - Solução: Renomear para 'authentication'

2. **Parâmetro 'error' sem tipo em VerificarEmail.tsx**
   - Solução: Adicionar tipo explícito

**Status:** Servidor funciona normalmente apesar dos erros.  
**Próximo passo:** Corrigir todos os erros TypeScript.

---

## 📚 Documentação Adicional

- `SYNC_INSTRUCTIONS.md` - Guia completo de sincronização Git
- `README.md` - Este arquivo
- Template README em `server/_core/` - Documentação do framework

---

## 🚀 Deploy

### Preparação:

1. **Corrija erros TypeScript:**
   ```bash
   pnpm check
   ```

2. **Teste build de produção:**
   ```bash
   pnpm build
   pnpm start
   ```

3. **Salve checkpoint final:**
   ```bash
   ./sync-github.sh "chore: preparação para deploy"
   ```

### Deploy no Manus:

1. Salve checkpoint via `webdev_save_checkpoint`
2. Clique em "Publish" na interface do Manus
3. Configure domínio personalizado (opcional)

---

## 🔐 Segurança

### Variáveis de Ambiente:

**Nunca commite:**
- `.env`
- `.env.local`
- `.env.production`

**Tokens e segredos:**
- Configure via Settings → Secrets no Manus
- Use `process.env.NOME_DA_VARIAVEL` no código
- Nunca exponha tokens em logs ou mensagens

### Token GitHub:

- ⚠️ Token está no remote URL (não commitado)
- 🔄 Revogue e recrie periodicamente
- 🔐 Use GitHub CLI para maior segurança

---

## 📄 Licença

Projeto desenvolvido por **Fernando Mesquita**.

---

## 🔗 Links

- **Repositório:** https://github.com/fernandomesquita/dom-app
- **Preview:** https://3000-[sandbox].manusvm.computer
- **Documentação Manus:** https://docs.manus.im

---

## 📞 Suporte

Para problemas técnicos ou dúvidas:
- Abra uma issue no GitHub
- Entre em contato via: https://help.manus.im

---

**Versão:** 1.0.0  
**Status:** 🟢 Em desenvolvimento ativo  
**Última atualização:** 2025-01-31

---

## 🎯 Próximos Passos

- [ ] Corrigir 122 erros TypeScript
- [ ] Adicionar testes unitários
- [ ] Implementar CI/CD com GitHub Actions
- [ ] Documentar APIs tRPC
- [ ] Otimizar performance
- [ ] Deploy em produção

---

**Desenvolvido com ❤️ por Fernando Mesquita**  
**Powered by Manus AI** 🚀
