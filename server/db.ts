import { eq, sql, desc, asc, and, count, inArray, lt, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  planos, InsertPlano,
  matriculas, InsertMatricula,
  metas, InsertMeta,
  progressoMetas, InsertProgressoMeta,
  aulas, InsertAula,
  progressoAulas, InsertProgressoAula,
  questoes,
  respostasQuestoes,
  forumTopicos, InsertForumTopico,
  forumRespostas, InsertForumResposta,
  forumNotificacoesLidas,
  avisos, InsertAviso,
  avisosDispensados,
  conquistas,
  userConquistas,
  configFuncionalidades,
  forumMensagensRetidas,
  bugsReportados,
  InsertBugReportado,
  notificacoes,
  InsertNotificacao
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'master';
      updateSet.role = 'master';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== PLANOS =====
export async function getPlanos() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(planos).where(eq(planos.ativo, 1));
  return result;
}

export async function getPlanoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(planos).where(eq(planos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPlano(plano: InsertPlano) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(planos).values(plano);
  return result;
}

// ===== MATRÍCULAS =====
export async function getMatriculasByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(matriculas).where(eq(matriculas.userId, userId));
  return result;
}

export async function getMatriculaAtiva(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const { and } = await import("drizzle-orm");
  const result = await db.select().from(matriculas)
    .where(and(
      eq(matriculas.userId, userId),
      eq(matriculas.ativo, 1)
    ))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createMatricula(matricula: InsertMatricula) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(matriculas).values(matricula);
  return result;
}

// ===== METAS =====
export async function getMetasByPlanoId(planoId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Otimizado: ordenar por ordem e limitar campos se necessário
  const result = await db
    .select()
    .from(metas)
    .where(eq(metas.planoId, planoId))
    .orderBy(metas.ordem);
  
  return result;
}

export async function getMetaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(metas).where(eq(metas.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== PROGRESSO METAS =====
export async function getProgressoMetasByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(progressoMetas).where(eq(progressoMetas.userId, userId));
  return result;
}

// ===== AULAS =====
export async function getAulas() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(aulas).where(eq(aulas.ativo, 1));
  return result;
}

export async function getAulaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(aulas).where(eq(aulas.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAula(aula: InsertAula) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(aulas).values(aula);
  return result;
}

// ===== PROGRESSO AULAS =====
export async function getProgressoAulasByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(progressoAulas).where(eq(progressoAulas.userId, userId));
  return result;
}

export async function updateProgressoAula(userId: number, aulaId: number, progresso: Partial<InsertProgressoAula>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verifica se já existe progresso
  const { and } = await import("drizzle-orm");
  const existing = await db.select().from(progressoAulas)
    .where(and(
      eq(progressoAulas.userId, userId),
      eq(progressoAulas.aulaId, aulaId)
    ))
    .limit(1);
  
  if (existing.length > 0) {
    return await db.update(progressoAulas)
      .set(progresso)
      .where(and(
        eq(progressoAulas.userId, userId),
        eq(progressoAulas.aulaId, aulaId)
      ));
  } else {
    return await db.insert(progressoAulas).values({
      userId,
      aulaId,
      ...progresso
    });
  }
}

// ===== QUESTÕES =====
export async function getQuestoes() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(questoes).where(eq(questoes.ativo, 1));
  return result;
}

export async function getQuestaoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(questoes).where(eq(questoes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== FÓRUM =====
export async function getForumTopicos() {
  const db = await getDb();
  if (!db) return [];
  const { desc } = await import("drizzle-orm");
  
  // JOIN com users para pegar nome e pontos do autor
  const result = await db
    .select({
      id: forumTopicos.id,
      titulo: forumTopicos.titulo,
      conteudo: forumTopicos.conteudo,
      categoria: forumTopicos.categoria,
      userId: forumTopicos.userId,
      curtidas: forumTopicos.curtidas,
      visualizacoes: forumTopicos.visualizacoes,
      createdAt: forumTopicos.createdAt,
      updatedAt: forumTopicos.updatedAt,
      autor: users.name,
      autorPontos: users.pontos,
    })
    .from(forumTopicos)
    .leftJoin(users, eq(forumTopicos.userId, users.id))
    .orderBy(desc(forumTopicos.updatedAt));
  
  return result;
}

export async function getForumTopicoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(forumTopicos).where(eq(forumTopicos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createForumTopico(topico: InsertForumTopico) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(forumTopicos).values(topico);
  return result;
}

export async function getForumRespostasByTopicoId(topicoId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(forumRespostas).where(eq(forumRespostas.topicoId, topicoId));
  return result;
}

export async function createForumResposta(resposta: InsertForumResposta) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(forumRespostas).values(resposta);
  return result;
}

// ===== AVISOS =====
export async function getAvisosAtivos(userId?: number, planoId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(avisos).where(eq(avisos.ativo, 1));
  
  // Filtra por plano ou avisos globais
  // TODO: adicionar lógica de filtragem mais complexa
  
  const result = await query;
  return result;
}

export async function createAviso(aviso: InsertAviso) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(avisos).values(aviso);
  return result;
}

export async function dispensarAviso(userId: number, avisoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(avisosDispensados).values({ userId, avisoId });
  return result;
}


// ========== METAS - CRUD COMPLETO ==========

export async function createMeta(meta: Partial<InsertMeta>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // Validar campos obrigatórios
    if (!meta.planoId) {
      throw new Error("Plano é obrigatório");
    }
    if (!meta.disciplina || meta.disciplina.trim().length < 3) {
      throw new Error("Disciplina deve ter no mínimo 3 caracteres");
    }
    if (!meta.assunto || meta.assunto.trim().length < 3) {
      throw new Error("Assunto deve ter no mínimo 3 caracteres");
    }
    if (!meta.duracao || meta.duracao < 15 || meta.duracao > 240) {
      throw new Error("Duração deve estar entre 15 e 240 minutos");
    }
    
    // Adicionar valores padrão para campos opcionais
    const metaComPadroes = {
      ...meta,
      ordem: meta.ordem ?? 0,
      incidencia: meta.incidencia ?? 'media',
      prioridade: meta.prioridade ?? 0,
    };
    
    const result = await db.insert(metas).values(metaComPadroes as InsertMeta);
    return { success: true, id: Number(result.insertId), ...meta };
  } catch (error) {
    console.error("[createMeta] Erro:", error);
    throw error;
  }
}

export async function updateMeta(id: number, updates: Partial<InsertMeta>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // Validar se meta existe
    const existing = await db.select().from(metas).where(eq(metas.id, id)).limit(1);
    if (existing.length === 0) {
      throw new Error("Meta não encontrada");
    }
    
    // Validar campos se fornecidos
    if (updates.disciplina !== undefined && updates.disciplina.trim().length < 3) {
      throw new Error("Disciplina deve ter no mínimo 3 caracteres");
    }
    if (updates.assunto !== undefined && updates.assunto.trim().length < 3) {
      throw new Error("Assunto deve ter no mínimo 3 caracteres");
    }
    if (updates.duracao !== undefined && (updates.duracao < 15 || updates.duracao > 240)) {
      throw new Error("Duração deve estar entre 15 e 240 minutos");
    }
    
    await db.update(metas).set(updates).where(eq(metas.id, id));
    return { success: true, id, ...updates };
  } catch (error) {
    console.error("[updateMeta] Erro:", error);
    throw error;
  }
}

export async function deleteMeta(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // Validar se meta existe
    const existing = await db.select().from(metas).where(eq(metas.id, id)).limit(1);
    if (existing.length === 0) {
      throw new Error("Meta não encontrada");
    }
    
    // Deletar progresso relacionado primeiro (cascade manual)
    await db.delete(progressoMetas).where(eq(progressoMetas.metaId, id));
    
    // Deletar meta
    await db.delete(metas).where(eq(metas.id, id));
    return { success: true };
  } catch (error) {
    console.error("[deleteMeta] Erro:", error);
    throw error;
  }
}

export async function marcarMetaConcluida(
  userId: number,
  metaId: number,
  concluida: boolean,
  tempoDedicado?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { and } = await import("drizzle-orm");
  
  try {
    // Validar se meta existe
    const metaExiste = await db.select().from(metas).where(eq(metas.id, metaId)).limit(1);
    if (metaExiste.length === 0) {
      throw new Error("Meta não encontrada");
    }
  
  // Buscar progresso existente
  const progressoExistente = await db
    .select()
    .from(progressoMetas)
    .where(and(
      eq(progressoMetas.metaId, metaId),
      eq(progressoMetas.userId, userId)
    ))
    .limit(1);
  
  if (progressoExistente.length > 0) {
    // Atualizar existente
    await db
      .update(progressoMetas)
      .set({
        concluida: concluida ? 1 : 0,
        dataConclusao: concluida ? new Date() : null,
        tempoGasto: tempoDedicado || progressoExistente[0].tempoGasto,
      })
      .where(eq(progressoMetas.id, progressoExistente[0].id));
    
    // Adicionar pontos e verificar conquistas se marcou como concluída
    let conquistasDesbloqueadas: any[] = [];
    if (concluida && progressoExistente[0].concluida === 0) {
      await adicionarPontos(userId, 10);
      conquistasDesbloqueadas = await verificarEAtribuirConquistas(userId);
    }
    
    return { 
      ...progressoExistente[0], 
      concluida: concluida ? 1 : 0,
      conquistasDesbloqueadas 
    };
  } else {
    // Criar novo progresso
    const result = await db.insert(progressoMetas).values({
      userId,
      metaId,
      dataAgendada: new Date(),
      concluida: concluida ? 1 : 0,
      dataConclusao: concluida ? new Date() : null,
      tempoGasto: tempoDedicado || 0,
    });
    
    // Adicionar pontos e verificar conquistas se criou já concluída
    let conquistasDesbloqueadas: any[] = [];
    if (concluida) {
      await adicionarPontos(userId, 10);
      conquistasDesbloqueadas = await verificarEAtribuirConquistas(userId);
    }
    
    return { 
      userId, 
      metaId, 
      concluida: concluida ? 1 : 0,
      conquistasDesbloqueadas 
    };
  }
  } catch (error) {
    console.error("[marcarMetaConcluida] Erro:", error);
    throw error;
  }
}

export async function adicionarAnotacaoMeta(
  userId: number,
  metaId: number,
  anotacao: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { and } = await import("drizzle-orm");
  
  // Por enquanto, vamos armazenar anotações na tabela metas mesmo
  // Em produção, seria melhor ter uma tabela separada de anotações
  await db.update(metas)
    .set({ orientacaoEstudos: anotacao })
    .where(eq(metas.id, metaId));
  
  return { success: true, metaId, anotacao };
}

export async function vincularAulaAMeta(metaId: number, aulaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(metas).set({ aulaId }).where(eq(metas.id, metaId));
  return { success: true, metaId, aulaId };
}


// ========== AULAS - PROGRESSO ==========

export async function marcarAulaConcluida(
  userId: number,
  aulaId: number,
  percentual?: number,
  posicao?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { and } = await import("drizzle-orm");
  
  // Buscar progresso existente
  const progressoExistente = await db
    .select()
    .from(progressoAulas)
    .where(and(
      eq(progressoAulas.aulaId, aulaId),
      eq(progressoAulas.userId, userId)
    ))
    .limit(1);
  
  if (progressoExistente.length > 0) {
    // Atualizar existente
    await db
      .update(progressoAulas)
      .set({
        concluida: 1,
        percentualAssistido: percentual || 100,
        ultimaPosicao: posicao || 0,
      })
      .where(eq(progressoAulas.id, progressoExistente[0].id));
    
    // Adicionar pontos e verificar conquistas se marcou como concluída
    let conquistasDesbloqueadas: any[] = [];
    if (progressoExistente[0].concluida === 0) {
      await adicionarPontos(userId, 5);
      conquistasDesbloqueadas = await verificarEAtribuirConquistas(userId);
    }
    
    return { 
      ...progressoExistente[0], 
      concluida: 1,
      conquistasDesbloqueadas 
    };
  } else {
    // Criar novo progresso
    await db.insert(progressoAulas).values({
      userId,
      aulaId,
      concluida: 1,
      percentualAssistido: percentual || 100,
      ultimaPosicao: posicao || 0,
      tempoAssistido: 0,
      favoritada: 0,
    });
    
    // Adicionar pontos ao criar já concluída
    await adicionarPontos(userId, 5);
    const conquistasDesbloqueadas = await verificarEAtribuirConquistas(userId);
    
    return { 
      userId, 
      aulaId, 
      concluida: 1,
      conquistasDesbloqueadas 
    };
  }
}

