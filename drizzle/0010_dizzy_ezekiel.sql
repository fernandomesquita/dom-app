CREATE TABLE `materiais` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`descricao` text,
	`url_arquivo` text NOT NULL,
	`tipo_arquivo` varchar(50) NOT NULL DEFAULT 'application/pdf',
	`tamanho_bytes` int,
	`meta_id` int,
	`disciplina` varchar(255),
	`uploaded_by` int NOT NULL,
	`ativo` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `materiais_id` PRIMARY KEY(`id`)
);
