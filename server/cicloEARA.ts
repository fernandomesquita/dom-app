/**
 * Ciclo EARA® - Algoritmo de Distribuição Inteligente
 * Metodologia proprietária de Fernando Mesquita
 * 
 * E - Estudo (Material de Base)
 * A - Aplicação (Questões)
 * R - Revisão (Mapas/Resumos/Flashcards)
 * A - Adaptação (Análise e Ajustes)
 */

import { Meta } from "../drizzle/schema";

export interface ConfigEARA {
  estudo: {
    habilitado: boolean;
  };
  aplicacao: {
    habilitado: boolean;
    duracaoPercentual: number;  // 50% do tempo de estudo
    intervaloAposEstudo: "mesma_sessao" | "proxima_sessao";
  };
  revisao: {
    habilitada: boolean;
    ciclosObrigatorios: number;  // 3
    duracaoPercentual: number;  // 30% do tempo de estudo
    intervalos: {
      revisao1: { min: number; max: number };  // 1-3 dias
      revisao2: { min: number; max: number };  // 7-14 dias
      revisao3: { min: number; max: number };  // 14-30 dias
    };
    promptAposUltima: boolean;
  };
  adaptacao: {
    habilitada: boolean;
    automatica: boolean;
    acelerarSeAcima: number;  // 90%
    desacelerarSeAbaixo: number;  // 70%
    ajustePercentual: number;  // 20%
  };
  alternancia: {
    habilitada: boolean;
    intervaloMinutos: number;  // 30
    intervaloMaximo: number;  // 60
  };
  disciplinasRecorrentes: Array<{
    disciplina: string;
    pinada: boolean;
    duracaoDiaria: number;  // minutos
  }>;
}

export const CONFIG_EARA_PADRAO: ConfigEARA = {
  estudo: {
    habilitado: true,
  },
  aplicacao: {
    habilitado: true,
    duracaoPercentual: 50,
    intervaloAposEstudo: "mesma_sessao",
  },
  revisao: {
    habilitada: true,
    ciclosObrigatorios: 3,
    duracaoPercentual: 30,
    intervalos: {
      revisao1: { min: 1, max: 3 },
      revisao2: { min: 7, max: 14 },
      revisao3: { min: 14, max: 30 },
    },
    promptAposUltima: true,
  },
  adaptacao: {
    habilitada: true,
    automatica: true,
    acelerarSeAcima: 90,
    desacelerarSeAbaixo: 70,
    ajustePercentual: 20,
  },
  alternancia: {
    habilitada: true,
    intervaloMinutos: 30,
    intervaloMaximo: 60,
  },
  disciplinasRecorrentes: [],
};

export interface MetaEARA extends Meta {
  sequenciaEARA: number;  // 1=Estudo, 2=Aplicação, 3-5=Revisões
  cicloEARA: string;  // 'estudo', 'aplicacao', 'revisao1', etc
  metaOrigemId: number | null;  // ID da meta de Estudo original
  assuntoAgrupador: string;  // Para agrupar E-A-R-R-R
  intervaloMinDias?: number;
  intervaloMaxDias?: number;
  dataIdeal?: Date;
}

export interface CronogramaDia {
  data: Date;
  meta: MetaEARA;
  ordem: number;
  horaInicio?: string;  // "09:00"
  horaFim?: string;  // "10:30"
}

/**
 * Cria a sequência completa EARA® para um assunto
 */
