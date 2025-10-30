/**
 * Job para verificar metas vencendo ou atrasadas e enviar notificações
 * Deve ser executado diariamente (cron: 0 8 * * * - 8h da manhã)
 */

export async function verificarMetasENotificar() {
  const { getDb } = await import("../db");
  const db = await getDb();
  if (!db) {
    console.log("[Job] Database not available");
    return;
  }

  const { metas, notificacoes, users } = await import("../../drizzle/schema");
  const { and, eq, lte, gte, sql } = await import("drizzle-orm");

  try {
    const agora = new Date();
    const amanha = new Date(agora);
    amanha.setDate(amanha.getDate() + 1);

    // 1. Buscar metas que vencem nas próximas 24h (e ainda não foram concluídas)
    const metasVencendo = await db.select({
      id: metas.id,
      userId: metas.userId,
      disciplina: metas.disciplina,
      assunto: metas.assunto,
      prazo: metas.prazo,
    })
      .from(metas)
      .where(and(
        lte(metas.prazo, amanha),
        gte(metas.prazo, agora),
        eq(metas.concluida, 0)
      ));

    console.log(`[Job] Encontradas ${metasVencendo.length} metas vencendo em 24h`);

    // Criar notificações para metas vencendo
    for (const meta of metasVencendo) {
      // Verificar se já existe notificação recente (últimas 24h)
      const notifExistente = await db.select()
        .from(notificacoes)
        .where(and(
          eq(notificacoes.userId, meta.userId),
          eq(notificacoes.tipo, "meta_vencendo"),
          sql`JSON_EXTRACT(${notificacoes.metadata}, '$.metaId') = ${meta.id}`,
          gte(notificacoes.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
        ))
        .limit(1);

      if (notifExistente.length === 0) {
        await db.insert(notificacoes).values({
          userId: meta.userId,
          tipo: "meta_vencendo",
          titulo: "⏰ Meta próxima do prazo",
          mensagem: `A meta "${meta.disciplina} - ${meta.assunto}" vence em breve!`,
          link: "/plano",
          metadata: JSON.stringify({ metaId: meta.id }),
          lida: 0,
        });
        console.log(`[Job] Notificação criada para meta ${meta.id} (vencendo)`);
      }
    }

    // 2. Buscar metas atrasadas (prazo passou e não foram concluídas)
    const metasAtrasadas = await db.select({
      id: metas.id,
      userId: metas.userId,
      disciplina: metas.disciplina,
      assunto: metas.assunto,
      prazo: metas.prazo,
    })
      .from(metas)
      .where(and(
        lte(metas.prazo, agora),
        eq(metas.concluida, 0)
      ));

    console.log(`[Job] Encontradas ${metasAtrasadas.length} metas atrasadas`);

    // Criar notificações para metas atrasadas
    for (const meta of metasAtrasadas) {
      // Verificar se já existe notificação recente (últimas 24h)
      const notifExistente = await db.select()
        .from(notificacoes)
        .where(and(
          eq(notificacoes.userId, meta.userId),
          eq(notificacoes.tipo, "meta_atrasada"),
          sql`JSON_EXTRACT(${notificacoes.metadata}, '$.metaId') = ${meta.id}`,
          gte(notificacoes.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
        ))
        .limit(1);

      if (notifExistente.length === 0) {
        await db.insert(notificacoes).values({
          userId: meta.userId,
          tipo: "meta_atrasada",
          titulo: "🚨 Meta atrasada",
          mensagem: `A meta "${meta.disciplina} - ${meta.assunto}" está atrasada!`,
          link: "/plano",
          metadata: JSON.stringify({ metaId: meta.id }),
          lida: 0,
        });
        console.log(`[Job] Notificação criada para meta ${meta.id} (atrasada)`);
      }
    }

    console.log("[Job] Verificação de metas concluída");
  } catch (error) {
    console.error("[Job] Erro ao verificar metas:", error);
  }
}

// Se executado diretamente (para testes)
if (require.main === module) {
  verificarMetasENotificar().then(() => {
    console.log("Job executado com sucesso");
    process.exit(0);
  }).catch(err => {
    console.error("Erro ao executar job:", err);
    process.exit(1);
  });
}
