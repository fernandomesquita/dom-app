import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
  pontos: int("pontos").default(0).notNull(),
  
  // Autenticação
  emailVerified: int("email_verified").default(0).notNull(), // 0 = não verificado, 1 = verificado
  passwordHash: varchar("password_hash", { length: 255 }), // Hash bcrypt (opcional, para login com senha)
  
  // Dados pessoais completos
  cpf: varchar("cpf", { length: 14 }).unique(), // Formato: 000.000.000-00
  telefone: varchar("telefone", { length: 20 }),
  dataNascimento: varchar("data_nascimento", { length: 10 }), // Formato: DD/MM/YYYY
  endereco: text("endereco"), // JSON: {rua, numero, complemento, bairro, cidade, estado, cep}
  foto: varchar("foto", { length: 500 }), // URL S3
  bio: text("bio"),
  status: mysqlEnum("status", ["ativo", "inativo", "suspenso"]).default("ativo").notNull(),
  observacoes: text("observacoes"), // Notas internas do admin
  
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
  orgao: varchar("orgao", { length: 255 }),
  cargo: varchar("cargo", { length: 255 }),
  concursoArea: varchar("concurso_area", { length: 255 }), // Mantido para compatibilidade
  ativo: int("ativo").default(1).notNull(), // 1 = ativo, 0 = inativo
  horasDiariasPadrao: int("horas_diarias_padrao").default(4).notNull(),
  diasEstudoPadrao: varchar("dias_estudo_padrao", { length: 50 }).default("1,2,3,4,5").notNull(), // dias da semana (0=dom, 6=sab)
  createdBy: int("created_by"), // userId do criador
  mensagemPosPlano: text("mensagem_pos_plano"), // Mensagem HTML rich text após última meta
  linkPosPlano: varchar("link_pos_plano", { length: 500 }), // Link opcional após última meta
  exibirMensagemPosPlano: int("exibir_mensagem_pos_plano").default(0).notNull(), // 1 = exibir, 0 = não exibir
  
  // Ciclo EARA®
  algoritmoEARA: int("algoritmo_eara").default(1).notNull(), // 1 = habilitado, 0 = desabilitado
  configuracaoEARA: json("configuracao_eara"), // Configurações JSON do algoritmo
  
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
  planoId: varchar("plano_id", { length: 500 }).notNull(), // IDs separados por vírgula para múltiplos planos
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
  
  // Ciclo EARA®
  assuntoAgrupador: varchar("assunto_agrupador", { length: 255 }), // Para agrupar E-A-R-R-R do mesmo assunto
  sequenciaEARA: int("sequencia_eara").default(1).notNull(), // 1=Estudo, 2=Aplicação, 3=Revisão1, etc
  metaOrigemId: int("meta_origem_id"), // ID da meta de Estudo original (para revisões)
  
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
  pulada: int("pulada").default(0).notNull(), // 0 = não, 1 = sim
  dataPulada: timestamp("data_pulada"),
  adiada: int("adiada").default(0).notNull(), // 0 = não, 1 = sim
  dataAdiamento: timestamp("data_adiamento"),
  
  // Ciclo EARA®
  cicloEARA: varchar("ciclo_eara", { length: 50 }), // 'estudo', 'aplicacao', 'revisao1', 'revisao2', 'revisao3'
  desempenhoQuestoes: int("desempenho_questoes"), // % de acerto (0-100) para adaptação
  proximoCiclo: varchar("proximo_ciclo", { length: 50 }), // próximo ciclo agendado
  dataProximoCiclo: timestamp("data_proximo_ciclo"), // data do próximo ciclo
  
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
 * Anotações de aulas - notas dos alunos com timestamps
 */
