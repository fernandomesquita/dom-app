# 📋 Proposta de Implementação: Ciclo EARA® (Distribuição Inteligente)

**Autor:** Fernando Mesquita  
**Marca Registrada:** Ciclo EARA®  
**Data:** 30 de outubro de 2025  
**Status:** Aguardando validação

---

## 🎯 Objetivo

Implementar o algoritmo de distribuição inteligente de metas **Ciclo EARA®** que automatiza a criação de cronogramas personalizados de estudo, considerando múltiplos fatores pedagógicos e científicos para otimizar o aprendizado do aluno.

---

## 📊 Visão Geral do Ciclo EARA®

O **Ciclo EARA®** é uma metodologia proprietária de distribuição temporal de conteúdos que considera:

1. **E**spaçamento (Spaced Repetition)
2. **A**lternância (Interleaving)
3. **R**evisão (Review Cycles)
4. **A**daptação (Adaptive Learning)

---

## 🔧 Proposta de Implementação

### FASE 6.1: Estrutura de Dados (1-2h)

**Objetivo:** Preparar o banco de dados para suportar o algoritmo.

**Ações:**
1. Adicionar campos na tabela `planos`:
   - `algoritmoEARA` (boolean) - habilitar/desabilitar EARA®
   - `configuracaoEARA` (JSON) - parâmetros personalizados
   
2. Adicionar campos na tabela `metas`:
   - `cicloRevisao` (int) - número do ciclo de revisão (1, 2, 3...)
   - `proximaRevisao` (date) - data calculada para próxima revisão
   - `intervaloDias` (int) - intervalo em dias até próxima revisão
   
3. Adicionar campos na tabela `matriculas`:
   - `configuracaoPersonalizada` (JSON) - override de configurações EARA®

**Configuração EARA® (JSON):**
```json
{
  "espacamento": {
    "intervaloInicial": 1,      // dias até primeira revisão
    "multiplicador": 2.5,        // fator de crescimento (curva de esquecimento)
    "intervaloMaximo": 30        // limite máximo entre revisões
  },
  "alternancia": {
    "habilitada": true,
    "minimoMetasEntreMesmaDisciplina": 2,  // quantas metas de outras disciplinas antes de repetir
    "prioridadeVariacao": "alta"           // baixa, media, alta
  },
  "revisao": {
    "ciclosObrigatorios": 3,     // quantas revisões mínimas
    "reducaoDuracao": 0.5,       // 50% do tempo original na revisão
    "tipoRevisao": "questoes"    // estudo, questoes, misto
  },
  "adaptacao": {
    "ajustarPorDesempenho": true,
    "acelerarSeAcima": 90,       // % de acerto para acelerar
    "desacelerarSeAbaixo": 70    // % de acerto para desacelerar
  }
}
```

---

### FASE 6.2: Algoritmo Core (4-6h)

**Objetivo:** Implementar o algoritmo de distribuição.

**Função Principal:** `distribuirMetasComEARA(planoId, matriculaId, dataInicio, configuracao)`

**Fluxo do Algoritmo:**

#### 1. **Preparação**
- Buscar todas as metas do plano ordenadas por `ordem`
- Buscar configurações do aluno (horas diárias, dias da semana)
- Buscar configuração EARA® (plano ou personalizada)
- Calcular total de dias disponíveis até `dataFim` da matrícula

#### 2. **Classificação de Metas**
```typescript
interface MetaClassificada {
  id: number;
  disciplina: string;
  assunto: string;
  tipo: "estudo" | "revisao" | "questoes";
  duracao: number;
  incidencia: "baixa" | "media" | "alta";
  prioridade: number;
  ordem: number;
  
  // Calculados pelo algoritmo
  peso: number;              // baseado em incidência e prioridade
  cicloAtual: number;        // 0 = primeira vez, 1+ = revisão
  dataIdeal: Date;           // data calculada para esta meta
  intervaloProximaRevisao: number;  // dias até próxima revisão
}
```

