CREATE TABLE `config_funcionalidades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questoes_habilitado` int NOT NULL DEFAULT 1,
	`forum_habilitado` int NOT NULL DEFAULT 1,
	`materiais_habilitado` int NOT NULL DEFAULT 1,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `config_funcionalidades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forum_mensagens_retidas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipo` enum('topico','resposta') NOT NULL,
	`topico_id` int,
	`resposta_id` int,
	`autor_id` int NOT NULL,
	`conteudo` text NOT NULL,
	`links_detectados` text NOT NULL,
	`status` enum('pendente','aprovado','rejeitado') NOT NULL DEFAULT 'pendente',
	`revisado_por` int,
	`revisado_em` timestamp,
	`motivo_rejeicao` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `forum_mensagens_retidas_id` PRIMARY KEY(`id`)
);