export function criarSequenciaEARA(
  metaEstudo: Meta,
  config: ConfigEARA
): MetaEARA[] {
  const sequencia: MetaEARA[] = [];
  const assuntoAgrupador = `${metaEstudo.disciplina}_${metaEstudo.assunto}`.replace(/\s+/g, '_');
  
  // 1. ESTUDO (meta original)
  if (config.estudo.habilitado) {
    sequencia.push({
      ...metaEstudo,
      sequenciaEARA: 1,
      cicloEARA: 'estudo',
      metaOrigemId: null,
      assuntoAgrupador,
    });
  }
  
  // 2. APLICAÇÃO (questões)
  if (config.aplicacao.habilitada) {
    const duracaoAplicacao = Math.max(
      15,
      Math.round(metaEstudo.duracao * (config.aplicacao.duracaoPercentual / 100))
    );
    
    sequencia.push({
      ...metaEstudo,
      id: 0,  // Será gerado no banco
      tipo: 'questoes',
      duracao: duracaoAplicacao,
      sequenciaEARA: 2,
      cicloEARA: 'aplicacao',
      metaOrigemId: metaEstudo.id,
      assuntoAgrupador,
      intervaloMinDias: config.aplicacao.intervaloAposEstudo === 'mesma_sessao' ? 0 : 1,
      intervaloMaxDias: config.aplicacao.intervaloAposEstudo === 'mesma_sessao' ? 0 : 1,
    });
  }
  
  // 3. REVISÕES
  if (config.revisao.habilitada) {
    const duracaoRevisao = Math.max(
      10,
      Math.round(metaEstudo.duracao * (config.revisao.duracaoPercentual / 100))
    );
    
    for (let i = 1; i <= config.revisao.ciclosObrigatorios; i++) {
      const intervaloKey = `revisao${i}` as 'revisao1' | 'revisao2' | 'revisao3';
      const intervaloConfig = config.revisao.intervalos[intervaloKey];
      
      if (intervaloConfig) {
        sequencia.push({
          ...metaEstudo,
          id: 0,
          tipo: 'revisao',
          duracao: duracaoRevisao,
          sequenciaEARA: 2 + i,
          cicloEARA: intervaloKey,
          metaOrigemId: metaEstudo.id,
          assuntoAgrupador,
          intervaloMinDias: intervaloConfig.min,
          intervaloMaxDias: intervaloConfig.max,
        });
      }
    }
  }
  
  return sequencia;
}

/**
 * Calcula o peso de priorização de uma meta
 */
export function calcularPeso(meta: Meta): number {
  const pesoIncidencia = {
    "alta": 3,
    "media": 2,
    "baixa": 1,
  };
  
  const pesoPrioridade = meta.prioridade || 3;
  const incidencia = meta.incidencia || "media";
  
  return pesoIncidencia[incidencia] * pesoPrioridade;
}

/**
 * Valida se não há mais de 30% de metas com incidência alta
 */
export function validarIncidenciaAlta(metas: Meta[]): void {
  const metasAlta = metas.filter(m => m.incidencia === 'alta').length;
  const percentual = (metasAlta / metas.length) * 100;
  
  if (percentual > 30) {
    console.warn(`⚠️ Aviso: ${percentual.toFixed(1)}% das metas têm incidência alta (recomendado: máx 30%)`);
  }
}

/**
 * Agrupa metas por assunto
 */
export function agruparPorAssunto(metas: Meta[]): Map<string, Meta[]> {
  const grupos = new Map<string, Meta[]>();
  
  for (const meta of metas) {
    const chave = `${meta.disciplina}_${meta.assunto}`;
    if (!grupos.has(chave)) {
      grupos.set(chave, []);
    }
    grupos.get(chave)!.push(meta);
  }
  
  return grupos;
}

/**
 * Ordena metas por prioridade (peso)
 */
export function ordenarPorPrioridade(metas: MetaEARA[]): MetaEARA[] {
  return [...metas].sort((a, b) => {
    const pesoA = calcularPeso(a);
    const pesoB = calcularPeso(b);
    
    if (pesoA !== pesoB) {
      return pesoB - pesoA;  // Maior peso primeiro
    }
    
    // Desempate: sequência EARA (Estudo antes de Aplicação antes de Revisão)
    return a.sequenciaEARA - b.sequenciaEARA;
  });
}

/**
 * Adiciona dias a uma data
 */
export function adicionarDias(data: Date, dias: number): Date {
  const nova = new Date(data);
  nova.setDate(nova.getDate() + dias);
  return nova;
}

/**
 * Verifica se a data é um dia da semana configurado
 */
export function isDiaEstudo(data: Date, diasEstudo: number[]): boolean {
  const diaSemana = data.getDay();  // 0=Dom, 6=Sáb
  return diasEstudo.includes(diaSemana);
}

/**
 * Encontra a próxima data de estudo disponível
 */
export function proximoDiaEstudo(dataAtual: Date, diasEstudo: number[]): Date {
  let data = new Date(dataAtual);
  let tentativas = 0;
  
  while (!isDiaEstudo(data, diasEstudo) && tentativas < 14) {
    data = adicionarDias(data, 1);
    tentativas++;
  }
  
  return data;
}

/**
 * Distribui metas no calendário respeitando regras do Ciclo EARA®
 */
