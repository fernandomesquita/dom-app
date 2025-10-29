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
});

export type AppRouter = typeof appRouter;
