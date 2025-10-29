import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
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
    estatisticas: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { getEstatisticasQuestoes } = await import("./db");
      return await getEstatisticasQuestoes(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
