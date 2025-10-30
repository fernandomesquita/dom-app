import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import { 
  ArrowLeft, TrendingUp, Target, Clock, Award, 
  BarChart3, PieChart, LineChart, AlertCircle 
} from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function EstatisticasQuestoes() {
  const [, setLocation] = useLocation();
  
  const { data: estatisticasGerais, isLoading: loadingGerais } = trpc.questoes.estatisticas.useQuery();
  const { data: estatisticasPorDisciplina, isLoading: loadingDisciplina } = trpc.questoes.estatisticasPorDisciplina.useQuery();
  const { data: evolucaoTemporal, isLoading: loadingEvolucao } = trpc.questoes.evolucaoTemporal.useQuery({ dias: 30 });
  const { data: questoesMaisErradas, isLoading: loadingErradas } = trpc.questoes.questoesMaisErradas.useQuery({ limit: 10 });

  // Preparar dados para gráficos
  const dadosDisciplina = estatisticasPorDisciplina?.map(d => ({
    disciplina: d.disciplina.length > 20 ? d.disciplina.substring(0, 20) + '...' : d.disciplina,
    taxaAcerto: parseFloat(d.taxaAcerto.toFixed(1)),
    total: d.total,
  })) || [];

  const dadosEvolucao = evolucaoTemporal?.map(e => ({
    data: new Date(e.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    taxaAcerto: parseFloat(e.taxaAcerto.toFixed(1)),
    total: e.total,
  })) || [];

  // Dados para gráfico de pizza (distribuição de acertos/erros)
  const dadosPizza = [
    { name: 'Acertos', value: estatisticasGerais?.corretas || 0 },
    { name: 'Erros', value: (estatisticasGerais?.total || 0) - (estatisticasGerais?.corretas || 0) },
  ];

  const isLoading = loadingGerais || loadingDisciplina || loadingEvolucao || loadingErradas;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

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

        {/* Cards de Resumo */}
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
              <p className="text-xs text-muted-foreground mt-1">
                Questões resolvidas
              </p>
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
              <div className="text-2xl font-bold text-green-600">
                {estatisticasGerais?.taxaAcerto?.toFixed(1) || 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Desempenho geral
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
              <div className="text-2xl font-bold text-green-600">
                {estatisticasGerais?.corretas || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Respostas corretas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Erros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {(estatisticasGerais?.total || 0) - (estatisticasGerais?.corretas || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Para revisar
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Gráfico: Desempenho por Disciplina */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Desempenho por Disciplina
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dadosDisciplina.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosDisciplina} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="disciplina" type="category" width={150} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{payload[0].payload.disciplina}</p>
                              <p className="text-sm text-green-600">
                                Taxa: {payload[0].value}%
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Total: {payload[0].payload.total} questões
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="taxaAcerto" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico: Distribuição Acertos/Erros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Distribuição de Respostas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dadosPizza[0].value > 0 || dadosPizza[1].value > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={dadosPizza}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráfico: Evolução Temporal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Evolução nos Últimos 30 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dadosEvolucao.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={dadosEvolucao}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{payload[0].payload.data}</p>
                            <p className="text-sm text-blue-600">
                              Taxa: {payload[0].value}%
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Total: {payload[0].payload.total} questões
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="taxaAcerto" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Taxa de Acerto (%)"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível nos últimos 30 dias
              </div>
            )}
          </CardContent>
        </Card>

        {/* Questões Mais Erradas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Questões Mais Erradas (Top 10)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {questoesMaisErradas && questoesMaisErradas.length > 0 ? (
              <div className="space-y-3">
                {questoesMaisErradas.map((questao, index) => (
                  <div 
                    key={questao.questaoId}
                    className="flex items-start justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <Badge variant="outline">{questao.disciplina}</Badge>
                        {questao.banca && (
                          <Badge variant="secondary" className="text-xs">
                            {questao.banca}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm line-clamp-2">{questao.enunciado}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Tentativas: {questao.tentativas}</span>
                        <span>Erros: {questao.erros}</span>
                        <span className="text-red-600 font-medium">
                          Taxa de erro: {questao.taxaErro.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLocation(`/questoes/resolver?id=${questao.questaoId}`)}
                    >
                      Revisar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma questão com erros registrados
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
