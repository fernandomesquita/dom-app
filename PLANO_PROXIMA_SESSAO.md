# 📋 PLANO DETALHADO - PRÓXIMA SESSÃO
## Correção de Bugs + Sistema de Aulas

**Estimativa Total:** 30-40h  
**Prioridade:** CRÍTICA → ALTA → MÉDIA  
**Checkpoint Inicial:** c1baf3a7

---

## 🚨 FASE 1: CORREÇÃO DE BUGS CRÍTICOS (4-6h)

### Bug #1: Erro de JSX no AdicionarEditarMetaModal (30min)
**Problema:** Div não fechada na linha 423  
**Impacto:** Modal não renderiza, erro fatal no Vite  
**Solução:**
1. Ler arquivo completo do modal
2. Contar todas as tags `<div>` abertas e fechadas
3. Identificar a div não fechada
4. Adicionar `</div>` no local correto
5. Testar renderização do modal

**Critério de Aceitação:**
- [ ] Modal abre sem erros no console
- [ ] Todos os campos visíveis
- [ ] Scroll funciona corretamente

---

### Bug #2: Campo "Aula Vinculada" não aparece (1h)
**Problema:** Componente SeletorAula não está sendo renderizado  
**Impacto:** Impossível vincular aulas às metas  
**Solução:**
1. Verificar se import do SeletorAula está correto
2. Verificar se componente está dentro da div de scroll
3. Adicionar campo entre "Dica de Estudo" e "Orientação"
4. Testar query tRPC de aulas
5. Validar filtro por disciplina

**Critério de Aceitação:**
- [ ] Campo "Aula Vinculada (Opcional)" visível
- [ ] Dropdown carrega aulas corretamente
- [ ] Filtro por disciplina funciona
- [ ] Seleção persiste ao salvar

**Código esperado:**
```tsx
{/* Aula Vinculada */}
<div className="space-y-2">
  <Label>Aula Vinculada (Opcional)</Label>
  <SeletorAula
    disciplina={formData.disciplina}
    aulaId={formData.aulaId}
    onChange={(aulaId) => setFormData({ ...formData, aulaId })}
  />
</div>
```

---

### Bug #3: Editor Rich Text sumiu (1h30)
**Problema:** Campo "Orientação de Estudos" virou textarea simples  
**Impacto:** Perda de formatação, links, listas  
**Solução:**
1. Instalar biblioteca de editor rich text (ex: `react-quill`, `tiptap`)
2. Criar componente RichTextEditor.tsx
3. Substituir textarea por RichTextEditor
4. Configurar toolbar (H1, H2, B, I, lista, link, vídeo)
5. Implementar salvamento de HTML
6. Implementar preview de HTML

**Critério de Aceitação:**
- [ ] Editor rich text renderiza corretamente
- [ ] Toolbar com 8+ opções (H1, H2, B, I, UL, OL, link, code)
- [ ] Conteúdo salva como HTML
- [ ] Preview mostra formatação correta
- [ ] Contador de caracteres funciona

**Biblioteca recomendada:** Tiptap (mais leve e moderno)
```bash
pnpm add @tiptap/react @tiptap/starter-kit
```

---

### Bug #4: Botões de reordenação não funcionam (1h)
**Problema:** Setas cima/baixo não alteram ordem das metas  
**Impacto:** Impossível ajustar ordem manualmente  
**Solução:**
1. Verificar se mutation `reordenarMetas` está sendo chamada
2. Verificar se API retorna sucesso
3. Verificar se refetch está sendo executado
4. Implementar otimistic update (opcional)
5. Adicionar feedback visual (toast)

**Critério de Aceitação:**
- [ ] Clicar em seta ↑ move meta para cima
- [ ] Clicar em seta ↓ move meta para baixo
- [ ] Primeira meta não tem seta ↑
- [ ] Última meta não tem seta ↓
- [ ] Toast confirma reordenação
- [ ] Tabela atualiza automaticamente

