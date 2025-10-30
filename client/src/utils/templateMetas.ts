import * as XLSX from "xlsx";

/**
 * Gera template Excel para importação de metas
 */
export function gerarTemplateMetasExcel(nomePlano: string) {
  // Criar workbook
  const wb = XLSX.utils.book_new();

  // ===== ABA 1: INSTRUÇÕES =====
  const instrucoesData = [
    ["TEMPLATE DE IMPORTAÇÃO DE METAS - DOM PLATAFORMA"],
    [""],
    ["INSTRUÇÕES DE PREENCHIMENTO"],
    [""],
    ["1. ESTRUTURA DO ARQUIVO"],
    ["   - Este arquivo possui 3 abas: Instruções, Dados e Exemplo"],
    ["   - Preencha APENAS a aba 'Dados' com suas metas"],
    ["   - Use a aba 'Exemplo' como referência"],
    [""],
    ["2. CAMPOS OBRIGATÓRIOS (marcados com *)"],
    ["   - Disciplina*: Nome da disciplina (ex: Direito Constitucional)"],
    ["   - Assunto*: Descrição do assunto a ser estudado"],
    ["   - Tipo*: estudo, revisao ou questoes (exatamente assim, minúsculas)"],
    ["   - Duração*: Tempo em minutos (número inteiro, ex: 60)"],
    [""],
    ["3. CAMPOS OPCIONAIS"],
    ["   - Incidência: alta, media ou baixa (minúsculas)"],
    ["   - Prioridade: Número de 1 a 5 (padrão: 3)"],
    ["   - Dica de Estudo: Orientações para o estudo (texto livre)"],
    ["   - Cor: Código hexadecimal (ex: #E3F2FD) ou deixe vazio"],
    [""],
    ["4. VALIDAÇÕES IMPORTANTES"],
    ["   ✓ Disciplina e Assunto não podem estar vazios"],
    ["   ✓ Tipo deve ser exatamente: estudo, revisao ou questoes"],
    ["   ✓ Duração deve ser um número maior que zero"],
    ["   ✓ Incidência (se preenchida) deve ser: alta, media ou baixa"],
    ["   ✓ Prioridade deve estar entre 1 e 5"],
    [""],
    ["5. DICAS DE PREENCHIMENTO"],
    ["   • Use nomes de disciplinas consistentes (sempre o mesmo nome)"],
    ["   • Seja específico no assunto (facilita a organização)"],
    ["   • Durações típicas: 30, 45, 60, 90, 120 minutos"],
    ["   • Incidência alta: tópicos que caem muito em provas"],
    ["   • Prioridade alta (4-5): assuntos fundamentais"],
    [""],
    ["6. ORDEM DE IMPORTAÇÃO"],
    ["   • As metas serão importadas na ordem das linhas"],
    ["   • A primeira meta da planilha será a ordem 1, e assim por diante"],
    ["   • Você pode reordenar depois na interface de gestão"],
    [""],
    ["7. APÓS PREENCHER"],
    ["   1. Salve o arquivo"],
    ["   2. Na plataforma, vá em Gestão de Metas"],
    ["   3. Clique em 'Baixar Template' e depois 'Importar'"],
    ["   4. Selecione este arquivo"],
    ["   5. Revise o preview e confirme a importação"],
    [""],
    ["IMPORTANTE: Não altere os nomes das colunas na aba 'Dados'!"],
  ];

  const wsInstrucoes = XLSX.utils.aoa_to_sheet(instrucoesData);
  
  // Ajustar largura das colunas
  wsInstrucoes["!cols"] = [{ wch: 80 }];
  
  XLSX.utils.book_append_sheet(wb, wsInstrucoes, "Instruções");

  // ===== ABA 2: DADOS (para preenchimento) =====
  const dadosHeaders = [
    "Disciplina*",
    "Assunto*",
    "Tipo*",
    "Duração (min)*",
    "Incidência",
    "Prioridade",
    "Dica de Estudo",
    "Cor",
  ];

  const wsDados = XLSX.utils.aoa_to_sheet([dadosHeaders]);
  
  // Ajustar largura das colunas
  wsDados["!cols"] = [
    { wch: 25 }, // Disciplina
    { wch: 40 }, // Assunto
    { wch: 12 }, // Tipo
    { wch: 15 }, // Duração
    { wch: 12 }, // Incidência
    { wch: 12 }, // Prioridade
    { wch: 50 }, // Dica de Estudo
    { wch: 12 }, // Cor
  ];

  XLSX.utils.book_append_sheet(wb, wsDados, "Dados");

  // ===== ABA 3: EXEMPLO =====
  const exemploData = [
    dadosHeaders,
    [
      "Direito Constitucional",
      "Princípios Fundamentais da República - Arts. 1º a 4º",
      "estudo",
      60,
      "alta",
      5,
      "Atenção especial aos princípios da dignidade da pessoa humana e valores sociais do trabalho. Fazer mapa mental.",
      "#E3F2FD",
    ],
    [
      "Direito Constitucional",
      "Direitos e Garantias Fundamentais - Direitos Sociais",
      "estudo",
      90,
      "alta",
      5,
      "Decorar o rol do Art. 6º. Relacionar com questões de concursos anteriores.",
      "#E3F2FD",
    ],
    [
      "Direito Constitucional",
      "Revisão: Princípios Fundamentais",
      "revisao",
      30,
      "alta",
      4,
      "Revisar anotações e mapa mental. Fazer resumo de 1 página.",
      "#E8F5E9",
    ],
    [
      "Direito Administrativo",
      "Princípios da Administração Pública",
      "estudo",
      60,
      "alta",
      5,
      "LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência. Estudar cada um com exemplos.",
      "#F3E5F5",
    ],
    [
      "Direito Administrativo",
      "Poderes Administrativos",
      "estudo",
      75,
      "media",
      4,
      "Diferenciar poder vinculado de discricionário. Atenção aos limites do poder disciplinar.",
      "#F3E5F5",
    ],
    [
      "Direito Penal",
      "Teoria do Crime - Fato Típico",
      "estudo",
      90,
      "alta",
      5,
      "Entender os elementos: conduta, resultado, nexo causal e tipicidade. Fazer esquema visual.",
      "#FFF3E0",
    ],
    [
      "Direito Penal",
      "Causas de Exclusão da Ilicitude",
      "estudo",
      60,
      "media",
      4,
      "Legítima defesa, estado de necessidade, estrito cumprimento do dever legal e exercício regular de direito.",
      "#FFF3E0",
    ],
    [
      "Direito Constitucional",
      "Questões sobre Princípios Fundamentais",
      "questoes",
      45,
      "alta",
      4,
      "Resolver pelo menos 30 questões de bancas variadas. Anotar dúvidas para revisar.",
      "#FFEBEE",
    ],
    [
      "Direito Administrativo",
      "Questões sobre Poderes Administrativos",
      "questoes",
      45,
      "media",
      3,
      "Focar em questões que diferenciam os tipos de poderes. Mínimo 20 questões.",
      "#FFEBEE",
    ],
    [
      "Português",
      "Interpretação de Texto",
      "estudo",
      60,
      "alta",
      5,
      "Técnicas de leitura dinâmica. Identificar ideia principal, argumentos e conclusão.",
      "#FFF9C4",
    ],
    [
      "Português",
      "Questões de Interpretação de Texto",
      "questoes",
      60,
      "alta",
      4,
      "Resolver textos longos. Cronometrar tempo de leitura e resposta.",
      "#FFEBEE",
    ],
    [
      "Matemática",
      "Regra de Três Simples e Composta",
      "estudo",
      45,
      "media",
      3,
      "Revisar conceitos básicos. Fazer exercícios de fixação.",
      "#E0F2F1",
    ],
    [
      "Matemática",
      "Questões de Regra de Três",
      "questoes",
      30,
      "media",
      3,
      "Resolver 15 questões variadas. Atenção aos enunciados.",
      "#FFEBEE",
    ],
    [
      "Informática",
      "Microsoft Excel - Fórmulas Básicas",
      "estudo",
      60,
      "baixa",
      2,
      "SOMA, MÉDIA, SE, PROCV. Praticar no computador.",
      "#F5F5F5",
    ],
    [
      "Direito Penal",
      "Revisão: Teoria do Crime",
      "revisao",
      45,
      "alta",
      4,
      "Revisar esquema visual. Refazer questões erradas.",
      "#E8F5E9",
    ],
  ];

  const wsExemplo = XLSX.utils.aoa_to_sheet(exemploData);
  
  // Ajustar largura das colunas (mesmas da aba Dados)
  wsExemplo["!cols"] = wsDados["!cols"];

  XLSX.utils.book_append_sheet(wb, wsExemplo, "Exemplo");

  // Gerar arquivo
  const nomeArquivo = `Template_Metas_${nomePlano.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`;
  XLSX.writeFile(wb, nomeArquivo);

  return nomeArquivo;
}

