# 📝 Plano de Trabalho - Módulo de Questões

## 🎯 Objetivo
Finalizar o módulo de Questões com CRUD completo para administradores, filtros avançados, sistema de revisão inteligente e gamificação.

---

## 📊 Estado Atual

### ✅ O que JÁ EXISTE:
- **Schema completo:**
  - Tabela `questoes` (17 colunas) - enunciado, alternativas, gabarito, banca, concurso, ano, disciplina, assuntos, nível, comentário, vídeo resolução, taxa acerto, total resoluções
  - Tabela `respostas_questoes` (7 colunas) - userId, questaoId, resposta, acertou, tempo
  
- **Backend funcional:**
  - `list` - listar questões
  - `getById` - buscar questão por ID
  - `responder` - salvar resposta do aluno
  - `minhasRespostas` - histórico do aluno
  - `estatisticas` - estatísticas gerais
  - `estatisticasPorDisciplina` - desempenho por disciplina
  - `evolucaoTemporal` - evolução nos últimos N dias
  - `questoesMaisErradas` - questões com mais erros

### ❌ O que FALTA:

#### 1. CRUD Administrativo (Master/Administrativo)
- [ ] Criar questão
- [ ] Editar questão
- [ ] Deletar questão (mover para lixeira)
- [ ] Importar questões em lote (CSV/JSON)
- [ ] Duplicar questão

#### 2. Filtros e Busca Avançada
- [ ] Filtrar por disciplina
- [ ] Filtrar por banca
- [ ] Filtrar por concurso
- [ ] Filtrar por ano
- [ ] Filtrar por nível de dificuldade
- [ ] Filtrar por assunto (tags)
- [ ] Busca por texto no enunciado
- [ ] Combinar múltiplos filtros

#### 3. Sistema de Revisão Inteligente
- [ ] Algoritmo de espaçamento (Spaced Repetition)
- [ ] Priorizar questões erradas
- [ ] Sugerir questões baseadas no desempenho
- [ ] Modo "Simulado" (tempo cronometrado)
- [ ] Modo "Treino" (sem tempo)

#### 4. Gamificação e Engajamento
- [ ] Conquistas por marcos (10, 50, 100, 500 questões)
- [ ] Streak de dias consecutivos
- [ ] Ranking por disciplina
- [ ] Badges especiais (100% acerto em simulado, etc)

#### 5. Interface do Usuário
- [ ] Página de resolver questões (uma por vez)
- [ ] Feedback imediato (certo/errado)
- [ ] Mostrar comentário após responder
- [ ] Link para vídeo de resolução
- [ ] Navegação (próxima/anterior)
- [ ] Marcar para revisar depois
- [ ] Reportar erro na questão

#### 6. Painel Administrativo
- [ ] Listagem de questões com filtros
- [ ] Formulário de criar/editar
- [ ] Upload de imagens no enunciado
- [ ] Estatísticas gerais (total, por banca, por disciplina)
- [ ] Questões mais difíceis (menor taxa de acerto)
- [ ] Questões reportadas

---

## 📅 Cronograma (3 dias)

### Dia 1: CRUD Administrativo + Filtros (8h)
**Manhã (4h):**
- [ ] Criar procedures backend: `criarQuestao`, `editarQuestao`, `deletarQuestao`
- [ ] Adicionar validações (gabarito válido, alternativas mínimas, etc)
- [ ] Implementar lixeira de questões (similar ao fórum)

**Tarde (4h):**
- [ ] Criar procedures de filtros: `filtrarQuestoes` com parâmetros opcionais
- [ ] Implementar busca por texto (LIKE no enunciado)
- [ ] Criar painel admin frontend (listagem + formulário)

### Dia 2: Sistema de Revisão + Gamificação (8h)
**Manhã (4h):**
- [ ] Implementar algoritmo de espaçamento (calcular próxima revisão)
- [ ] Criar procedure `sugerirProximasQuestoes` (baseado em erros)
- [ ] Implementar modo simulado (timer + questões aleatórias)

**Tarde (4h):**
- [ ] Criar tabela `conquistas_questoes`
- [ ] Implementar sistema de badges
- [ ] Criar procedure `verificarConquistas` (chamado após responder)
- [ ] Adicionar streak de dias consecutivos

### Dia 3: Interface + Polimento (8h)
**Manhã (4h):**
- [ ] Criar página de resolver questões (`/questoes/resolver`)
- [ ] Implementar feedback visual (verde/vermelho)
- [ ] Mostrar comentário e vídeo após responder
- [ ] Navegação entre questões

**Tarde (4h):**
- [ ] Criar página de estatísticas detalhadas
- [ ] Implementar gráficos de evolução
- [ ] Adicionar botão "Reportar erro"
- [ ] Testes finais e ajustes