export const anotacoesAulas = mysqlTable("anotacoes_aulas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  aulaId: int("aula_id").notNull(),
  timestamp: int("timestamp").notNull(), // posição do vídeo em segundos
  conteudo: text("conteudo").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type AnotacaoAula = typeof anotacoesAulas.$inferSelect;
export type InsertAnotacaoAula = typeof anotacoesAulas.$inferInsert;

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

/**
 * Notificações lidas do fórum - controle de respostas visualizadas
 */
export const forumNotificacoesLidas = mysqlTable("forum_notificacoes_lidas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  respostaId: int("resposta_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ForumNotificacaoLida = typeof forumNotificacoesLidas.$inferSelect;
export type InsertForumNotificacaoLida = typeof forumNotificacoesLidas.$inferInsert;

// ========== GAMIFICAÇÃO ==========

export const conquistas = mysqlTable("conquistas", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  descricao: text("descricao"),
  icone: varchar("icone", { length: 50 }), // nome do ícone lucide-react
  pontosRequeridos: int("pontosRequeridos"),
  tipo: mysqlEnum("tipo", ["meta", "aula", "questao", "sequencia", "especial"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const userConquistas = mysqlTable("userConquistas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  conquistaId: int("conquistaId").notNull(),
  desbloqueadaEm: timestamp("desbloqueadaEm").defaultNow().notNull(),
});

export type Conquista = typeof conquistas.$inferSelect;
export type InsertConquista = typeof conquistas.$inferInsert;
export type UserConquista = typeof userConquistas.$inferSelect;
export type InsertUserConquista = typeof userConquistas.$inferInsert;

// ========== CONFIGURAÇÕES DO SISTEMA ==========

/**
 * Configurações de funcionalidades - controle de módulos habilitados/desabilitados
 */
export const configFuncionalidades = mysqlTable("config_funcionalidades", {
  id: int("id").autoincrement().primaryKey(),
  questoesHabilitado: int("questoes_habilitado").default(1).notNull(),
  forumHabilitado: int("forum_habilitado").default(1).notNull(),
  materiaisHabilitado: int("materiais_habilitado").default(1).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ConfigFuncionalidades = typeof configFuncionalidades.$inferSelect;
export type InsertConfigFuncionalidades = typeof configFuncionalidades.$inferInsert;

/**
 * Mensagens retidas do fórum - moderação de conteúdo com links
 */
export const forumMensagensRetidas = mysqlTable("forum_mensagens_retidas", {
  id: int("id").autoincrement().primaryKey(),
  tipo: mysqlEnum("tipo", ["topico", "resposta"]).notNull(),
  topicoId: int("topico_id"),
  respostaId: int("resposta_id"),
  autorId: int("autor_id").notNull(),
  conteudo: text("conteudo").notNull(),
  linksDetectados: text("links_detectados").notNull(), // JSON array de links
  status: mysqlEnum("status", ["pendente", "aprovado", "rejeitado"]).default("pendente").notNull(),
  revisadoPor: int("revisado_por"),
  revisadoEm: timestamp("revisado_em"),
  motivoRejeicao: text("motivo_rejeicao"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ForumMensagemRetida = typeof forumMensagensRetidas.$inferSelect;
export type InsertForumMensagemRetida = typeof forumMensagensRetidas.$inferInsert;

// ========== AUTENTICAÇÃO E SEGURANÇA ==========

/**
 * Tokens de verificação de email
 */
export const emailVerificationTokens = mysqlTable("email_verification_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect;
export type InsertEmailVerificationToken = typeof emailVerificationTokens.$inferInsert;

/**
 * Tokens de reset de senha
 */
export const passwordResetTokens = mysqlTable("password_reset_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

/**
 * Sessões ativas dos usuários
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("user_agent"),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Logs de auditoria - rastreamento de ações críticas
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"), // null se ação do sistema
  action: varchar("action", { length: 100 }).notNull(), // create, update, delete, login, etc
  entity: varchar("entity", { length: 100 }).notNull(), // users, planos, metas, etc
  entityId: int("entity_id"),
  oldData: text("old_data"), // JSON do estado anterior
  newData: text("new_data"), // JSON do estado novo
  ip: varchar("ip", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Permissões do sistema - controle granular de acesso
 */
export const permissions = mysqlTable("permissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(), // Ex: usuarios.criar, planos.editar
  description: text("description"),
  module: varchar("module", { length: 50 }).notNull(), // Ex: usuarios, planos, forum
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = typeof permissions.$inferInsert;

/**
 * Relação entre roles e permissões
 */
export const rolePermissions = mysqlTable("role_permissions", {
  id: int("id").autoincrement().primaryKey(),
  role: mysqlEnum("role", ["aluno", "professor", "administrativo", "mentor", "master"]).notNull(),
  permissionId: int("permission_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = typeof rolePermissions.$inferInsert;

// ========== NOTIFICAÇÕES ==========

/**
 * Notificações - sistema unificado de notificações da plataforma
 */
export const notificacoes = mysqlTable("notificacoes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(), // destinatário
  tipo: mysqlEnum("tipo", [
    "forum_resposta", // alguém respondeu seu tópico
    "forum_mencao", // você foi mencionado
    "meta_vencendo", // meta próxima do prazo
    "meta_atrasada", // meta atrasada
    "aula_nova", // nova aula disponível
    "material_novo", // novo material disponível
    "aviso_geral", // aviso da administração
    "conquista", // nova conquista/badge
    "sistema", // notificação do sistema
  ]).notNull(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  mensagem: text("mensagem").notNull(),
  link: varchar("link", { length: 500 }), // URL para ação relacionada
  lida: int("lida").default(0).notNull(), // 0 = não lida, 1 = lida
  metadata: text("metadata"), // JSON com dados extras (id do tópico, meta, etc)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Notificacao = typeof notificacoes.$inferSelect;
export type InsertNotificacao = typeof notificacoes.$inferInsert;

/**
 * Preferências de notificações - controle de quais notificações o usuário quer receber
 */
export const preferenciasNotificacoes = mysqlTable("preferencias_notificacoes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  
  // In-app (central de notificações)
  inappForumResposta: int("inapp_forum_resposta").default(1).notNull(),
  inappForumMencao: int("inapp_forum_mencao").default(1).notNull(),
  inappMetaVencendo: int("inapp_meta_vencendo").default(1).notNull(),
  inappMetaAtrasada: int("inapp_meta_atrasada").default(1).notNull(),
  inappAulaNova: int("inapp_aula_nova").default(1).notNull(),
  inappMaterialNovo: int("inapp_material_novo").default(1).notNull(),
  inappAvisoGeral: int("inapp_aviso_geral").default(1).notNull(),
  inappConquista: int("inapp_conquista").default(1).notNull(),
  
  // Email
  emailForumResposta: int("email_forum_resposta").default(0).notNull(),
  emailForumMencao: int("email_forum_mencao").default(1).notNull(),
  emailMetaVencendo: int("email_meta_vencendo").default(1).notNull(),
  emailMetaAtrasada: int("email_meta_atrasada").default(1).notNull(),
  emailAulaNova: int("email_aula_nova").default(0).notNull(),
  emailMaterialNovo: int("email_material_novo").default(0).notNull(),
  emailAvisoGeral: int("email_aviso_geral").default(1).notNull(),
  
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PreferenciasNotificacoes = typeof preferenciasNotificacoes.$inferSelect;
export type InsertPreferenciasNotificacoes = typeof preferenciasNotificacoes.$inferInsert;
