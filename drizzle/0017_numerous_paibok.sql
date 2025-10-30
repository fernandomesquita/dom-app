CREATE TABLE `forum_lixeira` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipo` enum('topico','resposta') NOT NULL,
	`conteudo_original` text NOT NULL,
	`autor_id` int NOT NULL,
	`deletado_por` int NOT NULL,
	`motivo_delecao` text,
	`deletado_em` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `forum_lixeira_id` PRIMARY KEY(`id`)
);