**Código esperado:**
```tsx
const reordenarMutation = trpc.admin.metas.reordenar.useMutation({
  onSuccess: () => {
    toast.success("Ordem atualizada!");
    refetch();
  }
});

const moverParaCima = (metaId: number, ordemAtual: number) => {
  reordenarMutation.mutate({
    planoId,
    metaId,
    novaOrdem: ordemAtual - 1
  });
};
```

---

### Bug #5: Resolver 122 erros TypeScript (2h)
**Problema:** Acúmulo de erros TypeScript impedindo build  
**Impacto:** Impossível fazer deploy, IDE lento  
**Solução:**

**5.1 Erro principal: auth router (1h)**
```
Property 'auth' does not exist on type 
'"The property 'useContext' in your router collides with a built-in method"'
```

**Causa:** Router `auth` colide com método interno do tRPC  
**Solução:** Renomear router de `auth` para `authentication`

```typescript
// server/routers.ts
export const appRouter = router({
  authentication: authRouter, // era: auth
  admin: adminRouter,
  // ...
});

// client - atualizar todas as chamadas
trpc.authentication.register.useMutation() // era: trpc.auth.register
```

**5.2 Erro VerificarEmail.tsx (15min)**
```
Parameter 'error' implicitly has an 'any' type
```

**Solução:**
```typescript
// Antes:
.catch((error) => { ... })

// Depois:
.catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Erro desconhecido";
  ...
})
```

**5.3 Outros erros (45min)**
- Adicionar tipos explícitos em callbacks
- Corrigir imports não utilizados
- Adicionar `| null` em tipos opcionais
- Executar `pnpm tsc --noEmit` até 0 erros

**Critério de Aceitação:**
- [ ] `pnpm tsc --noEmit` retorna 0 erros
- [ ] Build de produção funciona
- [ ] IDE não mostra erros vermelhos
- [ ] Hot reload funciona normalmente

---

## ⚡ FASE 2: COMPLETAR SISTEMA DE METAS (6-8h)

### 2.1 Finalizar Estatísticas (2-3h)
**Objetivo:** Criar dashboards visuais de progresso

**Componentes a criar:**
1. **DashboardEstatisticas.tsx** (1h30)
   - 6 cards principais (horas totais, metas concluídas, sequência, média diária, progresso semanal, disciplina destaque)
   - Gráfico de evolução temporal (Chart.js ou Recharts)
   - Gráfico de distribuição por disciplina (pizza)
   - Filtro de período (7d, 30d, 90d, todo período)

2. **GraficoProgresso.tsx** (30min)
   - Linha temporal de horas estudadas
   - Barras de metas concluídas por semana
   - Área de meta vs realizado

3. **TabelaDisciplinas.tsx** (30min)
   - Listagem de disciplinas com progresso
   - Barra de progresso por disciplina
   - Ordenação por % concluído

**APIs já criadas:**
- ✅ `estatisticas.progresso` - Dados gerais
- ✅ `estatisticas.porDisciplina` - Por disciplina
- ✅ `estatisticas.evolucaoTemporal` - Série temporal

**Critério de Aceitação:**
- [ ] Dashboard renderiza sem erros
- [ ] Gráficos carregam dados reais
- [ ] Filtros funcionam
- [ ] Exportar para PDF/Excel

---

### 2.2 Integração Completa do Ciclo EARA® (3-4h)
**Objetivo:** Testar e ajustar algoritmo end-to-end

**Tarefas:**
1. **Testar distribuição automática** (1h)
   - Criar plano de teste com 50 metas
   - Executar `distribuirMetasComEARA()`
   - Validar sequência E-A-R-R-R
   - Validar alternância de disciplinas
   - Validar intervalos de revisão

2. **Interface de visualização EARA** (1h)
   - Badge de ciclo em cada meta (E/A/R1/R2/R3)
   - Indicador de próximo ciclo
   - Linha do tempo de revisões
   - Progresso no ciclo (1/5, 2/5, etc)

3. **Adaptação dinâmica** (1h)
   - Implementar ajuste por desempenho
   - Se ≥90% acerto → acelerar revisões
   - Se <70% acerto → desacelerar revisões
   - Notificar aluno de ajustes

