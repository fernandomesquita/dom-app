import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import MetaModal from "@/components/MetaModal";
import { Calendar, ChevronLeft, ChevronRight, Clock, Filter, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { mockMetas, mockMatricula, mockPlanos } from "@/lib/mockData";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Plano() {
  const [, setLocation] = useLocation();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedMeta, setSelectedMeta] = useState<typeof mockMetas[0] | null>(null);
  const [metasConcluidas, setMetasConcluidas] = useState<Set<number>>(new Set());
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [filtroDisciplina, setFiltroDisciplina] = useState<string | null>(null);
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(true);

  const matricula = mockMatricula;
  const metas = mockMetas;
  const plano = mockPlanos.find(p => p.id === matricula.planoId);

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

  // Distribui metas pelos dias da semana (simulação)
  const distribuirMetasPorDia = () => {
    const metasPorDia: { [key: number]: typeof mockMetas } = {};
    
    metas.forEach((meta, index) => {
      const diaIndex = index % 5; // Distribui de segunda a sexta
      if (!metasPorDia[diaIndex]) {
        metasPorDia[diaIndex] = [];
      }
      metasPorDia[diaIndex].push(meta);
    });
    
    return metasPorDia;
  };

  const metasPorDia = distribuirMetasPorDia();

  const getTipoColor = (tipo: string, concluida: boolean = false) => {
    if (concluida) {
      return "bg-gray-100 text-gray-500 border-gray-300 opacity-50";
    }
    switch (tipo) {
      case "estudo":
        return "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100";
      case "revisao":
        return "bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100";
      case "questoes":
        return "bg-green-50 text-green-900 border-green-200 hover:bg-green-100";
      default:
        return "bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100";
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

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "estudo":
        return "Estudo";
      case "revisao":
        return "Revisão";
      case "questoes":
        return "Questões";
      default:
        return tipo;
    }
  };

  const handleConcluirMeta = () => {
    if (selectedMeta) {
      setMetasConcluidas(prev => {
        const newSet = new Set(prev);
        newSet.add(selectedMeta.id);
        return newSet;
      });
      toast.success("Meta concluída com sucesso! 🎉");
    }
  };

  const handleNeedMoreTime = () => {
    if (selectedMeta) {
      toast.info("Meta reagendada para redistribuição automática");
      // TODO: Implementar lógica de redistribuição
    }
  };

  // Filtragem
  const metasFiltradas = metas.filter(meta => {
    if (filtroTipo && meta.tipo !== filtroTipo) return false;
    if (filtroDisciplina && meta.disciplina !== filtroDisciplina) return false;
    return true;
  });

  const disciplinasUnicas = Array.from(new Set(metas.map(m => m.disciplina)));
  const tiposUnicos = Array.from(new Set(metas.map(m => m.tipo)));

  // Calcula progresso
  const metasConcluidasSemana = metasFiltradas.filter(m => metasConcluidas.has(m.id)).length;
  const totalMetasSemana = metasFiltradas.length;
  const progressoSemana = totalMetasSemana > 0 ? (metasConcluidasSemana / totalMetasSemana) * 100 : 0;

  return (
    <div className="container py-8 space-y-6">
      {/* Breadcrumb e Botão Voltar */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb items={[{ label: "Plano de Estudos" }]} />
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meu Plano de Estudos</h1>
          {plano && (
            <p className="text-lg font-semibold text-primary mt-1">
              {plano.nome}
            </p>
          )}
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

      {/* Informações da Semana e Progresso */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Semana de {weekDays[0].toLocaleDateString("pt-BR")} a{" "}
                {weekDays[6].toLocaleDateString("pt-BR")}
              </CardTitle>
              <CardDescription className="mt-2">
                Horas previstas: {matricula.horasDiarias * 5}h | 
                Metas concluídas: {metasConcluidasSemana} de {totalMetasSemana}
              </CardDescription>
            </div>
            <div className="w-full lg:w-64">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-semibold">{Math.round(progressoSemana)}%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500" 
                  style={{ width: `${progressoSemana}%` }}
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtros</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFiltrosVisiveis(!filtrosVisiveis)}
            >
              {filtrosVisiveis ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Ocultar
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Mostrar
                </>
              )}
            </Button>
          </div>
          {filtrosVisiveis && (
          <div className="flex items-center gap-2 flex-wrap">
            
            <Button
              variant={filtroTipo === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltroTipo(null)}
            >
              Todos
            </Button>
            
            {tiposUnicos.map(tipo => (
              <Button
                key={tipo}
                variant={filtroTipo === tipo ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroTipo(tipo)}
              >
                {getTipoLabel(tipo)}
              </Button>
            ))}

            <div className="w-px h-6 bg-border mx-2" />

            {disciplinasUnicas.map(disciplina => (
              <Button
                key={disciplina}
                variant={filtroDisciplina === disciplina ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroDisciplina(filtroDisciplina === disciplina ? null : disciplina)}
              >
                {disciplina}
              </Button>
            ))}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Calendário Semanal */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const isToday = day.toDateString() === new Date().toDateString();
          const isPast = day < new Date() && !isToday;
          const metasDoDia = metasPorDia[index] || [];
          const metasFiltradasDia = metasDoDia.filter(meta => {
            if (filtroTipo && meta.tipo !== filtroTipo) return false;
            if (filtroDisciplina && meta.disciplina !== filtroDisciplina) return false;
            return true;
          });

          return (
            <div key={index} className="space-y-2">
              {/* Cabeçalho do Dia */}
              <div
                className={`text-center p-3 rounded-lg transition-all ${
                  isToday
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : isPast
                      ? "bg-muted text-muted-foreground"
                      : "bg-card border border-border"
                }`}
              >
                <div className="font-semibold">{dayNames[index]}</div>
                <div className="text-sm">{day.getDate()}/{day.getMonth() + 1}</div>
              </div>

              {/* Metas do Dia */}
              <div className="space-y-2 min-h-[200px]">
                {metasFiltradasDia.map((meta) => {
                  const concluida = metasConcluidas.has(meta.id);
                  return (
                    <Card
                      key={meta.id}
                      className={`cursor-pointer transition-all border-2 ${getTipoColor(meta.tipo, concluida)} ${
                        concluida ? "scale-95" : "hover:scale-105 hover:shadow-lg"
                      }`}
                      onClick={() => setSelectedMeta(meta)}
                    >
                      <CardContent className="p-3 space-y-2">
                        {concluida && (
                          <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                            ✓ Concluída
                          </div>
                        )}
                        <div className="font-semibold text-sm line-clamp-1">{meta.disciplina}</div>
                        <div className="text-xs line-clamp-2 opacity-90">{meta.assunto}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 opacity-75">
                            <Clock className="h-3 w-3" />
                            {meta.duracao}min
                          </span>
                          {meta.incidencia && (
                            <span className="text-base">{getIncidenciaIcon(meta.incidencia)}</span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getTipoLabel(meta.tipo)}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-50 border-2 border-blue-200"></div>
              <span className="text-sm">Estudo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-50 border-2 border-purple-200"></div>
              <span className="text-sm">Revisão</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-50 border-2 border-green-200"></div>
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

      {/* Modal de Detalhes da Meta */}
      <MetaModal
        meta={selectedMeta}
        open={!!selectedMeta}
        onClose={() => setSelectedMeta(null)}
        onConcluir={handleConcluirMeta}
        onNeedMoreTime={handleNeedMoreTime}
      />
    </div>
  );
}
