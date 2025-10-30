# 📋 Proposta de Implementação: Ciclo EARA® (Distribuição Inteligente) - V2

**Autor:** Fernando Mesquita  
**Marca Registrada:** Ciclo EARA®  
**Data:** 30 de outubro de 2025  
**Status:** Aguardando validação  
**Versão:** 2.0 (corrigida)

---

## 🎯 Os 4 Pilares do Ciclo EARA®

### 1. **E**studo
**Definição:** Contato com o Material de Base  
**Tipo de Meta:** `estudo`  
**Conteúdo:** Aulas em vídeo, PDFs, apostilas, livros  
**Objetivo:** Primeiro contato com o conteúdo novo

### 2. **A**plicação
**Definição:** Resolução de Questões  
**Tipo de Meta:** `questoes`  
**Conteúdo:** Banco de questões, simulados, exercícios  
**Objetivo:** Praticar e testar compreensão do conteúdo estudado

### 3. **R**evisão
**Definição:** Construção e contato com Material de Fixação  
**Tipo de Meta:** `revisao`  
**Conteúdo:** Mapas mentais, resumos, flashcards  
**Objetivo:** Consolidar e fixar o conhecimento

### 4. **A**daptação
**Definição:** Registro de informações e análise de dados  
**Tipo de Meta:** (transversal - não é uma meta específica)  
**Conteúdo:** Estatísticas, progresso, desempenho  
**Objetivo:** Ajustar o cronograma baseado no desempenho real do aluno

---

## 🔧 Algoritmo de Distribuição Ciclo EARA®

### Fluxo Completo por Assunto

Para cada assunto do plano, o algoritmo deve criar a seguinte sequência:

```
1. ESTUDO (Material de Base)
   ↓ [30-60min depois]
2. APLICAÇÃO (Questões)
   ↓ [1-3 dias depois]
3. REVISÃO #1 (Mapas/Resumos)
   ↓ [7-14 dias depois]
4. REVISÃO #2 (Mapas/Resumos)
   ↓ [14-30 dias depois]
5. REVISÃO #3 (Mapas/Resumos)
   ↓ [Prompt: Manter ou Encerrar?]
```

### Regras de Distribuição

#### Regra 1: Sequência EARA® por Assunto
- **Estudo** sempre vem primeiro
- **Aplicação** vem 30-60 minutos depois (mesma sessão ou próxima)
- **Revisão #1** vem 1-3 dias após Aplicação
- **Revisão #2** vem 7-14 dias após Revisão #1
- **Revisão #3** vem 14-30 dias após Revisão #2

#### Regra 2: Alternância de Disciplinas
- **Trocar disciplina a cada 30-60 minutos**
- Exemplo de sessão de 3h:
  ```
  09:00-10:00: Português (Estudo)
  10:00-10:30: Português (Aplicação)
  10:30-11:30: Matemática (Estudo)
  11:30-12:00: Matemática (Aplicação)
  ```

#### Regra 3: Priorização por Incidência
- **Alta incidência:** Prioridade máxima
- **Média incidência:** Prioridade normal
- **Baixa incidência:** Prioridade baixa
- **Validação:** Máximo 30% das metas podem ter incidência alta

#### Regra 4: Disciplinas Recorrentes (Pinadas)
- Mentor pode "pinar" disciplinas para aparecerem todos os dias
- Exemplo: Português todo dia (30min)
- Pinadas têm prioridade sobre não-pinadas
- Respeitar alternância mesmo com pinadas

#### Regra 5: Duração das Sessões
- **Estudo:** Duração configurada na meta
- **Aplicação:** 50% da duração do Estudo (mínimo 15min)
- **Revisão:** 30% da duração do Estudo (mínimo 10min)

#### Regra 6: Adaptação Automática
Após cada sessão de Aplicação (questões), o sistema analisa:
- **Se acerto ≥ 90%:** Acelerar próximas revisões (+20% no intervalo)
- **Se acerto < 70%:** Desacelerar próximas revisões (-20% no intervalo)
- **Se acerto entre 70-90%:** Manter intervalos padrão

---

## 📊 Estrutura de Dados

### Tabela: `planos`
```sql
ALTER TABLE planos ADD COLUMN algoritmoEARA TINYINT DEFAULT 1;
ALTER TABLE planos ADD COLUMN configuracaoEARA JSON;
```