4. **Prompt de continuação** (30min)
   - Após 3ª revisão, perguntar ao aluno
   - "Continuar revisando ou encerrar?"
   - Se continuar → agendar R4, R5...
   - Se encerrar → marcar como dominado

**Critério de Aceitação:**
- [ ] 50 metas distribuídas corretamente
- [ ] Sequência E-A-R-R-R respeitada
- [ ] Alternância funciona (30-60min)
- [ ] Adaptação automática funciona
- [ ] Prompt aparece após R3

---

### 2.3 Disciplinas Recorrentes (1h)
**Objetivo:** Permitir disciplinas fixas diárias

**Implementação:**
1. Adicionar campo `pinada` na tabela `metas`
2. Adicionar toggle "Fixar disciplina" no modal
3. Atualizar algoritmo EARA para inserir pinadas todo dia
4. Criar badge visual "📌 Fixada"

**Critério de Aceitação:**
- [ ] Toggle funciona no modal
- [ ] Meta pinada aparece todo dia
- [ ] Não interfere com EARA
- [ ] Badge visível

---

## 🎓 FASE 3: SISTEMA DE AULAS (20-25h)

### 3.1 Estrutura e Organização (3-4h)

**3.1.1 Modelo de Dados** (1h)
```typescript
// drizzle/schema.ts
export const aulas = mysqlTable("aulas", {
  id: serial("id").primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  professorId: int("professor_id").references(() => users.id),
  disciplina: varchar("disciplina", { length: 100 }).notNull(),
  assunto: varchar("assunto", { length: 255 }).notNull(),
  concurso: varchar("concurso", { length: 100 }),
  videoUrl: varchar("video_url", { length: 500 }), // Vimeo embed
  duracao: int("duracao"), // minutos
  nivel: mysqlEnum("nivel", ["basico", "intermediario", "avancado"]),
  tags: json("tags").$type<string[]>(),
  materiaisUrl: json("materiais_url").$type<string[]>(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  publicadaEm: timestamp("publicada_em").defaultNow(),
  atualizadaEm: timestamp("atualizada_em").onUpdateNow(),
});

export const progressoAulas = mysqlTable("progresso_aulas", {
  id: serial("id").primaryKey(),
  alunoId: int("aluno_id").references(() => users.id).notNull(),
  aulaId: int("aula_id").references(() => aulas.id).notNull(),
  tempoAssistido: int("tempo_assistido").default(0), // segundos
  concluida: boolean("concluida").default(false),
  ultimaPosicao: int("ultima_posicao").default(0), // segundos
  rating: int("rating"), // 1-5
  favoritada: boolean("favoritada").default(false),
  anotacoes: text("anotacoes"),
  assistidaEm: timestamp("assistida_em"),
});
```

**3.1.2 APIs tRPC** (1h)
```typescript
// server/routers.ts - router aulas
export const aulasRouter = router({
  list: publicProcedure
    .input(z.object({
      disciplina: z.string().optional(),
      assunto: z.string().optional(),
      professorId: z.number().optional(),
      concurso: z.string().optional(),
      nivel: z.enum(["basico", "intermediario", "avancado"]).optional(),
      busca: z.string().optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => { ... }),
  
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => { ... }),
  
  marcarProgresso: protectedProcedure
    .input(z.object({
      aulaId: z.number(),
      tempoAssistido: z.number(),
      ultimaPosicao: z.number(),
    }))
    .mutation(async ({ input, ctx }) => { ... }),
  
  marcarConcluida: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => { ... }),
  
  favoritar: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => { ... }),
  
  avaliar: protectedProcedure
    .input(z.object({
      aulaId: z.number(),
      rating: z.number().min(1).max(5),
    }))
    .mutation(async ({ input, ctx }) => { ... }),
  
  salvarAnotacao: protectedProcedure
    .input(z.object({
      aulaId: z.number(),
      anotacoes: z.string(),
    }))
    .mutation(async ({ input, ctx }) => { ... }),
});
```

