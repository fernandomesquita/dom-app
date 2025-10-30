/**
 * Seed de permissões padrão do sistema
 * Execute com: tsx server/seedPermissions.ts
 */

import { getDb } from "./db";
import { permissions, rolePermissions } from "../drizzle/schema";

const PERMISSIONS = [
  // Usuários
  { name: "usuarios.visualizar", description: "Visualizar lista de usuários", module: "usuarios" },
  { name: "usuarios.criar", description: "Criar novos usuários", module: "usuarios" },
  { name: "usuarios.editar", description: "Editar dados de usuários", module: "usuarios" },
  { name: "usuarios.excluir", description: "Excluir usuários", module: "usuarios" },
  { name: "usuarios.importar", description: "Importar usuários em lote", module: "usuarios" },
  
  // Planos
  { name: "planos.visualizar", description: "Visualizar planos de estudo", module: "planos" },
  { name: "planos.criar", description: "Criar novos planos", module: "planos" },
  { name: "planos.editar", description: "Editar planos existentes", module: "planos" },
  { name: "planos.excluir", description: "Excluir planos", module: "planos" },
  { name: "planos.atribuir", description: "Atribuir planos a alunos", module: "planos" },
  
  // Matrículas
  { name: "matriculas.visualizar", description: "Visualizar matrículas", module: "matriculas" },
  { name: "matriculas.editar", description: "Editar matrículas", module: "matriculas" },
  { name: "matriculas.cancelar", description: "Cancelar matrículas", module: "matriculas" },
  
  // Metas
  { name: "metas.visualizar", description: "Visualizar metas de estudo", module: "metas" },
  { name: "metas.criar", description: "Criar novas metas", module: "metas" },
  { name: "metas.editar", description: "Editar metas existentes", module: "metas" },
  { name: "metas.excluir", description: "Excluir metas", module: "metas" },
  
  // Aulas
  { name: "aulas.visualizar", description: "Visualizar aulas", module: "aulas" },
  { name: "aulas.criar", description: "Criar novas aulas", module: "aulas" },
  { name: "aulas.editar", description: "Editar aulas existentes", module: "aulas" },
  { name: "aulas.excluir", description: "Excluir aulas", module: "aulas" },
  
  // Questões
  { name: "questoes.visualizar", description: "Visualizar questões", module: "questoes" },
  { name: "questoes.criar", description: "Criar novas questões", module: "questoes" },
  { name: "questoes.editar", description: "Editar questões existentes", module: "questoes" },
  { name: "questoes.excluir", description: "Excluir questões", module: "questoes" },
  { name: "questoes.responder", description: "Responder questões", module: "questoes" },
  
  // Fórum
  { name: "forum.visualizar", description: "Visualizar tópicos do fórum", module: "forum" },
  { name: "forum.criar", description: "Criar tópicos e respostas", module: "forum" },
  { name: "forum.editar", description: "Editar próprias mensagens", module: "forum" },
  { name: "forum.excluir", description: "Excluir próprias mensagens", module: "forum" },
  { name: "forum.moderar", description: "Moderar todo o fórum", module: "forum" },
  
  // Relatórios
  { name: "relatorios.visualizar", description: "Visualizar relatórios gerais", module: "relatorios" },
  { name: "relatorios.exportar", description: "Exportar relatórios", module: "relatorios" },
  
  // Auditoria
  { name: "auditoria.visualizar", description: "Visualizar logs de auditoria", module: "auditoria" },
  
  // Configurações
  { name: "configuracoes.visualizar", description: "Visualizar configurações do sistema", module: "configuracoes" },
  { name: "configuracoes.editar", description: "Editar configurações do sistema", module: "configuracoes" },
  
  // Permissões
  { name: "permissoes.visualizar", description: "Visualizar permissões", module: "permissoes" },
  { name: "permissoes.gerenciar", description: "Gerenciar permissões de roles", module: "permissoes" },
];