export async function salvarProgressoAula(
  userId: number,
  aulaId: number,
  posicao: number,
  percentual: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { and } = await import("drizzle-orm");
  
  // Buscar progresso existente
  const progressoExistente = await db
    .select()
    .from(progressoAulas)
    .where(and(
      eq(progressoAulas.aulaId, aulaId),
      eq(progressoAulas.userId, userId)
    ))
    .limit(1);
  
  if (progressoExistente.length > 0) {
    // Atualizar progresso
    await db
      .update(progressoAulas)
      .set({
        ultimaPosicao: posicao,
        percentualAssistido: percentual,
        concluida: percentual >= 95 ? 1 : 0,
      })
      .where(eq(progressoAulas.id, progressoExistente[0].id));
    
    return { ...progressoExistente[0], ultimaPosicao: posicao, percentualAssistido: percentual };
  } else {
    // Criar novo progresso
    await db.insert(progressoAulas).values({
      userId,
      aulaId,
      concluida: percentual >= 95 ? 1 : 0,
      percentualAssistido: percentual,
      ultimaPosicao: posicao,
      tempoAssistido: 0,
      favoritada: 0,
    });
    
    return { userId, aulaId, ultimaPosicao: posicao, percentualAssistido: percentual };
  }
}


// ========== QUESTÕES - RESPOSTAS E ESTATÍSTICAS ==========

export async function salvarRespostaQuestao(
  userId: number,
  questaoId: number,
  respostaAluno: string,
  acertou: boolean
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(respostasQuestoes).values({
    userId,
    questaoId,
    respostaAluno,
    acertou: acertou ? 1 : 0,
    tempoResposta: 0,
  });
  
  // Adicionar pontos e verificar conquistas se acertou a questão
  let conquistasDesbloqueadas: any[] = [];
  if (acertou) {
    await adicionarPontos(userId, 2);
    conquistasDesbloqueadas = await verificarEAtribuirConquistas(userId);
  }
  
  return { 
    success: true,
    conquistasDesbloqueadas 
  };
}

export async function getRespostasQuestoesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(respostasQuestoes).where(eq(respostasQuestoes.userId, userId));
}

export async function getEstatisticasQuestoes(userId: number) {
  const db = await getDb();
  if (!db) return { total: 0, corretas: 0, taxaAcerto: 0 };
  
  const respostas = await db
    .select()
    .from(respostasQuestoes)
    .where(eq(respostasQuestoes.userId, userId));
  
  const total = respostas.length;
  const corretas = respostas.filter(r => r.acertou === 1).length;
  const taxaAcerto = total > 0 ? (corretas / total) * 100 : 0;
  
  return { total, corretas, taxaAcerto: Math.round(taxaAcerto) };
}


// ========== ESTATÍSTICAS AVANÇADAS DE QUESTÕES ==========

export async function getEstatisticasPorDisciplina(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const respostas = await db
    .select()
    .from(respostasQuestoes)
    .where(eq(respostasQuestoes.userId, userId));
  
  // Buscar questões para obter disciplinas
  const questoesIds = respostas.map(r => r.questaoId);
  if (questoesIds.length === 0) return [];
  
  const questoesData = await db
    .select()
    .from(questoes)
    .where(eq(questoes.id, questoesIds[0])); // Simplificado para demo
  
  // Agrupar por disciplina
  const estatisticasPorDisciplina: Record<string, { total: number; corretas: number; taxaAcerto: number }> = {};
  
  for (const resposta of respostas) {
    const questao = questoesData.find(q => q.id === resposta.questaoId);
    if (!questao) continue;
    
    const disciplina = questao.disciplina;
    if (!estatisticasPorDisciplina[disciplina]) {
      estatisticasPorDisciplina[disciplina] = { total: 0, corretas: 0, taxaAcerto: 0 };
    }
    
    estatisticasPorDisciplina[disciplina].total++;
    if (resposta.acertou === 1) {
      estatisticasPorDisciplina[disciplina].corretas++;
    }
  }
  
  // Calcular taxas de acerto
  const resultado = Object.entries(estatisticasPorDisciplina).map(([disciplina, stats]) => ({
    disciplina,
    total: stats.total,
    corretas: stats.corretas,
    taxaAcerto: stats.total > 0 ? Math.round((stats.corretas / stats.total) * 100) : 0,
  }));
  
  return resultado;
}

export async function getEvolucaoTemporal(userId: number, dias: number = 30) {
  const db = await getDb();
  if (!db) return [];
  
  const dataInicio = new Date();
  dataInicio.setDate(dataInicio.getDate() - dias);
  
  const respostas = await db
    .select()
    .from(respostasQuestoes)
    .where(eq(respostasQuestoes.userId, userId));
  
  // Agrupar por data
  const estatisticasPorData: Record<string, { total: number; corretas: number }> = {};
  
  for (const resposta of respostas) {
    const data = new Date(resposta.createdAt).toISOString().split('T')[0];
    if (!estatisticasPorData[data]) {
      estatisticasPorData[data] = { total: 0, corretas: 0 };
    }
    estatisticasPorData[data].total++;
    if (resposta.acertou === 1) {
      estatisticasPorData[data].corretas++;
    }
  }
  
  const resultado = Object.entries(estatisticasPorData).map(([data, stats]) => ({
    data,
    total: stats.total,
    corretas: stats.corretas,
    taxaAcerto: stats.total > 0 ? Math.round((stats.corretas / stats.total) * 100) : 0,
  })).sort((a, b) => a.data.localeCompare(b.data));
  
  return resultado;
}

export async function getQuestoesMaisErradas(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  const respostas = await db
    .select()
    .from(respostasQuestoes)
    .where(eq(respostasQuestoes.userId, userId));
  
  // Contar erros por questão
  const errosPorQuestao: Record<number, number> = {};
  
  for (const resposta of respostas) {
    if (resposta.acertou === 0) {
      errosPorQuestao[resposta.questaoId] = (errosPorQuestao[resposta.questaoId] || 0) + 1;
    }
  }
  
  // Ordenar e pegar top N
  const questoesMaisErradas = Object.entries(errosPorQuestao)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([questaoId, erros]) => ({
      questaoId: parseInt(questaoId),
      erros,
    }));
  
  return questoesMaisErradas;
}


// ========== GAMIFICAÇÃO ==========

export async function adicionarPontos(userId: number, pontos: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db
    .update(users)
    .set({ pontos: sql`${users.pontos} + ${pontos}` })
    .where(eq(users.id, userId));
  
  return true;
}

export async function getPontosUsuario(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db
    .select({ pontos: users.pontos })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  
  return result[0]?.pontos || 0;
}

export async function getRanking(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      pontos: users.pontos,
    })
    .from(users)
    .orderBy(desc(users.pontos))
    .limit(limit);
  
  return result;
}

export async function getConquistasUsuario(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: conquistas.id,
      nome: conquistas.nome,
      descricao: conquistas.descricao,
      icone: conquistas.icone,
      desbloqueadaEm: userConquistas.desbloqueadaEm,
    })
    .from(userConquistas)
    .innerJoin(conquistas, eq(userConquistas.conquistaId, conquistas.id))
    .where(eq(userConquistas.userId, userId));
  
  return result;
}

export async function verificarEAtribuirConquistas(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { and } = await import("drizzle-orm");
  
  // Buscar estatísticas do usuário
  const metasConcluidas = await db
    .select()
    .from(progressoMetas)
    .where(and(
      eq(progressoMetas.userId, userId),
      eq(progressoMetas.concluida, 1)
    ));
  
  const aulasConcluidas = await db
    .select()
    .from(progressoAulas)
    .where(and(
      eq(progressoAulas.userId, userId),
      eq(progressoAulas.concluida, 1)
    ));
  
  const questoesRespondidas = await db
    .select()
    .from(respostasQuestoes)
    .where(eq(respostasQuestoes.userId, userId));
  
  const questoesCorretas = questoesRespondidas.filter(q => q.acertou === 1);
  const pontosUsuario = await getPontosUsuario(userId);
  const conquistasDesbloqueadas: Array<{ id: number; nome: string; descricao: string | null; icone: string | null }> = [];
  
  // Função auxiliar para verificar e atribuir conquista
  const verificarConquista = async (conquistaId: number) => {
    const jaTemConquista = await db
      .select()
      .from(userConquistas)
      .where(and(
        eq(userConquistas.userId, userId),
        eq(userConquistas.conquistaId, conquistaId)
      ))
      .limit(1);
    
    if (jaTemConquista.length === 0) {
      await db.insert(userConquistas).values({ userId, conquistaId });
      
      // Buscar detalhes da conquista
      const conquistaDetalhes = await db
        .select({
          id: conquistas.id,
          nome: conquistas.nome,
          descricao: conquistas.descricao,
          icone: conquistas.icone,
        })
        .from(conquistas)
        .where(eq(conquistas.id, conquistaId))
        .limit(1);
      
      if (conquistaDetalhes.length > 0) {
        conquistasDesbloqueadas.push(conquistaDetalhes[0]);
      }
      return true;
    }
    return false;
  };
  
  // Conquistas de Metas
  if (metasConcluidas.length >= 1) await verificarConquista(1);  // Primeira Meta
  if (metasConcluidas.length >= 10) await verificarConquista(2); // Estudante Dedicado
  if (metasConcluidas.length >= 50) await verificarConquista(3); // Mestre das Metas
  
  // Conquistas de Aulas
  if (aulasConcluidas.length >= 1) await verificarConquista(4);   // Primeira Aula
  if (aulasConcluidas.length >= 20) await verificarConquista(5);  // Cinéfilo dos Estudos
  if (aulasConcluidas.length >= 100) await verificarConquista(6); // Maratonista
  
  // Conquistas de Questões
  if (questoesCorretas.length >= 1) await verificarConquista(7);   // Primeira Questão
  if (questoesCorretas.length >= 50) await verificarConquista(8);  // Acertador
  if (questoesCorretas.length >= 200) await verificarConquista(9); // Expert
  
  // Conquista de Sequência (simplificada - verificar últimas 10 respostas)
  if (questoesRespondidas.length >= 10) {
    const ultimas10 = questoesRespondidas.slice(-10);
    const todasCorretas = ultimas10.every(q => q.acertou === 1);
    if (todasCorretas) await verificarConquista(10); // Sequência de Fogo
  }
  
  // Conquistas de Pontos
  if (pontosUsuario >= 100) await verificarConquista(11);  // Pontuador
  if (pontosUsuario >= 500) await verificarConquista(12);  // Campeão
  if (pontosUsuario >= 1000) await verificarConquista(13); // Lenda
  
  return conquistasDesbloqueadas;
}


// ========== ESTATÍSTICAS GERAIS DO DASHBOARD ==========

export async function getEstatisticasDashboard(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const { and } = await import("drizzle-orm");
  
  // Buscar metas concluídas
  const metasConcluidasData = await db
    .select()
    .from(progressoMetas)
    .where(and(
      eq(progressoMetas.userId, userId),
      eq(progressoMetas.concluida, 1)
    ));
  
  // Buscar total de metas do usuário
  const todasMetasData = await db
    .select()
    .from(progressoMetas)
    .where(eq(progressoMetas.userId, userId));
  
  // Buscar aulas assistidas
  const aulasAssistitasData = await db
    .select()
    .from(progressoAulas)
    .where(and(
      eq(progressoAulas.userId, userId),
      eq(progressoAulas.concluida, 1)
    ));
  
  // Buscar questões respondidas
  const questoesData = await db
    .select()
    .from(respostasQuestoes)
    .where(eq(respostasQuestoes.userId, userId));
  
  const questoesCorretas = questoesData.filter(q => q.acertou === 1);
  const taxaAcerto = questoesData.length > 0 
    ? Math.round((questoesCorretas.length / questoesData.length) * 100) 
    : 0;
  
  // Calcular horas estudadas (soma do tempo gasto em metas)
  const horasEstudadas = metasConcluidasData.reduce((acc, meta) => {
    return acc + (meta.tempoGasto || 0);
  }, 0);
  
  // Calcular sequência de dias (simplificado - últimos 7 dias com atividade)
  const hoje = new Date();
  const seteDiasAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const atividadesRecentes = metasConcluidasData.filter(meta => {
    const dataConclusao = meta.dataConclusao;
    return dataConclusao && dataConclusao >= seteDiasAtras;
  });
  
  // Contar dias únicos com atividade
  const diasUnicos = new Set(
    atividadesRecentes.map(meta => 
      meta.dataConclusao?.toISOString().split('T')[0]
    )
  ).size;
  
  return {
    horasEstudadas: Math.round(horasEstudadas / 60), // converter minutos para horas
    metasConcluidas: metasConcluidasData.length,
    totalMetas: todasMetasData.length,
    aulasAssistidas: aulasAssistitasData.length,
    questoesResolvidas: questoesData.length,
    taxaAcerto,
    sequenciaDias: diasUnicos,
  };
}


