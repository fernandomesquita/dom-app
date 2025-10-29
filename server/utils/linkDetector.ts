/**
 * Utilitário para detectar links em texto
 */

// Regex para detectar URLs (http, https, www, domínios comuns)
const URL_REGEX = /(?:https?:\/\/|www\.)[^\s]+|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/gi;

/**
 * Detecta se um texto contém links/URLs
 */
export function contemLinks(texto: string): boolean {
  if (!texto) return false;
  return URL_REGEX.test(texto);
}

/**
 * Extrai todos os links encontrados em um texto
 */
export function extrairLinks(texto: string): string[] {
  if (!texto) return [];
  const matches = texto.match(URL_REGEX);
  return matches ? Array.from(new Set(matches)) : [];
}

/**
 * Verifica se o texto contém links e retorna informações detalhadas
 */
export function analisarLinks(texto: string): {
  contemLinks: boolean;
  links: string[];
  quantidade: number;
} {
  const links = extrairLinks(texto);
  return {
    contemLinks: links.length > 0,
    links,
    quantidade: links.length,
  };
}
