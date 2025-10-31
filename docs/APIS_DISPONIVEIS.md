# 📡 APIs Disponíveis - DOM-APP

**Documentação Completa das Rotas tRPC**  
**Versão:** 1.0.0  
**Data:** 31 de outubro de 2025

---

## 📋 **Índice**

1. [Autenticação](#autenticação)
2. [Gamificação](#gamificação)
3. [Planos](#planos)
4. [Metas](#metas)
5. [Aulas](#aulas)
6. [Questões](#questões)
7. [Fórum](#fórum)
8. [Notificações](#notificações)
9. [Dashboard](#dashboard)
10. [Matrículas](#matrículas)
11. [Materiais](#materiais)
12. [Avisos](#avisos)
13. [Administração](#administração)
14. [Bugs](#bugs)
15. [Estatísticas](#estatísticas)

---

## 🔐 **Autenticação**

### **`authentication.me`**
**Tipo:** Query (público)  
**Descrição:** Retorna informações do usuário autenticado  
**Parâmetros:** Nenhum  
**Retorno:** `User | null`

**Exemplo:**
```typescript
const { data: user } = trpc.authentication.me.useQuery();
```

---

### **`authentication.logout`**
**Tipo:** Mutation (público)  
**Descrição:** Realiza logout do usuário  
**Parâmetros:** Nenhum  
**Retorno:** `{ success: boolean }`

**Exemplo:**
```typescript
const logout = trpc.authentication.logout.useMutation();
logout.mutate();
```

---

### **`authentication.register`**
**Tipo:** Mutation (público)  
**Descrição:** Registra novo usuário  
**Parâmetros:**
```typescript
{
  nome: string;          // min 3 caracteres
  email: string;         // email válido
  cpf: string;           // min 11 caracteres
  telefone: string;      // min 10 caracteres
  dataNascimento?: string;
  password?: string;     // min 8 caracteres
  aceitouTermos: boolean; // obrigatório true
}
```
**Retorno:** `{ success: boolean, userId: number, verificationToken: string }`

**Exemplo:**
```typescript
const register = trpc.authentication.register.useMutation();
register.mutate({
  nome: "João Silva",
  email: "joao@example.com",
  cpf: "12345678900",
  telefone: "11999999999",
  password: "senha123",
  aceitouTermos: true,
});
```

---

### **`authentication.verifyEmail`**
**Tipo:** Mutation (público)  
**Descrição:** Verifica email do usuário  
**Parâmetros:** `{ token: string }`  
**Retorno:** `{ success: boolean }`

---

### **`authentication.forgotPassword`**
**Tipo:** Mutation (público)  
**Descrição:** Solicita reset de senha  
**Parâmetros:** `{ email: string }`  
**Retorno:** `{ success: boolean, token: string }`

---

### **`authentication.resetPassword`**
**Tipo:** Mutation (público)  
**Descrição:** Reseta senha com token  
**Parâmetros:** `{ token: string, newPassword: string }`  
**Retorno:** `{ success: boolean }`

---

### **`authentication.loginWithPassword`**
**Tipo:** Mutation (público)  
**Descrição:** Login com email e senha  
**Parâmetros:** `{ email: string, password: string }`  
**Retorno:** `{ success: boolean, user: User }`

---

### **`authentication.updateProfile`**
**Tipo:** Mutation (protegido)  
**Descrição:** Atualiza perfil do usuário  
**Parâmetros:**
```typescript
{
  name?: string;
  telefone?: string;
  dataNascimento?: string;
  endereco?: string;
  foto?: string;
  bio?: string;
}
```
**Retorno:** `{ success: boolean }`

---

## 🎮 **Gamificação**

### **`gamificacao.meusPontos`**
**Tipo:** Query (protegido)  
**Descrição:** Retorna pontos do usuário  
**Parâmetros:** Nenhum  
**Retorno:** `{ pontos: number }`

**Exemplo:**
```typescript
const { data } = trpc.gamificacao.meusPontos.useQuery();
console.log(data?.pontos); // 150
```

---

### **`gamificacao.ranking`**
**Tipo:** Query (público)  
**Descrição:** Retorna ranking geral  
**Parâmetros:** Nenhum  
**Retorno:** `Array<{ id: number, name: string, pontos: number }>`

**Exemplo:**
```typescript
const { data: ranking } = trpc.gamificacao.ranking.useQuery();
```

---

### **`gamificacao.minhasConquistas`**
**Tipo:** Query (protegido)  
**Descrição:** Retorna conquistas do usuário  
**Parâmetros:** Nenhum  
**Retorno:** `Array<Conquista>`

**Exemplo:**
```typescript
const { data: conquistas } = trpc.gamificacao.minhasConquistas.useQuery();
```

---

## 📚 **Planos**

### **`planos.list`**
**Tipo:** Query (público)  
**Descrição:** Lista todos os planos ativos  
**Parâmetros:** Nenhum  
**Retorno:** `Array<Plano>`

---

### **`planos.getById`**
**Tipo:** Query (público)  
**Descrição:** Busca plano por ID  
**Parâmetros:** `{ id: number }`  
**Retorno:** `Plano | null`

---

### **`planos.create`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Cria novo plano  
**Parâmetros:**
```typescript
{
  nome: string;
  descricao: string;
  duracaoTotal: number;        // em dias
  tipo?: "pago" | "gratuito";
  orgao?: string;
  cargo?: string;
  horasDiariasPadrao?: number;
  diasEstudoPadrao?: string;   // "1,2,3,4,5"
}
```
**Retorno:** `{ success: boolean, planoId: number }`

---

### **`planos.importarPlanilha`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Importa plano via planilha Excel/CSV  
**Parâmetros:**
```typescript
{
  dados: {
    nomePlano: string;
    descricaoPlano?: string;
    metas: Array<{
      disciplina: string;
      assunto: string;
      tipo: "estudo" | "revisao" | "questoes";
      duracao: number;
      incidencia: "alta" | "media" | "baixa" | null;
      ordem: number;
    }>;
  }
}
```
**Retorno:** `{ success: boolean, planoId: number }`

---

### **`planos.admin.listAll`**
**Tipo:** Query (protegido - master/mentor/administrativo)  
**Descrição:** Lista todos os planos (incluindo inativos)  
**Parâmetros:** Nenhum  
**Retorno:** `Array<Plano>`

---

### **`planos.admin.update`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Atualiza plano existente  
**Parâmetros:**
```typescript
{
  id: number;
  nome?: string;
  descricao?: string;
  tipo?: "pago" | "gratuito";
  duracaoTotal?: number;
  orgao?: string;
  cargo?: string;
  horasDiariasPadrao?: number;
  exibirMensagemPosPlano?: boolean;
  mensagemPosPlano?: string;
  linkPosPlano?: string;
}
```
**Retorno:** `{ success: boolean }`

---

### **`planos.admin.delete`**
**Tipo:** Mutation (protegido - master/mentor)  
**Descrição:** Deleta plano  
**Parâmetros:** `{ id: number }`  
**Retorno:** `{ success: boolean }`

---

### **`planos.admin.toggleAtivo`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Ativa/desativa plano  
**Parâmetros:** `{ id: number }`  
**Retorno:** `{ success: boolean }`

---

### **`planos.admin.getComEstatisticas`**
**Tipo:** Query (protegido - master/mentor/administrativo)  
**Descrição:** Busca plano com estatísticas  
**Parâmetros:** `{ id: number }`  
**Retorno:**
```typescript
{
  plano: Plano;
  totalAlunos: number;
  totalMetas: number;
  criador: string;
}
```

---

### **`planos.admin.engajamento`**
**Tipo:** Query (protegido - master/mentor/administrativo)  
**Descrição:** Calcula engajamento do plano  
**Parâmetros:** `{ planoId: number }`  
**Retorno:**
```typescript
{
  totalAlunos: number;
  progressoMedio: number;
  taxaConclusao: number;
  taxaRetorno: number;
  metaMaiorAbandono: {
    metaId: number;
    assunto: string;
    taxaConclusao: number;
  };
  metasPorConclusao: Array<{
    metaId: number;
    assunto: string;
    taxaConclusao: number;
  }>;
}
```

---

## 🎯 **Metas**

### **`metas.minhasMetas`**
**Tipo:** Query (protegido)  
**Descrição:** Retorna metas do plano do usuário  
**Parâmetros:** Nenhum  
**Retorno:** `Array<Meta>`

**Exemplo:**
```typescript
const { data: metas } = trpc.metas.minhasMetas.useQuery();
```

---

### **`metas.create`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Cria nova meta  
**Parâmetros:**
```typescript
{
  planoId: string;           // IDs separados por vírgula
  disciplina: string;        // min 3 caracteres
  assunto: string;           // min 3 caracteres
  tipo: "estudo" | "revisao" | "questoes";
  duracao: number;           // 15-240 minutos
  incidencia?: "alta" | "media" | "baixa";
  ordem?: number;
  dicaEstudo?: string;
  orientacaoEstudos?: string; // HTML rich text
  aulaId?: number;
}
```
**Retorno:** `{ success: boolean, metaId: number }`

---

### **`metas.update`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Atualiza meta existente  
**Parâmetros:** (mesmos de create + `id: number`)  
**Retorno:** `{ success: boolean }`

---

### **`metas.delete`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Deleta meta  
**Parâmetros:** `{ id: number }`  
**Retorno:** `{ success: boolean }`

---

### **`metas.concluir`**
**Tipo:** Mutation (protegido)  
**Descrição:** Marca meta como concluída  
**Parâmetros:**
```typescript
{
  metaId: number;
  tempoDedicado: number; // em minutos
}
```
**Retorno:**
```typescript
{
  success: boolean;
  conquistasDesbloqueadas: Array<{
    id: number;
    nome: string;
    descricao: string;
    icone: string;
  }>;
}
```

**Exemplo:**
```typescript
const concluirMeta = trpc.metas.concluir.useMutation({
  onSuccess: (data) => {
    if (data.conquistasDesbloqueadas.length > 0) {
      // Exibir toast de conquista
      mostrarConquistas(data.conquistasDesbloqueadas);
    }
  }
});

concluirMeta.mutate({
  metaId: 123,
  tempoDedicado: 60,
});
```

---

### **`metas.salvarAnotacao`**
**Tipo:** Mutation (protegido)  
**Descrição:** Salva anotação pessoal na meta  
**Parâmetros:**
```typescript
{
  metaId: number;
  anotacao: string;
}
```
**Retorno:** `{ success: boolean }`

---

### **`metas.minhasAnotacoes`**
**Tipo:** Query (protegido)  
**Descrição:** Lista metas com anotações  
**Parâmetros:** Nenhum  
**Retorno:** `Array<Meta & { anotacao: string }>`

---

### **`metas.redistribuir`**
**Tipo:** Mutation (protegido)  
**Descrição:** Redistribui metas no cronograma  
**Parâmetros:**
```typescript
{
  horasDiarias: number;      // 1-12
  diasSemana: Array<number>; // [1,2,3,4,5]
}
```
**Retorno:** `{ success: boolean }`

---

### **`metas.atualizarConfiguracoes`**
**Tipo:** Mutation (protegido)  
**Descrição:** Atualiza configurações de cronograma  
**Parâmetros:**
```typescript
{
  horasDiarias: number;
  diasSemana: string; // "1,2,3,4,5"
}
```
**Retorno:** `{ success: boolean }`

---

### **`metas.moverParaCima`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Move meta para cima na ordem  
**Parâmetros:** `{ metaId: number }`  
**Retorno:** `{ success: boolean }`

---

### **`metas.moverParaBaixo`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Move meta para baixo na ordem  
**Parâmetros:** `{ metaId: number }`  
**Retorno:** `{ success: boolean }`

---

### **`metas.vincularQuestoes`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Vincula questões a uma meta  
**Parâmetros:**
```typescript
{
  metaId: number;
  questoesIds: Array<number>;
}
```
**Retorno:** `{ success: boolean }`

---

### **`metas.getQuestoes`**
**Tipo:** Query (protegido)  
**Descrição:** Busca questões vinculadas a uma meta  
**Parâmetros:** `{ metaId: number }`  
**Retorno:** `Array<Questao>`

---

## 🎬 **Aulas**

### **`aulas.list`**
**Tipo:** Query (público)  
**Descrição:** Lista todas as aulas  
**Parâmetros:** Nenhum  
**Retorno:** `Array<Aula>`

---

### **`aulas.getById`**
**Tipo:** Query (público)  
**Descrição:** Busca aula por ID  
**Parâmetros:** `{ id: number }`  
**Retorno:** `Aula | null`

---

### **`aulas.marcarConcluida`**
**Tipo:** Mutation (protegido)  
**Descrição:** Marca aula como assistida  
**Parâmetros:** `{ aulaId: number }`  
**Retorno:**
```typescript
{
  success: boolean;
  conquistasDesbloqueadas: Array<Conquista>;
}
```

---

### **`aulas.salvarProgresso`**
**Tipo:** Mutation (protegido)  
**Descrição:** Salva progresso de visualização  
**Parâmetros:**
```typescript
{
  aulaId: number;
  posicao: number;        // em segundos
  percentualAssistido: number; // 0-100
}
```
**Retorno:** `{ success: boolean }`

---

### **`aulas.meusProgressos`**
**Tipo:** Query (protegido)  
**Descrição:** Lista progresso do usuário  
**Parâmetros:** Nenhum  
**Retorno:** `Array<ProgressoAula>`

---

### **`aulas.criarAnotacao`**
**Tipo:** Mutation (protegido)  
**Descrição:** Cria anotação com timestamp  
**Parâmetros:**
```typescript
{
  aulaId: number;
  timestamp: number;  // em segundos
  conteudo: string;
}
```
**Retorno:** `{ success: boolean, anotacaoId: number }`

---

### **`aulas.listarAnotacoes`**
**Tipo:** Query (protegido)  
**Descrição:** Lista anotações de uma aula  
**Parâmetros:** `{ aulaId: number }`  
**Retorno:** `Array<AnotacaoAula>`

---

### **`aulas.deletarAnotacao`**
**Tipo:** Mutation (protegido)  
**Descrição:** Deleta anotação (apenas dono)  
**Parâmetros:** `{ anotacaoId: number }`  
**Retorno:** `{ success: boolean }`

---

### **`aulas.editarAnotacao`**
**Tipo:** Mutation (protegido)  
**Descrição:** Edita conteúdo da anotação  
**Parâmetros:**
```typescript
{
  anotacaoId: number;
  conteudo: string;
}
```
**Retorno:** `{ success: boolean }`

---

## ❓ **Questões**

### **`questoes.list`**
**Tipo:** Query (público)  
**Descrição:** Lista todas as questões  
**Parâmetros:** Nenhum  
**Retorno:** `Array<Questao>`

---

### **`questoes.getById`**
**Tipo:** Query (público)  
**Descrição:** Busca questão por ID  
**Parâmetros:** `{ id: number }`  
**Retorno:** `Questao | null`

---

### **`questoes.responder`**
**Tipo:** Mutation (protegido)  
**Descrição:** Salva resposta do aluno  
**Parâmetros:**
```typescript
{
  questaoId: number;
  alternativaSelecionada: string; // "A", "B", "C", "D", "E" ou "certo", "errado"
}
```
**Retorno:**
```typescript
{
  success: boolean;
  acertou: boolean;
  gabarito: string;
  conquistasDesbloqueadas: Array<Conquista>;
}
```

---

### **`questoes.minhasRespostas`**
**Tipo:** Query (protegido)  
**Descrição:** Histórico de respostas  
**Parâmetros:** Nenhum  
**Retorno:** `Array<RespostaQuestao>`

---

### **`questoes.estatisticas`**
**Tipo:** Query (protegido)  
**Descrição:** Estatísticas gerais  
**Parâmetros:** Nenhum  
**Retorno:**
```typescript
{
  totalRespondidas: number;
  totalCorretas: number;
  taxaAcerto: number;
  sequenciaAcertos: number;
  tempoMedio: number;
}
```

---

### **`questoes.estatisticasPorDisciplina`**
**Tipo:** Query (protegido)  
**Descrição:** Estatísticas por disciplina  
**Parâmetros:** Nenhum  
**Retorno:**
```typescript
Array<{
  disciplina: string;
  total: number;
  corretas: number;
  taxaAcerto: number;
}>
```

---

### **`questoes.evolucaoTemporal`**
**Tipo:** Query (protegido)  
**Descrição:** Evolução de acertos ao longo do tempo  
**Parâmetros:** Nenhum  
**Retorno:**
```typescript
Array<{
  data: string;
  acertos: number;
  erros: number;
}>
```

---

### **`questoes.questoesMaisErradas`**
**Tipo:** Query (protegido)  
**Descrição:** Questões com mais erros  
**Parâmetros:** Nenhum  
**Retorno:**
```typescript
Array<{
  questaoId: number;
  enunciado: string;
  disciplina: string;
  erros: number;
}>
```

---

### **`questoes.getQuestoesParaRevisar`**
**Tipo:** Query (protegido)  
**Descrição:** Questões agendadas para revisão (Spaced Repetition)  
**Parâmetros:** Nenhum  
**Retorno:** `Array<QuestaoRevisar>`

---

### **`questoes.marcarRevisada`**
**Tipo:** Mutation (protegido)  
**Descrição:** Marca questão como revisada  
**Parâmetros:**
```typescript
{
  questaoId: number;
  acertou: boolean;
}
```
**Retorno:** `{ success: boolean, proximaRevisao: Date }`

---

### **`questoes.reportarErro`**
**Tipo:** Mutation (protegido)  
**Descrição:** Reporta erro na questão  
**Parâmetros:**
```typescript
{
  questaoId: number;
  tipoErro: string;
  descricao: string;
}
```
**Retorno:** `{ success: boolean }`

---

### **`questoes.admin.criar`**
**Tipo:** Mutation (protegido - master/professor/administrativo)  
**Descrição:** Cria nova questão  
**Parâmetros:**
```typescript
{
  enunciado: string;
  tipo: "multipla_escolha" | "certo_errado";
  alternativaA?: string;
  alternativaB?: string;
  alternativaC?: string;
  alternativaD?: string;
  alternativaE?: string;
  gabarito: string;
  comentario?: string;
  disciplina: string;
  assunto: string;
  banca?: string;
  ano?: number;
  dificuldade?: "facil" | "media" | "dificil";
}
```
**Retorno:** `{ success: boolean, questaoId: number }`

---

### **`questoes.admin.importarLote`**
**Tipo:** Mutation (protegido - master/professor/administrativo)  
**Descrição:** Importa questões via planilha  
**Parâmetros:**
```typescript
{
  questoes: Array<NovaQuestao>;
}
```
**Retorno:** `{ success: boolean, total: number, erros: Array<string> }`

---

## 💬 **Fórum**

### **`forum.listTopicos`**
**Tipo:** Query (público)  
**Descrição:** Lista tópicos do fórum  
**Parâmetros:** Nenhum  
**Retorno:** `Array<ForumTopico>`

---

### **`forum.getTopicoById`**
**Tipo:** Query (público)  
**Descrição:** Busca tópico por ID  
**Parâmetros:** `{ id: number }`  
**Retorno:** `ForumTopico & { respostas: Array<ForumResposta> }`

---

### **`forum.criarTopico`**
**Tipo:** Mutation (protegido)  
**Descrição:** Cria novo tópico  
**Parâmetros:**
```typescript
{
  titulo: string;
  categoria: "duvidas" | "discussao" | "questoes";
  conteudo: string;
}
```
**Retorno:** `{ success: boolean, topicoId: number, retido?: boolean }`

**Nota:** Mensagens com links são retidas automaticamente para moderação.

---

### **`forum.criarResposta`**
**Tipo:** Mutation (protegido)  
**Descrição:** Responde a um tópico  
**Parâmetros:**
```typescript
{
  topicoId: number;
  conteudo: string;
}
```
**Retorno:** `{ success: boolean, respostaId: number, retido?: boolean }`

---

### **`forum.curtir`**
**Tipo:** Mutation (protegido)  
**Descrição:** Curte tópico ou resposta  
**Parâmetros:**
```typescript
{
  tipo: "topico" | "resposta";
  id: number;
}
```
**Retorno:** `{ success: boolean }`

---

### **`forum.marcarMelhorResposta`**
**Tipo:** Mutation (protegido - mentor/master)  
**Descrição:** Marca resposta como solução  
**Parâmetros:** `{ respostaId: number }`  
**Retorno:** `{ success: boolean }`

---

### **`forum.fixarTopico`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Fixa/desafixa tópico  
**Parâmetros:** `{ topicoId: number }`  
**Retorno:** `{ success: boolean }`

---

### **`forum.fecharTopico`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Fecha/abre tópico para respostas  
**Parâmetros:** `{ topicoId: number }`  
**Retorno:** `{ success: boolean }`

---

### **`forum.deletarTopico`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Deleta tópico (move para lixeira)  
**Parâmetros:**
```typescript
{
  topicoId: number;
  motivo?: string;
}
```
**Retorno:** `{ success: boolean }`

---

### **`forum.getMensagensRetidas`**
**Tipo:** Query (protegido - master/administrativo)  
**Descrição:** Lista mensagens aguardando moderação  
**Parâmetros:** Nenhum  
**Retorno:** `Array<MensagemRetida>`

---

### **`forum.aprovarMensagem`**
**Tipo:** Mutation (protegido - master/administrativo)  
**Descrição:** Aprova mensagem retida  
**Parâmetros:** `{ mensagemId: number }`  
**Retorno:** `{ success: boolean }`

---

### **`forum.rejeitarMensagem`**
**Tipo:** Mutation (protegido - master/administrativo)  
**Descrição:** Rejeita mensagem retida  
**Parâmetros:** `{ mensagemId: number }`  
**Retorno:** `{ success: boolean }`

---

### **`forum.notificacoesRespostas`**
**Tipo:** Query (protegido)  
**Descrição:** Notificações de respostas aos meus tópicos  
**Parâmetros:** Nenhum  
**Retorno:** `Array<NotificacaoForum>`

---

### **`forum.marcarNotificacaoLida`**
**Tipo:** Mutation (protegido)  
**Descrição:** Marca notificação como lida  
**Parâmetros:** `{ respostaId: number }`  
**Retorno:** `{ success: boolean }`

---

## 🔔 **Notificações**

### **`notificacoes.minhas`**
**Tipo:** Query (protegido)  
**Descrição:** Lista últimas 50 notificações  
**Parâmetros:** Nenhum  
**Retorno:** `Array<Notificacao>`

---

### **`notificacoes.contarNaoLidas`**
**Tipo:** Query (protegido)  
**Descrição:** Conta notificações não lidas  
**Parâmetros:** Nenhum  
**Retorno:** `{ count: number }`

---

### **`notificacoes.marcarLida`**
**Tipo:** Mutation (protegido)  
**Descrição:** Marca notificação como lida  
**Parâmetros:** `{ notificacaoId: number }`  
**Retorno:** `{ success: boolean }`

---

### **`notificacoes.marcarTodasLidas`**
**Tipo:** Mutation (protegido)  
**Descrição:** Marca todas como lidas  
**Parâmetros:** Nenhum  
**Retorno:** `{ success: boolean }`

---

### **`notificacoes.preferencias`**
**Tipo:** Query (protegido)  
**Descrição:** Busca preferências de notificação  
**Parâmetros:** Nenhum  
**Retorno:** `PreferenciasNotificacao`

---

### **`notificacoes.atualizarPreferencias`**
**Tipo:** Mutation (protegido)  
**Descrição:** Atualiza preferências  
**Parâmetros:**
```typescript
{
  tipo: "forum" | "metas" | "aulas" | "conquistas" | "avisos" | "sistema" | "plano" | "materiais" | "questoes";
  inApp: boolean;
  email: boolean;
}
```
**Retorno:** `{ success: boolean }`

---

## 📊 **Dashboard**

### **`dashboard.estatisticas`**
**Tipo:** Query (protegido)  
**Descrição:** Estatísticas do dashboard  
**Parâmetros:** Nenhum  
**Retorno:**
```typescript
{
  horasEstudadas: number;
  metasConcluidas: number;
  aulasAssistidas: number;
  questoesResolvidas: number;
  sequenciaDias: number;
  percentualConclusaoPlano: number;
  nomePlano: string;
}
```

---

### **`dashboard.progressoSemanal`**
**Tipo:** Query (protegido)  
**Descrição:** Progresso dos últimos 7 dias  
**Parâmetros:** Nenhum  
**Retorno:**
```typescript
Array<{
  dia: string;
  horasEstudadas: number;
  metasConcluidas: number;
}>
```

---

## 🎓 **Matrículas**

### **`matriculas.minhas`**
**Tipo:** Query (protegido)  
**Descrição:** Lista matrículas do usuário  
**Parâmetros:** Nenhum  
**Retorno:** `Array<Matricula>`

---

### **`matriculas.ativa`**
**Tipo:** Query (protegido)  
**Descrição:** Matrícula ativa atual  
**Parâmetros:** Nenhum  
**Retorno:** `Matricula | null`

---

## 📄 **Materiais**

### **`materiais.list`**
**Tipo:** Query (público)  
**Descrição:** Lista todos os materiais  
**Parâmetros:** Nenhum  
**Retorno:** `Array<Material>`

---

### **`materiais.byMetaId`**
**Tipo:** Query (público)  
**Descrição:** Materiais vinculados a uma meta  
**Parâmetros:** `{ metaId: number }`  
**Retorno:** `Array<Material>`

---

### **`materiais.create`**
**Tipo:** Mutation (protegido - professor/mentor/administrativo/master)  
**Descrição:** Cria novo material (após upload S3)  
**Parâmetros:**
```typescript
{
  titulo: string;
  descricao?: string;
  tipo: "pdf" | "video" | "documento";
  disciplina: string;
  url: string;
  metaId?: number;
}
```
**Retorno:** `{ success: boolean, materialId: number }`

---

### **`materiais.delete`**
**Tipo:** Mutation (protegido - professor/mentor/administrativo/master)  
**Descrição:** Deleta material  
**Parâmetros:** `{ materialId: number }`  
**Retorno:** `{ success: boolean }`

---

## 📢 **Avisos**

### **`avisos.list`**
**Tipo:** Query (protegido)  
**Descrição:** Lista avisos ativos  
**Parâmetros:** Nenhum  
**Retorno:** `Array<Aviso>`

---

### **`avisos.criar`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Cria novo aviso  
**Parâmetros:**
```typescript
{
  titulo: string;
  conteudo: string;
  tipo: "info" | "alerta" | "urgente";
  destinatarios: "todos" | number; // planoId
}
```
**Retorno:** `{ success: boolean, avisoId: number }`

---

### **`avisos.dispensar`**
**Tipo:** Mutation (protegido)  
**Descrição:** Dispensa aviso (não exibir mais)  
**Parâmetros:** `{ avisoId: number }`  
**Retorno:** `{ success: boolean }`

---

## 🛠️ **Administração**

### **`admin.getUsuarios`**
**Tipo:** Query (protegido - master/mentor/administrativo)  
**Descrição:** Lista todos os usuários  
**Parâmetros:** Nenhum  
**Retorno:** `Array<User>`

---

### **`admin.getMatriculas`**
**Tipo:** Query (protegido - master/mentor/administrativo)  
**Descrição:** Lista todas as matrículas  
**Parâmetros:** Nenhum  
**Retorno:** `Array<Matricula>`

---

### **`admin.atribuirPlano`**
**Tipo:** Mutation (protegido - master/mentor/administrativo)  
**Descrição:** Atribui plano a aluno  
**Parâmetros:**
```typescript
{
  userId: number;
  planoId: number;
  dataInicio: Date;
}
```
**Retorno:** `{ success: boolean, matriculaId: number }`

---

### **`admin.getDadosAluno`**
**Tipo:** Query (protegido - master/mentor)  
**Descrição:** Dados completos de um aluno  
**Parâmetros:** `{ userId: number }`  
**Retorno:**
```typescript
{
  usuario: User;
  planoAtual: Plano;
  metasConcluidas: number;
  horasEstudadas: number;
  taxaConclusao: number;
  sequenciaDias: number;
  historicoAtividades: Array<Atividade>;
}
```

---

### **`admin.getConfigFuncionalidades`**
**Tipo:** Query (protegido - master)  
**Descrição:** Busca configurações de funcionalidades  
**Parâmetros:** Nenhum  
**Retorno:**
```typescript
{
  questoesAtivo: boolean;
  forumAtivo: boolean;
  materiaisAtivo: boolean;
}
```

---

### **`admin.atualizarConfigFuncionalidades`**
**Tipo:** Mutation (protegido - master)  
**Descrição:** Atualiza configurações  
**Parâmetros:**
```typescript
{
  funcionalidade: "questoes" | "forum" | "materiais";
  ativo: boolean;
}
```
**Retorno:** `{ success: boolean }`

---

## 🐛 **Bugs**

### **`bugs.reportar`**
**Tipo:** Mutation (protegido)  
**Descrição:** Reporta bug com screenshot  
**Parâmetros:**
```typescript
{
  titulo: string;
  descricao: string;
  pagina: string;
  screenshotUrl?: string;
}
```
**Retorno:** `{ success: boolean, bugId: number }`

---

### **`bugs.listar`**
**Tipo:** Query (protegido - master/administrativo)  
**Descrição:** Lista bugs reportados  
**Parâmetros:** Nenhum  
**Retorno:** `Array<BugReportado>`

---

### **`bugs.marcarResolvido`**
**Tipo:** Mutation (protegido - master/administrativo)  
**Descrição:** Marca bug como resolvido  
**Parâmetros:** `{ bugId: number }`  
**Retorno:** `{ success: boolean }`

---

## 📈 **Estatísticas**

### **`estatisticas.gerais`**
**Tipo:** Query (protegido - master/mentor/administrativo)  
**Descrição:** Estatísticas gerais do sistema  
**Parâmetros:** Nenhum  
**Retorno:**
```typescript
{
  totalUsuarios: number;
  totalPlanos: number;
  totalMetas: number;
  totalAulas: number;
  totalQuestoes: number;
  usuariosAtivos: number;
}
```

---

## 🔑 **Autenticação de Rotas**

### **Tipos de Procedures**

1. **`publicProcedure`** - Acesso público (não requer autenticação)
2. **`protectedProcedure`** - Requer autenticação
3. **Procedures com verificação de role** - Requerem role específico

### **Roles Disponíveis**

- **aluno** - Acesso básico
- **professor** - Criação de aulas e materiais
- **administrativo** - Gestão de usuários e conteúdo
- **mentor** - Criação de planos e acompanhamento
- **master** - Acesso total ao sistema

---

## 📝 **Notas Importantes**

### **Type-Safety**
Todas as rotas tRPC são **type-safe end-to-end**. O TypeScript infere automaticamente os tipos de parâmetros e retornos.

### **Validação**
Todos os inputs são validados com **Zod** no backend.

### **Erros**
Erros são lançados como `TRPCError` e podem ser capturados no frontend.

### **Superjson**
O sistema usa **Superjson** para serialização, permitindo tipos complexos como `Date`, `Map`, `Set`.

### **Gamificação Automática**
As seguintes mutations acionam gamificação automaticamente:
- `metas.concluir` → +10 pontos + verificação de conquistas
- `aulas.marcarConcluida` → +5 pontos + verificação de conquistas
- `questoes.responder` → +2 pontos (se acertar) + verificação de conquistas

---

## 🔗 **Links Úteis**

- **Documentação tRPC:** https://trpc.io/
- **Documentação Zod:** https://zod.dev/
- **Repositório:** https://github.com/fernandomesquita/dom-app

---

**Documento gerado em:** 31/10/2025  
**Total de APIs:** ~80 procedures  
**Próxima atualização:** Conforme evolução do projeto
