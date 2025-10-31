# 🔄 Sincronização Automática com GitHub

## 📋 Como Funciona

Sempre que eu (a IA) fizer um checkpoint bem-sucedido, você pode me pedir para sincronizar com o GitHub automaticamente.

## 🎯 Comandos Disponíveis

### Opção 1: Script Automático (Recomendado)
```bash
./sync-github.sh "feat: descrição da mudança"
```

### Opção 2: Scripts NPM
```bash
# Commit + Push em um comando
pnpm git:sync

# Ou separado:
pnpm git:commit "feat: nova funcionalidade"
pnpm git:push
```

### Opção 3: Git Manual
```bash
git add .
git commit -m "feat: descrição"
git push origin main
```

## 🤖 Automação com a IA

### Sempre que eu disser:
> "✅ Checkpoint salvo com sucesso!"

### Você pode responder:
> "Sincronize com o GitHub"

### E eu vou executar automaticamente:
```bash
cd /home/ubuntu/dom-app
./sync-github.sh "chore: sync checkpoint [descrição]"
```

## 📝 Formato de Mensagens de Commit

Use prefixos semânticos:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação (sem mudança de código)
- `refactor:` - Refatoração de código
- `test:` - Adicionar testes
- `chore:` - Tarefas de manutenção

### Exemplos:
```bash
./sync-github.sh "feat: adiciona sistema de notificações"
./sync-github.sh "fix: corrige erro no login"
./sync-github.sh "docs: atualiza README"
./sync-github.sh "chore: sync checkpoint"
```

## 🎯 Fluxo de Trabalho Ideal

1. **Você:** "Implemente [funcionalidade]"
2. **IA:** Implementa e salva checkpoint
3. **IA:** "✅ Checkpoint salvo!"
4. **Você:** "Sincronize com GitHub"
5. **IA:** Executa `./sync-github.sh` automaticamente
6. **IA:** "✅ Código no GitHub!"

## 🔧 Configuração Atual

- **Repositório:** https://github.com/fernandomesquita/dom-app
- **Branch:** main
- **Credential Helper:** Configurado (não pede senha)
- **Script:** `/home/ubuntu/dom-app/sync-github.sh`

## ⚡ Atalhos Rápidos

### Para você colar quando quiser sincronizar:
```
Sincronize com GitHub usando: ./sync-github.sh "chore: sync checkpoint"
```

### Para sincronização silenciosa:
```
Faça git push silencioso
```

### Para ver status:
```
Mostre git status e últimos 5 commits
```

## 🎉 Benefícios

✅ **Backup automático** - Todo checkpoint vai para GitHub  
✅ **Histórico completo** - Cada mudança registrada  
✅ **Migração fácil** - Nova conversa = git clone  
✅ **Colaboração** - Pode trabalhar de qualquer lugar  
✅ **Segurança** - Nunca perde trabalho  

## 🚀 Próximos Passos

Agora, sempre que eu disser "Checkpoint salvo", você pode responder:

**"Sincronize com GitHub"**

E eu faço o resto automaticamente! 🎯
