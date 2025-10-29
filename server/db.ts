import { eq } from "drizzle-orm";
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
  avisos, InsertAviso,
  avisosDispensados
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
  const result = await db.select().from(metas).where(eq(metas.planoId, planoId));
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
  const result = await db.select().from(forumTopicos);
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
  
  await db.insert(metas).values(meta as InsertMeta);
  return { success: true, ...meta };
}

export async function updateMeta(id: number, updates: Partial<InsertMeta>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(metas).set(updates).where(eq(metas.id, id));
  return { id, ...updates };
}

export async function deleteMeta(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(metas).where(eq(metas.id, id));
  return { success: true };
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
    
    return { ...progressoExistente[0], concluida: concluida ? 1 : 0 };
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
    
    return { userId, metaId, concluida: concluida ? 1 : 0 };
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
    
    return { ...progressoExistente[0], concluida: 1 };
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
    
    return { userId, aulaId, concluida: 1 };
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
  
  return { success: true };
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
