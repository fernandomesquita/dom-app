#!/bin/bash
# Script de sincronização automática com GitHub
# Uso: ./sync-github.sh "mensagem do commit"

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Iniciando sincronização com GitHub...${NC}"

# Pega mensagem do commit (ou usa padrão)
COMMIT_MSG="${1:-chore: sync checkpoint}"

# Adiciona todos os arquivos
echo -e "${BLUE}📦 Adicionando arquivos...${NC}"
git add .

# Verifica se há mudanças
if git diff --staged --quiet; then
  echo -e "${GREEN}✅ Nenhuma mudança para commitar${NC}"
else
  # Faz commit
  echo -e "${BLUE}💾 Fazendo commit: ${COMMIT_MSG}${NC}"
  git commit -m "$COMMIT_MSG"
fi

# Faz push
echo -e "${BLUE}☁️  Enviando para GitHub...${NC}"
git push origin main

echo -e "${GREEN}✅ Sincronização concluída!${NC}"
echo -e "${GREEN}🌐 Acesse: https://github.com/fernandomesquita/dom-app${NC}"