// Mapeamento de permissões por role
const ROLE_PERMISSIONS: Record<string, string[]> = {
  // Aluno: acesso básico
  aluno: [
    "planos.visualizar",
    "metas.visualizar",
    "metas.criar",
    "metas.editar",
    "aulas.visualizar",
    "questoes.visualizar",
    "questoes.responder",
    "forum.visualizar",
    "forum.criar",
    "forum.editar",
    "forum.excluir",
    "relatorios.visualizar",
  ],
  
  // Professor: gestão de conteúdo
  professor: [
    "planos.visualizar",
    "planos.criar",
    "planos.editar",
    "metas.visualizar",
    "metas.criar",
    "metas.editar",
    "metas.excluir",
    "aulas.visualizar",
    "aulas.criar",
    "aulas.editar",
    "aulas.excluir",
    "questoes.visualizar",
    "questoes.criar",
    "questoes.editar",
    "questoes.excluir",
    "questoes.responder",
    "forum.visualizar",
    "forum.criar",
    "forum.editar",
    "forum.excluir",
    "forum.moderar",
    "relatorios.visualizar",
    "relatorios.exportar",
  ],
  
  // Administrativo: suporte operacional
  administrativo: [
    "usuarios.visualizar",
    "usuarios.criar",
    "usuarios.editar",
    "usuarios.importar",
    "planos.visualizar",
    "planos.atribuir",
    "matriculas.visualizar",
    "matriculas.editar",
    "matriculas.cancelar",
    "metas.visualizar",
    "aulas.visualizar",
    "questoes.visualizar",
    "forum.visualizar",
    "forum.moderar",
    "relatorios.visualizar",
    "relatorios.exportar",
    "auditoria.visualizar",
  ],
  
  // Mentor: gestão pedagógica completa
  mentor: [
    "usuarios.visualizar",
    "usuarios.criar",
    "usuarios.editar",
    "usuarios.importar",
    "planos.visualizar",
    "planos.criar",
    "planos.editar",
    "planos.atribuir",
    "matriculas.visualizar",
    "matriculas.editar",
    "matriculas.cancelar",
    "metas.visualizar",
    "metas.criar",
    "metas.editar",
    "metas.excluir",
    "aulas.visualizar",
    "aulas.criar",
    "aulas.editar",
    "aulas.excluir",
    "questoes.visualizar",
    "questoes.criar",
    "questoes.editar",
    "questoes.excluir",
    "forum.visualizar",
    "forum.criar",
    "forum.editar",
    "forum.excluir",
    "forum.moderar",
    "relatorios.visualizar",
    "relatorios.exportar",
    "auditoria.visualizar",
    "configuracoes.visualizar",
  ],
  
  // Master: acesso total
  master: PERMISSIONS.map(p => p.name),
};

async function seed() {
  console.log("🌱 Iniciando seed de permissões...");
  
  const db = await getDb();
  if (!db) {
    console.error("❌ Erro: Database não disponível");
    process.exit(1);
  }

  try {
    // 1. Inserir permissões
    console.log("📝 Inserindo permissões...");
    for (const permission of PERMISSIONS) {
      try {
        await db.insert(permissions).values(permission);
      } catch (error: any) {
        // Ignorar erro de duplicata
        if (!error.message?.includes("Duplicate entry")) {
          throw error;
        }
      }
    }
    console.log(`✅ ${PERMISSIONS.length} permissões inseridas`);

    // 2. Buscar IDs das permissões
    const allPermissions = await db.select().from(permissions);
    const permissionMap = new Map(allPermissions.map(p => [p.name, p.id]));

    // 3. Inserir role_permissions
    console.log("🔗 Vinculando permissões a roles...");
    let totalLinks = 0;
    
    for (const [role, permissionNames] of Object.entries(ROLE_PERMISSIONS)) {
      for (const permissionName of permissionNames) {
        const permissionId = permissionMap.get(permissionName);
        if (permissionId) {
          try {
            await db.insert(rolePermissions).values({
              role: role as any,
              permissionId,
            });
            totalLinks++;
          } catch (error: any) {
            // Ignorar erro de duplicata
            if (!error.message?.includes("Duplicate entry")) {
              throw error;
            }
          }
        }
      }
    }
    
    console.log(`✅ ${totalLinks} vínculos criados`);
    console.log("🎉 Seed concluído com sucesso!");
    
    // Resumo
    console.log("\n📊 Resumo de permissões por role:");
    for (const [role, permissionNames] of Object.entries(ROLE_PERMISSIONS)) {
      console.log(`  ${role}: ${permissionNames.length} permissões`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    process.exit(1);
  }
}

seed();
