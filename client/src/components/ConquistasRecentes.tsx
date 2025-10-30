import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConquistaBadge from "./ConquistaBadge";
import { Trophy, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function ConquistasRecentes() {
  const [, setLocation] = useLocation();
  
  const { data: conquistasUsuario, isLoading } = trpc.gamificacao.minhasConquistas.useQuery();
  
  // Pegar as 3 conquistas mais recentes
  const conquistasRecentes = conquistasUsuario
    ?.sort((a, b) => new Date(b.desbloqueadaEm).getTime() - new Date(a.desbloqueadaEm).getTime())
    .slice(0, 3) || [];
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Conquistas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Conquistas Recentes
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/conquistas")}
          >
            Ver todas
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {conquistasRecentes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {conquistasRecentes.map((conquista) => (
              <ConquistaBadge
                key={conquista.id}
                nome={conquista.nome}
                descricao={conquista.descricao}
                icone={conquista.icone}
                desbloqueada={true}
                desbloqueadaEm={conquista.desbloqueadaEm}
                size="sm"
                showDate={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhuma conquista desbloqueada ainda</p>
            <p className="text-xs mt-1">Complete metas e questões para ganhar conquistas!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
