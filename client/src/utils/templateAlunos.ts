import * as XLSX from 'xlsx';

export interface AlunoImportacao {
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  dataNascimento?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  role?: "aluno" | "professor" | "administrativo" | "mentor" | "master";
}

export function gerarTemplateAlunos(): void {
  // Criar workbook
  const wb = XLSX.utils.book_new();

  // ABA 1: Instruções
  const instrucoes = [
    ["INSTRUÇÕES PARA IMPORTAÇÃO DE ALUNOS"],
    [""],
    ["1. CAMPOS OBRIGATÓRIOS:"],
    ["   - Nome: Nome completo do aluno"],
    ["   - Email: Email válido e único (não pode repetir)"],
    [""],
    ["2. CAMPOS OPCIONAIS:"],
    ["   - CPF: Formato 000.000.000-00 (será validado)"],
    ["   - Telefone: Formato (00) 00000-0000"],
    ["   - Data de Nascimento: Formato DD/MM/YYYY"],
    ["   - Endereço: Rua, Número, Complemento, Bairro, Cidade, Estado, CEP"],
    ["   - Perfil: aluno, professor, administrativo, mentor ou master (padrão: aluno)"],
    [""],
    ["3. REGRAS DE VALIDAÇÃO:"],
    ["   - CPF deve ser válido (com dígitos verificadores corretos)"],
    ["   - Email não pode estar duplicado no sistema"],
    ["   - CPF não pode estar duplicado no sistema"],
    ["   - Estado deve ter 2 letras (ex: SP, RJ, MG)"],
    ["   - CEP formato: 00000-000"],
    [""],
    ["4. COMO USAR:"],
    ["   - Preencha a aba 'Dados' com as informações dos alunos"],
    ["   - Veja a aba 'Exemplo' para referência"],
    ["   - Salve o arquivo e faça upload na plataforma"],
    ["   - O sistema validará todos os dados antes de importar"],
    ["   - Você receberá um relatório com sucessos e erros"],
    [""],
    ["5. DICAS:"],
    ["   - Não altere os nomes das colunas"],
    ["   - Deixe em branco os campos opcionais que não deseja preencher"],
    ["   - Revise os dados antes de importar"],
    ["   - Faça backup dos dados existentes antes de importações grandes"],
  ];

  const wsInstrucoes = XLSX.utils.aoa_to_sheet(instrucoes);
  
  // Ajustar largura das colunas
  wsInstrucoes['!cols'] = [{ wch: 80 }];
  
  XLSX.utils.book_append_sheet(wb, wsInstrucoes, "Instruções");

  // ABA 2: Dados (vazia, apenas cabeçalhos)
  const colunas = [
    "Nome *",
    "Email *",
    "CPF",
    "Telefone",
    "Data de Nascimento",
    "Rua",
    "Número",
    "Complemento",
    "Bairro",
    "Cidade",
    "Estado",
    "CEP",
    "Perfil"
  ];

  const wsDados = XLSX.utils.aoa_to_sheet([colunas]);
  
  // Ajustar largura das colunas
  wsDados['!cols'] = [
    { wch: 30 }, // Nome
    { wch: 30 }, // Email
    { wch: 15 }, // CPF
    { wch: 18 }, // Telefone
    { wch: 18 }, // Data Nascimento
    { wch: 30 }, // Rua
    { wch: 10 }, // Número
    { wch: 20 }, // Complemento
    { wch: 20 }, // Bairro
    { wch: 20 }, // Cidade
    { wch: 8 },  // Estado
    { wch: 12 }, // CEP
    { wch: 15 }, // Perfil
  ];
  
  XLSX.utils.book_append_sheet(wb, wsDados, "Dados");

  // ABA 3: Exemplo
  const exemplos = [
    colunas,
    [
      "João da Silva",
      "joao.silva@email.com",
      "123.456.789-09",
      "(11) 98765-4321",
      "15/03/1995",
      "Rua das Flores",
      "123",
      "Apto 45",
      "Centro",
      "São Paulo",
      "SP",
      "01234-567",
      "aluno"
    ],
    [
      "Maria Santos",
      "maria.santos@email.com",
      "987.654.321-00",
      "(21) 91234-5678",
      "22/07/1990",
      "Av. Paulista",
      "1000",
      "",
      "Bela Vista",
      "São Paulo",
      "SP",
      "01310-100",
      "aluno"
    ],
    [
      "Pedro Oliveira",
      "pedro.oliveira@email.com",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "professor"
    ],
  ];

  const wsExemplo = XLSX.utils.aoa_to_sheet(exemplos);
  
  // Ajustar largura das colunas (mesmas do Dados)
  wsExemplo['!cols'] = wsDados['!cols'];
  
  XLSX.utils.book_append_sheet(wb, wsExemplo, "Exemplo");

  // Gerar arquivo e fazer download
  XLSX.writeFile(wb, "template_importacao_alunos.xlsx");
}

export function parseArquivoAlunos(file: File): Promise<AlunoImportacao[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Ler aba "Dados"
        const sheetName = workbook.SheetNames.find(name => 
          name.toLowerCase() === 'dados'
        ) || workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length < 2) {
          reject(new Error("Planilha vazia ou sem dados"));
          return;
        }

        // Primeira linha são os cabeçalhos
        const headers = jsonData[0];
        const alunos: AlunoImportacao[] = [];

        // Processar linhas de dados (a partir da linha 2)
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          // Pular linhas vazias
          if (!row || row.length === 0 || !row[0]) continue;

          const aluno: AlunoImportacao = {
            nome: row[0]?.toString().trim() || "",
            email: row[1]?.toString().trim() || "",
            cpf: row[2]?.toString().trim() || undefined,
            telefone: row[3]?.toString().trim() || undefined,
            dataNascimento: row[4]?.toString().trim() || undefined,
            rua: row[5]?.toString().trim() || undefined,
            numero: row[6]?.toString().trim() || undefined,
            complemento: row[7]?.toString().trim() || undefined,
            bairro: row[8]?.toString().trim() || undefined,
            cidade: row[9]?.toString().trim() || undefined,
            estado: row[10]?.toString().trim() || undefined,
            cep: row[11]?.toString().trim() || undefined,
            role: (row[12]?.toString().trim() || "aluno") as any,
          };

          alunos.push(aluno);
        }

        resolve(alunos);
      } catch (error) {
        reject(new Error(`Erro ao processar planilha: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Erro ao ler arquivo"));
    };

    reader.readAsBinaryString(file);
  });
}