export function distribuirNoCalendario(
  metas: MetaEARA[],
  dataInicio: Date,
  horasDiarias: number,
  diasEstudo: number[],  // [1,2,3,4,5] = Seg-Sex
  config: ConfigEARA
): CronogramaDia[] {
  const cronograma: CronogramaDia[] = [];
  let dataAtual = proximoDiaEstudo(new Date(dataInicio), diasEstudo);
  let minutosUsadosHoje = 0;
  let ultimaDisciplina: string | null = null;
  let tempoNaDisciplinaAtual = 0;
  
  const minutosDisponiveis = horasDiarias * 60;
  
  // Mapa para rastrear última data de cada meta de estudo (para calcular revisões)
  const datasEstudo = new Map<number, Date>();
  const datasAplicacao = new Map<number, Date>();
  const datasRevisao = new Map<number, Map<string, Date>>();  // metaId -> ciclo -> data
  
  for (const meta of metas) {
    // Se meta tem intervalo mínimo, calcular data ideal
    if (meta.intervaloMinDias !== undefined && meta.metaOrigemId) {
      let dataReferencia: Date | undefined;
      
      if (meta.cicloEARA === 'aplicacao') {
        // Aplicação: após Estudo
        dataReferencia = datasEstudo.get(meta.metaOrigemId);
      } else if (meta.cicloEARA.startsWith('revisao')) {
        // Revisão: após Aplicação ou Revisão anterior
        if (meta.cicloEARA === 'revisao1') {
          dataReferencia = datasAplicacao.get(meta.metaOrigemId);
        } else {
          // Revisão 2 ou 3: após revisão anterior
          const revisoesAnteriores = datasRevisao.get(meta.metaOrigemId);
          if (revisoesAnteriores) {
            const cicloAnterior = meta.cicloEARA === 'revisao2' ? 'revisao1' : 'revisao2';
            dataReferencia = revisoesAnteriores.get(cicloAnterior);
          }
        }
      }
      
      if (dataReferencia) {
        const diasIntervalo = meta.intervaloMinDias + Math.floor(
          Math.random() * ((meta.intervaloMaxDias || meta.intervaloMinDias) - meta.intervaloMinDias + 1)
        );
        const dataIdeal = adicionarDias(dataReferencia, diasIntervalo);
        
        if (dataIdeal > dataAtual) {
          dataAtual = proximoDiaEstudo(dataIdeal, diasEstudo);
          minutosUsadosHoje = 0;
          ultimaDisciplina = null;
          tempoNaDisciplinaAtual = 0;
        }
      }
    }
    
    // Verificar alternância de disciplinas
    if (config.alternancia.habilitada && ultimaDisciplina === meta.disciplina) {
      tempoNaDisciplinaAtual += meta.duracao;
      
      // Se passou do intervalo máximo, tentar trocar
      if (tempoNaDisciplinaAtual > config.alternancia.intervaloMaximo) {
        // Buscar próxima meta de outra disciplina
        const proximaOutraDisciplina = metas.find(
          m => m.disciplina !== meta.disciplina && 
          !cronograma.find(c => c.meta.id === m.id)
        );
        
        if (proximaOutraDisciplina) {
          // Trocar ordem (simplificado - em produção, reordenar array)
          console.log(`Alternância forçada: ${meta.disciplina} -> ${proximaOutraDisciplina.disciplina}`);
        }
      }
    } else {
      ultimaDisciplina = meta.disciplina;
      tempoNaDisciplinaAtual = meta.duracao;
    }
    
    // Verificar se cabe no dia
    if (minutosUsadosHoje + meta.duracao > minutosDisponiveis) {
      // Passar para próximo dia
      dataAtual = adicionarDias(dataAtual, 1);
      dataAtual = proximoDiaEstudo(dataAtual, diasEstudo);
      minutosUsadosHoje = 0;
      ultimaDisciplina = null;
      tempoNaDisciplinaAtual = 0;
    }
    
    // Adicionar ao cronograma
    cronograma.push({
      data: new Date(dataAtual),
      meta: meta,
      ordem: cronograma.length + 1,
    });
    
    // Registrar data para cálculos futuros
    if (meta.cicloEARA === 'estudo' && meta.id) {
      datasEstudo.set(meta.id, new Date(dataAtual));
    } else if (meta.cicloEARA === 'aplicacao' && meta.metaOrigemId) {
      datasAplicacao.set(meta.metaOrigemId, new Date(dataAtual));
    } else if (meta.cicloEARA.startsWith('revisao') && meta.metaOrigemId) {
      if (!datasRevisao.has(meta.metaOrigemId)) {
        datasRevisao.set(meta.metaOrigemId, new Map());
      }
      datasRevisao.get(meta.metaOrigemId)!.set(meta.cicloEARA, new Date(dataAtual));
    }
    
    minutosUsadosHoje += meta.duracao;
  }
  
  return cronograma;
}

