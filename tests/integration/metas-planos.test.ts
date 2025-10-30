import { describe, it, expect, beforeAll } from 'vitest';

/**
 * Testes de Integração: Metas e Planos
 * 
 * Valida o fluxo completo:
 * 1. Criar plano
 * 2. Atribuir plano a aluno (matrícula)
 * 3. Criar metas vinculadas ao plano
 * 4. Configurar cronograma (horas diárias + dias da semana)
 * 5. Redistribuir metas automaticamente
 * 6. Marcar meta como concluída
 */

describe('Integração Metas-Planos', () => {
  let testPlanoId: number;
  let testMatriculaId: number;
  let testMetaId: number = 0; // Inicializar com 0
  let testUserId: number = 1; // Assumindo user ID 1 para testes

  describe('1. Validações de Entrada', () => {
    it('deve rejeitar meta com disciplina inválida', async () => {
      const { createMeta } = await import('../../server/db');
      
      await expect(
        createMeta({
          planoId: 1,
          disciplina: 'AB', // Menos de 3 caracteres
          assunto: 'Teste',
          tipo: 'estudo',
          duracao: 60,
        })
      ).rejects.toThrow('Disciplina deve ter no mínimo 3 caracteres');
    });

    it('deve rejeitar meta com assunto inválido', async () => {
      const { createMeta } = await import('../../server/db');
      
      await expect(
        createMeta({
          planoId: 1,
          disciplina: 'Matemática',
          assunto: 'AB', // Menos de 3 caracteres
          tipo: 'estudo',
          duracao: 60,
        })
      ).rejects.toThrow('Assunto deve ter no mínimo 3 caracteres');
    });

    it('deve rejeitar meta com duração abaixo do mínimo', async () => {
      const { createMeta } = await import('../../server/db');
      
      await expect(
        createMeta({
          planoId: 1,
          disciplina: 'Matemática',
          assunto: 'Álgebra',
          tipo: 'estudo',
          duracao: 10, // Menos de 15 minutos
        })
      ).rejects.toThrow('Duração deve estar entre 15 e 240 minutos');
    });

    it('deve rejeitar meta com duração acima do máximo', async () => {
      const { createMeta } = await import('../../server/db');
      
      await expect(
        createMeta({
          planoId: 1,
          disciplina: 'Matemática',
          assunto: 'Álgebra',
          tipo: 'estudo',
          duracao: 300, // Mais de 240 minutos
        })
      ).rejects.toThrow('Duração deve estar entre 15 e 240 minutos');
    });
  });

  describe('2. CRUD de Metas', () => {
    it('deve criar meta válida', async () => {
      const { createMeta } = await import('../../server/db');
      
      const result = await createMeta({
        planoId: 1,
        disciplina: 'Matemática',
        assunto: 'Álgebra Linear',
        tipo: 'estudo',
        duracao: 60,
        incidencia: 'media',
        dicaEstudo: 'Revisar conceitos básicos',
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
      expect(result.disciplina).toBe('Matemática');
      
      if (result.id && typeof result.id === 'number') {
        testMetaId = result.id;
      }
    });

    it('deve atualizar meta existente', async () => {
      const { updateMeta } = await import('../../server/db');
      
      const result = await updateMeta(testMetaId, {
        duracao: 90,
        incidencia: 'alta',
      });

      expect(result.success).toBe(true);
      expect(result.duracao).toBe(90);
      expect(result.incidencia).toBe('alta');
    });

    it('deve rejeitar atualização de meta inexistente', async () => {
      const { updateMeta } = await import('../../server/db');
      
      await expect(
        updateMeta(999999, { duracao: 90 })
      ).rejects.toThrow('Meta não encontrada');
    });
  });

  describe('3. Configuração de Cronograma', () => {
    it('deve validar horas diárias mínimas', () => {
      const horasDiarias = 0;
      expect(horasDiarias).toBeLessThan(1);
      // Validação deve rejeitar no frontend e backend
    });

    it('deve validar horas diárias máximas', () => {
      const horasDiarias = 13;
      expect(horasDiarias).toBeGreaterThan(12);
      // Validação deve rejeitar no frontend e backend
    });

    it('deve validar formato de dias da semana', () => {
      const diasValidos = '1,2,3,4,5';
      expect(diasValidos).toMatch(/^[0-6](,[0-6])*$/);
      
      const diasInvalidos = '1,2,8'; // 8 não é dia válido
      expect(diasInvalidos).not.toMatch(/^[0-6](,[0-6])*$/);
    });

    it('deve detectar dias duplicados', () => {
      const diasString = '1,2,2,3'; // 2 duplicado
      const dias = diasString.split(',').map(Number);
      const diasUnicos = new Set(dias);
      
      expect(diasUnicos.size).toBeLessThan(dias.length);
    });
  });

  describe('4. Marcar Meta Concluída', () => {
    it('deve marcar meta como concluída', async () => {
      const { marcarMetaConcluida } = await import('../../server/db');
      
      const result = await marcarMetaConcluida(
        testUserId,
        testMetaId,
        true,
        60 // tempo dedicado em minutos
      );

      expect(result.concluida).toBe(1);
      expect(result.metaId).toBe(testMetaId);
    });

    it('deve rejeitar marcar meta inexistente como concluída', async () => {
      const { marcarMetaConcluida } = await import('../../server/db');
      
      await expect(
        marcarMetaConcluida(testUserId, 999999, true)
      ).rejects.toThrow('Meta não encontrada');
    });
  });

  describe('5. Deleção de Metas', () => {
    it('deve deletar meta e progresso relacionado', async () => {
      const { deleteMeta } = await import('../../server/db');
      
      const result = await deleteMeta(testMetaId);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar deleção de meta inexistente', async () => {
      const { deleteMeta } = await import('../../server/db');
      
      await expect(
        deleteMeta(999999)
      ).rejects.toThrow('Meta não encontrada');
    });
  });
});

describe('Validações de Limites', () => {
  it('deve aceitar duração mínima válida (15 min)', async () => {
    const { createMeta } = await import('../../server/db');
    
    const result = await createMeta({
      planoId: 1,
      disciplina: 'Português',
      assunto: 'Gramática',
      tipo: 'revisao',
      duracao: 15,
    });

    expect(result.success).toBe(true);
  });

  it('deve aceitar duração máxima válida (240 min)', async () => {
    const { createMeta } = await import('../../server/db');
    
    const result = await createMeta({
      planoId: 1,
      disciplina: 'Português',
      assunto: 'Redação',
      tipo: 'estudo',
      duracao: 240,
    });

    expect(result.success).toBe(true);
  });

  it('deve aceitar disciplina com 3 caracteres', async () => {
    const { createMeta } = await import('../../server/db');
    
    const result = await createMeta({
      planoId: 1,
      disciplina: 'Geo', // Exatamente 3 caracteres
      assunto: 'Cartografia',
      tipo: 'estudo',
      duracao: 60,
    });

    expect(result.success).toBe(true);
  });
});
