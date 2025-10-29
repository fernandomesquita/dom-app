/**
 * Script de seed para popular o banco de dados com dados de teste
 * Execute com: tsx server/seed.ts
 */

import { getDb } from "./db";
import { users, planos, metas, matriculas, conquistas } from "../drizzle/schema";

async function seed() {
  console.log("🌱 Iniciando seed do banco de dados...");
  
  const db = await getDb();
  if (!db) {
    console.error("❌ Erro: Banco de dados não disponível");
    process.exit(1);
  }

  try {
    // 1. Criar usuários de teste
    console.log("👥 Criando usuários de teste...");
    
    // Master
    await db.insert(users).values({
      openId: "master-test-001",
      name: "Fernando Mesquita",
      email: "fernando@dom.com",
      role: "master",
      pontos: 0,
    }).onDuplicateKeyUpdate({ set: { name: "Fernando Mesquita" } });

    // Mentor
    await db.insert(users).values({
      openId: "mentor-test-001",
      name: "Maria Silva",
      email: "maria@dom.com",
      role: "mentor",
      pontos: 0,
    }).onDuplicateKeyUpdate({ set: { name: "Maria Silva" } });

    // Alunos
    const alunosData = [
      { openId: "aluno-test-001", name: "João Santos", email: "joao@aluno.com" },
      { openId: "aluno-test-002", name: "Ana Costa", email: "ana@aluno.com" },
      { openId: "aluno-test-003", name: "Pedro Oliveira", email: "pedro@aluno.com" },
    ];

    for (const aluno of alunosData) {
      await db.insert(users).values({
        ...aluno,
        role: "aluno",
        pontos: 0,
      }).onDuplicateKeyUpdate({ set: { name: aluno.name } });
    }

    console.log("✅ Usuários criados com sucesso!");

    // 2. Criar plano de teste
    console.log("📚 Criando plano de estudos de teste...");
    
    const planoResult = await db.insert(planos).values({
      nome: "TJ-SP 2025 - Escrevente Técnico Judiciário",
      descricao: "Plano completo de estudos para o concurso do Tribunal de Justiça de São Paulo - Cargo de Escrevente Técnico Judiciário",
      tipo: "pago",
      duracaoTotal: 90, // 90 dias
      orgao: "Tribunal de Justiça de São Paulo",
      cargo: "Escrevente Técnico Judiciário",
      ativo: 1,
      horasDiariasPadrao: 4,
      diasEstudoPadrao: "1,2,3,4,5", // Segunda a sexta
      createdBy: 1, // Master
    });

    // Buscar o plano recém criado
    const planosInseridos = await db.select().from(planos).limit(1).orderBy(planos.id);
    const planoId = planosInseridos[0]?.id || 1;
    console.log(`✅ Plano criado com ID: ${planoId}`);

    // 3. Criar metas do plano
    console.log("🎯 Criando metas do plano...");
    
    const metasData = [
      // Semana 1 - Direito Constitucional
      { disciplina: "Direito Constitucional", assunto: "Princípios Fundamentais da CF/88", tipo: "estudo", duracao: 120, incidencia: "alta", ordem: 1 },
      { disciplina: "Direito Constitucional", assunto: "Direitos e Garantias Fundamentais", tipo: "estudo", duracao: 180, incidencia: "alta", ordem: 2 },
      { disciplina: "Direito Constitucional", assunto: "Exercícios - Princípios Fundamentais", tipo: "questoes", duracao: 60, incidencia: "alta", ordem: 3 },
      
      // Semana 2 - Direito Administrativo
      { disciplina: "Direito Administrativo", assunto: "Princípios da Administração Pública", tipo: "estudo", duracao: 120, incidencia: "alta", ordem: 4 },
      { disciplina: "Direito Administrativo", assunto: "Atos Administrativos", tipo: "estudo", duracao: 150, incidencia: "media", ordem: 5 },
      { disciplina: "Direito Administrativo", assunto: "Exercícios - Atos Administrativos", tipo: "questoes", duracao: 60, incidencia: "media", ordem: 6 },
      { disciplina: "Direito Constitucional", assunto: "Revisão - Princípios Fundamentais", tipo: "revisao", duracao: 90, incidencia: "alta", ordem: 7 },
      
      // Semana 3 - Direito Civil
      { disciplina: "Direito Civil", assunto: "Lei de Introdução às Normas do Direito Brasileiro", tipo: "estudo", duracao: 120, incidencia: "media", ordem: 8 },
      { disciplina: "Direito Civil", assunto: "Pessoas Naturais e Jurídicas", tipo: "estudo", duracao: 150, incidencia: "media", ordem: 9 },
      { disciplina: "Direito Civil", assunto: "Exercícios - Pessoas", tipo: "questoes", duracao: 60, incidencia: "media", ordem: 10 },
      
      // Semana 4 - Direito Processual Civil
      { disciplina: "Direito Processual Civil", assunto: "Normas Processuais Civis", tipo: "estudo", duracao: 120, incidencia: "alta", ordem: 11 },
      { disciplina: "Direito Processual Civil", assunto: "Jurisdição e Competência", tipo: "estudo", duracao: 180, incidencia: "alta", ordem: 12 },
      { disciplina: "Direito Processual Civil", assunto: "Exercícios - Jurisdição", tipo: "questoes", duracao: 60, incidencia: "alta", ordem: 13 },
      { disciplina: "Direito Administrativo", assunto: "Revisão - Atos Administrativos", tipo: "revisao", duracao: 90, incidencia: "media", ordem: 14 },
      
      // Semana 5 - Direito Penal
      { disciplina: "Direito Penal", assunto: "Aplicação da Lei Penal", tipo: "estudo", duracao: 120, incidencia: "media", ordem: 15 },
      { disciplina: "Direito Penal", assunto: "Crime e Imputabilidade", tipo: "estudo", duracao: 150, incidencia: "media", ordem: 16 },
      { disciplina: "Direito Penal", assunto: "Exercícios - Aplicação da Lei Penal", tipo: "questoes", duracao: 60, incidencia: "media", ordem: 17 },
      
      // Semana 6 - Revisão Geral
      { disciplina: "Direito Constitucional", assunto: "Revisão - Direitos Fundamentais", tipo: "revisao", duracao: 90, incidencia: "alta", ordem: 18 },
      { disciplina: "Direito Civil", assunto: "Revisão - Pessoas", tipo: "revisao", duracao: 90, incidencia: "media", ordem: 19 },
      { disciplina: "Direito Processual Civil", assunto: "Revisão - Jurisdição", tipo: "revisao", duracao: 90, incidencia: "alta", ordem: 20 },
    ];

    for (const meta of metasData) {
      await db.insert(metas).values({
        planoId,
        disciplina: meta.disciplina,
        assunto: meta.assunto,
        tipo: meta.tipo as any,
        duracao: meta.duracao,
        incidencia: meta.incidencia as any,
        prioridade: meta.incidencia === "alta" ? 5 : meta.incidencia === "media" ? 3 : 1,
        ordem: meta.ordem,
        dicaEstudo: `Dica de estudo para: ${meta.assunto}`,
        orientacaoEstudos: `<p>Orientação detalhada sobre como estudar <strong>${meta.assunto}</strong>.</p><p>Foque nos pontos principais e faça resumos.</p>`,
      });
    }

    console.log(`✅ ${metasData.length} metas criadas com sucesso!`);

    // 4. Criar conquistas (se não existirem)
    console.log("🏆 Criando conquistas...");
    
    const conquistasData = [
      { nome: "Primeira Meta", descricao: "Complete sua primeira meta de estudos", icone: "🎯", tipo: "meta" as const, pontosRequeridos: 1 },
      { nome: "Estudante Dedicado", descricao: "Complete 10 metas de estudos", icone: "📚", tipo: "meta" as const, pontosRequeridos: 10 },
      { nome: "Mestre das Metas", descricao: "Complete 50 metas de estudos", icone: "🏆", tipo: "meta" as const, pontosRequeridos: 50 },
      { nome: "Primeira Aula", descricao: "Assista sua primeira aula completa", icone: "🎬", tipo: "aula" as const, pontosRequeridos: 1 },
      { nome: "Cinéfilo dos Estudos", descricao: "Assista 20 aulas completas", icone: "🎥", tipo: "aula" as const, pontosRequeridos: 20 },
      { nome: "Maratonista", descricao: "Assista 100 aulas completas", icone: "🌟", tipo: "aula" as const, pontosRequeridos: 100 },
      { nome: "Primeira Questão", descricao: "Responda sua primeira questão corretamente", icone: "✅", tipo: "questao" as const, pontosRequeridos: 1 },
      { nome: "Acertador", descricao: "Acerte 100 questões", icone: "💯", tipo: "questao" as const, pontosRequeridos: 100 },
      { nome: "Expert", descricao: "Acerte 500 questões", icone: "🎓", tipo: "questao" as const, pontosRequeridos: 500 },
      { nome: "Sequência de Fogo", descricao: "Acerte 10 questões seguidas", icone: "🔥", tipo: "sequencia" as const, pontosRequeridos: 10 },
      { nome: "Pontuador", descricao: "Alcance 100 pontos", icone: "⭐", tipo: "especial" as const, pontosRequeridos: 100 },
      { nome: "Campeão", descricao: "Alcance 500 pontos", icone: "👑", tipo: "especial" as const, pontosRequeridos: 500 },
      { nome: "Lenda", descricao: "Alcance 1000 pontos", icone: "💎", tipo: "especial" as const, pontosRequeridos: 1000 },
    ];

    for (const conquista of conquistasData) {
      await db.insert(conquistas).values(conquista)
        .onDuplicateKeyUpdate({ set: { nome: conquista.nome } });
    }

    console.log(`✅ ${conquistasData.length} conquistas criadas/atualizadas!`);

    // 5. Atribuir plano ao primeiro aluno (para testes)
    console.log("📝 Atribuindo plano ao aluno de teste...");
    
    const dataInicio = new Date();
    const dataTermino = new Date();
    dataTermino.setDate(dataTermino.getDate() + 90);

    // Buscar ID do primeiro aluno
    const alunos = await db.select().from(users);
    if (alunos.length > 0) {
      const alunoId = alunos[0].id;
      
      await db.insert(matriculas).values({
        userId: alunoId,
        planoId,
        dataInicio,
        dataTermino,
        horasDiarias: 4,
        diasEstudo: "1,2,3,4,5",
        ativo: 1,
      }).onDuplicateKeyUpdate({ set: { ativo: 1 } });

      console.log(`✅ Plano atribuído ao aluno ${alunos[0].name}!`);
    }

    console.log("\n🎉 Seed concluído com sucesso!");
    console.log("\n📊 Resumo:");
    console.log("   - Usuários: 5 (1 Master, 1 Mentor, 3 Alunos)");
    console.log(`   - Planos: 1 (${metasData.length} metas)`);
    console.log(`   - Conquistas: ${conquistasData.length}`);
    console.log("   - Matrículas: 1");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro durante seed:", error);
    process.exit(1);
  }
}

// Executar seed
seed();
