import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function PontosCard() {
  const { data: pontos, isLoading } = trpc.gamificacao.meusPontos.useQuery();

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Seus Pontos</CardTitle>
        <Star className="h-4 w-4 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{pontos || 0}</div>
        <p className="text-xs text-muted-foreground">
          Continue estudando para ganhar mais pontos!
        </p>
      </CardContent>
    </Card>
  );
}

export function RankingCard() {
  const { data: ranking, isLoading } = trpc.gamificacao.ranking.useQuery();

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Ranking Geral
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ranking?.slice(0, 5).map((user, index) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index === 0 ? "bg-yellow-500/20 text-yellow-500" :
                  index === 1 ? "bg-gray-400/20 text-gray-400" :
                  index === 2 ? "bg-orange-500/20 text-orange-500" :
                  "bg-secondary"
                }`}>
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{user.name || "Usuário"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-bold">{user.pontos}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ConquistasCard() {
  const { data: conquistas, isLoading } = trpc.gamificacao.minhasConquistas.useQuery();

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Minhas Conquistas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {conquistas && conquistas.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {conquistas.map((conquista) => (
              <div
                key={conquista.id}
                className="flex flex-col items-center gap-2 p-3 bg-secondary rounded-lg"
              >
                <Award className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <p className="font-medium text-sm">{conquista.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(conquista.desbloqueadaEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma conquista desbloqueada ainda</p>
            <p className="text-xs mt-1">Continue estudando para ganhar suas primeiras conquistas!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
