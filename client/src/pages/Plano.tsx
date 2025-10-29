import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useState } from "react";

export default function Plano() {
  const { isAuthenticated } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(0);

  const { data: matriculaAtiva } = trpc.matriculas.ativa.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: metas } = trpc.metas.listByPlano.useQuery(
    { planoId: matriculaAtiva?.planoId || 0 },
    { enabled: !!matriculaAtiva }
  );

  const { data: progressos } = trpc.metas.meusProgressos.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Gera os dias da semana atual
  const getWeekDays = (weekOffset: number) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = domingo, 1 = segunda, ...
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1 + weekOffset * 7);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeek);
  const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "estudo":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "revisao":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "questoes":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getIncidenciaIcon = (incidencia?: string) => {
    switch (incidencia) {
      case "alta":
        return "🔥";
      case "media":
        return "⚡";
      case "baixa":
        return "💧";
      default:
        return "";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Faça login para acessar seu plano de estudos.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!matriculaAtiva) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Nenhum Plano Ativo</CardTitle>
            <CardDescription>
              Você ainda não está matriculado em nenhum plano de estudos.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meu Plano de Estudos</h1>
          <p className="text-muted-foreground mt-2">
            Visualize e acompanhe suas metas semanais
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(currentWeek - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentWeek(0)}>
            Semana Atual
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(currentWeek + 1)}
            disabled={currentWeek >= 4}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Informações da Semana */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Semana de {weekDays[0].toLocaleDateString("pt-BR")} a{" "}
                {weekDays[6].toLocaleDateString("pt-BR")}
              </CardTitle>
              <CardDescription className="mt-2">
                Horas previstas de estudos nesta semana: {matriculaAtiva.horasDiarias * 5}h
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendário Semanal */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const isToday = day.toDateString() === new Date().toDateString();
          const isPast = day < new Date() && !isToday;

          return (
            <div key={index} className="space-y-2">
              {/* Cabeçalho do Dia */}
              <div
                className={`text-center p-3 rounded-lg ${
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : isPast
                      ? "bg-muted text-muted-foreground"
                      : "bg-card border border-border"
                }`}
              >
                <div className="font-semibold">{dayNames[index]}</div>
                <div className="text-sm">{day.getDate()}/{day.getMonth() + 1}</div>
              </div>

              {/* Metas do Dia - Exemplo estático */}
              <div className="space-y-2">
                {index < 5 && metas && metas.slice(0, 2).map((meta, metaIndex) => (
                  <Card
                    key={metaIndex}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${getTipoColor(meta.tipo)}`}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className="font-semibold text-sm">{meta.disciplina}</div>
                      <div className="text-xs">{meta.assunto}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {meta.duracao}min
                        </span>
                        {meta.incidencia && (
                          <span>{getIncidenciaIcon(meta.incidencia)}</span>
                        )}
                      </div>
                      <div className="text-xs font-medium uppercase">{meta.tipo}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
              <span className="text-sm">Estudo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300"></div>
              <span className="text-sm">Revisão</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
              <span className="text-sm">Questões</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <span className="text-sm">Alta Incidência</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span className="text-sm">Média Incidência</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">💧</span>
              <span className="text-sm">Baixa Incidência</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
