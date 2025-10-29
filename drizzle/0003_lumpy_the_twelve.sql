CREATE TABLE `conquistas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`descricao` text,
	`icone` varchar(50),
	`pontosRequeridos` int,
	`tipo` enum('meta','aula','questao','sequencia','especial') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conquistas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userConquistas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`conquistaId` int NOT NULL,
	`desbloqueadaEm` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userConquistas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `pontos` int DEFAULT 0 NOT NULL;