**3.1.3 Página de Listagem** (1-2h)
```
/aulas
- Sidebar de filtros (disciplina, professor, nível, concurso)
- Barra de busca no topo
- Grid de cards de aulas (3 colunas)
- Paginação
- Ordenação (recentes, populares, alfabética)
```

---

### 3.2 Player de Vídeo Vimeo (4-5h)

**3.2.1 Componente VimeoPlayer** (2h)
```bash
pnpm add @vimeo/player
```

```tsx
// components/VimeoPlayer.tsx
import Player from '@vimeo/player';
import { useEffect, useRef } from 'react';

interface VimeoPlayerProps {
  videoUrl: string; // https://vimeo.com/123456789
  onProgress: (seconds: number) => void;
  onEnded: () => void;
  startAt?: number; // retomar de onde parou
}

export default function VimeoPlayer({ videoUrl, onProgress, onEnded, startAt = 0 }: VimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const player = new Player(containerRef.current, {
      url: videoUrl,
      width: 640,
      responsive: true,
    });

    playerRef.current = player;

    // Retomar de onde parou
    if (startAt > 0) {
      player.setCurrentTime(startAt);
    }

    // Salvar progresso a cada 10 segundos
    player.on('timeupdate', (data) => {
      if (Math.floor(data.seconds) % 10 === 0) {
        onProgress(data.seconds);
      }
    });

    // Marcar como concluída ao terminar
    player.on('ended', () => {
      onEnded();
    });

    return () => {
      player.destroy();
    };
  }, [videoUrl, startAt]);

  return <div ref={containerRef} className="w-full aspect-video" />;
}
```

**3.2.2 Página da Aula** (2-3h)
```
/aulas/:id
- Player Vimeo (topo, 16:9)
- Título e professor (abaixo do player)
- Tabs: Resumo | Materiais | Questões | Dúvidas | Anotações
- Sidebar direita:
  - Progresso (barra + %)
  - Botões: Favoritar, Concluir, Compartilhar
  - Rating (estrelas)
  - Próxima aula sugerida
```

---

### 3.3 Progresso e Interações (3-4h)

**3.3.1 Salvamento Automático** (1h)
- Salvar posição a cada 10 segundos
- Salvar ao fechar a página (beforeunload)
- Retomar de onde parou ao abrir novamente

**3.3.2 Marcação de Conclusão** (30min)
- Automática: >90% assistido
- Manual: botão "Marcar como concluída"
- Badge verde "✓ Concluída"

**3.3.3 Sistema de Favoritos** (30min)
- Botão de coração
- Listagem de favoritas (/aulas/favoritas)
- Contador no perfil

**3.3.4 Avaliação (Rating)** (1h)
- 5 estrelas clicáveis
- Média de rating exibida no card
- Histórico de avaliações (admin)

**3.3.5 Anotações** (1-2h)
- Editor Markdown simples
- Salvamento automático (debounce 2s)
- Exportar para PDF
- Busca em anotações

---

### 3.4 Materiais e Downloads (2-3h)

**3.4.1 Upload de Materiais** (1h)
- Admin pode fazer upload de PDFs para S3
- Listagem de materiais na aba
- Download direto

**3.4.2 Integração com S3** (1h)
```typescript
// server/db.ts
export async function uploadMaterialAula(
  aulaId: number,
  arquivo: Buffer,
  nomeArquivo: string
) {
  const key = `materiais/${aulaId}/${nomeArquivo}`;
  const url = await storagePut(key, arquivo, "application/pdf");
  
  // Adicionar URL ao array de materiais
  await db.update(aulas)
    .set({
      materiaisUrl: sql`JSON_ARRAY_APPEND(materiais_url, '$', ${url})`
    })
    .where(eq(aulas.id, aulaId));
  
  return url;
}
```

**3.4.3 Componente ListaMateriais** (30min)
- Card por material
- Nome, tamanho, data
- Botão de download
- Ícone de PDF

---

