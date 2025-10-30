CREATE TABLE `notificacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`tipo` enum('forum_resposta','forum_mencao','meta_vencendo','meta_atrasada','aula_nova','material_novo','aviso_geral','conquista','sistema') NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`mensagem` text NOT NULL,
	`link` varchar(500),
	`lida` int NOT NULL DEFAULT 0,
	`metadata` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notificacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `preferencias_notificacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`inapp_forum_resposta` int NOT NULL DEFAULT 1,
	`inapp_forum_mencao` int NOT NULL DEFAULT 1,
	`inapp_meta_vencendo` int NOT NULL DEFAULT 1,
	`inapp_meta_atrasada` int NOT NULL DEFAULT 1,
	`inapp_aula_nova` int NOT NULL DEFAULT 1,
	`inapp_material_novo` int NOT NULL DEFAULT 1,
	`inapp_aviso_geral` int NOT NULL DEFAULT 1,
	`inapp_conquista` int NOT NULL DEFAULT 1,
	`email_forum_resposta` int NOT NULL DEFAULT 0,
	`email_forum_mencao` int NOT NULL DEFAULT 1,
	`email_meta_vencendo` int NOT NULL DEFAULT 1,
	`email_meta_atrasada` int NOT NULL DEFAULT 1,
	`email_aula_nova` int NOT NULL DEFAULT 0,
	`email_material_novo` int NOT NULL DEFAULT 0,
	`email_aviso_geral` int NOT NULL DEFAULT 1,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `preferencias_notificacoes_id` PRIMARY KEY(`id`),
	CONSTRAINT `preferencias_notificacoes_user_id_unique` UNIQUE(`user_id`)
);
