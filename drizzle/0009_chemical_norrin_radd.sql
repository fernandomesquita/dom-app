ALTER TABLE `users` ADD `cpf` varchar(14);--> statement-breakpoint
ALTER TABLE `users` ADD `telefone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `data_nascimento` varchar(10);--> statement-breakpoint
ALTER TABLE `users` ADD `endereco` text;--> statement-breakpoint
ALTER TABLE `users` ADD `foto` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `status` enum('ativo','inativo','suspenso') DEFAULT 'ativo' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `observacoes` text;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_cpf_unique` UNIQUE(`cpf`);