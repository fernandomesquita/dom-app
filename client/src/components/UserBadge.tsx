import { calcularNivel, calcularProgresso } from "@/../../shared/gamification";

interface UserBadgeProps {
  pontos: number;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function UserBadge({ pontos, showProgress = false, size = "md" }: UserBadgeProps) {
  const badge = calcularNivel(pontos);
  const progresso = calcularProgresso(pontos);
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };
  
  return (
    <div className="inline-flex flex-col gap-1">
      <div 
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]}`}
        style={{ backgroundColor: badge.cor + "20", color: badge.cor, border: `1px solid ${badge.cor}` }}
      >
        <span>{badge.icone}</span>
        <span>{badge.nome}</span>
        <span className="text-xs opacity-75">Nv.{badge.nivel}</span>
      </div>
      
      {showProgress && badge.nivel < 10 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300"
              style={{ width: `${progresso}%`, backgroundColor: badge.cor }}
            />
          </div>
          <span>{progresso}%</span>
        </div>
      )}
    </div>
  );
}
