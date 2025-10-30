ALTER TABLE `metas` ADD `assunto_agrupador` varchar(255);--> statement-breakpoint
ALTER TABLE `metas` ADD `sequencia_eara` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `metas` ADD `meta_origem_id` int;--> statement-breakpoint
ALTER TABLE `planos` ADD `algoritmo_eara` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `planos` ADD `configuracao_eara` json;--> statement-breakpoint
ALTER TABLE `progresso_metas` ADD `ciclo_eara` varchar(50);--> statement-breakpoint
ALTER TABLE `progresso_metas` ADD `desempenho_questoes` int;--> statement-breakpoint
ALTER TABLE `progresso_metas` ADD `proximo_ciclo` varchar(50);--> statement-breakpoint
ALTER TABLE `progresso_metas` ADD `data_proximo_ciclo` timestamp;