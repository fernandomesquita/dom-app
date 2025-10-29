CREATE TABLE `aulas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(500) NOT NULL,
	`descricao` text,
	`professor_id` int,
	`disciplina` varchar(255) NOT NULL,
	`assunto_nivel1` varchar(255),
	`assunto_nivel2` varchar(255),
	`assunto_nivel3` varchar(255),
	`concurso_area` varchar(255),
	`duracao` int NOT NULL DEFAULT 0,
	`tipo_conteudo` enum('videoaula','pdf','audio','slides','questoes','mapa_mental','legislacao') NOT NULL DEFAULT 'videoaula',
	`url_video` text,
	`url_material` text,
	`conteudo_html` text,
	`tags` text,
	`nivel_dificuldade` enum('basico','intermediario','avancado') NOT NULL DEFAULT 'basico',
	`visualizacoes` int NOT NULL DEFAULT 0,
	`ativo` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aulas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `avisos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(500) NOT NULL,
	`conteudo` text NOT NULL,
	`tipo` enum('normal','urgente','individual') NOT NULL DEFAULT 'normal',
	`plano_id` int,
	`user_id` int,
	`criado_por` int NOT NULL,
	`ativo` int NOT NULL DEFAULT 1,
	`data_agendamento` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `avisos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `avisos_dispensados` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`aviso_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `avisos_dispensados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forum_respostas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`topico_id` int NOT NULL,
	`user_id` int NOT NULL,
	`conteudo` text NOT NULL,
	`resposta_pai_id` int,
	`solucao` int NOT NULL DEFAULT 0,
	`votos` int NOT NULL DEFAULT 0,
	`curtidas` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `forum_respostas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forum_topicos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`titulo` varchar(500) NOT NULL,
	`conteudo` text NOT NULL,
	`categoria` varchar(255),
	`tags` text,
	`aula_id` int,
	`meta_id` int,
	`resolvido` int NOT NULL DEFAULT 0,
	`fixado` int NOT NULL DEFAULT 0,
	`fechado` int NOT NULL DEFAULT 0,
	`visualizacoes` int NOT NULL DEFAULT 0,
	`curtidas` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `forum_topicos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matriculas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`plano_id` int NOT NULL,
	`data_inicio` timestamp NOT NULL DEFAULT (now()),
	`data_termino` timestamp NOT NULL,
	`horas_diarias` int NOT NULL DEFAULT 4,
	`dias_estudo` varchar(50) NOT NULL DEFAULT '1,2,3,4,5',
	`ativo` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `matriculas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plano_id` int NOT NULL,
	`disciplina` varchar(255) NOT NULL,
	`assunto` text NOT NULL,
	`tipo` enum('estudo','revisao','questoes') NOT NULL,
	`duracao` int NOT NULL,
	`incidencia` enum('baixa','media','alta'),
	`prioridade` int NOT NULL DEFAULT 3,
	`ordem` int NOT NULL,
	`dica_estudo` text,
	`aula_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `metas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`descricao` text,
	`tipo` enum('pago','gratuito') NOT NULL DEFAULT 'pago',
	`duracao_total` int NOT NULL,
	`concurso_area` varchar(255),
	`ativo` int NOT NULL DEFAULT 1,
	`horas_diarias_padrao` int NOT NULL DEFAULT 4,
	`dias_estudo_padrao` varchar(50) NOT NULL DEFAULT '1,2,3,4,5',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `planos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progresso_aulas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`aula_id` int NOT NULL,
	`percentual_assistido` int NOT NULL DEFAULT 0,
	`concluida` int NOT NULL DEFAULT 0,
	`favoritada` int NOT NULL DEFAULT 0,
	`tempo_assistido` int NOT NULL DEFAULT 0,
	`ultima_posicao` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `progresso_aulas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progresso_metas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`meta_id` int NOT NULL,
	`data_agendada` timestamp NOT NULL,
	`concluida` int NOT NULL DEFAULT 0,
	`data_conclusao` timestamp,
	`tempo_gasto` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `progresso_metas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enunciado` text NOT NULL,
	`alternativas` text NOT NULL,
	`gabarito` varchar(1) NOT NULL,
	`banca` varchar(255),
	`concurso` varchar(255),
	`ano` int,
	`disciplina` varchar(255) NOT NULL,
	`assuntos` text,
	`nivel_dificuldade` enum('facil','medio','dificil') NOT NULL DEFAULT 'medio',
	`comentario` text,
	`url_video_resolucao` text,
	`taxa_acerto` int NOT NULL DEFAULT 0,
	`total_resolucoes` int NOT NULL DEFAULT 0,
	`ativo` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `respostas_questoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`questao_id` int NOT NULL,
	`resposta_aluno` varchar(1) NOT NULL,
	`acertou` int NOT NULL,
	`tempo_resposta` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `respostas_questoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('aluno','professor','administrativo','mentor','master') NOT NULL DEFAULT 'aluno';