import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["aluno", "professor", "administrativo", "mentor", "master"]).default("aluno").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Planos de estudo - estrutura completa de estudos vinculada a um concurso/edital
 */
export const planos = mysqlTable("planos", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  tipo: mysqlEnum("tipo", ["pago", "gratuito"]).default("pago").notNull(),
  duracaoTotal: int("duracao_total").notNull(), // em dias
  concursoArea: varchar("concurso_area", { length: 255 }),
  ativo: int("ativo").default(1).notNull(), // 1 = ativo, 0 = inativo
  horasDiariasPadrao: int("horas_diarias_padrao").default(4).notNull(),
  diasEstudoPadrao: varchar("dias_estudo_padrao", { length: 50 }).default("1,2,3,4,5").notNull(), // dias da semana (0=dom, 6=sab)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Plano = typeof planos.$inferSelect;
export type InsertPlano = typeof planos.$inferInsert;

/**
 * Matrículas - relacionamento entre alunos e planos
 */
export const matriculas = mysqlTable("matriculas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  planoId: int("plano_id").notNull(),
  dataInicio: timestamp("data_inicio").defaultNow().notNull(),
  dataTermino: timestamp("data_termino").notNull(),
  horasDiarias: int("horas_diarias").default(4).notNull(),
  diasEstudo: varchar("dias_estudo", { length: 50 }).default("1,2,3,4,5").notNull(),
  ativo: int("ativo").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Matricula = typeof matriculas.$inferSelect;
export type InsertMatricula = typeof matriculas.$inferInsert;

/**
 * Metas - unidade básica de atividade no cronograma
 */
export const metas = mysqlTable("metas", {
  id: int("id").autoincrement().primaryKey(),
  planoId: int("plano_id").notNull(),
  disciplina: varchar("disciplina", { length: 255 }).notNull(),
  assunto: text("assunto").notNull(),
  tipo: mysqlEnum("tipo", ["estudo", "revisao", "questoes"]).notNull(),
  duracao: int("duracao").notNull(), // em minutos
  incidencia: mysqlEnum("incidencia", ["baixa", "media", "alta"]),
  prioridade: int("prioridade").default(3).notNull(), // 1-5
  ordem: int("ordem").notNull(),
  dicaEstudo: text("dica_estudo"),
  orientacaoEstudos: text("orientacao_estudos"),
  aulaId: int("aula_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Meta = typeof metas.$inferSelect;
export type InsertMeta = typeof metas.$inferInsert;

/**
 * Progresso das metas - acompanhamento individual por aluno
 */
export const progressoMetas = mysqlTable("progresso_metas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  metaId: int("meta_id").notNull(),
  dataAgendada: timestamp("data_agendada").notNull(),
  concluida: int("concluida").default(0).notNull(), // 0 = não, 1 = sim
  dataConclusao: timestamp("data_conclusao"),
  tempoGasto: int("tempo_gasto").default(0).notNull(), // em minutos
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ProgressoMeta = typeof progressoMetas.$inferSelect;
export type InsertProgressoMeta = typeof progressoMetas.$inferInsert;

/**
 * Aulas - repositório de conteúdos educacionais
 */
export const aulas = mysqlTable("aulas", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 500 }).notNull(),
  descricao: text("descricao"),
  professorId: int("professor_id"),
  disciplina: varchar("disciplina", { length: 255 }).notNull(),
  assuntoNivel1: varchar("assunto_nivel1", { length: 255 }),
  assuntoNivel2: varchar("assunto_nivel2", { length: 255 }),
  assuntoNivel3: varchar("assunto_nivel3", { length: 255 }),
  concursoArea: varchar("concurso_area", { length: 255 }),
  duracao: int("duracao").default(0).notNull(), // em minutos
  tipoConteudo: mysqlEnum("tipo_conteudo", ["videoaula", "pdf", "audio", "slides", "questoes", "mapa_mental", "legislacao"]).default("videoaula").notNull(),
  urlVideo: text("url_video"),
  urlMaterial: text("url_material"),
  conteudoHtml: text("conteudo_html"),
  tags: text("tags"), // JSON array
  nivelDificuldade: mysqlEnum("nivel_dificuldade", ["basico", "intermediario", "avancado"]).default("basico").notNull(),
  visualizacoes: int("visualizacoes").default(0).notNull(),
  ativo: int("ativo").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Aula = typeof aulas.$inferSelect;
export type InsertAula = typeof aulas.$inferInsert;

/**
 * Progresso das aulas - acompanhamento individual por aluno
 */
export const progressoAulas = mysqlTable("progresso_aulas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  aulaId: int("aula_id").notNull(),
  percentualAssistido: int("percentual_assistido").default(0).notNull(),
  concluida: int("concluida").default(0).notNull(),
  favoritada: int("favoritada").default(0).notNull(),
  tempoAssistido: int("tempo_assistido").default(0).notNull(), // em segundos
  ultimaPosicao: int("ultima_posicao").default(0).notNull(), // em segundos
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ProgressoAula = typeof progressoAulas.$inferSelect;
export type InsertProgressoAula = typeof progressoAulas.$inferInsert;

/**
 * Questões - banco de questões para prática
 */
export const questoes = mysqlTable("questoes", {
  id: int("id").autoincrement().primaryKey(),
  enunciado: text("enunciado").notNull(),
  alternativas: text("alternativas").notNull(), // JSON array
  gabarito: varchar("gabarito", { length: 1 }).notNull(), // A, B, C, D, E
  banca: varchar("banca", { length: 255 }),
  concurso: varchar("concurso", { length: 255 }),
  ano: int("ano"),
  disciplina: varchar("disciplina", { length: 255 }).notNull(),
  assuntos: text("assuntos"), // JSON array
  nivelDificuldade: mysqlEnum("nivel_dificuldade", ["facil", "medio", "dificil"]).default("medio").notNull(),
  comentario: text("comentario"),
  urlVideoResolucao: text("url_video_resolucao"),
  taxaAcerto: int("taxa_acerto").default(0).notNull(), // percentual 0-100
  totalResolucoes: int("total_resolucoes").default(0).notNull(),
  ativo: int("ativo").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Questao = typeof questoes.$inferSelect;
export type InsertQuestao = typeof questoes.$inferInsert;

/**
 * Respostas de questões - histórico de respostas dos alunos
 */
export const respostasQuestoes = mysqlTable("respostas_questoes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  questaoId: int("questao_id").notNull(),
  respostaAluno: varchar("resposta_aluno", { length: 1 }).notNull(),
  acertou: int("acertou").notNull(), // 0 = errou, 1 = acertou
  tempoResposta: int("tempo_resposta").default(0).notNull(), // em segundos
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type RespostaQuestao = typeof respostasQuestoes.$inferSelect;
export type InsertRespostaQuestao = typeof respostasQuestoes.$inferInsert;

/**
 * Fórum - tópicos de discussão
 */
export const forumTopicos = mysqlTable("forum_topicos", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  titulo: varchar("titulo", { length: 500 }).notNull(),
  conteudo: text("conteudo").notNull(),
  categoria: varchar("categoria", { length: 255 }),
  tags: text("tags"), // JSON array
  aulaId: int("aula_id"),
  metaId: int("meta_id"),
  resolvido: int("resolvido").default(0).notNull(),
  fixado: int("fixado").default(0).notNull(),
  fechado: int("fechado").default(0).notNull(),
  visualizacoes: int("visualizacoes").default(0).notNull(),
  curtidas: int("curtidas").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ForumTopico = typeof forumTopicos.$inferSelect;
export type InsertForumTopico = typeof forumTopicos.$inferInsert;

/**
 * Fórum - respostas aos tópicos
 */
export const forumRespostas = mysqlTable("forum_respostas", {
  id: int("id").autoincrement().primaryKey(),
  topicoId: int("topico_id").notNull(),
  userId: int("user_id").notNull(),
  conteudo: text("conteudo").notNull(),
  respostaPaiId: int("resposta_pai_id"), // para sub-respostas (threading)
  solucao: int("solucao").default(0).notNull(), // 0 = não, 1 = sim
  votos: int("votos").default(0).notNull(),
  curtidas: int("curtidas").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ForumResposta = typeof forumRespostas.$inferSelect;
export type InsertForumResposta = typeof forumRespostas.$inferInsert;

/**
 * Avisos - sistema de notificações e comunicados
 */
export const avisos = mysqlTable("avisos", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 500 }).notNull(),
  conteudo: text("conteudo").notNull(),
  tipo: mysqlEnum("tipo", ["normal", "urgente", "individual"]).default("normal").notNull(),
  planoId: int("plano_id"), // null = todos os planos
  userId: int("user_id"), // para avisos individuais
  criadoPor: int("criado_por").notNull(),
  ativo: int("ativo").default(1).notNull(),
  dataAgendamento: timestamp("data_agendamento"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Aviso = typeof avisos.$inferSelect;
export type InsertAviso = typeof avisos.$inferInsert;

/**
 * Avisos dispensados - controle de avisos que o usuário já dispensou
 */
export const avisosDispensados = mysqlTable("avisos_dispensados", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  avisoId: int("aviso_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AvisoDispensado = typeof avisosDispensados.$inferSelect;
export type InsertAvisoDispensado = typeof avisosDispensados.$inferInsert;