**Cálculo de Peso:**
```typescript
function calcularPeso(meta: Meta): number {
  const pesoIncidencia = {
    "alta": 3,
    "media": 2,
    "baixa": 1
  };
  
  const pesoPrioridade = meta.prioridade || 3;
  
  return pesoIncidencia[meta.incidencia] * pesoPrioridade;
}
```

#### 3. **Distribuição Temporal**

**Passo 3.1: Primeira Passagem (Estudo Inicial)**
- Distribuir todas as metas tipo "estudo" respeitando:
  - Horas diárias disponíveis
  - Dias da semana configurados
  - Alternância de disciplinas (mínimo 2 metas de outras disciplinas entre mesma)
  - Ordem de prioridade (peso)

**Passo 3.2: Cálculo de Revisões**
Para cada meta de estudo distribuída:
```typescript
function calcularRevisoes(meta: MetaClassificada, config: ConfigEARA): MetaRevisao[] {
  const revisoes: MetaRevisao[] = [];
  let dataBase = meta.dataIdeal;
  let intervalo = config.espacamento.intervaloInicial;
  
  for (let ciclo = 1; ciclo <= config.revisao.ciclosObrigatorios; ciclo++) {
    // Calcular próxima data de revisão
    const diasAteRevisao = intervalo;
    const dataRevisao = adicionarDias(dataBase, diasAteRevisao);
    
    revisoes.push({
      metaOriginalId: meta.id,
      cicloRevisao: ciclo,
      dataIdeal: dataRevisao,
      duracao: meta.duracao * config.revisao.reducaoDuracao,
      tipo: config.revisao.tipoRevisao
    });
    
    // Atualizar para próximo ciclo (curva de esquecimento)
    intervalo = Math.min(
      intervalo * config.espacamento.multiplicador,
      config.espacamento.intervaloMaximo
    );
    dataBase = dataRevisao;
  }
  
  return revisoes;
}
```

**Passo 3.3: Inserção de Revisões**
- Inserir revisões calculadas no cronograma
- Respeitar alternância de disciplinas
- Ajustar se houver conflito de horários
- Priorizar revisões de alta incidência

**Passo 3.4: Distribuição de Questões**
- Distribuir metas tipo "questoes" após estudo + primeira revisão
- Agrupar questões da mesma disciplina
- Respeitar dias disponíveis

#### 4. **Validação e Ajustes**

**Validações:**
- Total de horas não excede disponibilidade
- Todas as metas foram distribuídas
- Revisões estão dentro do prazo da matrícula
- Alternância foi respeitada
- Não há sobreposição de horários

**Ajustes Automáticos:**
- Se exceder horas: reduzir duração de revisões proporcionalmente
- Se faltar tempo: remover ciclos de revisão menos prioritários
- Se disciplina repetir muito: forçar alternância

#### 5. **Persistência**

Salvar no banco:
```typescript
interface ProgressoMetaEARA {
  userId: number;
  metaId: number;
  cicloRevisao: number;        // 0 = primeira vez, 1+ = revisão
  dataAgendada: Date;
  duracao: number;
  concluida: boolean;
  proximaRevisao: Date | null;
  intervaloProximaRevisao: number | null;
}
```

---

### FASE 6.3: Interface Administrativa (2-3h)

**Objetivo:** Permitir configuração do EARA® pelo admin.

**Componente:** `ConfiguracaoEARA.tsx`

**Funcionalidades:**
1. Toggle "Habilitar Ciclo EARA®"
2. Configuração de espaçamento:
   - Slider: Intervalo inicial (1-7 dias)
   - Slider: Multiplicador (1.5-3.0)
   - Slider: Intervalo máximo (14-60 dias)
3. Configuração de alternância:
   - Toggle: Habilitar alternância
   - Slider: Mínimo de metas entre mesma disciplina (1-5)
4. Configuração de revisão:
   - Slider: Ciclos obrigatórios (1-5)
   - Slider: Redução de duração (30%-70%)
   - Select: Tipo de revisão (estudo/questões/misto)
