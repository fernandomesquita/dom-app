CREATE TABLE `anotacoes_aulas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`aula_id` int NOT NULL,
	`timestamp` int NOT NULL,
	`conteudo` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `anotacoes_aulas_id` PRIMARY KEY(`id`)
);
