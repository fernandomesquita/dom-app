export interface Questao {
  id: number;
  disciplina: string;
  assunto: string;
  banca: string;
  ano: number;
  dificuldade: "Fácil" | "Média" | "Difícil";
  enunciado: string;
  alternativas: {
    letra: string;
    texto: string;
  }[];
  gabarito: string;
  comentario: string;
  taxaAcerto: number;
  totalRespostas: number;
}

export const mockQuestoes: Questao[] = [
  {
    id: 1,
    disciplina: "Direito Constitucional",
    assunto: "Direitos Fundamentais",
    banca: "CESPE",
    ano: 2023,
    dificuldade: "Média",
    enunciado: "Acerca dos direitos e garantias fundamentais previstos na Constituição Federal de 1988, assinale a alternativa correta.",
    alternativas: [
      { letra: "A", texto: "Os direitos fundamentais são absolutos e não podem sofrer qualquer tipo de restrição." },
      { letra: "B", texto: "O direito à vida é o mais importante dos direitos fundamentais e prevalece sobre todos os demais." },
      { letra: "C", texto: "Os direitos fundamentais podem ser restringidos por lei, desde que respeitado o núcleo essencial do direito." },
      { letra: "D", texto: "A Constituição Federal não prevê direitos sociais como direitos fundamentais." },
      { letra: "E", texto: "Os direitos fundamentais só podem ser invocados por brasileiros natos." },
    ],
    gabarito: "C",
    comentario: "Os direitos fundamentais não são absolutos e podem sofrer restrições, desde que preservado o núcleo essencial do direito (princípio da proporcionalidade). A alternativa C está correta pois reflete o entendimento consolidado do STF sobre o tema.",
    taxaAcerto: 68,
    totalRespostas: 1250,
  },
  {
    id: 2,
    disciplina: "Direito Administrativo",
    assunto: "Princípios da Administração Pública",
    banca: "FCC",
    ano: 2024,
    dificuldade: "Fácil",
    enunciado: "O princípio da legalidade, aplicável à Administração Pública, significa que:",
    alternativas: [
      { letra: "A", texto: "A Administração pode fazer tudo que a lei não proíbe." },
      { letra: "B", texto: "A Administração só pode fazer o que a lei autoriza ou permite." },
      { letra: "C", texto: "A Administração está acima da lei em situações excepcionais." },
      { letra: "D", texto: "A Administração pode criar suas próprias regras independentemente da lei." },
      { letra: "E", texto: "A Administração não precisa observar a lei em casos de urgência." },
    ],
    gabarito: "B",
    comentario: "O princípio da legalidade estabelece que a Administração Pública só pode atuar quando autorizada por lei. Diferentemente do particular, que pode fazer tudo que a lei não proíbe, o administrador público só pode fazer o que a lei expressamente permite.",
    taxaAcerto: 85,
    totalRespostas: 2100,
  },
  {
    id: 3,
    disciplina: "Direito Penal",
    assunto: "Teoria do Crime",
    banca: "VUNESP",
    ano: 2023,
    dificuldade: "Difícil",
    enunciado: "Sobre a teoria do crime e seus elementos, analise as assertivas abaixo:\n\nI. O fato típico é composto por conduta, resultado, nexo causal e tipicidade.\nII. A ilicitude é afastada pela presença de causas de justificação.\nIII. A culpabilidade é pressuposto da pena e possui como elementos a imputabilidade, a potencial consciência da ilicitude e a exigibilidade de conduta diversa.\n\nEstá correto o que se afirma em:",
    alternativas: [
      { letra: "A", texto: "I, apenas." },
      { letra: "B", texto: "II, apenas." },
      { letra: "C", texto: "I e II, apenas." },
      { letra: "D", texto: "II e III, apenas." },
      { letra: "E", texto: "I, II e III." },
    ],
    gabarito: "E",
    comentario: "Todas as assertivas estão corretas. I) O fato típico realmente é composto por conduta, resultado, nexo causal e tipicidade. II) A ilicitude é afastada pelas causas de justificação (legítima defesa, estado de necessidade, etc.). III) A culpabilidade possui os três elementos mencionados: imputabilidade, potencial consciência da ilicitude e exigibilidade de conduta diversa.",
    taxaAcerto: 42,
    totalRespostas: 890,
  },
  {
    id: 4,
    disciplina: "Direito Civil",
    assunto: "Contratos",
    banca: "FGV",
    ano: 2024,
    dificuldade: "Média",
    enunciado: "Quanto aos contratos, é correto afirmar que:",
    alternativas: [
      { letra: "A", texto: "A função social do contrato permite ao juiz revisar qualquer cláusula contratual, mesmo sem vício." },
      { letra: "B", texto: "O princípio da autonomia da vontade é absoluto e não admite limitações." },
      { letra: "C", texto: "A boa-fé objetiva deve ser observada nas fases pré-contratual, contratual e pós-contratual." },
      { letra: "D", texto: "Os contratos de adesão não são válidos no ordenamento jurídico brasileiro." },
      { letra: "E", texto: "A onerosidade excessiva nunca pode ser alegada para revisão contratual." },
    ],
    gabarito: "C",
    comentario: "A alternativa C está correta. O princípio da boa-fé objetiva deve ser observado em todas as fases da relação contratual: antes da celebração (fase pré-contratual), durante a execução (fase contratual) e mesmo após o término do contrato (fase pós-contratual). Esse entendimento está consagrado no Código Civil.",
    taxaAcerto: 71,
    totalRespostas: 1580,
  },
  {
    id: 5,
    disciplina: "Direito Tributário",
    assunto: "Princípios Tributários",
    banca: "CESPE",
    ano: 2023,
    dificuldade: "Média",
    enunciado: "Acerca dos princípios constitucionais tributários, assinale a alternativa correta:",
    alternativas: [
      { letra: "A", texto: "O princípio da anterioridade anual impede a cobrança de tributos no mesmo exercício financeiro de sua instituição ou majoração." },
      { letra: "B", texto: "O princípio da legalidade não se aplica aos tributos extrafiscais." },
      { letra: "C", texto: "O princípio da capacidade contributiva é aplicável apenas aos impostos." },
      { letra: "D", texto: "O princípio da isonomia tributária veda qualquer tipo de tratamento diferenciado entre contribuintes." },
      { letra: "E", texto: "O princípio da irretroatividade permite a cobrança de tributos sobre fatos geradores anteriores à lei que os instituiu." },
    ],
    gabarito: "A",
    comentario: "A alternativa A está correta. O princípio da anterioridade anual (ou anterioridade de exercício) estabelece que é vedado cobrar tributos no mesmo exercício financeiro em que tenha sido publicada a lei que os instituiu ou aumentou. Há exceções previstas na própria Constituição (II, IE, IPI, IOF, etc.).",
    taxaAcerto: 63,
    totalRespostas: 1340,
  },
  {
    id: 6,
    disciplina: "Direito do Trabalho",
    assunto: "Contrato de Trabalho",
    banca: "FCC",
    ano: 2024,
    dificuldade: "Fácil",
    enunciado: "São requisitos caracterizadores da relação de emprego:",
    alternativas: [
      { letra: "A", texto: "Pessoalidade, onerosidade, eventualidade e subordinação." },
      { letra: "B", texto: "Pessoalidade, onerosidade, não eventualidade e subordinação." },
      { letra: "C", texto: "Impessoalidade, onerosidade, não eventualidade e autonomia." },
      { letra: "D", texto: "Pessoalidade, gratuidade, não eventualidade e subordinação." },
      { letra: "E", texto: "Pessoalidade, onerosidade, eventualidade e autonomia." },
    ],
    gabarito: "B",
    comentario: "A alternativa B está correta. Os requisitos da relação de emprego são: pessoalidade (o trabalho deve ser prestado pessoalmente pelo empregado), onerosidade (deve haver pagamento de salário), não eventualidade (habitualidade na prestação dos serviços) e subordinação (o empregado está sob as ordens do empregador).",
    taxaAcerto: 79,
    totalRespostas: 1920,
  },
  {
    id: 7,
    disciplina: "Direito Processual Civil",
    assunto: "Competência",
    banca: "VUNESP",
    ano: 2023,
    dificuldade: "Difícil",
    enunciado: "Sobre a competência no Código de Processo Civil, analise:\n\nI. A incompetência absoluta pode ser alegada a qualquer tempo e grau de jurisdição.\nII. A incompetência relativa deve ser alegada na contestação, sob pena de prorrogação.\nIII. O juiz pode declarar de ofício a incompetência relativa.\n\nEstá correto:",
    alternativas: [
      { letra: "A", texto: "I, apenas." },
      { letra: "B", texto: "I e II, apenas." },
      { letra: "C", texto: "I e III, apenas." },
      { letra: "D", texto: "II e III, apenas." },
      { letra: "E", texto: "I, II e III." },
    ],
    gabarito: "B",
    comentario: "Estão corretas apenas as assertivas I e II. A incompetência absoluta pode ser alegada a qualquer tempo (I - correta). A incompetência relativa deve ser alegada em preliminar de contestação, sob pena de prorrogação de competência (II - correta). Porém, o juiz NÃO pode declarar de ofício a incompetência relativa, pois esta é matéria de interesse das partes (III - incorreta).",
    taxaAcerto: 38,
    totalRespostas: 760,
  },
  {
    id: 8,
    disciplina: "Direito Empresarial",
    assunto: "Sociedades",
    banca: "FGV",
    ano: 2024,
    dificuldade: "Média",
    enunciado: "Quanto às sociedades empresárias, é correto afirmar:",
    alternativas: [
      { letra: "A", texto: "A sociedade limitada não pode ter apenas um sócio." },
      { letra: "B", texto: "Na sociedade anônima, os sócios respondem ilimitadamente pelas obrigações sociais." },
      { letra: "C", texto: "A sociedade em nome coletivo é formada apenas por pessoas jurídicas." },
      { letra: "D", texto: "Na sociedade limitada, a responsabilidade dos sócios é restrita ao valor de suas quotas, mas todos respondem solidariamente pela integralização do capital social." },
      { letra: "E", texto: "A sociedade em comandita simples não admite sócios comanditários." },
    ],
    gabarito: "D",
    comentario: "A alternativa D está correta. Na sociedade limitada, a responsabilidade de cada sócio é restrita ao valor de suas quotas, mas todos os sócios respondem solidariamente pela integralização do capital social (art. 1.052 do Código Civil). Isso significa que enquanto o capital não estiver totalmente integralizado, os sócios podem ser chamados a responder pela parte não integralizada.",
    taxaAcerto: 55,
    totalRespostas: 1120,
  },
];
