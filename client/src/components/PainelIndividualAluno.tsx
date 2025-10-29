import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Edit, 
  Settings, 
  Bell,
  CheckCircle,
  XCircle,
  BarChart3
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface PainelIndividualAlunoProps {
  alunoId: number;
  onVoltar: () => void;
}

export default function PainelIndividualAluno({ alunoId, onVoltar }: PainelIndividualAlunoProps) {
  const [tabAtiva, setTabAtiva] = useState("visao-geral");

  // Buscar dados do aluno
  const { data: dadosAluno, isLoading } = trpc.admin.getDadosAluno.useQuery({ alunoId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando dados do aluno...</p>
        </div>
      </div>
    );
  }

  if (!dadosAluno) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">Aluno não encontrado</p>
          <Button onClick={onVoltar}>Voltar</Button>
        </div>
      </div>
    );
  }

  const { aluno, metricas, metas, historico } = dadosAluno;

  const taxaConclusao = metricas.totalMetas > 0 
    ? Math.round((metricas.metasConcluidas / metricas.totalMetas) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onVoltar}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{aluno.nome}</h1>
            <p className="text-muted-foreground">{aluno.email}</p>
          </div>
          <Badge variant={aluno.ativo ? "default" : "secondary"}>
            {aluno.ativo ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
            <Bell className="h-4 w-4 mr-2" />
            Enviar Aviso
          </Button>
          <Button variant="outline" onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar Cronograma
          </Button>
          <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
            <Edit className="h-4 w-4 mr-2" />
            Alterar Plano
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Metas Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricas.metasConcluidas}</div>
            <p className="text-xs text-muted-foreground">de {metricas.totalMetas} metas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Horas Estudadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricas.horasEstudadas}h</div>
            <p className="text-xs text-muted-foreground">tempo total dedicado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Taxa de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{taxaConclusao}%</div>
            <p className="text-xs text-muted-foreground">metas finalizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              Sequência Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metricas.sequenciaDias}</div>
            <p className="text-xs text-muted-foreground">dias consecutivos</p>
          </CardContent>
        </Card>
      </div>

      {/* Plano Atual */}
      {aluno.planoAtual && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Plano de Estudos Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">{aluno.planoAtual.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {aluno.planoAtual.orgao} - {aluno.planoAtual.cargo}
                  </p>
                </div>
                <Badge variant="outline">
                  {aluno.planoAtual.totalMetas} metas
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Início: {new Date(aluno.planoAtual.dataInicio).toLocaleDateString('pt-BR')}</span>
                {aluno.planoAtual.dataTermino && (
                  <span>Término previsto: {new Date(aluno.planoAtual.dataTermino).toLocaleDateString('pt-BR')}</span>
                )}
              </div>
              {/* Barra de Progresso */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso no Plano</span>
                  <span className="font-semibold">{taxaConclusao}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300" 
                    style={{ width: `${taxaConclusao}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={tabAtiva} onValueChange={setTabAtiva}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="metas">Metas</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        {/* Tab: Visão Geral */}
        <TabsContent value="visao-geral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução nos Últimos 30 Dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>Gráfico de evolução será implementado aqui</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Disciplinas Estudadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metricas.disciplinas?.map((disc: any) => (
                    <div key={disc.nome} className="flex items-center justify-between">
                      <span className="text-sm">{disc.nome}</span>
                      <Badge variant="outline">{disc.metas} metas</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tipos de Atividade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estudo</span>
                    <Badge className="bg-blue-100 text-blue-800">{metricas.tipoEstudo || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Revisão</span>
                    <Badge className="bg-purple-100 text-purple-800">{metricas.tipoRevisao || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Questões</span>
                    <Badge className="bg-green-100 text-green-800">{metricas.tipoQuestoes || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Metas */}
        <TabsContent value="metas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Metas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metas?.map((meta: any) => (
                  <div 
                    key={meta.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {meta.concluida ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{meta.disciplina}</p>
                        <p className="text-sm text-muted-foreground">{meta.assunto}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={meta.concluida ? "default" : "outline"}>
                        {meta.tipo}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{meta.duracao}min</span>
                      {meta.dataAgendada && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(meta.dataAgendada).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Histórico */}
        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Atividades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {historico?.map((item: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 border-l-2 border-primary">
                    <div className="flex-1">
                      <p className="font-medium">{item.acao}</p>
                      <p className="text-sm text-muted-foreground">{item.detalhes}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(item.data).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
