-- Migration: Adicionar índices para otimização de performance
-- Data: 2025-10-30
-- Descrição: Índices em campos frequentemente consultados para melhorar performance de queries

-- Índices na tabela users
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Índices na tabela planos
CREATE INDEX IF NOT EXISTS idx_planos_ativo ON planos(ativo);
CREATE INDEX IF NOT EXISTS idx_planos_tipo ON planos(tipo);
CREATE INDEX IF NOT EXISTS idx_planos_orgao ON planos(orgao);
CREATE INDEX IF NOT EXISTS idx_planos_cargo ON planos(cargo);

-- Índices na tabela matriculas
CREATE INDEX IF NOT EXISTS idx_matriculas_user_id ON matriculas(user_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_plano_id ON matriculas(plano_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_ativo ON matriculas(ativo);
CREATE INDEX IF NOT EXISTS idx_matriculas_user_plano ON matriculas(user_id, plano_id); -- índice composto

-- Índices na tabela metas
CREATE INDEX IF NOT EXISTS idx_metas_plano_id ON metas(plano_id);
CREATE INDEX IF NOT EXISTS idx_metas_disciplina ON metas(disciplina);
CREATE INDEX IF NOT EXISTS idx_metas_tipo ON metas(tipo);
CREATE INDEX IF NOT EXISTS idx_metas_aula_id ON metas(aula_id);
CREATE INDEX IF NOT EXISTS idx_metas_ordem ON metas(ordem);

-- Índices na tabela progresso_metas
CREATE INDEX IF NOT EXISTS idx_progresso_metas_user_id ON progresso_metas(user_id);
CREATE INDEX IF NOT EXISTS idx_progresso_metas_meta_id ON progresso_metas(meta_id);
CREATE INDEX IF NOT EXISTS idx_progresso_metas_concluida ON progresso_metas(concluida);
CREATE INDEX IF NOT EXISTS idx_progresso_metas_user_meta ON progresso_metas(user_id, meta_id); -- índice composto
CREATE INDEX IF NOT EXISTS idx_progresso_metas_data_agendada ON progresso_metas(data_agendada);

-- Índices na tabela aulas
CREATE INDEX IF NOT EXISTS idx_aulas_disciplina ON aulas(disciplina);
CREATE INDEX IF NOT EXISTS idx_aulas_tipo_conteudo ON aulas(tipo_conteudo);
CREATE INDEX IF NOT EXISTS idx_aulas_ativo ON aulas(ativo);

-- Índices na tabela progresso_aulas
CREATE INDEX IF NOT EXISTS idx_progresso_aulas_user_id ON progresso_aulas(user_id);
CREATE INDEX IF NOT EXISTS idx_progresso_aulas_aula_id ON progresso_aulas(aula_id);
CREATE INDEX IF NOT EXISTS idx_progresso_aulas_user_aula ON progresso_aulas(user_id, aula_id); -- índice composto

-- Índices na tabela questoes
CREATE INDEX IF NOT EXISTS idx_questoes_disciplina ON questoes(disciplina);
CREATE INDEX IF NOT EXISTS idx_questoes_nivel_dificuldade ON questoes(nivel_dificuldade);
CREATE INDEX IF NOT EXISTS idx_questoes_banca ON questoes(banca);
CREATE INDEX IF NOT EXISTS idx_questoes_ativo ON questoes(ativo);

-- Índices na tabela respostas_questoes
CREATE INDEX IF NOT EXISTS idx_respostas_questoes_user_id ON respostas_questoes(user_id);
CREATE INDEX IF NOT EXISTS idx_respostas_questoes_questao_id ON respostas_questoes(questao_id);
CREATE INDEX IF NOT EXISTS idx_respostas_questoes_acertou ON respostas_questoes(acertou);
CREATE INDEX IF NOT EXISTS idx_respostas_questoes_user_questao ON respostas_questoes(user_id, questao_id); -- índice composto
CREATE INDEX IF NOT EXISTS idx_respostas_questoes_created_at ON respostas_questoes(created_at);

-- Índices na tabela forum_topicos
CREATE INDEX IF NOT EXISTS idx_forum_topicos_autor_id ON forum_topicos(autor_id);
CREATE INDEX IF NOT EXISTS idx_forum_topicos_fixado ON forum_topicos(fixado);
CREATE INDEX IF NOT EXISTS idx_forum_topicos_fechado ON forum_topicos(fechado);
CREATE INDEX IF NOT EXISTS idx_forum_topicos_created_at ON forum_topicos(created_at);

-- Índices na tabela forum_respostas
CREATE INDEX IF NOT EXISTS idx_forum_respostas_topico_id ON forum_respostas(topico_id);
CREATE INDEX IF NOT EXISTS idx_forum_respostas_autor_id ON forum_respostas(autor_id);
CREATE INDEX IF NOT EXISTS idx_forum_respostas_melhor_resposta ON forum_respostas(melhor_resposta);

-- Índices na tabela avisos
CREATE INDEX IF NOT EXISTS idx_avisos_tipo ON avisos(tipo);
CREATE INDEX IF NOT EXISTS idx_avisos_ativo ON avisos(ativo);
CREATE INDEX IF NOT EXISTS idx_avisos_created_at ON avisos(created_at);

-- Índices na tabela notificacoes
CREATE INDEX IF NOT EXISTS idx_notificacoes_user_id ON notificacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_tipo ON notificacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_notificacoes_created_at ON notificacoes(created_at);

-- Índices na tabela bugs_reportados
CREATE INDEX IF NOT EXISTS idx_bugs_reportados_user_id ON bugs_reportados(user_id);
CREATE INDEX IF NOT EXISTS idx_bugs_reportados_status ON bugs_reportados(status);
CREATE INDEX IF NOT EXISTS idx_bugs_reportados_prioridade ON bugs_reportados(prioridade);
CREATE INDEX IF NOT EXISTS idx_bugs_reportados_categoria ON bugs_reportados(categoria);
