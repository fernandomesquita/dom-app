import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Award, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Download
} from "lucide-react";

export default function DashboardAlunoAdmin() {
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>("");
  const [periodo, setPeriodo] = useState<string>("30"); // dias

  // Queries
  const { data: usuarios } = trpc.adminPanel.usuarios.list.useQuery();
  const { data: progresso, isLoading } = trpc.adminPanel.usuarios.getAlunosComProgresso.useQuery(
    undefined,
    { enabled: !!alunoSelecionado }
  );

  const alunos = usuarios?.filter((u: any) => u.role === "aluno") || [];
  
  const alunoData = alunoSelecionado 
    ? progresso?.find((p: any) => p.id === parseInt(alunoSelecionado))
    : null;

  const handleExportar = () => {
    if (!alunoData) return;

    // Preparar dados para exportação
    const dados = {
      aluno: alunoData.name,
      email: alunoData.email,
      pontos: alunoData.pontos || 0,
      periodo: `Últimos ${periodo} dias`,
      dataExportacao: new Date().toLocaleString("pt-BR"),
    };

    // Criar CSV
    const csv = [
      ["Campo", "Valor"],
      ["Aluno", dados.aluno],
      ["Email", dados.email],
      ["Pontos", dados.pontos],
      ["Período", dados.periodo],
      ["Data de Exportação", dados.dataExportacao],
    ].map(row => row.join(",")).join("\n");

    // Download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_${alunoData.name.replace(/\s/g, "_")}_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Seleção de Aluno e Período */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard do Aluno</CardTitle>
          <CardDescription>
            Visualize o progresso e desempenho individual de cada aluno
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="aluno">Selecionar Aluno</Label>
              <Select value={alunoSelecionado} onValueChange={setAlunoSelecionado}>
                <SelectTrigger id="aluno">
                  <SelectValue placeholder="Escolha um aluno" />
                </SelectTrigger>
                <SelectContent>
                  {alunos.map((aluno: any) => (
                    <SelectItem key={aluno.id} value={aluno.id.toString()}>
                      {aluno.name} ({aluno.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo">Período</Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger id="periodo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo do Dashboard */}
      {!alunoSelecionado ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              Selecione um aluno para visualizar o dashboard
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados...</p>
          </CardContent>
        </Card>
      ) : alunoData ? (
        <>
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{alunoData.pontos || 0}</p>
                    <p className="text-sm text-muted-foreground">Pontos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Metas Concluídas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Aulas Assistidas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0%</p>
                    <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações do Plano Atual */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Plano Atual</CardTitle>
                <Button size="sm" variant="outline" onClick={handleExportar}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Nenhum plano ativo</p>
                    <p className="text-sm text-muted-foreground">
                      Este aluno ainda não possui um plano atribuído
                    </p>
                  </div>
                  <Badge variant="secondary">Sem plano</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Atividade Recente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atividade Recente</CardTitle>
              <CardDescription>
                Últimas {periodo} dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nenhuma atividade registrada</p>
                    <p className="text-xs text-muted-foreground">
                      O aluno ainda não iniciou seus estudos
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    -
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Desempenho por Disciplina */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Desempenho por Disciplina</CardTitle>
              <CardDescription>
                Taxa de acerto em questões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground text-sm">
                  Nenhuma questão respondida ainda
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Progresso Semanal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progresso Semanal</CardTitle>
              <CardDescription>
                Horas de estudo por dia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground text-sm">
                  Nenhum registro de estudo ainda
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              Dados do aluno não encontrados
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