// ===== GESTÃO DE PLANOS (ADMIN) =====
export async function getAllPlanos() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(planos);
  return result;
}

export async function updatePlano(id: number, data: Partial<InsertPlano>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(planos).set(data).where(eq(planos.id, id));
  return { success: true };
}

export async function deletePlano(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verificar se há matrículas ativas
  const matriculasAtivas = await db.select().from(matriculas)
    .where(and(eq(matriculas.planoId, id), eq(matriculas.ativo, 1)));
  
  if (matriculasAtivas.length > 0) {
    throw new Error("Não é possível excluir um plano com matrículas ativas");
  }
  
  // Deletar metas relacionadas
  await db.delete(metas).where(eq(metas.planoId, id));
  
  // Deletar plano
  await db.delete(planos).where(eq(planos.id, id));
  
  return { success: true };
}

export async function togglePlanoAtivo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const plano = await getPlanoById(id);
  if (!plano) throw new Error("Plano não encontrado");
  
  await db.update(planos).set({ ativo: plano.ativo === 1 ? 0 : 1 }).where(eq(planos.id, id));
  
  return { success: true, ativo: plano.ativo === 1 ? 0 : 1 };
}

export async function getPlanoComEstatisticas(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const plano = await getPlanoById(id);
  if (!plano) return undefined;
  
  // Contar matrículas
  const matriculasResult = await db.select({ count: sql<number>`count(*)` })
    .from(matriculas)
    .where(and(eq(matriculas.planoId, id), eq(matriculas.ativo, 1)));
  
  // Contar metas
  const metasResult = await db.select({ count: sql<number>`count(*)` })
    .from(metas)
    .where(eq(metas.planoId, id));
  
  // Buscar informações do criador
  let criador = null;
  if (plano.createdBy) {
    const criadorResult = await db.select({ name: users.name })
      .from(users)
      .where(eq(users.id, plano.createdBy))
      .limit(1);
    criador = criadorResult[0]?.name || null;
  }
  
  return {
    ...plano,
    totalAlunos: Number(matriculasResult[0]?.count) || 0,
    totalMetas: Number(metasResult[0]?.count) || 0,
    criadorNome: criador,
  };
}

export async function importarPlanosDeExcel(dados: any[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const planosImportados: number[] = [];
  const metasImportadas: number[] = [];
  
  try {
    // Agrupar dados por plano
    const planosPorNome = new Map<string, any[]>();
    
    for (const linha of dados) {
      const nomePlano = linha.nomePlano || linha["Nome do Plano"];
      if (!nomePlano) continue;
      
      if (!planosPorNome.has(nomePlano)) {
        planosPorNome.set(nomePlano, []);
      }
      planosPorNome.get(nomePlano)!.push(linha);
    }
    
    // Criar planos e metas
    for (const [nomePlano, linhas] of Array.from(planosPorNome.entries())) {
      const primeiraLinha = linhas[0];
      
      // Criar plano
      const novoPlano: InsertPlano = {
        nome: nomePlano,
        descricao: primeiraLinha.descricao || primeiraLinha["Descrição"] || "",
        tipo: (primeiraLinha.tipo || primeiraLinha["Tipo"] || "pago") as "pago" | "gratuito",
        duracaoTotal: parseInt(primeiraLinha.duracao || primeiraLinha["Duração"] || "180"),
        concursoArea: primeiraLinha.concurso || primeiraLinha["Concurso"] || "",
        horasDiariasPadrao: parseInt(primeiraLinha.horasDiarias || primeiraLinha["Horas Diárias"] || "4"),
      };
      
      const resultPlano = await db.insert(planos).values(novoPlano);
      const planoId = Number((resultPlano as any).insertId);
      planosImportados.push(planoId);
      
      // Criar metas
      let ordem = 1;
      for (const linha of linhas) {
        if (!linha.disciplina && !linha["Disciplina"]) continue;
        
        const novaMeta: InsertMeta = {
          planoId: planoId,
          disciplina: linha.disciplina || linha["Disciplina"] || "",
          assunto: linha.assunto || linha["Assunto"] || "",
          tipo: (linha.tipoMeta || linha["Tipo de Meta"] || "estudo") as "estudo" | "revisao" | "questoes",
          duracao: parseInt(linha.duracaoMeta || linha["Duração da Meta"] || "60"),
          prioridade: parseInt(linha.prioridade || linha["Prioridade"] || "3"),
          ordem: ordem++,
        };
        
        const resultMeta = await db.insert(metas).values(novaMeta);
        metasImportadas.push(Number((resultMeta as any).insertId));
      }
    }
    
    return {
      success: true,
      planosImportados: planosImportados.length,
      metasImportadas: metasImportadas.length,
      planoIds: planosImportados,
    };
  } catch (error) {
    console.error("[Database] Erro ao importar planilha:", error);
    throw error;
  }
}


/**
 * Calcula o índice de engajamento de um plano
 * Mostra onde os alunos estão abandonando e taxa de retorno
 */
export async function calcularEngajamentoPlano(planoId: number) {
  const db = await getDb();
  if (!db) return {
    totalAlunos: 0,
    totalMetas: 0,
    taxaConclusaoGeral: 0,
    progressoMedio: 0,
    metaMaiorAbandono: null,
    taxaRetornoDiario: 0,
    progressoPorMeta: [],
  };

  // Buscar todas as matrículas ativas do plano
  const matriculasPlano = await db
    .select()
    .from(matriculas)
    .where(eq(matriculas.planoId, planoId));

  if (matriculasPlano.length === 0) {
    return {
      totalAlunos: 0,
      taxaConclusaoGeral: 0,
      progressoMedio: 0,
      metaMaiorAbandono: null,
      taxaRetornoDiario: 0,
      progressoPorMeta: [],
    };
  }

  // Buscar todas as metas do plano ordenadas por ID (ordem de criação)
  const metasPlano = await db
    .select()
    .from(metas)
    .where(eq(metas.planoId, planoId))
    .orderBy(metas.id);

  if (metasPlano.length === 0) {
    return {
      totalAlunos: matriculasPlano.length,
      taxaConclusaoGeral: 0,
      progressoMedio: 0,
      metaMaiorAbandono: null,
      taxaRetornoDiario: 0,
      progressoPorMeta: [],
    };
  }

  // Buscar progresso de todos os alunos matriculados
  const userIds = matriculasPlano.map((m: any) => m.userId);
  const metaIds = metasPlano.map((m: any) => m.id);

  const progressos = await db
    .select()
    .from(progressoMetas)
    .where(
      and(
        inArray(progressoMetas.userId, userIds),
        inArray(progressoMetas.metaId, metaIds)
      )
    );

  // Calcular taxa de conclusão por meta
  const progressoPorMeta = metasPlano.map((meta: any, index: number) => {
    const progressosMeta = progressos.filter((p: any) => p.metaId === meta.id);
    const concluidas = progressosMeta.filter((p: any) => p.concluida === 1).length;
    const taxaConclusao = matriculasPlano.length > 0 
      ? (concluidas / matriculasPlano.length) * 100 
      : 0;

    // Calcular taxa de retorno no dia previsto
    const progressosComData = progressosMeta.filter((p: any) => p.dataAgendada && p.dataConclusao);
    const retornosNoDia = progressosComData.filter((p: any) => {
      const agendada = new Date(p.dataAgendada!);
      const conclusao = new Date(p.dataConclusao!);
      return (
        agendada.getDate() === conclusao.getDate() &&
        agendada.getMonth() === conclusao.getMonth() &&
        agendada.getFullYear() === conclusao.getFullYear()
      );
    }).length;

    const taxaRetorno = progressosComData.length > 0
      ? (retornosNoDia / progressosComData.length) * 100
      : 0;

    return {
      metaId: meta.id,
      metaNome: `${meta.disciplina} - ${meta.assunto}`,
      posicao: index + 1,
      totalAlunos: matriculasPlano.length,
      alunosConcluiram: concluidas,
      taxaConclusao: Math.round(taxaConclusao * 10) / 10,
      taxaRetorno: Math.round(taxaRetorno * 10) / 10,
    };
  });

  // Identificar meta com maior abandono (maior queda na taxa de conclusão)
  let metaMaiorAbandono = null;
  let maiorQueda = 0;

  for (let i = 1; i < progressoPorMeta.length; i++) {
    const queda = progressoPorMeta[i - 1].taxaConclusao - progressoPorMeta[i].taxaConclusao;
    if (queda > maiorQueda) {
      maiorQueda = queda;
      metaMaiorAbandono = {
        ...progressoPorMeta[i],
        quedaTaxa: Math.round(queda * 10) / 10,
      };
    }
  }

  // Calcular métricas gerais
  const totalProgressos = progressos.length;
  const totalConcluidos = progressos.filter((p: any) => p.concluida === 1).length;
  const taxaConclusaoGeral = totalProgressos > 0
    ? (totalConcluidos / totalProgressos) * 100
    : 0;

  const progressoMedio = progressoPorMeta.length > 0
    ? progressoPorMeta.reduce((acc: number, p) => acc + p.taxaConclusao, 0) / progressoPorMeta.length
    : 0;

  const taxaRetornoDiario = progressoPorMeta.length > 0
    ? progressoPorMeta.reduce((acc: number, p) => acc + p.taxaRetorno, 0) / progressoPorMeta.length
    : 0;

  return {
    totalAlunos: matriculasPlano.length,
    totalMetas: metasPlano.length,
    taxaConclusaoGeral: Math.round(taxaConclusaoGeral * 10) / 10,
    progressoMedio: Math.round(progressoMedio * 10) / 10,
    metaMaiorAbandono,
    taxaRetornoDiario: Math.round(taxaRetornoDiario * 10) / 10,
    progressoPorMeta,
  };
}

// ========== NOTIFICAÇÕES DO FÓRUM ==========

/**
 * Buscar notificações de respostas no fórum para o usuário
 * Retorna respostas aos tópicos criados pelo usuário que ainda não foram lidas
 */
export async function getNotificacoesForumRespostas(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    // Buscar tópicos criados pelo usuário
    const topicosUsuario = await db
      .select()
      .from(forumTopicos)
      .where(eq(forumTopicos.userId, userId));

    if (topicosUsuario.length === 0) {
      return [];
    }

    const topicoIds = topicosUsuario.map(t => t.id);

    // Buscar respostas aos tópicos do usuário
    const respostas = await db
      .select()
      .from(forumRespostas)
      .where(inArray(forumRespostas.topicoId, topicoIds));

    // Filtrar respostas que não são do próprio usuário
    const respostasOutros = respostas.filter(r => r.userId !== userId);

    if (respostasOutros.length === 0) {
      return [];
    }

    // Buscar notificações já lidas
    const respostaIds = respostasOutros.map(r => r.id);
    const notificacoesLidas = await db
      .select()
      .from(forumNotificacoesLidas)
      .where(
        and(
          eq(forumNotificacoesLidas.userId, userId),
          inArray(forumNotificacoesLidas.respostaId, respostaIds)
        )
      );

    const idsLidas = new Set(notificacoesLidas.map(n => n.respostaId));

    // Filtrar apenas respostas não lidas
    const respostasNaoLidas = respostasOutros.filter(r => !idsLidas.has(r.id));

    // Buscar informações dos usuários que responderam
    const userIds = Array.from(new Set(respostasNaoLidas.map(r => r.userId)));
    const usuariosResponderam = await db
      .select()
      .from(users)
      .where(inArray(users.id, userIds));

    const userMap = new Map(usuariosResponderam.map(u => [u.id, u]));

    // Buscar informações dos tópicos
    const topicoMap = new Map(topicosUsuario.map(t => [t.id, t]));

    // Montar notificações com informações completas
    const notificacoes = respostasNaoLidas.map(resposta => {
      const usuario = userMap.get(resposta.userId);
      const topico = topicoMap.get(resposta.topicoId);

      return {
        id: resposta.id,
        topicoId: resposta.topicoId,
        topicoTitulo: topico?.titulo || "Tópico",
        respostaConteudo: resposta.conteudo,
        respondidoPor: usuario?.name || "Usuário",
        respondidoPorRole: usuario?.role || "aluno",
        createdAt: resposta.createdAt,
      };
    });

    // Ordenar por data (mais recentes primeiro)
    notificacoes.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return notificacoes;
  } catch (error) {
    console.error("[getNotificacoesForumRespostas] Erro:", error);
    return [];
  }
}

