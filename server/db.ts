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

export async function createMeta(meta: InsertMeta) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(metas).values(meta);
  return result;
}

// ===== PROGRESSO METAS =====
export async function getProgressoMetasByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(progressoMetas).where(eq(progressoMetas.userId, userId));
  return result;
}

export async function marcarMetaConcluida(userId: number, metaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { and } = await import("drizzle-orm");
  const result = await db.update(progressoMetas)
    .set({ concluida: 1, dataConclusao: new Date() })
    .where(and(
      eq(progressoMetas.userId, userId),
      eq(progressoMetas.metaId, metaId)
    ));
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
