import cron from "node-cron";

/**
 * Configura e inicia todos os jobs agendados
 */
export function iniciarScheduler() {
  console.log("[Scheduler] Iniciando jobs agendados...");

  // Job: Verificar metas (diariamente às 8h)
  cron.schedule("0 8 * * *", async () => {
    console.log("[Scheduler] Executando job de verificação de metas...");
    const { verificarMetasENotificar } = await import("./verificarMetas");
    await verificarMetasENotificar();
  }, {
    timezone: "America/Sao_Paulo"
  });

  console.log("[Scheduler] Jobs configurados:");
  console.log("  - Verificação de metas: 8h diariamente");
}