**Configuração EARA® (JSON):**
```json
{
  "estudo": {
    "habilitado": true
  },
  "aplicacao": {
    "habilitado": true,
    "duracaoPercentual": 50,  // 50% do tempo de estudo
    "intervaloAposEstudo": "mesma_sessao"  // ou "proxima_sessao"
  },
  "revisao": {
    "habilitado": true,
    "ciclosObrigatorios": 3,
    "duracaoPercentual": 30,  // 30% do tempo de estudo
    "intervalos": {
      "revisao1": { min: 1, max: 3 },    // dias após aplicação
      "revisao2": { min: 7, max: 14 },   // dias após revisão 1
      "revisao3": { min: 14, max: 30 }   // dias após revisão 2
    },
    "promptAposUltima": true  // perguntar se quer continuar
  },
  "adaptacao": {
    "habilitada": true,
    "automatica": true,
    "acelerarSeAcima": 90,
    "desacelerarSeAbaixo": 70,
    "ajustePercentual": 20
  },
  "alternancia": {
    "habilitada": true,
    "intervaloMinutos": 30,  // trocar disciplina a cada 30-60min
    "intervaloMaximo": 60
  },
  "disciplinasRecorrentes": [
    {
      "disciplina": "Português",
      "pinada": true,
      "duracaoDiaria": 30  // minutos
    }
  ]
}
```

### Tabela: `metas`
```sql
ALTER TABLE metas ADD COLUMN assuntoAgrupador VARCHAR(255);
ALTER TABLE metas ADD COLUMN sequenciaEARA INT;  -- 1=Estudo, 2=Aplicação, 3=Revisão1, etc
ALTER TABLE metas ADD COLUMN metaOrigemId INT;  -- ID da meta de Estudo original
```

### Tabela: `progressoMetas`
```sql
ALTER TABLE progressoMetas ADD COLUMN cicloEARA VARCHAR(50);  -- 'estudo', 'aplicacao', 'revisao1', etc
ALTER TABLE progressoMetas ADD COLUMN desempenhoQuestoes INT;  -- % de acerto (0-100)
ALTER TABLE progressoMetas ADD COLUMN proximoCiclo VARCHAR(50);  -- próximo ciclo agendado
ALTER TABLE progressoMetas ADD COLUMN dataProximoCiclo DATE;
```

---

## 🎨 Interface Administrativa

### Componente: `ConfiguracaoEARA.tsx`

**Seções:**

#### 1. Toggle Principal
```
[ ✓ ] Habilitar Ciclo EARA® para este plano
```

#### 2. Configuração de Estudo
```
[ ✓ ] Incluir metas de Estudo (Material de Base)
```

#### 3. Configuração de Aplicação
```
[ ✓ ] Incluir metas de Aplicação (Questões)
Duração: [50%] do tempo de Estudo
Agendar: ( ) Mesma sessão  (•) Próxima sessão
```

#### 4. Configuração de Revisão
```
[ ✓ ] Incluir metas de Revisão (Mapas/Resumos/Flashcards)
Ciclos obrigatórios: [3]
Duração: [30%] do tempo de Estudo

Intervalos:
  1ª Revisão: [1] a [3] dias após Aplicação
  2ª Revisão: [7] a [14] dias após 1ª Revisão
  3ª Revisão: [14] a [30] dias após 2ª Revisão

[ ✓ ] Perguntar ao aluno após 3ª revisão se deseja continuar
```

#### 5. Configuração de Adaptação
```
[ ✓ ] Habilitar Adaptação Automática
[ ✓ ] Ajustar automaticamente (sem pedir confirmação)

Acelerar se acerto ≥ [90]%
Desacelerar se acerto < [70]%
Ajuste: [±20]% no intervalo
```

#### 6. Alternância de Disciplinas
```
[ ✓ ] Habilitar Alternância Automática
Trocar disciplina a cada: [30] a [60] minutos
```

#### 7. Disciplinas Recorrentes (Pinadas)
```
[+ Adicionar Disciplina Pinada]

Lista:
┌─────────────────────────────────────┐
│ Português                      30min│
│ [📌 Pinada] [✏️ Editar] [🗑️ Remover]│
└─────────────────────────────────────┘
```