/**
 * Marcar notificação de resposta do fórum como lida
 */
export async function marcarNotificacaoForumLida(userId: number, respostaId: number) {
  const db = await getDb();
  if (!db) return { success: false };

  try {
    // Verificar se já existe
    const existente = await db
      .select()
      .from(forumNotificacoesLidas)
      .where(
        and(
          eq(forumNotificacoesLidas.userId, userId),
          eq(forumNotificacoesLidas.respostaId, respostaId)
        )
      )
      .limit(1);

    if (existente.length > 0) {
      return { success: true, alreadyRead: true };
    }

    // Inserir nova notificação lida
    await db.insert(forumNotificacoesLidas).values({
      userId,
      respostaId,
    });

    return { success: true, alreadyRead: false };
  } catch (error) {
    console.error("[marcarNotificacaoForumLida] Erro:", error);
    return { success: false };
  }
}

// ========== CONFIGURAÇÕES DE FUNCIONALIDADES ==========

export async function getConfigFuncionalidades() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(configFuncionalidades).limit(1);
  
  // Se não existir configuração, criar uma padrão
  if (result.length === 0) {
    await db.insert(configFuncionalidades).values({
      questoesHabilitado: 1,
      forumHabilitado: 1,
      materiaisHabilitado: 1,
    });
    return {
      id: 1,
      questoesHabilitado: 1,
      forumHabilitado: 1,
      materiaisHabilitado: 1,
      updatedAt: new Date(),
    };
  }
  
  return result[0];
}

export async function atualizarConfigFuncionalidades(updates: {
  questoesHabilitado?: number;
  forumHabilitado?: number;
  materiaisHabilitado?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Garantir que existe um registro
  const existing = await db.select().from(configFuncionalidades).limit(1);
  
  if (existing.length === 0) {
    await db.insert(configFuncionalidades).values({
      questoesHabilitado: updates.questoesHabilitado ?? 1,
      forumHabilitado: updates.forumHabilitado ?? 1,
      materiaisHabilitado: updates.materiaisHabilitado ?? 1,
    });
  } else {
    await db.update(configFuncionalidades)
      .set(updates)
      .where(eq(configFuncionalidades.id, existing[0].id));
  }

  return await getConfigFuncionalidades();
}


// ========== MODERAÇÃO DE LINKS NO FÓRUM ==========

import { contemLinks, extrairLinks } from "./utils/linkDetector";

/**
 * Retém mensagem para moderação se contiver links
 * Retorna true se a mensagem foi retida, false se foi publicada normalmente
 */
export async function verificarERetterMensagem(
  tipo: "topico" | "resposta",
  autorId: number,
  conteudo: string,
  topicoId?: number,
  respostaId?: number
): Promise<boolean> {
  if (!contemLinks(conteudo)) {
    return false; // Não contém links, pode ser publicada
  }

  const links = extrairLinks(conteudo);
  
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(forumMensagensRetidas).values({
    tipo,
    topicoId: topicoId || null,
    respostaId: respostaId || null,
    autorId,
    conteudo,
    linksDetectados: JSON.stringify(links),
    status: "pendente",
  });

  return true; // Mensagem retida para moderação
}

/**
 * Buscar mensagens retidas pendentes de moderação
 */
export async function getMensagensRetidas() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const mensagens = await db
    .select({
      id: forumMensagensRetidas.id,
      tipo: forumMensagensRetidas.tipo,
      topicoId: forumMensagensRetidas.topicoId,
      respostaId: forumMensagensRetidas.respostaId,
      autorId: forumMensagensRetidas.autorId,
      autorNome: users.name,
      autorEmail: users.email,
      conteudo: forumMensagensRetidas.conteudo,
      linksDetectados: forumMensagensRetidas.linksDetectados,
      status: forumMensagensRetidas.status,
      createdAt: forumMensagensRetidas.createdAt,
    })
    .from(forumMensagensRetidas)
    .leftJoin(users, eq(forumMensagensRetidas.autorId, users.id))
    .where(eq(forumMensagensRetidas.status, "pendente"))
    .orderBy(desc(forumMensagensRetidas.createdAt));

  return mensagens.map(msg => ({
    ...msg,
    links: JSON.parse(msg.linksDetectados || "[]"),
  }));
}

/**
 * Aprovar mensagem retida e publicá-la no fórum
 */
export async function aprovarMensagemRetida(mensagemId: number, revisadoPor: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const mensagem = await db
    .select()
    .from(forumMensagensRetidas)
    .where(eq(forumMensagensRetidas.id, mensagemId))
    .limit(1);

  if (!mensagem[0]) {
    throw new Error("Mensagem não encontrada");
  }

  const msg = mensagem[0];

  // Publicar mensagem no fórum
  if (msg.tipo === "topico") {
    // Criar tópico
    await db.insert(forumTopicos).values({
      userId: msg.autorId,
      titulo: "Tópico Moderado", // Você pode adicionar título ao schema de mensagens retidas
      conteudo: msg.conteudo,
      categoria: "Discussão",
    });
  } else if (msg.tipo === "resposta" && msg.topicoId) {
    // Criar resposta
    await db.insert(forumRespostas).values({
      topicoId: msg.topicoId,
      userId: msg.autorId,
      conteudo: msg.conteudo,
    });
  }

  // Atualizar status da mensagem retida
  await db
    .update(forumMensagensRetidas)
    .set({
      status: "aprovado",
      revisadoPor,
      revisadoEm: new Date(),
    })
    .where(eq(forumMensagensRetidas.id, mensagemId));

  return true;
}

/**
 * Rejeitar mensagem retida
 */
export async function rejeitarMensagemRetida(
  mensagemId: number,
  revisadoPor: number,
  motivoRejeicao?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(forumMensagensRetidas)
    .set({
      status: "rejeitado",
      revisadoPor,
      revisadoEm: new Date(),
      motivoRejeicao: motivoRejeicao || "Conteúdo inadequado",
    })
    .where(eq(forumMensagensRetidas.id, mensagemId));

  return true;
}


// ========== REORDENAÇÃO DE METAS ==========

/**
 * Mover meta para cima (diminuir ordem)
 */
export async function moverMetaParaCima(metaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Buscar meta atual
  const metaAtual = await db
    .select()
    .from(metas)
    .where(eq(metas.id, metaId))
    .limit(1);

  if (!metaAtual[0]) {
    throw new Error("Meta não encontrada");
  }

  const meta = metaAtual[0];
  const ordemAtual = meta.ordem;

  // Buscar meta anterior (mesma plano, ordem menor)
  const metaAnterior = await db
    .select()
    .from(metas)
    .where(and(
      eq(metas.planoId, meta.planoId),
      lt(metas.ordem, ordemAtual)
    ))
    .orderBy(desc(metas.ordem))
    .limit(1);

  if (!metaAnterior[0]) {
    return { success: false, message: "Meta já está no topo" };
  }

  const ordemAnterior = metaAnterior[0].ordem;

  // Trocar ordens
  await db.update(metas).set({ ordem: ordemAnterior }).where(eq(metas.id, metaId));
  await db.update(metas).set({ ordem: ordemAtual }).where(eq(metas.id, metaAnterior[0].id));

  return { success: true, message: "Meta movida para cima" };
}

/**
 * Mover meta para baixo (aumentar ordem)
 */
export async function moverMetaParaBaixo(metaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Buscar meta atual
  const metaAtual = await db
    .select()
    .from(metas)
    .where(eq(metas.id, metaId))
    .limit(1);

  if (!metaAtual[0]) {
    throw new Error("Meta não encontrada");
  }

  const meta = metaAtual[0];
  const ordemAtual = meta.ordem;

  // Buscar próxima meta (mesmo plano, ordem maior)
  const proximaMeta = await db
    .select()
    .from(metas)
    .where(and(
      eq(metas.planoId, meta.planoId),
      gt(metas.ordem, ordemAtual)
    ))
    .orderBy(asc(metas.ordem))
    .limit(1);

  if (!proximaMeta[0]) {
    return { success: false, message: "Meta já está no final" };
  }

  const ordemProxima = proximaMeta[0].ordem;

  // Trocar ordens
  await db.update(metas).set({ ordem: ordemProxima }).where(eq(metas.id, metaId));
  await db.update(metas).set({ ordem: ordemAtual }).where(eq(metas.id, proximaMeta[0].id));

  return { success: true, message: "Meta movida para baixo" };
}



/**
 * Importar plano a partir de planilha
 */
export async function importarPlanoPlanilha(
  dados: {
    nomePlano: string;
    descricaoPlano?: string;
    metas: Array<{
      disciplina: string;
      assunto: string;
      tipo: "estudo" | "revisao" | "questoes";
      duracao: number;
      incidencia: "alta" | "media" | "baixa" | null;
      ordem: number;
    }>;
  },
  userId: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // 1. Criar o plano
    const duracaoTotal = Math.ceil(dados.metas.reduce((acc, meta) => acc + meta.duracao, 0) / 60 / 4); // Estimativa em dias (4h/dia)
    
    const resultPlano = await db.insert(planos).values({
      nome: dados.nomePlano,
      descricao: dados.descricaoPlano || `Plano importado com ${dados.metas.length} metas`,
      duracaoTotal,
      tipo: "pago",
      ativo: 1,
      horasDiariasPadrao: 4,
      diasEstudoPadrao: "1,2,3,4,5",
      createdBy: userId,
    });

    const planoId = Number((resultPlano as any).insertId);

    // 2. Criar as metas
    let sucesso = 0;
    let erros = 0;
    const detalhes: string[] = [];

    for (const meta of dados.metas) {
      try {
        await db.insert(metas).values({
          planoId,
          disciplina: meta.disciplina,
          assunto: meta.assunto,
          tipo: meta.tipo,
          duracao: meta.duracao,
          incidencia: meta.incidencia,
          ordem: meta.ordem,
        });
        sucesso++;
      } catch (error) {
        erros++;
        detalhes.push(`Erro ao criar meta "${meta.disciplina} - ${meta.assunto}": ${error}`);
      }
    }

    return {
      planoId,
      sucesso,
      erros,
      detalhes,
    };
  } catch (error) {
    console.error("Erro ao importar plano:", error);
    throw new Error(`Erro ao importar plano: ${error}`);
  }
}


/**
 * Obter progresso semanal do aluno (últimos 7 dias)
 */
export async function getProgressoSemanal(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    seteDiasAtras.setHours(0, 0, 0, 0);

    const metasConcluidas = await db
      .select()
      .from(progressoMetas)
      .where(and(
        eq(progressoMetas.userId, userId),
        eq(progressoMetas.concluida, 1)
      ));

    // Agrupar por dia
    const progressoPorDia: Record<string, { metas: number; horas: number }> = {};

    for (let i = 0; i < 7; i++) {
      const dia = new Date();
      dia.setDate(dia.getDate() - i);
      const diaStr = dia.toISOString().split('T')[0];
      progressoPorDia[diaStr] = { metas: 0, horas: 0 };
    }

    metasConcluidas.forEach(meta => {
      if (!meta.dataConclusao) return;
      
      const dataConclusao = new Date(meta.dataConclusao);
      if (dataConclusao < seteDiasAtras) return;

      const diaStr = dataConclusao.toISOString().split('T')[0];
      
      if (progressoPorDia[diaStr]) {
        progressoPorDia[diaStr].metas++;
        progressoPorDia[diaStr].horas += (meta.tempoGasto || 0) / 60;
      }
    });

    // Converter para array ordenado
    const progressoArray = Object.entries(progressoPorDia)
      .map(([dia, dados]) => ({
        dia,
        metas: dados.metas,
        horas: Math.round(dados.horas * 10) / 10, // arredondar para 1 casa decimal
      }))
      .sort((a, b) => a.dia.localeCompare(b.dia));

    return progressoArray;
  } catch (error) {
    console.error("Erro ao calcular progresso semanal:", error);
    throw new Error(`Erro ao calcular progresso semanal: ${error}`);
  }
}


/**
 * Atribuir plano a um aluno
 */
