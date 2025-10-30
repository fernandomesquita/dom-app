# Debug do Modal de Metas

## Situação
O usuário reportou que o modal de "Nova Meta" não está mostrando:
1. Editor rich text para "Orientação de Estudos"
2. Campo de "Aula Vinculada"

## Análise
Existem 2 componentes de modal de metas no projeto:

### 1. GestaoMetas.tsx (CORRETO - COM RICH TEXT)
- **Localização**: `client/src/components/admin/GestaoMetas.tsx`
- **Linha 449-453**: Usa `<RichTextEditor>` para Orientação de Estudos ✅
- **Linha 437-444**: Tem campo `<SeletorAula>` para Aula Vinculada ✅
- **Título do Modal**: "Nova Meta" ou "Editar Meta"

### 2. AdicionarEditarMetaModal.tsx (TAMBÉM CORRETO - COM REACTQUILL)
- **Localização**: `client/src/components/admin/AdicionarEditarMetaModal.tsx`
- **Linha 331-337**: Usa `<ReactQuill>` para Orientação de Estudos ✅
- **Linha 288-304**: Tem campo de Aula Vinculada ✅
- **Título do Modal**: "Adicionar Nova Meta" ou "Editar Meta"

## Hipóteses
1. **Cache do navegador**: O usuário pode estar vendo uma versão antiga em cache
2. **Modal diferente**: Pode haver outro modal sendo usado que não foi identificado
3. **Erro de renderização**: O RichTextEditor pode não estar renderizando por falta de dependências

## Próximos Passos
1. ✅ Verificar se react-quill e @tiptap estão instalados
2. ✅ Forçar hard refresh no navegador
3. ⏳ Abrir o modal diretamente e verificar o console
4. ⏳ Verificar se há erros de importação ou renderização
