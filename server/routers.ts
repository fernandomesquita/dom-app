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
  authentication: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    
    // Registro de novo usuário
    register: publicProcedure
      .input(z.object({
        nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
        email: z.string().email("Email inválido"),
        cpf: z.string().min(11, "CPF inválido"),
        telefone: z.string().min(10, "Telefone inválido"),
        dataNascimento: z.string().optional(),
        password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres").optional(),
        aceitouTermos: z.boolean().refine(val => val === true, "Você deve aceitar os termos de uso"),
      }))
      .mutation(async ({ input }) => {
        const { registerUser, createEmailVerificationToken, logAudit } = await import("./db");
        
        try {
          const novoUsuario = await registerUser({
            nome: input.nome,
            email: input.email,
            cpf: input.cpf,
            telefone: input.telefone,
            dataNascimento: input.dataNascimento,
            password: input.password,
          });
          
          // Criar token de verificação de email
          const verificationToken = await createEmailVerificationToken(novoUsuario.insertId);
          
          // Log de auditoria
          await logAudit({
            action: "register",
            entity: "users",
            entityId: novoUsuario.insertId,
            newData: { email: input.email, nome: input.nome },
          });
          
          return {
            success: true,
            userId: novoUsuario.insertId,
            verificationToken, // Retornar para envio de email
          };
        } catch (error: any) {
          throw new Error(error.message || "Erro ao registrar usuário");
        }
      }),
    
    // Verificar email
    verifyEmail: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const { verifyEmail } = await import("./db");
        
        try {
          await verifyEmail(input.token);
          return { success: true };
        } catch (error: any) {
          throw new Error(error.message || "Erro ao verificar email");
        }
      }),
    
    // Reenviar email de verificação
    resendVerificationEmail: protectedProcedure
      .mutation(async ({ ctx }) => {
        if (!ctx.user) throw new Error("Não autenticado");
        
        const { createEmailVerificationToken } = await import("./db");
        
        const verificationToken = await createEmailVerificationToken(ctx.user.id);
        
        return {
          success: true,
          verificationToken,
        };
      }),
    
    // Solicitar reset de senha
    forgotPassword: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const { createPasswordResetToken } = await import("./db");
        
        const token = await createPasswordResetToken(input.email);
        
        // Sempre retornar sucesso para não revelar se o email existe
        return {
          success: true,
          token, // Retornar para envio de email
        };
      }),
    
    // Resetar senha
    resetPassword: publicProcedure
      .input(z.object({
        token: z.string(),
        newPassword: z.string().min(8),
      }))
      .mutation(async ({ input }) => {
        const { resetPassword } = await import("./db");
        
        try {
          await resetPassword(input.token, input.newPassword);
          return { success: true };
        } catch (error: any) {
          throw new Error(error.message || "Erro ao resetar senha");
        }
      }),
    
    // Login com senha
    loginWithPassword: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { loginWithPassword, logAudit } = await import("./db");
        
        try {
          const user = await loginWithPassword(input.email, input.password);
          
          // Log de auditoria
          await logAudit({
            userId: user.id,
            action: "login_password",
            entity: "users",
            entityId: user.id,
            ip: ctx.req.ip,
            userAgent: ctx.req.headers["user-agent"],
          });
          
          return {
            success: true,
            user,
          };
        } catch (error: any) {
          throw new Error(error.message || "Erro ao fazer login");
        }
      }),
    
    // Definir senha (primeiro acesso)
    setPassword: protectedProcedure
      .input(z.object({ password: z.string().min(8) }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Não autenticado");
        
        const { setPassword } = await import("./db");
        
        try {
          await setPassword(ctx.user.id, input.password);
          return { success: true };
        } catch (error: any) {
          throw new Error(error.message || "Erro ao definir senha");
        }
      }),
    
    // Atualizar perfil próprio
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        telefone: z.string().optional(),
        dataNascimento: z.string().optional(),
        endereco: z.string().optional(),
        foto: z.string().optional(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Não autenticado");
        
        const { updateUser, logAudit } = await import("./db");
        
        try {
          await updateUser(ctx.user.id, input);
          
          // Log de auditoria
          await logAudit({
            userId: ctx.user.id,
            action: "update_profile",
            entity: "users",
            entityId: ctx.user.id,
            newData: input,
          });
          
          return { success: true };
        } catch (error: any) {
          throw new Error(error.message || "Erro ao atualizar perfil");
        }
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
    importarPlanilha: protectedProcedure
      .input(z.object({
        dados: z.object({
          nomePlano: z.string(),
          descricaoPlano: z.string().optional(),
          metas: z.array(z.object({
            disciplina: z.string(),
            assunto: z.string(),
            tipo: z.enum(["estudo", "revisao", "questoes"]),
            duracao: z.number(),
            incidencia: z.enum(["alta", "media", "baixa"]).nullable(),
            ordem: z.number(),
          })),
        }),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!['master', 'mentor', 'administrativo'].includes(ctx.user.role || '')) {
          throw new Error("Acesso negado");
        }
        const { importarPlanoPlanilha } = await import("./db");
        return await importarPlanoPlanilha(input.dados, ctx.user.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        nome: z.string(),
        descricao: z.string(),
        duracaoTotal: z.number(),
        tipo: z.enum(["pago", "gratuito"]).optional(),
        orgao: z.string().optional(),
        cargo: z.string().optional(),
        ativo: z.number().optional(),
        horasDiariasPadrao: z.number().optional(),
        diasEstudoPadrao: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!['master', 'mentor', 'administrativo'].includes(ctx.user.role || '')) {
          throw new Error("Acesso negado");
        }
        const { createPlano } = await import("./db");
        return await createPlano(input as any);
      }),
    
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
      
      // Duplicar plano
      duplicar: protectedProcedure
        .input(z.object({ 
          planoId: z.number(),
          novoNome: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          if (!['master', 'mentor', 'administrativo'].includes(ctx.user.role || '')) {
            throw new Error("Acesso negado");
          }
          const { duplicarPlano } = await import("./db");
          return await duplicarPlano(input.planoId, input.novoNome, ctx.user.id);
        }),
      
      // Ativar/desativar múltiplos planos
      ativarLote: protectedProcedure
        .input(z.object({ 
          planoIds: z.array(z.number()),
          ativo: z.boolean(),
        }))
        .mutation(async ({ ctx, input }) => {
          if (!['master', 'mentor', 'administrativo'].includes(ctx.user.role || '')) {
            throw new Error("Acesso negado");
          }
          const { ativarPlanosLote } = await import("./db");
          return await ativarPlanosLote(input.planoIds, input.ativo);
        }),
      
      // Listar alunos matriculados em um plano
      listarAlunos: protectedProcedure
        .input(z.object({ planoId: z.number() }))
        .query(async ({ ctx, input }) => {
          if (!['master', 'mentor', 'administrativo'].includes(ctx.user.role || '')) {
            throw new Error("Acesso negado");
          }
          const { getAlunosDoPlano } = await import("./db");
          return await getAlunosDoPlano(input.planoId);
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

    // Buscar metas do plano atribuído ao aluno
    minhasMetas: protectedProcedure.query(async ({ ctx }) => {
      const { getMetasAluno } = await import("./db");
      return await getMetasAluno(ctx.user.id);
    }),

    // Concluir meta do aluno
    concluir: protectedProcedure
      .input(z.object({
        metaId: z.number(),
        tempoGasto: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { concluirMeta } = await import("./db");
        return await concluirMeta(ctx.user.id, input.metaId, input.tempoGasto);
      }),
    
    // Pular meta (não será contabilizada)
    pular: protectedProcedure
      .input(z.object({
        metaId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { pularMeta } = await import("./db");
        return await pularMeta(ctx.user.id, input.metaId);
      }),
    
    // Adiar meta para próximo dia disponível
    adiar: protectedProcedure
      .input(z.object({
        metaId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { adiarMeta } = await import("./db");
        return await adiarMeta(ctx.user.id, input.metaId);
      }),
    
    // Reordenar metas (drag-and-drop)
    reordenar: protectedProcedure
      .input(z.object({
        metaId: z.number(),
        novaOrdem: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { reordenarMeta } = await import("./db");
        return await reordenarMeta(input.metaId, input.novaOrdem);
      }),
    
    // Excluir múltiplas metas
    deletarLote: protectedProcedure
      .input(z.object({
        metaIds: z.array(z.number()),
      }))
      .mutation(async ({ input }) => {
        const { deletarMetasLote } = await import("./db");
        return await deletarMetasLote(input.metaIds);
      }),
    
    // Atualizar múltiplas metas
    atualizarLote: protectedProcedure
      .input(z.object({
        metaIds: z.array(z.number()),
        dados: z.object({
          disciplina: z.string().optional(),
          tipo: z.enum(["estudo", "revisao", "questoes"]).optional(),
          incidencia: z.enum(["baixa", "media", "alta"]).optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const { atualizarMetasLote } = await import("./db");
        return await atualizarMetasLote(input.metaIds, input.dados);
      }),
    
    // Estatísticas de metas por plano
    estatisticas: protectedProcedure
      .input(z.object({
        planoId: z.number(),
      }))
      .query(async ({ input }) => {
        const { getEstatisticasMetas } = await import("./db");
        return await getEstatisticasMetas(input.planoId);
      }),
    
    // Criar múltiplas metas (importação em lote)
    criarLote: protectedProcedure
      .input(z.object({
        metas: z.array(z.object({
          planoId: z.number(),
          disciplina: z.string(),
          assunto: z.string(),
          tipo: z.enum(["estudo", "revisao", "questoes"]),
          duracao: z.number(),
          incidencia: z.enum(["baixa", "media", "alta"]).nullable().optional(),
          prioridade: z.number().min(1).max(5).optional(),
          ordem: z.number(),
          dicaEstudo: z.string().nullable().optional(),
          cor: z.string().nullable().optional(),
        })),
      }))
      .mutation(async ({ input }) => {
        const { criarMetasLote } = await import("./db");
        return await criarMetasLote(input.metas);
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
    
    // Anotações
    criarAnotacao: protectedProcedure
      .input(z.object({
        aulaId: z.number(),
        timestamp: z.number(),
        conteudo: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { anotacoesAulas } = await import("../drizzle/schema");
        
        await db.insert(anotacoesAulas).values({
          userId: ctx.user.id,
          aulaId: input.aulaId,
          timestamp: input.timestamp,
          conteudo: input.conteudo,
        });
        
        return { success: true };
      }),
    
    listarAnotacoes: protectedProcedure
      .input(z.object({ aulaId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) return [];
        
        const { anotacoesAulas } = await import("../drizzle/schema");
        const { eq, and, asc } = await import("drizzle-orm");
        
        return await db.select()
          .from(anotacoesAulas)
          .where(and(
            eq(anotacoesAulas.userId, ctx.user.id),
            eq(anotacoesAulas.aulaId, input.aulaId)
          ))
          .orderBy(asc(anotacoesAulas.timestamp));
      }),
    
    deletarAnotacao: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { anotacoesAulas } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        // Apenas o dono pode deletar
        await db.delete(anotacoesAulas)
          .where(and(
            eq(anotacoesAulas.id, input.id),
            eq(anotacoesAulas.userId, ctx.user.id)
          ));
        
        return { success: true };
      }),
    
    editarAnotacao: protectedProcedure
      .input(z.object({
        id: z.number(),
        conteudo: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { anotacoesAulas } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        await db.update(anotacoesAulas)
          .set({ conteudo: input.conteudo })
          .where(and(
            eq(anotacoesAulas.id, input.id),
            eq(anotacoesAulas.userId, ctx.user.id)
          ));
        
        return { success: true };
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
    
    // Buscar todas as mensagens (tópicos e respostas) de um usuário
    getMensagensUsuario: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ ctx, input }) => {
        // Apenas master e administrativo podem visualizar
        if (ctx.user.role !== "master" && ctx.user.role !== "administrativo") {
          throw new Error("Permissão negada");
        }
        
        const db = await import("./db").then(m => m.getDb());
        if (!db) return { topicos: [], respostas: [] };
        
        const { forumTopicos, forumRespostas } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        const topicos = await db.select().from(forumTopicos).where(eq(forumTopicos.userId, input.userId));
        const respostas = await db.select().from(forumRespostas).where(eq(forumRespostas.userId, input.userId));
        
        return { topicos, respostas };
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
    
    // Mutations para criar tópicos e respostas
    criarTopico: protectedProcedure
      .input(z.object({
        titulo: z.string(),
        conteudo: z.string(),
        categoria: z.string(),
        disciplina: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        console.log("[FORUM] Criando tópico:", input, "User:", ctx.user.id);
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        // Detectar links no conteúdo
        const { detectarLinks, podePostarLinksSemModeracao } = await import("./helpers/detectarLinks");
        const links = detectarLinks(input.conteudo + " " + input.titulo);
        
        // Se tem links e usuário não tem permissão, reter para moderação
        if (links.length > 0 && !podePostarLinksSemModeracao(ctx.user.role)) {
          const { forumMensagensRetidas } = await import("../drizzle/schema");
          
          await db.insert(forumMensagensRetidas).values({
            tipo: "topico",
            autorId: ctx.user.id,
            conteudo: JSON.stringify({
              titulo: input.titulo,
              conteudo: input.conteudo,
              categoria: input.categoria,
              disciplina: input.disciplina,
            }),
            linksDetectados: JSON.stringify(links),
            status: "pendente",
          });
          
          return { 
            success: true, 
            retido: true, 
            mensagem: "Seu tópico contém links e está aguardando aprovação da moderação." 
          };
        }
        
        // Sem links ou usuário com permissão: publicar direto
        const { forumTopicos } = await import("../drizzle/schema");
        const resultado = await db.insert(forumTopicos).values({
          titulo: input.titulo,
          conteudo: input.conteudo,
          categoria: input.categoria,
          userId: ctx.user.id,
          curtidas: 0,
          visualizacoes: 0,
        });
        
        return { success: true, retido: false };
      }),
    
    criarResposta: protectedProcedure
      .input(z.object({
        topicoId: z.number(),
        conteudo: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { forumRespostas, forumTopicos } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // Detectar links no conteúdo
        const { detectarLinks, podePostarLinksSemModeracao } = await import("./helpers/detectarLinks");
        const links = detectarLinks(input.conteudo);
        
        // Se tem links e usuário não tem permissão, reter para moderação
        if (links.length > 0 && !podePostarLinksSemModeracao(ctx.user.role)) {
          const { forumMensagensRetidas } = await import("../drizzle/schema");
          
          await db.insert(forumMensagensRetidas).values({
            tipo: "resposta",
            topicoId: input.topicoId,
            autorId: ctx.user.id,
            conteudo: input.conteudo,
            linksDetectados: JSON.stringify(links),
            status: "pendente",
          });
          
          return { 
            success: true, 
            retido: true,
            mensagem: "Sua resposta contém links e está aguardando aprovação da moderação." 
          };
        }
        
        // Sem links ou usuário com permissão: publicar direto
        const resultado = await db.insert(forumRespostas).values({
          topicoId: input.topicoId,
          conteudo: input.conteudo,
          userId: ctx.user.id,
          curtidas: 0,
        });
        
        // Calcular e adicionar pontos ao usuário
        const { calcularPontosResposta } = await import("../shared/gamification");
        const { users } = await import("../drizzle/schema");
        const pontosGanhos = calcularPontosResposta(input.conteudo, false);
        
        await db.update(users)
          .set({ pontos: ctx.user.pontos + pontosGanhos })
          .where(eq(users.id, ctx.user.id));
        
        // Atualizar updatedAt do tópico (bump)
        await db.update(forumTopicos)
          .set({ updatedAt: new Date() })
          .where(eq(forumTopicos.id, input.topicoId));
        
        // Criar notificação para o autor do tópico (se não for ele mesmo)
        const topico = await db.select().from(forumTopicos).where(eq(forumTopicos.id, input.topicoId)).limit(1);
        const { notificacoes } = await import("../drizzle/schema");
        
        if (topico[0] && topico[0].userId !== ctx.user.id) {
          await db.insert(notificacoes).values({
            userId: topico[0].userId,
            tipo: "forum_resposta",
            titulo: "Nova resposta no seu tópico",
            mensagem: `${ctx.user.name || "Alguém"} respondeu no tópico "${topico[0].titulo}"`,
            link: `/forum/${input.topicoId}`,
            metadata: JSON.stringify({ topicoId: input.topicoId, respostaUserId: ctx.user.id }),
            lida: 0,
          });
        }
        
        // Detectar e notificar menções @usuario
        const { detectarMencoes, buscarUserIdsPorNomes } = await import("./helpers/mencoes");
        const mencoes = detectarMencoes(input.conteudo);
        if (mencoes.length > 0) {
          const userIdsMencionados = await buscarUserIdsPorNomes(mencoes);
          
          // Criar notificação para cada usuário mencionado (exceto autor e autor do tópico)
          for (const userId of userIdsMencionados) {
            if (userId !== ctx.user.id && userId !== topico[0]?.userId) {
              await db.insert(notificacoes).values({
                userId,
                tipo: "forum_mencao",
                titulo: "Você foi mencionado no fórum",
                mensagem: `${ctx.user.name || "Alguém"} mencionou você em "${topico[0]?.titulo || "um tópico"}"`,
                link: `/forum/${input.topicoId}`,
                metadata: JSON.stringify({ topicoId: input.topicoId, respostaUserId: ctx.user.id }),
                lida: 0,
              });
            }
          }
        }
        
        return { success: true, pontosGanhos };
      }),
    
    editarTopico: protectedProcedure
      .input(z.object({
        id: z.number(),
        conteudo: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { forumTopicos } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // Buscar tópico para verificar autor e tempo
        const topico = await db.select().from(forumTopicos).where(eq(forumTopicos.id, input.id)).limit(1);
        if (topico.length === 0) {
          throw new Error("Tópico não encontrado");
        }
        
        // Verificar se é o autor
        if (topico[0].userId !== ctx.user.id) {
          throw new Error("Apenas o autor pode editar");
        }
        
        // Verificar se passaram menos de 5 minutos
        const now = new Date();
        const created = new Date(topico[0].createdAt);
        const minutesSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60);
        
        if (minutesSinceCreated > 5) {
          throw new Error("Tempo limite de edição excedido (5 minutos)");
        }
        
        // Atualizar conteúdo
        await db.update(forumTopicos)
          .set({ conteudo: input.conteudo, updatedAt: new Date() })
          .where(eq(forumTopicos.id, input.id));
        
        return { success: true };
      }),
    
    marcarMelhorResposta: protectedProcedure
      .input(z.object({
        respostaId: z.number(),
        topicoId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { forumRespostas, forumTopicos, users } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        // Verificar se o usuário é o autor do tópico
        const topico = await db.select().from(forumTopicos).where(eq(forumTopicos.id, input.topicoId)).limit(1);
        if (!topico[0] || topico[0].userId !== ctx.user.id) {
          throw new Error("Apenas o autor do tópico pode marcar a melhor resposta");
        }
        
        // Desmarcar qualquer resposta anterior como solução
        await db.update(forumRespostas)
          .set({ solucao: 0 })
          .where(eq(forumRespostas.topicoId, input.topicoId));
        
        // Marcar nova resposta como solução
        await db.update(forumRespostas)
          .set({ solucao: 1 })
          .where(eq(forumRespostas.id, input.respostaId));
        
        // Buscar resposta para pegar o autor e dar bônus de pontos
        const resposta = await db.select().from(forumRespostas).where(eq(forumRespostas.id, input.respostaId)).limit(1);
        if (resposta[0]) {
          const BONUS_MELHOR_RESPOSTA = 50;
          // Buscar pontos atuais do usuário
          const usuario = await db.select().from(users).where(eq(users.id, resposta[0].userId)).limit(1);
          if (usuario[0]) {
            await db.update(users)
              .set({ pontos: usuario[0].pontos + BONUS_MELHOR_RESPOSTA })
              .where(eq(users.id, resposta[0].userId));
          }
        }
        
        return { success: true };
      }),
    
    deletarTopico: protectedProcedure
      .input(z.object({
        id: z.number(),
        motivo: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Apenas master e administrativo podem deletar
        if (ctx.user.role !== "master" && ctx.user.role !== "administrativo") {
          throw new Error("Permissão negada");
        }
        
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { forumTopicos, forumLixeira } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // Buscar tópico antes de deletar
        const topico = await db.select().from(forumTopicos).where(eq(forumTopicos.id, input.id)).limit(1);
        
        if (topico.length > 0) {
          // Mover para lixeira
          await db.insert(forumLixeira).values({
            tipo: "topico",
            conteudoOriginal: JSON.stringify(topico[0]),
            autorId: topico[0].userId,
            deletadoPor: ctx.user.id,
            motivoDelecao: input.motivo || null,
          });
          
          // Deletar do fórum
          await db.delete(forumTopicos).where(eq(forumTopicos.id, input.id));
        }
        
        return { success: true };
      }),
    
    deletarResposta: protectedProcedure
      .input(z.object({
        id: z.number(),
        motivo: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Apenas master e administrativo podem deletar
        if (ctx.user.role !== "master" && ctx.user.role !== "administrativo") {
          throw new Error("Permissão negada");
        }
        
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { forumRespostas, forumLixeira } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // Buscar resposta antes de deletar
        const resposta = await db.select().from(forumRespostas).where(eq(forumRespostas.id, input.id)).limit(1);
        
        if (resposta.length > 0) {
          // Mover para lixeira
          await db.insert(forumLixeira).values({
            tipo: "resposta",
            conteudoOriginal: JSON.stringify(resposta[0]),
            autorId: resposta[0].userId,
            deletadoPor: ctx.user.id,
            motivoDelecao: input.motivo || null,
          });
          
          // Deletar do fórum
          await db.delete(forumRespostas).where(eq(forumRespostas.id, input.id));
        }
        
        return { success: true };
      }),
    
    // Moderação
    fixarTopico: protectedProcedure
      .input(z.object({ id: z.number(), fixado: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "master" && ctx.user.role !== "mentor" && ctx.user.role !== "administrativo") {
          throw new Error("Permissão negada");
        }
        
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { forumTopicos } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        await db.update(forumTopicos)
          .set({ fixado: input.fixado ? 1 : 0 })
          .where(eq(forumTopicos.id, input.id));
        
        return { success: true };
      }),
    
    fecharTopico: protectedProcedure
      .input(z.object({ id: z.number(), fechado: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "master" && ctx.user.role !== "mentor" && ctx.user.role !== "administrativo") {
          throw new Error("Permissão negada");
        }
        
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { forumTopicos } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        await db.update(forumTopicos)
          .set({ fechado: input.fechado ? 1 : 0 })
          .where(eq(forumTopicos.id, input.id));
        
        return { success: true };
      }),
    
    getMensagensRetidas: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "master" && ctx.user.role !== "mentor" && ctx.user.role !== "administrativo") {
        throw new Error("Permissão negada");
      }
      
      const db = await import("./db").then(m => m.getDb());
      if (!db) return [];
      
      const { forumMensagensRetidas } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      
      return await db.select().from(forumMensagensRetidas).where(eq(forumMensagensRetidas.aprovado, 0));
    }),
    
    aprovarMensagem: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "master" && ctx.user.role !== "mentor" && ctx.user.role !== "administrativo") {
          throw new Error("Permissão negada");
        }
        
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { forumMensagensRetidas, forumTopicos, forumRespostas } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // Buscar mensagem retida
        const mensagem = await db.select().from(forumMensagensRetidas).where(eq(forumMensagensRetidas.id, input.id)).limit(1);
        if (!mensagem[0]) throw new Error("Mensagem não encontrada");
        
        // Publicar mensagem
        if (mensagem[0].tipo === "topico") {
          await db.insert(forumTopicos).values({
            userId: mensagem[0].autorId,
            titulo: mensagem[0].conteudo.split("\n")[0].substring(0, 500),
            conteudo: mensagem[0].conteudo,
            categoria: "duvidas",
            curtidas: 0,
            visualizacoes: 0,
          });
        } else {
          await db.insert(forumRespostas).values({
            topicoId: mensagem[0].topicoId!,
            userId: mensagem[0].autorId,
            conteudo: mensagem[0].conteudo,
            curtidas: 0,
          });
        }
        
        // Marcar como aprovado
        await db.update(forumMensagensRetidas)
          .set({ aprovado: 1, moderadoPor: ctx.user.id })
          .where(eq(forumMensagensRetidas.id, input.id));
        
        return { success: true };
      }),
    
     rejeitarMensagem: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "master" && ctx.user.role !== "mentor" && ctx.user.role !== "administrativo") {
          throw new Error("Permissão negada");
        }
        
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { forumMensagensRetidas } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // Deletar mensagem retida
        await db.delete(forumMensagensRetidas).where(eq(forumMensagensRetidas.id, input.id));
        
        return { success: true };
      }),
    
    // Lixeira (apenas Master)
    listarLixeira: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "master") {
          throw new Error("Apenas Master pode acessar a lixeira");
        }
        
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { forumLixeira, users } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // Buscar itens da lixeira com informações do autor e quem deletou
        const itens = await db.select({
          id: forumLixeira.id,
          tipo: forumLixeira.tipo,
          conteudoOriginal: forumLixeira.conteudoOriginal,
          autorId: forumLixeira.autorId,
          deletadoPor: forumLixeira.deletadoPor,
          motivoDelecao: forumLixeira.motivoDelecao,
          deletadoEm: forumLixeira.deletadoEm,
        }).from(forumLixeira).orderBy(forumLixeira.deletadoEm);
        
        return itens;
      }),
    
    recuperarDaLixeira: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "master") {
          throw new Error("Apenas Master pode recuperar da lixeira");
        }
        
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { forumLixeira, forumTopicos, forumRespostas } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // Buscar item da lixeira
        const item = await db.select().from(forumLixeira).where(eq(forumLixeira.id, input.id)).limit(1);
        
        if (item.length > 0) {
          const conteudo = JSON.parse(item[0].conteudoOriginal);
          
          // Restaurar no fórum
          if (item[0].tipo === "topico") {
            await db.insert(forumTopicos).values(conteudo);
          } else if (item[0].tipo === "resposta") {
            await db.insert(forumRespostas).values(conteudo);
          }
          
          // Remover da lixeira
          await db.delete(forumLixeira).where(eq(forumLixeira.id, input.id));
        }
        
        return { success: true };
      }),
    
    deletarPermanentemente: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "master") {
          throw new Error("Apenas Master pode deletar permanentemente");
        }
        
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { forumLixeira } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        await db.delete(forumLixeira).where(eq(forumLixeira.id, input.id));
        
        return { success: true };
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

  notificacoes: router({
    // Listar notificações do usuário
    minhas: protectedProcedure.query(async ({ ctx }) => {
      const db = await import("./db").then(m => m.getDb());
      if (!db) return [];
      
      const { notificacoes } = await import("../drizzle/schema");
      const { eq, desc } = await import("drizzle-orm");
      
      return await db.select()
        .from(notificacoes)
        .where(eq(notificacoes.userId, ctx.user.id))
        .orderBy(desc(notificacoes.createdAt))
        .limit(50);
    }),
    
    // Contar não lidas
    contarNaoLidas: protectedProcedure.query(async ({ ctx }) => {
      const db = await import("./db").then(m => m.getDb());
      if (!db) return 0;
      
      const { notificacoes } = await import("../drizzle/schema");
      const { eq, and } = await import("drizzle-orm");
      
      const resultado = await db.select()
        .from(notificacoes)
        .where(and(
          eq(notificacoes.userId, ctx.user.id),
          eq(notificacoes.lida, 0)
        ));
      
      return resultado.length;
    }),
    
    // Marcar como lida
    marcarLida: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { notificacoes } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        await db.update(notificacoes)
          .set({ lida: 1 })
          .where(and(
            eq(notificacoes.id, input.id),
            eq(notificacoes.userId, ctx.user.id)
          ));
        
        return { success: true };
      }),
    
    // Marcar todas como lidas
    marcarTodasLidas: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await import("./db").then(m => m.getDb());
      if (!db) throw new Error("Database not available");
      
      const { notificacoes } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      
      await db.update(notificacoes)
        .set({ lida: 1 })
        .where(eq(notificacoes.userId, ctx.user.id));
      
      return { success: true };
    }),
    
    // Criar notificação (uso interno/admin)
    criar: protectedProcedure
      .input(z.object({
        userId: z.number(),
        tipo: z.enum(["forum_resposta", "forum_mencao", "meta_vencendo", "meta_atrasada", "aula_nova", "material_novo", "aviso_geral", "conquista", "sistema"]),
        titulo: z.string(),
        mensagem: z.string(),
        link: z.string().optional(),
        metadata: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Apenas admin/master podem criar notificações manualmente
        if (ctx.user.role !== "master" && ctx.user.role !== "administrativo") {
          throw new Error("Permissão negada");
        }
        
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { notificacoes } = await import("../drizzle/schema");
        
        await db.insert(notificacoes).values({
          userId: input.userId,
          tipo: input.tipo,
          titulo: input.titulo,
          mensagem: input.mensagem,
          link: input.link,
          metadata: input.metadata,
          lida: 0,
        });
        
        return { success: true };
      }),
    
    // Obter preferências
    preferencias: protectedProcedure.query(async ({ ctx }) => {
      const db = await import("./db").then(m => m.getDb());
      if (!db) return null;
      
      const { preferenciasNotificacoes } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      
      const resultado = await db.select()
        .from(preferenciasNotificacoes)
        .where(eq(preferenciasNotificacoes.userId, ctx.user.id))
        .limit(1);
      
      // Se não existir, criar com valores padrão
      if (resultado.length === 0) {
        await db.insert(preferenciasNotificacoes).values({
          userId: ctx.user.id,
        });
        
        const novoResultado = await db.select()
          .from(preferenciasNotificacoes)
          .where(eq(preferenciasNotificacoes.userId, ctx.user.id))
          .limit(1);
        
        return novoResultado[0] || null;
      }
      
      return resultado[0];
    }),
    
    // Atualizar preferências
    atualizarPreferencias: protectedProcedure
      .input(z.object({
        inappForumResposta: z.number().optional(),
        inappForumMencao: z.number().optional(),
        inappMetaVencendo: z.number().optional(),
        inappMetaAtrasada: z.number().optional(),
        inappAulaNova: z.number().optional(),
        inappMaterialNovo: z.number().optional(),
        inappAvisoGeral: z.number().optional(),
        inappConquista: z.number().optional(),
        emailForumResposta: z.number().optional(),
        emailForumMencao: z.number().optional(),
        emailMetaVencendo: z.number().optional(),
        emailMetaAtrasada: z.number().optional(),
        emailAulaNova: z.number().optional(),
        emailMaterialNovo: z.number().optional(),
        emailAvisoGeral: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        
        const { preferenciasNotificacoes } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // Garantir que preferências existem
        const existe = await db.select()
          .from(preferenciasNotificacoes)
          .where(eq(preferenciasNotificacoes.userId, ctx.user.id))
          .limit(1);
        
        if (existe.length === 0) {
          await db.insert(preferenciasNotificacoes).values({
            userId: ctx.user.id,
            ...input,
          });
        } else {
          await db.update(preferenciasNotificacoes)
            .set(input)
            .where(eq(preferenciasNotificacoes.userId, ctx.user.id));
        }
        
        return { success: true };
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
    progressoSemanal: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      const { getProgressoSemanal } = await import("./db");
      return await getProgressoSemanal(ctx.user.id);
    }),
  }),

  admin: router({
    getConfigFuncionalidades: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user || ctx.user.role !== "master") {
        throw new Error("Unauthorized");
      }
      const { getConfigFuncionalidades } = await import("./db");
      return await getConfigFuncionalidades();
    }),
    
    atualizarConfigFuncionalidades: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null) {
          return val as { questoesHabilitado?: number; forumHabilitado?: number; materiaisHabilitado?: number };
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || ctx.user.role !== "master") {
          throw new Error("Unauthorized");
        }
        const { atualizarConfigFuncionalidades } = await import("./db");
        return await atualizarConfigFuncionalidades(input);
      }),

    // Moderação de Links
    getMensagensRetidas: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user || !["master", "administrativo"].includes(ctx.user.role)) {
        throw new Error("Unauthorized");
      }
      const { getMensagensRetidas } = await import("./db");
      return await getMensagensRetidas();
    }),

    aprovarMensagem: protectedProcedure
      .input(z.object({ mensagemId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || !["master", "administrativo"].includes(ctx.user.role)) {
          throw new Error("Unauthorized");
        }
        const { aprovarMensagemRetida } = await import("./db");
        return await aprovarMensagemRetida(input.mensagemId, ctx.user.id);
      }),

    rejeitarMensagem: protectedProcedure
      .input(z.object({ mensagemId: z.number(), motivo: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || !["master", "administrativo"].includes(ctx.user.role)) {
          throw new Error("Unauthorized");
        }
        const { rejeitarMensagemRetida } = await import("./db");
        return await rejeitarMensagemRetida(input.mensagemId, ctx.user.id, input.motivo);
      }),

    // Reordenação de Metas
    moverMetaParaCima: protectedProcedure
      .input(z.object({ metaId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || !["master", "administrativo", "mentor"].includes(ctx.user.role)) {
          throw new Error("Unauthorized");
        }
        const { moverMetaParaCima } = await import("./db");
        return await moverMetaParaCima(input.metaId);
      }),

    moverMetaParaBaixo: protectedProcedure
      .input(z.object({ metaId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || !["master", "administrativo", "mentor"].includes(ctx.user.role)) {
          throw new Error("Unauthorized");
        }
        const { moverMetaParaBaixo } = await import("./db");
        return await moverMetaParaBaixo(input.metaId);
      }),

    // Atribuição de Planos
    atribuirPlano: protectedProcedure
      .input(z.object({ 
        userId: z.number(), 
        planoId: z.number(), 
        dataInicio: z.string() 
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user || !["master", "administrativo"].includes(ctx.user.role)) {
          throw new Error("Unauthorized");
        }
        const { atribuirPlano } = await import("./db");
        return await atribuirPlano(input.userId, input.planoId, input.dataInicio);
      }),

    getMatriculas: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user || !["master", "administrativo"].includes(ctx.user.role)) {
        throw new Error("Unauthorized");
      }
      const { getMatriculas } = await import("./db");
      return await getMatriculas();
    }),

    getUsuarios: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user || !["master", "administrativo"].includes(ctx.user.role)) {
        throw new Error("Unauthorized");
      }
      const { getAllUsers } = await import("./db");
      return await getAllUsers();
    }),
    
    // Router de gestão de usuários
    usuarios: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.user || !["master", "administrativo", "mentor"].includes(ctx.user.role)) {
          throw new Error("Unauthorized");
        }
        const { getAllUsers } = await import("./db");
        return await getAllUsers();
      }),
      
      getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
          if (!ctx.user || !["master", "administrativo", "mentor"].includes(ctx.user.role)) {
            throw new Error("Unauthorized");
          }
          const { getUserById } = await import("./db");
          return await getUserById(input.id);
        }),
      
      create: protectedProcedure
        .input(z.object({
          name: z.string().min(1, "Nome é obrigatório"),
          email: z.string().email("Email inválido"),
          cpf: z.string().optional(),
          telefone: z.string().optional(),
          dataNascimento: z.string().optional(),
          endereco: z.string().optional(),
          foto: z.string().optional(),
          bio: z.string().optional(),
          role: z.enum(["aluno", "professor", "administrativo", "mentor", "master"]).default("aluno"),
          observacoes: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          if (!ctx.user || !["master", "administrativo", "mentor"].includes(ctx.user.role)) {
            throw new Error("Unauthorized");
          }
          
          const { createUser } = await import("./db");
          
          // Criar openId temporário (será substituído no primeiro login OAuth)
          const openId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          return await createUser({
            openId,
            name: input.name,
            email: input.email,
            cpf: input.cpf || null,
            telefone: input.telefone || null,
            dataNascimento: input.dataNascimento || null,
            endereco: input.endereco || null,
            foto: input.foto || null,
            bio: input.bio || null,
            role: input.role,
            observacoes: input.observacoes || null,
            status: "ativo",
          });
        }),
      
      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          name: z.string().optional(),
          email: z.string().email().optional(),
          cpf: z.string().optional(),
          telefone: z.string().optional(),
          dataNascimento: z.string().optional(),
          endereco: z.string().optional(),
          foto: z.string().optional(),
          bio: z.string().optional(),
          role: z.enum(["aluno", "professor", "administrativo", "mentor", "master"]).optional(),
          observacoes: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          if (!ctx.user || !["master", "administrativo", "mentor"].includes(ctx.user.role)) {
            throw new Error("Unauthorized");
          }
          
          const { id, ...data } = input;
          const { updateUser } = await import("./db");
          return await updateUser(id, data);
        }),
      
      delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
          if (!ctx.user || !["master", "administrativo"].includes(ctx.user.role)) {
            throw new Error("Apenas Master e Administrativo podem excluir usuários");
          }
          
          const { deleteUser } = await import("./db");
          return await deleteUser(input.id);
        }),
      
      toggleStatus: protectedProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["ativo", "inativo", "suspenso"]),
        }))
        .mutation(async ({ ctx, input }) => {
          if (!ctx.user || !["master", "administrativo"].includes(ctx.user.role)) {
            throw new Error("Unauthorized");
          }
          
          const { toggleUserStatus } = await import("./db");
          return await toggleUserStatus(input.id, input.status);
        }),
      
      importarCSV: protectedProcedure
        .input(z.object({
          dados: z.array(z.object({
            nome: z.string(),
            email: z.string().email(),
            cpf: z.string().optional(),
            telefone: z.string().optional(),
            dataNascimento: z.string().optional(),
            endereco: z.string().optional(),
            role: z.enum(["aluno", "professor", "administrativo", "mentor", "master"]).optional(),
          })),
        }))
        .mutation(async ({ ctx, input }) => {
          if (!ctx.user || !["master", "administrativo"].includes(ctx.user.role)) {
            throw new Error("Unauthorized");
          }
          
          const { importarAlunosCSV } = await import("./db");
          return await importarAlunosCSV(input.dados);
        }),
      
      getAlunosComProgresso: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.user || !["master", "administrativo", "mentor"].includes(ctx.user.role)) {
          throw new Error("Unauthorized");
        }
        const { getAlunosComProgresso } = await import("./db");
        return await getAlunosComProgresso();
      }),
    }),
  }),
  
  // Router de estatísticas de progresso
  estatisticas: router({
    progresso: protectedProcedure
      .input(z.object({
        userId: z.number().optional(),
        periodo: z.enum(["semana", "mes", "trimestre", "ano", "tudo"]).optional(),
      }))
      .query(async ({ ctx, input }) => {
        const userId = input.userId || ctx.user.id;
        
        // Verificar permissão (só pode ver próprias stats ou se for admin)
        if (userId !== ctx.user.id && !['master', 'mentor', 'administrativo'].includes(ctx.user.role || '')) {
          throw new Error("Acesso negado");
        }
        
        const { getEstatisticasProgresso } = await import("./db");
        return await getEstatisticasProgresso(userId, input.periodo || "tudo");
      }),
    
    porDisciplina: protectedProcedure
      .input(z.object({
        userId: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        const userId = input.userId || ctx.user.id;
        
        if (userId !== ctx.user.id && !['master', 'mentor', 'administrativo'].includes(ctx.user.role || '')) {
          throw new Error("Acesso negado");
        }
        
        const { getEstatisticasPorDisciplinaProgresso } = await import("./db");
        return await getEstatisticasPorDisciplinaProgresso(userId);
      }),
    
    evolucaoTemporal: protectedProcedure
      .input(z.object({
        userId: z.number().optional(),
        periodo: z.enum(["7dias", "30dias", "90dias", "ano"]).optional(),
      }))
      .query(async ({ ctx, input }) => {
        const userId = input.userId || ctx.user.id;
        
        if (userId !== ctx.user.id && !['master', 'mentor', 'administrativo'].includes(ctx.user.role || '')) {
          throw new Error("Acesso negado");
        }
        
        const { getEvolucaoTemporalProgresso } = await import("./db");
        return await getEvolucaoTemporalProgresso(userId, input.periodo || "30dias");
      }),
  }),
});