export async function atribuirPlano(userId: number, planoId: number, dataInicio: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // Verificar se já existe matrícula ativa para este usuário
    const matriculaExistente = await db
      .select()
      .from(matriculas)
      .where(eq(matriculas.userId, userId));

    if (matriculaExistente.length > 0) {
      throw new Error("Usuário já possui um plano atribuído");
    }

    // Buscar duração do plano para calcular dataTermino
    const planoData = await db
      .select()
      .from(planos)
      .where(eq(planos.id, planoId));

    if (planoData.length === 0) {
      throw new Error("Plano não encontrado");
    }

    const duracaoDias = planoData[0].duracaoTotal;
    const dataInicioDate = new Date(dataInicio);
    const dataTerminoDate = new Date(dataInicioDate);
    dataTerminoDate.setDate(dataTerminoDate.getDate() + duracaoDias);

    // Criar matrícula
    const result = await db.insert(matriculas).values({
      userId,
      planoId,
      dataInicio: dataInicioDate,
      dataTermino: dataTerminoDate,
      ativo: 1,
    });

    return {
      success: true,
      matriculaId: Number((result as any).insertId || 0),
    };
  } catch (error) {
    console.error("Erro ao atribuir plano:", error);
    throw new Error(`Erro ao atribuir plano: ${error}`);
  }
}

/**
 * Obter todas as matrículas (planos atribuídos)
 */
export async function getMatriculas() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db
      .select({
        id: matriculas.id,
        userId: matriculas.userId,
        planoId: matriculas.planoId,
        dataInicio: matriculas.dataInicio,
        ativo: matriculas.ativo,
        usuario: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        plano: {
          id: planos.id,
          nome: planos.nome,
          descricao: planos.descricao,
        },
      })
      .from(matriculas)
      .leftJoin(users, eq(matriculas.userId, users.id))
      .leftJoin(planos, eq(matriculas.planoId, planos.id))
      .where(eq(matriculas.ativo, 1));

    return result;
  } catch (error) {
    console.error("Erro ao buscar matrículas:", error);
    throw new Error(`Erro ao buscar matrículas: ${error}`);
  }
}


/**
 * Obter todos os usuários
 */
export async function getAllUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        pontos: users.pontos,
        cpf: users.cpf,
        telefone: users.telefone,
        dataNascimento: users.dataNascimento,
        endereco: users.endereco,
        foto: users.foto,
        bio: users.bio,
        status: users.status,
        observacoes: users.observacoes,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastSignedIn: users.lastSignedIn,
      })
      .from(users);

    return result;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw new Error(`Erro ao buscar usuários: ${error}`);
  }
}


/**
 * Obter metas do plano atribuído ao aluno
 */
export async function getMetasAluno(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // Buscar matrícula ativa do aluno
    const matriculaAtiva = await db
      .select()
      .from(matriculas)
      .where(and(eq(matriculas.userId, userId), eq(matriculas.ativo, 1)));

    if (matriculaAtiva.length === 0) {
      return { plano: null, metas: [] };
    }

    const planoId = matriculaAtiva[0].planoId;

    // Buscar informações do plano
    const planoInfo = await db
      .select()
      .from(planos)
      .where(eq(planos.id, planoId));

    // Buscar metas do plano
    const metasPlano = await db
      .select({
        id: metas.id,
        disciplina: metas.disciplina,
        assunto: metas.assunto,
        tipo: metas.tipo,
        duracao: metas.duracao,
        incidencia: metas.incidencia,
        ordem: metas.ordem,
        dicaEstudo: metas.dicaEstudo,
        orientacaoEstudos: metas.orientacaoEstudos,
      })
      .from(metas)
      .where(eq(metas.planoId, planoId))
      .orderBy(asc(metas.ordem));

    // Buscar progresso de cada meta
    const metasComProgresso = await Promise.all(
      metasPlano.map(async (meta) => {
        const progresso = await db
          .select()
          .from(progressoMetas)
          .where(
            and(
              eq(progressoMetas.metaId, meta.id),
              eq(progressoMetas.userId, userId)
            )
          );

        return {
          ...meta,
          concluida: progresso.length > 0 && progresso[0].concluida === 1,
          dataConclusao: progresso.length > 0 ? progresso[0].dataConclusao : null,
          tempoGasto: progresso.length > 0 ? progresso[0].tempoGasto : null,
        };
      })
    );

    return {
      plano: planoInfo[0],
      matricula: matriculaAtiva[0],
      metas: metasComProgresso,
    };
  } catch (error) {
    console.error("Erro ao buscar metas do aluno:", error);
    throw new Error(`Erro ao buscar metas do aluno: ${error}`);
  }
}

/**
 * Concluir meta do aluno
 */
export async function concluirMeta(userId: number, metaId: number, tempoGasto?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // Verificar se já existe progresso
    const progressoExistente = await db
      .select()
      .from(progressoMetas)
      .where(
        and(
          eq(progressoMetas.metaId, metaId),
          eq(progressoMetas.userId, userId)
        )
      );

    if (progressoExistente.length > 0) {
      // Atualizar progresso existente
      await db
        .update(progressoMetas)
        .set({
          concluida: 1,
          dataConclusao: new Date(),
          tempoGasto: tempoGasto || progressoExistente[0].tempoGasto,
        })
        .where(eq(progressoMetas.id, progressoExistente[0].id));

      return { success: true, progressoId: progressoExistente[0].id };
    } else {
      // Criar novo progresso
      const result = await db.insert(progressoMetas).values({
        userId,
        metaId,
        dataAgendada: new Date(), // Data atual como agendamento padrão
        concluida: 1,
        dataConclusao: new Date(),
        tempoGasto: tempoGasto || 0,
      });

      return {
        success: true,
        progressoId: Number((result as any).insertId || 0),
      };
    }
  } catch (error) {
    console.error("Erro ao concluir meta:", error);
    throw new Error(`Erro ao concluir meta: ${error}`);
  }
}


/**
 * Buscar usuário completo por ID
 */
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    throw new Error(`Erro ao buscar usuário: ${error}`);
  }
}

/**
 * Buscar usuário por CPF
 */
export async function getUserByCPF(cpf: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.cpf, cpf))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Erro ao buscar usuário por CPF:", error);
    throw new Error(`Erro ao buscar usuário por CPF: ${error}`);
  }
}

/**
 * Atualizar dados do usuário
 */
export async function updateUser(id: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error(`Erro ao atualizar usuário: ${error}`);
  }
}

/**
 * Criar novo usuário
 */
export async function createUser(data: InsertUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(users).values(data);
    return { success: true, id: result[0].insertId };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw new Error(`Erro ao criar usuário: ${error}`);
  }
}

/**
 * Alternar status do usuário (ativo/inativo/suspenso)
 */
export async function toggleUserStatus(id: number, status: "ativo" | "inativo" | "suspenso") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db
      .update(users)
      .set({ status, updatedAt: new Date() })
      .where(eq(users.id, id));

    return { success: true };
  } catch (error) {
    console.error("Erro ao alterar status do usuário:", error);
    throw new Error(`Erro ao alterar status: ${error}`);
  }
}

/**
 * Deletar usuário (soft delete - marca como inativo)
 */
export async function deleteUser(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // Soft delete: apenas marca como inativo
    await db
      .update(users)
      .set({ status: "inativo", updatedAt: new Date() })
      .where(eq(users.id, id));

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    throw new Error(`Erro ao deletar usuário: ${error}`);
  }
}

/**
 * Obter alunos com progresso (para relatórios)
 */
export async function getAlunosComProgresso() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // Buscar todos os alunos
    const alunos = await db
      .select()
      .from(users)
      .where(eq(users.role, "aluno"));

    // Para cada aluno, buscar estatísticas
    const alunosComProgresso = await Promise.all(
      alunos.map(async (aluno) => {
        // Buscar matrícula ativa
        const matricula = await db
          .select()
          .from(matriculas)
          .where(and(
            eq(matriculas.userId, aluno.id),
            eq(matriculas.ativo, 1)
          ))
          .limit(1);

        if (matricula.length === 0) {
          return {
            ...aluno,
            planoId: null,
            planoNome: null,
            metasConcluidas: 0,
            totalMetas: 0,
            horasEstudadas: 0,
            taxaConclusao: 0,
          };
        }

        // Buscar estatísticas
        const stats = await getEstatisticasDashboard(aluno.id);
        
        // Calcular taxa de conclusão
        const taxaConclusao = stats && stats.totalMetas > 0 
          ? Math.round((stats.metasConcluidas / stats.totalMetas) * 100)
          : 0;

        return {
          ...aluno,
          planoId: matricula[0].planoId,
          planoNome: null, // Será preenchido depois
          metasConcluidas: stats?.metasConcluidas || 0,
          totalMetas: stats?.totalMetas || 0,
          horasEstudadas: stats?.horasEstudadas || 0,
          taxaConclusao,
        };
      })
    );

    return alunosComProgresso;
  } catch (error) {
    console.error("Erro ao buscar alunos com progresso:", error);
    throw new Error(`Erro ao buscar alunos: ${error}`);
  }
}

/**
 * Importar alunos de CSV/Excel
 */
export async function importarAlunosCSV(dados: Array<{
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  dataNascimento?: string;
  endereco?: string;
  role?: "aluno" | "professor" | "administrativo" | "mentor" | "master";
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const resultados = {
    sucesso: 0,
    erros: [] as Array<{ linha: number; erro: string; dados: any }>,
  };

  for (let i = 0; i < dados.length; i++) {
    const linha = i + 2; // +2 porque linha 1 é header e array começa em 0
    const aluno = dados[i];

    try {
      // Validar campos obrigatórios
      if (!aluno.nome || !aluno.email) {
        resultados.erros.push({
          linha,
          erro: "Nome e email são obrigatórios",
          dados: aluno,
        });
        continue;
      }

      // Verificar se email já existe
      const emailExistente = await db
        .select()
        .from(users)
        .where(eq(users.email, aluno.email))
        .limit(1);

      if (emailExistente.length > 0) {
        resultados.erros.push({
          linha,
          erro: `Email ${aluno.email} já cadastrado`,
          dados: aluno,
        });
        continue;
      }

      // Verificar se CPF já existe (se fornecido)
      if (aluno.cpf) {
        const cpfExistente = await db
          .select()
          .from(users)
          .where(eq(users.cpf, aluno.cpf))
          .limit(1);

        if (cpfExistente.length > 0) {
          resultados.erros.push({
            linha,
            erro: `CPF ${aluno.cpf} já cadastrado`,
            dados: aluno,
          });
          continue;
        }
      }

      // Criar usuário
      // Nota: openId será gerado no primeiro login via OAuth
      // Para importação, criamos um openId temporário
      await db.insert(users).values({
        openId: `import_${Date.now()}_${i}`, // Temporário até primeiro login
        name: aluno.nome,
        email: aluno.email,
        cpf: aluno.cpf || null,
        telefone: aluno.telefone || null,
        dataNascimento: aluno.dataNascimento || null,
        endereco: aluno.endereco || null,
        role: aluno.role || "aluno",
        status: "ativo",
      });

      resultados.sucesso++;
    } catch (error: any) {
      resultados.erros.push({
        linha,
        erro: error.message || "Erro desconhecido",
        dados: aluno,
      });
    }
  }

  return resultados;
}


// ========== AUTENTICAÇÃO E REGISTRO ==========

/**
 * Registrar novo usuário (auto-cadastro)
 */
export async function registerUser(dados: {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento?: string;
  password?: string; // Opcional, se usar login com senha
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { hashPassword, validateCPF, validateEmail, validatePhone, generateTempOpenId } = await import("./auth");

  // Validações
  if (!validateEmail(dados.email)) {
    throw new Error("Email inválido");
  }

  if (!validateCPF(dados.cpf)) {
    throw new Error("CPF inválido");
  }

  if (!validatePhone(dados.telefone)) {
    throw new Error("Telefone inválido");
  }

  // Verificar se email já existe
  const emailExistente = await db
    .select()
    .from(users)
    .where(eq(users.email, dados.email))
    .limit(1);

  if (emailExistente.length > 0) {
    throw new Error("Este email já está cadastrado");
  }

  // Verificar se CPF já existe
  const cpfExistente = await db
    .select()
    .from(users)
    .where(eq(users.cpf, dados.cpf))
    .limit(1);

  if (cpfExistente.length > 0) {
    throw new Error("Este CPF já está cadastrado");
  }

  // Hash da senha se fornecida
  let passwordHash = null;
  if (dados.password) {
    passwordHash = await hashPassword(dados.password);
  }

  // Criar usuário
  const [novoUsuario] = await db.insert(users).values({
    openId: generateTempOpenId(), // Será substituído no primeiro login OAuth
    name: dados.nome,
    email: dados.email,
    cpf: dados.cpf,
    telefone: dados.telefone,
    dataNascimento: dados.dataNascimento || null,
    passwordHash,
    role: "aluno",
    status: "ativo",
    emailVerified: 0, // Não verificado
  });

  return novoUsuario;
}

/**
 * Criar token de verificação de email
 */
export async function createEmailVerificationToken(userId: number): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { generateToken } = await import("./auth");
  const { emailVerificationTokens } = await import("../drizzle/schema");

  const token = generateToken(32);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

  await db.insert(emailVerificationTokens).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

/**
 * Verificar email usando token
 */
export async function verifyEmail(token: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { emailVerificationTokens } = await import("../drizzle/schema");

  // Buscar token
  const [tokenData] = await db
    .select()
    .from(emailVerificationTokens)
    .where(eq(emailVerificationTokens.token, token))
    .limit(1);

  if (!tokenData) {
    throw new Error("Token inválido");
  }

  // Verificar expiração
  if (new Date() > tokenData.expiresAt) {
    throw new Error("Token expirado");
  }

  // Marcar email como verificado
  await db
    .update(users)
    .set({ emailVerified: 1 })
    .where(eq(users.id, tokenData.userId));

  // Deletar token usado
  await db
    .delete(emailVerificationTokens)
    .where(eq(emailVerificationTokens.id, tokenData.id));

  return true;
}

/**
 * Criar token de reset de senha
 */
export async function createPasswordResetToken(email: string): Promise<string | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { generateToken } = await import("./auth");
  const { passwordResetTokens } = await import("../drizzle/schema");

  // Buscar usuário por email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    // Não revelar se o email existe ou não (segurança)
    return null;
  }

  const token = generateToken(32);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    token,
    expiresAt,
  });

  return token;
}