5. Configuração de adaptação:
   - Toggle: Ajustar por desempenho
   - Slider: Acelerar se acima de X%
   - Slider: Desacelerar se abaixo de X%
6. Preview de impacto:
   - Gráfico de distribuição temporal
   - Total de dias necessários
   - Horas por semana
7. Botão "Aplicar EARA®" (executa algoritmo)
8. Botão "Resetar Cronograma" (limpa e recalcula)

---

### FASE 6.4: Visualização para o Aluno (1-2h)

**Objetivo:** Mostrar o cronograma EARA® de forma clara.

**Melhorias no Cronograma:**
1. Badge "Ciclo EARA®" no topo
2. Indicador de ciclo de revisão:
   - 📖 Estudo inicial (ciclo 0)
   - 🔄 1ª Revisão (ciclo 1)
   - 🔄🔄 2ª Revisão (ciclo 2)
   - 🔄🔄🔄 3ª Revisão (ciclo 3)
3. Tooltip explicativo ao hover:
   - "Esta é a 2ª revisão deste assunto"
   - "Próxima revisão em 15 dias"
4. Cores diferenciadas:
   - Estudo inicial: cor normal
   - Revisões: tom mais claro da mesma cor
5. Linha do tempo visual:
   - Mostrar conexão entre estudo inicial e revisões

---

### FASE 6.5: Adaptação Dinâmica (2-3h)

**Objetivo:** Ajustar cronograma baseado no desempenho.

**Gatilhos de Adaptação:**

1. **Após conclusão de meta:**
```typescript
async function adaptarCronograma(userId: number, metaId: number, desempenho: number) {
  const config = await getConfiguracaoEARA(userId);
  
  if (!config.adaptacao.ajustarPorDesempenho) return;
  
  // Buscar próximas revisões desta meta
  const proximasRevisoes = await getProximasRevisoes(userId, metaId);
  
  if (desempenho >= config.adaptacao.acelerarSeAcima) {
    // Acelerar: aumentar intervalo em 20%
    for (const revisao of proximasRevisoes) {
      revisao.intervalo *= 1.2;
      revisao.dataAgendada = calcularNovaData(revisao);
    }
  } else if (desempenho < config.adaptacao.desacelerarSeAbaixo) {
    // Desacelerar: reduzir intervalo em 20%
    for (const revisao of proximasRevisoes) {
      revisao.intervalo *= 0.8;
      revisao.dataAgendada = calcularNovaData(revisao);
    }
  }
  
  await salvarAjustes(proximasRevisoes);
}
```

2. **Recalculo automático:**
- Ao alterar horas diárias
- Ao alterar dias da semana
- Ao pausar/retomar cronograma
- Ao adicionar/remover metas

---

### FASE 6.6: Relatórios e Analytics (1-2h)

**Objetivo:** Mostrar eficácia do EARA®.

**Métricas:**
1. Taxa de retenção por ciclo de revisão
2. Tempo médio entre revisões
3. Desempenho em questões após N revisões
4. Comparativo: com EARA® vs sem EARA®
5. Disciplinas com melhor/pior retenção
6. Sugestões de ajuste de configuração

**Dashboard EARA®:**
- Card: "Você está no Ciclo EARA®"
- Card: "Próximas revisões (5)"
- Card: "Taxa de retenção: 85%"
- Gráfico: Curva de esquecimento vs revisões
- Gráfico: Desempenho por ciclo

---

## 🎓 Fundamentos Científicos

### 1. Espaçamento (Spaced Repetition)
- **Base:** Curva de Esquecimento de Ebbinghaus
- **Princípio:** Revisar conteúdo em intervalos crescentes
- **Implementação:** Multiplicador de 2.5x entre revisões

### 2. Alternância (Interleaving)
- **Base:** Estudos de Rohrer & Taylor (2007)
- **Princípio:** Alternar disciplinas melhora retenção
- **Implementação:** Mínimo 2 metas de outras disciplinas