/**
 * Insere disciplinas pinadas (recorrentes) no cronograma
 */
export function inserirDisciplinasPinadas(
  cronograma: CronogramaDia[],
  disciplinasRecorrentes: ConfigEARA['disciplinasRecorrentes']
): void {
  if (disciplinasRecorrentes.length === 0) return;
  
  // Agrupar cronograma por data
  const porData = new Map<string, CronogramaDia[]>();
  for (const item of cronograma) {
    const dataKey = item.data.toISOString().split('T')[0];
    if (!porData.has(dataKey)) {
      porData.set(dataKey, []);
    }
    porData.get(dataKey)!.push(item);
  }
  
  // Para cada data, inserir disciplinas pinadas no início
  for (const [dataKey, itens] of porData.entries()) {
    for (const disciplinaPinada of disciplinasRecorrentes) {
      if (!disciplinaPinada.pinada) continue;
      
      // Verificar se já existe meta desta disciplina neste dia
      const jaExiste = itens.some(i => i.meta.disciplina === disciplinaPinada.disciplina);
      if (jaExiste) continue;
      
      // Criar meta pinada (simplificado - em produção, buscar do banco)
      console.log(`Inserindo disciplina pinada: ${disciplinaPinada.disciplina} em ${dataKey}`);
    }
  }
}

/**
 * Valida o cronograma gerado
 */
export function validarCronograma(cronograma: CronogramaDia[]): { valido: boolean; erros: string[] } {
  const erros: string[] = [];
  
  // Verificar se há metas
  if (cronograma.length === 0) {
    erros.push("Cronograma vazio");
    return { valido: false, erros };
  }
  
  // Verificar datas em ordem
  for (let i = 1; i < cronograma.length; i++) {
    if (cronograma[i].data < cronograma[i - 1].data) {
      erros.push(`Datas fora de ordem: ${cronograma[i - 1].data} -> ${cronograma[i].data}`);
    }
  }
  
  // Verificar se todas as metas têm duração > 0
  for (const item of cronograma) {
    if (item.meta.duracao <= 0) {
      erros.push(`Meta ${item.meta.id} com duração inválida: ${item.meta.duracao}`);
    }
  }
  
  return { valido: erros.length === 0, erros };
}

/**
 * Função principal: Distribuir metas com Ciclo EARA®
 */
export async function distribuirMetasComEARA(
  metasOriginais: Meta[],
  dataInicio: Date,
  horasDiarias: number,
  diasEstudo: number[],
  config: ConfigEARA = CONFIG_EARA_PADRAO
): Promise<CronogramaDia[]> {
  
  console.log(`🎯 Iniciando distribuição Ciclo EARA® para ${metasOriginais.length} metas`);
  
  // 1. Validar incidência alta
  validarIncidenciaAlta(metasOriginais);
  
  // 2. Criar sequências EARA para cada meta
  const metasEARA: MetaEARA[] = [];
  for (const meta of metasOriginais) {
    const sequencia = criarSequenciaEARA(meta, config);
    metasEARA.push(...sequencia);
  }
  
  console.log(`📚 Geradas ${metasEARA.length} metas EARA (${metasOriginais.length} originais)`);
  
  // 3. Ordenar por prioridade
  const metasOrdenadas = ordenarPorPrioridade(metasEARA);
  
  // 4. Distribuir no calendário
  const cronograma = distribuirNoCalendario(
    metasOrdenadas,
    dataInicio,
    horasDiarias,
    diasEstudo,
    config
  );
  
  // 5. Inserir disciplinas pinadas
  inserirDisciplinasPinadas(cronograma, config.disciplinasRecorrentes);
  
  // 6. Validar
  const { valido, erros } = validarCronograma(cronograma);
  if (!valido) {
    console.error("❌ Cronograma inválido:", erros);
    throw new Error(`Cronograma inválido: ${erros.join(', ')}`);
  }
  
  console.log(`✅ Cronograma gerado: ${cronograma.length} sessões em ${Math.ceil(cronograma.length / diasEstudo.length)} semanas`);
  
  return cronograma;
}