#### 8. Validação e Preview
```
⚠️ Avisos:
- 35% das metas têm incidência alta (máximo recomendado: 30%)
- Tempo total estimado: 180 dias (dentro do prazo)

📊 Preview:
[Gráfico de distribuição temporal mostrando E-A-R-R-R ao longo do tempo]

Botões:
[Aplicar Ciclo EARA®]  [Resetar Cronograma]  [Salvar Configuração]
```

---

## 👨‍🎓 Interface do Aluno

### 1. Badge no Cronograma
```
┌────────────────────────────────────┐
│ 🎯 Seu cronograma usa Ciclo EARA® │
│    by Fernando Mesquita            │
└────────────────────────────────────┘
```

### 2. Indicadores nas Metas
```
┌─────────────────────────────────┐
│ 📖 Português - Sintaxe          │
│ Estudo | 60min                  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ ✏️ Português - Sintaxe          │
│ Aplicação | 30min               │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 🔄 Português - Sintaxe          │
│ Revisão #1 | 20min              │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 🔄🔄 Português - Sintaxe        │
│ Revisão #2 | 20min              │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 🔄🔄🔄 Português - Sintaxe      │
│ Revisão #3 | 20min              │
└─────────────────────────────────┘
```

### 3. Tooltip Explicativo
```
Ao hover:
┌──────────────────────────────────────┐
│ Esta é a 2ª Revisão deste assunto    │
│ Você estudou em: 15/10               │
│ Aplicou questões em: 16/10           │
│ 1ª Revisão em: 18/10                 │
│ Próxima revisão em: 01/11            │
└──────────────────────────────────────┘
```

### 4. Prompt Após 3ª Revisão
```
┌──────────────────────────────────────────┐
│ 🎉 Você completou 3 revisões!            │
│                                          │
│ Deseja continuar revisando este assunto?│
│                                          │
│ [Sim, agendar mais revisões]            │
│ [Não, considero fixado]                 │
└──────────────────────────────────────────┘
```

### 5. Toggle "Sair do EARA®"
```
Configurações do Cronograma:
[ ] Desabilitar Ciclo EARA® (cronograma manual)

⚠️ Ao desabilitar, você perderá:
- Distribuição automática otimizada
- Revisões programadas
- Adaptação baseada em desempenho
```

---

## 🔄 Algoritmo Detalhado

### Função Principal
```typescript
async function distribuirMetasComEARA(
  planoId: number,
  matriculaId: number,
  dataInicio: Date,
  configuracao: ConfigEARA
): Promise<ProgressoMeta[]> {
  
  // 1. Buscar metas do plano
  const metasOriginais = await getMetasByPlanoId(planoId);
  
  // 2. Validar incidência alta (máx 30%)
  validarIncidenciaAlta(metasOriginais);
  
  // 3. Agrupar por assunto
  const assuntos = agruparPorAssunto(metasOriginais);
  
  // 4. Para cada assunto, criar sequência EARA
  const metasEARA: MetaEARA[] = [];
  
  for (const assunto of assuntos) {
    const sequencia = criarSequenciaEARA(assunto, configuracao);
    metasEARA.push(...sequencia);
  }
  
  // 5. Ordenar por prioridade (incidência)
  const metasOrdenadas = ordenarPorPrioridade(metasEARA);
  
  // 6. Distribuir no calendário
  const cronograma = distribuirNoCalendario(
    metasOrdenadas,
    dataInicio,
    configuracao
  );
  
  // 7. Inserir disciplinas pinadas
  inserirDisciplinasPinadas(cronograma, configuracao.disciplinasRecorrentes);
  
  // 8. Validar e ajustar
  validarCronograma(cronograma);
  
  // 9. Salvar no banco
  return await salvarCronograma(matriculaId, cronograma);
}
```