/**
 * Parsear arquivo Excel de importação de metas
 */
export interface MetaImportada {
  linha: number;
  disciplina: string;
  assunto: string;
  tipo: "estudo" | "revisao" | "questoes";
  duracao: number;
  incidencia: "baixa" | "media" | "alta" | null;
  prioridade: number;
  dicaEstudo: string | null;
  cor: string | null;
  erros: string[];
}

export function parsearPlanilhaMetas(file: File): Promise<MetaImportada[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Buscar aba "Dados"
        const sheetName = workbook.SheetNames.find((name) =>
          name.toLowerCase().includes("dados")
        );

        if (!sheetName) {
          reject(new Error("Aba 'Dados' não encontrada no arquivo"));
          return;
        }

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        // Primeira linha são os headers
        const headers = jsonData[0];
        const rows = jsonData.slice(1);

        const metasImportadas: MetaImportada[] = [];

        rows.forEach((row, index) => {
          // Pular linhas vazias
          if (!row || row.length === 0 || !row[0]) return;

          const meta: MetaImportada = {
            linha: index + 2, // +2 porque: +1 para header, +1 para índice começar em 1
            disciplina: String(row[0] || "").trim(),
            assunto: String(row[1] || "").trim(),
            tipo: String(row[2] || "").trim().toLowerCase() as any,
            duracao: parseInt(String(row[3] || "0")),
            incidencia: row[4] ? String(row[4]).trim().toLowerCase() as any : null,
            prioridade: row[5] ? parseInt(String(row[5])) : 3,
            dicaEstudo: row[6] ? String(row[6]).trim() : null,
            cor: row[7] ? String(row[7]).trim() : null,
            erros: [],
          };

          // Validações
          if (!meta.disciplina) {
            meta.erros.push("Disciplina é obrigatória");
          }

          if (!meta.assunto) {
            meta.erros.push("Assunto é obrigatório");
          }

          if (!["estudo", "revisao", "questoes"].includes(meta.tipo)) {
            meta.erros.push(
              "Tipo deve ser: estudo, revisao ou questoes (minúsculas)"
            );
          }

          if (!meta.duracao || meta.duracao <= 0 || isNaN(meta.duracao)) {
            meta.erros.push("Duração deve ser um número maior que zero");
          }

          if (
            meta.incidencia &&
            !["baixa", "media", "alta"].includes(meta.incidencia)
          ) {
            meta.erros.push("Incidência deve ser: baixa, media ou alta");
          }

          if (meta.prioridade < 1 || meta.prioridade > 5 || isNaN(meta.prioridade)) {
            meta.erros.push("Prioridade deve estar entre 1 e 5");
          }

          metasImportadas.push(meta);
        });

        resolve(metasImportadas);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Erro ao ler arquivo"));
    };

    reader.readAsArrayBuffer(file);
  });
}