---

## 🔧 Detalhamento Técnico

### Schema Adicional Necessário

```sql
-- Lixeira de questões (similar ao fórum)
CREATE TABLE questoes_lixeira (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conteudo_original TEXT NOT NULL, -- JSON da questão
  deletado_por INT NOT NULL,
  motivo_delecao TEXT,
  deletado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conquistas de questões
CREATE TABLE conquistas_questoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- '10_questoes', '50_questoes', 'streak_7_dias', etc
  data_conquista TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (user_id, tipo)
);

-- Questões marcadas para revisar
CREATE TABLE questoes_revisar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  questao_id INT NOT NULL,
  proxima_revisao TIMESTAMP NOT NULL,
  nivel_dificuldade_percebida INT DEFAULT 3, -- 1-5
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (user_id, questao_id)
);

-- Erros reportados
CREATE TABLE questoes_reportadas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  questao_id INT NOT NULL,
  user_id INT NOT NULL,
  motivo TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente', -- pendente, resolvido, invalido
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Procedures Backend (Resumo)

**CRUD:**
- `admin.criarQuestao(data)` - validar + inserir
- `admin.editarQuestao(id, data)` - atualizar
- `admin.deletarQuestao(id, motivo)` - mover para lixeira
- `admin.listarLixeiraQuestoes()` - apenas Master
- `admin.recuperarQuestao(id)` - restaurar da lixeira
- `admin.importarQuestoes(arquivo)` - upload CSV/JSON

**Filtros:**
- `filtrarQuestoes({ disciplina?, banca?, concurso?, ano?, nivel?, assuntos?, texto? })`

**Revisão:**
- `sugerirProximasQuestoes(userId, quantidade)` - algoritmo inteligente
- `marcarParaRevisar(userId, questaoId, dificuldade)`
- `getQuestoesParaRevisar(userId)`

**Gamificação:**
- `verificarConquistas(userId)` - após responder
- `getConquistas(userId)`
- `getRankingDisciplina(disciplina, limit)`

**Reportar:**
- `reportarErro(questaoId, userId, motivo)`
- `admin.getQuestoesReportadas()`
- `admin.resolverReporte(id, acao)` - marcar como resolvido/inválido

---

## 🎨 Interface (Wireframes Conceituais)

### Página de Resolver Questões
```
┌─────────────────────────────────────────┐
│ Questão 5/20 | Disciplina: Dir. Const. │
│ ⏱️ 00:45 (modo simulado)                │
├─────────────────────────────────────────┤
│ ENUNCIADO:                              │
│ Lorem ipsum dolor sit amet...           │
│                                         │
│ ○ A) Alternativa A                      │
│ ○ B) Alternativa B                      │
│ ○ C) Alternativa C                      │
│ ○ D) Alternativa D                      │
│ ○ E) Alternativa E                      │
│                                         │
│ [🚩 Marcar para Revisar] [⚠️ Reportar] │
│                                         │
│ [← Anterior]  [Responder]  [Próxima →] │
└─────────────────────────────────────────┘
```

### Painel Admin - Listagem
```
┌─────────────────────────────────────────┐
│ 🔍 Buscar: [__________] [Filtros ▼]    │
│ [+ Nova Questão] [📥 Importar]          │
├─────────────────────────────────────────┤
│ ID | Disciplina | Banca | Ano | Taxa   │
│ 1  | Dir. Const | CESPE | 2023 | 75%   │
│ 2  | Dir. Admin | FCC   | 2022 | 60%   │
│ 3  | Port.      | FGV   | 2023 | 85%   │
│ ...                                     │
└─────────────────────────────────────────┘
```

---

## ✅ Critérios de Aceitação

1. **CRUD funcional** - Admin pode criar, editar e deletar questões
2. **Filtros funcionam** - Combinar múltiplos filtros retorna resultados corretos
3. **Revisão inteligente** - Sistema sugere questões baseado em erros
4. **Gamificação ativa** - Conquistas são desbloqueadas automaticamente
5. **Interface responsiva** - Funciona em mobile e desktop
6. **Performance** - Listagem de 1000+ questões carrega em <2s
7. **Auditoria** - Questões deletadas vão para lixeira (recuperáveis)

---

## 🚀 Entregáveis Finais

1. Backend completo com todos os procedures
2. Painel administrativo funcional
3. Página de resolver questões com feedback
4. Sistema de gamificação ativo
5. Documentação de uso (userGuide.md atualizado)
6. Testes básicos de fluxo completo

---

**Status:** Pronto para iniciar 🎯
**Próximo passo:** Criar tabelas adicionais e implementar CRUD administrativo
