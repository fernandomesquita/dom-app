import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Breadcrumb from "@/components/Breadcrumb";
import MetaModal from "@/components/MetaModal";
import MetaAMeta from "@/components/MetaAMeta";
import CronogramaAprimorado from "@/components/CronogramaAprimorado";
import ConfigurarCronogramaModal from "@/components/ConfigurarCronogramaModal";
import { ArrowLeft, ChevronLeft, ChevronRight, Filter, Clock, Calendar as CalendarIcon, List, Settings } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ConquistaToast } from "@/components/ConquistaToast";
import { useConquistaNotification } from "@/hooks/useConquistaNotification";
import { trpc } from "@/lib/trpc";
import MensagemPosPlanoModal from "@/components/MensagemPosPlanoModal";
import { useEffect } from "react";

export default function Plano() {
  const { conquistas, mostrarConquistas, limparConquistas } = useConquistaNotification();
  const [, setLocation] = useLocation();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedMeta, setSelectedMeta] = useState<any | null>(null);
  const [metas, setMetas] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>("todas");
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(true);
  const [visualizacao, setVisualizacao] = useState<"calendario" | "lista" | "metaAMeta">("calendario");
  const [modalMensagemPosPlano, setModalMensagemPosPlano] = useState(false);
  const [planoInfo, setPlanoInfo] = useState<any>(null);
  const [modalConfigurarCronograma, setModalConfigurarCronograma] = useState(false);
  
  // Buscar metas do plano atribuído ao aluno
  const { data: minhasMetasData, isLoading: loadingMetas, refetch: refetchMetas } = trpc.metas.minhasMetas.useQuery();
  
  // Mutations
  const concluirMetaMutation = trpc.metas.concluir.useMutation({
    onSuccess: () => {
      refetchMetas();
      toast.success("Meta concluída com sucesso!");
    },
  });
  
  const pularMetaMutation = trpc.metas.pular.useMutation({
    onSuccess: () => {
      refetchMetas();
      toast.info("Meta pulada");
    },
  });
  
  const adiarMetaMutation = trpc.metas.adiar.useMutation({
    onSuccess: () => {
      refetchMetas();
      toast.info("Meta adiada");
    },
  });
  
  useEffect(() => {
    if (minhasMetasData) {
      setPlanoInfo(minhasMetasData.plano);
      // Transformar metas para formato esperado pelo componente
      const metasFormatadas = minhasMetasData.metas.map((meta: any, index: number) => ({
        id: meta.id,
        disciplina: meta.disciplina,
        assunto: meta.assunto,
        tipo: meta.tipo,
        duracao: meta.duracao,
        incidencia: meta.incidencia,
        concluida: meta.concluida || false,
        dataConclusao: meta.dataConclusao,
        tempoGasto: meta.tempoGasto,
        dicaEstudo: meta.dicaEstudo,
        orientacaoEstudos: meta.orientacaoEstudos,
        // Distribuir metas ao longo da semana (por enquanto)
        data: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        anotacao: "",
      }));
      setMetas(metasFormatadas);
    }
  }, [minhasMetasData]);
  
  // Estado para controle de tempo por dia (em minutos)
  const [temposPorDia, setTemposPorDia] = useState<Record<string, number>>({
    "2025-01-27": 240, // 4h
    "2025-01-28": 270, // 4h30
    "2025-01-29": 210, // 3h30
    "2025-01-30": 300, // 5h
    "2025-01-31": 240, // 4h
    "2025-02-01": 180, // 3h
    "2025-02-02": 120, // 2h
  });

  const getStartOfWeek = (offset: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + offset * 7);
    return monday;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

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

  const getMetasForDay = (date: Date) => {
    const dateStr = formatDateKey(date);
    return metas.filter((meta) => {
      const metaDate = new Date(meta.data);
      const metaDateStr = formatDateKey(metaDate);
      
      const tipoMatch = filtroTipo === "todos" || meta.tipo === filtroTipo;
      const disciplinaMatch = filtroDisciplina === "todas" || meta.disciplina === filtroDisciplina;
      
      return metaDateStr === dateStr && tipoMatch && disciplinaMatch;
    });
  };

  const getTotalTimeForDay = (date: Date): number => {
    const metasDay = getMetasForDay(date);
    return metasDay.reduce((total, meta) => total + meta.duracao, 0);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins.toString().padStart(2, "0")}`;
  };

  const handleTimeAdjust = (dateKey: string, newMinutes: number) => {
    setTemposPorDia(prev => ({ ...prev, [dateKey]: newMinutes }));
    toast.info(`Tempo ajustado para ${formatTime(newMinutes)}. Metas serão realocadas automaticamente.`);
  };

  const handleConcluirMeta = (id: number, tempoGasto?: number) => {
    concluirMetaMutation.mutate({
      metaId: id,
      tempoGasto,
    });
  };

  const handleNeedMoreTime = (id: number) => {
    toast.info("Meta será redistribuída de acordo com o plano");
    setSelectedMeta(null);
  };

  const handleSaveAnnotation = (id: number, annotation: string) => {
    setMetas(metas.map(meta => 
      meta.id === id ? { ...meta, anotacao: annotation } : meta
    ));
    toast.success("Anotação salva!");
  };

  const getIncidenciaIcon = (incidencia: string) => {
    switch (incidencia) {
      case "alta":
        return (
          <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-red-500" title="Incidência Alta">
            <span className="sr-only">Alta</span>
          </span>
        );
      case "media":
        return (
          <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-yellow-500" title="Incidência Média">
            <span className="sr-only">Média</span>
          </span>
        );
      case "baixa":
        return (
          <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-green-500" title="Incidência Baixa">
            <span className="sr-only">Baixa</span>
          </span>
        );
      default:
        return null; // N/A - não exibe nada
    }
  };

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

  const disciplinasUnicas = Array.from(new Set(metas.map(m => m.disciplina)));
  const metasOrdenadas = [...metas].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  if (loadingMetas) {
    return (
      <div className="container py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Breadcrumb items={[{ label: "Meu Plano de Estudos" }]} />
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando seu plano de estudos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!planoInfo) {
    return (
      <div className="container py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Breadcrumb items={[{ label: "Meu Plano de Estudos" }]} />
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold text-foreground">Nenhum plano atribuído</p>
            <p className="text-muted-foreground">Você ainda não possui um plano de estudos atribuído.</p>
            <p className="text-sm text-muted-foreground">Entre em contato com seu mentor para receber um plano.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb items={[{ label: "Meu Plano de Estudos" }]} />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Meu Plano de Estudos</h1>
        <p className="text-muted-foreground mt-2">
          Plano: <span className="font-semibold text-foreground">{planoInfo.nome || "Carregando..."}</span>
        </p>
        {planoInfo.orgao && planoInfo.cargo && (
          <p className="text-sm text-muted-foreground mt-1">
            {planoInfo.orgao} - {planoInfo.cargo}
          </p>
        )}
      </div>

      <div className="flex gap-3 mb-4">
        <Button
          onClick={() => setModalConfigurarCronograma(true)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Configurar Cronograma
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFiltrosVisiveis(!filtrosVisiveis)}
            >
              {filtrosVisiveis ? "Ocultar" : "Mostrar"}
            </Button>
          </div>
        </CardHeader>
        {filtrosVisiveis && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Atividade</label>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as Atividades</SelectItem>
                    <SelectItem value="estudo">Estudo</SelectItem>
                    <SelectItem value="revisao">Revisão</SelectItem>
                    <SelectItem value="questoes">Questões</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Disciplina</label>
                <Select value={filtroDisciplina} onValueChange={setFiltroDisciplina}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Disciplinas</SelectItem>
                    {disciplinasUnicas.map((disc) => (
                      <SelectItem key={disc} value={disc}>
                        {disc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Tabs value={visualizacao} onValueChange={(v) => setVisualizacao(v as typeof visualizacao)}>
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="calendario" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendário Semanal
          </TabsTrigger>
          <TabsTrigger value="metaAMeta" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Meta a Meta
          </TabsTrigger>
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Lista Completa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendario" className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setWeekOffset(weekOffset - 1)}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Semana Anterior
            </Button>
            <div className="text-center">
              <div className="font-semibold">
                {weekOffset === 0 ? "Semana Atual" : `Semana ${weekOffset > 0 ? "+" + weekOffset : weekOffset}`}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(getDaysOfWeek()[0])} - {formatDate(getDaysOfWeek()[6])}
              </div>
            </div>
            <Button variant="outline" onClick={() => setWeekOffset(weekOffset + 1)} disabled={weekOffset >= 3}>
              Próxima Semana
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-3">
            {getDaysOfWeek().map((day, index) => {
              const dayMetas = getMetasForDay(day);
              const dateKey = formatDateKey(day);
              const tempoTotal = getTotalTimeForDay(day);
              const tempoAlocado = temposPorDia[dateKey] || 240;
              const isToday = formatDateKey(new Date()) === dateKey;

              return (
                <div key={index} className="space-y-2">
                  <div className={`text-center p-2 rounded-lg ${isToday ? "bg-primary text-primary-foreground" : "bg-accent"}`}>
                    <div className="font-semibold text-sm">
                      {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][index]}
                    </div>
                    <div className="text-xs">{formatDate(day)}</div>
                  </div>

                  <div className="space-y-2 min-h-[200px]">
                    {dayMetas.length === 0 ? (
                      <div className="text-center text-sm text-muted-foreground p-4 border-2 border-dashed rounded-lg">
                        Sem metas
                      </div>
                    ) : (
                      dayMetas.map((meta) => (
                        <div
                          key={meta.id}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[140px] flex flex-col ${
                            meta.concluida ? "opacity-50 grayscale" : ""
                          }`}
                          style={{
                            backgroundColor: meta.cor + "20",
                            borderColor: meta.cor,
                          }}
                          onClick={() => setSelectedMeta(meta)}
                          title={meta.dicaEstudo}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <div className="font-semibold text-xs sm:text-sm line-clamp-2 break-words">{meta.assunto}</div>
                            <span className="text-sm flex-shrink-0">{getIncidenciaIcon(meta.incidencia)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2 line-clamp-1 break-words">{meta.disciplina}</div>
                          <Badge className={`text-xs w-fit ${getTipoColor(meta.tipo)}`}>
                            {getTipoLabel(meta.tipo)}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-auto pt-2 flex items-center gap-1">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">{formatTime(meta.duracao)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t pt-3 space-y-3">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Tempo alocado</div>
                      <div className="text-lg font-bold text-primary">{formatTime(tempoAlocado)}</div>
                      <div className="text-xs text-muted-foreground">
                        Usado: {formatTime(tempoTotal)}
                      </div>
                    </div>
                    
                    <div className="px-2">
                      <Slider
                        value={[tempoAlocado]}
                        onValueChange={([value]) => handleTimeAdjust(dateKey, value)}
                        min={0}
                        max={720}
                        step={15}
                        className="cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0h</span>
                        <span>12h</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progresso da Semana</CardTitle>
              <CardDescription>
                {metas.filter(m => m.concluida).length} de {metas.length} metas concluídas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                  style={{
                    width: `${(metas.filter(m => m.concluida).length / metas.length) * 100}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metaAMeta" className="space-y-4">
          <MetaAMeta 
            metas={metasOrdenadas
              .filter(meta => {
                const tipoMatch = filtroTipo === "todos" || meta.tipo === filtroTipo;
                const disciplinaMatch = filtroDisciplina === "todas" || meta.disciplina === filtroDisciplina;
                return tipoMatch && disciplinaMatch;
              })
              .map((meta, index) => ({
                ...meta,
                numero: index + 1, // Numeração sequencial
              }))}
            onMetaConcluida={handleConcluirMeta}
          />
        </TabsContent>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Metas</CardTitle>
              <CardDescription>
                Visualização completa em ordem cronológica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metasOrdenadas
                  .filter(meta => {
                    const tipoMatch = filtroTipo === "todos" || meta.tipo === filtroTipo;
                    const disciplinaMatch = filtroDisciplina === "todas" || meta.disciplina === filtroDisciplina;
                    return tipoMatch && disciplinaMatch;
                  })
                  .map((meta) => (
                    <div
                      key={meta.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        meta.concluida ? "opacity-50 grayscale" : ""
                      }`}
                      style={{
                        backgroundColor: meta.cor + "20",
                        borderColor: meta.cor,
                      }}
                      onClick={() => setSelectedMeta(meta)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{meta.assunto}</h4>
                            <span className="text-lg">{getIncidenciaIcon(meta.incidencia)}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">{meta.disciplina}</div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge className={getTipoColor(meta.tipo)}>
                              {getTipoLabel(meta.tipo)}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {new Date(meta.data).toLocaleDateString("pt-BR")}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatTime(meta.duracao)}
                            </span>
                          </div>
                          {meta.dicaEstudo && (
                            <div className="mt-2 text-sm text-muted-foreground italic">
                              💡 {meta.dicaEstudo}
                            </div>
                          )}
                        </div>
                        {meta.concluida && (
                          <Badge className="bg-green-100 text-green-800">
                            ✓ Concluída
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedMeta && (
        <MetaModal
          meta={selectedMeta}
          open={!!selectedMeta}
          onClose={() => setSelectedMeta(null)}
          onConcluir={() => handleConcluirMeta(selectedMeta.id)}
          onNeedMoreTime={() => handleNeedMoreTime(selectedMeta.id)}
          onSaveAnotacao={(metaId, anotacao) => handleSaveAnnotation(metaId, anotacao)}
        />
      )}

      <ConquistaToast conquistas={conquistas} onClose={limparConquistas} />
      
      {planoInfo && (
        <MensagemPosPlanoModal
          open={modalMensagemPosPlano}
          onClose={() => setModalMensagemPosPlano(false)}
          mensagemHtml={planoInfo.mensagemPosPlano || ""}
          link={planoInfo.linkPosPlano}
          planoNome={planoInfo.nome}
        />
      )}

      <ConfigurarCronogramaModal
        open={modalConfigurarCronograma}
        onClose={() => setModalConfigurarCronograma(false)}
        onSave={() => refetchMetas()}
        configuracaoAtual={{
          horasDiarias: 4,
          diasSemana: "1,2,3,4,5",
        }}
      />
    </div>
  );
}
