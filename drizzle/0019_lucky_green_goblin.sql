CREATE TABLE `bugs_reportados` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`descricao` text NOT NULL,
	`categoria` enum('interface','funcionalidade','performance','dados','mobile','outro') NOT NULL,
	`prioridade` enum('baixa','media','alta','critica') NOT NULL DEFAULT 'media',
	`status` enum('pendente','em_analise','resolvido','fechado') NOT NULL DEFAULT 'pendente',
	`screenshots` text,
	`pagina_url` varchar(500),
	`navegador` varchar(100),
	`resolucao` varchar(50),
	`observacoes_admin` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`resolvido_em` timestamp,
	`resolvido_por` int,
	CONSTRAINT `bugs_reportados_id` PRIMARY KEY(`id`)
);
