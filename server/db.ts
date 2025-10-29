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
  forumMensagensRetidas
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
