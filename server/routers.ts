import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getPontosUsuario, getRanking, getConquistasUsuario, createMeta, updateMeta, deleteMeta, marcarMetaConcluida, adicionarAnotacaoMeta, vincularAulaAMeta, getAulas, getAulaById, marcarAulaConcluida, salvarProgressoAula, getQuestoes, getQuestaoById, salvarRespostaQuestao, getEstatisticasQuestoes, getEstatisticasPorDisciplina, getEvolucaoTemporal, getQuestoesMaisErradas, getEstatisticasDashboard } from "./db";

export const appRouter = router({
  gamificacao: router({
    meusPontos: protectedProcedure.query(async ({ ctx }) => {
      return await getPontosUsuario(ctx.user.id);
    }),
    ranking: publicProcedure.query(async () => {
      return await getRanking(10);
    }),
    minhasConquistas: protectedProcedure.query(async ({ ctx }) => {
      return await getConquistasUsuario(ctx.user.id);
    }),
  }),
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Routers do sistema DOM
  planos: router({
    list: publicProcedure.query(async () => {
      const { getPlanos } = await import("./db");
      return await getPlanos();
    }),
    getById: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "id" in val && typeof val.id === "number") {
        return val as { id: number };
      }
      throw new Error("Invalid input");
    }).query(async ({ input }) => {
      const { getPlanoById } = await import("./db");
      return await getPlanoById(input.id);
    }),
    
    // Rotas administrativas
    admin: router({
      listAll: protectedProcedure.query(async ({ ctx }) => {
        // Verificar permissões
        if (!['master', 'mentor', 'administrativo'].includes(ctx.user.role || '')) {
          throw new Error("Acesso negado");
        }
        const { getAllPlanos } = await import("./db");
        return await getAllPlanos();
      }),
      
      create: protectedProcedure
        .input(z.object({
          nome: z.string(),
          descricao: z.string().optional(),
          tipo: z.enum(["pago", "gratuito"]),
          duracaoTotal: z.number(),
          orgao: z.string().optional(),
          cargo: z.string().optional(),
          concursoArea: z.string().optional(),
          horasDiariasPadrao: z.number().optional(),
          exibirMensagemPosPlano: z.boolean().optional(),
          mensagemPosPlano: z.string().optional(),
          linkPosPlano: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          if (!['master', 'mentor', 'administrativo'].includes(ctx.user.role || '')) {
            throw new Error("Acesso negado");
          }
          const { createPlano } = await import("./db");
          const dataToSave = {
            ...input,
            exibirMensagemPosPlano: input.exibirMensagemPosPlano ? 1 : 0,
            createdBy: ctx.user.id,
          };
          return await createPlano(dataToSave as any);
        }),
      
      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          nome: z.string().optional(),
          descricao: z.string().optional(),
          tipo: z.enum(["pago", "gratuito"]).optional(),
          duracaoTotal: z.number().optional(),
          orgao: z.string().optional(),
          cargo: z.string().optional(),
          concursoArea: z.string().optional(),
          horasDiariasPadrao: z.number().optional(),
          exibirMensagemPosPlano: z.boolean().optional(),
          mensagemPosPlano: z.string().optional(),
          linkPosPlano: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          if (!['master', 'mentor', 'administrativo'].includes(ctx.user.role || '')) {
            throw new Error("Acesso negado");
          }
          const { id, exibirMensagemPosPlano, ...data } = input;
          const dataToSave = {
            ...data,
            exibirMensagemPosPlano: exibirMensagemPosPlano !== undefined ? (exibirMensagemPosPlano ? 1 : 0) : undefined,
          };
          const { updatePlano } = await import("./db");
          return await updatePlano(id, dataToSave as any);
        }),
      
      delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
          if (!['master', 'mentor'].includes(ctx.user.role || '')) {
            throw new Error("Acesso negado");
          }
          const { deletePlano } = await import("./db");
          return await deletePlano(input.id);
        }),
      
      toggleAtivo: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
          if (!['master', 'mentor', 'administrativo'].includes(ctx.user.role || '')) {
            throw new Error("Acesso negado");
          }
          const { togglePlanoAtivo } = await import("./db");
          return await togglePlanoAtivo(input.id);
        }),
      
      getComEstatisticas: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
          if (!['master', 'mentor', 'administrativo'].includes(ctx.user.role || '')) {
            throw new Error("Acesso negado");
          }
          const { getPlanoComEstatisticas } = await import("./db");
          return await getPlanoComEstatisticas(input.id);
        }),
      
      importarPlanilha: protectedProcedure
        .input(z.object({ dados: z.array(z.any()) }))
        .mutation(async ({ ctx, input }) => {
          if (!ctx.user || !['master', 'mentor', 'administrativo'].includes(ctx.user.role)) {
            throw new Error("Permissão negada");
          }
          const { importarPlanosDeExcel } = await import("./db");
          return await importarPlanosDeExcel(input.dados);
        }),
      
      engajamento: protectedProcedure
        .input(z.object({ planoId: z.number() }))
        .query(async ({ ctx, input }) => {
          if (!ctx.user || !['master', 'mentor', 'administrativo'].includes(ctx.user.role)) {
            throw new Error("Permissão negada");
          }
          const { calcularEngajamentoPlano } = await import("./db");
          return await calcularEngajamentoPlano(input.planoId);
        }),
    }),
  }),
  metas: router({
    listByPlano: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "planoId" in val && typeof val.planoId === "number") {
        return val as { planoId: number };
      }
      throw new Error("Invalid input");
    }).query(async ({ input }) => {
      const { getMetasByPlanoId } = await import("./db");
      return await getMetasByPlanoId(input.planoId);
    }),
    
    meusProgressos: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { getProgressoMetasByUserId } = await import("./db");
      return await getProgressoMetasByUserId(ctx.user.id);
    }),

    create: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "planoId" in val && "disciplina" in val && "assunto" in val) {
        return val as any;
      }
      throw new Error("Invalid input");
    }).mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { createMeta } = await import("./db");
      return await createMeta(input);
    }),

    update: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "id" in val) {
        return val as any;
      }
      throw new Error("Invalid input");
    }).mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { updateMeta } = await import("./db");
      return await updateMeta(input.id, input);
    }),

    delete: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "id" in val && typeof val.id === "number") {
        return val as { id: number };
      }
      throw new Error("Invalid input");
    }).mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { deleteMeta } = await import("./db");
      return await deleteMeta(input.id);
    }),

    marcarConcluida: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "metaId" in val && "concluida" in val) {
        return val as { metaId: number; concluida: boolean; tempoDedicado?: number };
      }
      throw new Error("Invalid input");
    }).mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { marcarMetaConcluida } = await import("./db");
      return await marcarMetaConcluida(ctx.user.id, input.metaId, input.concluida, input.tempoDedicado);
    }),

    adicionarAnotacao: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "metaId" in val && "anotacao" in val) {
        return val as { metaId: number; anotacao: string };
      }
      throw new Error("Invalid input");
    }).mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { adicionarAnotacaoMeta } = await import("./db");
      return await adicionarAnotacaoMeta(ctx.user.id, input.metaId, input.anotacao);
    }),

    vincularAula: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "metaId" in val && "aulaId" in val) {
        return val as { metaId: number; aulaId: number };
      }
      throw new Error("Invalid input");
    }).mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { vincularAulaAMeta } = await import("./db");
      return await vincularAulaAMeta(input.metaId, input.aulaId);
    }),
  }),

  aulas: router({
    list: publicProcedure.query(async () => {
      const { getAulas } = await import("./db");
      return await getAulas();
    }),
    getById: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "id" in val && typeof val.id === "number") {
        return val as { id: number };
      }
      throw new Error("Invalid input");
    }).query(async ({ input }) => {
      const { getAulaById } = await import("./db");
      return await getAulaById(input.id);
    }),
    meusProgressos: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { getProgressoAulasByUserId } = await import("./db");
      return await getProgressoAulasByUserId(ctx.user.id);
    }),
    marcarConcluida: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "aulaId" in val) {
        return val as { aulaId: number; percentual?: number; posicao?: number };
      }
      throw new Error("Invalid input");
    }).mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { marcarAulaConcluida } = await import("./db");
      return await marcarAulaConcluida(ctx.user.id, input.aulaId, input.percentual, input.posicao);
    }),
    salvarProgresso: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "aulaId" in val && "posicao" in val) {
        return val as { aulaId: number; posicao: number; percentual: number };
      }
      throw new Error("Invalid input");
    }).mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { salvarProgressoAula } = await import("./db");
      return await salvarProgressoAula(ctx.user.id, input.aulaId, input.posicao, input.percentual);
    }),
  }),

  forum: router({
    listTopicos: publicProcedure.query(async () => {
      const { getForumTopicos } = await import("./db");
      return await getForumTopicos();
    }),
    getTopico: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "id" in val && typeof val.id === "number") {
        return val as { id: number };
      }
      throw new Error("Invalid input");
    }).query(async ({ input }) => {
      const { getForumTopicoById } = await import("./db");
      return await getForumTopicoById(input.id);
    }),
    getRespostas: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "topicoId" in val && typeof val.topicoId === "number") {
        return val as { topicoId: number };
      }
      throw new Error("Invalid input");
    }).query(async ({ input }) => {
      const { getForumRespostasByTopicoId } = await import("./db");
      return await getForumRespostasByTopicoId(input.topicoId);
    }),
    
    // Notificações de respostas
    notificacoesRespostas: protectedProcedure.query(async ({ ctx }) => {
      const { getNotificacoesForumRespostas } = await import("./db");
      return await getNotificacoesForumRespostas(ctx.user.id);
    }),
    
    marcarNotificacaoLida: protectedProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "respostaId" in val && typeof val.respostaId === "number") {
        return val as { respostaId: number };
      }
      throw new Error("Invalid input");
    }).mutation(async ({ ctx, input }) => {
      const { marcarNotificacaoForumLida } = await import("./db");
      return await marcarNotificacaoForumLida(ctx.user.id, input.respostaId);
    }),
  }),

  matriculas: router({
    minhas: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { getMatriculasByUserId } = await import("./db");
      return await getMatriculasByUserId(ctx.user.id);
    }),
    ativa: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { getMatriculaAtiva } = await import("./db");
      return await getMatriculaAtiva(ctx.user.id);
    }),
  }),

  questoes: router({
    list: publicProcedure.query(async () => {
      const { getQuestoes } = await import("./db");
      return await getQuestoes();
    }),
    getById: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "id" in val && typeof val.id === "number") {
        return val as { id: number };
      }
      throw new Error("Invalid input");
    }).query(async ({ input }) => {
      const { getQuestaoById } = await import("./db");
      return await getQuestaoById(input.id);
    }),
    responder: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "questaoId" in val && "alternativaSelecionada" in val) {
        return val as { questaoId: number; alternativaSelecionada: string; correta: boolean };
      }
      throw new Error("Invalid input");
    }).mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { salvarRespostaQuestao } = await import("./db");
      return await salvarRespostaQuestao(ctx.user.id, input.questaoId, input.alternativaSelecionada, input.correta);
    }),
    minhasRespostas: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { getRespostasQuestoesByUserId } = await import("./db");
      return await getRespostasQuestoesByUserId(ctx.user.id);
    }),
    estatisticas: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { getEstatisticasQuestoes } = await import("./db");
      return await getEstatisticasQuestoes(ctx.user.id);
    }),
    estatisticasPorDisciplina: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { getEstatisticasPorDisciplina } = await import("./db");
      return await getEstatisticasPorDisciplina(ctx.user.id);
    }),
    evolucaoTemporal: protectedProcedure
      .input(z.object({ dias: z.number().default(30) }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        const { getEvolucaoTemporal } = await import("./db");
        return await getEvolucaoTemporal(ctx.user.id, input.dias);
      }),
    questoesMaisErradas: protectedProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        const { getQuestoesMaisErradas } = await import("./db");
        return await getQuestoesMaisErradas(ctx.user.id, input.limit);
      }),
  }),

  dashboard: router({
    estatisticas: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return await getEstatisticasDashboard(ctx.user.id);
    }),
  }),
});
export type AppRouter = typeof appRouter;
