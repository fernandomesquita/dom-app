import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, Target, BookOpen, CheckCircle, Flame, 
  Star, Award, Zap, Crown, Medal, Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConquistaBadgeProps {
  nome: string;
  descricao?: string | null;
  icone?: string | null;
  desbloqueada: boolean;
  desbloqueadaEm?: Date | null;
  size?: "sm" | "md" | "lg";
  showDate?: boolean;
}

const iconeMap: Record<string, any> = {
  trophy: Trophy,
  target: Target,
  book: BookOpen,
  check: CheckCircle,
  flame: Flame,
  star: Star,
  award: Award,
  zap: Zap,
  crown: Crown,
  medal: Medal,
  sparkles: Sparkles,
};

export default function ConquistaBadge({
  nome,
  descricao,
  icone,
  desbloqueada,
  desbloqueadaEm,
  size = "md",
  showDate = false,
}: ConquistaBadgeProps) {
  const IconComponent = icone && iconeMap[icone] ? iconeMap[icone] : Trophy;
  
  const sizeClasses = {
    sm: {
      card: "p-3",
      icon: "h-8 w-8",
      title: "text-sm",
      desc: "text-xs",
    },
    md: {
      card: "p-4",
      icon: "h-12 w-12",
      title: "text-base",
      desc: "text-sm",
    },
    lg: {
      card: "p-6",
      icon: "h-16 w-16",
      title: "text-lg",
      desc: "text-base",
    },
  };
  
  const classes = sizeClasses[size];
  
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        desbloqueada
          ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-300 dark:border-yellow-700 hover:shadow-lg hover:scale-105"
          : "bg-muted/50 opacity-60 grayscale"
      )}
    >
      <CardContent className={classes.card}>
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Ícone */}
          <div
            className={cn(
              "rounded-full p-3 transition-all",
              desbloqueada
                ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg"
                : "bg-muted text-muted-foreground"
            )}
          >
            <IconComponent className={classes.icon} />
          </div>
          
          {/* Nome */}
          <h3 className={cn("font-bold", classes.title)}>
            {nome}
          </h3>
          
          {/* Descrição */}
          {descricao && (
            <p className={cn("text-muted-foreground line-clamp-2", classes.desc)}>
              {descricao}
            </p>
          )}
          
          {/* Badge de Status */}
          {desbloqueada ? (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Desbloqueada
            </Badge>
          ) : (
            <Badge variant="secondary">
              Bloqueada
            </Badge>
          )}
          
          {/* Data de Desbloqueio */}
          {showDate && desbloqueada && desbloqueadaEm && (
            <p className="text-xs text-muted-foreground">
              {new Date(desbloqueadaEm).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
        
        {/* Efeito de Brilho (apenas para desbloqueadas) */}
        {desbloqueada && (
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-300/30 to-transparent rounded-full blur-2xl" />
        )}
      </CardContent>
    </Card>
  );
}
