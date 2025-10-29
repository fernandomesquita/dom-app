# TODO - Sistema DOM App
**Última atualização:** 29/10/2025 18:00

## 🎯 Tarefas Prioritárias (URGENTE)

### 1. Bug Crítico: Redistribuição de metas não atualiza UI ⚠️
- [x] Modificar redistribuirMetasAluno para aceitar horasDiarias e diasSemana
- [x] Atualizar rota tRPC metas.redistribuir
- [x] Frontend enviando parâmetros corretos na mutation
- [x] Logs confirmam que distribuição está funcionando
- [ ] **INVESTIGAR:** Por que metas não aparecem atualizadas na UI?
  - Verificar se progressoMetas está sendo deletado
  - Verificar se refetch está funcionando
  - Adicionar console.logs no frontend
  - Testar manualmente o fluxo completo

### 2. Página de Anotações de Meta 📝
- [ ] Criar página /anotacoes-meta
- [ ] Listar todas as metas com anotações do aluno
- [ ] Exibir: disciplina, assunto, data, anotação
- [ ] Botão para navegar para a meta original
- [ ] Integrar no menu lateral

## ✅ Concluídas Recentemente

### Layout Responsivo dos Cards
- [x] Remover line-clamp-2 do título
- [x] Aumentar min-height dos cards (140px)
- [x] Grid responsivo: 1 coluna (mobile) → 7 colunas (xl)
- [x] Texto maior e mais legível
- [x] Tooltip com título completo

### Configuração de Cronograma
- [x] Remover campo "Data de Término"
- [x] Adicionar mensagem sobre cálculo automático
- [x] Integrar redistribuição ao salvar configurações

## 📊 Progresso Geral

**FASE 5 (Sistema de Gestão de Metas):** 28/31 tarefas (90.3%)
- ✅ Barra de progresso semanal
- ✅ Boxes de metas interativos
- ✅ Modal de detalhes completo
- ✅ Sistema de configuração de cronograma
- ✅ Layout responsivo
- ⏳ Redistribuição (backend OK, frontend com bug)
- ⏳ Página de anotações

**Total do Projeto:** 556/1465 tarefas (38.0%)

## 🔍 Próximos Passos

1. **URGENTE:** Debugar redistribuição de metas
   - Adicionar logs no frontend (Plano.tsx)
   - Verificar mutation response
   - Testar refetch manual
   - Verificar se dataAgendada está sendo atualizada

2. Criar página de anotações de meta

3. Testes end-to-end completos:
   - Configurar 5h diárias em dias específicos
   - Salvar e verificar redistribuição
   - Confirmar que metas preenchem todo o tempo disponível
   - Validar títulos completos nos cards
