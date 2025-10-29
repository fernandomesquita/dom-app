import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle, Clock, TrendingUp, BookOpen, Target, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface ItemRevisao {
  id: number;
  tipo: "meta" | "aula" | "questao";
  titulo: string;
  disciplina: string;
  dataOriginal: Date;
  proximaRevisao: Date;
  ciclo: number; // 1 = 1 dia, 2 = 7 dias, 3 = 30 dias, 4 = 90 dias
  concluida: boolean;
}

export default function Revisao() {
  const [, setLocation] = useLocation();
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(new Date());
  
  const [itensRevisao, setItensRevisao] = useState<ItemRevisao[]>([
    {
      id: 1,
      tipo: "meta",
      titulo: "Direitos Fundamentais - Teoria",
      disciplina: "Direito Constitucional",
      dataOriginal: new Date("2025-01-20"),
      proximaRevisao: new Date("2025-01-27"),
      ciclo: 2,
      concluida: false,
    },
    {
      id: 2,
      tipo: "aula",
      titulo: "Princípios da Administração Pública",
      disciplina: "Direito Administrativo",
      dataOriginal: new Date("2025-01-18"),
      proximaRevisao: new Date("2025-01-25"),
      ciclo: 2,
      concluida: true,
    },
    {
      id: 3,
      tipo: "questao",
      titulo: "Questão CESPE 2023 - Legalidade",
      disciplina: "Direito Administrativo",
      dataOriginal: new Date("2025-01-15"),
      proximaRevisao: new Date("2025-02-14"),
      ciclo: 3,
      concluida: false,
    },
    {
      id: 4,
      tipo: "meta",
      titulo: "Teoria do Crime - Elementos",
      disciplina: "Direito Penal",
      dataOriginal: new Date("2025-01-22"),
      proximaRevisao: new Date("2025-01-29"),
      ciclo: 2,
      concluida: false,
    },
    {
      id: 5,
      tipo: "aula",
      titulo: "Contratos - Função Social",
      disciplina: "Direito Civil",
      dataOriginal: new Date("2025-01-19"),
      proximaRevisao: new Date("2025-01-26"),
      ciclo: 2,
      concluida: false,
    },
  ]);

  const [estatisticas] = useState({
    totalRevisoes: 42,
    revisoesRealizadas: 35,
    revisoesPendentes: 7,
    taxaCumprimento: 83,
  });

  const getCicloInfo = (ciclo: number) => {
    switch (ciclo) {
      case 1:
        return { label: "1º Ciclo (1 dia)", color: "bg-blue-100 text-blue-800" };
      case 2:
        return { label: "2º Ciclo (7 dias)", color: "bg-green-100 text-green-800" };
      case 3:
        return { label: "3º Ciclo (30 dias)", color: "bg-yellow-100 text-yellow-800" };
      case 4:
        return { label: "4º Ciclo (90 dias)", color: "bg-purple-100 text-purple-800" };
      default:
        return { label: "Ciclo desconhecido", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "meta":
        return <Target className="h-4 w-4" />;
      case "aula":
        return <BookOpen className="h-4 w-4" />;
      case "questao":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "meta":
        return "Meta";
      case "aula":
        return "Aula";
      case "questao":
        return "Questão";
      default:
        return tipo;
    }
  };

  const handleMarcarConcluida = (id: number) => {
    setItensRevisao(itensRevisao.map(item => {
      if (item.id === id) {
        // Calcular próxima revisão baseada no ciclo
        const proximoCiclo = item.ciclo + 1;
        let diasProxima = 0;
        
        switch (proximoCiclo) {
          case 2:
            diasProxima = 7;
            break;
          case 3:
            diasProxima = 30;
            break;
          case 4:
            diasProxima = 90;
            break;
          default:
            diasProxima = 0; // Fim dos ciclos
        }

        const novaData = new Date();
        novaData.setDate(novaData.getDate() + diasProxima);

        return {
          ...item,
          concluida: true,
          ciclo: proximoCiclo <= 4 ? proximoCiclo : item.ciclo,
          proximaRevisao: diasProxima > 0 ? novaData : item.proximaRevisao,
        };
      }
      return item;
    }));
    toast.success("Revisão marcada como concluída! Próxima revisão agendada.");
  };

  const handleAdiar = (id: number) => {
    setItensRevisao(itensRevisao.map(item => {
      if (item.id === id) {
        const novaData = new Date(item.proximaRevisao);
        novaData.setDate(novaData.getDate() + 1);
        return { ...item, proximaRevisao: novaData };
      }
      return item;
    }));
    toast.info("Revisão adiada para amanhã");
  };

  const revisoesPendentes = itensRevisao.filter(item => !item.concluida);
  const revisoesHoje = revisoesPendentes.filter(item => {
    const hoje = new Date();
    return item.proximaRevisao.toDateString() === hoje.toDateString();
  });

  const diasComRevisao = itensRevisao.map(item => item.proximaRevisao);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb items={[{ label: "Revisão Estratégica" }]} />
      </div>

      <div>
        <h1 className="text-3xl font-bold">Revisão Estratégica</h1>
        <p className="text-muted-foreground mt-2">
          Sistema de revisão baseado na curva de esquecimento
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Total de Revisões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalRevisoes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Realizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.revisoesRealizadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{estatisticas.revisoesPendentes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Taxa de Cumprimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.taxaCumprimento}%</div>
            <Progress value={estatisticas.taxaCumprimento} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendário de Revisões</CardTitle>
            <CardDescription>Dias com revisões programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={dataSelecionada}
              onSelect={setDataSelecionada}
              className="rounded-md border"
              modifiers={{
                revisao: diasComRevisao,
              }}
              modifiersStyles={{
                revisao: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                  color: "#3b82f6",
                },
              }}
            />
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                Dias com revisões programadas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Revisões */}
        <div className="lg:col-span-2 space-y-4">
          {/* Revisões de Hoje */}
          {revisoesHoje.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Revisões de Hoje ({revisoesHoje.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {revisoesHoje.map((item) => {
                  const cicloInfo = getCicloInfo(item.ciclo);
                  return (
                    <div key={item.id} className="p-4 border-2 border-orange-300 bg-orange-50 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getTipoIcon(item.tipo)}
                              {getTipoLabel(item.tipo)}
                            </Badge>
                            <Badge className={cicloInfo.color}>{cicloInfo.label}</Badge>
                            <Badge variant="outline">{item.disciplina}</Badge>
                          </div>
                          <h4 className="font-semibold">{item.titulo}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Estudado em: {item.dataOriginal.toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" onClick={() => handleMarcarConcluida(item.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Concluir
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleAdiar(item.id)}>
                            <Clock className="h-4 w-4 mr-2" />
                            Adiar
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Próximas Revisões */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Revisões</CardTitle>
              <CardDescription>Revisões programadas para os próximos dias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {revisoesPendentes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma revisão pendente. Parabéns! 🎉
                </p>
              ) : (
                revisoesPendentes
                  .sort((a, b) => a.proximaRevisao.getTime() - b.proximaRevisao.getTime())
                  .map((item) => {
                    const cicloInfo = getCicloInfo(item.ciclo);
                    const isHoje = revisoesHoje.some(r => r.id === item.id);
                    
                    if (isHoje) return null; // Já mostrado na seção "Revisões de Hoje"

                    return (
                      <div key={item.id} className="p-4 border rounded-lg bg-accent">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                {getTipoIcon(item.tipo)}
                                {getTipoLabel(item.tipo)}
                              </Badge>
                              <Badge className={cicloInfo.color}>{cicloInfo.label}</Badge>
                              <Badge variant="outline">{item.disciplina}</Badge>
                            </div>
                            <h4 className="font-semibold">{item.titulo}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Próxima revisão: {item.proximaRevisao.toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </CardContent>
          </Card>

          {/* Informações sobre a Curva de Esquecimento */}
          <Card className="border-blue-300 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Como funciona a Curva de Esquecimento?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-900 space-y-2">
              <p>
                O sistema de revisão é baseado na <strong>Curva de Esquecimento de Ebbinghaus</strong>, 
                que mostra que esquecemos rapidamente o que aprendemos, mas revisões espaçadas 
                consolidam o conhecimento na memória de longo prazo.
              </p>
              <div className="mt-4 space-y-1">
                <p><strong>1º Ciclo:</strong> Revisão após 1 dia</p>
                <p><strong>2º Ciclo:</strong> Revisão após 7 dias</p>
                <p><strong>3º Ciclo:</strong> Revisão após 30 dias</p>
                <p><strong>4º Ciclo:</strong> Revisão após 90 dias</p>
              </div>
              <p className="mt-4">
                Cada vez que você revisa um conteúdo, ele avança para o próximo ciclo, 
                aumentando o intervalo até a próxima revisão. Isso otimiza seu tempo de estudo!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
