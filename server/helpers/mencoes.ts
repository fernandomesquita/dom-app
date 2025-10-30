/**
 * Detecta menções @usuario em texto
 * Retorna array de usernames mencionados (sem duplicatas)
 */
export function detectarMencoes(texto: string): string[] {
  // Regex para @username (letras, números, underscore, hífen)
  const regex = /@([\w-]+)/g;
  const mencoes = new Set<string>();
  
  let match;
  while ((match = regex.exec(texto)) !== null) {
    mencoes.add(match[1].toLowerCase());
  }
  
  return Array.from(mencoes);
}

/**
 * Busca IDs de usuários a partir de usernames/nomes
 */
export async function buscarUserIdsPorNomes(nomes: string[]): Promise<number[]> {
  const { getDb } = await import("../db");
  const db = await getDb();
  if (!db) return [];
  
  const { users } = await import("../../drizzle/schema");
  const { or, sql } = await import("drizzle-orm");
  
  if (nomes.length === 0) return [];
  
  // Buscar por nome ou email (case insensitive)
  const conditions = nomes.map(nome => 
    sql`LOWER(${users.name}) = ${nome.toLowerCase()} OR LOWER(${users.email}) LIKE ${`%${nome.toLowerCase()}%`}`
  );
  
  const resultado = await db.select({ id: users.id })
    .from(users)
    .where(or(...conditions));
  
  return resultado.map(u => u.id);
}
