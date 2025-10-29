import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check, Clock, BookOpen, HelpCircle, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import MetaModal from "./MetaModal";

interface Meta {
  id: number;
  numero: number; // Numeração fixa do plano
  disciplina: string;
  assunto: string;
  tipo: "estudo" | "revisao" | "questoes";
  duracao: number;
  concluida: boolean;
  data: Date;
  incidencia?: "baixa" | "media" | "alta";
  prioridade?: number;
  dicaEstudo?: string;
  orientacaoEstudos?: string;
}

interface MetaAMetaProps {
  metas: Meta[];
  onMetaConcluida: (id: number) => void;
}

export default function MetaAMeta({ metas, onMetaConcluida }: MetaAMetaProps) {
  const [metaAtualIndex, setMetaAtualIndex] = useState(0);
  const [selectedMeta, setSelectedMeta] = useState<Meta | null>(null);

  // Restaurar última posição visualizada
  useEffect(() => {
    const ultimaPosicao = localStorage.getItem("ultimaMetaVisualizada");
    if (ultimaPosicao) {
      const index = parseInt(ultimaPosicao);
      if (index >= 0 && index < metas.length) {
        setMetaAtualIndex(index);
      }
    }
  }, []);

  // Persistir posição atual
  useEffect(() => {
    localStorage.setItem("ultimaMetaVisualizada", metaAtualIndex.toString());
  }, [metaAtualIndex]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && metaAtualIndex > 0) {
        setMetaAtualIndex(metaAtualIndex - 1);
      } else if (e.key === "ArrowRight" && metaAtualIndex < metas.length - 1) {
        setMetaAtualIndex(metaAtualIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [metaAtualIndex, metas.length]);

  const metaAtual = metas[metaAtualIndex];
  const metaAnterior = metaAtualIndex > 0 ? metas[metaAtualIndex - 1] : null;
  const proximaMeta = metaAtualIndex < metas.length - 1 ? metas[metaAtualIndex + 1] : null;

  const metasConcluidas = metas.filter(m => m.concluida).length;
  const progressoPercentual = Math.round((metasConcluidas / metas.length) * 100);

  // Calcular metas do dia e da semana
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const metasDoDia = metas.filter(m => {
    const metaData = new Date(m.data);
    metaData.setHours(0, 0, 0, 0);
    return metaData.getTime() === hoje.getTime();
  }).length;

  const inicioSemana = new Date(hoje);
  const diaSemana = hoje.getDay();
  const diff = diaSemana === 0 ? -6 : 1 - diaSemana;
  inicioSemana.setDate(hoje.getDate() + diff);
  
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);

  const metasDaSemana = metas.filter(m => {
    const metaData = new Date(m.data);
    metaData.setHours(0, 0, 0, 0);
    return metaData >= inicioSemana && metaData <= fimSemana;
  }).length;

  const getCorPorTipo = (tipo: string) => {
    switch (tipo) {
      case "estudo":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "revisao":
        return "bg-green-100 text-green-700 border-green-300";
      case "questoes":
        return "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case "estudo":
        return <BookOpen className="h-5 w-5" />;
      case "revisao":
        return <RotateCcw className="h-5 w-5" />;
      case "questoes":
        return <HelpCircle className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const handleProximaMeta = () => {
    if (metaAtualIndex < metas.length - 1) {
      setMetaAtualIndex(metaAtualIndex + 1);
    }
  };

  const handleMetaAnterior = () => {
    if (metaAtualIndex > 0) {
      setMetaAtualIndex(metaAtualIndex - 1);
    }
  };

  const handleConcluirMeta = () => {
    onMetaConcluida(metaAtual.id);
  };

  if (!metaAtual) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Nenhuma meta encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com contadores */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            Metas do dia: {metasDoDia}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Metas da semana: {metasDaSemana}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Meta {metaAtualIndex + 1} de {metas.length}
        </div>
      </div>

      {/* Barra de progresso geral */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progresso do Plano</span>
              <span className="text-muted-foreground">
                {metasConcluidas} / {metas.length} metas concluídas
              </span>
            </div>
            <Progress value={progressoPercentual} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Você completou {progressoPercentual}% das metas deste plano
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Visualização das metas */}
      <div className="relative">
        {/* Meta anterior (prévia com fade) */}
        {metaAnterior && (
          <div className="mb-4 opacity-30 pointer-events-none">
            <Card className={`border-2 ${getCorPorTipo(metaAnterior.tipo)}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                      {metaAnterior.numero}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{metaAnterior.disciplina}</h3>
                    <p className="text-sm text-muted-foreground truncate">{metaAnterior.assunto}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Linha de progressão */}
        {metaAnterior && (
          <div className="absolute left-6 top-20 bottom-20 w-1 bg-gradient-to-b from-gray-300 to-blue-500 -z-10"></div>
        )}

        {/* Meta atual */}
        <Card 
          className={`border-4 ${metaAtual.concluida ? 'bg-gray-50 border-gray-300' : getCorPorTipo(metaAtual.tipo)} transition-all duration-300 cursor-pointer hover:shadow-lg`}
          onClick={() => setSelectedMeta(metaAtual)}
        >
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Cabeçalho da meta */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${
                    metaAtual.concluida 
                      ? 'bg-gray-300 text-gray-600' 
                      : 'bg-white text-gray-800 border-2 border-current'
                  }`}>
                    {metaAtual.concluida ? (
                      <Check className="h-8 w-8" />
                    ) : (
                      metaAtual.numero
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getIconePorTipo(metaAtual.tipo)}
                    <Badge variant="outline" className="capitalize">
                      {metaAtual.tipo}
                    </Badge>
                    {metaAtual.concluida && (
                      <Badge className="bg-green-500">Concluída</Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-2xl mb-2">{metaAtual.disciplina}</h3>
                  <p className="text-lg text-muted-foreground mb-3">{metaAtual.assunto}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{metaAtual.duracao} min</span>
                    </div>
                    {metaAtual.incidencia && (
                      <Badge variant="secondary" className="capitalize">
                        Incidência: {metaAtual.incidencia}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMeta(metaAtual);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Ver Detalhes
                </Button>
                {!metaAtual.concluida && (
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConcluirMeta();
                    }}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Concluir Meta
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Linha de progressão para próxima */}
        {proximaMeta && (
          <div className="absolute left-6 top-[calc(100%-80px)] bottom-[-80px] w-1 bg-gradient-to-b from-blue-500 to-gray-300 -z-10"></div>
        )}

        {/* Próxima meta (prévia com fade) */}
        {proximaMeta && (
          <div className="mt-4 opacity-30 pointer-events-none">
            <Card className={`border-2 ${getCorPorTipo(proximaMeta.tipo)}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                      {proximaMeta.numero}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{proximaMeta.disciplina}</h3>
                    <p className="text-sm text-muted-foreground truncate">{proximaMeta.assunto}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Botões de navegação */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handleMetaAnterior}
          disabled={metaAtualIndex === 0}
          className="flex-1"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Meta Anterior
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleProximaMeta}
          disabled={metaAtualIndex === metas.length - 1}
          className="flex-1"
        >
          Próxima Meta
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      {/* Modal de detalhes da meta */}
      {selectedMeta && (
        <MetaModal
          open={!!selectedMeta}
          meta={selectedMeta}
          onClose={() => setSelectedMeta(null)}
          onConcluir={handleConcluirMeta}
        />
      )}
    </div>
  );
}
