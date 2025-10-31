import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import ConquistaBadge from "@/components/ConquistaBadge";
import { ArrowLeft, Trophy, Target, TrendingUp, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Conquistas() {
  const [, setLocation] = useLocation();
  
  // Queries
  const { data: conquistasUsuario, isLoading, refetch } = trpc.gamificacao.minhasConquistas.useQuery();
  const { data: todasConquistas } = trpc.gamificacao.todasConquistas.useQuery();
  
  // Mutation para verificar conquistas
  const verificarConquistas = trpc.gamificacao.verificarConquistas.useMutation({
    onSuccess: (novasConquistas: unknown) => {
      if (novasConquistas && novasConquistas.length > 0) {
        toast.success(`🎉 Você desbloqueou ${novasConquistas.length} nova(s) conquista(s)!`);
        refetch();
      } else {
        toast.info("Nenhuma nova conquista desbloqueada no momento.");
      }
    },
    onError: () => {
      toast.error("Erro ao verificar conquistas.");
    },
  });
  
  // Preparar dados
  const conquistasDesbloqueadas = conquistasUsuario || [];
  const conquistasIds = new Set(conquistasDesbloqueadas.map(c => c.id));
  
  const todasComStatus = todasConquistas?.map((conquista: any) => ({
    ...conquista,
    desbloqueada: conquistasIds.has(conquista.id),
    desbloqueadaEm: conquistasDesbloqueadas.find(c => c.id === conquista.id)?.desbloqueadaEm,
  })) || [];
  
  // Estatísticas
  const totalConquistas = todasConquistas?.length || 0;
  const conquistasDesbloqueadasCount = conquistasDesbloqueadas.length;
  const porcentagemConclusao = totalConquistas > 0 
    ? Math.round((conquistasDesbloqueadasCount / totalConquistas) * 100) 
    : 0;
  
  // Agrupar por tipo
  const conquistasPorTipo = todasComStatus.reduce((acc: any, conquista: any) => {
    const tipo = conquista.tipo || 'especial';
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(conquista);
    return acc;
  }, {} as Record<string, typeof todasComStatus>);
  
  const tipoLabels: Record<string, string> = {
    meta: "Metas",
    aula: "Aulas",
    questao: "Questões",
    sequencia: "Sequências",
    especial: "Especiais",
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando conquistas...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Breadcrumb items={[{ label: "Conquistas" }]} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Minhas Conquistas
            </h1>
            <p className="text-muted-foreground mt-2">
              Desbloqueie conquistas ao atingir marcos importantes nos seus estudos
            </p>
          </div>
          
          <Button 
            onClick={() => verificarConquistas.mutate()}
            disabled={verificarConquistas.isPending}
          >
            {verificarConquistas.isPending ? "Verificando..." : "Verificar Conquistas"}
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Total de Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConquistas}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Disponíveis na plataforma
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Desbloqueadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {conquistasDesbloqueadasCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Você já conquistou
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Bloqueadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {totalConquistas - conquistasDesbloqueadasCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ainda faltam desbloquear
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {porcentagemConclusao}%
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${porcentagemConclusao}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conquistas por Tipo */}
        {Object.entries(conquistasPorTipo).map(([tipo, conquistas]) => (
          <div key={tipo} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{tipoLabels[tipo] || tipo}</h2>
              <Badge variant="outline">
                {conquistas.filter((c: any) => c.desbloqueada).length} / {conquistas.length}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {conquistas.map((conquista: any) => (
                <ConquistaBadge
                  key={conquista.id}
                  nome={conquista.nome}
                  descricao={conquista.descricao}
                  icone={conquista.icone}
                  desbloqueada={conquista.desbloqueada}
                  desbloqueadaEm={conquista.desbloqueadaEm}
                  size="md"
                  showDate={true}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {todasConquistas && todasConquistas.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma conquista disponível</h3>
              <p className="text-muted-foreground">
                As conquistas serão adicionadas em breve!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