/**
 * Resetar senha usando token
 */
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { hashPassword, validatePasswordStrength } = await import("./auth");
  const { passwordResetTokens } = await import("../drizzle/schema");

  // Validar força da senha
  const validation = validatePasswordStrength(newPassword);
  if (!validation.valid) {
    throw new Error(validation.errors.join(", "));
  }

  // Buscar token
  const [tokenData] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);

  if (!tokenData) {
    throw new Error("Token inválido");
  }

  // Verificar expiração
  if (new Date() > tokenData.expiresAt) {
    throw new Error("Token expirado");
  }

  // Atualizar senha
  const passwordHash = await hashPassword(newPassword);
  await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, tokenData.userId));

  // Deletar token usado
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.id, tokenData.id));

  return true;
}

/**
 * Login com email e senha
 */
export async function loginWithPassword(email: string, password: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { verifyPassword } = await import("./auth");

  // Buscar usuário
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || !user.passwordHash) {
    throw new Error("Email ou senha inválidos");
  }

  // Verificar senha
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Email ou senha inválidos");
  }

  // Verificar status
  if (user.status !== "ativo") {
    throw new Error("Conta inativa ou suspensa");
  }

  // Atualizar último login
  await db
    .update(users)
    .set({ lastSignedIn: new Date() })
    .where(eq(users.id, user.id));

  return user;
}

/**
 * Definir senha para usuário (primeiro acesso)
 */
export async function setPassword(userId: number, password: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { hashPassword, validatePasswordStrength } = await import("./auth");

  // Validar força da senha
  const validation = validatePasswordStrength(password);
  if (!validation.valid) {
    throw new Error(validation.errors.join(", "));
  }

  // Atualizar senha
  const passwordHash = await hashPassword(password);
  await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, userId));

  return true;
}

// ========== AUDITORIA ==========

/**
 * Registrar ação no log de auditoria
 */
export async function logAudit(dados: {
  userId?: number;
  action: string;
  entity: string;
  entityId?: number;
  oldData?: any;
  newData?: any;
  ip?: string;
  userAgent?: string;
}) {
  const db = await getDb();
  if (!db) return; // Não falhar se auditoria não funcionar

  const { auditLogs } = await import("../drizzle/schema");

  try {
    await db.insert(auditLogs).values({
      userId: dados.userId || null,
      action: dados.action,
      entity: dados.entity,
      entityId: dados.entityId || null,
      oldData: dados.oldData ? JSON.stringify(dados.oldData) : null,
      newData: dados.newData ? JSON.stringify(dados.newData) : null,
      ip: dados.ip || null,
      userAgent: dados.userAgent || null,
    });
  } catch (error) {
    console.error("Erro ao registrar auditoria:", error);
  }
}

/**
 * Buscar logs de auditoria
 */
export async function getAuditLogs(filtros?: {
  userId?: number;
  action?: string;
  entity?: string;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { auditLogs } = await import("../drizzle/schema");

  let query = db.select().from(auditLogs);

  if (filtros?.userId) {
    query = query.where(eq(auditLogs.userId, filtros.userId)) as any;
  }

  if (filtros?.action) {
    query = query.where(eq(auditLogs.action, filtros.action)) as any;
  }

  if (filtros?.entity) {
    query = query.where(eq(auditLogs.entity, filtros.entity)) as any;
  }

  const logs = await query
    .orderBy(desc(auditLogs.createdAt))
    .limit(filtros?.limit || 100);

  return logs;
}


// ========== PERMISSÕES ==========

/**
 * Verificar se um usuário tem uma permissão específica
 */
export async function hasPermission(userId: number, permissionName: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const { permissions, rolePermissions } = await import("../drizzle/schema");

  // Buscar usuário
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return false;

  // Master tem todas as permissões
  if (user.role === "master") return true;

  // Buscar permissão
  const [permission] = await db
    .select()
    .from(permissions)
    .where(eq(permissions.name, permissionName))
    .limit(1);

  if (!permission) return false;

  // Verificar se o role do usuário tem essa permissão
  const [rolePermission] = await db
    .select()
    .from(rolePermissions)
    .where(
      and(
        eq(rolePermissions.role, user.role),
        eq(rolePermissions.permissionId, permission.id)
      )
    )
    .limit(1);

  return !!rolePermission;
}

/**
 * Buscar todas as permissões de um usuário
 */
export async function getUserPermissions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const { permissions, rolePermissions } = await import("../drizzle/schema");

  // Buscar usuário
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return [];

  // Master tem todas as permissões
  if (user.role === "master") {
    return await db.select().from(permissions);
  }

  // Buscar permissões do role
  const userPermissions = await db
    .select({
      id: permissions.id,
      name: permissions.name,
      description: permissions.description,
      module: permissions.module,
    })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.role, user.role));

  return userPermissions;
}

/**
 * Listar todas as permissões do sistema
 */
export async function getAllPermissions() {
  const db = await getDb();
  if (!db) return [];

  const { permissions } = await import("../drizzle/schema");

  return await db.select().from(permissions).orderBy(permissions.module, permissions.name);
}

/**
 * Listar permissões de um role específico
 */
export async function getRolePermissions(role: string) {
  const db = await getDb();
  if (!db) return [];

  const { permissions, rolePermissions } = await import("../drizzle/schema");

  const rolePerms = await db
    .select({
      id: permissions.id,
      name: permissions.name,
      description: permissions.description,
      module: permissions.module,
    })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.role, role as any));

  return rolePerms;
}

/**
 * Atribuir permissão a um role
 */
export async function assignPermissionToRole(role: string, permissionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { rolePermissions } = await import("../drizzle/schema");

  await db.insert(rolePermissions).values({
    role: role as any,
    permissionId,
  });

  return true;
}

/**
 * Remover permissão de um role
 */
export async function removePermissionFromRole(role: string, permissionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { rolePermissions } = await import("../drizzle/schema");

  await db
    .delete(rolePermissions)
    .where(
      and(
        eq(rolePermissions.role, role as any),
        eq(rolePermissions.permissionId, permissionId)
      )
    );

  return true;
}


/**
 * ====================================================================
 * GESTÃO AVANÇADA DE METAS
 * ====================================================================
 */

/**
 * Reordenar meta (drag-and-drop)
 */
export async function reordenarMeta(metaId: number, novaOrdem: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { metas } = await import("../drizzle/schema");
  const { eq, and, gte, lte } = await import("drizzle-orm");

  // Buscar meta atual
  const [metaAtual] = await db.select().from(metas).where(eq(metas.id, metaId)).limit(1);
  if (!metaAtual) throw new Error("Meta não encontrada");

  const ordemAtual = metaAtual.ordem;
  const planoId = metaAtual.planoId;

  // Se movendo para baixo (aumentando ordem)
  if (novaOrdem > ordemAtual) {
    // Decrementar ordem das metas entre ordemAtual e novaOrdem
    await db
      .update(metas)
      .set({ ordem: sql`ordem - 1` })
      .where(
        and(
          eq(metas.planoId, planoId),
          gte(metas.ordem, ordemAtual + 1),
          lte(metas.ordem, novaOrdem)
        )
      );
  }
  // Se movendo para cima (diminuindo ordem)
  else if (novaOrdem < ordemAtual) {
    // Incrementar ordem das metas entre novaOrdem e ordemAtual
    await db
      .update(metas)
      .set({ ordem: sql`ordem + 1` })
      .where(
        and(
          eq(metas.planoId, planoId),
          gte(metas.ordem, novaOrdem),
          lte(metas.ordem, ordemAtual - 1)
        )
      );
  }

  // Atualizar ordem da meta movida
  await db.update(metas).set({ ordem: novaOrdem }).where(eq(metas.id, metaId));

  return { success: true };
}

/**
 * Deletar múltiplas metas
 */
export async function deletarMetasLote(metaIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { metas } = await import("../drizzle/schema");
  const { inArray } = await import("drizzle-orm");

  // Deletar metas
  await db.delete(metas).where(inArray(metas.id, metaIds));

  return { success: true, deletadas: metaIds.length };
}

/**
 * Atualizar múltiplas metas
 */