### 3. Revisão (Review Cycles)
- **Base:** Retrieval Practice (Karpicke & Roediger, 2008)
- **Princípio:** Recuperar informação fortalece memória
- **Implementação:** 3 ciclos obrigatórios com redução de tempo

### 4. Adaptação (Adaptive Learning)
- **Base:** Zone of Proximal Development (Vygotsky)
- **Princípio:** Ajustar dificuldade ao nível do aluno
- **Implementação:** Acelerar/desacelerar baseado em desempenho

---

## 📋 Exemplo Prático

**Entrada:**
- Plano: Concurso X (100 metas)
- Aluno: 3h/dia, Seg-Sex
- Duração: 6 meses (180 dias)
- EARA® habilitado

**Saída do Algoritmo:**
```
Semana 1:
  Seg: Meta 1 (Português - 2h) + Meta 2 (Matemática - 1h)
  Ter: Meta 3 (Direito - 2h) + Meta 4 (Português - 1h)
  Qua: Meta 5 (Matemática - 2h) + Meta 6 (Direito - 1h)
  ...

Semana 2:
  Seg: Meta 7 (Português - 2h) + Revisão Meta 1 (Português - 1h)
  Ter: Meta 8 (Matemática - 2h) + Revisão Meta 2 (Matemática - 30min)
  ...

Semana 4:
  Seg: Meta 15 (Direito - 2h) + Revisão Meta 1 (Português - 30min) [2ª revisão]
  ...
```

**Resultado:**
- 100 metas de estudo inicial
- 300 revisões distribuídas (3 ciclos × 100 metas)
- Total: 400 sessões em 180 dias
- Média: 2.2 sessões/dia
- Alternância respeitada: ✓
- Todas as metas revisadas 3x: ✓

---

## ⚠️ Pontos de Atenção

1. **Complexidade Computacional:**
   - Algoritmo pode ser pesado para planos grandes (500+ metas)
   - Solução: Processar em background (queue)

2. **Flexibilidade:**
   - Aluno pode querer ajustar manualmente
   - Solução: Permitir drag-and-drop com aviso de "sair do EARA®"

3. **Casos Especiais:**
   - Feriados, viagens, imprevistos
   - Solução: Função "Pausar EARA®" e "Recalcular"

4. **Performance:**
   - Recalculo completo pode demorar
   - Solução: Calcular apenas mudanças incrementais

---

## 🚀 Entrega Esperada

**Após FASE 6 completa:**
1. ✅ Algoritmo EARA® funcional
2. ✅ Interface de configuração para admins
3. ✅ Visualização clara para alunos
4. ✅ Adaptação dinâmica baseada em desempenho
5. ✅ Relatórios de eficácia
6. ✅ Documentação técnica
7. ✅ Testes com planos reais

**Tempo estimado:** 10-14h de desenvolvimento

---

## ❓ Perguntas para Validação

1. **Configuração padrão:** Os valores propostos (intervalo inicial 1 dia, multiplicador 2.5, etc) estão adequados?

2. **Ciclos de revisão:** 3 ciclos obrigatórios é suficiente ou deveria ser configurável por disciplina?

3. **Tipo de revisão:** Revisões devem ser sempre "questões" ou permitir "estudo" também?

4. **Alternância:** Mínimo de 2 metas entre mesma disciplina é ideal ou deveria ser mais/menos?

5. **Adaptação:** Ajustar automaticamente ou sempre pedir confirmação do aluno?

6. **Priorização:** Incidência alta sempre tem prioridade ou considerar outros fatores?

7. **Flexibilidade:** Permitir aluno desabilitar EARA® e voltar para cronograma manual?

8. **Disciplinas recorrentes:** Como integrar com EARA® (ex: Português todo dia)?

9. **Marca registrada:** Onde mais devemos exibir "Ciclo EARA®" na plataforma?

10. **Onboarding:** Criar tutorial explicando o que é EARA® para novos alunos?

---

**Aguardando sua validação e orientações! 🚀**
