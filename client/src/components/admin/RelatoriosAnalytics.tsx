import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, Target, Clock, Award, Calendar } from "lucide-react";
import { useState } from "react";

export default function RelatoriosAnalytics() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("30dias");
  const [planoSelecionado, setPlanoSelecionado] = useState("todos");

  // Dados mockados para os gráficos
  const dadosDesempenho = {
    metasConcluidas: [12, 15, 18, 22, 19, 25, 28],
    horasEstudadas: [4.2, 4.5, 3.8, 5.1, 4.8, 5.3, 4.9],
    questoesResolvidas: [45, 52, 48, 61, 55, 68, 72],
    diasSemana: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
  };

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Relatórios e Analytics
          </h2>
          <p className="text-muted-foreground">
            Visualize métricas e desempenho dos alunos
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="30dias">Últimos 30 dias</SelectItem>
              <SelectItem value="3meses">Últimos 3 meses</SelectItem>
              <SelectItem value="ano">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planoSelecionado} onValueChange={setPlanoSelecionado}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Planos</SelectItem>
              <SelectItem value="1">TJ-SP 2025</SelectItem>
              <SelectItem value="2">OAB XXXIX</SelectItem>
              <SelectItem value="3">Magistratura Federal</SelectItem>
              <SelectItem value="4">MPF 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Alunos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">187</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Taxa de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">89%</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +5% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Média de Horas/Dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.6h</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +0.8h vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4" />
              Questões Resolvidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12,345</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +18% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Relatórios */}
      <Tabs defaultValue="desempenho" className="space-y-6">
        <TabsList>
          <TabsTrigger value="desempenho">Desempenho Geral</TabsTrigger>
          <TabsTrigger value="alunos">Por Aluno</TabsTrigger>
          <TabsTrigger value="disciplinas">Por Disciplina</TabsTrigger>
          <TabsTrigger value="planos">Por Plano</TabsTrigger>
        </TabsList>

        {/* Tab: Desempenho Geral */}
        <TabsContent value="desempenho" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfico de Metas Concluídas */}
            <Card>
              <CardHeader>
                <CardTitle>Metas Concluídas por Dia</CardTitle>
                <CardDescription>Últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {dadosDesempenho.metasConcluidas.map((valor, index) => {
                    const maxValor = Math.max(...dadosDesempenho.metasConcluidas);
                    const altura = (valor / maxValor) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs font-semibold text-muted-foreground">{valor}</div>
                        <div 
                          className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${altura}%` }}
                        />
                        <div className="text-xs text-muted-foreground">{dadosDesempenho.diasSemana[index]}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Horas Estudadas */}
            <Card>
              <CardHeader>
                <CardTitle>Horas de Estudo por Dia</CardTitle>
                <CardDescription>Últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {dadosDesempenho.horasEstudadas.map((valor, index) => {
                    const maxValor = Math.max(...dadosDesempenho.horasEstudadas);
                    const altura = (valor / maxValor) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs font-semibold text-muted-foreground">{valor.toFixed(1)}h</div>
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${altura}%` }}
                        />
                        <div className="text-xs text-muted-foreground">{dadosDesempenho.diasSemana[index]}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Questões Resolvidas */}
            <Card>
              <CardHeader>
                <CardTitle>Questões Resolvidas por Dia</CardTitle>
                <CardDescription>Últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {dadosDesempenho.questoesResolvidas.map((valor, index) => {
                    const maxValor = Math.max(...dadosDesempenho.questoesResolvidas);
                    const altura = (valor / maxValor) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs font-semibold text-muted-foreground">{valor}</div>
                        <div 
                          className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${altura}%` }}
                        />
                        <div className="text-xs text-muted-foreground">{dadosDesempenho.diasSemana[index]}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Distribuição de Atividades */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Atividades</CardTitle>
                <CardDescription>Por tipo de meta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Estudo</span>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "45%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Revisão</span>
                      <span className="text-sm text-muted-foreground">30%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: "30%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Questões</span>
                      <span className="text-sm text-muted-foreground">25%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "25%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Por Aluno */}
        <TabsContent value="alunos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ranking de Alunos</CardTitle>
              <CardDescription>Top 10 alunos por desempenho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { nome: "João Silva", metas: 142, horas: 89.5, questoes: 1234, taxa: 94 },
                  { nome: "Maria Santos", metas: 138, horas: 85.2, questoes: 1189, taxa: 92 },
                  { nome: "Pedro Costa", metas: 135, horas: 82.3, questoes: 1156, taxa: 91 },
                  { nome: "Ana Lima", metas: 128, horas: 78.1, questoes: 1098, taxa: 89 },
                  { nome: "Carlos Souza", metas: 125, horas: 75.8, questoes: 1045, taxa: 88 },
                ].map((aluno, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-accent rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{aluno.nome}</div>
                      <div className="text-xs text-muted-foreground">
                        {aluno.metas} metas • {aluno.horas}h • {aluno.questoes} questões
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{aluno.taxa}%</div>
                      <div className="text-xs text-muted-foreground">Taxa de conclusão</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Por Disciplina */}
        <TabsContent value="disciplinas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Disciplina</CardTitle>
              <CardDescription>Métricas detalhadas por área de estudo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { nome: "Direito Constitucional", metas: 45, taxa: 92, horas: 28.5 },
                  { nome: "Direito Administrativo", metas: 38, taxa: 88, horas: 24.2 },
                  { nome: "Direito Penal", metas: 42, taxa: 90, horas: 26.8 },
                  { nome: "Direito Civil", metas: 40, taxa: 85, horas: 25.3 },
                  { nome: "Direito Processual", metas: 35, taxa: 87, horas: 22.1 },
                ].map((disciplina, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{disciplina.nome}</span>
                      <span className="text-sm text-muted-foreground">
                        {disciplina.metas} metas • {disciplina.horas}h
                      </span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary/60" 
                        style={{ width: `${disciplina.taxa}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {disciplina.taxa}% de conclusão
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Por Plano */}
        <TabsContent value="planos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { nome: "TJ-SP 2025", alunos: 45, metasConcluidas: 89, horasTotal: 1234, taxaConclusao: 91 },
              { nome: "OAB XXXIX", alunos: 78, metasConcluidas: 92, horasTotal: 2156, taxaConclusao: 88 },
              { nome: "Magistratura Federal", alunos: 23, metasConcluidas: 85, horasTotal: 987, taxaConclusao: 93 },
              { nome: "MPF 2025", alunos: 34, metasConcluidas: 87, horasTotal: 1456, taxaConclusao: 90 },
            ].map((plano, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{plano.nome}</CardTitle>
                  <CardDescription>{plano.alunos} alunos matriculados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-primary">{plano.metasConcluidas}%</div>
                        <div className="text-xs text-muted-foreground">Metas concluídas</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">{plano.horasTotal}h</div>
                        <div className="text-xs text-muted-foreground">Horas totais</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">{plano.taxaConclusao}%</div>
                        <div className="text-xs text-muted-foreground">Taxa de conclusão</div>
                      </div>
                    </div>
                    <div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/60" 
                          style={{ width: `${plano.taxaConclusao}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
