CREATE TABLE `tokens_cadastro` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(64) NOT NULL,
	`status` enum('ativo','usado','expirado') NOT NULL DEFAULT 'ativo',
	`criado_por` int NOT NULL,
	`usado_por` int,
	`data_geracao` timestamp NOT NULL DEFAULT (now()),
	`data_uso` timestamp,
	`data_expiracao` timestamp,
	`observacoes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tokens_cadastro_id` PRIMARY KEY(`id`),
	CONSTRAINT `tokens_cadastro_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `questoes` ADD `texto_motivador` text;