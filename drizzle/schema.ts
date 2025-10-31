import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, text, timestamp, varchar, index, mysqlEnum, json } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const anotacoesAulas = mysqlTable("anotacoes_aulas", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	aulaId: int("aula_id").notNull(),
	timestamp: int().notNull(),
	conteudo: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const auditLogs = mysqlTable("audit_logs", {
	id: int().autoincrement().notNull(),
	userId: int("user_id"),
	action: varchar({ length: 100 }).notNull(),
	entity: varchar({ length: 100 }).notNull(),
	entityId: int("entity_id"),
	oldData: text("old_data"),
	newData: text("new_data"),
	ip: varchar({ length: 45 }),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const aulas = mysqlTable("aulas", {
	id: int().autoincrement().notNull(),
	titulo: varchar({ length: 500 }).notNull(),
	descricao: text(),
	professorId: int("professor_id"),
	disciplina: varchar({ length: 255 }).notNull(),
	assuntoNivel1: varchar("assunto_nivel1", { length: 255 }),
	assuntoNivel2: varchar("assunto_nivel2", { length: 255 }),
	assuntoNivel3: varchar("assunto_nivel3", { length: 255 }),
	concursoArea: varchar("concurso_area", { length: 255 }),
	duracao: int().default(0).notNull(),
	tipoConteudo: mysqlEnum("tipo_conteudo", ['videoaula','pdf','audio','slides','questoes','mapa_mental','legislacao']).default('videoaula').notNull(),
	urlVideo: text("url_video"),
	urlMaterial: text("url_material"),
	conteudoHtml: text("conteudo_html"),
	tags: text(),
	nivelDificuldade: mysqlEnum("nivel_dificuldade", ['basico','intermediario','avancado']).default('basico').notNull(),
	visualizacoes: int().default(0).notNull(),
	ativo: int().default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("idx_aulas_disciplina").on(table.disciplina),
	index("").on(table.disciplina),
	index("idx_aulas_tipo_conteudo").on(table.tipoConteudo),
	index("idx_aulas_ativo").on(table.ativo),
]);

export const avisos = mysqlTable("avisos", {
	id: int().autoincrement().notNull(),
	titulo: varchar({ length: 500 }).notNull(),
	conteudo: text().notNull(),
	tipo: mysqlEnum(['normal','urgente','individual']).default('normal').notNull(),
	planoId: int("plano_id"),
	userId: int("user_id"),
	criadoPor: int("criado_por").notNull(),
	ativo: int().default(1).notNull(),
	dataAgendamento: timestamp("data_agendamento", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const avisosDispensados = mysqlTable("avisos_dispensados", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	avisoId: int("aviso_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const bugsReportados = mysqlTable("bugs_reportados", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	titulo: varchar({ length: 255 }).notNull(),
	descricao: text().notNull(),
	categoria: mysqlEnum(['interface','funcionalidade','performance','dados','mobile','outro']).notNull(),
	prioridade: mysqlEnum(['baixa','media','alta','critica']).default('media').notNull(),
	status: mysqlEnum(['pendente','em_analise','resolvido','fechado']).default('pendente').notNull(),
	screenshots: text(),
	paginaUrl: varchar("pagina_url", { length: 500 }),
	navegador: varchar({ length: 100 }),
	resolucao: varchar({ length: 50 }),
	observacoesAdmin: text("observacoes_admin"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	resolvidoEm: timestamp("resolvido_em", { mode: 'string' }),
	resolvidoPor: int("resolvido_por"),
});

export const configFuncionalidades = mysqlTable("config_funcionalidades", {
	id: int().autoincrement().notNull(),
	questoesHabilitado: int("questoes_habilitado").default(1).notNull(),
	forumHabilitado: int("forum_habilitado").default(1).notNull(),
	materiaisHabilitado: int("materiais_habilitado").default(1).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const conquistas = mysqlTable("conquistas", {
	id: int().autoincrement().notNull(),
	nome: varchar({ length: 100 }).notNull(),
	descricao: text(),
	icone: varchar({ length: 50 }),
	pontosRequeridos: int(),
	tipo: mysqlEnum(['meta','aula','questao','sequencia','especial']).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const conquistasQuestoes = mysqlTable("conquistas_questoes", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	tipo: varchar({ length: 50 }).notNull(),
	dataConquista: timestamp("data_conquista", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const emailVerificationTokens = mysqlTable("email_verification_tokens", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	token: varchar({ length: 64 }).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("email_verification_tokens_token_unique").on(table.token),
]);

export const forumLixeira = mysqlTable("forum_lixeira", {
	id: int().autoincrement().notNull(),
	tipo: mysqlEnum(['topico','resposta']).notNull(),
	conteudoOriginal: text("conteudo_original").notNull(),
	autorId: int("autor_id").notNull(),
	deletadoPor: int("deletado_por").notNull(),
	motivoDelecao: text("motivo_delecao"),
	deletadoEm: timestamp("deletado_em", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const forumMensagensRetidas = mysqlTable("forum_mensagens_retidas", {
	id: int().autoincrement().notNull(),
	tipo: mysqlEnum(['topico','resposta']).notNull(),
	topicoId: int("topico_id"),
	respostaId: int("resposta_id"),
	autorId: int("autor_id").notNull(),
	conteudo: text().notNull(),
	linksDetectados: text("links_detectados").notNull(),
	status: mysqlEnum(['pendente','aprovado','rejeitado']).default('pendente').notNull(),
	revisadoPor: int("revisado_por"),
	revisadoEm: timestamp("revisado_em", { mode: 'string' }),
	motivoRejeicao: text("motivo_rejeicao"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const forumNotificacoesLidas = mysqlTable("forum_notificacoes_lidas", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	respostaId: int("resposta_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const forumRespostas = mysqlTable("forum_respostas", {
	id: int().autoincrement().notNull(),
	topicoId: int("topico_id").notNull(),
	userId: int("user_id").notNull(),
	conteudo: text().notNull(),
	respostaPaiId: int("resposta_pai_id"),
	solucao: int().default(0).notNull(),
	votos: int().default(0).notNull(),
	curtidas: int().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const forumTopicos = mysqlTable("forum_topicos", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	titulo: varchar({ length: 500 }).notNull(),
	conteudo: text().notNull(),
	categoria: varchar({ length: 255 }),
	tags: text(),
	aulaId: int("aula_id"),
	metaId: int("meta_id"),
	resolvido: int().default(0).notNull(),
	fixado: int().default(0).notNull(),
	fechado: int().default(0).notNull(),
	visualizacoes: int().default(0).notNull(),
	curtidas: int().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const materiais = mysqlTable("materiais", {
	id: int().autoincrement().notNull(),
	titulo: varchar({ length: 255 }).notNull(),
	descricao: text(),
	urlArquivo: text("url_arquivo").notNull(),
	tipoArquivo: varchar("tipo_arquivo", { length: 50 }).default('application/pdf').notNull(),
	tamanhoBytes: int("tamanho_bytes"),
	metaId: int("meta_id"),
	disciplina: varchar({ length: 255 }),
	uploadedBy: int("uploaded_by").notNull(),
	ativo: int().default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const matriculas = mysqlTable("matriculas", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	planoId: int("plano_id").notNull(),
	dataInicio: timestamp("data_inicio", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	dataTermino: timestamp("data_termino", { mode: 'string' }).notNull(),
	horasDiarias: int("horas_diarias").default(4).notNull(),
	diasEstudo: varchar("dias_estudo", { length: 50 }).default('1,2,3,4,5').notNull(),
	ativo: int().default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("idx_matriculas_user_id").on(table.userId),
	index("idx_matriculas_plano_id").on(table.planoId),
	index("idx_matriculas_ativo").on(table.ativo),
	index("idx_matriculas_user_plano").on(table.userId, table.planoId),
	index("").on(table.userId),
]);

export const metas = mysqlTable("metas", {
	id: int().autoincrement().notNull(),
	planoId: varchar("plano_id", { length: 500 }).notNull(),
	disciplina: varchar({ length: 255 }).notNull(),
	assunto: text().notNull(),
	tipo: mysqlEnum(['estudo','revisao','questoes']).notNull(),
	duracao: int().notNull(),
	incidencia: mysqlEnum(['baixa','media','alta']),
	prioridade: int().default(3).notNull(),
	ordem: int().notNull(),
	dicaEstudo: text("dica_estudo"),
	aulaId: int("aula_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	orientacaoEstudos: text("orientacao_estudos"),
	assuntoAgrupador: varchar("assunto_agrupador", { length: 255 }),
	sequenciaEara: int("sequencia_eara").default(1).notNull(),
	metaOrigemId: int("meta_origem_id"),
},
(table) => [
	index("idx_metas_plano_id").on(table.planoId),
	index("idx_metas_disciplina").on(table.disciplina),
	index("idx_metas_tipo").on(table.tipo),
	index("idx_metas_aula_id").on(table.aulaId),
	index("idx_metas_ordem").on(table.ordem),
	index("").on(table.planoId),
]);

export const metasQuestoes = mysqlTable("metas_questoes", {
	id: int().autoincrement().notNull(),
	metaId: int("meta_id").notNull(),
	questaoId: int("questao_id").notNull(),
	ordem: int().default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
},
(table) => [
	index("unique_meta_questao").on(table.metaId, table.questaoId),
]);

export const notificacoes = mysqlTable("notificacoes", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	tipo: mysqlEnum(['forum_resposta','forum_mencao','meta_vencendo','meta_atrasada','aula_nova','material_novo','aviso_geral','conquista','sistema']).notNull(),
	titulo: varchar({ length: 255 }).notNull(),
	mensagem: text().notNull(),
	link: varchar({ length: 500 }),
	lida: int().default(0).notNull(),
	metadata: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const passwordResetTokens = mysqlTable("password_reset_tokens", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	token: varchar({ length: 64 }).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("password_reset_tokens_token_unique").on(table.token),
]);

export const permissions = mysqlTable("permissions", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	module: varchar({ length: 50 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("permissions_name_unique").on(table.name),
]);

export const planos = mysqlTable("planos", {
	id: int().autoincrement().notNull(),
	nome: varchar({ length: 255 }).notNull(),
	descricao: text(),
	tipo: mysqlEnum(['pago','gratuito']).default('pago').notNull(),
	duracaoTotal: int("duracao_total").notNull(),
	concursoArea: varchar("concurso_area", { length: 255 }),
	ativo: int().default(1).notNull(),
	horasDiariasPadrao: int("horas_diarias_padrao").default(4).notNull(),
	diasEstudoPadrao: varchar("dias_estudo_padrao", { length: 50 }).default('1,2,3,4,5').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	orgao: varchar({ length: 255 }),
	cargo: varchar({ length: 255 }),
	createdBy: int("created_by"),
	mensagemPosPlano: text("mensagem_pos_plano"),
	linkPosPlano: varchar("link_pos_plano", { length: 500 }),
	exibirMensagemPosPlano: int("exibir_mensagem_pos_plano").default(0).notNull(),
	algoritmoEara: int("algoritmo_eara").default(1).notNull(),
	configuracaoEara: json("configuracao_eara"),
},
(table) => [
	index("idx_planos_ativo").on(table.ativo),
	index("idx_planos_tipo").on(table.tipo),
	index("idx_planos_orgao").on(table.orgao),
	index("idx_planos_cargo").on(table.cargo),
	index("").on(table.ativo),
]);

export const preferenciasNotificacoes = mysqlTable("preferencias_notificacoes", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	inappForumResposta: int("inapp_forum_resposta").default(1).notNull(),
	inappForumMencao: int("inapp_forum_mencao").default(1).notNull(),
	inappMetaVencendo: int("inapp_meta_vencendo").default(1).notNull(),
	inappMetaAtrasada: int("inapp_meta_atrasada").default(1).notNull(),
	inappAulaNova: int("inapp_aula_nova").default(1).notNull(),
	inappMaterialNovo: int("inapp_material_novo").default(1).notNull(),
	inappAvisoGeral: int("inapp_aviso_geral").default(1).notNull(),
	inappConquista: int("inapp_conquista").default(1).notNull(),
	emailForumResposta: int("email_forum_resposta").default(0).notNull(),
	emailForumMencao: int("email_forum_mencao").default(1).notNull(),
	emailMetaVencendo: int("email_meta_vencendo").default(1).notNull(),
	emailMetaAtrasada: int("email_meta_atrasada").default(1).notNull(),
	emailAulaNova: int("email_aula_nova").default(0).notNull(),
	emailMaterialNovo: int("email_material_novo").default(0).notNull(),
	emailAvisoGeral: int("email_aviso_geral").default(1).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("preferencias_notificacoes_user_id_unique").on(table.userId),
]);

export const progressoAulas = mysqlTable("progresso_aulas", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	aulaId: int("aula_id").notNull(),
	percentualAssistido: int("percentual_assistido").default(0).notNull(),
	concluida: int().default(0).notNull(),
	favoritada: int().default(0).notNull(),
	tempoAssistido: int("tempo_assistido").default(0).notNull(),
	ultimaPosicao: int("ultima_posicao").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("idx_progresso_aulas_user_id").on(table.userId),
	index("idx_progresso_aulas_aula_id").on(table.aulaId),
	index("idx_progresso_aulas_user_aula").on(table.userId, table.aulaId),
	index("").on(table.userId),
]);

export const progressoMetas = mysqlTable("progresso_metas", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	metaId: int("meta_id").notNull(),
	dataAgendada: timestamp("data_agendada", { mode: 'string' }).notNull(),
	concluida: int().default(0).notNull(),
	dataConclusao: timestamp("data_conclusao", { mode: 'string' }),
	tempoGasto: int("tempo_gasto").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	anotacao: text(),
	pulada: int().default(0).notNull(),
	dataPulada: timestamp("data_pulada", { mode: 'string' }),
	adiada: int().default(0).notNull(),
	dataAdiamento: timestamp("data_adiamento", { mode: 'string' }),
	cicloEara: varchar("ciclo_eara", { length: 50 }),
	desempenhoQuestoes: int("desempenho_questoes"),
	proximoCiclo: varchar("proximo_ciclo", { length: 50 }),
	dataProximoCiclo: timestamp("data_proximo_ciclo", { mode: 'string' }),
	questoesExternas: int("questoes_externas").default(0).notNull(),
	taxaAcertosExternas: int("taxa_acertos_externas"),
},
(table) => [
	index("idx_progresso_metas_user_id").on(table.userId),
	index("idx_progresso_metas_meta_id").on(table.metaId),
	index("idx_progresso_metas_concluida").on(table.concluida),
	index("idx_progresso_metas_user_meta").on(table.userId, table.metaId),
	index("idx_progresso_metas_data_agendada").on(table.dataAgendada),
	index("").on(table.userId),
]);

export const questoes = mysqlTable("questoes", {
	id: int().autoincrement().notNull(),
	tipo: mysqlEnum(['multipla_escolha','certo_errado']).default('multipla_escolha').notNull(),
	enunciado: text().notNull(),
	alternativas: text().notNull(),
	gabarito: varchar({ length: 10 }).notNull(),
	banca: varchar({ length: 255 }),
	entidade: varchar({ length: 255 }),
	cargo: varchar({ length: 255 }),
	ano: int(),
	disciplina: varchar({ length: 255 }).notNull(),
	assuntos: text(),
	nivelDificuldade: mysqlEnum("nivel_dificuldade", ['facil','medio','dificil']).default('medio').notNull(),
	comentario: text(),
	urlVideoResolucao: text("url_video_resolucao"),
	taxaAcerto: int("taxa_acerto").default(0).notNull(),
	totalResolucoes: int("total_resolucoes").default(0).notNull(),
	ativo: int().default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	textoMotivador: text("texto_motivador"),
},
(table) => [
	index("idx_questoes_disciplina").on(table.disciplina),
	index("").on(table.disciplina),
	index("idx_questoes_nivel_dificuldade").on(table.nivelDificuldade),
	index("idx_questoes_banca").on(table.banca),
	index("idx_questoes_ativo").on(table.ativo),
]);

export const questoesLixeira = mysqlTable("questoes_lixeira", {
	id: int().autoincrement().notNull(),
	conteudoOriginal: text("conteudo_original").notNull(),
	deletadoPor: int("deletado_por").notNull(),
	motivoDelecao: text("motivo_delecao"),
	deletadoEm: timestamp("deletado_em", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const questoesReportadas = mysqlTable("questoes_reportadas", {
	id: int().autoincrement().notNull(),
	questaoId: int("questao_id").notNull(),
	userId: int("user_id").notNull(),
	motivo: text().notNull(),
	status: mysqlEnum(['pendente','resolvido','invalido']).default('pendente').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const questoesRevisar = mysqlTable("questoes_revisar", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	questaoId: int("questao_id").notNull(),
	proximaRevisao: timestamp("proxima_revisao", { mode: 'string' }).notNull(),
	nivelDificuldadePercebida: int("nivel_dificuldade_percebida").default(3).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const respostasQuestoes = mysqlTable("respostas_questoes", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	questaoId: int("questao_id").notNull(),
	respostaAluno: varchar("resposta_aluno", { length: 1 }).notNull(),
	acertou: int().notNull(),
	tempoResposta: int("tempo_resposta").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("idx_respostas_questoes_user_id").on(table.userId),
	index("idx_respostas_questoes_questao_id").on(table.questaoId),
	index("").on(table.userId),
	index("idx_respostas_questoes_acertou").on(table.acertou),
	index("idx_respostas_questoes_user_questao").on(table.userId, table.questaoId),
	index("idx_respostas_questoes_created_at").on(table.createdAt),
]);

export const rolePermissions = mysqlTable("role_permissions", {
	id: int().autoincrement().notNull(),
	role: mysqlEnum(['aluno','professor','administrativo','mentor','master']).notNull(),
	permissionId: int("permission_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const sessions = mysqlTable("sessions", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	token: varchar({ length: 255 }).notNull(),
	ip: varchar({ length: 45 }),
	userAgent: text("user_agent"),
	lastActivity: timestamp("last_activity", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("sessions_token_unique").on(table.token),
]);

export const tokensCadastro = mysqlTable("tokens_cadastro", {
	id: int().autoincrement().notNull(),
	token: varchar({ length: 64 }).notNull(),
	status: mysqlEnum(['ativo','usado','expirado']).default('ativo').notNull(),
	criadoPor: int("criado_por").notNull(),
	usadoPor: int("usado_por"),
	dataGeracao: timestamp("data_geracao", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	dataUso: timestamp("data_uso", { mode: 'string' }),
	dataExpiracao: timestamp("data_expiracao", { mode: 'string' }),
	observacoes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("token").on(table.token),
]);

export const userConquistas = mysqlTable("userConquistas", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	conquistaId: int().notNull(),
	desbloqueadaEm: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	openId: varchar({ length: 64 }).notNull(),
	name: text(),
	email: varchar({ length: 320 }),
	loginMethod: varchar({ length: 64 }),
	role: mysqlEnum(['aluno','professor','administrativo','mentor','master']).default('aluno').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	lastSignedIn: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	pontos: int().default(0).notNull(),
	cpf: varchar({ length: 14 }),
	telefone: varchar({ length: 20 }),
	dataNascimento: varchar("data_nascimento", { length: 10 }),
	endereco: text(),
	foto: varchar({ length: 500 }),
	bio: text(),
	status: mysqlEnum(['ativo','inativo','suspenso']).default('ativo').notNull(),
	observacoes: text(),
	emailVerified: int("email_verified").default(0).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }),
},
(table) => [
	index("users_openId_unique").on(table.openId),
	index("users_cpf_unique").on(table.cpf),
	index("idx_users_role").on(table.role),
	index("idx_users_status").on(table.status),
	index("idx_users_email").on(table.email),
	index("").on(table.role),
]);