### Criar Sequência EARA por Assunto
```typescript
function criarSequenciaEARA(
  metaEstudo: Meta,
  config: ConfigEARA
): MetaEARA[] {
  const sequencia: MetaEARA[] = [];
  
  // 1. ESTUDO (meta original)
  sequencia.push({
    ...metaEstudo,
    sequenciaEARA: 1,
    cicloEARA: 'estudo',
    metaOrigemId: metaEstudo.id,
    dataIdeal: null,  // será calculado na distribuição
  });
  
  // 2. APLICAÇÃO (se habilitado)
  if (config.aplicacao.habilitada) {
    sequencia.push({
      ...metaEstudo,
      id: null,  // será gerado
      tipo: 'questoes',
      duracao: metaEstudo.duracao * (config.aplicacao.duracaoPercentual / 100),
      sequenciaEARA: 2,
      cicloEARA: 'aplicacao',
      metaOrigemId: metaEstudo.id,
      intervaloAposAnterior: config.aplicacao.intervaloAposEstudo === 'mesma_sessao' ? 0 : 1,
    });
  }
  
  // 3. REVISÕES (se habilitado)
  if (config.revisao.habilitada) {
    for (let i = 1; i <= config.revisao.ciclosObrigatorios; i++) {
      const intervaloConfig = config.revisao.intervalos[`revisao${i}`];
      
      sequencia.push({
        ...metaEstudo,
        id: null,
        tipo: 'revisao',
        duracao: metaEstudo.duracao * (config.revisao.duracaoPercentual / 100),
        sequenciaEARA: 2 + i,
        cicloEARA: `revisao${i}`,
        metaOrigemId: metaEstudo.id,
        intervaloMinDias: intervaloConfig.min,
        intervaloMaxDias: intervaloConfig.max,
      });
    }
  }
  
  return sequencia;
}
```

### Distribuir no Calendário
```typescript
function distribuirNoCalendario(
  metas: MetaEARA[],
  dataInicio: Date,
  config: ConfigEARA
): CronogramaDia[] {
  const cronograma: CronogramaDia[] = [];
  let dataAtual = new Date(dataInicio);
  let horasUsadasHoje = 0;
  let ultimaDisciplina: string | null = null;
  let tempoNaDisciplinaAtual = 0;
  
  const horasDiarias = config.horasDiarias || 3;
  const diasSemana = config.diasSemana || [1, 2, 3, 4, 5]; // Seg-Sex
  
  for (const meta of metas) {
    // Pular fins de semana (se configurado)
    while (!diasSemana.includes(dataAtual.getDay())) {
      dataAtual = adicionarDias(dataAtual, 1);
      horasUsadasHoje = 0;
    }
    
    // Se meta tem intervalo mínimo, calcular data ideal
    if (meta.intervaloMinDias) {
      const metaAnterior = encontrarMetaAnterior(cronograma, meta.metaOrigemId, meta.sequenciaEARA - 1);
      if (metaAnterior) {
        const dataIdeal = adicionarDias(metaAnterior.data, meta.intervaloMinDias);
        if (dataIdeal > dataAtual) {
          dataAtual = dataIdeal;
          horasUsadasHoje = 0;
        }
      }
    }
    
    // Verificar alternância de disciplinas
    if (config.alternancia.habilitada) {
      if (ultimaDisciplina === meta.disciplina) {
        tempoNaDisciplinaAtual += meta.duracao;
        
        // Se passou de 60min, forçar troca
        if (tempoNaDisciplinaAtual > config.alternancia.intervaloMaximo) {
          // Pular para próxima meta de outra disciplina
          const proximaOutraDisciplina = encontrarProximaOutraDisciplina(metas, meta.disciplina);
          if (proximaOutraDisciplina) {
            // Trocar ordem
            trocarOrdem(metas, meta, proximaOutraDisciplina);
            continue;
          }
        }
      } else {
        ultimaDisciplina = meta.disciplina;
        tempoNaDisciplinaAtual = meta.duracao;
      }
    }
    
    // Verificar se cabe no dia
    const duracaoHoras = meta.duracao / 60;
    if (horasUsadasHoje + duracaoHoras > horasDiarias) {
      // Passar para próximo dia
      dataAtual = adicionarDias(dataAtual, 1);
      horasUsadasHoje = 0;
      ultimaDisciplina = null;
      tempoNaDisciplinaAtual = 0;
    }
    
    // Adicionar ao cronograma
    cronograma.push({
      data: new Date(dataAtual),
      meta: meta,
      ordem: cronograma.length + 1,
    });
    
    horasUsadasHoje += duracaoHoras;
  }
  
  return cronograma;
}
```

