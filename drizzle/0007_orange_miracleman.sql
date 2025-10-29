CREATE TABLE `forum_notificacoes_lidas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`resposta_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `forum_notificacoes_lidas_id` PRIMARY KEY(`id`)
);
