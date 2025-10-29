import * as XLSX from 'xlsx';

export function gerarTemplatePlanilha() {
  // Dados de exemplo para o template
  const dadosPlano = [
    {
      'Nome do Plano': 'Exemplo: TJ-SP 2025',
      'Órgão': 'Tribunal de Justiça de São Paulo',
      'Cargo': 'Escrevente Técnico Judiciário',
      'Tipo': 'pago',
      'Duração (dias)': 180,
      'Horas Diárias': 4,
    }
  ];

  const dadosMetas = [
    {
      'Nome do Plano': 'Exemplo: TJ-SP 2025',
      'Disciplina': 'Direito Constitucional',
      'Assunto': 'Direitos Fundamentais',
      'Tipo': 'estudo',
      'Duração (minutos)': 120,
      'Prioridade': 'alta',
      'Dica de Estudo': 'Foque nos artigos 5º ao 17º da CF/88',
      'Orientação de Estudos': 'Leia a doutrina e faça resumos',
    },
    {
      'Nome do Plano': 'Exemplo: TJ-SP 2025',
      'Disciplina': 'Direito Constitucional',
      'Assunto': 'Direitos Fundamentais',
      'Tipo': 'revisao',
      'Duração (minutos)': 60,
      'Prioridade': 'media',
      'Dica de Estudo': 'Revise seus resumos e mapas mentais',
      'Orientação de Estudos': 'Faça flashcards',
    },
    {
      'Nome do Plano': 'Exemplo: TJ-SP 2025',
      'Disciplina': 'Direito Constitucional',
      'Assunto': 'Direitos Fundamentais',
      'Tipo': 'questoes',
      'Duração (minutos)': 90,
      'Prioridade': 'alta',
      'Dica de Estudo': 'Resolva questões de concursos anteriores',
      'Orientação de Estudos': 'Analise os erros e acertos',
    },
  ];

  // Criar workbook
  const wb = XLSX.utils.book_new();

  // Criar planilha de Planos
  const wsPlanos = XLSX.utils.json_to_sheet(dadosPlano);
  XLSX.utils.book_append_sheet(wb, wsPlanos, 'Planos');

  // Criar planilha de Metas
  const wsMetas = XLSX.utils.json_to_sheet(dadosMetas);
  XLSX.utils.book_append_sheet(wb, wsMetas, 'Metas');

  // Criar planilha de Instruções
  const instrucoes = [
    { 'Instruções de Preenchimento': 'PLANOS' },
    { 'Instruções de Preenchimento': '' },
    { 'Instruções de Preenchimento': 'Nome do Plano: Nome descritivo do plano de estudos' },
    { 'Instruções de Preenchimento': 'Órgão: Nome do órgão do concurso (ex: Tribunal de Justiça de São Paulo)' },
    { 'Instruções de Preenchimento': 'Cargo: Nome do cargo (ex: Escrevente Técnico Judiciário)' },
    { 'Instruções de Preenchimento': 'Tipo: "pago" ou "gratuito"' },
    { 'Instruções de Preenchimento': 'Duração (dias): Número de dias do plano (ex: 180)' },
    { 'Instruções de Preenchimento': 'Horas Diárias: Horas de estudo por dia (ex: 4)' },
    { 'Instruções de Preenchimento': '' },
    { 'Instruções de Preenchimento': 'METAS' },
    { 'Instruções de Preenchimento': '' },
    { 'Instruções de Preenchimento': 'Nome do Plano: Deve corresponder exatamente ao nome do plano na aba "Planos"' },
    { 'Instruções de Preenchimento': 'Disciplina: Nome da disciplina (ex: Direito Constitucional)' },
    { 'Instruções de Preenchimento': 'Assunto: Assunto específico (ex: Direitos Fundamentais)' },
    { 'Instruções de Preenchimento': 'Tipo: "estudo", "revisao" ou "questoes"' },
    { 'Instruções de Preenchimento': 'Duração (minutos): Tempo estimado em minutos (ex: 120)' },
    { 'Instruções de Preenchimento': 'Prioridade: "alta", "media" ou "baixa"' },
    { 'Instruções de Preenchimento': 'Dica de Estudo: (Opcional) Dica rápida para o estudo' },
    { 'Instruções de Preenchimento': 'Orientação de Estudos: (Opcional) Orientação detalhada' },
    { 'Instruções de Preenchimento': '' },
    { 'Instruções de Preenchimento': 'IMPORTANTE:' },
    { 'Instruções de Preenchimento': '- Não altere os nomes das colunas' },
    { 'Instruções de Preenchimento': '- Preencha todos os campos obrigatórios' },
    { 'Instruções de Preenchimento': '- Use os valores exatos para Tipo e Prioridade' },
    { 'Instruções de Preenchimento': '- O Nome do Plano nas Metas deve ser idêntico ao da aba Planos' },
  ];

  const wsInstrucoes = XLSX.utils.json_to_sheet(instrucoes);
  XLSX.utils.book_append_sheet(wb, wsInstrucoes, 'Instruções');

  // Gerar arquivo
  XLSX.writeFile(wb, 'template_planos_dom.xlsx');
}
