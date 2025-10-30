/**
 * Sistema de Gamificação do Fórum
 * 10 níveis baseados em pontos acumulados
 */

export interface Badge {
  nivel: number;
  nome: string;
  pontosMinimos: number;
  cor: string;
  icone: string;
}

export const BADGES: Badge[] = [
  { nivel: 1, nome: "Iniciante", pontosMinimos: 0, cor: "#9CA3AF", icone: "🌱" },
  { nivel: 2, nome: "Aprendiz", pontosMinimos: 100, cor: "#10B981", icone: "📚" },
  { nivel: 3, nome: "Estudante", pontosMinimos: 250, cor: "#3B82F6", icone: "🎓" },
  { nivel: 4, nome: "Dedicado", pontosMinimos: 500, cor: "#8B5CF6", icone: "💪" },
  { nivel: 5, nome: "Colaborador", pontosMinimos: 1000, cor: "#EC4899", icone: "🤝" },
  { nivel: 6, nome: "Mentor", pontosMinimos: 2000, cor: "#F59E0B", icone: "🎯" },
  { nivel: 7, nome: "Especialista", pontosMinimos: 4000, cor: "#EF4444", icone: "⭐" },
  { nivel: 8, nome: "Mestre", pontosMinimos: 8000, cor: "#DC2626", icone: "🏆" },
  { nivel: 9, nome: "Sábio", pontosMinimos: 15000, cor: "#7C3AED", icone: "🧙" },
  { nivel: 10, nome: "Lenda", pontosMinimos: 30000, cor: "#FFD700", icone: "👑" },
];

/**
 * Calcula o nível do usuário baseado nos pontos
 */
export function calcularNivel(pontos: number): Badge {
  // Encontrar o maior nível que o usuário atingiu
  for (let i = BADGES.length - 1; i >= 0; i--) {
    if (pontos >= BADGES[i].pontosMinimos) {
      return BADGES[i];
    }
  }
  return BADGES[0]; // Iniciante
}

/**
 * Calcula pontos ganhos por uma resposta
 * - 1 ponto a cada 100 caracteres
 * - Bônus de 50 pontos se for marcada como melhor resposta
 */
export function calcularPontosResposta(conteudo: string, melhorResposta: boolean = false): number {
  const pontosPorExtensao = Math.floor(conteudo.length / 100);
  const bonusMelhorResposta = melhorResposta ? 50 : 0;
  return pontosPorExtensao + bonusMelhorResposta;
}

/**
 * Calcula progresso até o próximo nível (0-100%)
 */
export function calcularProgresso(pontos: number): number {
  const nivelAtual = calcularNivel(pontos);
  const proximoNivel = BADGES.find(b => b.nivel === nivelAtual.nivel + 1);
  
  if (!proximoNivel) {
    return 100; // Já está no nível máximo
  }
  
  const pontosNecessarios = proximoNivel.pontosMinimos - nivelAtual.pontosMinimos;
  const pontosProgresso = pontos - nivelAtual.pontosMinimos;
  
  return Math.min(100, Math.floor((pontosProgresso / pontosNecessarios) * 100));
}
