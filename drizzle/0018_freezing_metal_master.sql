CREATE TABLE `conquistas_questoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`tipo` varchar(50) NOT NULL,
	`data_conquista` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conquistas_questoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questoes_lixeira` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conteudo_original` text NOT NULL,
	`deletado_por` int NOT NULL,
	`motivo_delecao` text,
	`deletado_em` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `questoes_lixeira_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questoes_reportadas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questao_id` int NOT NULL,
	`user_id` int NOT NULL,
	`motivo` text NOT NULL,
	`status` enum('pendente','resolvido','invalido') NOT NULL DEFAULT 'pendente',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `questoes_reportadas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questoes_revisar` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`questao_id` int NOT NULL,
	`proxima_revisao` timestamp NOT NULL,
	`nivel_dificuldade_percebida` int NOT NULL DEFAULT 3,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `questoes_revisar_id` PRIMARY KEY(`id`)
);
