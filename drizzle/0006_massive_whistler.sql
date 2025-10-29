ALTER TABLE `planos` ADD `mensagem_pos_plano` text;--> statement-breakpoint
ALTER TABLE `planos` ADD `link_pos_plano` varchar(500);--> statement-breakpoint
ALTER TABLE `planos` ADD `exibir_mensagem_pos_plano` int DEFAULT 0 NOT NULL;