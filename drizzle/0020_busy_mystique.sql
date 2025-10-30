CREATE TABLE `materiais` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`descricao` text,
	`tipo` enum('video','pdf','audio','documento') NOT NULL,
	`url` varchar(500) NOT NULL,
	`duracao` int,
	`tamanho` int,
	`disciplina` varchar(100),
	`assunto` varchar(255),
	`tags` text,
	`created_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `materiais_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metas_materiais` (
	`id` int AUTO_INCREMENT NOT NULL,
	`meta_id` int NOT NULL,
	`material_id` int NOT NULL,
	`ordem` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `metas_materiais_id` PRIMARY KEY(`id`)
);
