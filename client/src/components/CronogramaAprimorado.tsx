import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimerEstudo from "./TimerEstudo";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

interface Meta {
  id: number;
  disciplina: string;
  assunto: string;
  tipo: "estudo" | "revisao" | "questoes";
  duracao: number;
  incidencia: "baixa" | "media" | "alta" | null;
  data: string; // YYYY-MM-DD
  concluida: boolean;
  tempoGasto?: number;
  cor?: string | null;
  dicaEstudo?: string | null;
}

interface CronogramaAprimoradoProps {
  metas: Meta[];
  onConcluirMeta: (metaId: number, tempoGasto: number) => void;
  onPularMeta: (metaId: number) => void;
  onAdiarMeta: (metaId: number) => void;
  onRefetch: () => void;
}

export default function CronogramaAprimorado({
  metas,
  onConcluirMeta,
  onPularMeta,
  onAdiarMeta,
  onRefetch,
}: CronogramaAprimoradoProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [visualizacao, setVisualizacao] = useState<"semana" | "dia" | "mes">("semana");
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>("todas");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [metaEmEstudo, setMetaEmEstudo] = useState<Meta | null>(null);

  // Calcular início da semana
  const getStartOfWeek = (offset: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + offset * 7);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  // Obter dias da semana
  const getDaysOfWeek = () => {
    const startDate = getStartOfWeek(weekOffset);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Formatar data
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { weekday: "short" });
  };

  // Filtrar metas
  const metasFiltradas = useMemo(() => {
    return metas.filter((meta) => {
      const matchDisciplina =
        filtroDisciplina === "todas" || meta.disciplina === filtroDisciplina;
      const matchTipo = filtroTipo === "todos" || meta.tipo === filtroTipo;
      return matchDisciplina && matchTipo;
    });
  }, [metas, filtroDisciplina, filtroTipo]);

  // Obter metas por dia
  const getMetasForDay = (date: Date) => {
    const dateStr = formatDateKey(date);
    return metasFiltradas.filter((meta) => meta.data === dateStr);
  };

  // Disciplinas únicas
  const disciplinas = useMemo(() => {
    return [...new Set(metas.map((m) => m.disciplina))];
  }, [metas]);

  // Estatísticas
  const estatisticas = useMemo(() => {
    const total = metasFiltradas.length;
    const concluidas = metasFiltradas.filter((m) => m.concluida).length;
    const pendentes = total - concluidas;
    const horasTotal = metasFiltradas.reduce((sum, m) => sum + m.duracao, 0) / 60;
    const horasConcluidas =
      metasFiltradas
        .filter((m) => m.concluida)
        .reduce((sum, m) => sum + (m.tempoGasto || m.duracao), 0) / 60;

    return {
      total,
      concluidas,
      pendentes,
      horasTotal,
      horasConcluidas,
      percentualConcluido: total > 0 ? (concluidas / total) * 100 : 0,
    };
  }, [metasFiltradas]);

  // Handlers
  const handleConcluirMeta = (metaId: number, tempoGasto: number) => {
    onConcluirMeta(metaId, tempoGasto);
    setMetaEmEstudo(null);
    toast.success("Meta concluída com sucesso!");
    onRefetch();
  };

  const handlePularMeta = (metaId: number) => {
    onPularMeta(metaId);
    setMetaEmEstudo(null);
    toast.info("Meta pulada");
    onRefetch();
  };

  const handleAdiarMeta = (metaId: number) => {
    onAdiarMeta(metaId);
    setMetaEmEstudo(null);
    toast.info("Meta adiada para amanhã");
    onRefetch();
  };

  const handleIniciarEstudo = (meta: Meta) => {
    if (meta.concluida) {
      toast.error("Esta meta já foi concluída");
      return;
    }
    setMetaEmEstudo(meta);
  };

  const getTipoBadge = (tipo: string) => {
    const badges = {
      estudo: { label: "Estudo", className: "bg-blue-100 text-blue-800" },
      revisao: { label: "Revisão", className: "bg-green-100 text-green-800" },
      questoes: { label: "Questões", className: "bg-orange-100 text-orange-800" },
    };
    return badges[tipo as keyof typeof badges] || badges.estudo;
  };

  const daysOfWeek = getDaysOfWeek();
  const today = formatDateKey(new Date());

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {estatisticas.concluidas}/{estatisticas.total}
              </p>
              <p className="text-sm text-gray-600">Metas Concluídas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {estatisticas.pendentes}
              </p>
              <p className="text-sm text-gray-600">Metas Pendentes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {estatisticas.horasConcluidas.toFixed(1)}h
              </p>
              <p className="text-sm text-gray-600">
                de {estatisticas.horasTotal.toFixed(1)}h
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {estatisticas.percentualConcluido.toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600">Progresso</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Navegação */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Navegação de Semana */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setWeekOffset(weekOffset - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="text-center min-w-[200px]">
                <p className="font-semibold">
                  {formatDate(daysOfWeek[0])} - {formatDate(daysOfWeek[6])}
                </p>
                <p className="text-sm text-gray-500">
                  {weekOffset === 0 ? "Esta semana" : `Semana ${weekOffset > 0 ? "+" : ""}${weekOffset}`}
                </p>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setWeekOffset(weekOffset + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              {weekOffset !== 0 && (
                <Button variant="outline" onClick={() => setWeekOffset(0)}>
                  Hoje
                </Button>
              )}
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <Select value={filtroDisciplina} onValueChange={setFiltroDisciplina}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as disciplinas</SelectItem>
                  {disciplinas.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="estudo">Estudo</SelectItem>
                  <SelectItem value="revisao">Revisão</SelectItem>
                  <SelectItem value="questoes">Questões</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timer de Estudo (se houver meta em estudo) */}
      {metaEmEstudo && (
        <TimerEstudo
          metaId={metaEmEstudo.id}
          disciplina={metaEmEstudo.disciplina}
          assunto={metaEmEstudo.assunto}
          duracaoMinutos={metaEmEstudo.duracao}
          tipo={metaEmEstudo.tipo}
          onConcluir={(tempoGasto) => handleConcluirMeta(metaEmEstudo.id, tempoGasto)}
          onPular={() => handlePularMeta(metaEmEstudo.id)}
          onAdiar={() => handleAdiarMeta(metaEmEstudo.id)}
        />
      )}

      {/* Cronograma Semanal */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {daysOfWeek.map((day, index) => {
          const metasDoDia = getMetasForDay(day);
          const dateKey = formatDateKey(day);
          const isToday = dateKey === today;
          const isPast = new Date(dateKey) < new Date(today);

          return (
            <Card
              key={index}
              className={`${isToday ? "border-2 border-blue-500" : ""} ${
                isPast ? "bg-gray-50" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className={isToday ? "text-blue-600 font-bold" : ""}>
                    {formatDayName(day).toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(day)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {metasDoDia.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">
                    Sem metas
                  </p>
                ) : (
                  metasDoDia.map((meta) => {
                    const tipoBadge = getTipoBadge(meta.tipo);
                    return (
                      <div
                        key={meta.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow ${
                          meta.concluida
                            ? "bg-green-50 border-green-200"
                            : "bg-white border-gray-200"
                        }`}
                        style={{
                          backgroundColor: meta.concluida
                            ? undefined
                            : meta.cor || undefined,
                        }}
                        onClick={() => !meta.concluida && handleIniciarEstudo(meta)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={tipoBadge.className} variant="secondary">
                            {tipoBadge.label}
                          </Badge>
                          {meta.concluida ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                          {meta.disciplina}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                          {meta.assunto}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {meta.duracao} min
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