export async function atualizarMetasLote(
  metaIds: number[],
  dados: {
    disciplina?: string;
    tipo?: "estudo" | "revisao" | "questoes";
    incidencia?: "baixa" | "media" | "alta";
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { metas } = await import("../drizzle/schema");
  const { inArray } = await import("drizzle-orm");

  // Atualizar metas
  await db.update(metas).set(dados).where(inArray(metas.id, metaIds));

  return { success: true, atualizadas: metaIds.length };
}

/**
 * Estatísticas de metas por plano
 */
export async function getEstatisticasMetas(planoId: number) {
  const db = await getDb();
  if (!db) return null;

  const { metas } = await import("../drizzle/schema");
  const { eq, sql } = await import("drizzle-orm");

  // Buscar todas as metas do plano
  const todasMetas = await db.select().from(metas).where(eq(metas.planoId, planoId));

  // Calcular estatísticas
  const totalMetas = todasMetas.length;
  const totalHoras = todasMetas.reduce((sum, meta) => sum + meta.duracao, 0) / 60; // converter minutos para horas

  // Contar por tipo
  const porTipo = {
    estudo: todasMetas.filter((m) => m.tipo === "estudo").length,
    revisao: todasMetas.filter((m) => m.tipo === "revisao").length,
    questoes: todasMetas.filter((m) => m.tipo === "questoes").length,
  };

  // Contar por incidência
  const porIncidencia = {
    alta: todasMetas.filter((m) => m.incidencia === "alta").length,
    media: todasMetas.filter((m) => m.incidencia === "media").length,
    baixa: todasMetas.filter((m) => m.incidencia === "baixa").length,
  };

  // Contar por disciplina
  const disciplinas = [...new Set(todasMetas.map((m) => m.disciplina))];
  const porDisciplina = disciplinas.map((disciplina) => ({
    disciplina,
    quantidade: todasMetas.filter((m) => m.disciplina === disciplina).length,
    horas: todasMetas.filter((m) => m.disciplina === disciplina).reduce((sum, m) => sum + m.duracao, 0) / 60,
  }));

  return {
    totalMetas,
    totalHoras,
    porTipo,
    porIncidencia,
    porDisciplina,
  };
}


/**
 * Criar múltiplas metas (importação em lote)
 */
export async function criarMetasLote(metasData: Array<{
  planoId: number;
  disciplina: string;
  assunto: string;
  tipo: "estudo" | "revisao" | "questoes";
  duracao: number;
  incidencia?: "baixa" | "media" | "alta" | null;
  prioridade?: number;
  ordem: number;
  dicaEstudo?: string | null;
  cor?: string | null;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { metas } = await import("../drizzle/schema");

  // Inserir todas as metas
  const metasInseridas = await db.insert(metas).values(
    metasData.map((meta) => ({
      planoId: meta.planoId,
      disciplina: meta.disciplina,
      assunto: meta.assunto,
      tipo: meta.tipo,
      duracao: meta.duracao,
      incidencia: meta.incidencia || null,
      prioridade: meta.prioridade || 3,
      ordem: meta.ordem,
      dicaEstudo: meta.dicaEstudo || null,
      cor: meta.cor || null,
    }))
  ).returning();

  return {
    success: true,
    criadas: metasInseridas.length,
    metas: metasInseridas,
  };
}


/**
 * Pular meta (não será contabilizada no progresso)
 */
export async function pularMeta(userId: number, metaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { progressoMetas } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");

  // Verificar se já existe progresso
  const progressoExistente = await db
    .select()
    .from(progressoMetas)
    .where(
      and(
        eq(progressoMetas.userId, userId),
        eq(progressoMetas.metaId, metaId)
      )
    )
    .limit(1);

  if (progressoExistente.length > 0) {
    // Atualizar como pulada
    await db
      .update(progressoMetas)
      .set({
        pulada: true,
        dataPulada: new Date(),
      })
      .where(eq(progressoMetas.id, progressoExistente[0].id));
  } else {
    // Criar novo registro como pulada
    await db.insert(progressoMetas).values({
      userId,
      metaId,
      pulada: true,
      dataPulada: new Date(),
    });
  }

  return { success: true };
}

/**
 * Adiar meta para próximo dia disponível
 */
export async function adiarMeta(userId: number, metaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { metas, progressoMetas, matriculas } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");

  // Buscar a meta
  const meta = await db
    .select()
    .from(metas)
    .where(eq(metas.id, metaId))
    .limit(1);

  if (meta.length === 0) {
    throw new Error("Meta não encontrada");
  }

  // Buscar matrícula do aluno para o plano desta meta
  const matricula = await db
    .select()
    .from(matriculas)
    .where(
      and(
        eq(matriculas.userId, userId),
        eq(matriculas.planoId, meta[0].planoId)
      )
    )
    .limit(1);

  if (matricula.length === 0) {
    throw new Error("Matrícula não encontrada");
  }

  // Calcular próximo dia disponível (amanhã)
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  // Buscar todas as metas do aluno para verificar distribuição
  const metasDoAluno = await db
    .select()
    .from(metas)
    .where(eq(metas.planoId, meta[0].planoId));

  // Por enquanto, simplesmente adicionar 1 dia à data atual
  // TODO: Implementar lógica mais inteligente de redistribuição
  const novaData = amanha.toISOString().split("T")[0];

  // Atualizar a data da meta (isso afeta todos os alunos - não é ideal)
  // TODO: Criar tabela de cronograma personalizado por aluno
  
  // Por enquanto, apenas marcar como adiada no progresso
  const progressoExistente = await db
    .select()
    .from(progressoMetas)
    .where(
      and(
        eq(progressoMetas.userId, userId),
        eq(progressoMetas.metaId, metaId)
      )
    )
    .limit(1);

  if (progressoExistente.length > 0) {
    await db
      .update(progressoMetas)
      .set({
        adiada: true,
        dataAdiamento: new Date(),
      })
      .where(eq(progressoMetas.id, progressoExistente[0].id));
  } else {
    await db.insert(progressoMetas).values({
      userId,
      metaId,
      adiada: true,
      dataAdiamento: new Date(),
    });
  }

  return { success: true, novaData };
}


/**
 * Duplicar plano (copiar plano com todas as metas)
 */
export async function duplicarPlano(planoId: number, novoNome?: string, createdBy?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { planos, metas } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  // Buscar plano original
  const planoOriginal = await db
    .select()
    .from(planos)
    .where(eq(planos.id, planoId))
    .limit(1);

  if (planoOriginal.length === 0) {
    throw new Error("Plano não encontrado");
  }

  const plano = planoOriginal[0];

  // Criar novo plano
  const novoPlanoData = {
    ...plano,
    nome: novoNome || `${plano.nome} (Cópia)`,
    createdBy: createdBy || plano.createdBy,
    ativo: 0, // Criar desativado por padrão
  };

  // Remover campos que não devem ser copiados
  delete (novoPlanoData as any).id;
  delete (novoPlanoData as any).createdAt;
  delete (novoPlanoData as any).updatedAt;

  const [novoPlano] = await db.insert(planos).values(novoPlanoData as any).returning();

  // Copiar todas as metas
  const metasOriginais = await db
    .select()
    .from(metas)
    .where(eq(metas.planoId, planoId));

  if (metasOriginais.length > 0) {
    const novasMetas = metasOriginais.map((meta) => {
      const novaMeta = { ...meta };
      delete (novaMeta as any).id;
      delete (novaMeta as any).createdAt;
      delete (novaMeta as any).updatedAt;
      novaMeta.planoId = novoPlano.id;
      return novaMeta;
    });

    await db.insert(metas).values(novasMetas as any);
  }

  return {
    success: true,
    novoPlanoId: novoPlano.id,
    metasCopiadas: metasOriginais.length,
  };
}

/**
 * Ativar/desativar múltiplos planos
 */
export async function ativarPlanosLote(planoIds: number[], ativo: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { planos } = await import("../drizzle/schema");
  const { inArray } = await import("drizzle-orm");

  await db
    .update(planos)
    .set({ ativo: ativo ? 1 : 0 })
    .where(inArray(planos.id, planoIds));

  return {
    success: true,
    atualizados: planoIds.length,
  };
}

/**
 * Listar alunos matriculados em um plano
 */
export async function getAlunosDoPlano(planoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { matriculas, users } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  const matriculasDoPlano = await db
    .select({
      matriculaId: matriculas.id,
      userId: matriculas.userId,
      dataInicio: matriculas.dataInicio,
      dataFim: matriculas.dataFim,
      horasDiarias: matriculas.horasDiarias,
      diasEstudo: matriculas.diasEstudo,
      ativo: matriculas.ativo,
      userName: users.name,
      userEmail: users.email,
      userCpf: users.cpf,
      userFoto: users.foto,
    })
    .from(matriculas)
    .leftJoin(users, eq(matriculas.userId, users.id))
    .where(eq(matriculas.planoId, planoId));

  return matriculasDoPlano.map((m) => ({
    matriculaId: m.matriculaId,
    userId: m.userId,
    nome: m.userName,
    email: m.userEmail,
    cpf: m.userCpf,
    foto: m.userFoto,
    dataInicio: m.dataInicio,
    dataFim: m.dataFim,
    horasDiarias: m.horasDiarias,
    diasEstudo: m.diasEstudo,
    ativo: m.ativo === 1,
  }));
}


// ============================================
// ESTATÍSTICAS DE PROGRESSO
// ============================================

export async function getEstatisticasProgresso(userId: number, periodo: string = "tudo") {
  const db = await getDb();
  if (!db) return null;
  
  // Calcular data de início baseado no período
  let dataInicio: Date | null = null;
  const agora = new Date();
  
  switch (periodo) {
    case "semana":
      dataInicio = new Date(agora);
      dataInicio.setDate(agora.getDate() - 7);
      break;
    case "mes":
      dataInicio = new Date(agora);
      dataInicio.setMonth(agora.getMonth() - 1);
      break;
    case "trimestre":
      dataInicio = new Date(agora);
      dataInicio.setMonth(agora.getMonth() - 3);
      break;
    case "ano":
      dataInicio = new Date(agora);
      dataInicio.setFullYear(agora.getFullYear() - 1);
      break;
    default:
      dataInicio = null; // "tudo"
  }
  
  // Buscar progresso de metas
  let query = db.select().from(progressoMetas).where(eq(progressoMetas.userId, userId));
  
  if (dataInicio) {
    query = query.where(gte(progressoMetas.dataConclusao, dataInicio.toISOString()));
  }
  
  const progressos = await query;
  
  // Calcular estatísticas
  const totalMetas = progressos.length;
  const metasConcluidas = progressos.filter(p => p.concluida === 1).length;
  const metasPuladas = progressos.filter(p => p.pulada && p.pulada > 0).length;
  const metasAdiadas = progressos.filter(p => p.adiada && p.adiada > 0).length;
  const tempoTotalEstudo = progressos.reduce((sum, p) => sum + (p.tempoGasto || 0), 0);
  
  // Taxa de conclusão
  const taxaConclusao = totalMetas > 0 ? (metasConcluidas / totalMetas) * 100 : 0;
  
  // Média de tempo por meta
  const tempoMedioPorMeta = metasConcluidas > 0 ? tempoTotalEstudo / metasConcluidas : 0;
  
  return {
    totalMetas,
    metasConcluidas,
    metasPuladas,
    metasAdiadas,
    tempoTotalEstudo, // em minutos
    taxaConclusao,
    tempoMedioPorMeta,
    periodo,
  };
}

export async function getEstatisticasPorDisciplinaProgresso(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Buscar progresso com join de metas para pegar disciplina
  const progressos = await db
    .select({
      disciplina: metas.disciplina,
      concluida: progressoMetas.concluida,
      tempoGasto: progressoMetas.tempoGasto,
      pulada: progressoMetas.pulada,
    })
    .from(progressoMetas)
    .innerJoin(metas, eq(progressoMetas.metaId, metas.id))
    .where(eq(progressoMetas.userId, userId));
  
  // Agrupar por disciplina
  const estatisticasPorDisciplina = progressos.reduce((acc: any, p) => {
    const disc = p.disciplina || "Sem disciplina";
    
    if (!acc[disc]) {
      acc[disc] = {
        disciplina: disc,
        totalMetas: 0,
        metasConcluidas: 0,
        metasPuladas: 0,
        tempoTotal: 0,
      };
    }
    
    acc[disc].totalMetas++;
    if (p.concluida === 1) acc[disc].metasConcluidas++;
    if (p.pulada && p.pulada > 0) acc[disc].metasPuladas++;
    acc[disc].tempoTotal += p.tempoGasto || 0;
    
    return acc;
  }, {});
  
  // Converter para array e calcular taxa de conclusão
  return Object.values(estatisticasPorDisciplina).map((stat: any) => ({
    ...stat,
    taxaConclusao: stat.totalMetas > 0 ? (stat.metasConcluidas / stat.totalMetas) * 100 : 0,
    tempoMedio: stat.metasConcluidas > 0 ? stat.tempoTotal / stat.metasConcluidas : 0,
  }));
}

export async function getEvolucaoTemporalProgresso(userId: number, periodo: string = "30dias") {
  const db = await getDb();
  if (!db) return [];
  
  // Calcular data de início
  const agora = new Date();
  let dataInicio = new Date(agora);
  let dias = 30;
  
  switch (periodo) {
    case "7dias":
      dias = 7;
      dataInicio.setDate(agora.getDate() - 7);
      break;
    case "30dias":
      dias = 30;
      dataInicio.setDate(agora.getDate() - 30);
      break;
    case "90dias":
      dias = 90;
      dataInicio.setDate(agora.getDate() - 90);
      break;
    case "ano":
      dias = 365;
      dataInicio.setFullYear(agora.getFullYear() - 1);
      break;
  }
  
  // Buscar progresso no período
  const progressos = await db
    .select()
    .from(progressoMetas)
    .where(
      and(
        eq(progressoMetas.userId, userId),
        gte(progressoMetas.dataConclusao, dataInicio.toISOString())
      )
    );
  
  // Agrupar por data
  const progressoPorDia: { [key: string]: any } = {};
  
  // Inicializar todos os dias com 0
  for (let i = 0; i < dias; i++) {
    const data = new Date(dataInicio);
    data.setDate(dataInicio.getDate() + i);
    const dataStr = data.toISOString().split('T')[0];
    progressoPorDia[dataStr] = {
      data: dataStr,
      metasConcluidas: 0,
      tempoEstudo: 0,
      metasPuladas: 0,
    };
  }
  
  // Preencher com dados reais
  progressos.forEach(p => {
    if (!p.dataConclusao) return;
    const dataStr = new Date(p.dataConclusao).toISOString().split('T')[0];
    
    if (progressoPorDia[dataStr]) {
      if (p.concluida === 1) {
        progressoPorDia[dataStr].metasConcluidas++;
        progressoPorDia[dataStr].tempoEstudo += p.tempoGasto || 0;
      }
      if (p.pulada && p.pulada > 0) {
        progressoPorDia[dataStr].metasPuladas++;
      }
    }
  });
  
  return Object.values(progressoPorDia);
}

/**
 * Atualizar configurações de cronograma do aluno
 */
export async function atualizarConfiguracoesCronograma(
  userId: number,
  horasDiarias: number,
  diasSemana: string // formato: "1,2,3,4,5" (seg-sex)
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Buscar matrícula ativa do aluno
  const matricula = await db
    .select()
    .from(matriculas)
    .where(
      and(
        eq(matriculas.userId, userId),
        eq(matriculas.ativo, 1)
      )
    )
    .limit(1);

  if (matricula.length === 0) {
    throw new Error("Nenhuma matrícula ativa encontrada");
  }

  // Atualizar configurações
  await db
    .update(matriculas)
    .set({
      horasDiarias,
      diasEstudo: diasSemana,
      updatedAt: new Date(),
    })
    .where(eq(matriculas.id, matricula[0].id));
}

/**
 * Redistribuir metas do aluno baseado nas configurações de cronograma
 */
export async function redistribuirMetasAluno(
  userId: number,
  horasDiarias?: number,
  diasSemana?: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Buscar matrícula ativa
  const matricula = await db
    .select()
    .from(matriculas)
    .where(
      and(
        eq(matriculas.userId, userId),
        eq(matriculas.ativo, 1)
      )
    )
    .limit(1);

  if (matricula.length === 0) {
    throw new Error("Nenhuma matrícula ativa encontrada");
  }

  const mat = matricula[0];
  const horas = horasDiarias || mat.horasDiarias;
  const dias = diasSemana || mat.diasEstudo;
  
  // Converter string de dias para array de números
  const diasArray = dias.split(',').map(d => parseInt(d));
  
  // Buscar metas pendentes do plano
  const metasPendentes = await db
    .select({
      metaId: metas.id,
      duracao: metas.duracao,
      incidencia: metas.incidencia,
      ordem: metas.ordem,
    })
    .from(metas)
    .leftJoin(
      progressoMetas,
      and(
        eq(progressoMetas.metaId, metas.id),
        eq(progressoMetas.userId, userId)
      )
    )
    .where(
      and(
        eq(metas.planoId, mat.planoId),
        or(
          isNull(progressoMetas.concluida),
          eq(progressoMetas.concluida, 0)
        )
      )
    )
    .orderBy(metas.ordem);

  if (metasPendentes.length === 0) {
    console.log("[Redistribuição] Nenhuma meta pendente encontrada");
    return;
  }

  // Ordenar por incidência (alta → média → baixa) e depois por ordem
  const metasOrdenadas = metasPendentes.sort((a, b) => {
    const prioridadeIncidencia: { [key: string]: number } = {
      'alta': 3,
      'media': 2,
      'baixa': 1,
    };
    
    const prioA = prioridadeIncidencia[a.incidencia || 'media'] || 2;
    const prioB = prioridadeIncidencia[b.incidencia || 'media'] || 2;
    
    if (prioA !== prioB) return prioB - prioA; // Maior prioridade primeiro
    return (a.ordem || 0) - (b.ordem || 0); // Depois por ordem
  });

  // Distribuir metas ao longo dos dias
  const minutosDisponiveis = horas * 60; // Converter horas para minutos
  let dataAtual = new Date();
  dataAtual.setHours(0, 0, 0, 0); // Zerar horário
  
  // Avançar para o próximo dia de estudo
  while (!diasArray.includes(dataAtual.getDay())) {
    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  let minutosUsadosHoje = 0;
  
  for (const meta of metasOrdenadas) {
    const duracaoMeta = meta.duracao || 60;
    
    // Se a meta não cabe no dia atual, avançar para o próximo
    if (minutosUsadosHoje + duracaoMeta > minutosDisponiveis) {
      // Avançar para o próximo dia de estudo
      do {
        dataAtual.setDate(dataAtual.getDate() + 1);
      } while (!diasArray.includes(dataAtual.getDay()));
      
      minutosUsadosHoje = 0;
    }
    
    // Atualizar ou criar progresso com a nova data
    const dataAgendada = dataAtual.toISOString().split('T')[0];
    
    // Verificar se já existe progresso
    const progressoExistente = await db
      .select()
      .from(progressoMetas)
      .where(
        and(
          eq(progressoMetas.userId, userId),
          eq(progressoMetas.metaId, meta.metaId)
        )
      )
      .limit(1);
    
    if (progressoExistente.length > 0) {
      // Atualizar data agendada
      await db
        .update(progressoMetas)
        .set({
          dataAgendada,
          updatedAt: new Date(),
        })
        .where(eq(progressoMetas.id, progressoExistente[0].id));
    } else {
      // Criar novo progresso
      await db.insert(progressoMetas).values({
        userId,
        metaId: meta.metaId,
        dataAgendada,
        concluida: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    minutosUsadosHoje += duracaoMeta;
  }
  
  console.log(`[Redistribuição] ${metasOrdenadas.length} metas redistribuídas para o usuário ${userId}`);
}

/**
 * ========================================
 * BUGS REPORTADOS
 * ========================================
 */

/**
 * Criar um novo bug reportado
 */
export async function criarBugReportado(dados: {
  userId: number;
  titulo: string;
  descricao: string;
  categoria: "interface" | "funcionalidade" | "performance" | "dados" | "mobile" | "outro";
  prioridade: "baixa" | "media" | "alta" | "critica";
  screenshots?: string[]; // URLs das imagens no S3
  paginaUrl?: string;
  navegador?: string;
  resolucao?: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const screenshotsJson = dados.screenshots ? JSON.stringify(dados.screenshots) : null;

  const result = await db.insert(bugsReportados).values({
    userId: dados.userId,
    titulo: dados.titulo,
    descricao: dados.descricao,
    categoria: dados.categoria,
    prioridade: dados.prioridade,
    screenshots: screenshotsJson,
    paginaUrl: dados.paginaUrl || null,
    navegador: dados.navegador || null,
    resolucao: dados.resolucao || null,
    status: "pendente",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return Number(result.insertId);
}

/**
 * Listar todos os bugs reportados (para admin)
 */
export async function listarBugsReportados(filtros?: {
  status?: string;
  prioridade?: string;
  categoria?: string;
}): Promise<any[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let query = db
    .select({
      id: bugsReportados.id,
      userId: bugsReportados.userId,
      userName: users.name,
      userEmail: users.email,
      titulo: bugsReportados.titulo,
      descricao: bugsReportados.descricao,
      categoria: bugsReportados.categoria,
      prioridade: bugsReportados.prioridade,
      status: bugsReportados.status,
      screenshots: bugsReportados.screenshots,
      paginaUrl: bugsReportados.paginaUrl,
      navegador: bugsReportados.navegador,
      resolucao: bugsReportados.resolucao,
      observacoesAdmin: bugsReportados.observacoesAdmin,
      createdAt: bugsReportados.createdAt,
      updatedAt: bugsReportados.updatedAt,
      resolvidoEm: bugsReportados.resolvidoEm,
      resolvidoPor: bugsReportados.resolvidoPor,
    })
    .from(bugsReportados)
    .leftJoin(users, eq(bugsReportados.userId, users.id));

  // Aplicar filtros
  const conditions = [];
  if (filtros?.status) {
    conditions.push(eq(bugsReportados.status, filtros.status as any));
  }
  if (filtros?.prioridade) {
    conditions.push(eq(bugsReportados.prioridade, filtros.prioridade as any));
  }
  if (filtros?.categoria) {
    conditions.push(eq(bugsReportados.categoria, filtros.categoria as any));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  const bugs = await query.orderBy(desc(bugsReportados.createdAt));

  // Parse screenshots JSON
  return bugs.map(bug => ({
    ...bug,
    screenshots: bug.screenshots ? JSON.parse(bug.screenshots) : [],
  }));
}

/**
 * Buscar bug por ID
 */
export async function getBugReportadoById(bugId: number): Promise<any | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select({
      id: bugsReportados.id,
      userId: bugsReportados.userId,
      userName: users.name,
      userEmail: users.email,
      titulo: bugsReportados.titulo,
      descricao: bugsReportados.descricao,
      categoria: bugsReportados.categoria,
      prioridade: bugsReportados.prioridade,
      status: bugsReportados.status,
      screenshots: bugsReportados.screenshots,
      paginaUrl: bugsReportados.paginaUrl,
      navegador: bugsReportados.navegador,
      resolucao: bugsReportados.resolucao,
      observacoesAdmin: bugsReportados.observacoesAdmin,
      createdAt: bugsReportados.createdAt,
      updatedAt: bugsReportados.updatedAt,
      resolvidoEm: bugsReportados.resolvidoEm,
      resolvidoPor: bugsReportados.resolvidoPor,
    })
    .from(bugsReportados)
    .leftJoin(users, eq(bugsReportados.userId, users.id))
    .where(eq(bugsReportados.id, bugId))
    .limit(1);

  if (result.length === 0) return null;

  const bug = result[0];
  return {
    ...bug,
    screenshots: bug.screenshots ? JSON.parse(bug.screenshots) : [],
  };
}

/**
 * Atualizar status do bug
 */
export async function atualizarStatusBug(
  bugId: number,
  status: "pendente" | "em_analise" | "resolvido" | "fechado",
  adminId: number,
  observacoes?: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = {
    status,
    updatedAt: new Date(),
  };

  if (observacoes) {
    updateData.observacoesAdmin = observacoes;
  }

  if (status === "resolvido") {
    updateData.resolvidoEm = new Date();
    updateData.resolvidoPor = adminId;
  }

  await db
    .update(bugsReportados)
    .set(updateData)
    .where(eq(bugsReportados.id, bugId));
}

/**
 * Deletar bug reportado
 */
export async function deletarBugReportado(bugId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(bugsReportados).where(eq(bugsReportados.id, bugId));
}

/**
 * Contar bugs por status
 */
export async function contarBugsPorStatus(): Promise<{
  pendente: number;
  em_analise: number;
  resolvido: number;
  fechado: number;
  total: number;
}> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const bugs = await db.select().from(bugsReportados);

  const contadores = {
    pendente: 0,
    em_analise: 0,
    resolvido: 0,
    fechado: 0,
    total: bugs.length,
  };

  bugs.forEach(bug => {
    if (bug.status === "pendente") contadores.pendente++;
    else if (bug.status === "em_analise") contadores.em_analise++;
    else if (bug.status === "resolvido") contadores.resolvido++;
    else if (bug.status === "fechado") contadores.fechado++;
  });

  return contadores;
}

/**
 * Notificar owner sobre novo bug reportado
 */
export async function notificarOwnerNovoBug(bugId: number, bug: {
  titulo: string;
  categoria: string;
  prioridade: string;
  userName?: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Buscar owner pelo OWNER_OPEN_ID
  const owner = await db
    .select()
    .from(users)
    .where(eq(users.openId, ENV.ownerOpenId))
    .limit(1);

  if (owner.length === 0) {
    console.warn("[notificarOwnerNovoBug] Owner não encontrado");
    return;
  }

  const ownerId = owner[0].id;

  // Emojis por prioridade
  const prioridadeEmoji: Record<string, string> = {
    baixa: "🟢",
    media: "🟡",
    alta: "🟠",
    critica: "🔴",
  };

  // Emojis por categoria
  const categoriaEmoji: Record<string, string> = {
    interface: "🎨",
    funcionalidade: "⚙️",
    performance: "⚡",
    dados: "📊",
    mobile: "📱",
    outro: "❓",
  };

  const emoji = prioridadeEmoji[bug.prioridade] || "🐛";
  const catEmoji = categoriaEmoji[bug.categoria] || "🐛";

  // Criar notificação
  await db.insert(notificacoes).values({
    userId: ownerId,
    tipo: "sistema",
    titulo: `${emoji} Novo Bug Reportado`,
    mensagem: `${catEmoji} **${bug.titulo}**\n\nCategoria: ${bug.categoria}\nPrioridade: ${bug.prioridade}\nReportado por: ${bug.userName || "Usuário desconhecido"}`,
    link: `/admin?tab=bugs`, // Link direto para o painel de bugs
    lida: 0,
    metadata: JSON.stringify({ bugId, tipo: "bug_reportado" }),
    createdAt: new Date(),
  });

  console.log(`[notificarOwnerNovoBug] Notificação criada para owner sobre bug #${bugId}`);
}
