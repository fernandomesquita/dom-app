import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeft, TrendingUp, Target, Clock, Award, BarChart3, PieChart, LineChart } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function EstatisticasQuestoes() {
  const [, setLocation] = useLocation();
  
  const { data: estatisticasGerais } = trpc.questoes.estatisticas.useQuery();
  const { data: estatisticasPorDisciplina } = trpc.questoes.estatisticasPorDisciplina.useQuery();
  const { data: evolucaoTemporal } = trpc.questoes.evolucaoTemporal.useQuery({ dias: 30 });
  const { data: questoesMaisErradas } = trpc.questoes.questoesMaisErradas.useQuery({ limit: 10 });

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/questoes")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Breadcrumb items={[
            { label: "Questões", href: "/questoes" },
            { label: "Estatísticas Avançadas" }
          ]} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Estatísticas Avançadas</h1>
          <p className="text-muted-foreground mt-2">
            Análise detalhada do seu desempenho em questões
          </p>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Total Respondidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticasGerais?.total || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Taxa de Acerto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{estatisticasGerais?.taxaAcerto || 0}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {estatisticasGerais?.corretas || 0} acertos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                Acertos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{estatisticasGerais?.corretas || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Erros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {(estatisticasGerais?.total || 0) - (estatisticasGerais?.corretas || 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desempenho por Disciplina */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Desempenho por Disciplina
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {estatisticasPorDisciplina && estatisticasPorDisciplina.length > 0 ? (
                estatisticasPorDisciplina.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{stat.disciplina}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {stat.corretas}/{stat.total}
                        </span>
                        <Badge variant={stat.taxaAcerto >= 70 ? "default" : "destructive"}>
                          {stat.taxaAcerto}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          stat.taxaAcerto >= 70 ? "bg-green-600" : "bg-red-600"
                        }`}
                        style={{ width: `${stat.taxaAcerto}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma questão respondida ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Evolução Temporal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Evolução nos Últimos 30 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            {evolucaoTemporal && evolucaoTemporal.length > 0 ? (
              <div className="space-y-2">
                {evolucaoTemporal.slice(-10).map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">{new Date(item.data).toLocaleDateString('pt-BR')}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{item.total} questões</span>
                      <Badge variant={item.taxaAcerto >= 70 ? "default" : "destructive"}>
                        {item.taxaAcerto}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Sem dados de evolução temporal
              </p>
            )}
          </CardContent>
        </Card>

        {/* Questões Mais Erradas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Questões Mais Erradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {questoesMaisErradas && questoesMaisErradas.length > 0 ? (
              <div className="space-y-3">
                {questoesMaisErradas.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">Questão #{item.questaoId}</span>
                    </div>
                    <Badge variant="destructive">{item.erros} erros</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma questão errada registrada
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