### 3.5 Integração com Metas (2-3h)

**3.5.1 Botão "Ir para Aula"** (1h)
- No cronograma, se meta tem aulaId
- Botão azul "📺 Ir para Aula"
- Abre página da aula em nova aba
- Marca meta como "em andamento"

**3.5.2 Vinculação Bidirecional** (1h)
- Na página da aula, mostrar metas vinculadas
- "Esta aula faz parte de X metas do seu plano"
- Link para cada meta

**3.5.3 Progresso Sincronizado** (1h)
- Concluir aula → marcar meta como concluída (se tipo=estudo)
- Concluir meta → sugerir avaliar aula
- Dashboard mostra aulas + metas juntos

---

### 3.6 Filtros e Busca (3-4h)

**3.6.1 Sidebar de Filtros** (2h)
```tsx
<Sidebar>
  <Filtro label="Disciplina" options={disciplinas} />
  <Filtro label="Professor" options={professores} />
  <Filtro label="Nível" options={["Básico", "Intermediário", "Avançado"]} />
  <Filtro label="Concurso" options={concursos} />
  <Filtro label="Duração" type="range" min={0} max={240} />
  <Filtro label="Status" options={["Não iniciada", "Em andamento", "Concluída"]} />
  <Button onClick={limparFiltros}>Limpar Filtros</Button>
</Sidebar>
```

**3.6.2 Busca Inteligente** (1-2h)
- Autocomplete com Algolia ou ElasticSearch (opcional)
- Busca por: título, descrição, professor, tags
- Destacar termos buscados
- Histórico de buscas (localStorage)
- Sugestões de busca

---

### 3.7 Árvore Hierárquica (3-4h)

**3.7.1 Componente TreeView** (2h)
```
📁 Concurso X
  📁 Direito Constitucional
    👨‍🏫 Prof. João Silva (12 aulas)
      📚 Princípios Fundamentais
      📚 Direitos e Garantias
    👨‍🏫 Prof. Maria Santos (8 aulas)
  📁 Direito Administrativo
    ...
```

**3.7.2 Contadores** (1h)
- Total de aulas por nó
- Aulas concluídas / total
- Barra de progresso

**3.7.3 Navegação** (1h)
- Expandir/retrair nós
- Breadcrumb no topo
- Voltar para raiz

---

## 📊 RESUMO DE ESTIMATIVAS

| Fase | Descrição | Tempo Estimado |
|------|-----------|----------------|
| 1 | Correção de Bugs Críticos | 4-6h |
| 2 | Completar Sistema de Metas | 6-8h |
| 3 | Sistema de Aulas | 20-25h |
| **TOTAL** | **Próxima Sessão** | **30-40h** |

---

## ✅ CHECKLIST DE ENTREGA

### Bugs Corrigidos:
- [ ] JSX válido em AdicionarEditarMetaModal
- [ ] Campo "Aula Vinculada" visível e funcional
- [ ] Editor rich text restaurado
- [ ] Botões de reordenação funcionando
- [ ] 0 erros TypeScript

### Metas Completas:
- [ ] Estatísticas com gráficos
- [ ] Ciclo EARA® testado end-to-end
- [ ] Disciplinas recorrentes funcionando

### Aulas Implementadas:
- [ ] Listagem de aulas com filtros
- [ ] Player Vimeo integrado
- [ ] Progresso automático salvo
- [ ] Materiais para download
- [ ] Integração com metas
- [ ] Busca inteligente
- [ ] Árvore hierárquica

---

## 🎯 CRITÉRIOS DE SUCESSO

1. **Funcionalidade:** Todos os bugs críticos corrigidos
2. **Performance:** Páginas carregam em <2s
3. **UX:** Fluxos intuitivos e sem erros
4. **Qualidade:** 0 erros TypeScript, 0 warnings
5. **Testes:** Todos os fluxos principais testados
6. **Documentação:** README atualizado

---

**Documento criado em:** 30/10/2025  
**Versão:** 1.0  
**Status:** ✅ Pronto para execução
