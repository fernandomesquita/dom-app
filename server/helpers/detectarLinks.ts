/**
 * Detecta URLs em texto
 * Retorna array de links encontrados
 */
export function detectarLinks(texto: string): string[] {
  // Regex para URLs (http, https, www)
  const regexUrl = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
  const links: string[] = [];
  
  let match;
  while ((match = regexUrl.exec(texto)) !== null) {
    links.push(match[0]);
  }
  
  return links;
}

/**
 * Verifica se usuário pode postar links sem moderação
 * Master e Administrativo têm permissão livre
 */
export function podePostarLinksSemModeracao(userRole: string): boolean {
  const rolesPermitidos = ["master", "administrativo"];
  return rolesPermitidos.includes(userRole.toLowerCase());
}