### Adaptação Automática
```typescript
async function adaptarCronogramaAposQuestoes(
  userId: number,
  metaId: number,
  desempenho: number  // % de acerto (0-100)
) {
  const config = await getConfiguracaoEARA(userId);
  
  if (!config.adaptacao.habilitada || !config.adaptacao.automatica) {
    return;
  }
  
  // Buscar próximas revisões desta meta
  const proximasRevisoes = await getProximasRevisoes(userId, metaId);
  
  let ajuste = 1.0;
  
  if (desempenho >= config.adaptacao.acelerarSeAcima) {
    // Acelerar: aumentar intervalo
    ajuste = 1 + (config.adaptacao.ajustePercentual / 100);
    console.log(`Acelerado! Desempenho ${desempenho}% - Ajuste: +${config.adaptacao.ajustePercentual}%`);
  } else if (desempenho < config.adaptacao.desacelerarSeAbaixo) {
    // Desacelerar: reduzir intervalo
    ajuste = 1 - (config.adaptacao.ajustePercentual / 100);
    console.log(`Desacelerado! Desempenho ${desempenho}% - Ajuste: -${config.adaptacao.ajustePercentual}%`);
  }
  
  // Aplicar ajuste
  for (const revisao of proximasRevisoes) {
    const intervaloAtual = calcularIntervalo(revisao.dataAgendada, new Date());
    const novoIntervalo = Math.round(intervaloAtual * ajuste);
    revisao.dataAgendada = adicionarDias(new Date(), novoIntervalo);
    
    await atualizarDataRevisao(revisao.id, revisao.dataAgendada);
  }
}
```

---

## 📍 Marca Registrada Ciclo EARA®

### Locais de Exibição

1. **Footer da Plataforma**
```html
<footer>
  <div class="app-title">DOM - Plataforma de Mentoria</div>
  <div class="powered-by">by Ciclo EARA®</div>
</footer>
```

2. **Badge no Cronograma**
```
🎯 Seu cronograma usa Ciclo EARA®
```

3. **Página de Configuração Admin**
```
Configuração do Ciclo EARA®
Metodologia proprietária de Fernando Mesquita
```

4. **Tooltip de Ajuda**
```
O que é Ciclo EARA®?
Metodologia de distribuição inteligente criada por Fernando Mesquita...
```

5. **Dashboard de Estatísticas**
```
Seu Progresso no Ciclo EARA®
```

---

## 📝 Tarefas Adicionais (Registrar no TODO)

1. **Sistema de Onboarding**
   - [ ] Criar tutorial interativo explicando Ciclo EARA®
   - [ ] Vídeo de boas-vindas do Fernando Mesquita
   - [ ] Tour guiado pela plataforma
   - [ ] Checklist de primeiros passos
   - [ ] Modal "Como usar o Ciclo EARA®"

2. **Material de Revisão**
   - [ ] Criar seção "Meus Materiais de Revisão"
   - [ ] Upload de mapas mentais
   - [ ] Upload de resumos
   - [ ] Upload de flashcards
   - [ ] Vincular materiais às metas de revisão
   - [ ] Sugestão automática de materiais

---

## ✅ Resumo das Validações

1. ✅ **Intervalos:** Não usa multiplicador fixo, usa ranges configuráveis (1-3, 7-14, 14-30 dias)
2. ✅ **Ciclos de revisão:** 3 obrigatórios + prompt para continuar
3. ✅ **Tipo de revisão:** Sempre material de revisão (mapas/resumos/flashcards)
4. ✅ **Alternância:** A cada 30-60 minutos (não por quantidade de metas)
5. ✅ **Adaptação:** Automática, sem pedir confirmação
6. ✅ **Priorização:** Alta incidência sempre prioritária (máx 30% do total)
7. ✅ **Flexibilidade:** Aluno pode desabilitar EARA® e voltar para manual
8. ✅ **Disciplinas recorrentes:** Sistema de "pinar" disciplinas para aparecerem diariamente
9. ✅ **Marca registrada:** Footer "by Ciclo EARA®"
10. ✅ **Onboarding:** Registrado como tarefa futura

---

## 🚀 Próximos Passos

1. **Validar esta proposta V2** ✋ (aguardando)
2. Implementar estrutura de dados
3. Implementar algoritmo core
4. Implementar interface administrativa
5. Implementar visualização do aluno
6. Implementar adaptação automática
7. Testes com planos reais
8. Ajustes finais

**Tempo estimado total:** 10-14h de desenvolvimento

---

**Aguardando sua validação! 🚀**
